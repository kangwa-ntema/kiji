// 01_Utils.gs

// ============================================
// UTILITIES
// ============================================

function getSpreadsheet() {
  if (CONFIG.SPREADSHEET_ID && CONFIG.SPREADSHEET_ID !== '') {
    return SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
  }
  return SpreadsheetApp.getActiveSpreadsheet();
}

function generateId() {
  return 'ID_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
}

function formatPhoneNumber(phone) {
  if (!phone) return '';
  let phoneStr = phone.toString();
  if (phoneStr.match(/^\d{12}$/)) {
    phoneStr = '+' + phoneStr;
  }
  return phoneStr;
}

function safeParseNumber(value, defaultValue = 0) {
  if (value === undefined || value === null || value === '') return defaultValue;
  if (typeof value === 'number') return value;
  const parsed = parseFloat(value);
  return isNaN(parsed) ? defaultValue : parsed;
}

function safeParseDate(dateValue) {
  if (!dateValue) return '';
  if (dateValue instanceof Date) return dateValue.toISOString().split('T')[0];
  return dateValue.toString().split('T')[0];
}