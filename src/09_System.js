// ============================================
// RESET & NORMALIZE ALL SHEETS
// ============================================

function resetAllSheets() {
  const ss = getSpreadsheet();
  
  // Delete existing sheets if they exist (including summary sheet)
  const sheetsToDelete = ['Outreach Targets', 'Contacts', 'Projects', 'Collaborations', 'Daily Log', 'Normalization Summary'];
  sheetsToDelete.forEach(sheetName => {
    const sheet = ss.getSheetByName(sheetName);
    if (sheet) ss.deleteSheet(sheet);
  });
  
  // Create normalized sheets
  createNormalizedOutreachTargets();
  createNormalizedContacts();
  createNormalizedProjects();
  createNormalizedCollaborations();
  createNormalizedDailyLog();
  
  return { success: true, message: 'All sheets have been reset and normalized!' };
}

function createNormalizedOutreachTargets() {
  const ss = getSpreadsheet();
  const sheet = ss.insertSheet('Outreach Targets');
  
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
  
  // Add data validation for Type
  const typeRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(OUTREACH_TYPES)
    .build();
  sheet.getRange('C:C').setDataValidation(typeRule);
  
  // Add default targets
  addDefaultOutreachTargets();
}

function createNormalizedContacts() {
  const ss = getSpreadsheet();
  const sheet = ss.insertSheet('Contacts');
  
  const headers = [
    'ID', 'Name', 'Phone', 'Email', 'Institution', 'Course', 'Year', 
    'Source', 'Status', 'Lead Score', 'Interests', 'Skills', 
    'LinkedIn', 'Facebook', 'Twitter', 'Instagram', 'Notes', 
    'First Contact', 'Last Contact', 'Follow Up Date', 'Converted', 
    'Conversion Date', 'Created At', 'Updated At'
  ];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
  sheet.setFrozenRows(1);
  
  // Set Phone column to plain text format to prevent #ERROR!
  const phoneColumn = sheet.getRange('C:C');
  phoneColumn.setNumberFormat('@');
  
  // Add data validation for Status
  const statusRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['New Lead', 'Contacted', 'Interested', 'Follow-up', 'Converted', 'Lost'])
    .build();
  sheet.getRange('I:I').setDataValidation(statusRule);
  
  // Add data validation for Source
  const sourceRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Direct Pitch', 'Online DM', 'Referral', 'Event', 'Website', 'Other'])
    .build();
  sheet.getRange('H:H').setDataValidation(sourceRule);
}

