// 08_Dashboard.gs

// ============================================
// COMPREHENSIVE DASHBOARD STATS
// ============================================

function getDashboardStats() {
  try {
    var contacts = getContacts().data;
    var projects = getProjects().data;
    var collaborations = getCollaborations().data;
    var entries = getAllEntries().data;
    var targets = getOutreachTargets().data;
    
    // Calculate date ranges
    var now = new Date();
    var today = new Date().toISOString().split('T')[0];
    var weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    var monthAgo = new Date();
    monthAgo.setDate(monthAgo.getDate() - 30);
    var weekAgoStr = weekAgo.toISOString().split('T')[0];
    var monthAgoStr = monthAgo.toISOString().split('T')[0];
    
    // Contact analytics
    var totalContacts = contacts.length;
    var convertedLeads = contacts.filter(function(c) { return c.converted === true; });
    var conversionRate = totalContacts > 0 ? Math.round((convertedLeads.length / totalContacts) * 100) : 0;
    var avgLeadScore = totalContacts > 0 ? Math.round(contacts.reduce(function(sum, c) { return sum + (c.leadScore || 0); }, 0) / totalContacts) : 0;
    
    // Lead score distribution
    var highScore = contacts.filter(function(c) { return (c.leadScore || 0) >= 70; });
    var mediumScore = contacts.filter(function(c) { return (c.leadScore || 0) >= 40 && (c.leadScore || 0) < 70; });
    var lowScore = contacts.filter(function(c) { return (c.leadScore || 0) < 40; });
    
    // Status breakdown
    var statusCounts = {};
    ['New Lead', 'Contacted', 'Interested', 'Follow-up', 'Converted', 'Lost'].forEach(function(status) {
      statusCounts[status] = contacts.filter(function(c) { return c.status === status; }).length;
    });
    
    // Source breakdown
    var sourceCounts = {};
    ['Direct Pitch', 'Online DM', 'Referral', 'Event', 'Website', 'Other'].forEach(function(source) {
      sourceCounts[source] = contacts.filter(function(c) { return c.source === source; }).length;
    });
    
    // Institution breakdown
    var institutionCounts = {};
    contacts.forEach(function(c) {
      if (c.institution) {
        institutionCounts[c.institution] = (institutionCounts[c.institution] || 0) + 1;
      }
    });
    var topInstitutions = Object.keys(institutionCounts)
      .sort(function(a, b) { return institutionCounts[b] - institutionCounts[a]; })
      .slice(0, 5)
      .map(function(name) { return { name: name, count: institutionCounts[name] }; });
    
    // Year breakdown
    var yearCounts = {};
    ['1', '2', '3', '4', '5+'].forEach(function(year) {
      yearCounts[year] = contacts.filter(function(c) { return c.year === year; }).length;
    });
    
    // Activity analytics
    var todayEntries = entries.filter(function(e) { return e.date === today; });
    var weekEntries = entries.filter(function(e) { return e.date >= weekAgoStr; });
    var monthEntries = entries.filter(function(e) { return e.date >= monthAgoStr; });
    
    // Calculate progress totals
    var totalActual = 0;
    var totalTarget = 0;
    entries.forEach(function(e) {
      totalActual += e.actual || 0;
      totalTarget += e.target || 0;
    });
    var overallProgress = totalTarget > 0 ? Math.round((totalActual / totalTarget) * 100) : 0;
    
    // Daily average
    var uniqueDays = {};
    entries.forEach(function(e) {
      uniqueDays[e.date] = true;
    });
    var dayCount = Object.keys(uniqueDays).length || 1;
    var avgDaily = Math.round(totalActual / dayCount);
    
    // Project analytics
    var totalProjects = projects.length;
    var openProjects = projects.filter(function(p) { return p.status === 'Open'; });
    var inProgressProjects = projects.filter(function(p) { return p.status === 'In Progress'; });
    var completedProjects = projects.filter(function(p) { return p.status === 'Completed'; });
    var totalParticipants = projects.reduce(function(sum, p) { return sum + (p.currentParticipants || 0); }, 0);
    var avgParticipants = totalProjects > 0 ? Math.round(totalParticipants / totalProjects) : 0;
    
    // Collaboration analytics
    var totalCollaborations = collaborations.length;
    var activeCollaborations = collaborations.filter(function(c) { return c.status === 'Active'; });
    var pendingCollaborations = collaborations.filter(function(c) { return c.status === 'Pending'; });
    
    // Outreach target progress
    var targetProgress = [];
    if (targets && targets.length > 0) {
      targets.slice(0, 5).forEach(function(target) {
        var targetEntries = entries.filter(function(e) { return e.metric === target.name; });
        var actual = targetEntries.reduce(function(sum, e) { return sum + e.actual; }, 0);
        var progress = target.dailyTarget > 0 ? Math.round((actual / target.dailyTarget) * 100) : 0;
        targetProgress.push({
          name: target.name,
          actual: actual,
          target: target.dailyTarget,
          progress: Math.min(progress, 100)
        });
      });
    }
    
    // Recent activity (last 7 days)
    var recentActivity = [];
    for (var d = 6; d >= 0; d--) {
      var date = new Date();
      date.setDate(date.getDate() - d);
      var dateStr = date.toISOString().split('T')[0];
      var dayEntries = entries.filter(function(e) { return e.date === dateStr; });
      var dayTotal = dayEntries.reduce(function(sum, e) { return sum + e.actual; }, 0);
      recentActivity.push({
        date: dateStr,
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        count: dayTotal,
        entries: dayEntries.length
      });
    }
    
    // Lead conversion over time (last 30 days)
    var conversionTimeline = [];
    for (var d2 = 29; d2 >= 0; d2--) {
      var date2 = new Date();
      date2.setDate(date2.getDate() - d2);
      var dateStr2 = date2.toISOString().split('T')[0];
      var convertedOnDate = contacts.filter(function(c) {
        return c.conversionDate && c.conversionDate.split('T')[0] === dateStr2;
      });
      conversionTimeline.push({
        date: dateStr2,
        converted: convertedOnDate.length
      });
    }
    
    return {
      success: true,
      data: {
        // Summary stats
        summary: {
          totalLeads: totalContacts,
          convertedLeads: convertedLeads.length,
          conversionRate: conversionRate,
          avgLeadScore: avgLeadScore,
          totalProjects: totalProjects,
          totalCollaborations: totalCollaborations,
          totalActivities: entries.length,
          overallProgress: overallProgress,
          avgDailyActivity: avgDaily
        },
        
        // Lead analytics
        leads: {
          byStatus: statusCounts,
          bySource: sourceCounts,
          byYear: yearCounts,
          byInstitution: topInstitutions,
          leadScoreDistribution: {
            high: highScore.length,
            medium: mediumScore.length,
            low: lowScore.length
          },
          conversionTimeline: conversionTimeline
        },
        
        // Activity analytics
        activity: {
          today: todayEntries.length,
          thisWeek: weekEntries.length,
          thisMonth: monthEntries.length,
          recentActivity: recentActivity,
          targetProgress: targetProgress
        },
        
        // Project analytics
        projects: {
          total: totalProjects,
          open: openProjects.length,
          inProgress: inProgressProjects.length,
          completed: completedProjects.length,
          totalParticipants: totalParticipants,
          avgParticipants: avgParticipants
        },
        
        // Collaboration analytics
        collaborations: {
          total: totalCollaborations,
          active: activeCollaborations.length,
          pending: pendingCollaborations.length
        }
      }
    };
  } catch(e) {
    console.error('Dashboard error:', e);
    return { success: false, error: e.toString() };
  }
}