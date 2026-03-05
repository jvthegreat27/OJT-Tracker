import React, { useState } from 'react';
import { useOJT, SKILL_CATEGORIES } from '../context/OJTContext';

const SkillsHeatmap = () => {
  const { 
    currentIntern, 
    getInternSkills, 
    getInternCustomSkills, 
    addCustomSkill, 
    removeCustomSkill 
  } = useOJT();
  const skills = getInternSkills(currentIntern?.id);
  const customSkills = getInternCustomSkills(currentIntern?.id);
  const [newSkillName, setNewSkillName] = useState('');
  const [showAddSkill, setShowAddSkill] = useState(false);

  // Combine default and custom skills, but only show ones with hours > 0 or are custom
  const allSkillNames = [...SKILL_CATEGORIES, ...customSkills.map(s => s.name)];
  const skillsToShow = allSkillNames.filter(skill => {
    const hours = skills[skill] || 0;
    // Show if has hours or is a custom skill
    return hours > 0 || customSkills.some(cs => cs.name === skill);
  });

  const maxHours = Math.max(...Object.values(skills), 1);

  const getHeatmapColor = (hours) => {
    const percentage = hours / maxHours;
    if (percentage === 0) return '#f3f4f6';
    if (percentage < 0.2) return '#dbeafe';
    if (percentage < 0.4) return '#93c5fd';
    if (percentage < 0.6) return '#60a5fa';
    if (percentage < 0.8) return '#3b82f6';
    return '#1d4ed8';
  };

  const getTextColor = (hours) => {
    const percentage = hours / maxHours;
    return percentage > 0.5 ? '#ffffff' : '#1f2937';
  };

  const handleAddSkill = () => {
    if (newSkillName.trim()) {
      addCustomSkill(newSkillName);
      setNewSkillName('');
      setShowAddSkill(false);
    }
  };

  const handleRemoveSkill = (skillId) => {
    removeCustomSkill(skillId);
  };

  return (
    <div className="skills-heatmap">
      <div className="heatmap-header">
        <h4>Skill Development Heatmap</h4>
        <button 
          className="btn btn-sm btn-secondary"
          onClick={() => setShowAddSkill(!showAddSkill)}
        >
          {showAddSkill ? 'Cancel' : '+ Add Skill'}
        </button>
      </div>

      {showAddSkill && (
        <div className="add-skill-form">
          <input
            type="text"
            value={newSkillName}
            onChange={(e) => setNewSkillName(e.target.value)}
            placeholder="Enter skill name"
            className="form-control"
            onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
          />
          <button className="btn btn-primary btn-sm" onClick={handleAddSkill}>
            Add
          </button>
        </div>
      )}

      {customSkills.length > 0 && (
        <div className="custom-skills-list">
          <small className="custom-skills-label">Your Custom Skills:</small>
          <div className="custom-skills-tags">
            {customSkills.map(skill => (
              <span key={skill.id} className="custom-skill-tag">
                {skill.name}
                <button 
                  className="remove-skill-btn"
                  onClick={() => handleRemoveSkill(skill.id)}
                  title="Remove skill"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="heatmap-grid">
        {skillsToShow.length > 0 ? (
          skillsToShow.map(skill => {
            const hours = skills[skill] || 0;
            const isCustom = customSkills.some(cs => cs.name === skill);
            return (
              <div
                key={skill}
                className={`heatmap-cell ${isCustom ? 'custom' : ''}`}
                style={{
                  backgroundColor: getHeatmapColor(hours),
                  color: getTextColor(hours)
                }}
                title={`${skill}: ${hours.toFixed(1)} hours`}
              >
                <span className="skill-name">{skill}</span>
                <span className="skill-hours">{hours.toFixed(1)}h</span>
                {isCustom && <span className="custom-badge">★</span>}
              </div>
            );
          })
        ) : (
          <p className="no-skills-message">No skills with recorded hours yet. Start logging your work!</p>
        )}
      </div>
      <div className="heatmap-legend">
        <span>Less</span>
        <div className="legend-gradient"></div>
        <span>More</span>
      </div>
    </div>
  );
};

export default SkillsHeatmap;
