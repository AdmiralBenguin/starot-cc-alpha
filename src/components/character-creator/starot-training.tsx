'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { 
  TRAINING,
  BASIC_CAREERS,
  type Character 
} from './starot-types';

interface TrainingStepProps {
  character: {
    training: string;
  };
  updateCharacter: (field: string, value: any) => void;
}

const TrainingStep: React.FC<TrainingStepProps> = ({ character, updateCharacter }) => {
  const getCareerRequirements = (trainingId: string) => {
    return BASIC_CAREERS.filter(career => 
      career.requirements.includes(trainingId)
    ).map(career => career.name);
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="font-medium text-blue-800 mb-2">Training Selection</h3>
        <p className="text-sm text-blue-600">
          Select a training path or choose none. Your training may affect available career paths.
        </p>
      </div>

      <Card className="p-4">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <input
              type="radio"
              id="no-training"
              name="training"
              value=""
              checked={character.training === ''}
              onChange={(e) => updateCharacter('training', e.target.value)}
              className="rounded"
            />
            <label htmlFor="no-training" className="text-sm font-medium">
              No Training
            </label>
          </div>

          {TRAINING.map(training => {
            const requiredForCareers = getCareerRequirements(training.id);
            
            return (
              <div key={training.id} className="border rounded p-3">
                <div className="flex items-start space-x-2">
                  <input
                    type="radio"
                    id={training.id}
                    name="training"
                    value={training.id}
                    checked={character.training === training.id}
                    onChange={(e) => updateCharacter('training', e.target.value)}
                    className="mt-1 rounded"
                  />
                  <div className="flex-1">
                    <label htmlFor={training.id} className="text-sm font-medium block">
                      {training.name}
                    </label>
                    
                    {requiredForCareers.length > 0 && (
                      <div className="flex flex-wrap mt-2">
                        {requiredForCareers.map(career => (
                          <span key={career} className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full mr-1 mb-1">
                            Required for {career}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

export default TrainingStep;