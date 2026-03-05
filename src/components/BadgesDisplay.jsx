import React from 'react';
import { useOJT, BADGES } from '../context/OJTContext';

const BadgesDisplay = () => {
  const { currentIntern, getEarnedBadges } = useOJT();
  const earnedBadges = getEarnedBadges(currentIntern?.id);

  return (
    <div className="badges-section">
      <h4>Achievements & Badges</h4>
      <div className="badges-grid">
        {BADGES.map(badge => {
          const isEarned = earnedBadges.some(b => b.id === badge.id);
          return (
            <div
              key={badge.id}
              className={`badge-item ${isEarned ? 'earned' : 'locked'}`}
              title={badge.description}
            >
              <span className="badge-icon">{badge.icon}</span>
              <span className="badge-name">{badge.name}</span>
              {!isEarned && <span className="badge-lock">🔒</span>}
            </div>
          );
        })}
      </div>
      {earnedBadges.length > 0 && (
        <div className="badges-progress">
          <span>{earnedBadges.length} of {BADGES.length} badges earned</span>
          <div className="badges-progress-bar">
            <div
              className="badges-progress-fill"
              style={{ width: `${(earnedBadges.length / BADGES.length) * 100}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default BadgesDisplay;
