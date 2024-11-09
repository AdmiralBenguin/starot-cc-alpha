'use client';

import React from 'react';
import { Card } from '@/components/ui/card';

interface Skill {
  id: string;
  name: string;
  type: 'manoeuvre' | 'ability' | 'passive';
  actionPoints?: number;
  description: string;
  stats?: string[];
}

interface CareerSkillsProps {
  career: string;
  character: {
    stats: {
      [key: string]: number;
    };
  };
}

const CAREER_SKILLS: Record<string, Skill[]> = {
  medic: [
    {
      id: 'resuscitate',
      name: 'Resuscitate',
      type: 'manoeuvre',
      actionPoints: 2,
      description: 'Attempt to remove two wounds from a target.',
      stats: ['ms', 'pa']
    }
  ],
  operator: [
    {
      id: 'hack',
      name: 'Hack',
      type: 'manoeuvre',
      actionPoints: 2,
      description: 'Attempt to gain access to a technological system.',
      stats: ['ms', 'ma']
    },
    {
      id: 'modify-log',
      name: 'Modify Log',
      type: 'manoeuvre',
      actionPoints: 2,
      description: 'Attempt to edit system logs.',
      stats: ['ms', 'ma']
    },
    {
      id: 'override',
      name: 'Override',
      type: 'manoeuvre',
      actionPoints: 2,
      description: 'Attempt to rewrite system functions.',
      stats: ['ms', 'ma']
    }
  ],
  pilot: [
    {
      id: 'manual-manoeuvre',
      name: 'Manual Manoeuvre',
      type: 'manoeuvre',
      actionPoints: 2,
      description: 'Attempt to manually steer a ship.',
      stats: ['pa', 'ma']
    },
    {
      id: 'manual-targeting',
      name: 'Manual Targeting',
      type: 'manoeuvre',
      actionPoints: 2,
      description: 'Attempt to manually target with ship weapons.',
      stats: ['pa', 'ma']
    },
    {
      id: 'plot-course',
      name: 'Plot Course',
      type: 'ability',
      actionPoints: 1,
      description: 'Chart a course through space.',
      stats: ['ma', 'ms']
    }
  ],
  soldier: [
    {
      id: 'combat-awareness',
      name: 'Combat Awareness',
      type: 'passive',
      description: 'Pioneers take first round in non-ambush combat.'
    },
    {
      id: 'combat-reposition',
      name: 'Combat Reposition',
      type: 'manoeuvre',
      actionPoints: 1,
      description: 'Attack and reposition in one action.',
      stats: ['ps', 'pa', 'pr']
    },
    {
      id: 'manual-targeting',
      name: 'Manual Targeting',
      type: 'manoeuvre',
      actionPoints: 2,
      description: 'Attempt to manually target with weapons.',
      stats: ['pa', 'ma']
    }
  ],
  revoker: [
    {
      id: 'revoke',
      name: 'Revoke',
      type: 'manoeuvre',
      actionPoints: 2,
      description: 'Attempt to deny an aspect of reality.',
      stats: ['pa', 'pr']
    }
  ]
};

const CareerSkillCard: React.FC<{ skill: Skill; character: any }> = ({ skill, character }) => {
  const calculateSkillValue = () => {
    if (!skill.stats) return null;
    return skill.stats.reduce((sum, statId) => sum + (character.stats[statId] || 0), 0);
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
          <span className={`text-xs px-2 py-1 rounded-full
            ${skill.type === 'manoeuvre' ? 'bg-green-100' : 
              skill.type === 'ability' ? 'bg-purple-100' : 'bg-gray-100'}`}>
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

const CareerSkills: React.FC<CareerSkillsProps> = ({ career, character }) => {
  const careerSkills = CAREER_SKILLS[career] || [];

  if (careerSkills.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="font-medium">Career-Specific Skills</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {careerSkills.map(skill => (
          <CareerSkillCard 
            key={skill.id}
            skill={skill}
            character={character}
          />
        ))}
      </div>
    </div>
  );
};

export default CareerSkills;