import { LudoDiscoveryRecord, LudoDuelQuestion } from '@/games/ludo/types';

export const LUDO_CIVILIZATIONS = [
  {
    id: 'indus',
    name: 'Indus Valley',
    short: 'Indus',
    period: 'c. 2600–1900 BCE',
    color: '#243B64', // Deep Indigo
  },
  {
    id: 'maurya',
    name: 'Mauryan Empire',
    short: 'Maurya',
    period: 'c. 322–185 BCE',
    color: '#C96B4B', // Terracotta
  },
  {
    id: 'chola',
    name: 'Chola Period',
    short: 'Chola',
    period: 'c. 9th–13th century',
    color: '#D4A84F', // Muted Gold
  },
  {
    id: 'gupta',
    name: 'Gupta Period',
    short: 'Gupta',
    period: 'c. 319–550 CE',
    color: '#3F7C78', // Muted Teal
  },
] as const;

export const LUDO_DISCOVERIES: LudoDiscoveryRecord[] = [
  {
    id: 'tile-8',
    title: 'The Great Bath',
    category: 'Monument',
    context: 'Mohenjo-daro',
    civilizationId: 'indus',
    description:
      'A watertight baked-brick tank at Mohenjo-daro. Ritual or public bathing is inferred; the exact original use is not proven.',
  },
  {
    id: 'tile-21',
    title: 'Ashoka’s Edicts',
    category: 'Heritage',
    context: 'Mauryan realm',
    civilizationId: 'maurya',
    description:
      'Rock and pillar inscriptions of Ashoka discuss dhamma—public ethics and welfare—in readable historical languages.',
  },
  {
    id: 'tile-34',
    title: 'Brihadisvara',
    category: 'Monument',
    context: 'Thanjavur',
    civilizationId: 'chola',
    description:
      'The great temple at Thanjavur was a royal foundation of Rajaraja I, completed around 1010 CE.',
  },
  {
    id: 'tile-47',
    title: 'Aryabhata',
    category: 'Invention',
    context: 'Gupta-era scholarship',
    civilizationId: 'gupta',
    description:
      'Aryabhata’s work in mathematics and astronomy belongs to the wider Gupta-period flourishing of Sanskrit science.',
  },
];

export const LUDO_QUESTIONS: LudoDuelQuestion[] = [
  {
    id: 'q-harappa',
    question: 'The Indus civilisation is also called Harappan mainly because:',
    choices: [
      'Harappa was its only city',
      'Early excavations at Harappa became the type-site',
      'Harappa invented iron coinage',
    ],
    correctIndex: 1,
    explanation:
      'Harappa gave the culture its modern archaeological name; many other settlements are now known.',
    era: 'Indus Valley',
    difficulty: 'easy',
  },
  {
    id: 'q-ashoka',
    question: 'Ashokan edicts are important because they are:',
    choices: [
      'Contemporary royal inscriptions in readable languages',
      'The decoded Indus script',
      'Chola temple foundation hymns',
    ],
    correctIndex: 0,
    explanation: 'The edicts are dated Mauryan public texts, not Indus writing or Chola hymns.',
    era: 'Mauryan',
    difficulty: 'easy',
  },
  {
    id: 'q-lothal',
    question: 'Lothal is discussed especially for evidence of:',
    choices: [
      'A major water basin linked to craft and trade',
      'The Sarnath lion capital',
      'Nataraja bronzes',
    ],
    correctIndex: 0,
    explanation: 'Lothal is a Harappan site associated with a large brick basin and workshops.',
    era: 'Indus Valley',
    difficulty: 'medium',
  },
  {
    id: 'q-dhamma',
    question: 'In Ashoka’s edicts, dhamma refers mainly to:',
    choices: [
      'A civic ethic of restraint and welfare',
      'A single exclusive temple cult',
      'A naval code of the Cholas',
    ],
    correctIndex: 0,
    explanation: 'The edicts present dhamma as ethical conduct and public care, not one exclusive sect.',
    era: 'Mauryan',
    difficulty: 'medium',
  },
  {
    id: 'q-brihad',
    question: 'Brihadisvara at Thanjavur was founded under:',
    choices: ['Rajaraja I of the Cholas', 'Ashoka Maurya', 'The Harappan civic board'],
    correctIndex: 0,
    explanation: 'Inscriptions and architectural history credit Rajaraja I, c. 1010 CE.',
    era: 'Chola',
    difficulty: 'easy',
  },
  {
    id: 'q-bronze',
    question: 'Chola Nataraja images were typically made by:',
    choices: ['Lost-wax bronze casting', 'Indus steatite stamping', 'Ashokan pillar carving'],
    correctIndex: 0,
    explanation: 'The classic Chola icons are lost-wax bronzes made for temple ritual.',
    era: 'Chola',
    difficulty: 'easy',
  },
  {
    id: 'q-sarnath',
    question: 'The lion capital now used as India’s emblem comes from:',
    choices: ['Sarnath, from an Ashokan pillar', 'The Great Bath, Mohenjo-daro', 'Thanjavur temple vimana'],
    correctIndex: 0,
    explanation: 'The Sarnath lion capital crowned an Ashokan pillar at a Buddhist site.',
    era: 'Mauryan',
    difficulty: 'easy',
  },
  {
    id: 'q-drain',
    question: 'Covered street drains at Mohenjo-daro mainly demonstrate:',
    choices: [
      'Organised urban waste-water planning',
      'That the Indus script is fully read',
      'Mauryan rock-cut halls',
    ],
    correctIndex: 0,
    explanation: 'Archaeology records brick drains and house outlets; it does not decode the script.',
    era: 'Indus Valley',
    difficulty: 'medium',
  },
];

