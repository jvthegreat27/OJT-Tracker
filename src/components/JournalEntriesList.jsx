import React from 'react';
import { useOJT } from '../context/OJTContext';

const JournalEntriesList = () => {
  const { currentIntern, getInternJournals } = useOJT();
  
  const journals = getInternJournals(currentIntern?.id || []);
  
  if (journals.length === 0) {
    return (
      <div className="empty-state">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="48" height="48">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
          <polyline points="10 9 9 9 8 9"/>
        </svg>
        <p>No journal entries yet. Start documenting your OJT journey!</p>
      </div>
    );
  }
  
  return (
    <div className="journal-entries-list">
      {journals.slice(0, 5).map(entry => (
        <div key={entry.id} className="journal-entry-card">
          <div className="journal-entry-header">
            <span className="journal-date">{new Date(entry.date).toLocaleDateString()}</span>
            {entry.mood && <span className="journal-mood">{entry.mood}</span>}
          </div>
          
          {entry.checklist && Object.keys(entry.checklist).some(k => entry.checklist[k]) && (
            <div className="journal-skills-tags">
              {Object.keys(entry.checklist)
                .filter(k => entry.checklist[k])
                .map(skill => (
                  <span key={skill} className="skill-tag">{skill}</span>
                ))}
            </div>
          )}
          
          <p className="journal-content">
            {entry.journalEntry || entry.accomplishments || 'No content'}
          </p>
          
          {entry.attachments && entry.attachments.length > 0 && (
            <div className="journal-attachments">
              <small>📎 {entry.attachments.length} attachment(s)</small>
            </div>
          )}
        </div>
      ))}
      
      {journals.length > 5 && (
        <p className="more-entries">+ {journals.length - 5} more entries</p>
      )}
    </div>
  );
};

export default JournalEntriesList;
