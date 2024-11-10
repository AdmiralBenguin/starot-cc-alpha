'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import type { Skill } from './starot-types';

interface SkillCardProps {
  skill: Skill;
  character: {
    stats: {
      [key: string]: number;
    };
  };
}

const SkillCard: React.FC<SkillCardProps> = ({ skill, character }) => {
  const calculateSkillValue = () => {
    if (!skill.stats) return null;
    return skill.stats.reduce((sum, statId) => sum + (character.stats[statId] || 0), 0);
  };

  const getTypeColor = (type: Skill['type']) => {
    switch (type) {
      case 'manoeuvre':
        return 'bg-green-100 text-green-800';
      case 'ability':
        return 'bg-purple-100 text-purple-800';
      case 'passive':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium">{skill.name}</h3>
        <div className="flex gap-2">
          {skill.actionPoints && (
            <span className="text-xs px-2 py-1 bg-blue-100 rounded-full">
              {skill.actionPoints} AP
            </span>
          )}
          <span className={`text-xs px-2 py-1 rounded-full ${getTypeColor(skill.type)}`}>
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

export default SkillCard;