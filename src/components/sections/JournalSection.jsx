import React, { useState } from 'react';
import { useOJT } from '../../context/OJTContext';
import JournalModal from '../JournalModal';
import JournalEntriesList from '../JournalEntriesList';

const JournalSection = () => {
  const [showJournalModal, setShowJournalModal] = useState(false);
  const { currentIntern, getInternJournals } = useOJT();
  
  const journals = getInternJournals(currentIntern?.id || []);
  
  return (
    <div className="section-content">
      <div className="section-header-page">
        <h2>Daily Journal Entries</h2>
        <p>Document your daily experiences, learnings, and reflections during your OJT.</p>
      </div>
      
      <div className="journal-actions">
        <button className="btn btn-primary btn-lg" onClick={() => setShowJournalModal(true)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Add New Entry
        </button>
      </div>
      
      <div className="journal-stats">
        <div className="stat-card">
          <span className="stat-value">{journals.length}</span>
          <span className="stat-label">Total Entries</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">
            {journals.length > 0 
              ? new Date(journals[0].date).toLocaleDateString() 
              : 'No entries'}
          </span>
          <span className="stat-label">Latest Entry</span>
        </div>
      </div>
      
      <div className="journal-entries-full">
        <h3>All Journal Entries</h3>
        <JournalEntriesList />
      </div>
      
      {showJournalModal && (
        <JournalModal onClose={() => setShowJournalModal(false)} />
      )}
    </div>
  );
};

export default JournalSection;
