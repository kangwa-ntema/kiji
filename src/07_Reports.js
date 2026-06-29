// 07_Reports.gs

// ============================================
// REPORTING FUNCTIONS
// ============================================

function getFilteredContacts(filters) {
  try {
    const allContacts = getContacts().data;
    let filtered = allContacts;
    
    if (filters.status && filters.status !== '') {
      filtered = filtered.filter(c => c.status === filters.status);
    }
    if (filters.source && filters.source !== '') {
      filtered = filtered.filter(c => c.source === filters.source);
    }
    if (filters.dateFrom && filters.dateFrom !== '') {
      filtered = filtered.filter(c => c.firstContact && c.firstContact.split('T')[0] >= filters.dateFrom);
    }
    if (filters.dateTo && filters.dateTo !== '') {
      filtered = filtered.filter(c => c.firstContact && c.firstContact.split('T')[0] <= filters.dateTo);
    }
    
    return { success: true, data: filtered };
  } catch(e) {
    return { success: false, error: e.toString(), data: [] };
  }
}

function generateReport(reportType, filters) {
  try {
    const contacts = getFilteredContacts(filters).data;
    const projects = getProjects().data;
    const entries = getAllEntries().data;
    
    let report = {
      generatedAt: new Date().toISOString(),
      summary: {
        totalContacts: contacts.length,
        totalProjects: projects.length,
        totalEntries: entries.length,
        convertedLeads: contacts.filter(c => c.converted === true).length,
        avgLeadScore: contacts.length > 0 ? Math.round(contacts.reduce((s, c) => s + (c.leadScore || 0), 0) / contacts.length) : 0
      },
      breakdown: {
        byStatus: {},
        bySource: {},
        byYear: {},
        leadScoreDistribution: { high: 0, medium: 0, low: 0 },
        topInstitutions: []
      },
      recentActivity: 0,
      projectStats: { total: 0, open: 0, inProgress: 0, completed: 0, avgParticipants: 0 }
    };
    
    // Status breakdown
    ['New Lead', 'Contacted', 'Interested', 'Follow-up', 'Converted', 'Lost'].forEach(status => {
      report.breakdown.byStatus[status] = contacts.filter(c => c.status === status).length;
    });
    
    // Source breakdown
    ['Direct Pitch', 'Online DM', 'Referral', 'Event', 'Website', 'Other'].forEach(source => {
      report.breakdown.bySource[source] = contacts.filter(c => c.source === source).length;
    });
    
    // Year breakdown
    ['1', '2', '3', '4', '5+'].forEach(year => {
      report.breakdown.byYear[year] = contacts.filter(c => c.year === year).length;
    });
    
    // Lead score distribution
    report.breakdown.leadScoreDistribution = {
      high: contacts.filter(c => (c.leadScore || 0) >= 70).length,
      medium: contacts.filter(c => (c.leadScore || 0) >= 40 && (c.leadScore || 0) < 70).length,
      low: contacts.filter(c => (c.leadScore || 0) < 40).length
    };
    
    // Top institutions
    const institutionCount = {};
    contacts.forEach(c => {
      if (c.institution) {
        institutionCount[c.institution] = (institutionCount[c.institution] || 0) + 1;
      }
    });
    report.breakdown.topInstitutions = Object.entries(institutionCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));
    
    // Recent activity
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    report.recentActivity = entries.filter(e => new Date(e.date) >= sevenDaysAgo).length;
    
    // Project stats
    report.projectStats = {
      total: projects.length,
      open: projects.filter(p => p.status === 'Open').length,
      inProgress: projects.filter(p => p.status === 'In Progress').length,
      completed: projects.filter(p => p.status === 'Completed').length,
      avgParticipants: projects.length > 0 ? Math.round(projects.reduce((s, p) => s + (p.currentParticipants || 0), 0) / projects.length) : 0
    };
    
    return { success: true, data: report };
  } catch(e) {
    return { success: false, error: e.toString() };
  }
}

function exportReportData(reportType, filters) {
  try {
    let data = [];
    let headers = [];
    
    if (reportType === 'contacts') {
      const contacts = getFilteredContacts(filters).data;
      headers = ['Name', 'Phone', 'Email', 'Institution', 'Course', 'Year', 'Source', 'Status', 'Lead Score', 'Interests', 'Skills', 'LinkedIn', 'X/Twitter', 'Facebook', 'Instagram', 'First Contact', 'Last Contact', 'Follow-up Date', 'Converted', 'Notes'];
      data = contacts.map(c => [
        c.name, c.phone || '', c.email || '', c.institution || '', c.course || '', c.year || '',
        c.source || '', c.status || '', c.leadScore || '', c.interests || '', c.skills || '',
        c.linkedin || '', c.twitter || '', c.facebook || '', c.instagram || '',
        c.firstContact ? c.firstContact.split('T')[0] : '', 
        c.lastContact ? c.lastContact.split('T')[0] : '', 
        c.followUp || '', c.converted ? 'Yes' : 'No', c.notes || ''
      ]);
    } else if (reportType === 'activities') {
      const entries = getAllEntries().data;
      headers = ['Date', 'Type', 'Metric', 'Actual', 'Target', 'Progress %', 'Notes'];
      data = entries.map(e => [e.date, e.type, e.metric, e.actual, e.target, e.progress, e.notes || '']);
    } else if (reportType === 'projects') {
      const projects = getProjects().data;
      headers = ['Project Name', 'Description', 'Category', 'Status', 'Start Date', 'End Date', 'Required Skills', 'Participants', 'Max Participants'];
      data = projects.map(p => [
        p.name, p.description || '', p.category || '', p.status || '', 
        p.startDate ? p.startDate.split('T')[0] : '', 
        p.endDate ? p.endDate.split('T')[0] : '', 
        p.skills || '', p.currentParticipants || 0, p.maxParticipants || 0
      ]);
    }
    
    const csvRows = [headers, ...data];
    const csvContent = csvRows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
    
    return { success: true, data: csvContent };
  } catch(e) {
    return { success: false, error: e.toString() };
  }
}