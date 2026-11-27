import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';

export const EmpresaId = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string => {
    const req = ctx.switchToHttp().getRequest<{ headers: Record<string, string> }>();
    const raw =
      req.headers['x-empresa-id'] ?? req.headers['X-Empresa-Id'];
    const value = Array.isArray(raw) ? raw[0] : raw;
    if (!value || !String(value).trim()) {
      throw new BadRequestException({
        code: 'EMPRESA_ID_REQUERIDO',
        message: 'Cabecera X-Empresa-Id es obligatoria',
      });
    }
    return String(value).trim();
  },
);
