import { calcularReposicion } from './replenishment.calculator';

describe('calcularReposicion (ejemplo del enunciado)', () => {
  it('demanda 10, punto 90, posición 70, sugerida 168', () => {
    const r = calcularReposicion({
      unidadesVendidas30d: 300,
      stockActual: 50,
      stockEnTransito: 20,
      plazoEntregaDias: 7,
      stockSeguridad: 20,
      loteCompra: 24,
      diasCobertura: 14,
    });

    expect(r.demandaDiaria).toBe(10);
    expect(r.posicion).toBe(70);
    expect(r.puntoReorden).toBe(90);
    expect(r.debeReponer).toBe(true);
    expect(r.cantidadBruta).toBe(160);
    expect(r.cantidadSugerida).toBe(168);
  });

  it('no sugiere si posición > punto de reorden', () => {
    const r = calcularReposicion({
      unidadesVendidas30d: 30,
      stockActual: 500,
      stockEnTransito: 0,
      plazoEntregaDias: 7,
      stockSeguridad: 20,
      loteCompra: 24,
    });
    expect(r.debeReponer).toBe(false);
    expect(r.cantidadSugerida).toBe(0);
  });
});
