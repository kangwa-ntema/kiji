// 08_Dashboard.gs

// ============================================
// DASHBOARD STATS
// ============================================

function getDashboardStats() {
  try {
    const contacts = getContacts().data;
    const projects = getProjects().data;
    const collaborations = getCollaborations().data;
    const todayEntries = getTodayEntries().data;
    
    return {
      success: true,
      data: {
        totalLeads: contacts.length,
        convertedLeads: contacts.filter(c => c.converted === true).length,
        activeProjects: projects.filter(p => p.status === 'Open' || p.status === 'In Progress').length,
        activeCollaborations: collaborations.filter(c => c.status === 'Active').length,
        todayEntries: todayEntries.length,
        recentEntries: todayEntries.slice(0, 5)
      }
    };
  } catch(e) {
    return { success: false, error: e.toString() };
  }
}