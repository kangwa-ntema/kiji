// 00_Config.gs

// ============================================
// CONFIGURATION
// ============================================

const CONFIG = {
  APP_NAME: 'KIJI',
  SUBTITLE: 'Kijiji Kidijitali (Digital Village)',
  VERSION: '1.0.0',
  SPREADSHEET_ID: '',
  OUTREACH_SHEET_NAME: 'Outreach Campaigns',
  DATA_SHEET_NAME: 'Daily Log',
  CONTACTS_SHEET_NAME: 'Community Members',
  PROJECTS_SHEET_NAME: 'Projects',
  COLLABORATIONS_SHEET_NAME: 'Collaborations'
};

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const OUTREACH_TYPES = ['Campus', 'Online', 'Community', 'Event', 'Social Media'];

function doGet() {
  const template = HtmlService.createTemplateFromFile('index');
  template.config = CONFIG;
  template.daysOfWeek = DAYS_OF_WEEK;
  template.outreachTypes = OUTREACH_TYPES;
  return template.evaluate()
    .setTitle(CONFIG.APP_NAME)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}