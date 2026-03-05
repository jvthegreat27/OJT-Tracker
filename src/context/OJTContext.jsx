import React, { createContext, useContext, useState, useEffect } from 'react';

const OJTContext = createContext();

export const useOJT = () => {
  const context = useContext(OJTContext);
  if (!context) {
    throw new Error('useOJT must be used within an OJTProvider');
  }
  return context;
};

// Skill categories for heatmap
export const SKILL_CATEGORIES = [
  'Graphic Design',
  'Client Meetings',
  'Documentation',
  'Coding/Development',
  'Research',
  'Presentation',
  'Data Analysis',
  'Project Management'
];

// Daily checklist templates by department
export const DEPARTMENT_CHECKLISTS = {
  'IT/Software': [
    'Review and respond to emails',
    'Attend daily standup meeting',
    'Complete assigned coding tasks',
    'Update project documentation',
    'Test and debug code'
  ],
  'Marketing': [
    'Check social media analytics',
    'Create content for campaigns',
    'Review marketing metrics',
    'Collaborate with design team',
    'Update content calendar'
  ],
  'HR': [
    'Review applications/resumes',
    'Schedule interviews',
    'Update employee records',
    'Prepare onboarding materials',
    'Attend team meetings'
  ],
  'Finance': [
    'Process invoices',
    'Reconcile accounts',
    'Prepare financial reports',
    'Review budget allocations',
    'Update financial records'
  ],
  'General': [
    'Check and respond to emails',
    'Attend team meetings',
    'Complete assigned tasks',
    'Update progress reports',
    'Collaborate with team members'
  ]
};

// Badge definitions
export const BADGES = [
  { id: 'first_100', name: 'Century Club', description: 'Complete 100 hours', icon: '🎯', requirement: 100 },
  { id: 'first_200', name: 'Double Century', description: 'Complete 200 hours', icon: '🏅', requirement: 200 },
  { id: 'first_300', name: 'Triple Threat', description: 'Complete 300 hours', icon: '🥉', requirement: 300 },
  { id: 'first_400', name: 'Quad Champion', description: 'Complete 400 hours', icon: '🥈', requirement: 400 },
  { id: 'first_500', name: 'Half Millennium', description: 'Complete 500 hours', icon: '👑', requirement: 500 },
  { id: 'first_600', name: 'Century Plus', description: 'Complete 600 hours', icon: '💎', requirement: 600 },
  { id: 'perfect_week', name: 'Perfect Week', description: 'Log hours for 7 consecutive days', icon: '🔥', type: 'streak' },
  { id: 'early_bird', name: 'Early Bird', description: 'Clock in before 8 AM', icon: '🌅', type: 'special' },
  { id: 'night_owl', name: 'Night Owl', description: 'Clock out after 8 PM', icon: '🦉', type: 'special' },
];

