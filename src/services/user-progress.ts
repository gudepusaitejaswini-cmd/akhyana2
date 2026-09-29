/**
 * Akhyana User Progress & Mastery Tracking Engine
 *
 * Strict separation:
 * 1. EXPLORATION: "What have I discovered?" (Unique items discovered/read/viewed)
 * 2. MASTERY: "What have I demonstrated that I understand?" (Calculated strictly from question answers)
 *
 * Persistence:
 * Uses durable storage (window.localStorage when available, safe in-memory fallback).
 * Never fabricates numbers. All metrics start at 0 for new users.
 */

import { useEffect, useState } from 'react';
import { CIVILIZATIONS } from '../data/civilizations';
import { ARTIFACTS } from '../data/artifacts';
import { EXPERIENCES } from '../data/experiences';
import { TOPICS } from '../data/topics';

export type HistoricalCategory =
  | 'Ancient India'
  | 'Medieval India'
  | 'Modern India'
  | 'Culture & Heritage';

export const HISTORICAL_CATEGORIES: HistoricalCategory[] = [
  'Ancient India',
  'Medieval India',
  'Modern India',
  'Culture & Heritage',
];

export interface CategoryMasteryRecord {
  answered: number;
  correct: number;
}

export interface TopicMasteryRecord {
  topicId: string;
  topicTitle: string;
  category: HistoricalCategory;
  answered: number;
  correct: number;
  mastered: boolean;
}

export interface ExplorationRecord {
  civilizations: string[]; // unique civilization IDs (legacy)
  artifacts: string[]; // unique artifact IDs (legacy)
  exhibitsViewed: string[]; // unique experience IDs (legacy)
  timelineEventsViewed: string[]; // unique timeline event IDs
  heritageVoicesRead: string[]; // unique article IDs
  aajKaAkhyanaViewed: string[]; // unique event IDs
  periodsExplored: string[]; // unique period/decade IDs (e.g. '1950s', 'indus-valley-period')
  learnSubtopicsViewed?: string[]; // unique learn subtopic IDs
}

export interface AchievementRecord {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  progressText: string;
  progressPercent: number;
}

export interface UserProgressData {
  // Mastery stats
  questionsAnswered: number;
  correctAnswers: number;
  overallMasteryPercent: number; // 0 if questionsAnswered === 0, else Math.round((correct / answered) * 100)

  // Category breakdown
  categoryMastery: Record<HistoricalCategory, CategoryMasteryRecord>;

  // Topic breakdown
  topicMastery: Record<string, TopicMasteryRecord>;

  // Exploration stats
  exploration: ExplorationRecord;

  // Active days (YYYY-MM-DD strings for streak/consistency tracking)
  activeDays: string[];

  // Answer history (last 100 question IDs to prevent duplicate inflations if needed)
  recentQuestionIds: string[];

  // Unlocked achievements
  achievements: Record<string, boolean>;

  // Metadata
  lastActiveAt: string;
  createdAt: string;
}

const STORAGE_KEY = '@akhyana/user_progress_v2';

export function createInitialProgress(): UserProgressData {
  const initialCategoryMastery: Record<HistoricalCategory, CategoryMasteryRecord> = {
    'Ancient India': { answered: 0, correct: 0 },
    'Medieval India': { answered: 0, correct: 0 },
    'Modern India': { answered: 0, correct: 0 },
    'Culture & Heritage': { answered: 0, correct: 0 },
  };

  const initialTopicMastery: Record<string, TopicMasteryRecord> = {};
  for (const topic of TOPICS) {
    const category = categorizeTopic(topic);
    initialTopicMastery[topic.id] = {
      topicId: topic.id,
      topicTitle: topic.title,
      category,
      answered: 0,
      correct: 0,
      mastered: false,
    };
  }

  const todayStr = getTodayDateKey();

  return {
    questionsAnswered: 0,
    correctAnswers: 0,
    overallMasteryPercent: 0,
    categoryMastery: initialCategoryMastery,
    topicMastery: initialTopicMastery,
    exploration: {
      civilizations: [],
      artifacts: [],
      exhibitsViewed: [],
      timelineEventsViewed: [],
      heritageVoicesRead: [],
      aajKaAkhyanaViewed: [],
      periodsExplored: [],
      learnSubtopicsViewed: [],
    },
    activeDays: [todayStr],
    recentQuestionIds: [],
    achievements: {
      civilizationExplorer: false,
      historianInMaking: false,
      battleScholar: false,
      timeTraveller: false,
      curiousMind: false,
      consistentLearner: false,
    },
    lastActiveAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  };
}

