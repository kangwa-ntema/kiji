// ============================================
// RESET & NORMALIZE ALL SHEETS
// ============================================

function resetAllSheets() {
  var ss = getSpreadsheet();
  
  var sheetsToDelete = ['Outreach Targets', 'Contacts', 'Projects', 'Collaborations', 'Daily Log', 'Normalization Summary', '_Settings'];
  sheetsToDelete.forEach(function(sheetName) {
    var sheet = ss.getSheetByName(sheetName);
    if (sheet) ss.deleteSheet(sheet);
  });
  
  createNormalizedOutreachTargets();
  createNormalizedContacts();
  createNormalizedProjects();
  createNormalizedCollaborations();
  createNormalizedDailyLog();
  
  addDefaultOutreachTargetsToSheet();
  
  return { success: true, message: 'All sheets have been reset and normalized!' };
}

function createNormalizedOutreachTargets() {
  var ss = getSpreadsheet();
  var sheet = ss.insertSheet('Outreach Targets');
  
  var headers = [
    'ID', 'Name', 'Type', 'Description', 
    'Daily Target', 'Weekly Target', 'Monthly Target',
    'Days Active', 'Minimum Daily', 'Minimum Weekly', 'Minimum Monthly',
    'Is Active', 'Color', 'Icon', 'Order', 
    'Created At', 'Updated At'
  ];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
  sheet.setFrozenRows(1);
  
  var typeRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(OUTREACH_TYPES)
    .build();
  sheet.getRange('C:C').setDataValidation(typeRule);
}

function addDefaultOutreachTargetsToSheet() {
  var defaultTargets = [
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
  
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Outreach Targets');
  if (!sheet) return;
  
  defaultTargets.forEach(function(target) {
    var id = generateId();
    var now = new Date().toISOString();
    var daysActiveStr = target.daysActive ? target.daysActive.join(',') : '';
    
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
      true,
      target.color || '#6c757d',
      target.icon || '🎯',
      target.order || sheet.getLastRow(),
      now,
      now
    ]);
  });
  
  console.log('Added ' + defaultTargets.length + ' default outreach targets');
}

function createNormalizedContacts() {
  var ss = getSpreadsheet();
  var sheet = ss.insertSheet(CONFIG.CONTACTS_SHEET_NAME);  // ← Use CONFIG here
  
  var headers = [
    'ID', 'Name', 'Phone', 'Email', 'Institution', 'Course', 'Year', 
    'Source', 'Status', 'Lead Score', 'Interests', 'Skills', 
    'LinkedIn', 'Facebook', 'Twitter', 'Instagram', 'Notes', 
    'First Contact', 'Last Contact', 'Follow Up Date', 'Converted', 
    'Conversion Date', 'Created At', 'Updated At'
  ];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
  sheet.setFrozenRows(1);
  
  var phoneColumn = sheet.getRange('C:C');
  phoneColumn.setNumberFormat('@');
  
  var statusRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['New Lead', 'Contacted', 'Interested', 'Follow-up', 'Converted', 'Lost'])
    .build();
  sheet.getRange('I:I').setDataValidation(statusRule);
  
  var sourceRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Direct Pitch', 'Online DM', 'Referral', 'Event', 'Website', 'Other'])
    .build();
  sheet.getRange('H:H').setDataValidation(sourceRule);
}

function createNormalizedProjects() {
  var ss = getSpreadsheet();
  var sheet = ss.insertSheet('Projects');
  
  var headers = [
    'ID', 'Name', 'Description', 'Category', 'Status', 
    'Start Date', 'End Date', 'Required Skills', 
    'Max Participants', 'Current Participants', 
    'Created At', 'Updated At'
  ];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
  sheet.setFrozenRows(1);
}

function createNormalizedCollaborations() {
  var ss = getSpreadsheet();
  var sheet = ss.insertSheet('Collaborations');
  
  var headers = [
    'ID', 'Contact ID', 'Contact Name', 'Project ID', 'Project Name', 
    'Role', 'Status', 'Joined Date', 'Contributions', 'Notes', 
    'Created At', 'Updated At'
  ];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
  sheet.setFrozenRows(1);
}

