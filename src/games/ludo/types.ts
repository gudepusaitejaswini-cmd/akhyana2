export type LudoSeat = 0 | 1 | 2 | 3;

export type LudoPhase =
  | 'pass_turn'
  | 'turn_quiz'
  | 'quiz_summary'
  | 'selecting'
  | 'duel'
  | 'discovery'
  | 'complete';

/**
 * Summary shown during the pass-and-play transition after a turn ends.
 */
export interface LastTurnSummary {
  playerSeat: LudoSeat;
  playerName: string;
  playerColor: string;
  correctCount: number;
  totalQuestions: number;
  spacesMoved: number;
  nextSeat: LudoSeat;
  nextPlayerName: string;
  nextPlayerColor: string;
  diceRoll?: number;
}

/**
 * Quiz-cycle phase for the year-based Ludo quiz.
 * initial: first pass over the selected year's questions
 * retry: only previously-incorrect questions are eligible
 * year_complete: all questions used and all incorrect ones cleared
 */
export type QuizPhase = 'initial' | 'retry' | 'year_complete';

export interface LudoPlayerConfig {
  seat: LudoSeat;
  name: string;
  civilizationId: string;
  civilizationName: string;
  color: string;
  isAi?: boolean;
}

export interface LudoToken {
  id: string;
  seat: LudoSeat;
  index: number;
  /** -1 base, 0–50 track, 51–55 home path, 56 finished */
  distance: number;
}

export interface LudoDiscoveryRecord {
  id: string;
  title: string;
  description: string;
  category: string;
  context: string;
  civilizationId: string;
}

export interface LudoDuelQuestion {
  id: string;
  question: string;
  choices: string[];
  correctIndex: number;
  explanation: string;
  era: string;
  difficulty: 'easy' | 'medium';
}

export interface PendingCapture {
  attackerTokenId: string;
  defenderTokenId: string;
  trackIndex: number;
  attackerSeat: LudoSeat;
  defenderSeat: LudoSeat;
}

export interface PendingDiscovery {
  discoveryId: string;
  seat: LudoSeat;
}

export type DuelOutcome = 'attacker' | 'defender' | 'none';

export interface LudoGameState {
  players: LudoPlayerConfig[];
  tokens: LudoToken[];
  currentSeat: LudoSeat;
  phase: LudoPhase;
  earnedSteps: number;
  diceValue: number | null;
  rawDiceRoll: number | null;
  turnQuestions: LudoDuelQuestion[];
  currentQuestionIndex: number;
  correctAnswersCount: number;
  hasRolled: boolean;
  consecutiveSixes: number;
  usedQuestionIds: string[];
  collections: Record<string, string[]>;
  discoveriesThisGame: number;
  duelsWon: Record<string, number>;
  duelsFought: number;
  xp: Record<string, number>;
  pendingCapture: PendingCapture | null;
  pendingDiscovery: PendingDiscovery | null;
  pendingQuestion: LudoDuelQuestion | null;
  winnerSeat: LudoSeat | null;
  turnNonce: number;
  lastTurnSummary: LastTurnSummary | null;
}

export const TRACK_LENGTH = 52;
export const HOME_ENTRY_DISTANCE = 51;
export const FINISH_DISTANCE = 56;
export const TOKENS_PER_PLAYER = 4;
export const ENTER_ROLL = 6;
export const MAX_CONSECUTIVE_SIXES = 3;

export const PLAYER_START_INDEX: Record<LudoSeat, number> = {
  0: 0,
  1: 13,
  2: 26,
  3: 39,
};

export const SAFE_TRACK_INDICES = [0, 8, 13, 21, 26, 34, 39, 47] as const;
