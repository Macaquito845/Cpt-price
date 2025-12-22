const Importador = require('../src/services/ImportadorService');
const Calculador = require('../src/services/CalculadorService');
const Validador = require('../src/services/ValidadorService');

describe('Core Services', () => {
  test('Calculador encuentra tarifa y calcula correctamente', () => {
    const tarifasMock = [{
      puerto_origen: 'Buenaventura',
      via: 'Europa',
      flete_total_wm: 120,
      rebate: 0.15,
      venta_excel: 200,
      valido_desde: '2025-01-01'
    }];

    const cotizacion = Calculador.cotizar({
      puerto_origen: 'Buenaventura',
      via: 'Europa',
      peso: 1000,
      volumen: 2,
      tarifas_vigentes: tarifasMock
    });

    expect(cotizacion.fleteBase).toBe(240000);
    expect(cotizacion.margen).toBeGreaterThan(30);
  });

  test('Validador detecta alertas correctamente', () => {
    const cotizacionMock = {
      pesoFacturable: 20000,
      margen: 10,
      totalSurcharges: 1000,
      fleteBase: 2000
    };

    const validacion = Validador.validarCotizacion(cotizacionMock);
    expect(validacion.alertas.length).toBeGreaterThan(1);
  });
});