function createNormalizedDailyLog() {
  var ss = getSpreadsheet();
  var sheet = ss.insertSheet('Daily Log');
  
  var headers = [
    'ID', 'Date', 'Outreach ID', 'Outreach Name', 'Outreach Type',
    'Actual', 'Target', 'Minimum Target', 'Progress %', 
    'Met Minimum', 'Notes', 'Created At', 'Updated At'
  ];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
  sheet.setFrozenRows(1);
}

function normalizeAllSheets() {
  try {
    console.log('Starting complete sheet normalization...');
    
    var resetResult = resetAllSheets();
    if (!resetResult.success) {
      throw new Error('Failed to reset sheets');
    }
    console.log('Sheets reset successfully');
    
    console.log('Adding sample data...');
    addSampleContacts();
    addSampleProjects();
    addSampleDailyLogs();
    addSampleCollaborations();
    
    console.log('Normalization complete!');
    
    var ss = getSpreadsheet();
    var summarySheet = ss.getSheetByName('Normalization Summary');
    if (summarySheet) ss.deleteSheet(summarySheet);
    
    summarySheet = ss.insertSheet('Normalization Summary', 0);
    var now = new Date();
    
    summarySheet.getRange(1, 1).setValue('Normalization Completed At:');
    summarySheet.getRange(1, 2).setValue(now.toLocaleString());
    summarySheet.getRange(2, 1).setValue('Sheets Created:');
    summarySheet.getRange(3, 1).setValue('Outreach Targets');
    summarySheet.getRange(4, 1).setValue('Contacts');
    summarySheet.getRange(5, 1).setValue('Projects');
    summarySheet.getRange(6, 1).setValue('Collaborations');
    summarySheet.getRange(7, 1).setValue('Daily Log');
    summarySheet.getRange(2, 2).setValue('5 sheets total');
    summarySheet.getRange(3, 2).setValue('Default targets added');
    summarySheet.getRange(4, 2).setValue('3 sample contacts');
    summarySheet.getRange(5, 2).setValue('2 sample projects');
    summarySheet.getRange(6, 2).setValue('2 sample collaborations');
    summarySheet.getRange(7, 2).setValue('2 sample entries');
    
    summarySheet.getRange(1, 1, 7, 2).setFontWeight('bold');
    summarySheet.autoResizeColumns(1, 2);
    
    fixPhoneColumnFormatting();
    
    return {
      success: true,
      message: 'All sheets have been normalized!',
      sheets: ['Outreach Targets', 'Contacts', 'Projects', 'Collaborations', 'Daily Log'],
      timestamp: now.toISOString()
    };
    
  } catch(e) {
    console.error('Error during normalization:', e);
    return {
      success: false,
      error: e.toString(),
      message: 'Normalization failed.'
    };
  }
}

function fixPhoneColumnFormatting() {
  var ss = getSpreadsheet();
  var sheet = ss.getSheetByName('Contacts');
  if (!sheet) return;
  
  var phoneColumn = sheet.getRange('C:C');
  phoneColumn.setNumberFormat('@');
  
  var data = sheet.getDataRange().getValues();
  var fixed = 0;
  
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    var phoneValue = row[2];
    
    if (phoneValue && phoneValue.toString().trim()) {
      var cleanPhone = formatPhoneNumberForStorage(phoneValue.toString());
      if (cleanPhone !== phoneValue) {
        var cell = sheet.getRange(i + 1, 3);
        cell.setValue(cleanPhone);
        cell.setNumberFormat('@');
        fixed++;
      }
    }
  }
  
  console.log('Fixed ' + fixed + ' phone numbers with proper formatting');
}

// ============================================
// SAMPLE DATA FUNCTIONS (GENERIC)
// ============================================

