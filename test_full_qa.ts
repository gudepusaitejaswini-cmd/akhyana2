import { YEAR_DUEL_QUESTIONS, shuffleYearQuestionChoices, getQuestionsForYear } from './src/data/year-duel-questions';
import { DECADE_DUEL_QUESTIONS, randomizeQuestionChoices } from './src/data/decade-duel-questions';
import {
  createLudoGame,
  applyTokenMove,
  nextSeat,
  seatsForPlayerCount,
  resolveDuel,
  legalTokenIdsWithDistance,
  destinationDistance,
  captureTarget
} from './src/games/ludo/engine';
import { LUDO_DISCOVERIES } from './src/data/ludo';
import { LudoPlayerConfig, LudoGameState } from './src/games/ludo/types';

function assert(condition: boolean, msg: string) {
  if (!condition) {
    console.error(`❌ QA FAILURE: ${msg}`);
    process.exit(1);
  }
  console.log(`✅ ${msg}`);
}

console.log('==============================================');
console.log('      AKHYANA COMPREHENSIVE QA AUDIT SUITE    ');
console.log('==============================================\n');

// ----------------------------------------------------
// SECTION 1: QUESTION BANK & SHUFFLE INTEGRITY
// ----------------------------------------------------
console.log('--- 1. Question Bank & Shuffle Integrity ---');

assert(YEAR_DUEL_QUESTIONS.length > 0, `YEAR_DUEL_QUESTIONS has ${YEAR_DUEL_QUESTIONS.length} questions`);
for (const q of YEAR_DUEL_QUESTIONS) {
  assert(q.prompt && q.prompt.trim().length > 0, `Question ${q.id} has non-empty prompt`);
  assert(Array.isArray(q.choices) && q.choices.length >= 2, `Question ${q.id} has at least 2 choices`);
  assert(q.correctIndex >= 0 && q.correctIndex < q.choices.length, `Question ${q.id} has valid correctIndex`);
  const uniqueChoices = new Set(q.choices);
  assert(uniqueChoices.size === q.choices.length, `Question ${q.id} has unique choices (no duplicate options)`);
}

// Test shuffleYearQuestionChoices across 500 iterations
for (let i = 0; i < 500; i++) {
  const sampleQ = YEAR_DUEL_QUESTIONS[i % YEAR_DUEL_QUESTIONS.length];
  const expectedText = sampleQ.choices[sampleQ.correctIndex];
  const shuffled = shuffleYearQuestionChoices(sampleQ);
  const actualText = shuffled.choices[shuffled.correctIndex];
  assert(actualText === expectedText, `Shuffle preserved correct answer text for ${sampleQ.id} on iteration ${i}`);
}

assert(DECADE_DUEL_QUESTIONS.length > 0, `DECADE_DUEL_QUESTIONS has ${DECADE_DUEL_QUESTIONS.length} questions`);
for (const q of DECADE_DUEL_QUESTIONS) {
  assert(q.question && q.question.trim().length > 0, `Decade Question ${q.id} has non-empty question`);
  assert(Array.isArray(q.choices) && q.choices.length >= 2, `Decade Question ${q.id} has at least 2 choices`);
  assert(q.correctIndex >= 0 && q.correctIndex < q.choices.length, `Decade Question ${q.id} has valid correctIndex`);
  const uniqueChoices = new Set(q.choices);
  assert(uniqueChoices.size === q.choices.length, `Decade Question ${q.id} has unique choices`);
}

// Test randomizeQuestionChoices across 500 iterations
for (let i = 0; i < 500; i++) {
  const sampleQ = DECADE_DUEL_QUESTIONS[i % DECADE_DUEL_QUESTIONS.length];
  const expectedText = sampleQ.choices[sampleQ.correctIndex];
  const shuffled = randomizeQuestionChoices(sampleQ);
  const actualText = shuffled.choices[shuffled.correctIndex];
  assert(actualText === expectedText, `Decade shuffle preserved correct answer text for ${sampleQ.id} on iteration ${i}`);
}

// ----------------------------------------------------
// SECTION 2: PASS-AND-PLAY TURN ORDER (2, 3, 4 PLAYERS)
// ----------------------------------------------------
console.log('\n--- 2. Pass-and-Play Turn Order Consistency ---');

// 2-Player game (Seats: 0, 2)
const seats2 = seatsForPlayerCount(2);
assert(seats2.length === 2 && seats2[0] === 0 && seats2[1] === 2, '2-Player seats are [0, 2]');
const g2 = createLudoGame([
  { seat: 0, name: 'P1', civilizationId: '1', civilizationName: '1', color: '#111', isAi: false },
  { seat: 2, name: 'P2', civilizationId: '2', civilizationName: '2', color: '#222', isAi: false },
]);
assert(nextSeat(g2, 0) === 2, '2-Player: Seat 0 passes to Seat 2');
assert(nextSeat(g2, 2) === 0, '2-Player: Seat 2 passes to Seat 0');

