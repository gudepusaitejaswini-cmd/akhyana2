/**
 * Runtime diagnostics for Progress & Mastery system
 */

const {
  createInitialProgress,
  getUserProgress,
  saveUserProgress,
  resetUserProgress,
  recordQuestionAnswer,
  recordCivilizationExplored,
  recordArtifactDiscovered,
  recordExhibitViewed,
  recordTimelineEventViewed,
  recordHeritageVoiceRead,
  recordAajKaAkhyanaEventViewed,
  recordPeriodExplored,
  getAchievementsDefinitions,
  getAreasToStrengthen,
  getMasteredTopicsCount,
  getJourneyTimelineStatus,
  determineCategoryForQuestion,
  categorizeTopic,
  HISTORICAL_CATEGORIES,
} = require('../src/services/user-progress.ts');

const { TOPICS } = require('../src/data/topics.ts');
const { CIVILIZATIONS } = require('../src/data/civilizations.ts');
const { ARTIFACTS } = require('../src/data/artifacts.ts');
const { EXPERIENCES } = require('../src/data/experiences.ts');
const { YEAR_DUEL_QUESTIONS } = require('../src/data/year-duel-questions.ts');
const { DECADE_DUEL_QUESTIONS } = require('../src/data/decade-duel-questions.ts');
const { LUDO_QUESTIONS } = require('../src/data/ludo.ts');

function check(testName, fn) {
  try {
    fn();
    console.log(`✅ PASS: ${testName}`);
  } catch (err) {
    console.error(`❌ FAIL: ${testName}`, err);
    process.exit(1);
  }
}

console.log('========================================================');
console.log('      DEEP RUNTIME & DATA INTEGRITY DIAGNOSTICS         ');
console.log('========================================================\n');

// Mock localStorage for node environment
const storageData = {};
global.window = {
  localStorage: {
    getItem: (key) => storageData[key] || null,
    setItem: (key, val) => { storageData[key] = String(val); },
    removeItem: (key) => { delete storageData[key]; },
    clear: () => { Object.keys(storageData).forEach((k) => delete storageData[k]); },
  },
};

check('1. Brand new user starts with pure zero state', () => {
  resetUserProgress();
  const progress = getUserProgress();
  if (progress.questionsAnswered !== 0) throw new Error('questionsAnswered not 0');
  if (progress.correctAnswers !== 0) throw new Error('correctAnswers not 0');
  if (progress.overallMasteryPercent !== 0) throw new Error('overallMasteryPercent not 0');
  if (progress.exploration.civilizations.length !== 0) throw new Error('civs not 0');
  if (progress.exploration.artifacts.length !== 0) throw new Error('artifacts not 0');
  if (progress.exploration.exhibitsViewed.length !== 0) throw new Error('exhibits not 0');
  if (progress.exploration.timelineEventsViewed.length !== 0) throw new Error('timeline not 0');
  if (progress.exploration.heritageVoicesRead.length !== 0) throw new Error('voices not 0');
  if (progress.exploration.aajKaAkhyanaViewed.length !== 0) throw new Error('aaj not 0');
});

check('2. Division by zero safety across all calculations', () => {
  const p = getUserProgress();
  for (const cat of HISTORICAL_CATEGORIES) {
    const rec = p.categoryMastery[cat];
    const acc = rec.answered > 0 ? rec.correct / rec.answered : 0;
    if (isNaN(acc) || !isFinite(acc)) throw new Error(`NaN in category ${cat}`);
  }
  const timeline = getJourneyTimelineStatus(p);
  for (const epoch of timeline) {
    if (epoch.masteryPercent !== null && isNaN(epoch.masteryPercent)) {
      throw new Error(`NaN in epoch ${epoch.label}`);
    }
  }
});

check('3. All 15 topics in Akhyana exist in topicMastery index', () => {
  const p = getUserProgress();
  if (TOPICS.length !== 15) throw new Error(`Expected 15 topics, got ${TOPICS.length}`);
  for (const topic of TOPICS) {
    if (!p.topicMastery[topic.id]) throw new Error(`Missing topic ${topic.id} in topicMastery`);
  }
});