function addSampleContacts() {
  var ss = getSpreadsheet();
  var sheet = ss.getSheetByName(CONFIG.CONTACTS_SHEET_NAME);  // ← Use CONFIG
  if (!sheet) return;
  
  var now = new Date().toISOString();
  var lastWeek = new Date();
  lastWeek.setDate(lastWeek.getDate() - 7);
  
  var sampleContacts = [
    {
      id: generateId(),
      name: 'Alex Johnson',
      phone: '+260978000000',
      email: 'alex.j@example.edu.zm',
      institution: 'University of Technology',
      course: 'Computer Science',
      year: '3',
      source: 'Direct Pitch',
      status: 'New Lead',
      leadScore: 50,
      interests: 'Web Development, AI, Data Science',
      skills: 'JavaScript, Python, HTML/CSS',
      linkedin: 'https://linkedin.com/in/alex-johnson',
      facebook: '',
      twitter: '',
      instagram: '',
      notes: 'Showed strong interest in tech projects.',
      firstContact: lastWeek.toISOString(),
      lastContact: lastWeek.toISOString(),
      followUp: '',
      converted: false,
      conversionDate: ''
    },
    {
      id: generateId(),
      name: 'Sarah Williams',
      phone: '+260977000000',
      email: 'sarah.w@example.ac.zw',
      institution: 'Apex University',
      course: 'Nursing',
      year: '2',
      source: 'Direct Pitch',
      status: 'Interested',
      leadScore: 65,
      interests: 'Healthcare Tech, Medical Apps',
      skills: 'Communication, Patient Care, Basic IT',
      linkedin: '',
      facebook: 'https://facebook.com/sarah.williams',
      twitter: '',
      instagram: 'https://instagram.com/sarah_w',
      notes: 'Very interested in the platform.',
      firstContact: now,
      lastContact: now,
      followUp: '2026-07-15',
      converted: false,
      conversionDate: ''
    },
    {
      id: generateId(),
      name: 'Michael Smith',
      phone: '+260965000000',
      email: 'michael.s@university.zm',
      institution: 'State University',
      course: 'Software Engineering',
      year: '4',
      source: 'Online DM',
      status: 'Converted',
      leadScore: 85,
      interests: 'Software Engineering, Mobile Apps',
      skills: 'React Native, Firebase, Node.js, MongoDB',
      linkedin: 'https://linkedin.com/in/michael-smith',
      facebook: '',
      twitter: 'https://twitter.com/mike_dev',
      instagram: '',
      notes: 'Already signed up and actively using the platform.',
      firstContact: '2026-06-01T10:00:00.000Z',
      lastContact: '2026-06-05T14:30:00.000Z',
      followUp: '',
      converted: true,
      conversionDate: '2026-06-02T09:15:00.000Z'
    }
  ];
  
  sampleContacts.forEach(function(contact) {
    var rowData = [
      contact.id,
      contact.name,
      contact.phone,
      contact.email,
      contact.institution,
      contact.course,
      contact.year,
      contact.source,
      contact.status,
      contact.leadScore,
      contact.interests,
      contact.skills,
      contact.linkedin,
      contact.facebook,
      contact.twitter,
      contact.instagram,
      contact.notes,
      contact.firstContact,
      contact.lastContact,
      contact.followUp,
      contact.converted,
      contact.conversionDate,
      contact.firstContact,
      contact.firstContact
    ];
    
    sheet.appendRow(rowData);
    
    var lastRow = sheet.getLastRow();
    var phoneCell = sheet.getRange(lastRow, 3);
    phoneCell.setNumberFormat('@');
    phoneCell.setValue(contact.phone);
  });
  
  console.log('Added ' + sampleContacts.length + ' sample contacts');
}

function addSampleProjects() {
  var ss = getSpreadsheet();
  var sheet = ss.getSheetByName('Projects');
  if (!sheet) return;
  
  var now = new Date().toISOString();
  var nextMonth = new Date();
  nextMonth.setMonth(nextMonth.getMonth() + 1);
  var twoMonths = new Date();
  twoMonths.setMonth(twoMonths.getMonth() + 2);
  
  var sampleProjects = [
    {
      id: generateId(),
      name: 'Student Dashboard Mobile App',
      description: 'Develop a mobile app for students to track their courses, GPA, and assignments',
      category: 'Mobile App',
      status: 'Open',
      startDate: now,
      endDate: twoMonths.toISOString(),
      skills: 'React Native, Firebase, UI/UX Design',
      maxParticipants: 8,
      currentParticipants: 2
    },
    {
      id: generateId(),
      name: 'Campus Ambassador Program',
      description: 'Build a platform to manage campus ambassadors and track their outreach activities',
      category: 'Web Development',
      status: 'In Progress',
      startDate: now,
      endDate: nextMonth.toISOString(),
      skills: 'JavaScript, HTML/CSS, Google Apps Script',
      maxParticipants: 5,
      currentParticipants: 3
    }
  ];
  
  sampleProjects.forEach(function(project) {
    sheet.appendRow([
      project.id,
      project.name,
      project.description,
      project.category,
      project.status,
      project.startDate,
      project.endDate,
      project.skills,
      project.maxParticipants,
      project.currentParticipants,
      now,
      now
    ]);
  });
  
  console.log('Added ' + sampleProjects.length + ' sample projects');
}

