import React from 'react';
import SkillsHeatmap from '../SkillsHeatmap';

const SkillsSection = () => {
  return (
    <div className="section-content">
      <div className="section-header-page">
        <h2>Skill Development Heatmap</h2>
        <p>Visualize your skill growth and track hours spent on each skill area.</p>
      </div>
      
      <SkillsHeatmap />
    </div>
  );
};

export default SkillsSection;
