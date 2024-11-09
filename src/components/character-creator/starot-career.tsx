'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import type { Skill } from './starot-types';
import CareerSkills from './starot-career-skills';
import {
  BASIC_CAREERS,
  UPSTART_SKILLS,
  STATS,
  STARTING_EQUIPMENT
} from './starot-types';

interface SkillCardProps {
  skill: Skill;
  character: {
    stats: {
      [key: string]: number;
    };
  };
}

interface SkillsDisplayProps {
  character: {
    stats: {
      [key: string]: number;
    };
  };
  additionalSkills?: string[];
}

interface CareerStepProps {
  character: {
    stats: {
      [key: string]: number;
    };
    equipment: string[];
    training: string;
    career: string;
    isNewsoul: boolean;
  };
  updateCharacter: (field: string, value: any) => void;
}

const CAREER_SPECIFIC_SKILLS: Record<string, Skill> = {
  resuscitate: {
    id: 'resuscitate',
    name: 'Resuscitate',
    type: 'manoeuvre',
    actionPoints: 2,
    description: 'Attempt to remove two wounds from a target.',
    stats: ['ms', 'pa']
  },
  hack: {
    id: 'hack',
    name: 'Hack',
    type: 'manoeuvre',
    actionPoints: 2,
    description: 'Attempt to gain access to a technological system.',
    stats: ['ms', 'ma']
  },
  'modify-log': {
    id: 'modify-log',
    name: 'Modify Log',
    type: 'manoeuvre',
    actionPoints: 2,
    description: 'Attempt to edit system logs.',
    stats: ['ms', 'ma']
  },
  override: {
    id: 'override',
    name: 'Override',
    type: 'manoeuvre',
    actionPoints: 2,
    description: 'Attempt to rewrite system functions.',
    stats: ['ms', 'ma']
  },
  'manual-manoeuvre': {
    id: 'manual-manoeuvre',
    name: 'Manual Manoeuvre',
    type: 'manoeuvre',
    actionPoints: 2,
    description: 'Attempt to manually steer a ship.',
    stats: ['pa', 'ma']
  },
  'manual-targeting': {
    id: 'manual-targeting',
    name: 'Manual Targeting',
    type: 'manoeuvre',
    actionPoints: 2,
    description: 'Attempt to manually target with ship weapons.',
    stats: ['pa', 'ma']
  },
  'plot-course': {
    id: 'plot-course',
    name: 'Plot Course',
    type: 'ability',
    actionPoints: 1,
    description: 'Chart a course through space.',
    stats: ['ma', 'ms']
  },
  'combat-awareness': {
    id: 'combat-awareness',
    name: 'Combat Awareness',
    type: 'passive',
    description: 'Pioneers take first round in non-ambush combat.'
  },
  'combat-reposition': {
    id: 'combat-reposition',
    name: 'Combat Reposition',
    type: 'manoeuvre',
    actionPoints: 1,
    description: 'Attack and reposition in one action.',
    stats: ['ps', 'pa', 'pr']
  }
};

