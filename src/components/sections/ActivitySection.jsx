import React, { useState } from 'react';
import { useOJT } from '../../context/OJTContext';

const ActivitySection = () => {
  const { currentIntern, getInternLogs } = useOJT();
  const [showAllActivity, setShowAllActivity] = useState(false);
  
  const allLogs = getInternLogs(currentIntern?.id).reverse();
  const recentLogs = showAllActivity ? allLogs : allLogs.slice(0, 5);
  
  const formatTime = (dateStr) => {
    return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
  };
  
  // Group logs by date
  const logsByDate = {};
  recentLogs.forEach(log => {
    const date = new Date(log.timeIn).toDateString();
    if (!logsByDate[date]) logsByDate[date] = [];
    logsByDate[date].push(log);
  });
  
  return (
    <div className="section-content">
      <div className="section-header-page">
        <h2>Recent Activity</h2>
        <p>View your time logs and track your daily work sessions.</p>
      </div>
      
      <div className="activity-actions">
        {allLogs.length > 5 && (
          <button 
            className="btn btn-secondary"
            onClick={() => setShowAllActivity(!showAllActivity)}
          >
            {showAllActivity ? 'Show Recent (5)' : `View All (${allLogs.length})`}
          </button>
        )}
      </div>
      
      {recentLogs.length === 0 ? (
        <div className="empty-state">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="48" height="48">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12 6 12 12 16 14"/>
          </svg>
          <p>No time logs yet. Start by clicking "Time In"!</p>
        </div>
      ) : (
        <div className="activity-by-day">
          {Object.entries(logsByDate).map(([date, logs]) => {
            const morningLogs = logs.filter(log => new Date(log.timeIn).getHours() < 12);
            const afternoonLogs = logs.filter(log => new Date(log.timeIn).getHours() >= 12);
            const morningTotal = morningLogs.reduce((sum, log) => sum + (log.durationHours || 0), 0);
            const afternoonTotal = afternoonLogs.reduce((sum, log) => sum + (log.durationHours || 0), 0);
            const dayTotal = morningTotal + afternoonTotal;
            
            return (
              <div key={date} className="day-activity-card">
                <div className="day-header">
                  <span className="day-name">{formatDate(logs[0].timeIn)}</span>
                  <span className="day-total">{dayTotal.toFixed(1)}h</span>
                </div>
                
                <div className="sessions-grid">
                  {morningLogs.length > 0 && (
                    <div className="session-block morning">
                      <div className="session-header">
                        <span className="session-icon">☀️</span>
                        <span className="session-name">Morning</span>
                        <span className="session-total">{morningTotal.toFixed(1)}h</span>
                      </div>
                      <div className="session-logs">
                        {morningLogs.map(log => (
                          <div key={log.id} className="log-entry">
                            <span>{formatTime(log.timeIn)} - {formatTime(log.timeOut)}</span>
                            <span>{log.durationHours.toFixed(1)}h</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {afternoonLogs.length > 0 && (
                    <div className="session-block afternoon">
                      <div className="session-header">
                        <span className="session-icon">🌅</span>
                        <span className="session-name">Afternoon</span>
                        <span className="session-total">{afternoonTotal.toFixed(1)}h</span>
                      </div>
                      <div className="session-logs">
                        {afternoonLogs.map(log => (
                          <div key={log.id} className="log-entry">
                            <span>{formatTime(log.timeIn)} - {formatTime(log.timeOut)}</span>
                            <span>{log.durationHours.toFixed(1)}h</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ActivitySection;
