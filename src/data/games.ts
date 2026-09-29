import { GameModule } from './types';

export const GAME_MODULES: GameModule[] = [
  {
    id: 'chronosearch',
    name: 'ChronoSearch: Hunt Through History',
    subtitle: 'Historical Word Search',
    description:
      'Search a letter grid for hidden historical words. Each find opens a short explanation; important words include a small knowledge challenge and earn XP.',
    category: 'etymology_search',
    categoryLabel: 'Word Search',
    difficulty: 'Easy',
    relatedCivilizationId: 'indus-valley',
    relatedTopicTitle: 'All Topics',
    status: 'playable_preview',
    playerMode: 'solo',
    isLocked: false,
    progressPercent: 0,
    illustrationKey: 'chronosearch',
    learningLoop:
      'Choose Era → Search → Discover Historical Word → Learn → Mini Challenge → Earn XP',
    gameplayPreview:
      'Hold the first letter, swipe through the word, then release. Horizontal, vertical, and diagonal paths all count.',
    xpReward: 20,
  },
  {
    id: 'ludo-legends',
    name: 'Ludo: Legends of Civilization',
    subtitle: 'Board play with Historical Duels',
    description:
      'A heritage Ludo board. Capture attempts trigger a short Historical Duel: both players face the same question before a token can be taken.',
    category: 'strategy_board',
    categoryLabel: 'Board & Duel',
    difficulty: 'Easy',
    relatedCivilizationId: 'indus-valley',
    relatedTopicTitle: 'Craftsmanship, Seals & Script',
    status: 'playable_preview',
    playerMode: 'solo_and_friends',
    isLocked: false,
    progressPercent: 0,
    illustrationKey: 'ludo-legends',
    learningLoop:
      '6-Question Quiz → Movement (0–6) → Board Move → Historical Duel → Capture/Defend → Victory',
    gameplayPreview:
      'When an attacking token lands on an opponent, a 5-second Historical Duel decides capture or defence.',
    xpReward: 200,
  },
];
