import React, { useState } from 'react';
import { useOJT, SKILL_CATEGORIES } from '../context/OJTContext';

const ManualTimeEntry = ({ onClose }) => {
  const { addManualTimeLog, calculateGovernmentHours } = useOJT();
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [timeIn, setTimeIn] = useState('08:00');
  const [timeOut, setTimeOut] = useState('17:00');
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [calculatedHours, setCalculatedHours] = useState(8);

  // Calculate hours whenever time changes
  useState(() => {
    const hours = calculateGovernmentHours(timeIn, timeOut);
    setCalculatedHours(hours);
  });

  const handleSkillToggle = (skill) => {
    setSelectedSkills(prev => 
      prev.includes(skill) 
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    const result = addManualTimeLog(date, timeIn, timeOut, selectedSkills, notes);
    
    if (result.success) {
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1500);
    } else {
      setError(result.error);
    }
  };

  const handleTimeChange = (type, value) => {
    if (type === 'in') {
      setTimeIn(value);
    } else {
      setTimeOut(value);
    }
    const hours = calculateGovernmentHours(
      type === 'in' ? value : timeIn,
      type === 'out' ? value : timeOut
    );
    setCalculatedHours(hours);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Add Past Hours</h3>
          <button className="btn-icon" onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="manual-entry-form">
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">Hours added successfully!</div>}

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

          <div className="form-row">
            <div className="form-group">
              <label>Time In</label>
              <input
                type="time"
                value={timeIn}
                onChange={(e) => handleTimeChange('in', e.target.value)}
                className="form-control"
                required
              />
              <small className="form-hint">Default: 8:00 AM</small>
            </div>

            <div className="form-group">
              <label>Time Out</label>
              <input
                type="time"
                value={timeOut}
                onChange={(e) => handleTimeChange('out', e.target.value)}
                className="form-control"
                required
              />
              <small className="form-hint">Default: 5:00 PM</small>
            </div>
          </div>

          <div className="calculated-hours">
            <span className="hours-label">Calculated Hours:</span>
            <span className="hours-value">{calculatedHours.toFixed(1)} hours</span>
            <small className="hours-note">(Lunch break 12:00-1:00 PM excluded, max 8 hours)</small>
          </div>

          <div className="form-group">
            <label>Skills Practiced</label>
            <div className="skills-selector">
              {SKILL_CATEGORIES.map(skill => (
                <button
                  key={skill}
                  type="button"
                  className={`skill-chip ${selectedSkills.includes(skill) ? 'active' : ''}`}
                  onClick={() => handleSkillToggle(skill)}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Notes (Optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any notes about this session..."
              className="form-control"
              rows="3"
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Add Hours
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManualTimeEntry;
