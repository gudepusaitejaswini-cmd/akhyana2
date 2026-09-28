import { trackIndexForDistance } from './board';
import {
  ENTER_ROLL,
  FINISH_DISTANCE,
  LudoDiscoveryRecord,
  LudoDuelQuestion,
  LudoGameState,
  LudoPlayerConfig,
  LudoSeat,
  LudoToken,
  MAX_CONSECUTIVE_SIXES,
  PendingCapture,
  SAFE_TRACK_INDICES,
  TOKENS_PER_PLAYER,
  DuelOutcome,
} from './types';

export const LUDO_XP = {
  discovery: 15,
  duelWin: 20,
  victory: 40,
} as const;

const SAFE = new Set<number>(SAFE_TRACK_INDICES);

export function seatsForPlayerCount(count: 2 | 3 | 4): LudoSeat[] {
  if (count === 2) return [0, 2];
  if (count === 3) return [0, 1, 2];
  return [0, 1, 2, 3];
}

export function createLudoGame(players: LudoPlayerConfig[]): LudoGameState {
  const tokens: LudoToken[] = players.flatMap((player) =>
    Array.from({ length: TOKENS_PER_PLAYER }, (_, index) => ({
      id: `${player.seat}-${index}`,
      seat: player.seat,
      index,
      distance: -1,
    })),
  );

  const xp: Record<string, number> = {};
  const collections: Record<string, string[]> = {};
  const duelsWon: Record<string, number> = {};
  for (const player of players) {
    const key = String(player.seat);
    xp[key] = 0;
    collections[key] = [];
    duelsWon[key] = 0;
  }

  return {
    players,
    tokens,
    currentSeat: players[0].seat,
    phase: 'pass_turn',
    earnedSteps: 0,
    diceValue: null,
    rawDiceRoll: null,
    turnQuestions: [],
    currentQuestionIndex: 0,
    correctAnswersCount: 0,
    hasRolled: false,
    consecutiveSixes: 0,
    usedQuestionIds: [],
    collections,
    discoveriesThisGame: 0,
    duelsWon,
    duelsFought: 0,
    xp,
    pendingCapture: null,
    pendingDiscovery: null,
    pendingQuestion: null,
    winnerSeat: null,
    turnNonce: 0,
    lastTurnSummary: null,
  };
}

export function tokenById(state: LudoGameState, tokenId: string): LudoToken | undefined {
  return state.tokens.find((token) => token.id === tokenId);
}

export function tokensForSeat(state: LudoGameState, seat: LudoSeat): LudoToken[] {
  return state.tokens.filter((token) => token.seat === seat);
}

export function isSafeTrack(trackIndex: number): boolean {
  return SAFE.has(trackIndex);
}

export function destinationDistance(token: LudoToken, steps: number): number | null {
  if (steps <= 0) return null;
  if (token.distance < 0) {
    // 1 step places token on the starting track cell (distance 0).
    // N steps places token at distance N - 1.
    const dest = steps - 1;
    if (dest > FINISH_DISTANCE) return null;
    return dest;
  }
  const next = token.distance + steps;
  if (next > FINISH_DISTANCE) return null;
  return next;
}

function occupancyOnTrack(state: LudoGameState, trackIndex: number, movingId: string) {
  return state.tokens.filter((token) => {
    if (token.id === movingId) return false;
    if (token.distance < 0 || token.distance > 50) return false;
    return trackIndexForDistance(token.seat, token.distance) === trackIndex;
  });
}

export function canLand(state: LudoGameState, token: LudoToken, nextDistance: number): boolean {
  if (nextDistance < 0 || nextDistance > 50) return true;
  const trackIndex = trackIndexForDistance(token.seat, nextDistance);
  if (trackIndex === null) return false;
  const others = occupancyOnTrack(state, trackIndex, token.id);
  const opponents = others.filter((item) => item.seat !== token.seat);
  if (opponents.length >= 2) return false;
  return true;
}

export function captureTarget(
  state: LudoGameState,
  token: LudoToken,
  nextDistance: number,
): PendingCapture | null {
  if (nextDistance < 0 || nextDistance > 50) return null;
  const trackIndex = trackIndexForDistance(token.seat, nextDistance);
  if (trackIndex === null || isSafeTrack(trackIndex)) return null;
  const others = occupancyOnTrack(state, trackIndex, token.id);
  const opponents = others.filter((item) => item.seat !== token.seat);
  if (opponents.length !== 1) return null;
  const defender = opponents[0];
  return {
    attackerTokenId: token.id,
    defenderTokenId: defender.id,
    trackIndex,
    attackerSeat: token.seat,
    defenderSeat: defender.seat,
  };
}

export function legalTokenIds(state: LudoGameState): string[] {
  const steps = state.earnedSteps || state.diceValue || 0;
  if (state.phase !== 'selecting' || steps <= 0) return [];
  return legalTokenIdsWithDistance(state, steps);
}

