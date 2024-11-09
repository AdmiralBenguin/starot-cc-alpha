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
  type Skill 
} from './starot-types';

interface AttributeSectionProps {
  character: {
    stats: {
      [key: string]: number;
    };
  };
}

const AttributeSection: React.FC<AttributeSectionProps> = ({ character }) => {
  const attributes = {
    hp: character.stats.pr || 0,
    sp: character.stats.mr || 0,
    evasion: (character.stats.ps || 0) + (character.stats.pa || 0),
    wp: 3
  };

  return (
    <Card className="p-4">
      <h2 className="font-bold mb-2">Attributes</h2>
      <div className="grid grid-cols-2 gap-2">
        {Object.entries(attributes).map(([key, value]) => (
          <div key={key}>
            <span className="font-medium">{key.toUpperCase()}: </span>
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
          return (
            <div key={itemId} className="flex justify-between items-start">
              <span className="font-medium">{item?.name}</span>
              <span className="text-sm text-gray-600">{item?.description}</span>
            </div>
          );
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

  const getTypeColor = (type: string) => {
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
    <div className="border rounded-lg p-3 hover:shadow-sm transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-medium">{skill.name}</h4>
        <div className="flex gap-2">
          {skill.actionPoints && (
            <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
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

interface SkillsSectionProps {
  character: {
    stats: {
      [key: string]: number;
    };
    career: string;
  };
}

const SkillsSection: React.FC<SkillsSectionProps> = ({ character }) => {
  const [filterType, setFilterType] = React.useState('all');
  const [searchTerm, setSearchTerm] = React.useState('');
  const career = BASIC_CAREERS.find(c => c.id === character.career);
  const careerSkills = career?.skills?.map(skillId => CAREER_SKILLS[skillId]).filter(Boolean) || [];

  const filterSkills = (skills: any[]) => {
    return skills.filter(skill => {
      const matchesType = filterType === 'all' || skill.type === filterType;
      const matchesSearch = skill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           skill.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesType && matchesSearch;
    });
  };

  const filteredUpstartSkills = filterSkills(UPSTART_SKILLS);
  const filteredCareerSkills = filterSkills(careerSkills);

  return (
    <Card className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold">Skills</h2>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search skills..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-2 py-1 border rounded text-sm"
          />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-2 py-1 border rounded text-sm"
          >
            <option value="all">All Types</option>
            <option value="manoeuvre">Manoeuvres</option>
            <option value="ability">Abilities</option>
            <option value="passive">Passives</option>
          </select>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="font-medium mb-3 flex items-center">
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs mr-2">Upstart</span>
            Basic Skills
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredUpstartSkills.map(skill => (
              <SkillDisplay
                key={skill.id}
                skill={skill}
                character={character}
              />
            ))}
          </div>
        </div>

        {career && career.id !== 'upstart' && filteredCareerSkills.length > 0 && (
          <div>
            <h3 className="font-medium mb-3 flex items-center">
              <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs mr-2">
                {career.name}
              </span>
              Career Skills
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredCareerSkills.map(skill => (
                <SkillDisplay
                  key={skill.id}
                  skill={skill}
                  character={character}
                />
              ))}
            </div>
          </div>
        )}

        {filteredUpstartSkills.length === 0 && filteredCareerSkills.length === 0 && (
          <div className="text-center text-gray-500 py-4">
            No skills match your search criteria
          </div>
        )}
      </div>
    </Card>
  );
};

interface CharacterSheetProps {
  character: {
    name: string;
    species: string;
    isNewsoul: boolean;
    stats: {
      [key: string]: number;
    };
    equipment: string[];
    training: string;
    career: string;
    levelUpStats: Array<{
      stat: string;
      increase: number;
    }>;
  };
  updateCharacter?: (character: any) => void;
}

const CharacterSheet: React.FC<CharacterSheetProps> = ({ character, updateCharacter }) => {
  const species = SPECIES.find(s => s.id === character.species);
  const training = TRAINING.find(t => t.id === character.training);
  const career = BASIC_CAREERS.find(c => c.id === character.career);
  
  return (
    <div className="space-y-6">
      <ExportButtons
        character={character}
        onImport={updateCharacter ?? (() => {})}
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