check('4. Category detection handles edge cases safely without crashing', () => {
  if (determineCategoryForQuestion({}) !== 'Modern India') throw new Error('Fallback failed');
  if (determineCategoryForQuestion({ year: -3000 }) !== 'Ancient India') throw new Error('Ancient year failed');
  if (determineCategoryForQuestion({ year: 1400 }) !== 'Medieval India') throw new Error('Medieval year failed');
  if (determineCategoryForQuestion({ year: 1980 }) !== 'Modern India') throw new Error('Modern year failed');
  if (determineCategoryForQuestion({ promptOrText: 'Brihadisvara temple carving' }) !== 'Culture & Heritage') {
    throw new Error('Culture keyword detection failed');
  }
});

check('5. Practice question pool consolidates valid approved questions', () => {
  const pool = [...YEAR_DUEL_QUESTIONS, ...DECADE_DUEL_QUESTIONS, ...LUDO_QUESTIONS];
  if (pool.length === 0) throw new Error('Question pool is empty');
  for (const q of pool) {
    const text = q.prompt || q.question;
    if (!text || text.length < 5) throw new Error(`Invalid prompt in question ${q.id}`);
    if (!Array.isArray(q.choices) || q.choices.length < 2) throw new Error(`Invalid choices in question ${q.id}`);
    if (typeof q.correctIndex !== 'number' || q.correctIndex < 0 || q.correctIndex >= q.choices.length) {
      throw new Error(`Invalid correctIndex in question ${q.id}`);
    }
  }
});

check('6. Persistence survives serialization and reload without data loss', () => {
  resetUserProgress();
  recordQuestionAnswer({ questionId: 'persist-test', isCorrect: true, category: 'Ancient India' });
  recordCivilizationExplored('indus-valley');
  recordArtifactDiscovered('art-dancing-girl');
  recordExhibitViewed('exp-city-planning');
  recordTimelineEventViewed('1946-tebhaga');
  recordHeritageVoiceRead('hv-lothal-dockyard-engineering');
  recordAajKaAkhyanaEventViewed('aaj-0928-bhagat-singh');

  // Verify memory has it
  const before = getUserProgress();
  if (before.questionsAnswered !== 1) throw new Error('Before reload questions != 1');
  if (before.correctAnswers !== 1) throw new Error('Before reload correct != 1');
  if (before.exploration.civilizations.length !== 1) throw new Error('Civs != 1');

  // Inspect raw localStorage item
  const raw = storageData['@akhyana/user_progress_v2'];
  if (!raw) throw new Error('localStorage is empty');
  const parsed = JSON.parse(raw);
  if (parsed.questionsAnswered !== 1) throw new Error('Parsed questions != 1');
  if (parsed.exploration.artifacts[0] !== 'art-dancing-girl') throw new Error('Artifact not saved');
});

check('7. Areas to strengthen only surfaces topics with genuine answered data and accuracy < 70%', () => {
  resetUserProgress();
  // Brand new user: 0 areas to strengthen
  let weak = getAreasToStrengthen(getUserProgress());
  if (weak.length !== 0) throw new Error('New user should have 0 weak areas');

  // Answer 1 question correctly in Ancient India -> 100% accuracy -> no weak area
  recordQuestionAnswer({ questionId: 'q-anc-1', category: 'Ancient India', isCorrect: true });
  weak = getAreasToStrengthen(getUserProgress());
  if (weak.length !== 0) throw new Error('100% category should not be weak');

  // Answer 1 question incorrectly in Medieval India -> 0% accuracy -> should be weak
  recordQuestionAnswer({ questionId: 'q-med-1', category: 'Medieval India', isCorrect: false });
  weak = getAreasToStrengthen(getUserProgress());
  if (weak.length !== 1 || weak[0].name !== 'Medieval India') {
    throw new Error('Expected Medieval India to be in weak areas');
  }
  if (weak[0].accuracyPercent !== 0) throw new Error('Expected accuracy to be 0%');

  // Answer 3 correct in Medieval India -> 3 / 4 = 75% accuracy -> no longer weak!
  recordQuestionAnswer({ questionId: 'q-med-2', category: 'Medieval India', isCorrect: true });
  recordQuestionAnswer({ questionId: 'q-med-3', category: 'Medieval India', isCorrect: true });
  recordQuestionAnswer({ questionId: 'q-med-4', category: 'Medieval India', isCorrect: true });
  weak = getAreasToStrengthen(getUserProgress());
  if (weak.length !== 0) throw new Error('75% category should no longer be weak');
});

console.log('\n========================================================');
console.log('   🎉 ALL RUNTIME & DATA INTEGRITY TESTS PASSED!       ');
console.log('========================================================');
