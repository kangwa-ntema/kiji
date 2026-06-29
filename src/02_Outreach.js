// Outreach.gs

// ============================================
// UNIFIED OUTREACH TARGETS MANAGEMENT
// ============================================

function getOutreachSheet() {
  const ss = getSpreadsheet();
  let sheet = ss.getSheetByName(CONFIG.OUTREACH_SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(CONFIG.OUTREACH_SHEET_NAME);
    const headers = [
      'ID', 'Name', 'Type', 'Description', 
      'Daily Target', 'Weekly Target', 'Monthly Target',
      'Days Active', 'Minimum Daily', 'Minimum Weekly', 'Minimum Monthly',
      'Is Active', 'Color', 'Icon', 'Order', 
      'Created At', 'Updated At'
    ];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
    
    // Add default outreach targets
    addDefaultOutreachTargets();
  }
  return sheet;
}

function addDefaultOutreachTargets() {
  const defaultTargets = [
    {
      name: 'Blueprints & Flyers Distributed',
      type: 'Campus',
      description: 'Maximize physical footprint and brand visibility on campus grounds.',
      dailyTarget: 5,
      weeklyTarget: 20,
      monthlyTarget: 100,
      daysActive: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      minimumDaily: 3,
      minimumWeekly: 15,
      minimumMonthly: 75,
      color: '#4CAF50',
      icon: '📄',
      order: 1
    },
    {
      name: 'Direct Pitch Conversations',
      type: 'Campus',
      description: 'Engaging students face-to-face to explain how it simplifies course/GPA tracking.',
      dailyTarget: 2,
      weeklyTarget: 10,
      monthlyTarget: 40,
      daysActive: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      minimumDaily: 1,
      minimumWeekly: 8,
      minimumMonthly: 30,
      color: '#2196F3',
      icon: '💬',
      order: 2
    },
    {
      name: 'Leads Collected',
      type: 'Campus',
      description: 'Gathering names and numbers of interested students for follow-ups.',
      dailyTarget: 2,
      weeklyTarget: 10,
      monthlyTarget: 40,
      daysActive: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      minimumDaily: 1,
      minimumWeekly: 8,
      minimumMonthly: 30,
      color: '#FF9800',
      icon: '👥',
      order: 3
    },
    {
      name: 'LinkedIn Content Activity',
      type: 'Online',
      description: 'Building professional credibility by sharing videos/stories of your field execution.',
      dailyTarget: 0,
      weeklyTarget: 3,
      monthlyTarget: 10,
      daysActive: ['Monday', 'Wednesday', 'Friday'],
      minimumDaily: 0,
      minimumWeekly: 2,
      minimumMonthly: 8,
      color: '#0077B5',
      icon: '🔗',
      order: 4
    },
    {
      name: 'Facebook Community Posts',
      type: 'Online',
      description: 'Keeping the official page active with student-centric tips, updates, and memes.',
      dailyTarget: 1,
      weeklyTarget: 5,
      monthlyTarget: 20,
      daysActive: ['Monday', 'Tuesday', 'Thursday', 'Saturday'],
      minimumDaily: 1,
      minimumWeekly: 4,
      minimumMonthly: 15,
      color: '#1877F2',
      icon: '📘',
      order: 5
    },
    {
      name: 'Digital Link Clicks',
      type: 'Online',
      description: 'Tracking how many students click the link in your bio or posts.',
      dailyTarget: 10,
      weeklyTarget: 50,
      monthlyTarget: 200,
      daysActive: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      minimumDaily: 5,
      minimumWeekly: 40,
      minimumMonthly: 150,
      color: '#9C27B0',
      icon: '🔗',
      order: 6
    }
  ];
  
  defaultTargets.forEach(target => {
    addOutreachTarget(target);
  });
}

// Get all outreach targets
function getOutreachTargets(filters = {}) {
  try {
    const sheet = getOutreachSheet();
    const data = sheet.getDataRange().getValues();
    const targets = [];
    
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      if (row[0] && row[0].toString().trim()) {
        const target = {
          id: row[0].toString(),
          name: row[1].toString(),
          type: row[2].toString(),
          description: row[3] ? row[3].toString() : '',
          dailyTarget: safeParseNumber(row[4]),
          weeklyTarget: safeParseNumber(row[5]),
          monthlyTarget: safeParseNumber(row[6]),
          daysActive: row[7] ? row[7].toString().split(',') : [],
          minimumDaily: safeParseNumber(row[8]),
          minimumWeekly: safeParseNumber(row[9]),
          minimumMonthly: safeParseNumber(row[10]),
          isActive: row[11] === true || row[11] === 'TRUE' || row[11] === 'true',
          color: row[12] ? row[12].toString() : '#6c757d',
          icon: row[13] ? row[13].toString() : '🎯',
          order: safeParseNumber(row[14]),
          createdAt: row[15] ? row[15].toString() : '',
          updatedAt: row[16] ? row[16].toString() : ''
        };
        
        // Apply filters
        let include = true;
        if (filters.type && target.type !== filters.type) include = false;
        if (filters.isActive !== undefined && target.isActive !== filters.isActive) include = false;
        if (filters.search && !target.name.toLowerCase().includes(filters.search.toLowerCase())) include = false;
        
        if (include) targets.push(target);
      }
    }
    
    // Sort by order
    targets.sort((a, b) => a.order - b.order);
    
    return { success: true, data: targets };
  } catch(e) {
    console.error('Error in getOutreachTargets:', e);
    return { success: false, error: e.toString(), data: [] };
  }
}

