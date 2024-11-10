'use client';

import React from 'react';
import { Download, Upload } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { 
  STATS, 
  SPECIES, 
  BASIC_CAREERS, 
  UPSTART_SKILLS, 
  CAREER_SKILLS, 
  STARTING_EQUIPMENT,
  type Character 
} from './starot-types';

interface ExportButtonsProps {
  character: Character;
  onImport: (character: Character) => void;
}

interface PDFLayout {
  pageWidth: number;
  pageHeight: number;
  margin: number;
  boxPadding: number;
  columnWidth: number;
}
const getEquipmentDetails = (itemId: string) => {
  for (const category of Object.values(STARTING_EQUIPMENT)) {
    const item = category.find(i => i.id === itemId);
    if (item) return item;
  }
  return null;
};

const drawBox = (
  pdf: jsPDF, 
  x: number, 
  y: number, 
  width: number, 
  height: number, 
  title?: string,
  layout: PDFLayout
) => {
  // Draw box outline
  pdf.rect(x, y, width, height);
  
  if (title) {
    // Add title background
    pdf.setFillColor(240, 240, 240);
    pdf.rect(x, y, width, 8, 'F');
    
    // Add title text
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(12);
    pdf.text(title, x + layout.boxPadding, y + 6);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
  }
};

const drawStatsColumn = (
  pdf: jsPDF,
  stats: typeof STATS,
  title: string,
  x: number,
  y: number,
  character: any,
  layout: PDFLayout
) => {
  const columnHeight = 40;
  drawBox(pdf, x, y, layout.columnWidth, columnHeight, title, layout);
  
  let currentY = y + 15;
  stats.forEach(stat => {
    const value = character.stats[stat.id] || 0;
    const text = `${stat.name}: ${value}`;
    pdf.text(text, x + layout.boxPadding, currentY);
    currentY += 7;
  });

  return y + columnHeight;
};

