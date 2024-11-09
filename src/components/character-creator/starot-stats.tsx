'use client';

import React, { useState } from 'react';
import { STATS } from './starot-types';

const StatBox = ({ value, index, onClick, isSelected }) => (
  <div
    onClick={() => onClick(value, index)}
    className={`
      w-12 h-12 
      flex items-center justify-center 
      rounded-lg 
      font-bold text-lg
      cursor-pointer
      transition-all
      ${isSelected 
        ? 'bg-blue-600 text-white ring-2 ring-blue-400 ring-offset-2' 
        : 'bg-white border-2 border-blue-500 hover:bg-blue-50'}
    `}
  >
    {value}
  </div>
);

const StatSlot = ({ stat, assignedValue, onSelect, isActive }) => (
  <div 
    className={`
      border p-4 rounded-lg
      ${isActive ? 'ring-2 ring-blue-400' : ''}
      transition-all
    `}
    onClick={onSelect}
  >
    <label className="block text-sm font-medium mb-2">{stat.name}</label>
    <div
      className={`
        h-16 
        rounded-lg 
        flex items-center justify-center
        cursor-pointer
        ${assignedValue ? 'bg-blue-50' : 'bg-gray-50'}
        ${assignedValue ? 'border-2 border-blue-500' : 'border-2 border-dashed border-gray-300'}
        ${isActive ? 'bg-blue-100' : ''}
        hover:bg-blue-50
      `}
    >
      {assignedValue ? (
        <div className="w-12 h-12 flex items-center justify-center bg-blue-500 text-white rounded-lg font-bold text-lg">
          {assignedValue}
        </div>
      ) : (
        <span className="text-gray-400">Click to assign</span>
      )}
    </div>
  </div>
);

const StatsStep = ({ character, updateCharacter }) => {
  const standardArray = [5, 5, 5, 7, 7, 7, 8, 8, 8];
  const [usingStandardArray, setUsingStandardArray] = useState(true);
  const [availableStats, setAvailableStats] = useState([...standardArray]);
  const [rolledStats, setRolledStats] = useState([]);
  const [selectedStatIndex, setSelectedStatIndex] = useState(null);

  const rollStats = () => {
    const rolls = [];
    for (let i = 0; i < 9; i++) {
      const diceRolls = Array.from({ length: 4 }, () => Math.floor(Math.random() * 4) + 1)
        .sort((a, b) => b - a)
        .slice(0, 3)
        .reduce((sum, roll) => sum + roll, 0);
      rolls.push(diceRolls);
    }
    setRolledStats(rolls);
    setAvailableStats(rolls);
    updateCharacter('stats', {});
  };

  const handleStatBoxClick = (value, index) => {
    setSelectedStatIndex(selectedStatIndex === index ? null : index);
  };

  const handleStatSlotClick = (statId) => {
    if (selectedStatIndex === null) {
      // If we're clicking a slot with a value, make that value available
      if (character.stats[statId]) {
        const valueToReturn = character.stats[statId];
        const newStats = { ...character.stats };
        delete newStats[statId];
        updateCharacter('stats', newStats);
        setAvailableStats(prev => [...prev, valueToReturn]);
      }
      return;
    }

    const selectedValue = availableStats[selectedStatIndex];
    const newStats = { ...character.stats };
    
    // If there was a previous value in this slot, make it available again
    if (newStats[statId]) {
      setAvailableStats(prev => [...prev, newStats[statId]]);
    }
    
    // Assign the new value
    newStats[statId] = selectedValue;
    
    // Remove the assigned value from available stats
    const newAvailableStats = [...availableStats];
    newAvailableStats.splice(selectedStatIndex, 1);
    setAvailableStats(newAvailableStats);
    
    // Update character stats and reset selection
    updateCharacter('stats', newStats);
    setSelectedStatIndex(null);
  };

  const resetStats = () => {
    setAvailableStats(usingStandardArray ? [...standardArray] : [...rolledStats]);
    updateCharacter('stats', {});
    setSelectedStatIndex(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="standardArray"
            checked={usingStandardArray}
            onChange={(e) => {
              setUsingStandardArray(e.target.checked);
              resetStats();
            }}
            className="rounded"
          />
          <label htmlFor="standardArray">Use Standard Array (5,5,5,7,7,7,8,8,8)</label>
        </div>
        
        {!usingStandardArray && (
          <button
            onClick={rollStats}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Roll Stats (4d4 drop lowest)
          </button>
        )}
      </div>

      <div className="p-4 border-2 border-dashed rounded-lg bg-gray-50">
        <h3 className="text-sm font-medium mb-4">Available Stats</h3>
        <div className="flex flex-wrap gap-2">
          {availableStats.map((stat, index) => (
            <StatBox 
              key={`stat-${stat}-${index}`}
              value={stat}
              index={index}
              isSelected={selectedStatIndex === index}
              onClick={handleStatBoxClick}
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {STATS.map(stat => (
          <StatSlot
            key={stat.id}
            stat={stat}
            assignedValue={character.stats[stat.id]}
            onSelect={() => handleStatSlotClick(stat.id)}
          />
        ))}
      </div>

      {selectedStatIndex !== null && (
        <div className="fixed bottom-4 right-4 bg-blue-100 p-4 rounded-lg shadow-lg">
          <p>Click a stat slot to assign {availableStats[selectedStatIndex]}</p>
          <button 
            onClick={() => setSelectedStatIndex(null)}
            className="mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default StatsStep;