function addSampleCollaborations() {
  var ss = getSpreadsheet();
  var sheet = ss.getSheetByName('Collaborations');
  if (!sheet) return;
  
  var now = new Date().toISOString();
  
  var contactsSheet = ss.getSheetByName('Contacts');
  var projectsSheet = ss.getSheetByName('Projects');
  
  if (!contactsSheet || !projectsSheet) return;
  
  var contacts = contactsSheet.getDataRange().getValues();
  var projects = projectsSheet.getDataRange().getValues();
  
  if (contacts.length < 2 || projects.length < 2) return;
  
  var sampleCollaborations = [
    {
      id: generateId(),
      contactId: contacts[1][0],
      contactName: contacts[1][1],
      projectId: projects[1][0],
      projectName: projects[1][1],
      role: 'Mobile Developer',
      status: 'Pending',
      joinedDate: now,
      contributions: 'Will work on frontend development',
      notes: 'Has experience with React Native'
    },
    {
      id: generateId(),
      contactId: contacts[3][0],
      contactName: contacts[3][1],
      projectId: projects[1][0],
      projectName: projects[1][1],
      role: 'Project Lead',
      status: 'Active',
      joinedDate: now,
      contributions: 'Leading the development team',
      notes: 'Experienced developer, already contributing'
    }
  ];
  
  sampleCollaborations.forEach(function(collab) {
    sheet.appendRow([
      collab.id,
      collab.contactId,
      collab.contactName,
      collab.projectId,
      collab.projectName,
      collab.role,
      collab.status,
      collab.joinedDate,
      collab.contributions,
      collab.notes,
      now,
      now
    ]);
  });
  
  console.log('Added ' + sampleCollaborations.length + ' sample collaborations');
}

function addSampleDailyLogs() {
  var ss = getSpreadsheet();
  var sheet = ss.getSheetByName('Daily Log');
  if (!sheet) return;
  
  var now = new Date().toISOString();
  var today = new Date().toISOString().split('T')[0];
  var yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  var yesterdayStr = yesterday.toISOString().split('T')[0];
  
  var outreachSheet = ss.getSheetByName('Outreach Targets');
  
  var sampleEntries = [];
  
  if (outreachSheet) {
    var outreachTargets = outreachSheet.getDataRange().getValues();
    if (outreachTargets.length > 1) {
      sampleEntries.push({
        id: generateId(),
        date: yesterdayStr,
        outreachId: outreachTargets[1][0],
        outreachName: outreachTargets[1][1],
        outreachType: outreachTargets[1][2],
        actual: 4,
        target: outreachTargets[1][4],
        minimumTarget: outreachTargets[1][8],
        progress: Math.round((4 / outreachTargets[1][4]) * 100),
        metMinimum: 4 >= outreachTargets[1][8],
        notes: 'Good engagement at the student center',
        createdAt: now
      });
      
      sampleEntries.push({
        id: generateId(),
        date: today,
        outreachId: outreachTargets[4][0],
        outreachName: outreachTargets[4][1],
        outreachType: outreachTargets[4][2],
        actual: 15,
        target: outreachTargets[4][4],
        minimumTarget: outreachTargets[4][8],
        progress: Math.round((15 / outreachTargets[4][4]) * 100),
        metMinimum: 15 >= outreachTargets[4][8],
        notes: 'Strong link click performance from LinkedIn posts',
        createdAt: now
      });
    }
  }
  
  sampleEntries.forEach(function(entry) {
    sheet.appendRow([
      entry.id,
      entry.date,
      entry.outreachId,
      entry.outreachName,
      entry.outreachType,
      entry.actual,
      entry.target,
      entry.minimumTarget,
      entry.progress,
      entry.metMinimum,
      entry.notes,
      entry.createdAt,
      entry.createdAt
    ]);
  });
  
  console.log('Added ' + sampleEntries.length + ' sample daily log entries');
}

