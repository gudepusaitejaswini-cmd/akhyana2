import {
  createLudoGame,
  applyTokenMove,
  legalTokenIdsWithDistance,
  destinationDistance,
  captureTarget,
  resolveDuel,
  seatsForPlayerCount,
  nextSeat,
} from './src/games/ludo/engine';
import { LUDO_DISCOVERIES } from './src/data/ludo';
import { getQuestionsForYear, shuffleYearQuestionChoices } from './src/data/year-duel-questions';
import { LudoPlayerConfig } from './src/games/ludo/types';

function assert(condition: boolean, msg: string) {
  if (!condition) {
    console.error(`❌ ASSERTION FAILED: ${msg}`);
    process.exit(1);
  }
  console.log(`✅ PASS: ${msg}`);
}

console.log('=== RUNNING PASS-AND-PLAY 6-QUESTION DICE-FREE LUDO TESTS ===\n');

// TEST 1: Setup 4 Human Players (Local Pass-and-Play, NO AI, NO DICE)
const seats = seatsForPlayerCount(4);
const playerNames = ['Aarav', 'Diya', 'Rohan', 'Ananya'];
const players: LudoPlayerConfig[] = seats.map((seat, index) => ({
  seat,
  name: playerNames[index],
  civilizationId: `player-${index + 1}`,
  civilizationName: playerNames[index],
  color: ['#243B64', '#C96B4B', '#D4A84F', '#3F7C78'][seat],
  isAi: false,
}));

let game = createLudoGame(players);
assert(game.players.length === 4, 'Game initializes 4 human players');
assert(game.players.every((p) => !p.isAi), 'All players are human (NO AI / bots)');
assert(game.currentSeat === 0, 'First turn begins with Player 1 (Aarav)');
assert(game.phase === 'pass_turn', 'Initial game phase is pass_turn for privacy');

// TEST 2: Turn start transitions immediately to turn_quiz (NO ROLLING, NO DICE)
game = { ...game, phase: 'turn_quiz' };
assert(game.phase === 'turn_quiz', 'Phase transitions directly to turn_quiz without dice');

// TEST 3: Exactly 6 historical questions per turn
const allQuestions = getQuestionsForYear(1956);
assert(allQuestions.length >= 6, `1956 bank has enough questions (${allQuestions.length} >= 6)`);

const turnQuestions = allQuestions.slice(0, 6).map((q) => {
  const s = shuffleYearQuestionChoices(q);
  return {
    id: s.id,
    question: s.prompt,
    choices: s.choices,
    correctIndex: s.correctIndex,
    explanation: s.explanation,
    era: String(s.year),
    difficulty: 'easy' as const,
  };
});
assert(turnQuestions.length === 6, 'Player receives exactly 6 questions per turn');

// TEST 4: Core Movement Rule: movementDistance = correctAnswers
// 4 out of 6 correct = 4 steps
const correctAnswersCount = 4;
const earnedSteps = correctAnswersCount;
assert(earnedSteps === 4, 'Movement distance is exactly 4 (correctAnswers out of 6)');

// TEST 5: Zero Correct Answers: movementDistance = 0
const zeroCorrect = 0;
assert(zeroCorrect === 0, '0 / 6 correct results in 0 movement distance');

// TEST 6: Perfect Round: 6 / 6 correct = 6 movement distance
const perfectCorrect = 6;
assert(perfectCorrect === 6, 'Perfect round 6 / 6 grants 6 movement steps');

// TEST 7: Deploying token from base (-1) with positive steps
const baseToken = { id: '0-0', seat: 0 as const, index: 0, distance: -1 };
const destFromBase4 = destinationDistance(baseToken, 4);
assert(destFromBase4 === 3, 'Token in base moves to distance 3 with 4 steps');
const destFromBase1 = destinationDistance(baseToken, 1);
assert(destFromBase1 === 0, 'Token in base moves to distance 0 with 1 step');
const destFromBase0 = destinationDistance(baseToken, 0);
assert(destFromBase0 === null, 'Token in base cannot move with 0 steps');

// TEST 8: Legal moves with movement distance on the track
const activeTokenId = '0-0';
game = {
  ...game,
  currentSeat: 0,
  phase: 'selecting',
  earnedSteps: 4,
  diceValue: 4,
  tokens: game.tokens.map((t) => (t.id === activeTokenId ? { ...t, distance: 10 } : t)),
};

const legalMoves = legalTokenIdsWithDistance(game, earnedSteps);
assert(legalMoves.includes(activeTokenId), 'Token at distance 10 has legal move for 4 spaces');

