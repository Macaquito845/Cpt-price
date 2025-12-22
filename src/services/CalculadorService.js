class CalculadorService {
  static cotizar({ puerto_origen, via, peso, volumen, tarifas_vigentes }) {
    const tarifaBase = this._encontrarMejorTarifa(puerto_origen, via, tarifas_vigentes);
    if (!tarifaBase) throw new Error('No hay tarifa vigente para esta ruta');

    const pesoFacturable = this._calcularPesoFacturable(peso, volumen);
    const fleteBase = tarifaBase.flete_total_wm * pesoFacturable;
    const fleteConRebate = this._aplicarRebate(fleteBase, tarifaBase.rebate);

    const surcharges = {
      eu_ets: tarifaBase.eu_ets || 0,
      panama_surcharge: tarifaBase.panama_surcharge || 0,
      imo_2020: tarifaBase.imo_2020 || 0,
      pss: tarifaBase.pss || 0
    };

    const totalSurcharges = Object.values(surcharges).reduce((sum, val) => sum + (val * pesoFacturable), 0);
    const precioVentaSugerido = this._sugerirPrecioVenta(fleteConRebate + totalSurcharges, tarifaBase.venta_excel);

    return {
      tarifaBase,
      pesoFacturable,
      fleteBase,
      fleteConRebate,
      surcharges,
      totalSurcharges,
      precioVentaSugerido,
      margen: ((precioVentaSugerido - (fleteConRebate + totalSurcharges)) / precioVentaSugerido) * 100
    };
  }

  static _encontrarMejorTarifa(puerto_origen, via, tarifas) {
    return tarifas
      .filter(t => t.puerto_origen.toLowerCase().includes(puerto_origen.toLowerCase()))
      .filter(t => t.via.toLowerCase().includes(via.toLowerCase()))
      .filter(t => new Date() >= new Date(t.valido_desde) && (!t.valido_hasta || new Date() <= new Date(t.valido_hasta)))
      .sort((a, b) => b.flete_total_wm - a.flete_total_wm)[0];
  }

  static _calcularPesoFacturable(peso, volumen) {
    const pesoVolumen = volumen * 1000;
    return Math.max(peso, pesoVolumen, 1);
  }

  static _aplicarRebate(flete, rebate) {
    return flete * (1 - rebate);
  }

  static _sugerirPrecioVenta(costoTotal, precioExcel = null) {
    const margenBase = 0.35;
    const precioSugerido = costoTotal / (1 - margenBase);
    if (precioExcel) return Math.max(precioSugerido, precioExcel);
    return Math.ceil(precioSugerido / 10) * 10;
  }
}

module.exports = CalculadorService;