const SkillCard: React.FC<SkillCardProps> = ({ skill, character }) => {
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

const SkillsDisplay: React.FC<SkillsDisplayProps> = ({ character, additionalSkills = [] }) => {
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const allSkills = [
    ...UPSTART_SKILLS,
    ...additionalSkills.map(skillId => CAREER_SPECIFIC_SKILLS[skillId]).filter(Boolean)
  ];

  const filteredSkills = allSkills.filter(skill => {
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
          <option value="all">All Types</option>
          <option value="manoeuvre">Manoeuvres</option>
          <option value="ability">Abilities</option>
          <option value="passive">Passives</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSkills.map(skill => (
          <SkillCard 
            key={skill.id} 
            skill={skill}
            character={character}
          />
        ))}
      </div>
    </div>
  );
};

const CareerStep: React.FC<CareerStepProps> = ({ character, updateCharacter }) => {
  const [showCareerSelection, setShowCareerSelection] = useState(false);
  const [selectedCareer, setSelectedCareer] = useState(null);
  const [statIncreases, setStatIncreases] = useState({
    plusTwo: [],
    plusOne: []
  });

  const availableCareers = BASIC_CAREERS.filter(career => {
    if (career.id === 'revoker' && character.isNewsoul) return false;
    
    const hasRequiredWeapon = !career.requiresWeapon || 
      character.equipment.some(e => STARTING_EQUIPMENT.weapons.find(w => w.id === e));
    
    const hasRequiredArmor = !career.requiresArmor ||
      character.equipment.some(e => STARTING_EQUIPMENT.armor.find(a => a.id === e));
    
    const hasAllRequirements = career.requirements.every(req => 
      character.equipment.includes(req) || character.training === req
    );

    return hasRequiredWeapon && hasRequiredArmor && hasAllRequirements;
  });

  const handleStatIncrease = (statId: string, amount: number) => {
    setStatIncreases(prev => {
      const newIncreases = { ...prev };
      
      // Remove stat from both arrays if it exists
      newIncreases.plusTwo = newIncreases.plusTwo.filter(s => s !== statId);
      newIncreases.plusOne = newIncreases.plusOne.filter(s => s !== statId);
      
      // Add to appropriate array if selected
      if (amount === 2 && newIncreases.plusTwo.length < 2) {
        newIncreases.plusTwo.push(statId);
      } else if (amount === 1 && newIncreases.plusOne.length < 2) {
        newIncreases.plusOne.push(statId);
      }
      
      return newIncreases;
    });
  };

  const handleCareerConfirm = () => {
    if (!selectedCareer) return;

    const newStats = { ...character.stats };
    
    statIncreases.plusTwo.forEach(statId => {
      newStats[statId] = (newStats[statId] || 0) + 2;
    });
    
    statIncreases.plusOne.forEach(statId => {
      newStats[statId] = (newStats[statId] || 0) + 1;
    });

    updateCharacter('stats', newStats);
    updateCharacter('career', selectedCareer.id);
    setShowCareerSelection(false);
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        {!showCareerSelection ? (
          <>
            <h2 className="text-xl font-bold mb-4">
              {character.career === 'upstart' ? 'Starting Career: Upstart' : 
                `Career: ${BASIC_CAREERS.find(c => c.id === character.career)?.name || 'Upstart'}`}
            </h2>
            <p className="text-gray-600 mb-4">You venture out into the great beyond</p>
            
            <div className="mb-6">
              <h3 className="font-medium mb-2">Career Benefits</h3>
              <ul className="list-disc list-inside text-gray-600">
                <li>Access to basic maneuvers and abilities</li>
                <li>Starting equipment selection</li>
                <li>Foundation for future career paths</li>
              </ul>
            </div>

            {character.career === 'upstart' && (
              <button
                onClick={() => setShowCareerSelection(true)}
                className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Choose Basic Career
              </button>
            )}

            <h3 className="font-medium mb-4 mt-6">Available Skills</h3>
            <SkillsDisplay 
              character={character}
              additionalSkills={BASIC_CAREERS.find(c => c.id === character.career)?.skills || []}
			
			  
            />
			{		character.career !== 'upstart' && (
  <CareerSkills
    career={character.career}
    character={character}
  />
		)}
          </>
        ) : (
          <div className="space-y-6">
            <div>
              <h3 className="font-medium mb-4">Select Basic Career</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availableCareers.map(career => (
                  <Card
                    key={career.id}
                    className={`p-4 cursor-pointer transition-all ${
                      selectedCareer?.id === career.id ? 'ring-2 ring-blue-500' : 'hover:shadow-md'
                    }`}
                    onClick={() => setSelectedCareer(career)}
                  >
                    <h4 className="font-medium">{career.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">{career.description}</p>
                    
                    <div className="mt-2">
                      <h5 className="text-sm font-medium">Requirements:</h5>
                      <ul className="list-disc list-inside text-sm">
                        {career.requirements.map(req => {
                          const isMet = character.equipment.includes(req) || character.training === req;
                          return (
                            <li key={req} className={isMet ? 'text-green-600' : 'text-red-600'}>
                              {req}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {selectedCareer && (
              <div>
                <h3 className="font-medium mb-4">Select Stat Increases</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Choose 2 stats to increase by +2 and 2 stats to increase by +1
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {STATS.map(stat => {
                    const currentValue = character.stats[stat.id] || 0;
                    const increase = 
                      statIncreases.plusTwo.includes(stat.id) ? 2 :
                      statIncreases.plusOne.includes(stat.id) ? 1 : 0;

                    return (
                      <Card key={stat.id} className="p-4">
                        <div className="flex justify-between items-center">
                          <span>{stat.name}</span>
                          <select
                            value={increase}
                            onChange={(e) => handleStatIncrease(stat.id, Number(e.target.value))}
                            className="ml-2 p-1 border rounded"
                          >
                            <option value={0}>+0</option>
                            <option value={1} disabled={
                              increase !== 1 && statIncreases.plusOne.length >= 2
                            }>+1</option>
                            <option value={2} disabled={
                              increase !== 2 && statIncreases.plusTwo.length >= 2
                            }>+2</option>
                          </select>
                        </div>
                        {increase > 0 && (
                          <div className="text-sm text-green-600 mt-1">
                            {currentValue} → {currentValue + increase}
                          </div>
                        )}
                      </Card>
                    );
                  })}
                </div>
                
                <button
                  onClick={handleCareerConfirm}
                  disabled={
                    statIncreases.plusTwo.length !== 2 || 
                    statIncreases.plusOne.length !== 2
                  }
                  className="w-full mt-6 py-2 px-4 bg-blue-600 text-white rounded 
                    hover:bg-blue-700 disabled:opacity-50"
                >
                  Confirm Career Selection
                </button>
              </div>
            )}
          </div>
		  )}
      </Card>
    </div>
  );
};

export default CareerStep;