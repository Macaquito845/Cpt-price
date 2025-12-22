class ValidadorService {
  static validarCotizacion(cotizacion) {
    const alertas = [];
    if (cotizacion.pesoFacturable > 15000) alertas.push('⚠️ Peso > 15Ton - Consultar equipo especial');
    if (cotizacion.margen < 15) alertas.push('🔴 Margen < 15% - Revisar competitividad');
    if (cotizacion.margen > 60) alertas.push('🟡 Margen > 60% - Posible oportunidad');
    const surchargesTotal = cotizacion.totalSurcharges;
    if (surchargesTotal > cotizacion.fleteBase * 0.3) alertas.push('⚠️ Surcharges > 30% flete base');

    return {
      esValida: alertas.length === 0,
      alertas,
      severidad: this._calcularSeveridad(alertas)
    };
  }

  static validarInputCotizacion({ peso, volumen, puerto_origen, via }) {
    const errores = [];
    if (!puerto_origen?.trim()) errores.push('Puerto origen requerido');
    if (!via?.trim()) errores.push('Destino requerido');
    if (peso <= 0 || peso > 30000) errores.push('Peso entre 1kg-30Ton');
    if (volumen <= 0 || volumen > 50) errores.push('Volumen entre 0.001-50 CBM');
    return { esValida: errores.length === 0, errores };
  }

  static _calcularSeveridad(alertas) {
    const criticas = alertas.filter(a => a.includes('🔴')).length;
    const warnings = alertas.filter(a => a.includes('⚠️')).length;
    if (criticas > 0) return 'CRITICA';
    if (warnings > 1) return 'ALTA';
    return 'BAJA';
  }
}

module.exports = ValidadorService;