// In-memory cache & listeners for synchronous speed and multi-component reactivity
let memoryProgress: UserProgressData = createInitialProgress();
let isInitialized = false;
const listeners = new Set<(data: UserProgressData) => void>();

function getStorage(): Storage | null {
  if (typeof window !== 'undefined' && window.localStorage) {
    return window.localStorage;
  }
  return null;
}

function getTodayDateKey(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getUserProgress(): UserProgressData {
  if (isInitialized) {
    return memoryProgress;
  }
  try {
    const storage = getStorage();
    if (storage) {
      const stored = storage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === 'object') {
          // Merge with initial structure to ensure any newly added fields exist
          const initial = createInitialProgress();
          memoryProgress = {
            ...initial,
            ...parsed,
            categoryMastery: {
              ...initial.categoryMastery,
              ...(parsed.categoryMastery || {}),
            },
            topicMastery: {
              ...initial.topicMastery,
              ...(parsed.topicMastery || {}),
            },
            exploration: {
              ...initial.exploration,
              ...(parsed.exploration || {}),
            },
            achievements: {
              ...initial.achievements,
              ...(parsed.achievements || {}),
            },
          };
          // Recalculate computed achievements & mastery for safety
          evaluateAchievements(memoryProgress);
        }
      }
    }
  } catch (e) {
    console.warn('Failed to load user progress from storage', e);
  }
  isInitialized = true;
  return memoryProgress;
}

