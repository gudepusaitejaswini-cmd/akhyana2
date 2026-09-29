import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AkhyanaHeader } from '@/components/akhyana-header';
import { AnnotationTag } from '@/components/annotation-tag';
import { Button } from '@/components/button';
import { HairlineDivider } from '@/components/hairline-divider';
import { ProgressBar } from '@/components/progress-bar';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BorderRadius, BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { DECADE_DUEL_QUESTIONS } from '@/data/decade-duel-questions';
import { LUDO_QUESTIONS } from '@/data/ludo';
import { YEAR_DUEL_QUESTIONS } from '@/data/year-duel-questions';
import { useTheme } from '@/hooks/use-theme';
import {
  determineCategoryForQuestion,
  HistoricalCategory,
  recordQuestionAnswer,
  useUserProgress,
} from '@/services/user-progress';

interface PracticeQuestionItem {
  id: string;
  prompt: string;
  choices: string[];
  correctIndex: number;
  explanation: string;
  category: HistoricalCategory;
  yearOrEra?: string | number;
}

export default function PracticeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const { area, topic } = useLocalSearchParams<{ area?: string; topic?: string }>();
  const { progress } = useUserProgress();

  // Consolidate approved real questions
  const questionPool = useMemo<PracticeQuestionItem[]>(() => {
    const list: PracticeQuestionItem[] = [];

    // 1. Year questions
    for (const q of YEAR_DUEL_QUESTIONS) {
      const cat = determineCategoryForQuestion({
        year: q.year,
        theme: q.theme,
        promptOrText: q.prompt,
      });
      list.push({
        id: q.id,
        prompt: q.prompt,
        choices: q.choices,
        correctIndex: q.correctIndex,
        explanation: q.explanation,
        category: cat,
        yearOrEra: q.year,
      });
    }

    // 2. Decade duel questions
    for (const q of DECADE_DUEL_QUESTIONS) {
      const cat = determineCategoryForQuestion({
        era: q.decadeId,
        theme: q.topic,
        promptOrText: q.question,
      });
      list.push({
        id: q.id,
        prompt: q.question,
        choices: q.choices,
        correctIndex: q.correctIndex,
        explanation: q.explanation,
        category: cat,
        yearOrEra: q.decadeId,
      });
    }

    // 3. Ancient & Medieval Ludo questions
    for (const q of LUDO_QUESTIONS) {
      const cat = determineCategoryForQuestion({
        era: q.era,
        promptOrText: q.question,
      });
      list.push({
        id: q.id,
        prompt: q.question,
        choices: q.choices,
        correctIndex: q.correctIndex,
        explanation: q.explanation,
        category: cat,
        yearOrEra: q.era,
      });
    }

    return list;
  }, []);

  // Filter pool by target area or topic if requested
  const filteredQuestions = useMemo(() => {
    let pool = questionPool;
    if (area) {
      const match = pool.filter(
        (q) => q.category.toLowerCase().includes(area.toLowerCase()) || area.toLowerCase().includes(q.category.toLowerCase()),
      );
      if (match.length > 0) pool = match;
    }
    // Pick 5 questions deterministically / shuffled for this practice set
    return pool.slice(0, 5);
  }, [questionPool, area]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const currentQ = filteredQuestions[currentIndex] || filteredQuestions[0];
  const progressPercent = Math.round(((currentIndex + (isSubmitted ? 1 : 0)) / filteredQuestions.length) * 100);

  const handleSelectChoice = (idx: number) => {
    if (isSubmitted) return;
    setSelectedChoice(idx);
  };

  const handleSubmit = () => {
    if (selectedChoice === null || isSubmitted || !currentQ) return;
    setIsSubmitted(true);
    const isCorrect = selectedChoice === currentQ.correctIndex;
    if (isCorrect) {
      setScore((s) => s + 1);
    }
    // Record into Progress engine immediately
    recordQuestionAnswer({
      questionId: `practice-${currentQ.id}`,
      isCorrect,
      category: currentQ.category,
      promptOrText: currentQ.prompt,
    });
  };

  const handleNext = () => {
    if (currentIndex + 1 < filteredQuestions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedChoice(null);
      setIsSubmitted(false);
    } else {
      setIsCompleted(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedChoice(null);
    setIsSubmitted(false);
    setScore(0);
    setIsCompleted(false);
  };

  return (
    <ThemedView style={styles.screen}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: insets.top > 0 ? insets.top : Spacing.four,
            paddingBottom: insets.bottom + BottomTabInset + Spacing.six,
          },
        ]}
        showsVerticalScrollIndicator={false}>
        <View style={styles.wrapper}>
          {/* Header */}
          <View style={styles.navRow}>
            <Button
              title="← RETURN TO PROGRESS"
              size="sm"
              variant="text"
              onPress={() => router.replace('/progress')}
            />
          </View>

          <AkhyanaHeader showTagline={false} subtitle="STRENGTHEN KNOWLEDGE" />

          <View style={styles.hero}>
            <AnnotationTag label={area ? `PRACTICE: ${area.toUpperCase()}` : 'TARGETED PRACTICE'} variant="accent" />
            <ThemedText type="heroDisplay" style={{ color: theme.primary }}>
              PRACTICE & MASTERY
            </ThemedText>
            <ThemedText type="editorialLead" themeColor="textSecondary">
              Targeted historical questions from approved source collections to strengthen your demonstrated knowledge.
            </ThemedText>
          </View>

          <HairlineDivider verticalMargin="md" />

          {!isCompleted && currentQ ? (
            <View style={styles.quizCard}>
              <View style={styles.progressRow}>
                <ThemedText type="annotation" style={{ color: theme.primary, fontWeight: '800' }}>
                  QUESTION {currentIndex + 1} OF {filteredQuestions.length}
                </ThemedText>
                <AnnotationTag label={currentQ.category.toUpperCase()} variant="discovery" />
              </View>

              <ProgressBar progress={progressPercent} colorVariant="accent" height={6} />

              <ThemedText type="editorialHeader" style={[styles.promptText, { color: theme.primary }]}>
                {currentQ.prompt}
              </ThemedText>

              <View style={styles.choicesList}>
                {currentQ.choices.map((choice, idx) => {
                  const isSelected = selectedChoice === idx;
                  const isCorrect = idx === currentQ.correctIndex;

                  let cardBg: string = theme.card;
                  let borderColor: string = theme.cardBorder;
                  let textColor: string = theme.text;

                  if (isSubmitted) {
                    if (isCorrect) {
                      cardBg = theme.successLight;
                      borderColor = theme.success;
                      textColor = theme.success;
                    } else if (isSelected) {
                      cardBg = theme.errorLight;
                      borderColor = theme.error;
                    textColor = theme.error;
                    }
                  } else if (isSelected) {
                    cardBg = theme.primaryLight;
                    borderColor = theme.primary;
                    textColor = theme.primary;
                  }

                  return (
                    <Pressable
                      key={idx}
                      onPress={() => handleSelectChoice(idx)}
                      disabled={isSubmitted}
                      style={[styles.choiceItem, { backgroundColor: cardBg, borderColor }]}>
                      <View
                        style={[
                          styles.choiceIndexBox,
                          {
                            backgroundColor: isSelected ? theme.primary : theme.backgroundElement,
                            borderColor: theme.cardBorder,
                          },
                        ]}>
                        <ThemedText
                          type="smallBold"
                          style={{ color: isSelected ? '#FFFFFF' : theme.textSecondary }}>
                          {String.fromCharCode(65 + idx)}
                        </ThemedText>
                      </View>
                      <ThemedText type="default" style={[styles.choiceText, { color: textColor }]}>
                        {choice}
                      </ThemedText>
                    </Pressable>
                  );
                })}
              </View>

              {isSubmitted ? (
                <View
                  style={[
                    styles.explanationBox,
                    {
                      backgroundColor:
                        selectedChoice === currentQ.correctIndex ? theme.successLight : theme.backgroundElement,
                      borderLeftColor:
                        selectedChoice === currentQ.correctIndex ? theme.success : theme.primary,
                    },
                  ]}>
                  <ThemedText
                    type="smallBold"
                    style={{
                      color:
                        selectedChoice === currentQ.correctIndex ? theme.success : theme.primary,
                      marginBottom: 4,
                    }}>
                    {selectedChoice === currentQ.correctIndex ? '✓ Correct Answer' : '✕ Verification & Context'}
                  </ThemedText>
                  <ThemedText type="small" themeColor="textSecondary">
                    {currentQ.explanation}
                  </ThemedText>
                </View>
              ) : null}

              <View style={styles.actionRow}>
                {!isSubmitted ? (
                  <Button
                    title="Submit Answer"
                    size="md"
                    variant="action"
                    disabled={selectedChoice === null}
                    onPress={handleSubmit}
                  />
                ) : (
                  <Button
                    title={currentIndex + 1 < filteredQuestions.length ? 'Next Question →' : 'Complete Practice →'}
                    size="md"
                    variant="primary"
                    onPress={handleNext}
                  />
                )}
              </View>
            </View>
          ) : (
            /* COMPLETED SUMMARY */
            <View style={[styles.summaryCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
              <ThemedText style={{ fontSize: 44, textAlign: 'center', marginBottom: Spacing.two }}>
                🏆
              </ThemedText>
              <ThemedText type="heroDisplay" style={{ color: theme.primary, textAlign: 'center' }}>
                PRACTICE COMPLETE
              </ThemedText>
              <ThemedText type="editorialLead" themeColor="textSecondary" style={{ textAlign: 'center' }}>
                You scored {score} out of {filteredQuestions.length} correct ({Math.round((score / filteredQuestions.length) * 100)}% accuracy).
              </ThemedText>
              <ThemedText type="caption" themeColor="textMuted" style={{ textAlign: 'center', marginVertical: Spacing.two }}>
                Your demonstrated answers have been recorded and your mastery scores have been updated.
              </ThemedText>

              <View style={styles.summaryButtons}>
                <Button title="Practice Another Set" size="md" variant="secondary" onPress={handleRestart} />
                <Button title="View Updated Progress →" size="md" variant="action" onPress={() => router.replace('/progress')} />
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { alignItems: 'center' },
  wrapper: { width: '100%', maxWidth: MaxContentWidth, paddingHorizontal: Spacing.four },
  navRow: { marginBottom: Spacing.two },
  hero: { gap: Spacing.two, marginTop: Spacing.two },
  quizCard: {
    padding: Spacing.four,
    gap: Spacing.four,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: '#E8E1D3',
    backgroundColor: '#FFFDF7',
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  promptText: {
    fontSize: 20,
    lineHeight: 28,
  },
  choicesList: {
    gap: Spacing.three,
  },
  choiceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.three,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    gap: Spacing.three,
  },
  choiceIndexBox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  choiceText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 22,
  },
  explanationBox: {
    padding: Spacing.three,
    borderRadius: BorderRadius.sm,
    borderLeftWidth: 4,
    gap: Spacing.one,
  },
  actionRow: {
    marginTop: Spacing.two,
  },
  summaryCard: {
    padding: Spacing.five,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    gap: Spacing.three,
    alignItems: 'center',
  },
  summaryButtons: {
    gap: Spacing.two,
    width: '100%',
    maxWidth: 320,
    marginTop: Spacing.two,
  },
});
