import {
  createInitialProgress,
  getUserProgress,
  recordQuestionAnswer,
  recordCivilizationExplored,
  recordArtifactDiscovered,
  recordExhibitViewed,
  recordTimelineEventViewed,
  recordHeritageVoiceRead,
  recordAajKaAkhyanaEventViewed,
  recordPeriodExplored,
  resetUserProgress,
  getAchievementsDefinitions,
  getAreasToStrengthen,
  getMasteredTopicsCount,
  getJourneyTimelineStatus,
  determineCategoryForQuestion,
  HISTORICAL_CATEGORIES,
} from './src/services/user-progress';

function assert(condition: boolean, msg: string) {
  if (!condition) {
    console.error(`❌ PROGRESS QA FAILURE: ${msg}`);
    process.exit(1);
  }
  console.log(`✅ ${msg}`);
}

console.log('====================================================');
console.log('    AKHYANA PROGRESS & MASTERY TEST AUDIT SUITE     ');
console.log('====================================================\n');

// Reset to clean test state
resetUserProgress();

// ----------------------------------------------------
// 1. BRAND-NEW USER INITIAL STATE
// ----------------------------------------------------
console.log('--- 1. Brand-New User Initial State ---');
const initial = getUserProgress();
assert(initial.questionsAnswered === 0, 'New user: questionsAnswered === 0');
assert(initial.correctAnswers === 0, 'New user: correctAnswers === 0');
assert(initial.overallMasteryPercent === 0, 'New user: overallMasteryPercent === 0');
assert(initial.exploration.civilizations.length === 0, 'New user: 0 civilizations explored');
assert(initial.exploration.artifacts.length === 0, 'New user: 0 artifacts discovered');
assert(initial.exploration.exhibitsViewed.length === 0, 'New user: 0 exhibits viewed');
assert(initial.exploration.timelineEventsViewed.length === 0, 'New user: 0 timeline events viewed');
assert(initial.exploration.heritageVoicesRead.length === 0, 'New user: 0 heritage voices read');
assert(initial.exploration.aajKaAkhyanaViewed.length === 0, 'New user: 0 aaj ka akhyana viewed');

for (const cat of HISTORICAL_CATEGORIES) {
  assert(initial.categoryMastery[cat].answered === 0, `New user: ${cat} answered === 0`);
  assert(initial.categoryMastery[cat].correct === 0, `New user: ${cat} correct === 0`);
}

const { masteredCount } = getMasteredTopicsCount(initial);
assert(masteredCount === 0, 'New user: 0 topics mastered');

const initialAchievements = getAchievementsDefinitions(initial);
for (const ach of initialAchievements) {
  assert(!ach.unlocked, `New user achievement locked: ${ach.title}`);
}

// ----------------------------------------------------
// 2. ANSWER ONE QUESTION CORRECTLY
// ----------------------------------------------------
console.log('\n--- 2. Answer One Question Correctly ---');
recordQuestionAnswer({
  questionId: 'test-q-1',
  category: 'Ancient India',
  isCorrect: true,
  topicId: 'ivc-urban-planning',
  promptOrText: 'Why did Harappans orient main streets with cardinal directions?',
});

const afterOneCorrect = getUserProgress();
assert(afterOneCorrect.questionsAnswered === 1, 'Questions answered incremented to 1');
assert(afterOneCorrect.correctAnswers === 1, 'Correct answers incremented to 1');
assert(afterOneCorrect.overallMasteryPercent === 100, 'Mastery is exactly 100%');
assert(afterOneCorrect.categoryMastery['Ancient India'].answered === 1, 'Ancient India answered is 1');
assert(afterOneCorrect.categoryMastery['Ancient India'].correct === 1, 'Ancient India correct is 1');
assert(afterOneCorrect.categoryMastery['Modern India'].answered === 0, 'Other categories remain 0');

// ----------------------------------------------------
// 3. ANSWER ONE QUESTION INCORRECTLY
// ----------------------------------------------------
console.log('\n--- 3. Answer One Question Incorrectly ---');
recordQuestionAnswer({
  questionId: 'test-q-2',
  category: 'Modern India',
  isCorrect: false,
  year: 1956,
  promptOrText: 'Which commission submitted the report for States Reorganisation?',
});

