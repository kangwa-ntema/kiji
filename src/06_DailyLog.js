// 06_DailyLog.gs

// ============================================
// DAILY LOG MANAGEMENT
// ============================================

function getDailyLogSheet() {
  const ss = getSpreadsheet();
  let sheet = ss.getSheetByName(CONFIG.DATA_SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(CONFIG.DATA_SHEET_NAME);
    const headers = ['ID', 'Date', 'Type', 'Metric ID', 'Metric Name', 'Actual', 'Target', 'Progress %', 'Notes', 'Created At', 'Updated At'];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function getTodayEntries() {
  try {
    const sheet = getDailyLogSheet();
    const data = sheet.getDataRange().getValues();
    const today = new Date().toISOString().split('T')[0];
    const entries = [];
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const entryDate = row[1] ? row[1].toString().split('T')[0] : '';
      if (entryDate === today && row[0] && row[0].toString().trim()) {
        entries.push({ 
          date: entryDate,
          type: row[2] ? row[2].toString() : '',
          metric: row[4] ? row[4].toString() : '',
          actual: safeParseNumber(row[5]),
          target: safeParseNumber(row[6]),
          progress: safeParseNumber(row[7]),
          notes: row[8] ? row[8].toString() : ''
        });
      }
    }
    return { success: true, data: entries };
  } catch(e) {
    console.error('Error in getTodayEntries:', e);
    return { success: false, error: e.toString(), data: [] };
  }
}

function saveDailyEntry(entry) {
  try {
    const sheet = getDailyLogSheet();
    const today = new Date().toISOString().split('T')[0];
    const now = new Date().toISOString();
    const id = generateId();
    
    let metricId = '';
    let targetValue = 0;
    
    if (entry.type === 'campus') {
      const campusTargets = getCampusTargets();
      const found = campusTargets.data.find(t => t.metric === entry.metric);
      if (found) {
        metricId = found.id;
        targetValue = found.dailyTarget;
      }
    } else if (entry.type === 'online') {
      const onlineTargets = getOnlineTargets();
      const found = onlineTargets.data.find(t => t.metric === entry.metric);
      if (found) {
        metricId = found.id;
        targetValue = found.dailyTarget;
      }
    }
    
    const progress = targetValue > 0 ? Math.round((entry.actual / targetValue) * 100) : 0;
    
    const data = sheet.getDataRange().getValues();
    let existingRow = -1;
    for (let i = 1; i < data.length; i++) {
      const entryDate = data[i][1] ? data[i][1].toString().split('T')[0] : '';
      if (entryDate === today && data[i][4] === entry.metric) {
        existingRow = i + 1;
        break;
      }
    }
    
    const newRow = [id, today, entry.type, metricId, entry.metric, entry.actual, targetValue, progress, entry.notes || '', now, now];
    
    if (existingRow > 0) {
      sheet.getRange(existingRow, 1, 1, newRow.length).setValues([newRow]);
    } else {
      sheet.appendRow(newRow);
    }
    return { success: true };
  } catch(e) {
    console.error('Error in saveDailyEntry:', e);
    return { success: false, error: e.toString() };
  }
}

function deleteEntry(date, metric) {
  try {
    const sheet = getDailyLogSheet();
    const data = sheet.getDataRange().getValues();
    for (let i = 1; i < data.length; i++) {
      const entryDate = data[i][1] ? data[i][1].toString().split('T')[0] : '';
      if (entryDate === date && data[i][4] === metric) {
        sheet.deleteRow(i + 1);
        return { success: true };
      }
    }
    return { success: false, error: 'Entry not found' };
  } catch(e) {
    console.error('Error in deleteEntry:', e);
    return { success: false, error: e.toString() };
  }
}

function getAllEntries() {
  try {
    const sheet = getDailyLogSheet();
    const data = sheet.getDataRange().getValues();
    const entries = [];
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      if (row[0] && row[0].toString().trim()) {
        entries.push({ 
          date: row[1] ? row[1].toString().split('T')[0] : '',
          type: row[2] ? row[2].toString() : '',
          metric: row[4] ? row[4].toString() : '',
          actual: safeParseNumber(row[5]),
          target: safeParseNumber(row[6]),
          progress: safeParseNumber(row[7]),
          notes: row[8] ? row[8].toString() : ''
        });
      }
    }
    return { success: true, data: entries };
  } catch(e) {
    console.error('Error in getAllEntries:', e);
    return { success: false, error: e.toString(), data: [] };
  }
}