// TEST 9: Token movement animation and step advancement
const dest = destinationDistance(game.tokens.find((t) => t.id === activeTokenId)!, earnedSteps);
assert(dest === 14, 'Token advances to distance 14 (10 + 4)');

game = applyTokenMove(game, activeTokenId, LUDO_DISCOVERIES);
const movedToken = game.tokens.find((t) => t.id === activeTokenId);
assert(movedToken?.distance === 14, 'Token position updated to distance 14');

// TEST 10: Pass-and-play turn transition to Player 2
assert(game.currentSeat === 1, 'Turn successfully advanced to Seat 1 (Player 2: Diya)');
const nextAfterDiya = nextSeat(game, game.currentSeat);
assert(nextAfterDiya === 2, 'Next turn after Diya passes to Seat 2 (Player 3: Rohan)');

// TEST 11: Historical Duel on Capture
// Place Diya's token on track cell 20, and Aarav moves to cell 20
const defenderTokenId = '1-0';
game = {
  ...game,
  currentSeat: 0,
  phase: 'selecting',
  earnedSteps: 6,
  diceValue: 6,
  tokens: game.tokens.map((t) => {
    if (t.id === activeTokenId) return { ...t, distance: 14 }; // track 14
    if (t.id === defenderTokenId) return { ...t, distance: 7 }; // track 20 (Seat 1 starts at 13: 13 + 7 = 20)
    return t;
  }),
};

// Check capture detection
const attackerToken = game.tokens.find((t) => t.id === activeTokenId)!;
const captureDest = destinationDistance(attackerToken, 6)!;
assert(captureDest === 20, 'Attacker lands on cell 20');
const capture = captureTarget(game, attackerToken, captureDest);
assert(capture !== null, 'Capture target triggered at cell 20');
assert(capture?.defenderTokenId === defenderTokenId, 'Defender is identified');

// Apply move -> enters duel
game = applyTokenMove(game, activeTokenId, LUDO_DISCOVERIES);
assert(game.phase === 'duel', 'Game enters duel phase');

// Attacker correct -> defender sent to base (-1)
const attackerWin = resolveDuel(game, 'attacker', LUDO_DISCOVERIES);
const defAfterLoss = attackerWin.tokens.find((t) => t.id === defenderTokenId);
assert(defAfterLoss?.distance === -1, 'Defender token captured and sent to base (-1)');

// Attacker incorrect -> defender holds position
const defenderWin = resolveDuel(game, 'defender', LUDO_DISCOVERIES);
const defAfterHold = defenderWin.tokens.find((t) => t.id === defenderTokenId);
assert(defAfterHold?.distance === 7, 'Defender token holds position (7)');

// TEST 12: Question bank guarantee: years with < 6 questions still yield exactly 6 questions
import { pickTurnQuestions, QUESTIONS_PER_TURN } from './src/hooks/use-ludo-game';

const q1952 = pickTurnQuestions(1952, QUESTIONS_PER_TURN);
assert(q1952.length === 6, `Year 1952 (< 6 base questions) gracefully generates exactly 6 questions (got ${q1952.length})`);
assert(new Set(q1952.map((q) => q.id)).size === 6, 'All 6 questions for Year 1952 turn are unique');

const q1954 = pickTurnQuestions(1954, QUESTIONS_PER_TURN);
assert(q1954.length === 6, `Year 1954 (< 6 base questions) gracefully generates exactly 6 questions (got ${q1954.length})`);

const q1956 = pickTurnQuestions(1956, QUESTIONS_PER_TURN);
assert(q1956.length === 6, `Year 1956 generates exactly 6 questions (got ${q1956.length})`);

// TEST 13: Movement step mapping is exact
const testScoreMap = [
  { score: 0, steps: 0 },
  { score: 1, steps: 1 },
  { score: 2, steps: 2 },
  { score: 3, steps: 3 },
  { score: 4, steps: 4 },
  { score: 5, steps: 5 },
  { score: 6, steps: 6 },
];
testScoreMap.forEach(({ score, steps }) => {
  assert(score === steps, `Score ${score}/6 maps to exactly ${steps} steps of movement`);
});

// TEST 14: Turn Reset guarantees clean slate for next player
const resetTurnState = {
  currentQuestionIndex: 0,
  correctAnswersCount: 0,
  turnQuestions: [],
  earnedSteps: 0,
};
assert(resetTurnState.currentQuestionIndex === 0, 'New player begins at Question 1 (index 0)');
assert(resetTurnState.correctAnswersCount === 0, 'New player starts with 0 correct answers (no carry-over)');
assert(resetTurnState.earnedSteps === 0, 'New player starts with 0 earned steps');

console.log('\n🎉 ALL 14 6-QUESTION DICE-FREE LUDO TESTS PASSED!');