export function legalTokenIdsWithDistance(state: LudoGameState, distance: number): string[] {
  if (distance <= 0) return [];
  return tokensForSeat(state, state.currentSeat)
    .filter((token) => {
      const next = destinationDistance(token, distance);
      if (next === null) return false;
      return canLand(state, token, next);
    })
    .map((token) => token.id);
}

export function nextSeat(state: LudoGameState, from: LudoSeat): LudoSeat {
  const seats = state.players.map((player) => player.seat);
  const index = seats.indexOf(from);
  return seats[(index + 1) % seats.length];
}

function playerKey(seat: LudoSeat): string {
  return String(seat);
}

function grantXp(state: LudoGameState, seat: LudoSeat, amount: number): LudoGameState {
  const key = playerKey(seat);
  return {
    ...state,
    xp: { ...state.xp, [key]: (state.xp[key] ?? 0) + amount },
  };
}

export function hasWon(state: LudoGameState, seat: LudoSeat): boolean {
  return tokensForSeat(state, seat).every((token) => token.distance >= FINISH_DISTANCE);
}

function beginTurn(state: LudoGameState, seat: LudoSeat): LudoGameState {
  return {
    ...state,
    currentSeat: seat,
    phase: 'pass_turn',
    earnedSteps: 0,
    diceValue: null,
    rawDiceRoll: null,
    hasRolled: false,
    consecutiveSixes: 0,
    turnQuestions: [],
    currentQuestionIndex: 0,
    correctAnswersCount: 0,
    pendingCapture: null,
    pendingDiscovery: null,
    pendingQuestion: null,
    turnNonce: state.turnNonce + 1,
  };
}

export function rollDice(state: LudoGameState, value: number): LudoGameState {
  if (state.phase !== 'pass_turn' || state.hasRolled) return state;
  if (value < 0 || value > 6) return state;

  if (value === 0) {
    return beginTurn(state, nextSeat(state, state.currentSeat));
  }

  const selecting: LudoGameState = {
    ...state,
    earnedSteps: value,
    diceValue: value,
    hasRolled: true,
    phase: 'selecting',
  };

  if (legalTokenIds(selecting).length === 0) {
    return beginTurn(selecting, nextSeat(selecting, selecting.currentSeat));
  }

  return selecting;
}

export function applyTokenMove(
  state: LudoGameState,
  tokenId: string,
  discoveries: LudoDiscoveryRecord[],
): LudoGameState {
  const steps = state.earnedSteps || state.diceValue || 0;
  if (state.phase !== 'selecting' || steps <= 0) return state;
  if (!legalTokenIds(state).includes(tokenId)) return state;

  const token = tokenById(state, tokenId);
  if (!token) return state;
  const nextDistance = destinationDistance(token, steps);
  if (nextDistance === null) return state;

  const moved: LudoGameState = {
    ...state,
    tokens: state.tokens.map((item) =>
      item.id === tokenId ? { ...item, distance: nextDistance } : item,
    ),
  };

  const capture = captureTarget(moved, { ...token, distance: nextDistance }, nextDistance);
  if (capture) {
    return {
      ...moved,
      phase: 'duel',
      pendingCapture: capture,
      pendingDiscovery: discoveryForLanding(moved, { ...token, distance: nextDistance }, discoveries),
    };
  }

  return concludeMove(moved, { ...token, distance: nextDistance }, discoveries);
}

function discoveryForLanding(
  state: LudoGameState,
  token: LudoToken,
  discoveries: LudoDiscoveryRecord[],
): { discoveryId: string; seat: LudoSeat } | null {
  if (token.distance < 0 || token.distance > 50) return null;
  const trackIndex = trackIndexForDistance(token.seat, token.distance);
  if (trackIndex === null) return null;
  const discovery = discoveries.find((item) => item.id === `tile-${trackIndex}`);
  if (!discovery) return null;
  const owned = state.collections[playerKey(token.seat)] ?? [];
  if (owned.includes(discovery.id)) return null;
  return { discoveryId: discovery.id, seat: token.seat };
}

function concludeMove(
  state: LudoGameState,
  token: LudoToken,
  discoveries: LudoDiscoveryRecord[],
): LudoGameState {
  if (hasWon(state, token.seat)) {
    return grantXp(
      {
        ...state,
        phase: 'complete',
        winnerSeat: token.seat,
        diceValue: null,
        hasRolled: false,
        pendingCapture: null,
        pendingDiscovery: null,
        pendingQuestion: null,
      },
      token.seat,
      LUDO_XP.victory,
    );
  }

  const pendingDiscovery = discoveryForLanding(state, token, discoveries);
  if (pendingDiscovery) {
    return {
      ...state,
      phase: 'discovery',
      pendingDiscovery,
    };
  }

  return advanceAfterAction(state);
}

