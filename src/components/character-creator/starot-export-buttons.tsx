'use client';

import React from 'react';
import { Download, Upload } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { STATS, SPECIES, BASIC_CAREERS, UPSTART_SKILLS, CAREER_SKILLS, STARTING_EQUIPMENT } from './starot-types';

interface ExportButtonsProps {
  character: any;
  onImport: (character: any) => void;
}

const getEquipmentDetails = (itemId: string) => {
  for (const category of Object.values(STARTING_EQUIPMENT)) {
    const item = category.find(i => i.id === itemId);
    if (item) return item;
  }
  return null;
};

const drawBox = (pdf: jsPDF, x: number, y: number, width: number, height: number, title?: string) => {
  pdf.rect(x, y, width, height);
  if (title) {
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(12);
    pdf.text(title, x + 3, y + 6);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
  }
};

const addSkillSection = (pdf: jsPDF, skills: any[], title: string, startY: number, margin: number, pageWidth: number) => {
  let currentY = startY;
  const boxPadding = 3;

  drawBox(pdf, margin, currentY, pageWidth - 2 * margin, 5 + skills.length * 20, title);
  currentY += 10;

  skills.forEach(skill => {
    pdf.setFont('helvetica', 'bold');
    pdf.text(`• ${skill.name} (${skill.type})`, margin + boxPadding, currentY);
    currentY += 5;
    
    pdf.setFont('helvetica', 'normal');
    const description = pdf.splitTextToSize(skill.description, pageWidth - 2 * (margin + boxPadding) - 10);
    description.forEach((line: string) => {
      pdf.text(line, margin + boxPadding + 10, currentY);
      currentY += 5;
    });

    if (skill.actionPoints) {
      pdf.text(`AP Cost: ${skill.actionPoints}`, margin + boxPadding + 10, currentY);
      currentY += 5;
    }

    if (skill.stats) {
      pdf.text(`Uses: ${skill.stats.join(' + ')}`, margin + boxPadding + 10, currentY);
      currentY += 5;
    }

    currentY += 2;
  });

  return currentY;
};

const exportToPDF = (character: any) => {
  const pdf = new jsPDF({
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = 210; // A4 width
  const pageHeight = 297; // A4 height
  const margin = 10;
  const boxPadding = 3;

  // Title
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.text('STAROT CHARACTER SHEET', margin, margin + 10);

  let currentY = margin + 20;

  // Basic Info Box
  drawBox(pdf, margin, currentY, pageWidth - 2 * margin, 25, 'BASIC INFORMATION');
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  const species = SPECIES.find(s => s.id === character.species);
  const career = BASIC_CAREERS.find(c => c.id === character.career);
  
  currentY += 10;
  pdf.text([
    `Name: ${character.name}`,
    `Species: ${species?.name}${character.isNewsoul ? ' (Newsoul)' : ''}`,
    `Career: ${career?.name || 'Upstart'}`
  ], margin + boxPadding, currentY);

  currentY += 20;

  // Stats & Attributes Box
  const columnWidth = (pageWidth - 2 * margin - boxPadding) / 3;
  
  // Physical Stats
  drawBox(pdf, margin, currentY, columnWidth, 40, 'PHYSICAL');
  currentY += 10;
  STATS.filter(s => s.category === 'Physical').forEach(stat => {
    pdf.text(`${stat.name}: ${character.stats[stat.id] || 0}`, margin + boxPadding, currentY);
    currentY += 5;
  });

  // Mental Stats
  currentY -= 15;
  drawBox(pdf, margin + columnWidth + boxPadding, currentY, columnWidth, 40, 'MENTAL');
  STATS.filter(s => s.category === 'Mental').forEach(stat => {
    pdf.text(
      `${stat.name}: ${character.stats[stat.id] || 0}`, 
      margin + columnWidth + boxPadding * 2, 
      currentY + 10
    );
    currentY += 5;
  });

  // Social Stats
  currentY -= 15;
  drawBox(pdf, margin + 2 * (columnWidth + boxPadding), currentY, columnWidth, 40, 'SOCIAL');
  STATS.filter(s => s.category === 'Social').forEach(stat => {
    pdf.text(
      `${stat.name}: ${character.stats[stat.id] || 0}`, 
      margin + 2 * columnWidth + boxPadding * 3, 
      currentY + 10
    );
    currentY += 5;
  });

  currentY += 20;

  // Derived Attributes Box
  drawBox(pdf, margin, currentY, pageWidth - 2 * margin, 20, 'ATTRIBUTES');
  const attributes = {
    'HP': character.stats.pr || 0,
    'SP': character.stats.mr || 0,
    'EVASION': (character.stats.ps || 0) + (character.stats.pa || 0),
    'WP': 3
  };

  currentY += 10;
  let attrX = margin + boxPadding;
  Object.entries(attributes).forEach(([key, value]) => {
    pdf.text(`${key}: ${value}`, attrX, currentY);
    attrX += 45;
  });

  currentY += 15;

  // Equipment Box
  drawBox(pdf, margin, currentY, pageWidth - 2 * margin, 35, 'EQUIPMENT');
  currentY += 10;
  character.equipment.forEach(itemId => {
    const item = getEquipmentDetails(itemId);
    if (item) {
      pdf.setFont('helvetica', 'bold');
      pdf.text(`• ${item.name}`, margin + boxPadding, currentY);
      pdf.setFont('helvetica', 'normal');
      currentY += 5;
      pdf.text(`  ${item.description}`, margin + boxPadding, currentY);
      currentY += 7;
    }
  });

  currentY += 5;

  // Common Skills Box (Attack, Evade, etc.)
  const commonSkillIds = ['attack', 'evade', 'endure', 'reposition'];
  const commonSkills = UPSTART_SKILLS.filter(skill => commonSkillIds.includes(skill.id));
  const otherSkills = UPSTART_SKILLS.filter(skill => !commonSkillIds.includes(skill.id));

  currentY = addSkillSection(pdf, commonSkills, 'COMMON ACTIONS', currentY, margin, pageWidth);
  currentY += 5;

  // Other Skills
  if (currentY > pageHeight - 50) {
    pdf.addPage();
    currentY = margin;
  }
  
  currentY = addSkillSection(pdf, otherSkills, 'OTHER SKILLS', currentY, margin, pageWidth);

  // Career Skills if any
  if (character.career !== 'upstart' && career?.skills) {
    if (currentY > pageHeight - 50) {
      pdf.addPage();
      currentY = margin;
    }
    
    const careerSkills = career.skills
      .map(skillId => CAREER_SKILLS[skillId])
      .filter(Boolean);
    
    currentY = addSkillSection(pdf, careerSkills, `${career.name.toUpperCase()} SKILLS`, currentY, margin, pageWidth);
  }

  // Save the PDF
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
          const data = JSON.parse(content);
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