function createNormalizedProjects() {
  const ss = getSpreadsheet();
  const sheet = ss.insertSheet('Projects');
  
  const headers = [
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
  const ss = getSpreadsheet();
  const sheet = ss.insertSheet('Collaborations');
  
  const headers = [
    'ID', 'Contact ID', 'Contact Name', 'Project ID', 'Project Name', 
    'Role', 'Status', 'Joined Date', 'Contributions', 'Notes', 
    'Created At', 'Updated At'
  ];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
  sheet.setFrozenRows(1);
}

function createNormalizedDailyLog() {
  const ss = getSpreadsheet();
  const sheet = ss.insertSheet('Daily Log');
  
  const headers = [
    'ID', 'Date', 'Outreach ID', 'Outreach Name', 'Outreach Type',
    'Actual', 'Target', 'Minimum Target', 'Progress %', 
    'Met Minimum', 'Notes', 'Created At', 'Updated At'
  ];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
  sheet.setFrozenRows(1);
}


// ============================================
// MASTER NORMALIZATION FUNCTION
// ============================================

/**
 * MASTER FUNCTION: Run this to completely reset and normalize all sheets
 */
function normalizeAllSheets() {
  try {
    console.log('🚀 Starting complete sheet normalization...');
    
    // Step 1: Reset all sheets (delete and recreate)
    console.log('📝 Step 1: Resetting all sheets...');
    const resetResult = resetAllSheets();
    
    if (!resetResult.success) {
      throw new Error('Failed to reset sheets');
    }
    console.log('✓ Sheets reset successfully');
    
    // Step 2: Add sample data
    console.log('📝 Step 2: Adding sample data...');
    addSampleContacts();
    addSampleProjects();
    addSampleDailyLogs();
    addSampleCollaborations();
    
    console.log('✅ Normalization complete! All sheets are properly structured.');
    
    // Show summary in spreadsheet (delete existing if present)
    const ss = getSpreadsheet();
    let summarySheet = ss.getSheetByName('Normalization Summary');
    if (summarySheet) ss.deleteSheet(summarySheet);
    
    summarySheet = ss.insertSheet('Normalization Summary', 0);
    const now = new Date();
    
    summarySheet.getRange(1, 1).setValue('Normalization Completed At:');
    summarySheet.getRange(1, 2).setValue(now.toLocaleString());
    summarySheet.getRange(2, 1).setValue('Sheets Created:');
    summarySheet.getRange(3, 1).setValue('✓ Outreach Targets');
    summarySheet.getRange(4, 1).setValue('✓ Contacts');
    summarySheet.getRange(5, 1).setValue('✓ Projects');
    summarySheet.getRange(6, 1).setValue('✓ Collaborations');
    summarySheet.getRange(7, 1).setValue('✓ Daily Log');
    summarySheet.getRange(2, 2).setValue('5 sheets total');
    summarySheet.getRange(3, 2).setValue('Default targets added');
    summarySheet.getRange(4, 2).setValue('3 sample contacts');
    summarySheet.getRange(5, 2).setValue('2 sample projects');
    summarySheet.getRange(6, 2).setValue('2 sample collaborations');
    summarySheet.getRange(7, 2).setValue('2 sample entries');
    
    summarySheet.getRange(1, 1, 7, 2).setFontWeight('bold');
    summarySheet.autoResizeColumns(1, 2);
    
    // Fix phone number formatting for all contacts
    fixPhoneColumnFormatting();
    
    return {
      success: true,
      message: 'All sheets have been normalized! Check the "Normalization Summary" sheet for details.',
      sheets: ['Outreach Targets', 'Contacts', 'Projects', 'Collaborations', 'Daily Log'],
      timestamp: now.toISOString()
    };
    
  } catch(e) {
    console.error('❌ Error during normalization:', e);
    return {
      success: false,
      error: e.toString(),
      message: 'Normalization failed. Check the execution log for details.'
    };
  }
}

/**
 * Fix phone column formatting to prevent #ERROR!
 */
function fixPhoneColumnFormatting() {
  const ss = getSpreadsheet();
  const sheet = ss.getSheetByName('Contacts');
  if (!sheet) return;
  
  // Set the entire Phone column to text format
  const phoneColumn = sheet.getRange('C:C');
  phoneColumn.setNumberFormat('@');
  
  const data = sheet.getDataRange().getValues();
  let fixed = 0;
  
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const phoneValue = row[2];
    
    if (phoneValue && phoneValue.toString().trim()) {
      let cleanPhone = formatPhoneNumberForStorage(phoneValue.toString());
      if (cleanPhone !== phoneValue) {
        const cell = sheet.getRange(i + 1, 3);
        cell.setValue(cleanPhone);
        cell.setNumberFormat('@');
        fixed++;
      }
    }
  }
  
  console.log(`✓ Fixed ${fixed} phone numbers with proper formatting`);
}

/**
 * Add sample contacts for testing (with properly formatted phones)
 */
