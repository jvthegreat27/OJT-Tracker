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
    generatePastLogs,
    deleteTimeLogsForDate,
    resetAllDatesAndLogs
  } = useOJT();

  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [reason, setReason] = useState('');
  const [type, setType] = useState('absence');
  const [showGenerateConfirm, setShowGenerateConfirm] = useState(false);
  const [generateResult, setGenerateResult] = useState(null);
  const [showNewBadges, setShowNewBadges] = useState(false);
  const [exclusionNotification, setExclusionNotification] = useState(null);
  const [selectedDates, setSelectedDates] = useState([]);
  const [bulkAction, setBulkAction] = useState(null); // 'delete' or 'reset-worked' or 'delete-hours' or 'reset-all'
  const [deleteHoursDate, setDeleteHoursDate] = useState(null); // For single date hours deletion

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

  const toggleDateSelection = (itemId) => {
    setSelectedDates(prev => 
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleBulkAction = (action) => {
    if (selectedDates.length === 0) return;
    
    setBulkAction(action);
  };

  const confirmBulkAction = () => {
    if (!bulkAction || selectedDates.length === 0) return;
    
    if (bulkAction === 'delete') {
      // Delete excluded dates
      selectedDates.forEach(itemId => {
        removeExcludedDate(itemId);
      });
    } else if (bulkAction === 'reset-worked') {
      // Reset worked days - delete time logs for selected dates and deduct hours
      selectedDates.forEach(itemId => {
        const item = excludedDates.find(d => d.id === itemId);
        if (item) {
          deleteTimeLogsForDate(item.date);
        }
      });
    } else if (bulkAction === 'reset-all') {
      // Reset all dates and logs
      resetAllDatesAndLogs();
    }
    
    setSelectedDates([]);
    setBulkAction(null);
  };

  const handleDeleteHoursForDate = (date) => {
    setDeleteHoursDate(date);
  };

  const confirmDeleteHours = async () => {
    if (!deleteHoursDate) return;
    
    const result = await deleteTimeLogsForDate(deleteHoursDate.date);
    
    if (result.success) {
      setExclusionNotification({
        message: `Deleted ${result.logsDeleted} time log(s) from ${formatDate(deleteHoursDate.date)}. Deducted ${result.hoursDeducted.toFixed(1)} hours.`,
        type: 'info'
      });
      setTimeout(() => setExclusionNotification(null), 5000);
    }
    
    setDeleteHoursDate(null);
  };

  const selectAllDates = () => {
    if (selectedDates.length === excludedDates.length) {
      setSelectedDates([]);
    } else {
      setSelectedDates(excludedDates.map(item => item.id));
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal-large" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-section">
            <h3>📅 Manage Excluded Dates</h3>
            <p className="modal-subtitle">Manage holidays, absences, and weekend work days</p>
          </div>
          <button className="btn-icon btn-close-x" onClick={onClose} title="Close">
            <span className="close-x">×</span>
          </button>
        </div>

        {/* Stats Overview */}
        <div className="excluded-dates-stats">
          <div className="stat-card stat-primary">
            <div className="stat-icon-wrapper">📊</div>
            <div className="stat-details">
              <span className="stat-value">{workingDays}</span>
              <span className="stat-label">Working Days</span>
            </div>
          </div>
          <div className="stat-card stat-success">
            <div className="stat-icon-wrapper">✅</div>
            <div className="stat-details">
              <span className="stat-value">{completedDays}</span>
              <span className="stat-label">Completed Days</span>
            </div>
          </div>
          <div className="stat-card stat-warning">
            <div className="stat-icon-wrapper">📌</div>
            <div className="stat-details">
              <span className="stat-value">{excludedDates.length}</span>
              <span className="stat-label">Excluded</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions-container">
          <div className="action-section generate-past-logs-section">
            <div className="section-header">
              <h4>⚡ Quick Setup</h4>
              <span className="section-badge">Recommended</span>
            </div>
            <p className="section-description">Automatically create 8-hour logs for all working days from your start date until now.</p>
            <button 
              className="btn btn-primary btn-generate"
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
                  ? `✅ Created ${generateResult.logsCreated} entries (${generateResult.hoursAdded}h) | Total: ${generateResult.totalHours.toFixed(1)}h`
                  : `❌ ${generateResult.error}`}
              </div>
            )}
          </div>
        </div>

        {exclusionNotification && (
          <div className="exclusion-notification">
            <div className="notification-icon">ℹ️</div>
            <span className="notification-message">{exclusionNotification.message}</span>
          </div>
        )}

        {/* Add New Excluded Date */}
        <div className="add-excluded-date-section">
          <div className="section-header">
            <h4>➕ Add Excluded Date</h4>
          </div>
          
          <form onSubmit={handleSubmit} className="excluded-date-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="exclude-date">📅 Date</label>
                <input
                  id="exclude-date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="form-control"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="exclude-type">🏷️ Type</label>
                <select
                  id="exclude-type"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="form-control"
                >
                  <option value="absence">😷 Absence</option>
                  <option value="holiday">🎉 Holiday</option>
                  <option value="weekend">📅 Weekend Work</option>
                </select>
              </div>
            </div>

            {type === 'absence' && (
              <div className="form-group full-width">
                <label htmlFor="exclude-reason">📝 Reason for Absence</label>
                <input
                  id="exclude-reason"
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
              Add to Excluded Dates
            </button>
          </form>
        </div>

        {excludedDates.length > 0 && (
          <div className="excluded-dates-list">
            <div className="excluded-dates-list-header">
              <h4>📋 Excluded Dates ({excludedDates.length})</h4>
              <div className="bulk-actions">
                <button 
                  className="btn btn-sm btn-secondary"
                  onClick={selectAllDates}
                >
                  {selectedDates.length === excludedDates.length ? 'Deselect All' : 'Select All'}
                </button>
                {selectedDates.length > 0 && (
                  <>
                    <button 
                      className="btn btn-sm btn-danger"
                      onClick={() => handleBulkAction('delete')}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2 2h4a2 2 0 0 1 2 2v2"/>
                      </svg>
                      Delete ({selectedDates.length})
                    </button>
                    <button 
                      className="btn btn-sm btn-secondary"
                      onClick={() => handleBulkAction('reset-worked')}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                        <polyline points="23 4 23 10 17 10"/>
                        <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
                      </svg>
                      Reset Worked Days ({selectedDates.length})
                    </button>
                  </>
                )}
              </div>
            </div>
            
            {/* Reset All Button */}
            <div className="reset-all-section">
              <button 
                className="btn btn-sm btn-danger reset-all-btn"
                onClick={() => handleBulkAction('reset-all')}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                  <line x1="10" y1="11" x2="10" y2="17"/>
                  <line x1="14" y1="11" x2="14" y2="17"/>
                </svg>
                ⚠️ Reset ALL Data (Clear Everything)
              </button>
              <p className="reset-all-warning">This will delete all excluded dates and time logs, and deduct all hours.</p>
            </div>
            {excludedDates
              .sort((a, b) => new Date(b.date) - new Date(a.date))
              .map(item => (
                <div key={item.id} className={`excluded-date-item ${item.type} ${selectedDates.includes(item.id) ? 'selected' : ''}`}>
                  <div className="excluded-date-info">
                    <input
                      type="checkbox"
                      checked={selectedDates.includes(item.id)}
                      onChange={() => toggleDateSelection(item.id)}
                      className="date-select-checkbox"
                    />
                    <span className="excluded-date-icon">{getTypeIcon(item.type)}</span>
                    <div className="excluded-date-details">
                      <span className="excluded-date-date">{formatDate(item.date)}</span>
                      <span className="excluded-date-type">{getTypeLabel(item.type)}</span>
                      {item.reason && (
                        <span className="excluded-date-reason">{item.reason}</span>
                      )}
                    </div>
                  </div>
                  <div className="excluded-date-actions">
                    <button 
                      className="btn-icon btn-delete-hours"
                      onClick={() => handleDeleteHoursForDate(item)}
                      title="Delete Hours for This Date"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                        <line x1="10" y1="11" x2="10" y2="17"/>
                        <line x1="14" y1="11" x2="14" y2="17"/>
                      </svg>
                    </button>
                    <button 
                      className="btn-icon btn-delete"
                      onClick={() => removeExcludedDate(item.id)}
                      title="Remove"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2 2v2"/>
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )}

        {/* Bulk Action Confirmation Modal */}
        {bulkAction && (
          <div className="modal-overlay inner-modal">
            <div className="modal">
              <h4>Confirm {
                bulkAction === 'delete' ? 'Deletion' : 
                bulkAction === 'reset-worked' ? 'Reset Worked Days' : 
                bulkAction === 'reset-all' ? 'Reset ALL Data' : 'Action'
              }?</h4>
              <p>
                {bulkAction === 'delete' && `You are about to delete ${selectedDates.length} selected excluded date(s). This action cannot be undone.`}
                {bulkAction === 'reset-worked' && `You are about to reset worked days for ${selectedDates.length} selected date(s). This will remove time logs and automatically deduct hours from your total.`}
                {bulkAction === 'reset-all' && `⚠️ WARNING: You are about to RESET EVERYTHING! This will delete all ${excludedDates.length} excluded dates and ALL time logs, deducting all hours. This action CANNOT be undone!`}
              </p>
              <div className="modal-actions">
                <button className="btn btn-secondary" onClick={() => setBulkAction(null)}>
                  Cancel
                </button>
                <button className="btn btn-danger" onClick={confirmBulkAction}>
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Hours Confirmation Modal */}
        {deleteHoursDate && (
          <div className="modal-overlay inner-modal">
            <div className="modal">
              <h4>⏱️ Delete Hours for {formatDate(deleteHoursDate.date)}?</h4>
              <p>This will remove all time logs for this date and deduct the hours from your total. This action cannot be undone.</p>
              <div className="modal-actions">
                <button className="btn btn-secondary" onClick={() => setDeleteHoursDate(null)}>
                  Cancel
                </button>
                <button className="btn btn-danger" onClick={confirmDeleteHours}>
                  Delete Hours
                </button>
              </div>
            </div>
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
