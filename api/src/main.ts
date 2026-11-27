import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ConsistentExceptionFilter } from './common/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalFilters(new ConsistentExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle('API Reposición de Inventario')
    .setDescription('Prueba técnica Bluepoint AI — Back-end Semi-senior')
    .setVersion('1.0')
    .addApiKey(
      { type: 'apiKey', name: 'X-Empresa-Id', in: 'header' },
      'empresa',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const port = Number(process.env.PORT ?? 3000);
  await app.listen(port);
  console.log(`API http://localhost:${port}  Swagger /docs`);
}
bootstrap();