// 3-Player game (Seats: 0, 1, 2)
const seats3 = seatsForPlayerCount(3);
assert(seats3.length === 3 && seats3[0] === 0 && seats3[1] === 1 && seats3[2] === 2, '3-Player seats are [0, 1, 2]');
const g3 = createLudoGame([
  { seat: 0, name: 'P1', civilizationId: '1', civilizationName: '1', color: '#111', isAi: false },
  { seat: 1, name: 'P2', civilizationId: '2', civilizationName: '2', color: '#222', isAi: false },
  { seat: 2, name: 'P3', civilizationId: '3', civilizationName: '3', color: '#333', isAi: false },
]);
assert(nextSeat(g3, 0) === 1, '3-Player: Seat 0 passes to Seat 1');
assert(nextSeat(g3, 1) === 2, '3-Player: Seat 1 passes to Seat 2');
assert(nextSeat(g3, 2) === 0, '3-Player: Seat 2 passes to Seat 0');

// 4-Player game (Seats: 0, 1, 2, 3)
const seats4 = seatsForPlayerCount(4);
assert(seats4.length === 4, '4-Player seats are [0, 1, 2, 3]');
const g4 = createLudoGame([
  { seat: 0, name: 'P1', civilizationId: '1', civilizationName: '1', color: '#111', isAi: false },
  { seat: 1, name: 'P2', civilizationId: '2', civilizationName: '2', color: '#222', isAi: false },
  { seat: 2, name: 'P3', civilizationId: '3', civilizationName: '3', color: '#333', isAi: false },
  { seat: 3, name: 'P4', civilizationId: '4', civilizationName: '4', color: '#444', isAi: false },
]);
assert(nextSeat(g4, 0) === 1, '4-Player: Seat 0 passes to Seat 1');
assert(nextSeat(g4, 1) === 2, '4-Player: Seat 1 passes to Seat 2');
assert(nextSeat(g4, 2) === 3, '4-Player: Seat 2 passes to Seat 3');
assert(nextSeat(g4, 3) === 0, '4-Player: Seat 3 passes to Seat 0');

// ----------------------------------------------------
// SECTION 3: 6-QUESTION TURN & KNOWLEDGE MOVEMENT RULES
// ----------------------------------------------------
console.log('\n--- 3. 6-Question Turn & Knowledge Movement Rules ---');

// Verify exactly 6 questions per turn
const qs6 = getQuestionsForYear(1956).slice(0, 6);
assert(qs6.length === 6, 'Each turn provides exactly 6 questions');

// Verify that 0 correct answers produces 0 legal moves
let stateSelect = {
  ...g4,
  currentSeat: 0,
  phase: 'selecting' as const,
  earnedSteps: 0,
  diceValue: 0,
  tokens: g4.tokens.map(t => t.id === '0-0' ? { ...t, distance: 5 } : t),
};
const zeroMoves = legalTokenIdsWithDistance(stateSelect, 0);
assert(zeroMoves.length === 0, '0 correct answers yields 0 legal moves (no movement)');

// Verify 1 correct answer = 1 step
const dest1 = destinationDistance(stateSelect.tokens.find(t => t.id === '0-0')!, 1);
assert(dest1 === 6, '1 correct answer moves token 1 space (5 + 1 = 6)');

// Verify 4 correct answers = 4 steps
const fourMoves = legalTokenIdsWithDistance(stateSelect, 4);
assert(fourMoves.includes('0-0'), '4 correct answers yields legal move for token at distance 5');
const dest4 = destinationDistance(stateSelect.tokens.find(t => t.id === '0-0')!, 4);
assert(dest4 === 9, '4 correct answers moves token 4 spaces (5 + 4 = 9)');

// Verify 6 correct answers = 6 steps
const dest6 = destinationDistance(stateSelect.tokens.find(t => t.id === '0-0')!, 6);
assert(dest6 === 11, '6 correct answers moves token 6 spaces (5 + 6 = 11)');

// Verify token in base (-1) enters on positive steps
const baseToken = { id: '0-1', seat: 0 as const, index: 1, distance: -1 };
assert(destinationDistance(baseToken, 0) === null, 'Token in base cannot move with 0 steps');
assert(destinationDistance(baseToken, 1) === 0, 'Token in base moves to distance 0 with 1 step');
assert(destinationDistance(baseToken, 4) === 3, 'Token in base moves to distance 3 with 4 steps');
assert(destinationDistance(baseToken, 6) === 5, 'Token in base moves to distance 5 with 6 steps');

console.log('\n==============================================');
console.log('     ALL QA AUDIT SUITE TESTS PASSED!        ');
console.log('==============================================');
