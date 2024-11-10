'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import ExportButtons from './starot-export-buttons';
import { 
  STATS, 
  SPECIES, 
  BASIC_CAREERS, 
  UPSTART_SKILLS, 
  CAREER_SKILLS,
  STARTING_EQUIPMENT,
  TRAINING,
  type Character 
} from './starot-types';

interface CharacterSheetProps {
  character: Character;
  updateCharacter?: (character: Character) => void;
}

interface AttributeSectionProps {
  character: {
    stats: {
      [key: string]: number;
    };
  };
}

const AttributeSection: React.FC<AttributeSectionProps> = ({ character }) => {
  const attributes = {
    HP: character.stats.pr || 0,
    SP: character.stats.mr || 0,
    EVASION: (character.stats.ps || 0) + (character.stats.pa || 0),
    WP: 3
  };

  return (
    <Card className="p-4">
      <h2 className="font-bold mb-2">Attributes</h2>
      <div className="grid grid-cols-2 gap-2">
        {Object.entries(attributes).map(([key, value]) => (
          <div key={key}>
            <span className="font-medium">{key}: </span>
            {value}
          </div>
        ))}
      </div>
    </Card>
  );
};

const StatsSection: React.FC<AttributeSectionProps> = ({ character }) => (
  <Card className="p-4">
    <h2 className="font-bold mb-2">Stats</h2>
    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
      {STATS.map(stat => (
        <div key={stat.id} className="flex justify-between">
          <span className="font-medium">{stat.name}: </span>
          <span>
            {character.stats[stat.id] || 0}
            {character.levelUpStats?.find(s => s.stat === stat.id) && (
              <span className="text-green-600 ml-1">
                (+{character.levelUpStats.find(s => s.stat === stat.id)?.increase})
              </span>
            )}
          </span>
        </div>
      ))}
    </div>
  </Card>
);

const EquipmentSection: React.FC<{ character: { equipment: string[] } }> = ({ character }) => {
  const getEquipmentDetails = (itemId: string) => {
    for (const category of Object.values(STARTING_EQUIPMENT)) {
      const item = category.find(i => i.id === itemId);
      if (item) return item;
    }
    return null;
  };

  return (
    <Card className="p-4">
      <h2 className="font-bold mb-2">Equipment</h2>
      <div className="space-y-2">
        {character.equipment.map(itemId => {
          const item = getEquipmentDetails(itemId);
          return item ? (
            <div key={itemId} className="flex justify-between items-start">
              <span className="font-medium">{item.name}</span>
              <span className="text-sm text-gray-600">{item.description}</span>
            </div>
          ) : null;
        })}
      </div>
    </Card>
  );
};

interface SkillDisplayProps {
  skill: {
    id: string;
    name: string;
    type: string;
    actionPoints?: number;
    description: string;
    stats?: string[];
  };
  character: {
    stats: {
      [key: string]: number;
    };
  };
}

const SkillDisplay: React.FC<SkillDisplayProps> = ({ skill, character }) => {
  const calculateSkillValue = () => {
    if (!skill.stats) return null;
    return skill.stats.reduce((sum, statId) => sum + (character.stats[statId] || 0), 0);
  };

  return (
    <div className="border rounded-lg p-3">
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-medium">{skill.name}</h4>
        <div className="flex gap-2">
          {skill.actionPoints && (
            <span className="text-xs px-2 py-1 bg-blue-100 rounded-full">
              {skill.actionPoints} AP
            </span>
          )}
          <span className={`text-xs px-2 py-1 rounded-full ${
            skill.type === 'manoeuvre' ? 'bg-green-100' : 
            skill.type === 'ability' ? 'bg-purple-100' : 'bg-gray-100'
          }`}>
            {skill.type.charAt(0).toUpperCase() + skill.type.slice(1)}
          </span>
        </div>
      </div>
      
      <p className="text-sm text-gray-600 mb-2">{skill.description}</p>
      
      {skill.stats && (
        <div className="mt-2 text-sm">
          <div className="text-gray-500">
            Uses: {skill.stats.map(stat => stat.toUpperCase()).join(' + ')}
          </div>
          <div className="font-medium">
            Skill Value: {calculateSkillValue()}
          </div>
        </div>
      )}
    </div>
  );
};

const SkillsSection: React.FC<{ character: Character }> = ({ character }) => {
  const career = BASIC_CAREERS.find(c => c.id === character.career);
  const careerSkills = career?.skills?.map(skillId => CAREER_SKILLS[skillId]).filter(Boolean) || [];

  return (
    <Card className="p-4">
      <h2 className="font-bold mb-4">Skills</h2>
      <div className="space-y-6">
        <div>
          <h3 className="font-medium mb-3">Upstart Skills</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {UPSTART_SKILLS.map(skill => (
              <SkillDisplay key={skill.id} skill={skill} character={character} />
            ))}
          </div>
        </div>

        {career && career.id !== 'upstart' && careerSkills.length > 0 && (
          <div>
            <h3 className="font-medium mb-3">{career.name} Skills</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {careerSkills.map(skill => skill && (
                <SkillDisplay key={skill.id} skill={skill} character={character} />
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

const CharacterSheet: React.FC<CharacterSheetProps> = ({ character, updateCharacter }) => {
  const species = SPECIES.find(s => s.id === character.species);
  const career = BASIC_CAREERS.find(c => c.id === character.career);
  const training = TRAINING.find(t => t.id === character.training);
  
  return (
    <div className="space-y-6">
      <ExportButtons
        character={character}
        onImport={updateCharacter ?? ((c: Character) => {})}
      />
      
      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-2">{character.name}</h1>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <span className="font-medium">Species: </span>
            {species?.name}
            {character.isNewsoul && ' (Newsoul)'}
          </div>
          <div>
            <span className="font-medium">Career: </span>
            {career?.name || 'Upstart'}
          </div>
          <div>
            <span className="font-medium">Training: </span>
            {training?.name || 'None'}
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AttributeSection character={character} />
        <StatsSection character={character} />
      </div>

      <EquipmentSection character={character} />
      <SkillsSection character={character} />
    </div>
  );
};

export default CharacterSheet;