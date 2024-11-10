'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import BasicInfoStep from './starot-basic-info';
import StatsStep from './starot-stats';
import EquipmentStep from './starot-equipment';
import TrainingStep from './starot-training';
import CareerStep from './starot-career';
import CharacterSheet from './starot-character-sheet';
import { Character, StepProps } from './starot-types';

const CharacterCreator: React.FC = () => {
  const [step, setStep] = useState(0);
  const [character, setCharacter] = useState<Character>({
    name: '',
    species: '',
    isNewsoul: false,
    stats: {},
    equipment: [],
    training: '',
    career: 'upstart',
    levelUpStats: []
  });

  const updateCharacter: StepProps['updateCharacter'] = (field, value) => {
    setCharacter(prev => ({ ...prev, [field]: value }));
  };

  const canProceedToNextStep = () => {
    switch (step) {
      case 0: // Basic Info
        return character.name && character.species;
      case 1: // Stats
        return Object.keys(character.stats).length === 9;
      case 2: // Equipment
        return character.equipment.length === 3;
      case 3: // Training
        return character.training !== '';
      case 4: // Career
        return true; // Can always proceed from career step
      default:
        return true;
    }
  };

  const steps = [
    'Basic Info',
    'Stats',
    'Equipment',
    'Training',
    'Career',
    'Character Sheet'
  ];

  const renderStep = () => {
    switch (step) {
      case 0:
        return <BasicInfoStep character={character} updateCharacter={updateCharacter} />;
      case 1:
        return <StatsStep character={character} updateCharacter={updateCharacter} />;
      case 2:
        return <EquipmentStep character={character} updateCharacter={updateCharacter} />;
      case 3:
        return <TrainingStep character={character} updateCharacter={updateCharacter} />;
      case 4:
        return <CareerStep character={character} updateCharacter={updateCharacter} />;
      case 5:
        return (
          <CharacterSheet 
            character={character}
            updateCharacter={setCharacter}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Starot Character Creator</h1>
          <div className="text-sm">Step {step + 1} of {steps.length}</div>
        </div>
        
        <div className="flex justify-between mb-8">
          {steps.map((stepName, index) => (
            <div
              key={stepName}
              className={`flex-1 text-center ${
                index < step
                  ? 'text-blue-600'
                  : index === step
                  ? 'text-blue-800 font-medium'
                  : 'text-gray-400'
              }`}
            >
              {stepName}
            </div>
          ))}
        </div>
      </div>

      <div className="min-h-[400px] mb-8">
        {renderStep()}
      </div>

      <div className="flex justify-between">
        <button
          onClick={() => setStep(prev => prev - 1)}
          disabled={step === 0}
          className="flex items-center px-4 py-2 border rounded disabled:opacity-50"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Previous
        </button>
        
        {step < steps.length - 1 ? (
          <button
            onClick={() => setStep(prev => prev + 1)}
            disabled={!canProceedToNextStep()}
            className="flex items-center px-4 py-2 border rounded bg-blue-600 text-white disabled:opacity-50"
          >
            Next
            <ChevronRight className="w-4 h-4 ml-2" />
          </button>
        ) : (
          <button
            onClick={() => {
              console.log('Character completed:', character);
            }}
            className="flex items-center px-4 py-2 border rounded bg-green-600 text-white"
          >
            Complete Character
          </button>
        )}
      </div>
    </div>
  );
};

export default CharacterCreator;