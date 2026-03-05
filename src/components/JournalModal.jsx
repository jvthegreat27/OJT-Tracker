import React, { useState, useRef } from 'react';
import { useOJT, DEPARTMENT_CHECKLISTS } from '../context/OJTContext';

const JournalModal = ({ onClose }) => {
  const { currentIntern, addJournalEntry, getInternJournals } = useOJT();
  const [accomplishments, setAccomplishments] = useState('');
  const [challenges, setChallenges] = useState('');
  const [learnings, setLearnings] = useState('');
  const [tomorrowGoals, setTomorrowGoals] = useState('');
  const [checklist, setChecklist] = useState({});
  const [mood, setMood] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [activeField, setActiveField] = useState(null);
  const [attachments, setAttachments] = useState([]);
  const fileInputRef = useRef(null);

  const departmentChecklist = DEPARTMENT_CHECKLISTS[currentIntern?.department] || DEPARTMENT_CHECKLISTS['General'];

  const handleChecklistToggle = (item) => {
    setChecklist(prev => ({
      ...prev,
      [item]: !prev[item]
    }));
  };

  const handleVoiceInput = (field) => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Voice recognition is not supported in your browser. Please use Chrome.');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      setActiveField(field);
    };

    recognition.onend = () => {
      setIsListening(false);
      setActiveField(null);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      switch(field) {
        case 'accomplishments':
          setAccomplishments(prev => prev ? prev + ' ' + transcript : transcript);
          break;
        case 'challenges':
          setChallenges(prev => prev ? prev + ' ' + transcript : transcript);
          break;
        case 'learnings':
          setLearnings(prev => prev ? prev + ' ' + transcript : transcript);
          break;
        case 'tomorrowGoals':
          setTomorrowGoals(prev => prev ? prev + ' ' + transcript : transcript);
          break;
        default:
          break;
      }
    };

    recognition.start();
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const newAttachments = files.map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      type: file.type,
      size: file.size,
      url: URL.createObjectURL(file),
      file
    }));
    setAttachments(prev => [...prev, ...newAttachments]);
  };

  const removeAttachment = (id) => {
    setAttachments(prev => prev.filter(att => att.id !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const entry = {
      accomplishments,
      challenges,
      learnings,
      tomorrowGoals,
      checklist,
      mood,
      attachments: attachments.map(att => ({
        name: att.name,
        type: att.type,
        url: att.url
      })),
    };

    addJournalEntry(entry);
    onClose();
  };

  const recentJournals = getInternJournals(currentIntern?.id || '').slice(0, 3);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal-large" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Daily Journal & Checklist</h3>
          <button className="btn-icon" onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="journal-form">
          {/* Daily Checklist */}
          <div className="journal-section">
            <h4>Daily Objectives Checklist</h4>
            <div className="checklist-grid">
              {departmentChecklist.map((item, index) => (
                <label key={index} className="checklist-item">
                  <input
                    type="checkbox"
                    checked={checklist[item] || false}
                    onChange={() => handleChecklistToggle(item)}
                  />
                  <span className="checkmark"></span>
                  <span className="checklist-text">{item}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Mood Tracker */}
          <div className="journal-section">
            <h4>How are you feeling today?</h4>
            <div className="mood-selector">
              {['😊 Happy', '😤 Stressed', '😴 Tired', '🤩 Excited', '😰 Overwhelmed'].map((m) => (
                <button
                  key={m}
                  type="button"
                  className={`mood-btn ${mood === m ? 'active' : ''}`}
                  onClick={() => setMood(m)}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Journal Fields with Voice Input */}
          <div className="journal-section">
            <h4>Journal Entry</h4>
            
            <div className="journal-field">
              <div className="field-header">
                <label>Today's Accomplishments</label>
                <button
                  type="button"
                  className={`voice-btn ${isListening && activeField === 'accomplishments' ? 'listening' : ''}`}
                  onClick={() => handleVoiceInput('accomplishments')}
                  title="Voice to text"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                    <line x1="12" y1="19" x2="12" y2="23"/>
                    <line x1="8" y1="23" x2="16" y2="23"/>
                  </svg>
                </button>
              </div>
              <textarea
                value={accomplishments}
                onChange={(e) => setAccomplishments(e.target.value)}
                placeholder="What did you accomplish today?"
                rows="3"
              />
            </div>

            <div className="journal-field">
              <div className="field-header">
                <label>Challenges Faced</label>
                <button
                  type="button"
                  className={`voice-btn ${isListening && activeField === 'challenges' ? 'listening' : ''}`}
                  onClick={() => handleVoiceInput('challenges')}
                  title="Voice to text"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                    <line x1="12" y1="19" x2="12" y2="23"/>
                    <line x1="8" y1="23" x2="16" y2="23"/>
                  </svg>
                </button>
              </div>
              <textarea
                value={challenges}
                onChange={(e) => setChallenges(e.target.value)}
                placeholder="What challenges did you encounter?"
                rows="3"
              />
            </div>

            <div className="journal-field">
              <div className="field-header">
                <label>Key Learnings</label>
                <button
                  type="button"
                  className={`voice-btn ${isListening && activeField === 'learnings' ? 'listening' : ''}`}
                  onClick={() => handleVoiceInput('learnings')}
                  title="Voice to text"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                    <line x1="12" y1="19" x2="12" y2="23"/>
                    <line x1="8" y1="23" x2="16" y2="23"/>
                  </svg>
                </button>
              </div>
              <textarea
                value={learnings}
                onChange={(e) => setLearnings(e.target.value)}
                placeholder="What did you learn today?"
                rows="3"
              />
            </div>

            <div className="journal-field">
              <div className="field-header">
                <label>Goals for Tomorrow</label>
                <button
                  type="button"
                  className={`voice-btn ${isListening && activeField === 'tomorrowGoals' ? 'listening' : ''}`}
                  onClick={() => handleVoiceInput('tomorrowGoals')}
                  title="Voice to text"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                    <line x1="12" y1="19" x2="12" y2="23"/>
                    <line x1="8" y1="23" x2="16" y2="23"/>
                  </svg>
                </button>
              </div>
              <textarea
                value={tomorrowGoals}
                onChange={(e) => setTomorrowGoals(e.target.value)}
                placeholder="What are your goals for tomorrow?"
                rows="3"
              />
            </div>
          </div>

          {/* File Attachments */}
          <div className="journal-section">
            <h4>Proof of Work (Attachments)</h4>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              multiple
              accept="image/*,.pdf,.doc,.docx"
              style={{ display: 'none' }}
            />
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => fileInputRef.current?.click()}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
              </svg>
              Attach Files
            </button>
            
            {attachments.length > 0 && (
              <div className="attachments-list">
                {attachments.map(att => (
                  <div key={att.id} className="attachment-item">
                    <span className="attachment-name">{att.name}</span>
                    <button
                      type="button"
                      className="btn-icon"
                      onClick={() => removeAttachment(att.id)}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                        <line x1="18" y1="6" x2="6" y2="18"/>
                        <line x1="6" y1="6" x2="18" y2="18"/>
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Journal Entry
            </button>
          </div>
        </form>

        {/* Recent Entries Preview */}
        {recentJournals.length > 0 && (
          <div className="recent-journals">
            <h4>Recent Entries</h4>
            {recentJournals.map(entry => (
              <div key={entry.id} className="journal-preview">
                <span className="journal-date">{new Date(entry.date).toLocaleDateString()}</span>
                <p className="journal-snippet">
                  {entry.accomplishments?.substring(0, 100)}...
                </p>
                {entry.mood && <span className="journal-mood">{entry.mood}</span>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default JournalModal;
