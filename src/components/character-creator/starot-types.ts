'use client';

export interface Skill {
  id: string;
  name: string;
  type: 'manoeuvre' | 'ability' | 'passive';
  actionPoints?: number;
  description: string;
  stats?: string[];
}

export interface Character {
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
}

export const STATS = [
  { id: 'ps', name: 'Physical Strength', category: 'Physical' },
  { id: 'pa', name: 'Physical Agility', category: 'Physical' },
  { id: 'pr', name: 'Physical Resilience', category: 'Physical' },
  { id: 'ms', name: 'Mental Strength', category: 'Mental' },
  { id: 'ma', name: 'Mental Agility', category: 'Mental' },
  { id: 'mr', name: 'Mental Resilience', category: 'Mental' },
  { id: 'ss', name: 'Social Strength', category: 'Social' },
  { id: 'sa', name: 'Social Agility', category: 'Social' },
  { id: 'sr', name: 'Social Resilience', category: 'Social' }
];

export const SPECIES = [
  { id: 'terran', name: 'Terran', description: 'Human-looking, Vary in Height' },
  { id: 'ranau', name: 'Ranau', description: 'Scales, Bipedal, No Tail, Lizard-Like in appearance' },
  { id: 'kilerau', name: 'Kilerau', description: 'Formic Features, Tripedal, semi-compound eyes' },
  { id: 'yvetrau', name: 'Yvetrau', description: 'Ursine Features, 6 limbs - 4 Legs and 2 arms' },
  { id: 'gilean', name: 'Gilean', description: 'Four double jointed Arms, Bipedal, Lean and tall' },
  { id: 'wurefon', name: 'Wurefon', description: 'Anthropomorphised Axolotls' },
  { id: 'qutalon', name: 'Qutalon', description: 'Hard Shells, Eyes protrude from head on stalks' },
  { id: 'werolon', name: 'Werolon', description: 'Scales, Shark-like in appearance' }
];

export const STARTING_EQUIPMENT = {
  weapons: [
    { id: 'phase-pistol', name: 'Phase Pistol', description: 'On Hit 1d4 Physical Damage' },
    { id: 'phase-rifle', name: 'Phase Rifle', description: 'On Hit 2d4 Physical Damage' },
    { id: 'simple-blade', name: 'Simple Blade', description: 'On Hit 2d6 Physical Damage' },
    { id: 'psionic-focus', name: 'Psionic Focus', description: 'On Hit 1d4 Mental Damage' }
  ],
  armor: [
    { id: 'light-vest', name: 'Light Vest', description: 'Increase Evasion by 1' },
    { id: 'medium-vest', name: 'Medium Vest', description: 'Increase Evasion by 2' },
    { id: 'light-shields', name: 'Light Shields', description: 'Reduce all incoming Physical Damage by 1' },
    { id: 'medium-shields', name: 'Medium Shields', description: 'Reduce all incoming Physical Damage by 2' },
    { id: 'medium-eva', name: 'Medium EVA suit', description: 'Allows Extra-Vehicular Activity for non-Newsouls' }
  ],
  tools: [
    { id: 'personal-terminal', name: 'Personal Terminal', description: 'Career Prerequisite' },
    { id: 'interface-multitool', name: 'Interface Multitool', description: 'Career Prerequisite' },
    { id: 'medical-kit', name: 'Medical Kit', description: 'Career Prerequisite' }
  ]
};

export const TRAINING = [
  { id: 'medic', name: 'Basic Medic Training' },
  { id: 'operator', name: 'Basic Operator Training' },
  { id: 'pilot', name: 'Basic Pilot Training' },
  { id: 'soldier', name: 'Basic Soldier Training' }
];

export const BASIC_CAREERS = [
  { 
    id: 'medic',
    name: 'Medic',
    requirements: ['medical-kit', 'medic'],
    description: 'You are proficient at lifesaving',
    skills: ['resuscitate']
  },
  {
    id: 'operator',
    name: 'Operator',
    requirements: ['personal-terminal', 'interface-multitool', 'operator'],
    description: 'You are proficient in the digital arts',
    skills: ['hack', 'modify-log', 'override']
  },
  {
    id: 'pilot',
    name: 'Pilot',
    requirements: ['pilot'],
    description: 'You are proficient in piloting ships',
    skills: ['manual-manoeuvre', 'manual-targeting', 'plot-course']
  },
  {
    id: 'soldier',
    name: 'Soldier',
    requirements: ['soldier'],
    description: 'You are proficient with the arts of war',
    requiresWeapon: true,
    requiresArmor: true,
    skills: ['combat-awareness', 'combat-reposition', 'manual-targeting']
  },
  {
    id: 'revoker',
    name: 'Revoker',
    requirements: ['medium-eva'],
    description: 'You channel your latent psychic potential to deny aspects of reality',
    requiresNewsoul: false,
    skills: ['revoke']
  }
];

