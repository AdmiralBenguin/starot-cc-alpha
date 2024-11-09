'use client';

import React from 'react';
import { SPECIES } from './starot-types';

interface BasicInfoStepProps {
  character: Character;
  updateCharacter: (key: keyof Character, value: any) => void;
}

const BasicInfoStep = ({ character, updateCharacter }) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Character Name</label>
        <input
          type="text"
          value={character.name}
          onChange={(e) => updateCharacter('name', e.target.value)}
          className="mt-1 w-full rounded-md border p-2"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium">Species</label>
        <select 
          value={character.species}
          onChange={(e) => updateCharacter('species', e.target.value)}
          className="mt-1 w-full rounded-md border p-2"
        >
          <option value="">Select Species</option>
          {SPECIES.map(species => (
            <option key={species.id} value={species.id}>{species.name}</option>
          ))}
        </select>
        {character.species && (
          <p className="text-sm text-gray-600 mt-1">
            {SPECIES.find(s => s.id === character.species)?.description}
          </p>
        )}
      </div>
      
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="newsoul"
          checked={character.isNewsoul}
          onChange={(e) => updateCharacter('isNewsoul', e.target.checked)}
          className="rounded"
        />
        <label htmlFor="newsoul">Newsoul</label>
      </div>
    </div>
  );
};

export default BasicInfoStep;