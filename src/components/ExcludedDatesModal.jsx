import React, { useState } from 'react';
import { useOJT } from '../context/OJTContext';

const ExcludedDatesModal = ({ onClose }) => {
  const { 
    currentIntern, 
    getExcludedDates, 
    addExcludedDate, 
    removeExcludedDate,
    calculateWorkingDays,
    getCompletedDays,
    generatePastLogs
  } = useOJT();

  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [reason, setReason] = useState('');
  const [type, setType] = useState('absence');
  const [showGenerateConfirm, setShowGenerateConfirm] = useState(false);
  const [generateResult, setGenerateResult] = useState(null);
  const [showNewBadges, setShowNewBadges] = useState(false);
  const [exclusionNotification, setExclusionNotification] = useState(null);

  const excludedDates = getExcludedDates(currentIntern?.id);
  const workingDays = calculateWorkingDays(currentIntern?.id);
  const completedDays = getCompletedDays(currentIntern?.id);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!date || (type === 'absence' && !reason.trim())) return;
    
    const result = addExcludedDate(date, reason.trim(), type);
    
    // Show notification if logs were removed
    if (result.logsRemoved > 0) {
      setExclusionNotification({
        message: `${result.logsRemoved} time log(s) on ${formatDate(date)} removed. Hours and days automatically adjusted.`,
        type: 'info'
      });
      setTimeout(() => setExclusionNotification(null), 5000);
    }
    
    setDate(new Date().toISOString().split('T')[0]);
    setReason('');
    setType('absence');
  };

  const handleGeneratePastLogs = () => {
    const result = generatePastLogs();
    setGenerateResult(result);
    setShowGenerateConfirm(false);
    
    // Show badge celebration if new badges were earned
    if (result.success && result.newBadges && result.newBadges.length > 0) {
      setShowNewBadges(true);
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getTypeLabel = (type) => {
    switch(type) {
      case 'weekend': return 'Weekend';
      case 'holiday': return 'Holiday';
      case 'absence': return 'Absence';
      default: return type;
    }
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case 'weekend': return '📅';
      case 'holiday': return '🎉';
      case 'absence': return '😷';
      default: return '📌';
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal-large" onClick={e => e.stopPropagation()}>
        <div class="modal-header">
          <h3>Manage Excluded Dates</h3>
          <button className="btn-icon" onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div className="excluded-dates-stats">
          <div className="stat-card">
            <span className="stat-value">{workingDays}</span>
            <span className="stat-label">Expected Working Days</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{completedDays}</span>
            <span className="stat-label">Completed Days (8+ hrs)</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{excludedDates.length}</span>
            <span className="stat-label">Excluded Dates</span>
          </div>
        </div>

        <div className="generate-past-logs-section">
          <h4>Quick Setup: Generate Past Logs</h4>
          <p>Automatically create 8-hour logs for all working days from your start date until now, excluding weekends and marked dates.</p>
          <button 
            className="btn btn-secondary"
            onClick={() => setShowGenerateConfirm(true)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
              <path d="M12 2v20M2 12h20"/>
            </svg>
            Generate Past Working Days
          </button>
          {generateResult && (
            <div className={`generate-result ${generateResult.success ? 'success' : 'error'}`}>
              {generateResult.success 
                ? `Successfully created ${generateResult.logsCreated} log entries (${generateResult.hoursAdded} hours added)! Total: ${generateResult.totalHours.toFixed(1)} hours`
                : generateResult.error}
            </div>
          )}
        </div>

        {exclusionNotification && (
          <div className="exclusion-notification">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="16" x2="12" y2="12"/>
              <line x1="12" y1="8" x2="12.01" y2="8"/>
            </svg>
            <span>{exclusionNotification.message}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="excluded-date-form">
          <h4>Add Excluded Date</h4>
          
          <div className="form-row">
            <div className="form-group">
              <label>Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="form-control"
                required
              />
            </div>

            <div className="form-group">
              <label>Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="form-control"
              >
                <option value="absence">Absence</option>
                <option value="holiday">Holiday</option>
                <option value="weekend">Weekend Work</option>
              </select>
            </div>
          </div>

          {type === 'absence' && (
            <div className="form-group">
              <label>Reason for Absence</label>
              <input
                type="text"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g., Sick leave, Personal emergency, School activity"
                className="form-control"
                required
              />
            </div>
          )}

          <button type="submit" className="btn btn-primary">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Add Excluded Date
          </button>
        </form>

        {excludedDates.length > 0 && (
          <div className="excluded-dates-list">
            <h4>Excluded Dates</h4>
            {excludedDates
              .sort((a, b) => new Date(b.date) - new Date(a.date))
              .map(item => (
                <div key={item.id} className={`excluded-date-item ${item.type}`}>
                  <div className="excluded-date-info">
                    <span className="excluded-date-icon">{getTypeIcon(item.type)}</span>
                    <div className="excluded-date-details">
                      <span className="excluded-date-date">{formatDate(item.date)}</span>
                      <span className="excluded-date-type">{getTypeLabel(item.type)}</span>
                      {item.reason && (
                        <span className="excluded-date-reason">{item.reason}</span>
                      )}
                    </div>
                  </div>
                  <button 
                    className="btn-icon btn-delete"
                    onClick={() => removeExcludedDate(item.id)}
                    title="Remove"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                      <polyline points="3 6 5 6 21 6"/>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                    </svg>
                  </button>
                </div>
              ))}
          </div>
        )}

        {/* Generate Confirmation Modal */}
        {showGenerateConfirm && (
          <div className="modal-overlay inner-modal">
            <div className="modal">
              <h4>Generate Past Logs?</h4>
              <p>This will automatically create 8-hour work logs for all working days from your start date ({new Date(currentIntern?.startDate).toLocaleDateString()}) until today.</p>
              <p><strong>Excludes:</strong> Weekends, holidays, and marked absences</p>
              <div className="modal-actions">
                <button className="btn btn-secondary" onClick={() => setShowGenerateConfirm(false)}>
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={handleGeneratePastLogs}>
                  Generate Logs
                </button>
              </div>
            </div>
          </div>
        )}

        {/* New Badges Celebration Modal */}
        {showNewBadges && generateResult?.newBadges?.length > 0 && (
          <div className="modal-overlay inner-modal">
            <div className="modal badge-modal">
              <div className="badge-celebration">
                <span className="celebration-icon">🎉</span>
                <h3>New Achievement{generateResult.newBadges.length > 1 ? 's' : ''} Unlocked!</h3>
                <p className="hours-milestone">You've reached {generateResult.totalHours.toFixed(0)} hours!</p>
                
                <div className="new-badges-list">
                  {generateResult.newBadges.map(badge => (
                    <div key={badge.id} className="new-badge-item">
                      <span className="badge-icon-large">{badge.icon}</span>
                      <span className="badge-name-large">{badge.name}</span>
                      <span className="badge-description">{badge.description}</span>
                    </div>
                  ))}
                </div>
                
                <button className="btn btn-primary" onClick={() => setShowNewBadges(false)}>
                  Awesome! 🎊
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExcludedDatesModal;