function addSampleContacts() {
  const ss = getSpreadsheet();
  const sheet = ss.getSheetByName('Contacts');
  if (!sheet) return;
  
  const now = new Date().toISOString();
  const lastWeek = new Date();
  lastWeek.setDate(lastWeek.getDate() - 7);
  
  // Format phone numbers properly without spaces
  const sampleContacts = [
    {
      id: generateId(),
      name: 'Claude Phiri',
      phone: '+260978413647',
      email: 'claude.phiri@icu.edu.zm',
      institution: 'Information Communication University',
      course: 'Social Science',
      year: '3',
      source: 'Direct Pitch',
      status: 'New Lead',
      leadScore: 50,
      interests: 'Web Development, AI, Data Science',
      skills: 'JavaScript, Python, HTML/CSS',
      linkedin: 'https://linkedin.com/in/claude-phiri',
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
      name: 'Sharon Moyo',
      phone: '+263719676795',
      email: 'sharon.moyo@apex.ac.zw',
      institution: 'Apex University',
      course: 'Nursing',
      year: '2',
      source: 'Direct Pitch',
      status: 'Interested',
      leadScore: 65,
      interests: 'Healthcare Tech, Medical Apps',
      skills: 'Communication, Patient Care, Basic IT',
      linkedin: '',
      facebook: 'https://facebook.com/sharon.moyo',
      twitter: '',
      instagram: 'https://instagram.com/sharon_moyo',
      notes: 'Very interested in the platform.',
      firstContact: now,
      lastContact: now,
      followUp: '2026-06-18',
      converted: false,
      conversionDate: ''
    },
    {
      id: generateId(),
      name: 'Michael Banda',
      phone: '+260965551234',
      email: 'michael.banda@unza.zm',
      institution: 'University of Zambia',
      course: 'Computer Science',
      year: '4',
      source: 'Online DM',
      status: 'Converted',
      leadScore: 85,
      interests: 'Software Engineering, Mobile Apps',
      skills: 'React Native, Firebase, Node.js, MongoDB',
      linkedin: 'https://linkedin.com/in/michael-banda',
      facebook: '',
      twitter: 'https://twitter.com/mike_banda',
      instagram: '',
      notes: 'Already signed up and actively using the platform.',
      firstContact: '2026-06-01T10:00:00.000Z',
      lastContact: '2026-06-05T14:30:00.000Z',
      followUp: '',
      converted: true,
      conversionDate: '2026-06-02T09:15:00.000Z'
    }
  ];
  
  sampleContacts.forEach(contact => {
    const rowData = [
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
    
    // Format the phone cell as text
    const lastRow = sheet.getLastRow();
    const phoneCell = sheet.getRange(lastRow, 3);
    phoneCell.setNumberFormat('@');
    phoneCell.setValue(contact.phone);
  });
  
  console.log(`✓ Added ${sampleContacts.length} sample contacts with proper phone formatting`);
}

/**
 * Add sample projects for testing
 */
function addSampleProjects() {
  const ss = getSpreadsheet();
  const sheet = ss.getSheetByName('Projects');
  if (!sheet) return;
  
  const now = new Date().toISOString();
  const nextMonth = new Date();
  nextMonth.setMonth(nextMonth.getMonth() + 1);
  const twoMonths = new Date();
  twoMonths.setMonth(twoMonths.getMonth() + 2);
  
  const sampleProjects = [
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
  
  sampleProjects.forEach(project => {
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
  
  console.log(`✓ Added ${sampleProjects.length} sample projects`);
}

/**
 * Add sample collaborations for testing
 */
function addSampleCollaborations() {
  const ss = getSpreadsheet();
  const sheet = ss.getSheetByName('Collaborations');
  if (!sheet) return;
  
  const now = new Date().toISOString();
  
  const contactsSheet = ss.getSheetByName('Contacts');
  const projectsSheet = ss.getSheetByName('Projects');
  
  if (!contactsSheet || !projectsSheet) return;
  
  const contacts = contactsSheet.getDataRange().getValues();
  const projects = projectsSheet.getDataRange().getValues();
  
  if (contacts.length < 2 || projects.length < 2) return;
  
  const sampleCollaborations = [
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
  
  sampleCollaborations.forEach(collab => {
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
  
  console.log(`✓ Added ${sampleCollaborations.length} sample collaborations`);
}

/**
 * Add sample daily log entries for testing
 */
function addSampleDailyLogs() {
  const ss = getSpreadsheet();
  const sheet = ss.getSheetByName('Daily Log');
  if (!sheet) return;
  
  const now = new Date().toISOString();
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];
  
  const outreachSheet = ss.getSheetByName('Outreach Targets');
  
  const sampleEntries = [];
  
  if (outreachSheet) {
    const outreachTargets = outreachSheet.getDataRange().getValues();
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
  
  sampleEntries.forEach(entry => {
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
  
  console.log(`✓ Added ${sampleEntries.length} sample daily log entries`);
}

/**
 * Add default outreach targets
 */
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
  
  const now = new Date().toISOString();
  defaultTargets.forEach(target => {
    addOutreachTarget(target);
  });
  
  console.log(`✓ Added ${defaultTargets.length} default outreach targets`);
}


// ============================================
// DEPLOYMENT & AUTO-INITIALIZATION FUNCTIONS
// ============================================

/**
 * AUTO-INITIALIZATION: Runs when sheet is opened
 * Checks if this is a fresh copy and auto-initializes
 */
function onOpen() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ui = SpreadsheetApp.getUi();
  
  // Check if already initialized
  const settings = ss.getSheetByName('_Settings');
  
  if (!settings) {
    // Fresh copy - auto-initialize
    try {
      // Run initialization in background
      const result = fullInitialization();
      
      if (result.success) {
        // Show success message with link to Doc
        ui.alert(
          '🏘️ Welcome to KIJI!',
          'Your Digital Village has been set up successfully! 🎉\n\n' +
          '📄 A Google Doc has been created in your Drive with the web app link.\n' +
          '📱 Open the Doc on your mobile device and click the link to access your village.\n\n' +
          'You can also find the 📄 Documentation sheet in this spreadsheet.',
          ui.ButtonSet.OK
        );
      }
    } catch(e) {
      console.error('Auto-initialization error:', e);
      // Show manual instructions
      ui.alert(
        '🏘️ Welcome to KIJI!',
        'Please click "Initialize Village" from the KIJI menu to set up your Digital Village.\n\n' +
        'If you have any issues, please check the README or open an issue on GitHub.',
        ui.ButtonSet.OK
      );
    }
  }
  
  // Always create the menu
  createMenu();
}

/**
 * Create the KIJI menu
 */
function createMenu() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('🏘️ KIJI')
    .addItem('📊 Open Web App', 'openWebApp')
    .addItem('📄 View Documentation', 'showDocumentation')
    .addSeparator()
    .addItem('🔄 Re-initialize Village', 'showReinitializeDialog')
    .addItem('📋 Village Status', 'showSystemStatus')
    .addSeparator()
    .addItem('🔧 Fix Phone Numbers', 'fixPhoneColumnFormatting')
    .addToUi();
}

/**
 * Full initialization - creates everything, deploys web app, creates doc
 */
function fullInitialization() {
  try {
    console.log('🏘️ Starting full initialization...');
    
    // Step 1: Normalize all sheets
    console.log('📝 Step 1: Normalizing sheets...');
    const result = normalizeAllSheets();
    if (!result.success) throw new Error(result.error);
    console.log('✓ Sheets normalized');
    
    // Step 2: Create settings sheet to track initialization
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let settings = ss.getSheetByName('_Settings');
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
    
    // Step 3: Get or create web app deployment
    console.log('🌐 Step 3: Deploying web app...');
    const deploymentInfo = deployWebApp();
    console.log('✓ Web app deployed:', deploymentInfo.url);
    
    // Step 4: Create documentation sheet with the web app link
    console.log('📄 Step 4: Creating documentation...');
    createDocumentation(deploymentInfo.url);
    console.log('✓ Documentation created');
    
    // Step 5: Create Google Doc with web app link
    console.log('📝 Step 5: Creating Google Doc...');
    const docUrl = createGoogleDoc(deploymentInfo.url);
    console.log('✓ Google Doc created:', docUrl);
    
    console.log('✅ Initialization complete!');
    
    return { 
      success: true, 
      url: deploymentInfo.url,
      docUrl: docUrl
    };
    
  } catch(e) {
    console.error('❌ Initialization error:', e);
    return { 
      success: false, 
      error: e.toString() 
    };
  }
}

/**
 * Deploy or get existing web app deployment
 */
function deployWebApp() {
  try {
    const script = ScriptApp.getProject();
    const deployments = script.getDeployments();
    let deploymentUrl = '';
    let deploymentId = '';
    
    // Look for existing HEAD deployment
    for (const deployment of deployments) {
      if (deployment.deploymentId) {
        const url = deployment.url;
        if (url) {
          deploymentUrl = url;
          deploymentId = deployment.deploymentId;
          break;
        }
      }
    }
    
    // If no deployment exists, create one
    if (!deploymentUrl) {
      const version = script.createVersion('KIJI v' + CONFIG.VERSION);
      const deployment = script.deployVersion(version, 'Web App Deployment');
      deploymentUrl = deployment.url;
      deploymentId = deployment.deploymentId;
    }
    
    return { 
      success: true, 
      url: deploymentUrl, 
      deploymentId: deploymentId 
    };
    
  } catch(e) {
    console.error('Deployment error:', e);
    // Fallback - generate likely URL
    const scriptId = ScriptApp.getScriptId();
    const fallbackUrl = `https://script.google.com/macros/s/${scriptId}/exec`;
    return { success: true, url: fallbackUrl };
  }
}

/**
 * Create documentation sheet with web app link
 */
function createDocumentation(webAppUrl) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // Check if documentation already exists
  let docSheet = ss.getSheetByName('📄 Documentation');
  if (docSheet) {
    docSheet.getRange('B3').setValue(webAppUrl);
    docSheet.getRange('B5').setValue(new Date().toISOString());
    docSheet.getRange('B3').setFormula(`=HYPERLINK("${webAppUrl}", "${webAppUrl}")`);
    return;
  }
  
  // Create new documentation sheet
  docSheet = ss.insertSheet('📄 Documentation', 0);
  
  // Set up documentation
  const data = [
    ['🏘️ KIJI — Kijiji Kidijitali', ''],
    ['', ''],
    ['🌐 Web App URL:', ''],
    ['', ''],
    ['📅 Initialized:', ''],
    ['', ''],
    ['📌 How to Use:', ''],
    ['1. Click the link above to open your Digital Village', ''],
    ['2. Bookmark the link for easy access', ''],
    ['3. Use the KIJI menu in this spreadsheet for admin', ''],
    ['', ''],
    ['📊 Available Tabs:', ''],
    ['• Outreach Campaigns — Set and track goals', ''],
    ['• Community Members — Manage contacts', ''],
    ['• Projects — Track initiatives', ''],
    ['• Collaborations — Link people to projects', ''],
    ['• Daily Log — Record activities', ''],
    ['', ''],
    ['🔒 Security:', ''],
    ['• Only you can access this data', ''],
    ['• Data stays in your Google Drive', ''],
    ['• No third-party servers involved', ''],
    ['', ''],
    ['📞 Need Help?', ''],
    ['• Open an issue on GitHub: https://github.com/kangwa-ntema/kiji/issues', ''],
    ['• Check the README: https://github.com/kangwa-ntema/kiji', '']
  ];
  
  docSheet.getRange(1, 1, data.length, 2).setValues(data);
  
  // Format
  const headerRange = docSheet.getRange('A1:B1');
  headerRange.merge();
  headerRange.setFontSize(20);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#2e328a');
  headerRange.setFontColor('white');
  
  // Style the URL
  docSheet.getRange('B3').setFontSize(16);
  docSheet.getRange('B3').setFontColor('#2e328a');
  docSheet.getRange('B3').setFontWeight('bold');
  docSheet.getRange('B3').setFormula(`=HYPERLINK("${webAppUrl}", "${webAppUrl}")`);
  
  // Set column widths
  docSheet.setColumnWidth(1, 200);
  docSheet.setColumnWidth(2, 500);
  
  // Freeze first rows
  docSheet.setFrozenRows(6);
  
  // Add border to URL cell
  const borderRange = docSheet.getRange('B3');
  borderRange.setBorder(true, true, true, true, false, false);
  borderRange.setBackground('#f0f4ff');
}

/**
 * Create a Google Doc with the web app link
 * Returns the Doc URL
 */
function createGoogleDoc(webAppUrl) {
  try {
    // Get the spreadsheet's parent folder
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const parentFolder = DriveApp.getFileById(ss.getId()).getParents().next();
    
    // Create the Doc content
    const content = `
      🏘️ KIJI — Kijiji Kidijitali (Digital Village)
      =============================================
      
      Your Digital Village is ready! 🎉
      
      📱 Web App Link:
      ${webAppUrl}
      
      Click the link above to open your Digital Village on any device.
      
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      
      📊 What You Can Do:
      
      • 📊 Dashboard — Real-time community stats
      • 🎯 Outreach Campaigns — Set and track goals
      • 👥 Community Members — Manage contacts
      • 🚀 Projects — Track initiatives
      • 📝 Daily Activity Log — Record engagement
      • 📈 Reports — Understand your community
      
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      
      📱 Mobile Access:
      
      1. Open this Doc on your mobile device
      2. Tap the web app link above
      3. Bookmark the page for easy access
      
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      
      📋 Admin Access:
      
      Open the Google Sheet to manage your data.
      Use the 🏘️ KIJI menu for admin functions.
      
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      
      📞 Need Help?
      
      • GitHub: https://github.com/kangwa-ntema/kiji
      • Issues: https://github.com/kangwa-ntema/kiji/issues
      
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      
      Made with ❤️ in Zambia
      Karibu sana! (You're very welcome!)
    `;
    
    // Create the Doc
    const doc = DocumentApp.create('🏘️ KIJI — Your Digital Village');
    const body = doc.getBody();
    
    // Add content with formatting
    const paragraphs = content.split('\n');
    for (let i = 0; i < paragraphs.length; i++) {
      const line = paragraphs[i].trim();
      if (line === '') {
        body.appendParagraph('');
        continue;
      }
      
      const paragraph = body.appendParagraph(line);
      
      // Format headers
      if (line.startsWith('🏘️') || line.startsWith('📱') || line.startsWith('📊') || 
          line.startsWith('📋') || line.startsWith('📞') || line.startsWith('━')) {
        paragraph.setHeading(DocumentApp.ParagraphHeading.HEADING1);
        paragraph.setFontSize(18);
        paragraph.setForegroundColor('#2e328a');
      }
      
      // Format the web app link
      if (line.startsWith('http') || line.includes('script.google.com')) {
        paragraph.setLinkUrl(line);
        paragraph.setFontSize(20);
        paragraph.setForegroundColor('#2e328a');
        paragraph.setBold(true);
      }
    }
    
    // Save the doc
    doc.saveAndClose();
    
    // Move the Doc to the same folder as the spreadsheet
    const docFile = DriveApp.getFileById(doc.getId());
    parentFolder.addFile(docFile);
    
    // Remove from root folder
    const rootFolder = DriveApp.getRootFolder();
    if (rootFolder.getFilesByName(docFile.getName()).hasNext()) {
      rootFolder.removeFile(docFile);
    }
    
    // Get the shareable link
    const docUrl = doc.getUrl();
    
    console.log('📝 Google Doc created:', docUrl);
    
    return docUrl;
    
  } catch(e) {
    console.error('Error creating Google Doc:', e);
    // Return the web app URL as fallback
    return webAppUrl;
  }
}

/**
 * Show re-initialization dialog with warning
 */
function showReinitializeDialog() {
  const ui = SpreadsheetApp.getUi();
  const response = ui.alert(
    '⚠️ Re-initialize Village',
    'This will DELETE all your data and reset everything to default.\n\n' +
    'Your web app link will remain the same.\n\n' +
    'This action CANNOT be undone.\n\n' +
    'Do you want to continue?',
    ui.ButtonSet.YES_NO
  );
  
  if (response === ui.Button.YES) {
    const result = fullInitialization();
    if (result.success) {
      ui.alert('✅ Success!', 'Your Digital Village has been re-initialized!', ui.ButtonSet.OK);
    } else {
      ui.alert('❌ Error!', result.error, ui.ButtonSet.OK);
    }
  }
}

/**
 * Open web app in browser
 */
function openWebApp() {
  const deployment = deployWebApp();
  if (deployment.success && deployment.url) {
    const html = HtmlService.createHtmlOutput(`
      <html>
        <body style="font-family: sans-serif; text-align: center; padding: 40px;">
          <h2>🏘️ Opening Your Digital Village...</h2>
          <p style="margin-top: 20px;">
            <a href="${deployment.url}" target="_blank" style="font-size: 18px;">
              Click here if it doesn't open automatically
            </a>
          </p>
          <script>
            window.open('${deployment.url}', '_blank');
            google.script.host.close();
          </script>
        </body>
      </html>
    `)
    .setWidth(400)
    .setHeight(200);
    
    SpreadsheetApp.getUi()
      .showModalDialog(html, '🌐 Opening KIJI');
  } else {
    SpreadsheetApp.getUi().alert('Error', 'Could not get web app URL.', ui.ButtonSet.OK);
  }
}

/**
 * Show documentation sheet
 */
function showDocumentation() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const docSheet = ss.getSheetByName('📄 Documentation');
  if (docSheet) {
    docSheet.activate();
  } else {
    // Create if missing
    const deployment = deployWebApp();
    createDocumentation(deployment.url);
    SpreadsheetApp.getUi().alert('📄 Documentation sheet created!');
  }
}

/**
 * Show system status (updated with web app info)
 */
function showSystemStatus() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheets = ss.getSheets();
  const deployment = deployWebApp();
  
  let status = '📊 KIJI System Status\n\n';
  status += `🌐 Web App: ${deployment.url || 'Not deployed'}\n\n`;
  status += `📄 Total Sheets: ${sheets.length}\n\n`;
  status += '📋 Sheets Found:\n';
  
  sheets.forEach(sheet => {
    const lastRow = sheet.getLastRow();
    const lastCol = sheet.getLastColumn();
    const hidden = sheet.isSheetHidden() ? ' (hidden)' : '';
    status += `• ${sheet.getName()}: ${lastRow - 1} rows of data${hidden}\n`;
  });
  
  const ui = SpreadsheetApp.getUi();
  ui.alert('📊 KIJI Status', status, ui.ButtonSet.OK);
}

/**
 * Show welcome dialog (for mobile-friendly setup)
 */
function showWelcomeDialog() {
  const ui = SpreadsheetApp.getUi();
  ui.alert(
    '🏘️ Welcome to KIJI!',
    'Your Digital Village is being set up...\n\n' +
    '⏳ This takes about 10-15 seconds.\n\n' +
    '📄 A Google Doc will be created with your web app link.\n' +
    '📱 Open it on your mobile device to access your village!',
    ui.ButtonSet.OK
  );
}