// ============================================
// MENU FUNCTIONS
// ============================================

function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('🏘️ KIJI')
    .addItem('🚀 Initialize Village', 'initializeVillage')
    .addSeparator()
    .addItem('📊 Open Web App', 'openWebApp')
    .addItem('📄 View Documentation', 'showDocumentation')
    .addItem('📋 Village Status', 'showSystemStatus')
    .addToUi();
  
  ensureWelcomeSheet();
}

// ============================================
// WELCOME SHEET
// ============================================

function createWelcomeSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  var welcomeSheet = ss.getSheetByName('🏘️ Welcome to KIJI');
  if (welcomeSheet) return;
  
  var settings = ss.getSheetByName('_Settings');
  if (settings) return;
  
  var sheet = ss.insertSheet('🏘️ Welcome to KIJI', 0);
  
  var data = [
    ['🏘️ KIJI — Digital Village'],
    [''],
    ['Welcome to your Digital Village! 🌍'],
    [''],
    ['This tool helps you manage outreach, contacts, projects, and collaborations.'],
    [''],
    ['📋 To get started:'],
    ['1️⃣ Click the "🏘️ KIJI" menu at the top of this spreadsheet'],
    ['2️⃣ Select "Initialize Village"'],
    ['3️⃣ Wait for initialization to complete (takes 10-15 seconds)'],
    ['4️⃣ Go to Extensions > Apps Script'],
    ['5️⃣ Click "Deploy" > "New deployment"'],
    ['6️⃣ Click the settings gear ⚙️ next to "Web app"'],
    ['7️⃣ Set "Execute as" to "Me"'],
    ['8️⃣ Set "Who has access" to "Anyone"'],
    ['9️⃣ Click "Deploy" and copy the URL'],
    ['🔟 Click "Open Web App" from the KIJI menu to access your village 🏘️'],
    [''],
    ['📱 Mobile Users:'],
    ['The KIJI menu works on mobile too! Just tap the menu icon (⋮)'],
    ['in the top-right corner of the Google Sheets app.'],
    [''],
    ['📊 What You Can Do:'],
    ['• Track outreach campaigns and goals'],
    ['• Manage community members and contacts'],
    ['• Create and track projects'],
    ['• Log daily activities'],
    ['• Generate reports and export data'],
    [''],
    ['🔒 Privacy First:'],
    ['All your data stays in your Google Drive. No third-party servers.'],
    [''],
    ['📞 Need Help?'],
    ['• GitHub: https://github.com/kangwa-ntema/kiji'],
    ['• Issues: https://github.com/kangwa-ntema/kiji/issues'],
    [''],
    ['⭐ Star this project on GitHub if you find it useful!'],
    [''],
    ['Made with ❤️ in Zambia'],
    ['Karibu sana! (You\'re very welcome!)']
  ];
  
  sheet.getRange(1, 1, data.length, 1).setValues(data.map(function(row) { return [row]; }));
  
  sheet.setColumnWidth(1, 600);
  
  var titleRange = sheet.getRange('A1');
  titleRange.setFontSize(28);
  titleRange.setFontWeight('bold');
  titleRange.setBackground('#2e328a');
  titleRange.setFontColor('white');
  titleRange.setVerticalAlignment('middle');
  titleRange.setHorizontalAlignment('center');
  
  var subtitleRange = sheet.getRange('A3');
  subtitleRange.setFontSize(18);
  subtitleRange.setFontWeight('bold');
  subtitleRange.setFontColor('#2e328a');
  
  for (var i = 7; i <= 17; i++) {
    var range = sheet.getRange('A' + i);
    range.setFontSize(14);
    range.setFontWeight('bold');
    range.setFontColor('#2e328a');
  }
  
  var mobileRange = sheet.getRange('A20');
  mobileRange.setFontSize(14);
  mobileRange.setFontWeight('bold');
  mobileRange.setFontColor('#FF9800');
  
  var featuresRange = sheet.getRange('A25');
  featuresRange.setFontSize(14);
  featuresRange.setFontWeight('bold');
  featuresRange.setFontColor('#2e328a');
  
  var privacyRange = sheet.getRange('A31');
  privacyRange.setFontSize(14);
  privacyRange.setFontWeight('bold');
  privacyRange.setFontColor('#28a745');
  
  var helpRange = sheet.getRange('A34');
  helpRange.setFontSize(14);
  helpRange.setFontWeight('bold');
  helpRange.setFontColor('#dc3545');
  
  var footerRange = sheet.getRange('A38');
  footerRange.setFontSize(14);
  footerRange.setFontWeight('bold');
  footerRange.setFontColor('#6c757d');
  footerRange.setHorizontalAlignment('center');
  
  var footerRange2 = sheet.getRange('A39');
  footerRange2.setFontSize(14);
  footerRange2.setFontWeight('bold');
  footerRange2.setFontColor('#6c757d');
  footerRange2.setHorizontalAlignment('center');
  
  sheet.setFrozenRows(1);
  sheet.setHiddenGridlines(true);
  sheet.setRowHeight(1, 60);
  sheet.setRowHeight(3, 35);
  
  console.log('Welcome sheet created');
}

function ensureWelcomeSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var settings = ss.getSheetByName('_Settings');
  
  if (!settings) {
    var welcomeSheet = ss.getSheetByName('🏘️ Welcome to KIJI');
    if (!welcomeSheet) {
      createWelcomeSheet();
    }
    var sheet = ss.getSheetByName('🏘️ Welcome to KIJI');
    if (sheet) {
      sheet.activate();
    }
  } else {
    var welcomeSheet = ss.getSheetByName('🏘️ Welcome to KIJI');
    if (welcomeSheet) {
      ss.deleteSheet(welcomeSheet);
    }
  }
}

// ============================================
// INITIALIZE VILLAGE
// ============================================

function initializeVillage() {
  try {
    console.log('Starting village initialization...');
    
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var existingSheets = ss.getSheets().map(function(s) { return s.getName(); });
    var requiredSheets = ['Outreach Targets', 'Contacts', 'Projects', 'Collaborations', 'Daily Log'];
    var hasAllSheets = requiredSheets.every(function(name) { return existingSheets.indexOf(name) !== -1; });
    
    var result;
    if (!hasAllSheets) {
      console.log('Step 1: Normalizing sheets...');
      result = normalizeAllSheets();
      if (!result.success) throw new Error(result.error);
      console.log('Sheets normalized');
    } else {
      console.log('Sheets already exist, skipping normalization');
      result = { success: true };
    }
    
    console.log('Step 2: Updating settings...');
    var settings = ss.getSheetByName('_Settings');
    if (!settings) {
      settings = ss.insertSheet('_Settings');
    }
    settings.getRange('A1').setValue('Initialized');
    settings.getRange('B1').setValue(new Date().toISOString());
    settings.getRange('A2').setValue('Version');
    settings.getRange('B2').setValue(CONFIG.VERSION);
    settings.getRange('A3').setValue('Script ID');
    settings.getRange('B3').setValue(ScriptApp.getScriptId());
    settings.hideSheet();
    console.log('Settings updated');
    
    createDocumentation('⚠️ Web app not yet deployed. Please deploy manually from Apps Script editor.');
    
    var welcomeSheet = ss.getSheetByName('🏘️ Welcome to KIJI');
    if (welcomeSheet) {
      ss.deleteSheet(welcomeSheet);
    }
    
    var ui = SpreadsheetApp.getUi();
    ui.alert(
      '✅ Village Initialized!',
      'Your Digital Village is ready! 🌍\n\n' +
      '📋 Next steps:\n' +
      '1️⃣ Go to Extensions > Apps Script\n' +
      '2️⃣ Click "Deploy" > "New deployment"\n' +
      '3️⃣ Click the settings gear ⚙️ next to "Web app"\n' +
      '4️⃣ Set "Execute as" to "Me"\n' +
      '5️⃣ Set "Who has access" to "Anyone"\n' +
      '6️⃣ Click "Deploy" and copy the URL\n' +
      '7️⃣ Click "Open Web App" to access your village 🏘️',
      ui.ButtonSet.OK
    );
    
    console.log('Village initialization complete!');
    
    return { success: true };
    
  } catch(e) {
    console.error('Initialization error:', e);
    var ui = SpreadsheetApp.getUi();
    ui.alert('Error', 'Initialization failed: ' + e.toString(), ui.ButtonSet.OK);
    return { 
      success: false, 
      error: e.toString() 
    };
  }
}