export const OJTProvider = ({ children }) => {
  const [interns, setInterns] = useState(() => {
    const saved = localStorage.getItem('ojt_interns');
    return saved ? JSON.parse(saved) : [];
  });

  const [currentIntern, setCurrentIntern] = useState(() => {
    const saved = localStorage.getItem('ojt_current_intern');
    return saved ? JSON.parse(saved) : null;
  });

  const [timeLogs, setTimeLogs] = useState(() => {
    const saved = localStorage.getItem('ojt_time_logs');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeSession, setActiveSession] = useState(() => {
    const saved = localStorage.getItem('ojt_active_session');
    return saved ? JSON.parse(saved) : null;
  });

  const [journalEntries, setJournalEntries] = useState(() => {
    const saved = localStorage.getItem('ojt_journal_entries');
    return saved ? JSON.parse(saved) : [];
  });

  const [moodLogs, setMoodLogs] = useState(() => {
    const saved = localStorage.getItem('ojt_mood_logs');
    return saved ? JSON.parse(saved) : [];
  });

  const [skillsData, setSkillsData] = useState(() => {
    const saved = localStorage.getItem('ojt_skills_data');
    return saved ? JSON.parse(saved) : {};
  });

  const [customSkills, setCustomSkills] = useState(() => {
    const saved = localStorage.getItem('ojt_custom_skills');
    return saved ? JSON.parse(saved) : {};
  });

  const [signatures, setSignatures] = useState(() => {
    const saved = localStorage.getItem('ojt_signatures');
    return saved ? JSON.parse(saved) : {};
  });

  const [excludedDates, setExcludedDates] = useState(() => {
    const saved = localStorage.getItem('ojt_excluded_dates');
    return saved ? JSON.parse(saved) : {};
  });

  const [customBackgrounds, setCustomBackgrounds] = useState(() => {
    const saved = localStorage.getItem('ojt_custom_backgrounds');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem('ojt_interns', JSON.stringify(interns));
  }, [interns]);

  useEffect(() => {
    localStorage.setItem('ojt_current_intern', JSON.stringify(currentIntern));
  }, [currentIntern]);

  useEffect(() => {
    localStorage.setItem('ojt_time_logs', JSON.stringify(timeLogs));
  }, [timeLogs]);

  useEffect(() => {
    localStorage.setItem('ojt_active_session', JSON.stringify(activeSession));
  }, [activeSession]);

  useEffect(() => {
    localStorage.setItem('ojt_journal_entries', JSON.stringify(journalEntries));
  }, [journalEntries]);

  useEffect(() => {
    localStorage.setItem('ojt_mood_logs', JSON.stringify(moodLogs));
  }, [moodLogs]);

  useEffect(() => {
    localStorage.setItem('ojt_skills_data', JSON.stringify(skillsData));
  }, [skillsData]);

  useEffect(() => {
    localStorage.setItem('ojt_custom_skills', JSON.stringify(customSkills));
  }, [customSkills]);

  useEffect(() => {
    localStorage.setItem('ojt_signatures', JSON.stringify(signatures));
  }, [signatures]);

  useEffect(() => {
    localStorage.setItem('ojt_excluded_dates', JSON.stringify(excludedDates));
  }, [excludedDates]);

  useEffect(() => {
    localStorage.setItem('ojt_custom_backgrounds', JSON.stringify(customBackgrounds));
  }, [customBackgrounds]);

  // Custom background functions
  const getCustomBackground = (internId) => {
    return customBackgrounds[internId] || null;
  };

  const setCustomBackground = (imageData) => {
    if (!currentIntern) return;
    setCustomBackgrounds(prev => ({
      ...prev,
      [currentIntern.id]: imageData
    }));
  };

  const removeCustomBackground = () => {
    if (!currentIntern) return;
    const newBackgrounds = { ...customBackgrounds };
    delete newBackgrounds[currentIntern.id];
    setCustomBackgrounds(newBackgrounds);
  };

  // Profile Picture Functions
  const [profilePictures, setProfilePictures] = useState(() => {
    const saved = localStorage.getItem('ojt_profile_pictures');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem('ojt_profile_pictures', JSON.stringify(profilePictures));
  }, [profilePictures]);

  const getProfilePicture = (internId) => {
    return profilePictures[internId] || null;
  };

  const setProfilePicture = (imageData) => {
    if (!currentIntern) return;
    setProfilePictures(prev => ({
      ...prev,
      [currentIntern.id]: imageData
    }));
  };

  const removeProfilePicture = () => {
    if (!currentIntern) return;
    const newPictures = { ...profilePictures };
    delete newPictures[currentIntern.id];
    setProfilePictures(newPictures);
  };

  const addIntern = (name, username, password, establishment = '', program = '', targetHours = 500, startDate = null, studentId = '') => {
    const newIntern = {
      id: Date.now().toString(),
      name,
      username,
      studentId,
      password, // In production, this should be hashed
      establishment,
      program,
      targetHours,
      startDate: startDate || new Date().toISOString(),
      createdAt: new Date().toISOString(),
      earnedBadges: [],
      profilePicture: null,
    };
    setInterns([...interns, newIntern]);
    // Initialize skills data for new intern
    setSkillsData(prev => ({
      ...prev,
      [newIntern.id]: SKILL_CATEGORIES.reduce((acc, skill) => ({ ...acc, [skill]: 0 }), {})
    }));
    // Initialize custom skills for new intern (empty by default)
    setCustomSkills(prev => ({
      ...prev,
      [newIntern.id]: []
    }));
    // Initialize excluded dates for new intern
    setExcludedDates(prev => ({
      ...prev,
      [newIntern.id]: []
    }));
    return newIntern;
  };

  const loginIntern = (usernameOrStudentId, password) => {
    // Check if login is by username or studentId
    const intern = interns.find(i => 
      (i.username === usernameOrStudentId || i.studentId === usernameOrStudentId) && 
      i.password === password
    );
    if (intern) {
      setCurrentIntern(intern);
      return { success: true, intern };
    }
    return { success: false, error: 'Invalid username/student ID or password' };
  };

  const logoutIntern = () => {
    setCurrentIntern(null);
    setActiveSession(null);
  };

  const timeIn = () => {
    if (!currentIntern) return false;
    
    const session = {
      id: Date.now().toString(),
      internId: currentIntern.id,
      timeIn: new Date().toISOString(),
      timeOut: null,
      autoTimeoutScheduled: false,
    };
    setActiveSession(session);
    
    // Schedule automatic timeout 5 minutes after 5:00 PM (5:05 PM)
    scheduleAutoTimeout(session);
    
    return true;
  };

  // Schedule automatic timeout at 5:05 PM
  const scheduleAutoTimeout = (session) => {
    if (!session || session.autoTimeoutScheduled) return;
    
    const now = new Date();
    const currentDate = now.toISOString().split('T')[0];
    
    // Set auto-timeout time to 5:05 PM (17:05)
    const autoTimeoutTime = new Date(`${currentDate}T17:05:00`);
    
    // If it's already past 5:05 PM, don't schedule (user should have already timed out)
    if (now > autoTimeoutTime) return;
    
    const timeUntilTimeout = autoTimeoutTime - now;
    
    // Mark session as having auto-timeout scheduled
    setActiveSession(prev => prev ? { ...prev, autoTimeoutScheduled: true } : null);
    
    // Schedule the auto-timeout
    setTimeout(() => {
      performAutoTimeout();
    }, timeUntilTimeout);
  };

  // Perform automatic timeout at exactly 5:05 PM
  const performAutoTimeout = () => {
    if (!activeSession || !currentIntern) return;
    
    const now = new Date();
    const timeIn = new Date(activeSession.timeIn);
    
    // Calculate duration but cap at 8 hours (work end time is 5:00 PM, not 5:05 PM)
    // The 5 minutes grace period is not counted
    const workEndTime = new Date(now);
    workEndTime.setHours(17, 0, 0, 0); // 5:00 PM
    
    let durationMs = workEndTime - timeIn;
    
    // Apply lunch break deduction (12:00 PM - 1:00 PM)
    const currentDate = now.toISOString().split('T')[0];
    const lunchStart = new Date(`${currentDate}T12:00:00`);
    const lunchEnd = new Date(`${currentDate}T13:00:00`);
    
    // If work period overlaps with lunch, deduct lunch time
    if (timeIn < lunchEnd && workEndTime > lunchStart) {
      const overlapStart = timeIn > lunchStart ? timeIn : lunchStart;
      const overlapEnd = workEndTime < lunchEnd ? workEndTime : lunchEnd;
      if (overlapEnd > overlapStart) {
        durationMs -= (overlapEnd - overlapStart);
      }
    }
    
    // Cap at 8 hours maximum
    const maxDurationMs = 8 * 60 * 60 * 1000; // 8 hours in milliseconds
    durationMs = Math.min(durationMs, maxDurationMs);
    
    const durationHours = durationMs / (1000 * 60 * 60);
    
    const completedSession = {
      ...activeSession,
      timeOut: now.toISOString(), // Actual timeout time is 5:05 PM
      workEndTime: workEndTime.toISOString(), // Work ended at 5:00 PM
      durationHours: Math.round(durationHours * 100) / 100,
      skills: [],
      isAutoTimeout: true,
    };

    setTimeLogs(prev => [...prev, completedSession]);
    setActiveSession(null);
    
    // Check and award badges
    checkAndAwardBadges(currentIntern.id, [...timeLogs, completedSession]);
    
    return completedSession;
  };

  const timeOut = (skills = []) => {
    if (!activeSession) return false;

    const now = new Date();
    const timeIn = new Date(activeSession.timeIn);
    
    // Check if it's after 5:00 PM (grace period until 5:05 PM)
    const currentDate = now.toISOString().split('T')[0];
    const workEndTime = new Date(`${currentDate}T17:00:00`);
    const gracePeriodEnd = new Date(`${currentDate}T17:05:00`);
    
    let actualTimeOut = now;
    let workEndTimeForCalc = now;
    
    // If user times out between 5:00 PM and 5:05 PM, cap work end at 5:00 PM
    if (now >= workEndTime && now <= gracePeriodEnd) {
      workEndTimeForCalc = workEndTime;
    }
    
    const durationMs = workEndTimeForCalc - timeIn;
    const durationHours = durationMs / (1000 * 60 * 60);

    const completedSession = {
      ...activeSession,
      timeOut: actualTimeOut.toISOString(),
      durationHours: Math.round(durationHours * 100) / 100,
      skills: skills || [],
    };

    setTimeLogs([...timeLogs, completedSession]);
    
    // Update skills data
    if (skills && skills.length > 0) {
      setSkillsData(prev => {
        const internSkills = prev[currentIntern.id] || {};
        const updatedSkills = { ...internSkills };
        skills.forEach(skill => {
          updatedSkills[skill] = (updatedSkills[skill] || 0) + durationHours;
        });
        return { ...prev, [currentIntern.id]: updatedSkills };
      });
    }

    // Check and award badges
    checkAndAwardBadges(currentIntern.id, [...timeLogs, completedSession]);

    setActiveSession(null);
    return completedSession;
  };

  const getInternLogs = (internId) => {
    return timeLogs.filter(log => log.internId === internId);
  };

  const getTotalHours = (internId) => {
    const logs = getInternLogs(internId);
    return logs.reduce((total, log) => total + (log.durationHours || 0), 0);
  };

  const getProgressPercentage = (internId) => {
    const intern = interns.find(i => i.id === internId);
    if (!intern) return 0;
    const totalHours = getTotalHours(internId);
    return Math.min(100, Math.round((totalHours / intern.targetHours) * 100));
  };

  const getTodayLogs = (internId) => {
    const today = new Date().toDateString();
    return timeLogs.filter(log => {
      const logDate = new Date(log.timeIn).toDateString();
      return log.internId === internId && logDate === today;
    });
  };

  const getTodayHours = (internId) => {
    const todayLogs = getTodayLogs(internId);
    return todayLogs.reduce((total, log) => total + (log.durationHours || 0), 0);
  };

  const updateIntern = (internId, updates) => {
    setInterns(interns.map(i => i.id === internId ? { ...i, ...updates } : i));
    if (currentIntern && currentIntern.id === internId) {
      setCurrentIntern({ ...currentIntern, ...updates });
    }
  };

  const deleteIntern = (internId) => {
    setInterns(interns.filter(i => i.id !== internId));
    setTimeLogs(timeLogs.filter(log => log.internId !== internId));
    setJournalEntries(journalEntries.filter(entry => entry.internId !== internId));
    setMoodLogs(moodLogs.filter(log => log.internId !== internId));
    const newSkillsData = { ...skillsData };
    delete newSkillsData[internId];
    setSkillsData(newSkillsData);
    const newCustomSkills = { ...customSkills };
    delete newCustomSkills[internId];
    setCustomSkills(newCustomSkills);
    const newExcludedDates = { ...excludedDates };
    delete newExcludedDates[internId];
    setExcludedDates(newExcludedDates);
    if (currentIntern?.id === internId) {
      setCurrentIntern(null);
      setActiveSession(null);
    }
  };

  // Excluded dates functions
  const addExcludedDate = (date, reason, type = 'absence') => {
    const newExcluded = {
      id: Date.now().toString(),
      date,
      reason,
      type, // 'weekend', 'holiday', 'absence'
    };
    
    // Add the excluded date
    setExcludedDates(prev => ({
      ...prev,
      [currentIntern.id]: [...(prev[currentIntern.id] || []), newExcluded]
    }));
    
    // Remove any time logs on the excluded date for the current intern
    const excludedDateStr = new Date(date).toDateString();
    const logsBefore = timeLogs.filter(log => log.internId === currentIntern?.id);
    const logsToRemove = logsBefore.filter(log => {
      const logDateStr = new Date(log.timeIn).toDateString();
      return logDateStr === excludedDateStr;
    });
    
    if (logsToRemove.length > 0) {
      // Remove logs from the excluded date
      setTimeLogs(prev => prev.filter(log => {
        if (log.internId !== currentIntern?.id) return true;
        const logDateStr = new Date(log.timeIn).toDateString();
        return logDateStr !== excludedDateStr;
      }));
      
      // Recalculate skills data after removing logs
      const remainingLogs = logsBefore.filter(log => {
        const logDateStr = new Date(log.timeIn).toDateString();
        return logDateStr !== excludedDateStr;
      });
      
      // Recalculate skills from remaining logs
      const newSkillsData = { ...skillsData[currentIntern?.id] };
      Object.keys(newSkillsData).forEach(skill => {
        newSkillsData[skill] = 0;
      });
      
      remainingLogs.forEach(log => {
        (log.skills || []).forEach(skill => {
          if (newSkillsData[skill] !== undefined) {
            newSkillsData[skill] += log.durationHours || 0;
          }
        });
      });
      
      setSkillsData(prev => ({
        ...prev,
        [currentIntern?.id]: newSkillsData
      }));
    }
    
    return { ...newExcluded, logsRemoved: logsToRemove.length };
  };

  const getExcludedDates = (internId) => {
    return excludedDates[internId] || [];
  };

  const removeExcludedDate = (dateId) => {
    setExcludedDates(prev => ({
      ...prev,
      [currentIntern.id]: (prev[currentIntern.id] || []).filter(d => d.id !== dateId)
    }));
  };

  // Calculate working days between start date and now, excluding weekends, holidays, and absences
  const calculateWorkingDays = (internId) => {
    const intern = interns.find(i => i.id === internId);
    if (!intern) return 0;

    const start = new Date(intern.startDate);
    const today = new Date();
    const excluded = getExcludedDates(internId);
    const excludedDateStrings = excluded.map(e => new Date(e.date).toDateString());

    let workingDays = 0;
    const current = new Date(start);

    while (current <= today) {
      const dayOfWeek = current.getDay();
      const dateString = current.toDateString();
      
      // Skip weekends (0 = Sunday, 6 = Saturday)
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        // Skip excluded dates
        if (!excludedDateStrings.includes(dateString)) {
          workingDays++;
        }
      }
      
      current.setDate(current.getDate() + 1);
    }

    return workingDays;
  };

  // Get completed days (days with at least 8 hours logged)
  const getCompletedDays = (internId) => {
    const logs = getInternLogs(internId);
    const dayHours = {};
    
    logs.forEach(log => {
      const date = new Date(log.timeIn).toDateString();
      dayHours[date] = (dayHours[date] || 0) + (log.durationHours || 0);
    });

    // Count days with at least 8 hours
    return Object.values(dayHours).filter(hours => hours >= 8).length;
  };

  // Journal functions
  const addJournalEntry = (entry) => {
    const newEntry = {
      id: Date.now().toString(),
      internId: currentIntern.id,
      date: new Date().toISOString(),
      ...entry,
    };
    setJournalEntries([...journalEntries, newEntry]);
    return newEntry;
  };

  const getInternJournals = (internId) => {
    return journalEntries.filter(entry => entry.internId === internId).sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  // Mood tracking
  const addMoodLog = (mood, note = '') => {
    const newLog = {
      id: Date.now().toString(),
      internId: currentIntern.id,
      date: new Date().toISOString(),
      mood,
      note,
    };
    setMoodLogs([...moodLogs, newLog]);
    return newLog;
  };

  const getInternMoodLogs = (internId) => {
    return moodLogs.filter(log => log.internId === internId).sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  // Skills functions
  const getInternSkills = (internId) => {
    return skillsData[internId] || SKILL_CATEGORIES.reduce((acc, skill) => ({ ...acc, [skill]: 0 }), {});
  };

  // Custom skills functions
  const getInternCustomSkills = (internId) => {
    return customSkills[internId] || [];
  };

  const addCustomSkill = (skillName) => {
    if (!currentIntern || !skillName.trim()) return null;
    
    const newSkill = {
      id: Date.now().toString(),
      name: skillName.trim(),
    };
    
    setCustomSkills(prev => ({
      ...prev,
      [currentIntern.id]: [...(prev[currentIntern.id] || []), newSkill]
    }));
    
    // Initialize skill data for this custom skill
    setSkillsData(prev => {
      const internSkills = prev[currentIntern.id] || {};
      return {
        ...prev,
        [currentIntern.id]: {
          ...internSkills,
          [newSkill.name]: 0
        }
      };
    });
    
    return newSkill;
  };

  const removeCustomSkill = (skillId) => {
    if (!currentIntern) return;
    
    const internCustomSkills = customSkills[currentIntern.id] || [];
    const skillToRemove = internCustomSkills.find(s => s.id === skillId);
    
    if (skillToRemove) {
      setCustomSkills(prev => ({
        ...prev,
        [currentIntern.id]: prev[currentIntern.id].filter(s => s.id !== skillId)
      }));
      
      // Remove from skills data as well
      setSkillsData(prev => {
        const internSkills = { ...prev[currentIntern.id] };
        delete internSkills[skillToRemove.name];
        return {
          ...prev,
          [currentIntern.id]: internSkills
        };
      });
    }
  };

  // Get all available skills (default + custom) for an intern
  const getAllAvailableSkills = (internId) => {
    const internCustomSkills = customSkills[internId] || [];
    return [...SKILL_CATEGORIES, ...internCustomSkills.map(s => s.name)];
  };

  // Badge functions
  const checkAndAwardBadges = (internId, logs) => {
    const intern = interns.find(i => i.id === internId);
    if (!intern) return;

    const totalHours = logs
      .filter(log => log.internId === internId)
      .reduce((total, log) => total + (log.durationHours || 0), 0);

    const earnedBadges = [...(intern.earnedBadges || [])];
    let newBadges = [];

    // Check hour-based badges
    BADGES.forEach(badge => {
      if (badge.requirement && totalHours >= badge.requirement && !earnedBadges.includes(badge.id)) {
        earnedBadges.push(badge.id);
        newBadges.push(badge);
      }
    });

    // Check perfect week badge
    if (!earnedBadges.includes('perfect_week')) {
      const hasPerfectWeek = checkPerfectWeek(logs, internId);
      if (hasPerfectWeek) {
        earnedBadges.push('perfect_week');
        newBadges.push(BADGES.find(b => b.id === 'perfect_week'));
      }
    }

    if (newBadges.length > 0) {
      setInterns(interns.map(i => i.id === internId ? { ...i, earnedBadges } : i));
      if (currentIntern?.id === internId) {
        setCurrentIntern({ ...currentIntern, earnedBadges });
      }
    }

    return newBadges;
  };

  const checkPerfectWeek = (logs, internId) => {
    const internLogs = logs.filter(log => log.internId === internId);
    const dates = [...new Set(internLogs.map(log => new Date(log.timeIn).toDateString()))].sort();
    
    if (dates.length < 7) return false;

    for (let i = 0; i <= dates.length - 7; i++) {
      let consecutive = 1;
      for (let j = i; j < i + 6; j++) {
        const current = new Date(dates[j]);
        const next = new Date(dates[j + 1]);
        const diff = (next - current) / (1000 * 60 * 60 * 24);
        if (diff === 1) consecutive++;
        else break;
      }
      if (consecutive >= 7) return true;
    }
    return false;
  };

  const getEarnedBadges = (internId) => {
    const intern = interns.find(i => i.id === internId);
    if (!intern || !intern.earnedBadges) return [];
    return BADGES.filter(badge => intern.earnedBadges.includes(badge.id));
  };

  // AI Weekly Report Generator
  const generateMonthlyReport = (internId, monthStartDate) => {
    const startOfMonth = new Date(monthStartDate);
    startOfMonth.setHours(0, 0, 0, 0);
    const endOfMonth = new Date(startOfMonth);
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);
    endOfMonth.setDate(0); // Last day of the month
    endOfMonth.setHours(23, 59, 59, 999);

    const monthLogs = timeLogs.filter(log => {
      const logDate = new Date(log.timeIn);
      return log.internId === internId && logDate >= startOfMonth && logDate <= endOfMonth;
    });

    const monthJournals = journalEntries.filter(entry => {
      const entryDate = new Date(entry.date);
      return entry.internId === internId && entryDate >= startOfMonth && entryDate <= endOfMonth;
    });

    const totalHours = monthLogs.reduce((sum, log) => sum + (log.durationHours || 0), 0);
    const daysWorked = [...new Set(monthLogs.map(log => new Date(log.timeIn).toDateString()))].length;

    const skillsUsed = {};
    monthLogs.forEach(log => {
      (log.skills || []).forEach(skill => {
        skillsUsed[skill] = (skillsUsed[skill] || 0) + (log.durationHours || 0);
      });
    });

    // Get month name and year
    const monthYear = startOfMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    const monthName = startOfMonth.toLocaleDateString('en-US', { month: 'long' });

    const report = {
      monthYear,
      monthName,
      periodFrom: startOfMonth.toLocaleDateString(),
      periodTo: endOfMonth.toLocaleDateString(),
      totalHours: totalHours.toFixed(1),
      daysWorked,
      averageHoursPerDay: daysWorked > 0 ? (totalHours / daysWorked).toFixed(1) : 0,
      skillsDeveloped: skillsUsed,
      keyAccomplishments: monthJournals.map(j => j.accomplishments).filter(Boolean),
      challenges: monthJournals.map(j => j.challenges).filter(Boolean),
      learnings: monthJournals.map(j => j.learnings).filter(Boolean),
      summary: `During the month of ${monthYear}, the intern completed ${totalHours.toFixed(1)} hours across ${daysWorked} working days. Key skills developed include: ${Object.keys(skillsUsed).join(', ') || 'General training'}. ${monthJournals.length > 0 ? 'Journal entries show consistent engagement with daily tasks and learning objectives.' : ''}`,
    };

    return report;
  };

  // Signature functions
  const addSignature = (internId, signatureData, supervisorName) => {
    const newSignature = {
      id: Date.now().toString(),
      internId,
      signatureData,
      supervisorName,
      date: new Date().toISOString(),
    };
    setSignatures({ ...signatures, [internId]: [...(signatures[internId] || []), newSignature] });
    return newSignature;
  };

  const getInternSignatures = (internId) => {
    return signatures[internId] || [];
  };

  // Calculate hours for government office schedule (8AM-5PM with 12PM-1PM lunch break)
  const calculateGovernmentHours = (timeInStr, timeOutStr) => {
    const [inHours, inMinutes] = timeInStr.split(':').map(Number);
    const [outHours, outMinutes] = timeOutStr.split(':').map(Number);
    
    // Convert to minutes since midnight
    let inTime = inHours * 60 + inMinutes;
    let outTime = outHours * 60 + outMinutes;
    
    // Standard government hours: 8:00 AM to 5:00 PM
    const workStart = 8 * 60; // 8:00 AM
    const workEnd = 17 * 60; // 5:00 PM
    const lunchStart = 12 * 60; // 12:00 PM
    const lunchEnd = 13 * 60; // 1:00 PM
    
    // Clamp to work hours
    inTime = Math.max(inTime, workStart);
    outTime = Math.min(outTime, workEnd);
    
    if (outTime <= inTime) return 0;
    
    let totalMinutes = 0;
    
    // Calculate morning hours (before lunch)
    if (inTime < lunchStart) {
      const morningEnd = Math.min(outTime, lunchStart);
      totalMinutes += morningEnd - inTime;
    }
    
    // Calculate afternoon hours (after lunch)
    if (outTime > lunchEnd) {
      const afternoonStart = Math.max(inTime, lunchEnd);
      totalMinutes += outTime - afternoonStart;
    }
    
    // Convert to hours, cap at 8 hours maximum
    const hours = totalMinutes / 60;
    return Math.min(hours, 8);
  };

  // Manual time log entry for past hours
  const addManualTimeLog = (date, timeIn, timeOut, skills = [], notes = '') => {
    const durationHours = calculateGovernmentHours(timeIn, timeOut);

    if (durationHours <= 0) return { success: false, error: 'Invalid time range' };

    const timeInDate = new Date(`${date}T${timeIn}`);
    const timeOutDate = new Date(`${date}T${timeOut}`);

    const log = {
      id: Date.now().toString(),
      internId: currentIntern.id,
      timeIn: timeInDate.toISOString(),
      timeOut: timeOutDate.toISOString(),
      durationHours: Math.round(durationHours * 100) / 100,
      skills: skills || [],
      notes,
      isManualEntry: true,
    };

    setTimeLogs([...timeLogs, log]);
    
    // Update skills
    if (skills && skills.length > 0) {
      setSkillsData(prev => {
        const internSkills = prev[currentIntern.id] || {};
        const updatedSkills = { ...internSkills };
        skills.forEach(skill => {
          updatedSkills[skill] = (updatedSkills[skill] || 0) + durationHours;
        });
        return { ...prev, [currentIntern.id]: updatedSkills };
      });
    }

    checkAndAwardBadges(currentIntern.id, [...timeLogs, log]);
    return { success: true, log };
  };

  // Auto-generate past working days logs
  const generatePastLogs = (endDate = null) => {
    const intern = currentIntern;
    if (!intern) return { success: false, error: 'No intern logged in' };

    const start = new Date(intern.startDate);
    const end = endDate ? new Date(endDate) : new Date();
    const excluded = getExcludedDates(intern.id);
    const excludedDateStrings = excluded.map(e => new Date(e.date).toDateString());
    const existingLogs = getInternLogs(intern.id);
    const existingLogDates = new Set(
      existingLogs.map(log => new Date(log.timeIn).toDateString())
    );

    // Get current total hours before adding new logs
    const hoursBefore = existingLogs.reduce((total, log) => total + (log.durationHours || 0), 0);

    let logsCreated = 0;
    const current = new Date(start);
    const newLogs = [];

    while (current <= end) {
      const dayOfWeek = current.getDay();
      const dateString = current.toDateString();
      const dateStr = current.toISOString().split('T')[0];
      
      // Skip weekends, excluded dates, and dates that already have logs
      if (dayOfWeek !== 0 && dayOfWeek !== 6 && 
          !excludedDateStrings.includes(dateString) &&
          !existingLogDates.has(dateString)) {
        
        // Create a standard 8-hour log (8AM-5PM with lunch break = 8 hours)
        const log = {
          id: Date.now().toString() + Math.random(),
          internId: intern.id,
          timeIn: new Date(`${dateStr}T08:00`).toISOString(),
          timeOut: new Date(`${dateStr}T17:00`).toISOString(),
          durationHours: 8,
          skills: [],
          notes: 'Auto-generated past log',
          isManualEntry: true,
          isAutoGenerated: true,
        };
        
        newLogs.push(log);
        logsCreated++;
      }
      
      current.setDate(current.getDate() + 1);
    }

    // Add all new logs to timeLogs
    if (newLogs.length > 0) {
      setTimeLogs(prev => [...prev, ...newLogs]);
      
      // Calculate total hours after adding logs
      const hoursAfter = hoursBefore + (newLogs.length * 8);
      
      // Check for newly earned badges
      const allLogs = [...existingLogs, ...newLogs];
      const newBadges = checkAndAwardBadges(intern.id, allLogs);
      
      // Determine which badges were earned from this generation
      const earnedBadgeIds = intern.earnedBadges || [];
      const newlyEarnedBadges = newBadges.filter(badge => 
        !earnedBadgeIds.includes(badge.id) || 
        (hoursBefore < badge.requirement && hoursAfter >= badge.requirement)
      );

      return { 
        success: true, 
        logsCreated,
        hoursAdded: newLogs.length * 8,
        totalHours: hoursAfter,
        newBadges: newlyEarnedBadges
      };
    }

    return { success: true, logsCreated: 0, hoursAdded: 0, totalHours: hoursBefore, newBadges: [] };
  };

  const value = {
    interns,
    currentIntern,
    timeLogs,
    activeSession,
    journalEntries,
    moodLogs,
    skillsData,
    signatures,
    addIntern,
    loginIntern,
    logoutIntern,
    timeIn,
    timeOut,
    getInternLogs,
    getTotalHours,
    getProgressPercentage,
    getTodayLogs,
    getTodayHours,
    updateIntern,
    deleteIntern,
    addJournalEntry,
    getInternJournals,
    addMoodLog,
    getInternMoodLogs,
    getInternSkills,
    getInternCustomSkills,
    addCustomSkill,
    removeCustomSkill,
    getAllAvailableSkills,
    getEarnedBadges,
    generateMonthlyReport,
    addSignature,
    getInternSignatures,
    addManualTimeLog,
    addExcludedDate,
    getExcludedDates,
    removeExcludedDate,
    calculateWorkingDays,
    getCompletedDays,
    generatePastLogs,
    calculateGovernmentHours,
    getCustomBackground,
    setCustomBackground,
    removeCustomBackground,
    getProfilePicture,
    setProfilePicture,
    removeProfilePicture,
    SKILL_CATEGORIES,
    DEPARTMENT_CHECKLISTS,
    BADGES,
  };

  return <OJTContext.Provider value={value}>{children}</OJTContext.Provider>;
};
