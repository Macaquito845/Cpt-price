const XLSX = require('xlsx');
const _ = require('lodash');

class ImportadorService {
  static parseTarifasExcel(buffer) {
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { 
      header: 1, 
      raw: false 
    });
    
    return this._normalizarTarifas(jsonData);
  }

  static _normalizarTarifas(rows) {
    const headers = rows[0];
    const data = rows.slice(1).filter(row => row.length > 3);
    
    return data.map((row, index) => {
      const puertoOrigenIdx = headers.findIndex(h => h?.toLowerCase().includes('origen'));
      const viaIdx = headers.findIndex(h => h?.toLowerCase().includes('via') || h?.toLowerCase().includes('destino'));
      const fleteIdx = headers.findIndex(h => h?.toLowerCase().includes('ofr') || h?.toLowerCase().includes('flete'));
      const rebateIdx = headers.findIndex(h => h?.toLowerCase().includes('rebate') || h?.toLowerCase().includes('inversión'));
      
      return {
        puerto_origen: row[puertoOrigenIdx] || '',
        via: row[viaIdx] || '',
        flete_total_wm: this._parseDecimal(row[fleteIdx] || 0),
        rebate: this._parseDecimal(row[rebateIdx] || 0),
        venta_excel: this._parseDecimal(row[headers.findIndex(h => h?.toLowerCase().includes('venta'))] || 0),
        valido_desde: this._parseDate(row[headers.findIndex(h => h?.toLowerCase().includes('desde'))]),
        valido_hasta: this._parseDate(row[headers.findIndex(h => h?.toLowerCase().includes('hasta'))]),
        fila: index + 2
      };
    }).filter(tarifa => tarifa.flete_total_wm > 0);
  }

  static _parseDecimal(value) {
    if (!value) return 0;
    return parseFloat(value.toString().replace(/[^\d.,]/g, '').replace(',', '.')) || 0;
  }

  static _parseDate(value) {
    if (!value) return null;
    return new Date(value).toISOString().split('T')[0];
  }

  static validarTarifasImportadas(tarifas) {
    const errores = [];
    tarifas.forEach((tarifa, idx) => {
      if (!tarifa.puerto_origen?.trim()) {
        errores.push(`Fila ${tarifa.fila}: Puerto origen requerido`);
      }
      if (tarifa.flete_total_wm <= 0) {
        errores.push(`Fila ${tarifa.fila}: Flete debe ser > 0`);
      }
    });
    return { validas: tarifas.length - errores.length, total: tarifas.length, errores };
  }
}

module.exports = ImportadorService;
