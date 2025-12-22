const express = require('express');
const cors = require('cors');
const Importador = require('./services/ImportadorService');
const Calculador = require('./services/CalculadorService');
const Validador = require('./services/ValidadorService');

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// 🌍 TARIFAS REALES LATAM→Europa (de tu Excel)
const tarifasReales = [
  {puerto_origen: 'Buenaventura', via: 'Milano/Genova', flete_total_wm: 156, rebate: 0.12, venta_excel: 240, eu_ets: 5, panama_surcharge: 8, imo_2020: 12, pss: 15, valido_desde: '2025-01-01'},
  {puerto_origen: 'Guayaquil', via: 'Hamburg', flete_total_wm: 189, rebate: 0.10, venta_excel: 290, eu_ets: 6, panama_surcharge: 9, imo_2020: 14, pss: 18, valido_desde: '2025-01-01'},
  {puerto_origen: 'Manzanillo', via: 'Antwerp', flete_total_wm: 145, rebate: 0.15, venta_excel: 225, eu_ets: 4, panama_surcharge: 7, imo_2020: 11, pss: 13, valido_desde: '2025-01-01'},
  {puerto_origen: 'Buenaventura', via: 'Europa', flete_total_wm: 120, rebate: 0.15, venta_excel: 200, eu_ets: 5, panama_surcharge: 8, imo_2020: 12, pss: 15, valido_desde: '2025-01-01'}
];

// 📊 COTIZADOR PRINCIPAL
app.post('/api/cotizar', (req, res) => {
  try {
    const { puerto_origen, via, peso, volumen } = req.body;
    
    const validacionInput = Validador.validarInputCotizacion({ puerto_origen, via, peso, volumen });
    if (!validacionInput.esValida) {
      return res.status(400).json({ error: 'Datos inválidos', detalles: validacionInput.errores });
    }

    const resultadoCotizacion = Calculador.cotizar({
      puerto_origen, via, peso, volumen, tarifas_vigentes: tarifasReales
    });

    const validacionCotizacion = Validador.validarCotizacion(resultadoCotizacion);

    res.json({ 
      exito: true, 
      cotizacion: resultadoCotizacion, 
      validacion: validacionCotizacion 
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 📁 IMPORTAR EXCEL (SIMULADO)
app.post('/api/tarifas/import', (req, res) => {
  console.log('📊 Import Excel recibido');
  res.json({
    exito: true,
    totalTarifas: tarifasReales.length,
    validas: tarifasReales.length,
    tarifasParseadas: tarifasReales.slice(0, 3),
    mensaje: "✅ Tarifas REALES LATAM→Europa/USA cargadas"
  });
});

// 📋 LISTAR TARIFAS
app.get('/api/tarifas', (req, res) => {
  res.json({ tarifas_vigentes: tarifasReales });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🚀 API en http://localhost:${PORT}`);
  console.log(`📊 POST /api/cotizar ← Tarifas REALES listas`);
  console.log(`Ejemplo: Buenaventura → Milano/Genova (156 USD/WM)`);
});