export const UPSTART_SKILLS = [
  {
    id: 'attack',
    name: 'Attack',
    type: 'manoeuvre',
    actionPoints: 1,
    description: 'Attempt to damage a target using a weapon in your inventory.'
  },
  {
    id: 'convince',
    name: 'Convince',
    type: 'manoeuvre',
    actionPoints: 2,
    description: 'Attempt to make an intelligent target understand a true idea as truth.',
    stats: ['ss', 'sa']
  },
  {
    id: 'decieve',
    name: 'Deceive',
    type: 'manoeuvre',
    actionPoints: 2,
    description: 'Attempt to make an intelligent target understand a false idea as truth.',
    stats: ['ss']
  },
  {
    id: 'discern-truth',
    name: 'Discern Truth',
    type: 'ability',
    description: 'Discern the truth of an idea.',
    stats: ['sa', 'sr']
  },
 
  {
    id: 'distract',
    name: 'Distract',
    type: 'manoeuvre',
    actionPoints: 2,
    description: 'Attempt to distract a target that you can communicate with.',
    stats: ['ss']
  },
  {
    id: 'endure',
    name: 'Endure',
    type: 'ability',
    actionPoints: 1,
    description: 'Prevent one instance of physical damage below 5 points that you would otherwise take for one combat round',
    stats: ['ps', 'pr']
  },
  {
    id: 'evade',
    name: 'Evade',
    type: 'ability',
    actionPoints: 1,
    description: 'Halve the next instance of physical damage that you would otherwise take for this combat round.',
    stats: ['pa']
  },
  {
    id: 'exert',
    name: 'Exert',
    type: 'manoeuvre',
    actionPoints: 2,
    description: 'Attempt to push, pull, shove, lift or throw a target.',
    stats: ['ps']
  },
  {
    id: 'hide',
    name: 'Hide',
    type: 'manoeuvre',
    actionPoints: 2,
    description: 'Attempt to escape perception.',
    stats: ['pa', 'ma']
  },
  {
    id: 'medical-aid',
    name: 'Medical Aid',
    type: 'manoeuvre',
    actionPoints: 2,
    description: 'Attempt to help a target recover 10 HP.',
    stats: ['ms', 'pa']
  },
  {
    id: 'perceive',
    name: 'Perceive',
    type: 'ability',
    actionPoints: 1,
    description: 'Attempt to perceive something that is not immediately physically obvious.',
    stats: ['ma']
  },
  {
    id: 'recall-knowledge',
    name: 'Recall Knowledge',
    type: 'manoeuvre',
    actionPoints: 2,
    description: 'Attempt to remember knowledge that you have previously learned.',
    stats: ['ms', 'ma']
  },
  {
    id: 'reposition',
    name: 'Reposition',
    type: 'ability',
    actionPoints: 1,
    description: 'Attempt to move to a space no more than 5 Spaces away.',
    stats: ['pa', 'pr']
  },
  {
    id: 'stunt',
    name: 'Stunt',
    type: 'manoeuvre',
    actionPoints: 2,
    description: 'Attempt to jump, flip, climb, land or related act.',
    stats: ['pa']
  }
];

export type Character = {
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

export type StepProps = {
  character: Character;
  updateCharacter: (field: keyof Character, value: any) => void;
};

export const CAREER_SKILLS: Record<string, Skill> = {
  resuscitate: {
    id: 'resuscitate',
    name: 'Resuscitate',
    type: 'manoeuvre',
    actionPoints: 2,
    description: 'Attempt to remove two wounds from a target.',
    stats: ['ms', 'pa']
  },
  hack: {
    id: 'hack',
    name: 'Hack',
    type: 'manoeuvre',
    actionPoints: 2,
    description: 'Attempt to gain access to a technological system.',
    stats: ['ms', 'ma']
  },
  'modify-log': {
    id: 'modify-log',
    name: 'Modify Log',
    type: 'manoeuvre',
    actionPoints: 2,
    description: 'Attempt to edit system logs.',
    stats: ['ms', 'ma']
  },
  override: {
    id: 'override',
    name: 'Override',
    type: 'manoeuvre',
    actionPoints: 2,
    description: 'Attempt to rewrite system functions.',
    stats: ['ms', 'ma']
  },
  'manual-manoeuvre': {
    id: 'manual-manoeuvre',
    name: 'Manual Manoeuvre',
    type: 'manoeuvre',
    actionPoints: 2,
    description: 'Attempt to manually steer a ship.',
    stats: ['pa', 'ma']
  },
  'manual-targeting': {
    id: 'manual-targeting',
    name: 'Manual Targeting',
    type: 'manoeuvre',
    actionPoints: 2,
    description: 'Attempt to manually target with ship weapons.',
    stats: ['pa', 'ma']
  },
  'plot-course': {
    id: 'plot-course',
    name: 'Plot Course',
    type: 'ability',
    actionPoints: 1,
    description: 'Chart a course through space.',
    stats: ['ma', 'ms']
  },
  'combat-awareness': {
    id: 'combat-awareness',
    name: 'Combat Awareness',
    type: 'passive',
    description: 'Pioneers take first round in non-ambush combat.'
  },
  'combat-reposition': {
    id: 'combat-reposition',
    name: 'Combat Reposition',
    type: 'manoeuvre',
    actionPoints: 1,
    description: 'Attack and reposition in one action.',
    stats: ['ps', 'pa', 'pr']
  },
'revoke': {
    id: 'revoke',
    name: 'Revoke',
    type: 'manoeuvre',
    actionPoints: 2,
    description: 'Attempt to deny an aspect of reality.',
    stats: ['ma', 'mr']
  }
};