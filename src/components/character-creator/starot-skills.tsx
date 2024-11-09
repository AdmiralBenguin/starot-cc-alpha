'use client';

import React from 'react';
import { UPSTART_SKILLS } from './starot-types';
import { Card } from '@/components/ui/card';

const SkillCard = ({ skill, stats = {} }) => {
  const calculateSkillValue = () => {
    if (!skill.stats) return null;
    return skill.stats.reduce((sum, statId) => sum + (stats[statId] || 0), 0);
  };

  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium">{skill.name}</h3>
        <div className="flex gap-2">
          {skill.actionPoints && (
            <span className="text-sm px-2 py-1 bg-blue-100 rounded-full">
              {skill.actionPoints} AP
            </span>
          )}
          <span className={`text-sm px-2 py-1 rounded-full
            ${skill.type === 'manoeuvre' ? 'bg-green-100' : 'bg-purple-100'}`}>
            {skill.type.charAt(0).toUpperCase() + skill.type.slice(1)}
          </span>
        </div>
      </div>
      
      <p className="text-sm text-gray-600 mb-2">{skill.description}</p>
      
      {skill.stats && (
        <div className="mt-2 space-y-1">
          <div className="text-sm text-gray-500">
            Uses: {skill.stats.map(stat => stat.toUpperCase()).join(' + ')}
          </div>
          <div className="text-sm font-medium">
            Skill Value: {calculateSkillValue()}
          </div>
        </div>
      )}
    </Card>
  );
};

const SkillsDisplay = ({ character }) => {
  const [filterType, setFilterType] = React.useState('all');
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredSkills = UPSTART_SKILLS.filter(skill => {
    const matchesType = filterType === 'all' || skill.type === filterType;
    const matchesSearch = skill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         skill.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          placeholder="Search skills..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 p-2 border rounded"
        />
        
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="all">All Skills</option>
          <option value="manoeuvre">Manoeuvres</option>
          <option value="ability">Abilities</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSkills.map(skill => (
          <SkillCard 
            key={skill.id} 
            skill={skill}
            stats={character.stats}
          />
        ))}
      </div>
    </div>
  );
};

export default SkillsDisplay;