export function resolveDuel(
  state: LudoGameState,
  outcome: DuelOutcome,
  discoveries: LudoDiscoveryRecord[],
): LudoGameState {
  if (state.phase !== 'duel' || !state.pendingCapture) return state;
  const capture = state.pendingCapture;
  let next: LudoGameState = {
    ...state,
    duelsFought: state.duelsFought + 1,
    pendingCapture: null,
    pendingQuestion: null,
  };

  if (outcome === 'attacker') {
    next = {
      ...next,
      tokens: next.tokens.map((token) =>
        token.id === capture.defenderTokenId ? { ...token, distance: -1 } : token,
      ),
      duelsWon: {
        ...next.duelsWon,
        [playerKey(capture.attackerSeat)]: (next.duelsWon[playerKey(capture.attackerSeat)] ?? 0) + 1,
      },
    };
    next = grantXp(next, capture.attackerSeat, LUDO_XP.duelWin);
  } else if (outcome === 'defender') {
    next = {
      ...next,
      duelsWon: {
        ...next.duelsWon,
        [playerKey(capture.defenderSeat)]: (next.duelsWon[playerKey(capture.defenderSeat)] ?? 0) + 1,
      },
    };
    next = grantXp(next, capture.defenderSeat, LUDO_XP.duelWin);
  }

  const attacker = tokenById(next, capture.attackerTokenId);
  if (!attacker) return advanceAfterAction(next);
  return concludeMove(next, attacker, discoveries);
}

export function collectDiscovery(
  state: LudoGameState,
  catalog: LudoDiscoveryRecord[],
): LudoGameState {
  if (state.phase !== 'discovery' || !state.pendingDiscovery) return state;
  const { discoveryId, seat } = state.pendingDiscovery;
  const exists = catalog.some((item) => item.id === discoveryId);
  if (!exists) return advanceAfterAction({ ...state, pendingDiscovery: null });

  const key = playerKey(seat);
  const owned = state.collections[key] ?? [];
  if (owned.includes(discoveryId)) {
    return advanceAfterAction({ ...state, pendingDiscovery: null });
  }

  let next: LudoGameState = {
    ...state,
    collections: { ...state.collections, [key]: [...owned, discoveryId] },
    discoveriesThisGame: state.discoveriesThisGame + 1,
    pendingDiscovery: null,
  };
  next = grantXp(next, seat, LUDO_XP.discovery);
  return advanceAfterAction(next);
}

function advanceAfterAction(state: LudoGameState): LudoGameState {
  if (state.winnerSeat !== null) return state;
  return beginTurn(state, nextSeat(state, state.currentSeat));
}

export function attachQuestion(state: LudoGameState, question: LudoDuelQuestion): LudoGameState {
  if (state.phase !== 'duel') return state;
  return {
    ...state,
    pendingQuestion: question,
    usedQuestionIds: state.usedQuestionIds.includes(question.id)
      ? state.usedQuestionIds
      : [...state.usedQuestionIds, question.id],
  };
}

export function pickQuestion(
  questions: LudoDuelQuestion[],
  usedIds: string[],
): LudoDuelQuestion | undefined {
  const unused = questions.filter((question) => !usedIds.includes(question.id));
  const pool = unused.length > 0 ? unused : questions;
  return pool[Math.floor(Math.random() * pool.length)];
}

export function currentPlayer(state: LudoGameState): LudoPlayerConfig {
  return state.players.find((player) => player.seat === state.currentSeat) ?? state.players[0];
}

export const DUEL_MS = 10000;

export function evaluateDuelAnswers(input: {
  correctIndex: number;
  attackerChoice: number | null;
  defenderChoice: number | null;
  attackerAtMs: number | null;
  defenderAtMs: number | null;
  elapsedMs: number;
}): DuelOutcome | 'pending' {
  const attackerCorrect =
    input.attackerChoice === input.correctIndex &&
    input.attackerAtMs !== null &&
    input.attackerAtMs <= DUEL_MS;
  const defenderCorrect =
    input.defenderChoice === input.correctIndex &&
    input.defenderAtMs !== null &&
    input.defenderAtMs <= DUEL_MS;

  if (attackerCorrect && defenderCorrect) {
    const attackerTime = input.attackerAtMs ?? DUEL_MS;
    const defenderTime = input.defenderAtMs ?? DUEL_MS;
    if (attackerTime === defenderTime) return 'attacker';
    return attackerTime < defenderTime ? 'attacker' : 'defender';
  }
  if (attackerCorrect) return 'attacker';
  if (defenderCorrect) return 'defender';

  // If attacker answered and was incorrect, defender holds position immediately
  if (input.attackerChoice !== null && !attackerCorrect) {
    return 'defender';
  }
  if (input.defenderChoice !== null && !defenderCorrect) {
    return 'attacker';
  }

  const bothAnswered = input.attackerChoice !== null && input.defenderChoice !== null;
  if (bothAnswered || input.elapsedMs >= DUEL_MS) return 'none';
  return 'pending';
}
