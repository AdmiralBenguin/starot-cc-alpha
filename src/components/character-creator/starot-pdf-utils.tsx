'use client';

import jsPDF from 'jspdf';
import { saveAs } from 'file-saver';
import { 
  STATS, 
  BASIC_CAREERS, 
  UPSTART_SKILLS, 
  CAREER_SKILLS,
  type Character,
  type Skill
} from './starot-types';

interface SkillWithValue extends Skill {
  value?: number;
}

export const exportCharacterToPDF = (character: Character) => {
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
    pdf.text(`• ${itemId}`, 25, yPos);
    yPos += lineHeight;
  });
  yPos += lineHeight;

  // Skills
  pdf.setFontSize(16);
  pdf.text('Skills', 20, yPos);
  yPos += lineHeight;

  pdf.setFontSize(12);
  
  // Helper function to calculate skill value
  const calculateSkillValue = (skill: Skill): number => {
    if (!skill.stats) return 0;
    return skill.stats.reduce((sum: number, statId: string) => 
      sum + (character.stats[statId] || 0), 0);
  };

  // Helper function to format skill text
  const formatSkillText = (skill: SkillWithValue): string => {
    const value = calculateSkillValue(skill);
    return `• ${skill.name} (${skill.type})${value ? ` - Value: ${value}` : ''}`;
  };

  // Add Upstart skills
  pdf.text('Upstart Skills:', 25, yPos);
  yPos += lineHeight;
  
  UPSTART_SKILLS.forEach((skill: Skill) => {
    const text = formatSkillText(skill);
    pdf.text(text, 30, yPos);
    yPos += lineHeight;
  });

  // Add Career skills if any
  if (character.career !== 'upstart' && character.career) {
    const career = BASIC_CAREERS.find(c => c.id === character.career);
    if (career?.skills) {
      yPos += lineHeight;
      pdf.text(`${career.name} Skills:`, 25, yPos);
      yPos += lineHeight;

      const careerSkills = career.skills
        .map(skillId => CAREER_SKILLS[skillId])
        .filter((skill): skill is Skill => skill !== undefined);

      careerSkills.forEach((skill: Skill) => {
        const text = formatSkillText(skill);
        pdf.text(text, 30, yPos);
        yPos += lineHeight;
      });
    }
  }

  // Add page check and handling
  const checkPageBreak = () => {
    if (yPos > pdf.internal.pageSize.height - 20) {
      pdf.addPage();
      yPos = 20;
    }
  };

  // Periodically check for page breaks
  checkPageBreak();

  // Save to file
  const filename = `${character.name.replace(/\s+/g, '_')}_character_sheet.pdf`;
  pdf.save(filename);
};