// ============================================
// FIX DEPLOYMENT - Save manually deployed URL
// ============================================

function fixDeployment() {
  var ui = SpreadsheetApp.getUi();
  var response = ui.prompt(
    '📝 Enter Your Web App URL',
    'Please paste the URL you got from manual deployment:\n\n' +
    'Example: https://script.google.com/macros/s/ABC123/exec\n\n' +
    'Make sure you copied the ENTIRE URL from the deployment dialog.\n\n' +
    'The URL should start with "https://script.google.com"',
    ui.ButtonSet.OK_CANCEL
  );
  
  if (response.getSelectedButton() === ui.Button.OK) {
    var url = response.getResponseText().trim();
    if (url && url.indexOf('script.google.com') !== -1) {
      var ss = SpreadsheetApp.getActiveSpreadsheet();
      var settings = ss.getSheetByName('_Settings');
      if (!settings) {
        settings = ss.insertSheet('_Settings');
      }
      settings.getRange('A6').setValue('Web App URL');
      settings.getRange('B6').setValue(url);
      settings.getRange('A7').setValue('Deployment ID');
      settings.getRange('B7').setValue('Manual Deployment');
      settings.hideSheet();
      
      createDocumentation(url);
      
      ui.alert('✅ Success!', 
        'Web App URL has been saved!\n\n' +
        'You can now click "Open Web App" to access your Digital Village.', 
        ui.ButtonSet.OK);
    } else {
      ui.alert('❌ Error', 
        'Invalid URL. Please make sure it contains "script.google.com"\n\n' +
        'Example: https://script.google.com/macros/s/ABC123/exec', 
        ui.ButtonSet.OK);
    }
  }
}

// ============================================
// DOCUMENTATION FUNCTIONS
// ============================================

function createDocumentation(webAppUrl) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  var docSheet = ss.getSheetByName('Documentation');
  if (docSheet) {
    docSheet.getRange('B3').setValue(webAppUrl);
    docSheet.getRange('B5').setValue(new Date().toISOString());
    if (webAppUrl && webAppUrl.indexOf('script.google.com') !== -1) {
      docSheet.getRange('B3').setFormula('=HYPERLINK("' + webAppUrl + '", "' + webAppUrl + '")');
    }
    return;
  }
  
  docSheet = ss.insertSheet('Documentation', 0);
  
  var data = [
    ['KIJI — Kijiji Kidijitali', ''],
    ['', ''],
    ['Web App URL:', ''],
    ['', ''],
    ['Initialized:', ''],
    ['', ''],
    ['How to Use:', ''],
    ['1. Deploy your web app from Extensions > Apps Script', ''],
    ['2. After deployment, click "Fix Deployment" from the KIJI menu', ''],
    ['3. Paste your web app URL when prompted', ''],
    ['4. Click "Open Web App" from the KIJI menu to access your village', ''],
    ['', ''],
    ['Available Tabs:', ''],
    [' Outreach Campaigns — Set and track goals', ''],
    [' Community Members — Manage contacts', ''],
    [' Projects — Track initiatives', ''],
    [' Collaborations — Link people to projects', ''],
    [' Daily Log — Record activities', ''],
    ['', ''],
    ['Security:', ''],
    [' Only you can access this data', ''],
    [' Data stays in your Google Drive', ''],
    [' No third-party servers involved', ''],
    ['', ''],
    ['Need Help?', ''],
    [' Open an issue on GitHub: https://github.com/kangwa-ntema/kiji/issues', ''],
    [' Check the README: https://github.com/kangwa-ntema/kiji', '']
  ];
  
  docSheet.getRange(1, 1, data.length, 2).setValues(data);
  
  var headerRange = docSheet.getRange('A1:B1');
  headerRange.merge();
  headerRange.setFontSize(20);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#2e328a');
  headerRange.setFontColor('white');
  
  docSheet.getRange('B3').setFontSize(14);
  docSheet.getRange('B3').setFontColor('#2e328a');
  docSheet.getRange('B3').setFontWeight('bold');
  
  if (webAppUrl && webAppUrl.indexOf('script.google.com') !== -1) {
    docSheet.getRange('B3').setFormula('=HYPERLINK("' + webAppUrl + '", "' + webAppUrl + '")');
  }
  
  docSheet.setColumnWidth(1, 200);
  docSheet.setColumnWidth(2, 500);
  docSheet.setFrozenRows(6);
  
  var borderRange = docSheet.getRange('B3');
  borderRange.setBorder(true, true, true, true, false, false);
  borderRange.setBackground('#f0f4ff');
}

function showDocumentation() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var docSheet = ss.getSheetByName('Documentation');
  if (docSheet) {
    docSheet.activate();
  } else {
    createDocumentation('⚠️ Web app not yet deployed. Please deploy manually from Apps Script editor.');
    SpreadsheetApp.getUi().alert('Documentation sheet created!');
  }
}

function openWebApp() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var settings = ss.getSheetByName('_Settings');
  var webAppUrl = '';
  
  if (settings) {
    webAppUrl = settings.getRange('B6').getValue();
  }
  
  if (!webAppUrl) {
    var ui = SpreadsheetApp.getUi();
    ui.alert(
      'No Web App Found',
      'Please deploy your web app first:\n\n' +
      '1️⃣ Go to Extensions > Apps Script\n' +
      '2️⃣ Click "Deploy" > "New deployment"\n' +
      '3️⃣ Click the settings gear ⚙️ next to "Web app"\n' +
      '4️⃣ Set "Execute as" to "Me"\n' +
      '5️⃣ Set "Who has access" to "Anyone"\n' +
      '6️⃣ Click "Deploy" and copy the URL\n' +
      '7️⃣ Then click "Open Web App" again',
      ui.ButtonSet.OK
    );
    return;
  }
  
  var html = HtmlService.createHtmlOutput(
    '<html>' +
    '<body style="font-family: sans-serif; text-align: center; padding: 40px;">' +
    '<h2>Opening Your Digital Village...</h2>' +
    '<p style="margin-top: 20px;">' +
    '<a href="' + webAppUrl + '" target="_blank" style="font-size: 18px;">' +
    'Click here if it doesn\'t open automatically' +
    '</a>' +
    '</p>' +
    '<script>' +
    'window.open("' + webAppUrl + '", "_blank");' +
    'google.script.host.close();' +
    '</script>' +
    '</body>' +
    '</html>'
  )
  .setWidth(400)
  .setHeight(200);
  
  SpreadsheetApp.getUi()
    .showModalDialog(html, 'Opening KIJI');
}

function showSystemStatus() {
  var ui = SpreadsheetApp.getUi();
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheets = ss.getSheets();
  var settings = ss.getSheetByName('_Settings');
  
  var status = 'KIJI System Status\n\n';
  
  if (settings) {
    var webAppUrl = settings.getRange('B6').getValue();
    var deploymentId = settings.getRange('B7').getValue();
    
    status += 'Web App: ' + (webAppUrl || 'Not deployed') + '\n';
    if (deploymentId) {
      status += 'Deployment ID: ' + deploymentId + '\n';
    }
    status += '\n';
  } else {
    status += 'Village not yet initialized.\n';
    status += 'Click "Initialize Village" from the KIJI menu.\n\n';
  }
  
  status += 'Total Sheets: ' + sheets.length + '\n\n';
  status += 'Sheets Found:\n';
  
  sheets.forEach(function(sheet) {
    var lastRow = sheet.getLastRow();
    var lastCol = sheet.getLastColumn();
    var hidden = sheet.isSheetHidden() ? ' (hidden)' : '';
    status += ' ' + sheet.getName() + ': ' + (lastRow - 1) + ' rows of data' + hidden + '\n';
  });
  
  ui.alert('KIJI Status', status, ui.ButtonSet.OK);
}

function showReinitializeDialog() {
  var ui = SpreadsheetApp.getUi();
  var response = ui.alert(
    'Re-initialize Village',
    'This will DELETE all your data and reset everything to default.\n\n' +
    'Your web app link will remain.\n\n' +
    'This action CANNOT be undone.\n\n' +
    'Do you want to continue?',
    ui.ButtonSet.YES_NO
  );
  
  if (response === ui.Button.YES) {
    var result = initializeVillage();
    if (result.success) {
      ui.alert('Success!', 'Your Digital Village has been re-initialized!', ui.ButtonSet.OK);
    } else {
      ui.alert('Error!', result.error, ui.ButtonSet.OK);
    }
  }
}