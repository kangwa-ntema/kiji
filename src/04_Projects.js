// Projects.gs

// ============================================
// PROJECTS MANAGEMENT
// ============================================

function getProjectsSheet() {
  const ss = getSpreadsheet();
  let sheet = ss.getSheetByName(CONFIG.PROJECTS_SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(CONFIG.PROJECTS_SHEET_NAME);
    const headers = ['ID', 'Name', 'Description', 'Category', 'Status', 'StartDate', 'EndDate', 'Skills', 'MaxParticipants', 'CurrentParticipants', 'CreatedAt', 'UpdatedAt'];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function getProjects() {
  try {
    const sheet = getProjectsSheet();
    const data = sheet.getDataRange().getValues();
    const projects = [];
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      if (row[0]) {
        projects.push({
          id: row[0], 
          name: row[1], 
          description: row[2] || '', 
          category: row[3] || '', 
          status: row[4] || 'Open',
          startDate: row[5] || '', 
          endDate: row[6] || '', 
          skills: row[7] || '', 
          maxParticipants: safeParseNumber(row[8], 10),
          currentParticipants: safeParseNumber(row[9], 0), 
          createdAt: row[10] || '', 
          updatedAt: row[11] || ''
        });
      }
    }
    return { success: true, data: projects };
  } catch(e) {
    return { success: false, error: e.toString(), data: [] };
  }
}

function addProject(project) {
  try {
    const sheet = getProjectsSheet();
    const id = generateId();
    const now = new Date().toISOString();
    sheet.appendRow([
      id, project.name, project.description || '', project.category || 'General', 'Open',
      project.startDate || '', project.endDate || '', project.skills || '',
      project.maxParticipants || 10, 0, now, now
    ]);
    return { success: true, message: 'Project created!', projectId: id };
  } catch(e) {
    return { success: false, error: e.toString() };
  }
}

function deleteProject(id) {
  try {
    const sheet = getProjectsSheet();
    const data = sheet.getDataRange().getValues();
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === id) {
        sheet.deleteRow(i + 1);
        return { success: true };
      }
    }
    return { success: false, error: 'Project not found' };
  } catch(e) {
    return { success: false, error: e.toString() };
  }
}