// 99_debugs.gs

// ============================================
// DEBUGGING FUNCTIONS
// ============================================

function debugSheets() {
  const ss = getSpreadsheet();
  const sheets = ss.getSheets();
  const sheetNames = sheets.map(s => s.getName());
  
  console.log('Available sheets:', sheetNames);
  
  const stats = {};
  sheets.forEach(sheet => {
    const lastRow = sheet.getLastRow();
    const lastCol = sheet.getLastColumn();
    stats[sheet.getName()] = { rows: lastRow, cols: lastCol };
  });
  
  return { sheetNames, stats, success: true };
}

function debugContacts() {
  const contacts = getContacts();
  console.log('Total contacts:', contacts.data.length);
  if (contacts.data.length > 0) {
    console.log('First contact sample:', contacts.data[0]);
  }
  return contacts;
}

function debugTargets() {
  const targets = getTargets();
  console.log('Campus targets:', targets.data.campus.length);
  console.log('Online targets:', targets.data.online.length);
  return targets;
}

function debugEntries() {
  const entries = getAllEntries();
  console.log('Total entries:', entries.data.length);
  if (entries.data.length > 0) {
    console.log('First entry sample:', entries.data[0]);
  }
  return entries;
}

function runAllDebug() {
  return {
    sheets: debugSheets(),
    contacts: debugContacts(),
    targets: debugTargets(),
    entries: debugEntries()
  };
}


function debugPhoneNumbers() {
  const sheet = getContactsSheet();
  const data = sheet.getDataRange().getValues();
  console.log('=== PHONE NUMBER DEBUG ===');
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    console.log(`Contact ${i}: Name="${row[1]}", Phone Raw="${row[2]}", Phone Type="${typeof row[2]}"`);
  }
  return { success: true };
}

function fixPhoneNumbers() {
  const sheet = getContactsSheet();
  const data = sheet.getDataRange().getValues();
  let fixed = 0;
  
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (row[2]) {
      let originalPhone = row[2].toString();
      let cleanPhone = originalPhone.replace(/\s/g, ''); // Remove spaces
      
      // Add + if it's a 12-digit number without +
      if (/^\d{12}$/.test(cleanPhone)) {
        cleanPhone = '+' + cleanPhone;
      }
      
      if (originalPhone !== cleanPhone) {
        sheet.getRange(i + 1, 3).setValue(cleanPhone);
        console.log(`Fixed phone for ${row[1]}: "${originalPhone}" -> "${cleanPhone}"`);
        fixed++;
      }
    }
  }
  
  console.log(`Fixed ${fixed} phone numbers`);
  return { success: true, fixed: fixed };
}