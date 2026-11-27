export type ReplenishmentInput = {
  unidadesVendidas30d: number;
  stockActual: number;
  stockEnTransito: number;
  plazoEntregaDias: number;
  stockSeguridad: number;
  loteCompra: number;
  diasCobertura?: number;
};

export type ReplenishmentResult = {
  demandaDiaria: number;
  posicion: number;
  puntoReorden: number;
  debeReponer: boolean;
  cantidadBruta: number;
  cantidadSugerida: number;
  motivo: string;
};

const DEFAULT_COVERAGE_DAYS = 14;

export function calcularReposicion(
  input: ReplenishmentInput,
): ReplenishmentResult {
  const diasCobertura = input.diasCobertura ?? DEFAULT_COVERAGE_DAYS;
  const demandaDiaria = input.unidadesVendidas30d / 30;
  const posicion = input.stockActual + input.stockEnTransito;
  const puntoReorden =
    demandaDiaria * input.plazoEntregaDias + input.stockSeguridad;
  const debeReponer = posicion <= puntoReorden;

  if (!debeReponer) {
    return {
      demandaDiaria,
      posicion,
      puntoReorden,
      debeReponer: false,
      cantidadBruta: 0,
      cantidadSugerida: 0,
      motivo: `posición (${posicion}) > punto de reorden (${puntoReorden}); no reponer`,
    };
  }

  const cantidadBruta =
    demandaDiaria * (input.plazoEntregaDias + diasCobertura) +
    input.stockSeguridad -
    posicion;

  const lote = Math.max(1, input.loteCompra);
  const cantidadSugerida =
    cantidadBruta > 0 ? Math.ceil(cantidadBruta / lote) * lote : 0;

  return {
    demandaDiaria,
    posicion,
    puntoReorden,
    debeReponer: true,
    cantidadBruta,
    cantidadSugerida,
    motivo:
      cantidadSugerida > 0
        ? `posición (${posicion}) ≤ punto de reorden (${puntoReorden}); lote ${lote} → ${cantidadSugerida}`
        : `posición (${posicion}) ≤ punto de reorden (${puntoReorden}); cantidad bruta ≤ 0`,
  };
}
