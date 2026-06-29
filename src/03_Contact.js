// Contacts.gs

// ============================================
// CONTACTS MANAGEMENT
// ============================================

function getContactsSheet() {
  const ss = getSpreadsheet();
  let sheet = ss.getSheetByName(CONFIG.CONTACTS_SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(CONFIG.CONTACTS_SHEET_NAME);
    const headers = ['ID', 'Name', 'Phone', 'Email', 'Institution', 'Course', 'Year', 'Source', 'Status', 'LeadScore', 'Interests', 'Skills', 'LinkedIn', 'Facebook', 'Twitter', 'Instagram', 'Notes', 'FirstContact', 'LastContact', 'FollowUp', 'Converted', 'SignupDate', 'CreatedAt', 'UpdatedAt'];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
    
    // Set the Phone column (column C) as plain text format
    const phoneColumn = sheet.getRange('C:C');
    phoneColumn.setNumberFormat('@'); // @ forces plain text format
  }
  return sheet;
}

function formatPhoneNumberForStorage(phone) {
  if (!phone) return '';
  
  // Convert to string and trim
  let phoneStr = phone.toString().trim();
  
  // Remove all spaces, dashes, parentheses, and dots
  phoneStr = phoneStr.replace(/[\s\-\(\)\.]/g, '');
  
  // If it starts with 0 and has 9-10 digits (local number), add +260
  if (phoneStr.match(/^0\d{9}$/)) {
    phoneStr = '+260' + phoneStr.substring(1);
  }
  // If it has 12 digits and no +, add +
  else if (phoneStr.match(/^\d{12}$/)) {
    phoneStr = '+' + phoneStr;
  }
  // If it has 9 digits and no +, assume Zambian number
  else if (phoneStr.match(/^\d{9}$/)) {
    phoneStr = '+260' + phoneStr;
  }
  
  // Prefix with ' to force plain text in Sheets (won't show in display)
  // This prevents Sheets from trying to interpret it as a number
  return phoneStr;
}

function getContacts() {
  try {
    const sheet = getContactsSheet();
    const data = sheet.getDataRange().getValues();
    const contacts = [];
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      if (row[0] && row[0].toString().trim()) {
        // Get the raw value from the cell to avoid #ERROR!
        let phoneRaw = '';
        if (row[2]) {
          // If it's a number that Sheets formatted badly, get the display value
          const cellRange = sheet.getRange(i + 1, 3);
          phoneRaw = cellRange.getDisplayValue();
          // If display value shows #ERROR!, try to get the underlying value
          if (phoneRaw === '#ERROR!' || phoneRaw === '#VALUE!') {
            phoneRaw = cellRange.getValue();
            if (phoneRaw && typeof phoneRaw === 'number') {
              phoneRaw = phoneRaw.toString();
            }
          }
          if (!phoneRaw || phoneRaw === '#ERROR!' || phoneRaw === '#VALUE!') {
            phoneRaw = '';
          }
        }
        
        contacts.push({
          id: row[0] ? row[0].toString() : '',
          name: row[1] ? row[1].toString() : '',
          phone: phoneRaw ? phoneRaw.toString() : '',
          email: row[3] ? row[3].toString() : '',
          institution: row[4] ? row[4].toString() : '',
          course: row[5] ? row[5].toString() : '',
          year: row[6] ? row[6].toString() : '',
          source: row[7] ? row[7].toString() : '',
          status: row[8] ? row[8].toString() : '',
          leadScore: safeParseNumber(row[9]),
          interests: row[10] ? row[10].toString() : '',
          skills: row[11] ? row[11].toString() : '',
          linkedin: row[12] ? row[12].toString() : '',
          facebook: row[13] ? row[13].toString() : '',
          twitter: row[14] ? row[14].toString() : '',
          instagram: row[15] ? row[15].toString() : '',
          notes: row[16] ? row[16].toString() : '',
          firstContact: row[17] ? row[17].toString() : '',
          lastContact: row[18] ? row[18].toString() : '',
          followUp: row[19] ? (row[19] instanceof Date ? row[19].toISOString().split('T')[0] : row[19].toString()) : '',
          converted: row[20] === true || row[20] === 'TRUE' || row[20] === 'true' || row[20] === 'True',
          signupDate: row[21] ? row[21].toString() : '',
          createdAt: row[22] ? row[22].toString() : '',
          updatedAt: row[23] ? row[23].toString() : ''
        });
      }
    }
    return { success: true, data: contacts };
  } catch(e) {
    console.error('Error in getContacts:', e);
    return { success: false, error: e.toString(), data: [] };
  }
}