// Add new outreach target
function addOutreachTarget(target) {
  try {
    const sheet = getOutreachSheet();
    const id = generateId();
    const now = new Date().toISOString();
    const daysActiveStr = target.daysActive ? target.daysActive.join(',') : '';
    
    sheet.appendRow([
      id,
      target.name,
      target.type,
      target.description || '',
      target.dailyTarget || 0,
      target.weeklyTarget || 0,
      target.monthlyTarget || 0,
      daysActiveStr,
      target.minimumDaily || 0,
      target.minimumWeekly || 0,
      target.minimumMonthly || 0,
      target.isActive !== false,
      target.color || '#6c757d',
      target.icon || '🎯',
      target.order || sheet.getLastRow(),
      now,
      now
    ]);
    
    return { success: true, message: 'Outreach target added!', id: id };
  } catch(e) {
    return { success: false, error: e.toString() };
  }
}

// Update outreach target
function updateOutreachTarget(id, updates) {
  try {
    const sheet = getOutreachSheet();
    const data = sheet.getDataRange().getValues();
    let rowIndex = -1;
    
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === id) {
        rowIndex = i + 1;
        break;
      }
    }
    
    if (rowIndex === -1) return { success: false, error: 'Target not found' };
    
    const row = data[rowIndex - 1];
    if (updates.name !== undefined) row[1] = updates.name;
    if (updates.type !== undefined) row[2] = updates.type;
    if (updates.description !== undefined) row[3] = updates.description;
    if (updates.dailyTarget !== undefined) row[4] = updates.dailyTarget;
    if (updates.weeklyTarget !== undefined) row[5] = updates.weeklyTarget;
    if (updates.monthlyTarget !== undefined) row[6] = updates.monthlyTarget;
    if (updates.daysActive !== undefined) row[7] = updates.daysActive.join(',');
    if (updates.minimumDaily !== undefined) row[8] = updates.minimumDaily;
    if (updates.minimumWeekly !== undefined) row[9] = updates.minimumWeekly;
    if (updates.minimumMonthly !== undefined) row[10] = updates.minimumMonthly;
    if (updates.isActive !== undefined) row[11] = updates.isActive;
    if (updates.color !== undefined) row[12] = updates.color;
    if (updates.icon !== undefined) row[13] = updates.icon;
    if (updates.order !== undefined) row[14] = updates.order;
    row[16] = new Date().toISOString();
    
    sheet.getRange(rowIndex, 1, 1, row.length).setValues([row]);
    return { success: true, message: 'Outreach target updated!' };
  } catch(e) {
    return { success: false, error: e.toString() };
  }
}

// Delete outreach target
function deleteOutreachTarget(id) {
  try {
    const sheet = getOutreachSheet();
    const data = sheet.getDataRange().getValues();
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === id) {
        sheet.deleteRow(i + 1);
        return { success: true };
      }
    }
    return { success: false, error: 'Target not found' };
  } catch(e) {
    return { success: false, error: e.toString() };
  }
}

// Get outreach types for dropdown
function getOutreachTypes() {
  return { success: true, data: OUTREACH_TYPES };
}

// Get days of week for selection
function getDaysOfWeek() {
  return { success: true, data: DAYS_OF_WEEK };
}

// Legacy support - returns formatted targets for existing frontend
function getTargets() {
  try {
    const result = getOutreachTargets({ isActive: true });
    if (!result.success) return { success: false, data: { campus: [], online: [] } };
    
    const campusTargets = result.data
      .filter(t => t.type === 'Campus')
      .map(t => ({
        id: t.id,
        metric: t.name,
        daily: t.dailyTarget,
        weekly: t.weeklyTarget,
        monthly: t.monthlyTarget,
        objective: t.description,
        minimumDaily: t.minimumDaily,
        minimumWeekly: t.minimumWeekly,
        minimumMonthly: t.minimumMonthly,
        daysActive: t.daysActive,
        color: t.color,
        icon: t.icon
      }));
    
    const onlineTargets = result.data
      .filter(t => t.type !== 'Campus')
      .map(t => ({
        id: t.id,
        metric: t.name,
        daily: t.dailyTarget,
        weekly: t.weeklyTarget,
        monthly: t.monthlyTarget,
        objective: t.description,
        minimumDaily: t.minimumDaily,
        minimumWeekly: t.minimumWeekly,
        minimumMonthly: t.minimumMonthly,
        daysActive: t.daysActive,
        color: t.color,
        icon: t.icon
      }));
    
    return {
      success: true,
      data: {
        campus: campusTargets,
        online: onlineTargets,
        all: result.data
      }
    };
  } catch(e) {
    console.error('Error in getTargets:', e);
    return { success: false, error: e.toString(), data: { campus: [], online: [], all: [] } };
  }
}