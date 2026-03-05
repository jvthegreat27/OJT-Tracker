import React, { useState, useEffect } from 'react';
import { useOJT } from '../context/OJTContext';
import { 
  ProgressSection, 
  SkillsSection, 
  BadgesSection, 
  JournalSection, 
  ActivitySection 
} from './sections';
import JournalModal from './JournalModal';
import MonthlyReportModal from './MonthlyReportModal';
import ManualTimeEntry from './ManualTimeEntry';
import ExcludedDatesModal from './ExcludedDatesModal';
import BackgroundUploadModal from './BackgroundUploadModal';

const Dashboard = () => {
  const { 
    currentIntern, 
    logoutIntern, 
    activeSession, 
    timeIn, 
    timeOut,
    timeLogs,
    getTotalHours,
    getProgressPercentage,
    getTodayHours,
    getInternLogs,
    deleteIntern,
    updateIntern,
    getEarnedBadges,
    getCompletedDays,
    getInternCustomSkills,
    getCustomBackground,
    setCustomBackground,
    removeCustomBackground,
    getProfilePicture,
    setProfilePicture,
    removeProfilePicture
  } = useOJT();

  const [currentTime, setCurrentTime] = useState(new Date());
  const [sessionDuration, setSessionDuration] = useState(0);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showJournal, setShowJournal] = useState(false);
  const [showMonthlyReport, setShowMonthlyReport] = useState(false);
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [showExcludedDates, setShowExcludedDates] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [showSkillSelector, setShowSkillSelector] = useState(false);
  const [newBadges, setNewBadges] = useState([]);
  const [autoTimeoutMessage, setAutoTimeoutMessage] = useState(null);
  const [showAllActivity, setShowAllActivity] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showBgUpload, setShowBgUpload] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [activeSection, setActiveSection] = useState('progress'); // 'progress', 'skills', 'badges', 'journal', 'activity'
  const [editValue, setEditValue] = useState('');
  const customBg = getCustomBackground(currentIntern?.id);
  const profilePicture = getProfilePicture(currentIntern?.id);

  // Scroll to section when selected
  const navigateToSection = (sectionId) => {
    setActiveSection(sectionId);
    setSidebarOpen(false);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Check for auto-timeout notification
  useEffect(() => {
    if (!activeSession && sessionDuration > 0) {
      // Check if the last log was an auto-timeout
      const logs = getInternLogs(currentIntern?.id);
      const lastLog = logs[logs.length - 1];
      if (lastLog?.isAutoTimeout) {
        setAutoTimeoutMessage('You were automatically timed out at 5:05 PM. Work hours calculated until 5:00 PM.');
        setSessionDuration(0);
        setTimeout(() => setAutoTimeoutMessage(null), 5000);
      }
    }
  }, [activeSession, currentIntern?.id]);

  useEffect(() => {
    if (activeSession) {
      const durationTimer = setInterval(() => {
        const start = new Date(activeSession.timeIn);
        const now = new Date();
        const diff = Math.floor((now - start) / 1000);
        setSessionDuration(diff);
      }, 1000);
      return () => clearInterval(durationTimer);
    }
  }, [activeSession]);

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric' 
    });
  };

  const handleTimeIn = () => {
    timeIn();
  };

  const handleTimeOut = () => {
    if (selectedSkills.length === 0) {
      setShowSkillSelector(true);
      return;
    }
    const result = timeOut(selectedSkills);
    if (result) {
      setSessionDuration(0);
      setSelectedSkills([]);
      // Check for new badges
      const earned = getEarnedBadges(currentIntern.id);
      if (earned.length > (currentIntern.earnedBadges?.length || 0)) {
        const newOnes = earned.filter(b => !currentIntern.earnedBadges?.includes(b.id));
        setNewBadges(newOnes);
      }
    }
  };

  const handleSkillConfirm = () => {
    if (selectedSkills.length > 0) {
      handleTimeOut();
      setShowSkillSelector(false);
    }
  };

  const toggleSkill = (skill) => {
    setSelectedSkills(prev => 
      prev.includes(skill) 
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  const handleDelete = () => {
    deleteIntern(currentIntern.id);
    setShowDeleteConfirm(false);
  };

  // Recalculate stats whenever timeLogs change
  const totalHours = getTotalHours(currentIntern.id);
  const progressPercentage = getProgressPercentage(currentIntern.id);
  const todayHours = getTodayHours(currentIntern.id);
  const completedDays = getCompletedDays(currentIntern.id);
  const allLogs = getInternLogs(currentIntern.id).reverse();
  const recentLogs = showAllActivity ? allLogs : allLogs.slice(0, 5);
  const earnedBadges = getEarnedBadges(currentIntern.id);

  // Check for new badges when timeLogs change
  useEffect(() => {
    if (currentIntern && timeLogs) {
      const earned = getEarnedBadges(currentIntern.id);
      const previousEarnedCount = currentIntern.earnedBadges?.length || 0;
      if (earned.length > previousEarnedCount) {
        const newOnes = earned.filter(b => !currentIntern.earnedBadges?.includes(b.id));
        if (newOnes.length > 0) {
          setNewBadges(newOnes);
        }
      }
    }
  }, [timeLogs, currentIntern, getEarnedBadges]);

  const sections = [
    { id: 'progress', label: 'Progress', icon: '📊' },
    { id: 'skills', label: 'Skills Heatmap', icon: '🔥' },
    { id: 'badges', label: 'Achievements', icon: '🏆' },
    { id: 'journal', label: 'Journal', icon: '📓' },
    { id: 'activity', label: 'Activity', icon: '📋' },
  ];
  
  const renderActiveSection = () => {
    switch(activeSection) {
      case 'progress':
        return <ProgressSection />;
      case 'skills':
        return <SkillsSection />;
      case 'badges':
        return <BadgesSection />;
      case 'journal':
        return <JournalSection />;
      case 'activity':
        return <ActivitySection />;
      default:
        return <ProgressSection />;
    }
  };

  return (
    <div className={`dashboard ${sidebarOpen ? 'sidebar-open' : ''}`}>
      {/* Sidebar Navigation */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h3>Sections</h3>
          <button className="btn-icon" onClick={() => setSidebarOpen(false)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <nav className="sidebar-nav">
          {sections.map(section => (
            <button
              key={section.id}
              className={`sidebar-nav-item ${activeSection === section.id ? 'active' : ''}`}
              onClick={() => navigateToSection(section.id)}
            >
              <span className="nav-icon">{section.icon}</span>
              <span className="nav-label">{section.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Overlay to close sidebar when clicking outside */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      <header className="dashboard-header">
        <div className="header-brand">
          <button 
            className="btn-icon sidebar-toggle sidebar-toggle-blue"
            onClick={() => setSidebarOpen(true)}
            title="Open Menu"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="24" height="24">
              <rect x="3" y="3" width="7" height="7"/>
              <rect x="14" y="3" width="7" height="7"/>
              <rect x="14" y="14" width="7" height="7"/>
              <rect x="3" y="14" width="7" height="7"/>
            </svg>
          </button>
          <div className="logo-small">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
          </div>
          <h2>OJT Tracker</h2>
        </div>
        <div className="header-user">
          <button className="user-profile-btn" onClick={() => setShowProfile(true)} title="View Profile">
            <span className="user-name">{currentIntern.name}</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </button>
          <button className="btn-icon logout-btn" onClick={logoutIntern} title="Logout">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
              <polyline points="10 17 15 12 10 7"/>
              <line x1="15" y1="12" x2="3" y2="12"/>
            </svg>
          </button>
        </div>
      </header>

      <main className="dashboard-main">
        {/* Auto Timeout Notification */}
        {autoTimeoutMessage && (
          <div className="auto-timeout-notification">
            <span className="notification-icon">⏰</span>
            <span className="notification-text">{autoTimeoutMessage}</span>
          </div>
        )}

        {/* Time Clock Section with Custom Background */}
        <section 
          className={`time-clock-section ${customBg ? 'has-custom-bg' : ''}`}
          style={customBg ? { backgroundImage: `url(${customBg})` } : {}}
        >
          {/* Background overlay for text readability */}
          {customBg && <div className="time-clock-overlay" />}
          
          {/* Background upload button */}
          <button 
            className="bg-upload-btn"
            onClick={() => setShowBgUpload(true)}
            title="Change background"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
          </button>

          <div className="time-display">
            <div className="current-time">{formatTime(currentTime)}</div>
            <div className="current-date">{currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</div>
          </div>

          <div className="clock-actions">
            {!activeSession ? (
              <button className="btn-time btn-time-in" onClick={handleTimeIn}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                </svg>
                <span>Time In</span>
              </button>
            ) : (
              <div className="active-session">
                <div className="session-timer">
                  <span className="timer-label">Current Session</span>
                  <span className="timer-value">{formatDuration(sessionDuration)}</span>
                </div>
                <button className="btn-time btn-time-out" onClick={handleTimeOut}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24">
                    <rect x="6" y="4" width="12" height="16" rx="2"/>
                    <line x1="12" y1="8" x2="12" y2="8"/>
                  </svg>
                  <span>Time Out</span>
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Background Upload Modal */}
        {showBgUpload && (
          <BackgroundUploadModal 
            onClose={() => setShowBgUpload(false)}
            currentBg={customBg}
            onSave={setCustomBackground}
            onRemove={removeCustomBackground}
          />
        )}

        {/* Profile Modal */}
        {showProfile && (
          <div className="modal-overlay" onClick={() => setShowProfile(false)}>
            <div className="modal profile-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>My Profile</h3>
                <button className="btn-close" onClick={() => setShowProfile(false)}>×</button>
              </div>
              <div className="profile-content">
                <div className="profile-avatar">
                  <label className="profile-upload-wrapper" title="Click to change profile picture">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => setProfilePicture(reader.result);
                          reader.readAsDataURL(file);
                        }
                      }}
                      style={{ display: 'none' }}
                    />
                    {profilePicture ? (
                      <>
                        <img src={profilePicture} alt="Profile" className="profile-img" />
                        <div className="profile-overlay">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24">
                            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                            <circle cx="12" cy="13" r="4"/>
                          </svg>
                          <span>Change Photo</span>
                        </div>
                      </>
                    ) : (
                      <div className="profile-placeholder">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="40" height="40">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                          <circle cx="12" cy="7" r="4"/>
                        </svg>
                        <span>Add Photo</span>
                      </div>
                    )}
                  </label>
                </div>
                <div className="profile-info">
                  {[
                    { key: 'name', label: 'Full Name', value: currentIntern.name },
                    { key: 'username', label: 'Username', value: currentIntern.username },
                    { key: 'studentId', label: 'Student ID', value: currentIntern.studentId || '' },
                    { key: 'program', label: 'Program / Course', value: currentIntern.program || '' },
                    { key: 'establishment', label: 'OJT Establishment', value: currentIntern.establishment || '' },
                    { key: 'targetHours', label: 'Target Hours', value: currentIntern.targetHours, suffix: ' hours' },
                  ].map((field) => (
                    <div key={field.key} className="profile-field">
                      <div className="profile-field-header">
                        <label>{field.label}</label>
                        {editingField === field.key ? (
                          <div className="profile-edit-actions">
                            <button 
                              className="profile-edit-btn save"
                              onClick={() => {
                                updateIntern(currentIntern.id, { [field.key]: field.key === 'targetHours' ? parseInt(editValue) || 0 : editValue });
                                setEditingField(null);
                              }}
                              title="Save"
                            >
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                                <polyline points="20 6 9 17 4 12"/>
                              </svg>
                            </button>
                            <button 
                              className="profile-edit-btn cancel"
                              onClick={() => setEditingField(null)}
                              title="Cancel"
                            >
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                                <line x1="18" y1="6" x2="6" y2="18"/>
                                <line x1="6" y1="6" x2="18" y2="18"/>
                              </svg>
                            </button>
                          </div>
                        ) : (
                          <button 
                            className="profile-edit-btn"
                            onClick={() => {
                              setEditingField(field.key);
                              setEditValue(field.value.toString());
                            }}
                            title="Edit"
                          >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                            </svg>
                          </button>
                        )}
                      </div>
                      {editingField === field.key ? (
                        <input
                          type={field.key === 'targetHours' ? 'number' : 'text'}
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="profile-edit-input"
                          autoFocus
                        />
                      ) : (
                        <span>{field.value || 'Not specified'}{field.suffix || ''}</span>
                      )}
                    </div>
                  ))}
                  <div className="profile-field">
                    <label>OJT Start Date</label>
                    <span>{new Date(currentIntern.startDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                </div>

                {/* Delete Account Section */}
                <div className="profile-delete-section">
                  <div className="profile-divider"></div>
                  <button 
                    className="btn-text-danger profile-delete-btn"
                    onClick={() => {
                      setShowProfile(false);
                      setShowDeleteConfirm(true);
                    }}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                      <polyline points="3 6 5 6 21 6"/>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                    </svg>
                    Delete Account & Data
                  </button>
                  <p className="profile-delete-hint">This action cannot be undone</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <section className="stats-grid">
          <div className="stat-card stat-primary">
            <div className="stat-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
            </div>
            <div className="stat-content">
              <span className="stat-value">{totalHours.toFixed(1)}h</span>
              <span className="stat-label">Total Hours</span>
            </div>
          </div>

          <div className="stat-card stat-secondary">
            <div className="stat-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
            </div>
            <div className="stat-content">
              <span className="stat-value">{todayHours.toFixed(1)}h</span>
              <span className="stat-label">Today</span>
            </div>
          </div>

          <div className="stat-card stat-tertiary">
            <div className="stat-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
            </div>
            <div className="stat-content">
              <span className="stat-value">{completedDays}</span>
              <span className="stat-label">Days Completed</span>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="quick-actions">
          <button className="action-btn" onClick={() => setShowJournal(true)}>
            <span className="action-icon">📝</span>
            <span className="action-label">Daily Journal</span>
          </button>
          <button className="action-btn" onClick={() => setShowManualEntry(true)}>
            <span className="action-icon">⏰</span>
            <span className="action-label">Add Past Hours</span>
          </button>
          <button className="action-btn" onClick={() => setShowMonthlyReport(true)}>
            <span className="action-icon">📊</span>
            <span className="action-label">Monthly Report</span>
          </button>
          <button className="action-btn" onClick={() => setShowExcludedDates(true)}>
            <span className="action-icon">📅</span>
            <span className="action-label">Manage Dates</span>
          </button>
        </section>

        {/* Active Section Content */}
        <section className="active-section-container">
          {renderActiveSection()}
        </section>
      </main>

      {/* Skill Selector Modal */}
      {showSkillSelector && (
        <div className="modal-overlay">
          <div className="modal skill-selector-modal">
            <h3>Select Skills Practiced</h3>
            <p>What skills did you work on during this session?</p>
            
            {/* Default General Duties Option - Auto-confirms on click */}
            <div className="general-duties-section">
              <button
                type="button"
                className="skill-chip general-duties"
                onClick={() => {
                  setSelectedSkills(['General Duties']);
                  // Auto-confirm after a brief delay to show selection
                  setTimeout(() => {
                    timeOut(['General Duties']);
                    setShowSkillSelector(false);
                    setSelectedSkills([]);
                  }, 300);
                }}
              >
                <span className="duties-icon">📋</span>
                General Duties (Basic Tasks)
              </button>
              <small className="general-duties-hint">
                Click to immediately time out with general duties
              </small>
            </div>
            
            {/* Only show custom skills if user has added any */}
            {getInternCustomSkills(currentIntern?.id).length > 0 && (
              <>
                <div className="skills-divider">
                  <span>Or select your custom skills:</span>
                </div>
                
                <div className="skills-selector">
                  {getInternCustomSkills(currentIntern?.id).map(skill => (
                    <button
                      key={skill.id}
                      type="button"
                      className={`skill-chip ${selectedSkills.includes(skill.name) ? 'active' : ''}`}
                      onClick={() => toggleSkill(skill.name)}
                    >
                      {skill.name}
                    </button>
                  ))}
                </div>
              </>
            )}
            
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => {
                setShowSkillSelector(false);
                setSelectedSkills([]);
              }}>
                Cancel
              </button>
              <button 
                className="btn btn-primary" 
                onClick={handleSkillConfirm}
                disabled={selectedSkills.length === 0}
              >
                Confirm Time Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Badge Notification */}
      {newBadges.length > 0 && (
        <div className="modal-overlay">
          <div className="modal badge-modal">
            <div className="badge-celebration">
              <span className="celebration-icon">🎉</span>
              <h3>New Badge Earned!</h3>
              {newBadges.map(badge => (
                <div key={badge.id} className="new-badge">
                  <span className="badge-icon-large">{badge.icon}</span>
                  <span className="badge-name-large">{badge.name}</span>
                  <span className="badge-description">{badge.description}</span>
                </div>
              ))}
              <button className="btn btn-primary" onClick={() => setNewBadges([])}>
                Awesome!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Journal Modal */}
      {showJournal && <JournalModal onClose={() => setShowJournal(false)} />}

      {/* Monthly Report Modal */}
      {showMonthlyReport && <MonthlyReportModal onClose={() => setShowMonthlyReport(false)} />}

      {/* Manual Time Entry Modal */}
      {showManualEntry && <ManualTimeEntry onClose={() => setShowManualEntry(false)} />}

      {/* Excluded Dates Modal */}
      {showExcludedDates && <ExcludedDatesModal onClose={() => setShowExcludedDates(false)} />}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="modal-overlay" onClick={() => setShowDeleteConfirm(false)}>
          <div className="modal delete-confirm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="delete-confirm-header">
              <div className="delete-warning-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="32" height="32">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                  <line x1="12" y1="9" x2="12" y2="13"/>
                  <line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
              </div>
              <h3>Delete Your Account?</h3>
            </div>
            <div className="delete-confirm-content">
              <p className="delete-confirm-warning">This action <strong>cannot be undone</strong>.</p>
              <p className="delete-confirm-details">This will permanently delete:</p>
              <ul className="delete-confirm-list">
                <li>Your account and login credentials</li>
                <li>All time logs and session history</li>
                <li>Skills progress and heatmap data</li>
                <li>Earned badges and achievements</li>
                <li>Journal entries and reports</li>
              </ul>
              <p className="delete-confirm-question">Are you absolutely sure you want to proceed?</p>
            </div>
            <div className="modal-actions delete-confirm-actions">
              <button className="btn btn-secondary btn-lg" onClick={() => setShowDeleteConfirm(false)}>
                No, Keep My Account
              </button>
              <button className="btn btn-danger btn-lg" onClick={handleDelete}>
                Yes, Delete Everything
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