export const LUDO_TOPICS = [
  { id: 'ancient', title: 'Ancient India', desc: 'Civilizations and early empires' },
  { id: 'monuments', title: 'Monuments', desc: 'Temples, stupas, and structures' },
  { id: 'culture', title: 'Art & Culture', desc: 'Sculpture, trade, and tradition' },
];

export const RAPID_FIRE_QUESTIONS: Record<string, { q: string, options: string[], correct: number }[]> = {
  ancient: [
    { q: 'Which civilization is associated with Harappa?', options: ['Indus Valley', 'Mauryan', 'Chola', 'Gupta'], correct: 0 },
    { q: 'Who was known as the Lion of India?', options: ['Ashoka', 'Lala Lajpat Rai', 'Shivaji', 'Chandragupta'], correct: 1 },
    { q: 'Which emperor spread Buddhism?', options: ['Akbar', 'Rajaraja I', 'Ashoka', 'Kanishka'], correct: 2 },
    { q: 'The Gupta period is often called the:', options: ['Bronze Age', 'Golden Age', 'Iron Age', 'Dark Age'], correct: 1 },
    { q: 'Where is the ancient city of Mohenjo-Daro?', options: ['Indus Valley', 'Ganges Plain', 'Deccan Plateau', 'Himalayas'], correct: 0 },
    { q: 'What material were Harappan seals made of?', options: ['Gold', 'Iron', 'Steatite', 'Wood'], correct: 2 },
  ],
  monuments: [
    { q: 'Where is the Taj Mahal located?', options: ['Delhi', 'Agra', 'Jaipur', 'Mumbai'], correct: 1 },
    { q: 'What is a stupa mainly associated with?', options: ['Hinduism', 'Jainism', 'Buddhism', 'Islam'], correct: 2 },
    { q: 'Which city is famous for the Charminar?', options: ['Hyderabad', 'Bangalore', 'Chennai', 'Pune'], correct: 0 },
    { q: 'The Brihadisvara temple is in:', options: ['Madurai', 'Thanjavur', 'Hampi', 'Mysore'], correct: 1 },
    { q: 'The Sarnath lion capital is from which empire?', options: ['Chola', 'Mughal', 'Mauryan', 'Gupta'], correct: 2 },
    { q: 'Who built the Qutub Minar?', options: ['Qutb-ud-din Aibak', 'Akbar', 'Shah Jahan', 'Babur'], correct: 0 },
  ],
  culture: [
    { q: 'Chola Nataraja images are made of:', options: ['Wood', 'Marble', 'Bronze', 'Gold'], correct: 2 },
    { q: 'Which language is Ashokan edicts mostly written in?', options: ['Sanskrit', 'Prakrit', 'Tamil', 'Persian'], correct: 1 },
    { q: 'Aryabhata was famous for his work in:', options: ['Poetry', 'Sculpture', 'Mathematics', 'Warfare'], correct: 2 },
    { q: 'The Ajanta caves are famous for their:', options: ['Paintings', 'Gardens', 'Palaces', 'Tombs'], correct: 0 },
    { q: 'What did the Indus people trade heavily?', options: ['Silk', 'Cotton', 'Coffee', 'Tea'], correct: 1 },
    { q: 'Which dynasty is famous for naval power?', options: ['Mauryan', 'Gupta', 'Chola', 'Mughal'], correct: 2 },
  ]
};