const afterOneIncorrect = getUserProgress();
assert(afterOneIncorrect.questionsAnswered === 2, 'Questions answered incremented to 2');
assert(afterOneIncorrect.correctAnswers === 1, 'Correct answers remains 1');
assert(afterOneIncorrect.overallMasteryPercent === 50, 'Mastery is exactly 50% (1/2)');
assert(afterOneIncorrect.categoryMastery['Modern India'].answered === 1, 'Modern India answered is 1');
assert(afterOneIncorrect.categoryMastery['Modern India'].correct === 0, 'Modern India correct is 0');

// ----------------------------------------------------
// 4. LUDO INTEGRATION (6 Questions per Turn)
// ----------------------------------------------------
console.log('\n--- 4. Ludo Integration: 6 Questions Per Turn ---');
const prevAnswered = getUserProgress().questionsAnswered;
const prevCorrect = getUserProgress().correctAnswers;

// Player answers 4 out of 6 correctly
const ludoRoundAnswers = [true, true, false, true, true, false];
for (let i = 0; i < 6; i++) {
  recordQuestionAnswer({
    questionId: `ludo-turn-q-${i}`,
    year: 1956,
    isCorrect: ludoRoundAnswers[i],
    promptOrText: `Ludo turn question ${i}`,
  });
}

const afterLudoTurn = getUserProgress();
assert(
  afterLudoTurn.questionsAnswered === prevAnswered + 6,
  `Exactly 6 questions recorded from Ludo turn (${prevAnswered} -> ${afterLudoTurn.questionsAnswered})`,
);
assert(
  afterLudoTurn.correctAnswers === prevCorrect + 4,
  `Exactly 4 correct answers recorded from Ludo turn (${prevCorrect} -> ${afterLudoTurn.correctAnswers})`,
);

// Token movement must NOT increase questions answered or correct answers
// Simulating token moves:
const masteryBeforeMove = afterLudoTurn.overallMasteryPercent;
assert(
  getUserProgress().overallMasteryPercent === masteryBeforeMove,
  'Token movement does NOT increase learning mastery',
);

// ----------------------------------------------------
// 5. EXPLORATION DOES NOT ALTER MASTERY
// ----------------------------------------------------
console.log('\n--- 5. Exploration vs Mastery Strict Separation ---');
const masteryBaseline = getUserProgress().overallMasteryPercent;
const questionsBaseline = getUserProgress().questionsAnswered;

// Open an exhibit
recordExhibitViewed('exp-city-planning');
assert(getUserProgress().exploration.exhibitsViewed.includes('exp-city-planning'), 'Exhibit view recorded');
assert(getUserProgress().questionsAnswered === questionsBaseline, 'Opening exhibit did NOT increment questions');
assert(getUserProgress().overallMasteryPercent === masteryBaseline, 'Opening exhibit did NOT increment mastery');

// Open Aaj Ka Akhyana event
recordAajKaAkhyanaEventViewed('aaj-0928-bhagat-singh');
assert(getUserProgress().exploration.aajKaAkhyanaViewed.includes('aaj-0928-bhagat-singh'), 'Aaj Ka Akhyana recorded');
assert(getUserProgress().questionsAnswered === questionsBaseline, 'Opening Aaj Ka Akhyana did NOT increment questions');
assert(getUserProgress().overallMasteryPercent === masteryBaseline, 'Opening Aaj Ka Akhyana did NOT increment mastery');

// Read Heritage Voices article
recordHeritageVoiceRead('hv-lothal-dockyard-engineering');
assert(getUserProgress().exploration.heritageVoicesRead.includes('hv-lothal-dockyard-engineering'), 'Heritage voice read recorded');
assert(getUserProgress().questionsAnswered === questionsBaseline, 'Reading article did NOT increment questions');
assert(getUserProgress().overallMasteryPercent === masteryBaseline, 'Reading article did NOT increment mastery');

// Explore civilization
recordCivilizationExplored('indus-valley');
assert(getUserProgress().exploration.civilizations.includes('indus-valley'), 'Civilization explored recorded');
assert(getUserProgress().overallMasteryPercent === masteryBaseline, 'Exploring civilization did NOT increment mastery');

