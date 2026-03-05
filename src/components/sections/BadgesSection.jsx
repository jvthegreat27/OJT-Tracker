import React from 'react';
import BadgesDisplay from '../BadgesDisplay';

const BadgesSection = () => {
  return (
    <div className="section-content">
      <div className="section-header-page">
        <h2>Achievements & Badges</h2>
        <p>Celebrate your milestones and track your accomplishments throughout your OJT journey.</p>
      </div>
      
      <BadgesDisplay />
    </div>
  );
};

export default BadgesSection;
