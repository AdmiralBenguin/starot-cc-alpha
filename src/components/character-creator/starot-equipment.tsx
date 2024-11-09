'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { InfoIcon } from 'lucide-react';
import { STARTING_EQUIPMENT, BASIC_CAREERS } from './starot-types';

interface EquipmentStepProps {
  character: {
    isNewsoul: boolean;
    equipment: string[];
  };
  updateCharacter: (field: string, value: any) => void;
}

const EquipmentStep: React.FC<EquipmentStepProps> = ({ character, updateCharacter }) => {
  const getCareerRequirements = (itemId: string) => {
    const requirements = [];
    
    for (const career of BASIC_CAREERS) {
      // Direct requirements
      if (career.requirements.includes(itemId)) {
        requirements.push({
          career: career.name,
          type: 'required'
        });
      }
      
      // Weapon requirements
      if (career.requiresWeapon && 
          STARTING_EQUIPMENT.weapons.some(w => w.id === itemId)) {
        requirements.push({
          career: career.name,
          type: 'weapon'
        });
      }
      
      // Armor requirements
      if (career.requiresArmor && 
          STARTING_EQUIPMENT.armor.some(a => a.id === itemId)) {
        requirements.push({
          career: career.name,
          type: 'armor'
        });
      }

      // Special case for Revoker and EVA suit
      if (career.id === 'revoker' && 
          itemId === 'medium-eva' && 
          !character.isNewsoul) {
        requirements.push({
          career: career.name,
          type: 'special'
        });
      }
    }
    
    return requirements;
  };

  const RequirementTag = ({ requirement }: { requirement: { career: string; type: string } }) => {
    const getTagStyle = () => {
      switch (requirement.type) {
        case 'required':
          return 'bg-red-100 text-red-800';
        case 'weapon':
        case 'armor':
          return 'bg-blue-100 text-blue-800';
        case 'special':
          return 'bg-purple-100 text-purple-800';
        default:
          return 'bg-gray-100 text-gray-800';
      }
    };

    return (
      <span className={`inline-block px-2 py-1 text-xs rounded-full mr-1 mb-1 ${getTagStyle()}`}>
        {requirement.type === 'required' ? 'Required for' : 'Enables'} {requirement.career}
      </span>
    );
  };

  const EquipmentItem = ({ item, category }: { item: any; category: string }) => {
    const isSelected = character.equipment.includes(item.id);
    const requirements = getCareerRequirements(item.id);

    return (
      <div className="border rounded p-3 mb-2 bg-white">
        <div className="flex items-start space-x-2">
          <input
            type="checkbox"
            id={item.id}
            checked={isSelected}
            onChange={() => {
              const newEquipment = isSelected
                ? character.equipment.filter(i => i !== item.id)
                : character.equipment.length < 3
                ? [...character.equipment, item.id]
                : character.equipment;
              updateCharacter('equipment', newEquipment);
            }}
            disabled={!isSelected && character.equipment.length >= 3}
            className="mt-1 rounded"
          />
          <div className="flex-1">
            <label htmlFor={item.id} className="text-sm font-medium block">
              {item.name}
            </label>
            <p className="text-xs text-gray-500 mt-1">{item.description}</p>
            
            {requirements.length > 0 && (
              <div className="flex flex-wrap mt-2">
                {requirements.map((req, index) => (
                  <RequirementTag key={`${req.career}-${index}`} requirement={req} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="font-medium text-blue-800 mb-2">Equipment Selection</h3>
        <p className="text-sm text-blue-600">
          Select up to 3 pieces of starting equipment. Choose carefully as your selections
          may affect available career paths.
        </p>
        <p className="text-sm text-blue-600 mt-2">
          Selected: {character.equipment.length}/3
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.entries(STARTING_EQUIPMENT).map(([category, items]) => (
          <Card key={category} className="p-4">
            <h3 className="font-medium mb-4 capitalize">{category}</h3>
            {items.map(item => (
              <EquipmentItem 
                key={item.id} 
                item={item}
                category={category}
              />
            ))}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default EquipmentStep;