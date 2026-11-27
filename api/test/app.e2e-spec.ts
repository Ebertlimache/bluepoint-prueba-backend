import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { ConsistentExceptionFilter } from '../src/common/http-exception.filter';
import { PrismaService } from '../src/prisma/prisma.service';

describe('API e2e', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    app.useGlobalFilters(new ConsistentExceptionFilter());
    await app.init();
    prisma = app.get(PrismaService);
  });

  afterAll(async () => {
    await app.close();
  });

  it('ejemplo de sugerencia → 168 y aislamiento entre empresas', async () => {
    const ok = await request(app.getHttpServer())
      .get('/sugerencias-reposicion')
      .set('X-Empresa-Id', 'emp-a')
      .query({ almacenId: 'alm-a1', fechaCorte: '2026-11-26' })
      .expect(200);

    expect(ok.body.sugerencias[0].cantidadSugerida).toBe(168);

    await request(app.getHttpServer())
      .get('/stock')
      .set('X-Empresa-Id', 'emp-b')
      .query({ productoId: 'prod-a1', almacenId: 'alm-a1' })
      .expect(404);
  });

  it('ventas concurrentes no dejan stock negativo', async () => {
    await prisma.productoAlmacen.updateMany({
      where: { productoId: 'prod-a1', almacenId: 'alm-a1' },
      data: { stockActual: 5 },
    });

    const calls = [1, 2, 3, 4, 5, 6].map((i) =>
      request(app.getHttpServer())
        .post('/movimientos')
        .set('X-Empresa-Id', 'emp-a')
        .set('Idempotency-Key', `conc-${Date.now()}-${i}`)
        .send({
          productoId: 'prod-a1',
          almacenId: 'alm-a1',
          tipo: 'VENTA',
          cantidad: 2,
        }),
    );

    const results = await Promise.all(calls);
    const success = results.filter((r) => r.status === 200);
    const conflicts = results.filter((r) => r.status === 409);
    expect(success.length + conflicts.length).toBe(6);
    expect(success.length).toBeLessThanOrEqual(2);

    const stock = await prisma.productoAlmacen.findFirst({
      where: { productoId: 'prod-a1', almacenId: 'alm-a1' },
    });
    expect(stock!.stockActual).toBeGreaterThanOrEqual(0);
    expect(stock!.stockActual).toBeLessThanOrEqual(5);
  });
});
