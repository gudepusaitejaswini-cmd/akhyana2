import { LudoPlayerConfig } from './types';

let pendingSetup: LudoPlayerConfig[] | null = null;
let pendingQuizYear: number | null = null;

const DEFAULT_PLAYERS: LudoPlayerConfig[] = [
  { seat: 0, name: 'Player 1', civilizationId: 'indus-valley', civilizationName: 'Indus Valley', color: '#B85D3A', isAi: false },
  { seat: 1, name: 'Player 2', civilizationId: 'mauryan-empire', civilizationName: 'Mauryan Empire', color: '#2B5F8C', isAi: false },
];

/** Store the match setup together with the selected quiz year. */
export function setLudoSetup(players: LudoPlayerConfig[], quizYear: number) {
  pendingSetup = players;
  pendingQuizYear = quizYear;
}

export function getLudoSetup(): LudoPlayerConfig[] {
  return pendingSetup && pendingSetup.length >= 2 ? pendingSetup : DEFAULT_PLAYERS;
}

/** Exact quiz year for the active match. Year-based, never empire-based. */
export function getLudoYear(): number {
  return pendingQuizYear ?? 1947;
}
