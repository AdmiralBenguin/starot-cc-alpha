'use client';

import jsPDF from 'jspdf';
import { saveAs } from 'file-saver';
import { STATS, BASIC_CAREERS, UPSTART_SKILLS, CAREER_SKILLS } from './starot-types';

export const exportCharacterToPDF = (character: any) => {
  const pdf = new jsPDF();
  let yPos = 20;
  const lineHeight = 7;

  // Set title
  pdf.setFontSize(20);
  pdf.text('Starot Character Sheet', 20, yPos);
  yPos += lineHeight * 2;

  // Basic Info
  pdf.setFontSize(16);
  pdf.text('Basic Information', 20, yPos);
  yPos += lineHeight;
  
  pdf.setFontSize(12);
  pdf.text(`Name: ${character.name}`, 25, yPos);
  yPos += lineHeight;
  pdf.text(`Species: ${character.species}${character.isNewsoul ? ' (Newsoul)' : ''}`, 25, yPos);
  yPos += lineHeight;
  pdf.text(`Career: ${BASIC_CAREERS.find(c => c.id === character.career)?.name || 'Upstart'}`, 25, yPos);
  yPos += lineHeight * 2;

  // Stats
  pdf.setFontSize(16);
  pdf.text('Stats', 20, yPos);
  yPos += lineHeight;

  pdf.setFontSize(12);
  const statsPerColumn = 3;
  const columnWidth = 60;
  STATS.forEach((stat, index) => {
    const column = Math.floor(index / statsPerColumn);
    const xPos = 25 + (column * columnWidth);
    const localY = yPos + ((index % statsPerColumn) * lineHeight);
    const value = character.stats[stat.id] || 0;
    pdf.text(`${stat.name}: ${value}`, xPos, localY);
  });
  yPos += (lineHeight * statsPerColumn) + lineHeight;

  // Attributes
  pdf.setFontSize(16);
  pdf.text('Attributes', 20, yPos);
  yPos += lineHeight;

  pdf.setFontSize(12);
  const attributes = {
    hp: character.stats.pr || 0,
    sp: character.stats.mr || 0,
    evasion: (character.stats.ps || 0) + (character.stats.pa || 0),
    wp: 3
  };

  Object.entries(attributes).forEach(([key, value]) => {
    pdf.text(`${key.toUpperCase()}: ${value}`, 25, yPos);
    yPos += lineHeight;
  });
  yPos += lineHeight;

  // Equipment
  pdf.setFontSize(16);
  pdf.text('Equipment', 20, yPos);
  yPos += lineHeight;

  pdf.setFontSize(12);
  character.equipment.forEach((itemId: string) => {
    // Find item details from your equipment data
    pdf.text(`• ${itemId}`, 25, yPos);
    yPos += lineHeight;
  });
  yPos += lineHeight;

  // Skills
  pdf.setFontSize(16);
  pdf.text('Skills', 20, yPos);
  yPos += lineHeight;

  pdf.setFontSize(12);
  // Add Upstart skills
  pdf.text('Upstart Skills:', 25, yPos);
  yPos += lineHeight;
  UPSTART_SKILLS.forEach(skill => {
    const skillValue = skill.stats?.reduce((sum, statId) => sum + (character.stats[statId] || 0), 0);
    pdf.text(`• ${skill.name} (${skill.type})${skillValue ? ` - Value: ${skillValue}` : ''}`, 30, yPos);
    yPos += lineHeight;
  });

  // Add Career skills if any
  if (character.career !== 'upstart') {
    const careerSkills = CAREER_SKILLS[character.career] || [];
    yPos += lineHeight;
    pdf.text(`${character.career} Skills:`, 25, yPos);
    yPos += lineHeight;
    careerSkills.forEach(skill => {
      const skillValue = skill.stats?.reduce((sum, statId) => sum + (character.stats[statId] || 0), 0);
      pdf.text(`• ${skill.name} (${skill.type})${skillValue ? ` - Value: ${skillValue}` : ''}`, 30, yPos);
      yPos += lineHeight;
    });
  }

  // Save to file
  const filename = `${character.name.replace(/\s+/g, '_')}_character_sheet.pdf`;
  pdf.save(filename);
};

// Add this button component to your CharacterSheet component: