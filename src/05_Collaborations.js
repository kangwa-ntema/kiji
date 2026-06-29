// 05_Collaborations.gs

// ============================================
// COLLABORATIONS MANAGEMENT
// ============================================

function getCollaborationsSheet() {
  const ss = getSpreadsheet();
  let sheet = ss.getSheetByName(CONFIG.COLLABORATIONS_SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(CONFIG.COLLABORATIONS_SHEET_NAME);
    const headers = ['ID', 'ContactID', 'ContactName', 'ProjectID', 'ProjectName', 'Role', 'Status', 'JoinedDate', 'Contributions', 'Notes', 'CreatedAt', 'UpdatedAt'];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function getCollaborations(projectId = null) {
  try {
    const sheet = getCollaborationsSheet();
    const data = sheet.getDataRange().getValues();
    const collaborations = [];
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      if (row[0] && (!projectId || row[3] === projectId)) {
        collaborations.push({
          id: row[0], 
          contactId: row[1], 
          contactName: row[2], 
          projectId: row[3], 
          projectName: row[4],
          role: row[5], 
          status: row[6], 
          joinedDate: row[7], 
          contributions: row[8], 
          notes: row[9], 
          createdAt: row[10], 
          updatedAt: row[11]
        });
      }
    }
    return { success: true, data: collaborations };
  } catch(e) {
    return { success: false, error: e.toString(), data: [] };
  }
}

function addCollaboration(collaboration) {
  try {
    const sheet = getCollaborationsSheet();
    const id = generateId();
    const now = new Date().toISOString();
    sheet.appendRow([
      id, collaboration.contactId, collaboration.contactName, 
      collaboration.projectId, collaboration.projectName,
      collaboration.role || 'Contributor', collaboration.status || 'Pending',
      collaboration.joinedDate || now, collaboration.contributions || '',
      collaboration.notes || '', now, now
    ]);
    return { success: true, message: 'Collaboration added!', id: id };
  } catch(e) {
    return { success: false, error: e.toString() };
  }
}

function updateCollaboration(id, updates) {
  try {
    const sheet = getCollaborationsSheet();
    const data = sheet.getDataRange().getValues();
    let rowIndex = -1;
    
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === id) {
        rowIndex = i + 1;
        break;
      }
    }
    
    if (rowIndex === -1) return { success: false, error: 'Collaboration not found' };
    
    const row = data[rowIndex - 1];
    if (updates.role !== undefined) row[5] = updates.role;
    if (updates.status !== undefined) row[6] = updates.status;
    if (updates.contributions !== undefined) row[8] = updates.contributions;
    if (updates.notes !== undefined) row[9] = updates.notes;
    row[11] = new Date().toISOString();
    
    sheet.getRange(rowIndex, 1, 1, row.length).setValues([row]);
    return { success: true, message: 'Collaboration updated!' };
  } catch(e) {
    return { success: false, error: e.toString() };
  }
}

function deleteCollaboration(id) {
  try {
    const sheet = getCollaborationsSheet();
    const data = sheet.getDataRange().getValues();
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === id) {
        sheet.deleteRow(i + 1);
        return { success: true };
      }
    }
    return { success: false, error: 'Collaboration not found' };
  } catch(e) {
    return { success: false, error: e.toString() };
  }
}