export function saveUserProgress(data: UserProgressData): void {
  memoryProgress = data;
  isInitialized = true;
  try {
    const storage = getStorage();
    if (storage) {
      storage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
  } catch (e) {
    console.warn('Failed to save user progress', e);
  }
  // Notify all reactive subscribers
  listeners.forEach((listener) => {
    try {
      listener(data);
    } catch (e) {
      console.error('Subscriber error in user progress', e);
    }
  });
}

export function subscribeToUserProgress(listener: (data: UserProgressData) => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/**
 * React hook to bind any component to live user progress.
 */
export function useUserProgress(): {
  progress: UserProgressData;
  refresh: () => void;
  resetProgress: () => void;
} {
  const [progress, setProgress] = useState<UserProgressData>(() => getUserProgress());

  useEffect(() => {
    setProgress(getUserProgress());
    const unsubscribe = subscribeToUserProgress((updated) => {
      setProgress({ ...updated });
    });
    return unsubscribe;
  }, []);

  const refresh = () => {
    setProgress({ ...getUserProgress() });
  };

  const resetProgress = () => {
    resetUserProgress();
  };

  return { progress, refresh, resetProgress };
}

export function resetUserProgress(): UserProgressData {
  const initial = createInitialProgress();
  saveUserProgress(initial);
  return initial;
}

/**
 * Categorize a historical topic or question into one of the 4 major areas.
 */
export function categorizeTopic(topic: { id: string; civilizationId?: string; decadeId?: string; year?: number; category?: string }): HistoricalCategory {
  if (topic.civilizationId === 'indus-valley' || topic.civilizationId === 'mauryan-empire' || topic.civilizationId === 'gupta-empire') {
    return 'Ancient India';
  }
  if (topic.civilizationId === 'chola-dynasty' || topic.civilizationId === 'vijayanagara-empire' || topic.civilizationId === 'mughal-period') {
    return 'Medieval India';
  }
  if (topic.category && /craft|seal|architecture|art|heritage|temple|culture|philosophy/i.test(topic.category)) {
    return 'Culture & Heritage';
  }
  if (topic.year !== undefined) {
    if (topic.year <= 1200) return 'Ancient India';
    if (topic.year > 1200 && topic.year < 1750) return 'Medieval India';
    return 'Modern India';
  }
  if (topic.decadeId && /1890|1940|1950|1960|1970|1980|2010/i.test(topic.decadeId)) {
    return 'Modern India';
  }
  return 'Ancient India';
}

export function determineCategoryForQuestion(params: {
  year?: number;
  era?: string;
  theme?: string;
  promptOrText?: string;
}): HistoricalCategory {
  const { year, era, theme, promptOrText } = params;
  const combined = `${theme || ''} ${era || ''} ${promptOrText || ''}`.toLowerCase();

  // Cultural keywords take precedence if specifically addressing art, architecture, rituals, or literature
  if (
    /architecture|temple|monument|sculpture|painting|nataraja|dancing girl|pashupati|script|seals|literature|buddhism|vedanta|philosophy|music/i.test(
      combined,
    )
  ) {
    return 'Culture & Heritage';
  }

  if (typeof year === 'number') {
    if (year <= 1200) return 'Ancient India';
    if (year > 1200 && year < 1750) return 'Medieval India';
    return 'Modern India';
  }

  if (era) {
    const eraLower = era.toLowerCase();
    if (eraLower.includes('indus') || eraLower.includes('harapp') || eraLower.includes('maury') || eraLower.includes('gupta') || eraLower.includes('ancient')) {
      return 'Ancient India';
    }
    if (eraLower.includes('chola') || eraLower.includes('vijayanag') || eraLower.includes('mughal') || eraLower.includes('medieval') || eraLower.includes('sultanate')) {
      return 'Medieval India';
    }
    if (eraLower.includes('modern') || eraLower.includes('freedom') || eraLower.includes('republic') || eraLower.includes('19') || eraLower.includes('20')) {
      return 'Modern India';
    }
  }

  return 'Modern India';
}

// ----------------------------------------------------
// EVENT TRACKING ACTIONS
// ----------------------------------------------------

/**
 * Record a question answered by the user.
 * Directly influences:
 * - Questions Answered
 * - Correct Answers
 * - Accuracy
 * - Category Mastery
 * - Topic Mastery (if topicId provided)
 * - Achievements
 */
export function recordQuestionAnswer(params: {
  questionId: string;
  isCorrect: boolean;
  category?: HistoricalCategory;
  topicId?: string;
  year?: number;
  era?: string;
  theme?: string;
  promptOrText?: string;
}): void {
  const current = getUserProgress();
  const category =
    params.category ||
    determineCategoryForQuestion({
      year: params.year,
      era: params.era,
      theme: params.theme,
      promptOrText: params.promptOrText,
    });

  const nextQuestionsAnswered = current.questionsAnswered + 1;
  const nextCorrectAnswers = params.isCorrect ? current.correctAnswers + 1 : current.correctAnswers;
  const nextOverallMastery = Math.round((nextCorrectAnswers / nextQuestionsAnswered) * 100);

  // Update Category Mastery
  const curCat = current.categoryMastery[category] || { answered: 0, correct: 0 };
  const updatedCategoryMastery: Record<HistoricalCategory, CategoryMasteryRecord> = {
    ...current.categoryMastery,
    [category]: {
      answered: curCat.answered + 1,
      correct: params.isCorrect ? curCat.correct + 1 : curCat.correct,
    },
  };

  // Update Topic Mastery if topicId provided
  const updatedTopicMastery = { ...current.topicMastery };
  if (params.topicId) {
    const existing = updatedTopicMastery[params.topicId] || {
      topicId: params.topicId,
      topicTitle: params.topicId,
      category,
      answered: 0,
      correct: 0,
      mastered: false,
    };
    const ans = existing.answered + 1;
    const cor = params.isCorrect ? existing.correct + 1 : existing.correct;
    const isMastered = ans >= 1 && (cor / ans) >= 0.75;
    updatedTopicMastery[params.topicId] = {
      ...existing,
      answered: ans,
      correct: cor,
      mastered: isMastered,
    };
  }

  // Record active day
  const todayStr = getTodayDateKey();
  const activeDays = current.activeDays.includes(todayStr)
    ? current.activeDays
    : [...current.activeDays, todayStr];

  const updated: UserProgressData = {
    ...current,
    questionsAnswered: nextQuestionsAnswered,
    correctAnswers: nextCorrectAnswers,
    overallMasteryPercent: nextOverallMastery,
    categoryMastery: updatedCategoryMastery,
    topicMastery: updatedTopicMastery,
    activeDays,
    lastActiveAt: new Date().toISOString(),
  };

  evaluateAchievements(updated);
  saveUserProgress(updated);
}

/**
 * Record viewing / exploring a Civilization.
 * EXPLORATION ONLY — DOES NOT increase mastery!
 */
export function recordCivilizationExplored(civilizationId: string): void {
  if (!civilizationId) return;
  const current = getUserProgress();
  if (current.exploration.civilizations.includes(civilizationId)) return;

  const updated: UserProgressData = {
    ...current,
    exploration: {
      ...current.exploration,
      civilizations: [...current.exploration.civilizations, civilizationId],
    },
    lastActiveAt: new Date().toISOString(),
  };

  evaluateAchievements(updated);
  saveUserProgress(updated);
}

/**
 * Record discovering / inspecting an Artifact.
 * EXPLORATION ONLY — DOES NOT increase mastery!
 */
export function recordArtifactDiscovered(artifactId: string): void {
  if (!artifactId) return;
  const current = getUserProgress();
  if (current.exploration.artifacts.includes(artifactId)) return;

  const updated: UserProgressData = {
    ...current,
    exploration: {
      ...current.exploration,
      artifacts: [...current.exploration.artifacts, artifactId],
    },
    lastActiveAt: new Date().toISOString(),
  };

  evaluateAchievements(updated);
  saveUserProgress(updated);
}

/**
 * Record viewing an Exhibit / Experience.
 * EXPLORATION ONLY — DOES NOT increase mastery!
 */
export function recordExhibitViewed(exhibitId: string): void {
  if (!exhibitId) return;
  const current = getUserProgress();
  if (current.exploration.exhibitsViewed.includes(exhibitId)) return;

  const updated: UserProgressData = {
    ...current,
    exploration: {
      ...current.exploration,
      exhibitsViewed: [...current.exploration.exhibitsViewed, exhibitId],
    },
    lastActiveAt: new Date().toISOString(),
  };

  evaluateAchievements(updated);
  saveUserProgress(updated);
}

/**
 * Record viewing a Timeline / Decade Event.
 * EXPLORATION ONLY — DOES NOT increase mastery!
 */
export function recordTimelineEventViewed(eventId: string): void {
  if (!eventId) return;
  const current = getUserProgress();
  if (current.exploration.timelineEventsViewed.includes(eventId)) return;

  const updated: UserProgressData = {
    ...current,
    exploration: {
      ...current.exploration,
      timelineEventsViewed: [...current.exploration.timelineEventsViewed, eventId],
    },
    lastActiveAt: new Date().toISOString(),
  };

  evaluateAchievements(updated);
  saveUserProgress(updated);
}

/**
 * Record reading a Heritage Voices research article.
 * EXPLORATION ONLY — DOES NOT increase mastery!
 */
export function recordHeritageVoiceRead(articleId: string): void {
  if (!articleId) return;
  const current = getUserProgress();
  if (current.exploration.heritageVoicesRead.includes(articleId)) return;

  const updated: UserProgressData = {
    ...current,
    exploration: {
      ...current.exploration,
      heritageVoicesRead: [...current.exploration.heritageVoicesRead, articleId],
    },
    lastActiveAt: new Date().toISOString(),
  };

  evaluateAchievements(updated);
  saveUserProgress(updated);
}

/**
 * Record viewing an Aaj Ka Akhyana daily milestone.
 * EXPLORATION ONLY — DOES NOT increase mastery!
 */
export function recordAajKaAkhyanaEventViewed(eventId: string): void {
  if (!eventId) return;
  const current = getUserProgress();
  if (current.exploration.aajKaAkhyanaViewed.includes(eventId)) return;

  const updated: UserProgressData = {
    ...current,
    exploration: {
      ...current.exploration,
      aajKaAkhyanaViewed: [...current.exploration.aajKaAkhyanaViewed, eventId],
    },
    lastActiveAt: new Date().toISOString(),
  };

  evaluateAchievements(updated);
  saveUserProgress(updated);
}

/**
 * Record visiting a historical period / time window.
 */
export function recordPeriodExplored(periodId: string): void {
  if (!periodId) return;
  const current = getUserProgress();
  if (current.exploration.periodsExplored.includes(periodId)) return;

  const updated: UserProgressData = {
    ...current,
    exploration: {
      ...current.exploration,
      periodsExplored: [...current.exploration.periodsExplored, periodId],
    },
    lastActiveAt: new Date().toISOString(),
  };

  evaluateAchievements(updated);
  saveUserProgress(updated);
}

/**
 * Record viewing an event subtopic in Learn.
 * EXPLORATION ONLY — DOES NOT increase mastery!
 */
export function recordLearnSubtopicViewed(subtopicId: string): void {
  if (!subtopicId) return;
  const current = getUserProgress();
  const existing = current.exploration.learnSubtopicsViewed || [];
  if (existing.includes(subtopicId)) return;

  const updated: UserProgressData = {
    ...current,
    exploration: {
      ...current.exploration,
      learnSubtopicsViewed: [...existing, subtopicId],
    },
    lastActiveAt: new Date().toISOString(),
  };

  evaluateAchievements(updated);
  saveUserProgress(updated);
}

// ----------------------------------------------------
// ACHIEVEMENTS & AREAS TO STRENGTHEN EVALUATION
// ----------------------------------------------------

function evaluateAchievements(data: UserProgressData): void {
  const { exploration, questionsAnswered, correctAnswers, categoryMastery, activeDays } = data;

  // 1. Civilization Explorer: Explore 3 civilizations
  const civCount = exploration.civilizations.length;
  data.achievements.civilizationExplorer = civCount >= 3;

  // 2. Historian in the Making: Reach 75% mastery in a historical area (min 5 questions answered)
  let has75Area = false;
  for (const cat of HISTORICAL_CATEGORIES) {
    const record = categoryMastery[cat];
    if (record && record.answered >= 5) {
      const accuracy = record.correct / record.answered;
      if (accuracy >= 0.75) {
        has75Area = true;
        break;
      }
    }
  }
  data.achievements.historianInMaking = has75Area;

  // 3. Battle Scholar: Answer 20 questions with at least 80% accuracy
  const overallAcc = questionsAnswered > 0 ? correctAnswers / questionsAnswered : 0;
  data.achievements.battleScholar = questionsAnswered >= 20 && overallAcc >= 0.8;

  // 4. Time Traveller: Explore content from 5 different historical periods/eras
  data.achievements.timeTraveller = exploration.periodsExplored.length >= 5;

  // 5. Curious Mind: Explore 25 historical exhibits/events/milestones
  const totalExploredItems =
    exploration.exhibitsViewed.length +
    exploration.timelineEventsViewed.length +
    exploration.heritageVoicesRead.length +
    exploration.aajKaAkhyanaViewed.length;
  data.achievements.curiousMind = totalExploredItems >= 25;

  // 6. Consistent Learner: Learn on 7 different days
  data.achievements.consistentLearner = activeDays.length >= 7;
}

export function getAchievementsDefinitions(data: UserProgressData): AchievementRecord[] {
  const civCount = data.exploration.civilizations.length;
  const totalExploredItems =
    data.exploration.exhibitsViewed.length +
    data.exploration.timelineEventsViewed.length +
    data.exploration.heritageVoicesRead.length +
    data.exploration.aajKaAkhyanaViewed.length;

  // Best category mastery for historian in making
  let bestCategoryRatio = 0;
  let bestCategoryAnswers = 0;
  for (const cat of HISTORICAL_CATEGORIES) {
    const rec = data.categoryMastery[cat];
    if (rec && rec.answered > 0) {
      const ratio = rec.correct / rec.answered;
      if (ratio > bestCategoryRatio) {
        bestCategoryRatio = ratio;
        bestCategoryAnswers = rec.answered;
      }
    }
  }

  const accuracy = data.questionsAnswered > 0 ? Math.round((data.correctAnswers / data.questionsAnswered) * 100) : 0;

  return [
    {
      id: 'civilizationExplorer',
      title: 'Civilization Explorer',
      description: 'Explore 3 civilizations in Akhyana.',
      icon: '🏺',
      unlocked: data.achievements.civilizationExplorer || false,
      progressText: `${Math.min(civCount, 3)} / 3 Civilizations`,
      progressPercent: Math.min(100, Math.round((civCount / 3) * 100)),
    },
    {
      id: 'historianInMaking',
      title: 'Historian in the Making',
      description: 'Reach 75% mastery in any historical area with at least 5 questions answered.',
      icon: '📜',
      unlocked: data.achievements.historianInMaking || false,
      progressText:
        bestCategoryAnswers >= 5
          ? `${Math.round(bestCategoryRatio * 100)}% Mastery (${bestCategoryAnswers} answered)`
          : `${bestCategoryAnswers} / 5 Questions answered`,
      progressPercent:
        bestCategoryAnswers >= 5
          ? Math.min(100, Math.round((bestCategoryRatio / 0.75) * 100))
          : Math.min(100, Math.round((bestCategoryAnswers / 5) * 50)),
    },
    {
      id: 'battleScholar',
      title: 'Battle Scholar',
      description: 'Answer 20 questions with at least 80% overall accuracy.',
      icon: '⚔️',
      unlocked: data.achievements.battleScholar || false,
      progressText: `${data.questionsAnswered} / 20 Questions (${accuracy}% Accuracy)`,
      progressPercent: Math.min(100, Math.round((data.questionsAnswered / 20) * 100)),
    },
    {
      id: 'timeTraveller',
      title: 'Time Traveller',
      description: 'Explore content from 5 different historical eras or decades.',
      icon: '🕰️',
      unlocked: data.achievements.timeTraveller || false,
      progressText: `${Math.min(data.exploration.periodsExplored.length, 5)} / 5 Eras Visited`,
      progressPercent: Math.min(100, Math.round((data.exploration.periodsExplored.length / 5) * 100)),
    },
    {
      id: 'curiousMind',
      title: 'Curious Mind',
      description: 'Explore 25 historical exhibits, timeline events, or milestones.',
      icon: '📚',
      unlocked: data.achievements.curiousMind || false,
      progressText: `${Math.min(totalExploredItems, 25)} / 25 Items Explored`,
      progressPercent: Math.min(100, Math.round((totalExploredItems / 25) * 100)),
    },
    {
      id: 'consistentLearner',
      title: 'Consistent Learner',
      description: 'Engage with Akhyana on 7 different days.',
      icon: '🔥',
      unlocked: data.achievements.consistentLearner || false,
      progressText: `${Math.min(data.activeDays.length, 7)} / 7 Active Days`,
      progressPercent: Math.min(100, Math.round((data.activeDays.length / 7) * 100)),
    },
  ];
}

export interface WeakAreaItem {
  id: string;
  name: string;
  accuracyPercent: number;
  answeredCount: number;
  type: 'category' | 'topic';
}

/**
 * Identify categories or topics where demonstrated mastery is relatively low (< 70%)
 * Only includes areas where the user has actually answered at least 1 question.
 */
export function getAreasToStrengthen(data: UserProgressData): WeakAreaItem[] {
  const weakAreas: WeakAreaItem[] = [];

  // 1. Check categories
  for (const cat of HISTORICAL_CATEGORIES) {
    const rec = data.categoryMastery[cat];
    if (rec && rec.answered >= 1) {
      const accuracy = Math.round((rec.correct / rec.answered) * 100);
      if (accuracy < 70) {
        weakAreas.push({
          id: `cat-${cat}`,
          name: cat,
          accuracyPercent: accuracy,
          answeredCount: rec.answered,
          type: 'category',
        });
      }
    }
  }

  // 2. Check individual topics
  for (const topicId in data.topicMastery) {
    const rec = data.topicMastery[topicId];
    if (rec && rec.answered >= 1) {
      const accuracy = Math.round((rec.correct / rec.answered) * 100);
      if (accuracy < 70) {
        weakAreas.push({
          id: `topic-${topicId}`,
          name: rec.topicTitle || topicId,
          accuracyPercent: accuracy,
          answeredCount: rec.answered,
          type: 'topic',
        });
      }
    }
  }

  // Sort lowest accuracy first
  return weakAreas.sort((a, b) => a.accuracyPercent - b.accuracyPercent);
}

/**
 * Count total topics mastered (accuracy >= 75% with at least 1 question answered)
 */
export function getMasteredTopicsCount(data: UserProgressData): { masteredCount: number; totalTopics: number } {
  let masteredCount = 0;
  const totalTopics = TOPICS.length; // 15 topics in Akhyana

  for (const topic of TOPICS) {
    const rec = data.topicMastery[topic.id];
    if (rec && rec.answered >= 1 && (rec.correct / rec.answered) >= 0.75) {
      masteredCount++;
    }
  }

  return { masteredCount, totalTopics };
}

/**
 * Historical Journey Periods status
 */
export interface JourneyPeriodStatus {
  id: 'ancient' | 'medieval' | 'colonial' | 'modern';
  label: string;
  sublabel: string;
  timeRange: string;
  isExplored: boolean;
  masteryPercent: number | null; // null if not enough data
  questionsAnswered: number;
}

export function getJourneyTimelineStatus(data: UserProgressData): JourneyPeriodStatus[] {
  // Ancient
  const ancientCivs = data.exploration.civilizations.filter((c) =>
    ['indus-valley', 'mauryan-empire', 'gupta-empire'].includes(c),
  );
  const ancientExplored = ancientCivs.length > 0 || data.exploration.periodsExplored.includes('indus-valley-period');
  const ancientCat = data.categoryMastery['Ancient India'];
  const ancientMastery =
    ancientCat && ancientCat.answered > 0 ? Math.round((ancientCat.correct / ancientCat.answered) * 100) : null;

  // Medieval
  const medievalCivs = data.exploration.civilizations.filter((c) =>
    ['chola-dynasty', 'vijayanagara-empire', 'mughal-period'].includes(c),
  );
  const medievalExplored = medievalCivs.length > 0 || data.exploration.periodsExplored.includes('medieval-india');
  const medievalCat = data.categoryMastery['Medieval India'];
  const medievalMastery =
    medievalCat && medievalCat.answered > 0 ? Math.round((medievalCat.correct / medievalCat.answered) * 100) : null;

  // Colonial (1750-1947)
  const colonialExplored =
    data.exploration.civilizations.includes('freedom-movement') ||
    data.exploration.periodsExplored.some((p) => p.includes('1890') || p.includes('1940'));
  // Colonial shares questions with Modern/Freedom
  const colonialMastery =
    data.categoryMastery['Modern India']?.answered > 0
      ? Math.round((data.categoryMastery['Modern India'].correct / data.categoryMastery['Modern India'].answered) * 100)
      : null;

  // Modern (1947 - Present)
  const modernExplored = data.exploration.periodsExplored.some((p) =>
    p.includes('1950') || p.includes('1980') || p.includes('2010') || p.includes('modern'),
  );
  const modernCat = data.categoryMastery['Modern India'];
  const modernMastery =
    modernCat && modernCat.answered > 0 ? Math.round((modernCat.correct / modernCat.answered) * 100) : null;

  return [
    {
      id: 'ancient',
      label: 'Ancient',
      sublabel: 'Indus, Mauryan, Gupta',
      timeRange: '2600 BCE – 550 CE',
      isExplored: ancientExplored,
      masteryPercent: ancientMastery,
      questionsAnswered: ancientCat?.answered || 0,
    },
    {
      id: 'medieval',
      label: 'Medieval',
      sublabel: 'Chola, Vijayanagara, Mughal',
      timeRange: '848 – 1750 CE',
      isExplored: medievalExplored,
      masteryPercent: medievalMastery,
      questionsAnswered: medievalCat?.answered || 0,
    },
    {
      id: 'colonial',
      label: 'Colonial',
      sublabel: 'Rebellions & Freedom Struggle',
      timeRange: '1750 – 1947 CE',
      isExplored: colonialExplored,
      masteryPercent: colonialMastery,
      questionsAnswered: Math.floor((modernCat?.answered || 0) / 2),
    },
    {
      id: 'modern',
      label: 'Modern',
      sublabel: 'Constitution, Space & Democracy',
      timeRange: '1947 – Present',
      isExplored: modernExplored,
      masteryPercent: modernMastery,
      questionsAnswered: modernCat?.answered || 0,
    },
  ];
}
