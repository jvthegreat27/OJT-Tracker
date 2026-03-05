import React from 'react';
import { useOJT } from '../../context/OJTContext';

const HomeSection = ({ 
  totalHours, 
  todayHours, 
  completedDays, 
  setShowJournal, 
  setShowManualEntry, 
  setShowMonthlyReport, 
  setShowExcludedDates 
}) => {
  const { currentIntern } = useOJT();

  return (
    <div className="section-content home-section">
      {/* Stats Overview */}
      <div className="stats-overview">
        <div className="stat-card-large">
          <div className="stat-icon-large">⏱️</div>
          <div className="stat-info">
            <span className="stat-value-large">{totalHours.toFixed(1)}h</span>
            <span className="stat-label-large">Total Hours</span>
          </div>
        </div>
        <div className="stat-card-large">
          <div className="stat-icon-large">📅</div>
          <div className="stat-info">
            <span className="stat-value-large">{todayHours.toFixed(1)}h</span>
            <span className="stat-label-large">Today</span>
          </div>
        </div>
        <div className="stat-card-large">
          <div className="stat-icon-large">✅</div>
          <div className="stat-info">
            <span className="stat-value-large">{completedDays}</span>
            <span className="stat-label-large">Days Completed</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions-section">
        <h3>Quick Actions</h3>
        <div className="quick-actions-grid">
          <button className="action-card" onClick={() => setShowJournal(true)}>
            <span className="action-icon-large">📝</span>
            <span className="action-label">Daily Journal</span>
          </button>
          <button className="action-card" onClick={() => setShowManualEntry(true)}>
            <span className="action-icon-large">⏰</span>
            <span className="action-label">Add Past Hours</span>
          </button>
          <button className="action-card" onClick={() => setShowMonthlyReport(true)}>
            <span className="action-icon-large">📊</span>
            <span className="action-label">Monthly Report</span>
          </button>
          <button className="action-card" onClick={() => setShowExcludedDates(true)}>
            <span className="action-icon-large">📅</span>
            <span className="action-label">Manage Dates</span>
          </button>
        </div>
      </div>

      {/* Welcome Message */}
      <div className="welcome-message">
        <h2>Welcome back, {currentIntern?.fullName?.split(' ')[0]}! 👋</h2>
        <p>You're making great progress on your OJT journey. Keep up the good work!</p>
      </div>
    </div>
  );
};

export default HomeSection;
