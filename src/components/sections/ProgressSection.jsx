import React from 'react';
import { useOJT } from '../../context/OJTContext';

const ProgressSection = () => {
  const { currentIntern, getTotalHours, getProgressPercentage, getCompletedDays } = useOJT();
  
  const totalHours = getTotalHours(currentIntern?.id);
  const progressPercentage = getProgressPercentage(currentIntern?.id);
  const completedDays = getCompletedDays(currentIntern?.id);
  
  return (
    <div className="section-content">
      <div className="section-header-page">
        <h2>Progress to Goal</h2>
        <p>Track your OJT journey and see how close you are to completing your required hours.</p>
      </div>
      
      <div className="progress-card">
        <div className="progress-header">
          <div className="progress-title">
            <h3>Overall Progress</h3>
            <span className="progress-subtitle">{completedDays} days completed</span>
          </div>
          <div className="progress-stats">
            <span className="progress-hours">{totalHours.toFixed(1)}h</span>
            <span className="progress-target">/ {currentIntern?.targetHours}h</span>
          </div>
        </div>
        
        <div className="progress-bar-container">
          <div 
            className="progress-bar" 
            style={{ width: `${progressPercentage}%` }}
          >
            <span className="progress-bar-glow"></span>
          </div>
        </div>
        
        <div className="progress-footer">
          <div className="progress-percentage">
            <span className="percentage-value">{progressPercentage}%</span>
            <span className="percentage-label">Complete</span>
          </div>
          <div className="progress-remaining">
            <span className="remaining-value">{(currentIntern?.targetHours - totalHours).toFixed(1)}h</span>
            <span className="remaining-label">Remaining</span>
          </div>
        </div>
      </div>
      
      <div className="progress-stats-grid">
        <div className="stat-card">
          <span className="stat-value">{completedDays}</span>
          <span className="stat-label">Days Completed (8+ hrs)</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{totalHours.toFixed(1)}</span>
          <span className="stat-label">Total Hours Logged</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{currentIntern?.targetHours}</span>
          <span className="stat-label">Target Hours</span>
        </div>
      </div>
    </div>
  );
};

export default ProgressSection;
