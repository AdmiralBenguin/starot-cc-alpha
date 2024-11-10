'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { 
  BASIC_CAREERS, 
  UPSTART_SKILLS, 
  STATS, 
  CAREER_SKILLS,
  STARTING_EQUIPMENT,
  type Skill,
  type SkillType,
  type Character 
} from './starot-types';

interface CareerStepProps {
  character: Character;
  updateCharacter: (field: keyof Character, value: any) => void;
}

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

  const getTypeColor = (type: SkillType) => {
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

const SkillsDisplay: React.FC<{ character: Character; additionalSkills?: string[] }> = ({ 
  character, 
  additionalSkills = [] 
}) => {
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const allSkills = [
    ...UPSTART_SKILLS,
    ...additionalSkills.map(skillId => CAREER_SKILLS[skillId]).filter(Boolean)
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredSkills.map(skill => (
          <SkillCard 
            key={skill.id} 
            skill={skill}
            character={character}
          />
        ))}
      </div>

      {filteredSkills.length === 0 && (
        <div className="text-center text-gray-500 py-4">
          No skills match your search criteria
        </div>
      )}
    </div>
  );
};

const CareerStep: React.FC<CareerStepProps> = ({ character, updateCharacter }) => {
  const [showCareerSelection, setShowCareerSelection] = useState(false);
  const [selectedCareer, setSelectedCareer] = useState<typeof BASIC_CAREERS[0] | null>(null);
  const [statIncreases, setStatIncreases] = useState<{
    plusTwo: string[];
    plusOne: string[];
  }>({
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
    
    // Apply stat increases
    statIncreases.plusTwo.forEach(statId => {
      newStats[statId] = (newStats[statId] || 0) + 2;
    });
    
    statIncreases.plusOne.forEach(statId => {
      newStats[statId] = (newStats[statId] || 0) + 1;
    });

    // Update character
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
              additionalSkills={BASIC_CAREERS.find(c => c.id === character.career)?.skills}
            />
          </>
        ) : (
          <div className="space-y-6">
            {availableCareers.length === 0 ? (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Your current choices do not meet the requirements for any basic careers.
                  Consider adjusting your equipment or training selections.
                </AlertDescription>
              </Alert>
            ) : (
              <>
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
                            {career.requiresWeapon && (
                              <li className={character.equipment.some(e => 
                                STARTING_EQUIPMENT.weapons.find(w => w.id === e)
                              ) ? 'text-green-600' : 'text-red-600'}>
                                Any weapon
                              </li>
                            )}
                            {career.requiresArmor && (
                              <li className={character.equipment.some(e => 
                                STARTING_EQUIPMENT.armor.find(a => a.id === e)
                              ) ? 'text-green-600' : 'text-red-600'}>
                                Any armor
                              </li>
                            )}
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
              </>
            )}
          </div>
        )}
      </Card>
    </div>
  );
};

export default CareerStep;