function addContact(contact) {
  try {
    const sheet = getContactsSheet();
    const id = generateId();
    const now = new Date().toISOString();
    
    // Format phone number properly for storage
    let phoneNumber = formatPhoneNumberForStorage(contact.phone || '');
    
    // Set the cell value as a string by using setValue with a string
    // This prevents Sheets from interpreting it as a number
    const newRow = [
      id, 
      contact.name, 
      phoneNumber,
      contact.email || '', 
      contact.institution || '', 
      contact.course || '', 
      contact.year || '', 
      contact.source || 'Direct Pitch', 
      contact.status || 'New Lead', 
      contact.leadScore || 50, 
      contact.interests || '', 
      contact.skills || '',
      contact.linkedin || '', 
      contact.facebook || '', 
      contact.twitter || '', 
      contact.instagram || '',
      contact.notes || '', 
      now, 
      now, 
      contact.followUp || '', 
      false, 
      '', 
      now, 
      now
    ];
    
    sheet.appendRow(newRow);
    
    // Format the phone column as text for the new row
    const lastRow = sheet.getLastRow();
    const phoneCell = sheet.getRange(lastRow, 3);
    phoneCell.setNumberFormat('@');
    // Re-set the value to ensure it's stored as text
    phoneCell.setValue(phoneNumber);
    
    return { success: true, message: 'Contact added!', contactId: id };
  } catch(e) {
    return { success: false, error: e.toString() };
  }
}

function updateContact(contactId, updates) {
  try {
    const sheet = getContactsSheet();
    const data = sheet.getDataRange().getValues();
    let rowIndex = -1;
    
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === contactId) {
        rowIndex = i + 1;
        break;
      }
    }
    
    if (rowIndex === -1) return { success: false, error: 'Contact not found' };
    
    const row = data[rowIndex - 1];
    if (updates.name !== undefined) row[1] = updates.name;
    if (updates.phone !== undefined) {
      let phoneNumber = formatPhoneNumberForStorage(updates.phone);
      row[2] = phoneNumber;
      // Format the cell as text
      const phoneCell = sheet.getRange(rowIndex, 3);
      phoneCell.setNumberFormat('@');
      phoneCell.setValue(phoneNumber);
    }
    if (updates.email !== undefined) row[3] = updates.email;
    if (updates.institution !== undefined) row[4] = updates.institution;
    if (updates.course !== undefined) row[5] = updates.course;
    if (updates.year !== undefined) row[6] = updates.year;
    if (updates.source !== undefined) row[7] = updates.source;
    if (updates.status !== undefined) row[8] = updates.status;
    if (updates.leadScore !== undefined) row[9] = updates.leadScore;
    if (updates.interests !== undefined) row[10] = updates.interests;
    if (updates.skills !== undefined) row[11] = updates.skills;
    if (updates.linkedin !== undefined) row[12] = updates.linkedin;
    if (updates.facebook !== undefined) row[13] = updates.facebook;
    if (updates.twitter !== undefined) row[14] = updates.twitter;
    if (updates.instagram !== undefined) row[15] = updates.instagram;
    if (updates.notes !== undefined) row[16] = updates.notes;
    if (updates.followUp !== undefined) row[19] = updates.followUp;
    row[23] = new Date().toISOString();
    
    sheet.getRange(rowIndex, 1, 1, row.length).setValues([row]);
    return { success: true, message: 'Contact updated!' };
  } catch(e) {
    return { success: false, error: e.toString() };
  }
}

function deleteContact(id) {
  try {
    const sheet = getContactsSheet();
    const data = sheet.getDataRange().getValues();
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === id) {
        sheet.deleteRow(i + 1);
        return { success: true };
      }
    }
    return { success: false, error: 'Contact not found' };
  } catch(e) {
    return { success: false, error: e.toString() };
  }
}

// Run this once to fix existing phone numbers
function fixExistingPhoneNumbers() {
  const sheet = getContactsSheet();
  const data = sheet.getDataRange().getValues();
  let fixed = 0;
  
  // Set the entire Phone column to text format
  const phoneColumn = sheet.getRange('C:C');
  phoneColumn.setNumberFormat('@');
  
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (row[1]) { // If name exists
      const currentPhone = row[2];
      let newPhone = '';
      
      if (currentPhone && currentPhone.toString().trim()) {
        newPhone = formatPhoneNumberForStorage(currentPhone.toString());
      } else if (currentPhone === '#ERROR!') {
        // Try to get the actual value from the cell
        const cellRange = sheet.getRange(i + 1, 3);
        const displayValue = cellRange.getDisplayValue();
        const formula = cellRange.getFormula();
        
        if (displayValue && displayValue !== '#ERROR!' && displayValue !== '#VALUE!') {
          newPhone = formatPhoneNumberForStorage(displayValue);
        } else if (formula && formula !== '') {
          // Extract numbers from formula
          const numbers = formula.match(/\d+/g);
          if (numbers && numbers.length > 0) {
            newPhone = formatPhoneNumberForStorage(numbers.join(''));
          }
        }
      }
      
      if (newPhone && newPhone !== currentPhone) {
        const cell = sheet.getRange(i + 1, 3);
        cell.setValue(newPhone);
        cell.setNumberFormat('@');
        console.log(`Fixed phone for ${row[1]}: ${newPhone}`);
        fixed++;
      }
    }
  }
  
  console.log(`Fixed ${fixed} phone numbers`);
  return { success: true, fixed: fixed };
}