const formatSkillText = (
  pdf: jsPDF,
  skill: any,
  character: any,
  x: number,
  y: number,
  layout: PDFLayout
) => {
  const lineHeight = 5;
  let currentY = y;

  // Skill name and type
  pdf.setFont('helvetica', 'bold');
  pdf.text(`• ${skill.name} (${skill.type})`, x, currentY);
  currentY += lineHeight;
  pdf.setFont('helvetica', 'normal');

  // Description with word wrap
  const maxWidth = layout.pageWidth - (2 * layout.margin) - (2 * layout.boxPadding) - 10;
  const lines = pdf.splitTextToSize(skill.description, maxWidth);
  lines.forEach(line => {
    pdf.text(line, x + 10, currentY);
    currentY += lineHeight;
  });

  // Action Points
  if (skill.actionPoints) {
    pdf.text(`AP Cost: ${skill.actionPoints}`, x + 10, currentY);
    currentY += lineHeight;
  }

  // Stats and skill value
  if (skill.stats) {
    const value = skill.stats.reduce((sum, statId) => sum + (character.stats[statId] || 0), 0);
    pdf.text(`Uses: ${skill.stats.join(' + ')}`, x + 10, currentY);
    currentY += lineHeight;
    pdf.text(`Skill Value: ${value}`, x + 10, currentY);
    currentY += lineHeight;
  }

  return currentY + 2;
};
const exportToPDF = (character: any) => {
  const pdf = new jsPDF();
  
  const layout: PDFLayout = {
    pageWidth: 210,
    pageHeight: 297,
    margin: 15,
    boxPadding: 5,
    columnWidth: 60
  };

  let currentY = layout.margin;

  // Title
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.text('STAROT CHARACTER SHEET', layout.margin, currentY);
  currentY += 10;

  // Basic Information
  const basicInfoHeight = 30;
  drawBox(pdf, layout.margin, currentY, layout.pageWidth - (2 * layout.margin), basicInfoHeight, 'BASIC INFORMATION', layout);
  currentY += 12;

  const species = SPECIES.find(s => s.id === character.species);
  const career = BASIC_CAREERS.find(c => c.id === character.career);
  
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  
  [
    `Name: ${character.name}`,
    `Species: ${species?.name}${character.isNewsoul ? ' (Newsoul)' : ''}`,
    `Career: ${career?.name || 'Upstart'}`
  ].forEach(line => {
    pdf.text(line, layout.margin + layout.boxPadding, currentY);
    currentY += 6;
  });

  currentY += 5;

  // Stats Columns
  const physicalStats = STATS.filter(s => s.category === 'Physical');
  const mentalStats = STATS.filter(s => s.category === 'Mental');
  const socialStats = STATS.filter(s => s.category === 'Social');

  currentY = drawStatsColumn(pdf, physicalStats, 'PHYSICAL', layout.margin, currentY, character, layout);
  drawStatsColumn(pdf, mentalStats, 'MENTAL', 
    layout.margin + layout.columnWidth + 5, currentY - 40, character, layout);
  drawStatsColumn(pdf, socialStats, 'SOCIAL', 
    layout.margin + (2 * (layout.columnWidth + 5)), currentY - 40, character, layout);

  currentY += 10;

  // Attributes
  const attributesHeight = 20;
  drawBox(pdf, layout.margin, currentY, layout.pageWidth - (2 * layout.margin), attributesHeight, 'ATTRIBUTES', layout);
  currentY += 12;

  const attributes = {
    'HP': character.stats.pr || 0,
    'SP': character.stats.mr || 0,
    'EVASION': (character.stats.ps || 0) + (character.stats.pa || 0),
    'WP': 3
  };

  let attributeX = layout.margin + layout.boxPadding;
  Object.entries(attributes).forEach(([key, value]) => {
    pdf.text(`${key}: ${value}`, attributeX, currentY);
    attributeX += 45;
  });

  currentY += 15;

  // Equipment
  const equipmentHeight = 35;
  drawBox(pdf, layout.margin, currentY, layout.pageWidth - (2 * layout.margin), equipmentHeight, 'EQUIPMENT', layout);
  currentY += 12;

  character.equipment.forEach(itemId => {
    const item = getEquipmentDetails(itemId);
    if (item) {
      pdf.setFont('helvetica', 'bold');
      pdf.text(`• ${item.name}`, layout.margin + layout.boxPadding, currentY);
      pdf.setFont('helvetica', 'normal');
      currentY += 5;
      pdf.text(item.description, layout.margin + layout.boxPadding + 10, currentY);
      currentY += 7;
    }
  });

  currentY += 5;

  // Common Skills
  const commonSkillIds = ['attack', 'evade', 'endure', 'reposition'];
  const commonSkills = UPSTART_SKILLS.filter(skill => commonSkillIds.includes(skill.id));
  const otherSkills = UPSTART_SKILLS.filter(skill => !commonSkillIds.includes(skill.id));

  // Common Skills Box
  const commonSkillsHeight = commonSkills.length * 20 + 10;
  drawBox(pdf, layout.margin, currentY, layout.pageWidth - (2 * layout.margin), commonSkillsHeight, 'COMMON ACTIONS', layout);
  currentY += 12;

  commonSkills.forEach(skill => {
    currentY = formatSkillText(pdf, skill, character, layout.margin + layout.boxPadding, currentY, layout);
  });

  currentY += 5;

  // Other Skills - Check if we need a new page
  if (currentY > layout.pageHeight - 50) {
    pdf.addPage();
    currentY = layout.margin;
  }

  // Other Skills Box
  const otherSkillsHeight = otherSkills.length * 20 + 10;
  drawBox(pdf, layout.margin, currentY, layout.pageWidth - (2 * layout.margin), otherSkillsHeight, 'OTHER SKILLS', layout);
  currentY += 12;

  otherSkills.forEach(skill => {
    currentY = formatSkillText(pdf, skill, character, layout.margin + layout.boxPadding, currentY, layout);
    if (currentY > layout.pageHeight - 20) {
      pdf.addPage();
      currentY = layout.margin;
    }
  });

  // Career Skills - if any
  if (character.career !== 'upstart' && career?.skills) {
    if (currentY > layout.pageHeight - 50) {
      pdf.addPage();
      currentY = layout.margin;
    }

    const careerSkills = career.skills
      .map(skillId => CAREER_SKILLS[skillId])
      .filter(Boolean);

    const careerSkillsHeight = careerSkills.length * 20 + 10;
    drawBox(pdf, layout.margin, currentY, layout.pageWidth - (2 * layout.margin), careerSkillsHeight, 
      `${career.name.toUpperCase()} SKILLS`, layout);
    currentY += 12;

    careerSkills.forEach(skill => {
      currentY = formatSkillText(pdf, skill, character, layout.margin + layout.boxPadding, currentY, layout);
    });
  }

  const filename = `${character.name.replace(/\s+/g, '_')}_character_sheet.pdf`;
  pdf.save(filename);
};
const ExportButtons: React.FC<ExportButtonsProps> = ({ character, onImport }) => {
  const handleExport = () => {
    exportToPDF(character);
  };

  const handleJSONExport = () => {
    const jsonStr = JSON.stringify(character, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${character.name.replace(/\s+/g, '_')}_character.json`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result;
        if (typeof content === 'string') {
          const data = JSON.parse(content) as Character;
          onImport(data);
        }
      } catch (error) {
        console.error('Error importing character:', error);
        alert('Error importing character file');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex gap-4 mb-4">
      <button
        onClick={handleExport}
        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        <Download className="w-4 h-4 mr-2" />
        Export PDF
      </button>

      <button
        onClick={handleJSONExport}
        className="flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        <Download className="w-4 h-4 mr-2" />
        Export JSON
      </button>
      
      <label className="flex items-center px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 cursor-pointer">
        <Upload className="w-4 h-4 mr-2" />
        Import Character
        <input
          type="file"
          accept=".json"
          onChange={handleImport}
          className="hidden"
        />
      </label>
    </div>
  );
};

export default ExportButtons;