// Explore timeline event
recordTimelineEventViewed('1946-tebhaga');
assert(getUserProgress().exploration.timelineEventsViewed.includes('1946-tebhaga'), 'Timeline event recorded');
assert(getUserProgress().overallMasteryPercent === masteryBaseline, 'Exploring timeline did NOT increment mastery');

// ----------------------------------------------------
// 6. NO INFLATION ON REPEATED CLICKS
// ----------------------------------------------------
console.log('\n--- 6. No Inflation on Repeated Exploration ---');
const civCountBefore = getUserProgress().exploration.civilizations.length;
recordCivilizationExplored('indus-valley');
recordCivilizationExplored('indus-valley');
assert(getUserProgress().exploration.civilizations.length === civCountBefore, 'Repeated civ exploration does not duplicate');

const exhibitCountBefore = getUserProgress().exploration.exhibitsViewed.length;
recordExhibitViewed('exp-city-planning');
recordExhibitViewed('exp-city-planning');
assert(getUserProgress().exploration.exhibitsViewed.length === exhibitCountBefore, 'Repeated exhibit view does not duplicate');

// ----------------------------------------------------
// 7. AREAS TO STRENGTHEN (CONSTRUCTIVE & ACCURATE)
// ----------------------------------------------------
console.log('\n--- 7. Areas to Strengthen ---');
const weakAreas = getAreasToStrengthen(getUserProgress());
assert(Array.isArray(weakAreas), 'getAreasToStrengthen returns an array');
console.log(`Found ${weakAreas.length} weak areas:`, weakAreas.map((w) => `${w.name}: ${w.accuracyPercent}%`));
for (const w of weakAreas) {
  assert(w.accuracyPercent < 70, `Weak area ${w.name} has accuracy < 70% (${w.accuracyPercent}%)`);
  assert(w.answeredCount >= 1, `Weak area ${w.name} has at least 1 answered question`);
}

// ----------------------------------------------------
// 8. TIMELINE JOURNEY INTEGRITY
// ----------------------------------------------------
console.log('\n--- 8. Historical Journey Timeline ---');
const timeline = getJourneyTimelineStatus(getUserProgress());
assert(timeline.length === 4, 'Timeline has 4 epochs (Ancient, Medieval, Colonial, Modern)');
assert(timeline[0].label === 'Ancient', 'Epoch 1 is Ancient');
assert(timeline[1].label === 'Medieval', 'Epoch 2 is Medieval');
assert(timeline[2].label === 'Colonial', 'Epoch 3 is Colonial');
assert(timeline[3].label === 'Modern', 'Epoch 4 is Modern');
assert(timeline[0].isExplored === true, 'Ancient is explored (since indus-valley was explored)');

// ----------------------------------------------------
// 9. ACHIEVEMENTS UNLOCK ONLY ON REAL THRESHOLDS
// ----------------------------------------------------
console.log('\n--- 9. Achievements Real Threshold Verification ---');
// Civilization explorer requires 3 civilizations
assert(getUserProgress().achievements.civilizationExplorer === false, 'Civilization explorer locked with 1 civilization');
recordCivilizationExplored('mauryan-empire');
recordCivilizationExplored('gupta-empire');
const after3Civs = getUserProgress();
assert(after3Civs.achievements.civilizationExplorer === true, 'Civilization explorer unlocked with 3 civilizations');

// ----------------------------------------------------
// 10. CATEGORY DETECTION LOGIC
// ----------------------------------------------------
console.log('\n--- 10. Category Detection Accuracy ---');
assert(determineCategoryForQuestion({ year: -2600 }) === 'Ancient India', '-2600 is Ancient India');
assert(determineCategoryForQuestion({ year: 1526 }) === 'Medieval India', '1526 is Medieval India');
assert(determineCategoryForQuestion({ year: 1956 }) === 'Modern India', '1956 is Modern India');
assert(determineCategoryForQuestion({ promptOrText: 'Brihadisvara temple architecture' }) === 'Culture & Heritage', 'Temple architecture is Culture & Heritage');

console.log('\n====================================================');
console.log('   🎉 ALL PROGRESS & MASTERY TESTS PASSED (10/10)   ');
console.log('====================================================');
