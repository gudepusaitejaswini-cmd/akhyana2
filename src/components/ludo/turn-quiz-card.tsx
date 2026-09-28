import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Button } from '@/components/button';
import { ThemedText } from '@/components/themed-text';
import { BorderRadius, Spacing } from '@/constants/theme';
import { LudoDuelQuestion, LudoPlayerConfig } from '@/games/ludo/types';
import { useTheme } from '@/hooks/use-theme';

interface TurnQuizCardProps {
  player: LudoPlayerConfig;
  questions: LudoDuelQuestion[];
  currentIndex: number;
  correctCount: number;
  selectedChoice: number | null;
  isSubmitted: boolean;
  onSelectChoice: (choiceIndex: number) => void;
  onSubmitAnswer: () => void;
  onNextQuestion: () => void;
}

const OPTION_LETTERS = ['A', 'B', 'C', 'D'];

export function TurnQuizCard({
  player,
  questions,
  currentIndex,
  correctCount,
  selectedChoice,
  isSubmitted,
  onSelectChoice,
  onSubmitAnswer,
  onNextQuestion,
}: TurnQuizCardProps) {
  const theme = useTheme();
  const question = questions[currentIndex];
  if (!question) return null;

  const total = questions.length;
  const isLastQuestion = currentIndex + 1 >= total;
  const isSelectedChoiceCorrect =
    selectedChoice !== null && selectedChoice === question.correctIndex;

  return (
    <View style={[styles.card, { backgroundColor: '#FFFDF7', borderColor: theme.secondary }]}>
      {/* 1. Header with Active Player Banner & Progress */}
      <View style={styles.headerRow}>
        <View style={styles.titleCol}>
          <View style={styles.playerBadge}>
            <View style={[styles.playerDot, { backgroundColor: player.color }]} />
            <ThemedText type="annotation" style={{ color: theme.primary, fontWeight: '800' }}>
              {player.name.toUpperCase()}'S CHALLENGE
            </ThemedText>
          </View>
          <ThemedText type="smallBold" style={{ color: theme.secondary }}>
            Question {currentIndex + 1} of {total}
          </ThemedText>
        </View>

        <View style={[styles.scoreBadge, { backgroundColor: theme.primaryLight }]}>
          <ThemedText type="annotation" style={{ color: theme.primary, fontWeight: '800' }}>
            SCORE: {correctCount} / {total}
          </ThemedText>
        </View>
      </View>

      {/* 2. 6-Question Progress Dots */}
      <View style={styles.dotsRow}>
        {Array.from({ length: total }, (_, i) => {
          const isDone = i < currentIndex;
          const isCurrent = i === currentIndex;
          return (
            <View
              key={`dot-${i}`}
              style={[
                styles.dot,
                {
                  backgroundColor: isDone
                    ? theme.secondary
                    : isCurrent
                    ? theme.primary
                    : theme.border,
                  width: isCurrent ? 20 : 8,
                },
              ]}
            />
          );
        })}
      </View>

      {/* 3. Question Prompt */}
      <View style={[styles.questionBox, { backgroundColor: theme.backgroundElement }]}>
        <ThemedText type="cardTitle" style={[styles.questionText, { color: theme.text }]}>
          {question.question}
        </ThemedText>
      </View>

      {/* 4. Answer Choices */}
      <View style={styles.choicesList}>
        {question.choices.map((choice, index) => {
          const isThisSelected = selectedChoice === index;
          const isThisCorrect = question.correctIndex === index;

          let btnBg: string = theme.card;
          let btnBorder: string = theme.border;
          let textColor: string = theme.text;
          let badgeBg: string = theme.backgroundElement;
          let badgeTextColor: string = theme.textSecondary;

          if (isSubmitted) {
            if (isThisCorrect) {
              btnBg = '#EDFDF5';
              btnBorder = '#0E9F6E';
              textColor = '#03543F';
              badgeBg = '#0E9F6E';
              badgeTextColor = '#FFFFFF';
            } else if (isThisSelected && !isThisCorrect) {
              btnBg = '#FDF2F2';
              btnBorder = '#F05252';
              textColor = '#9B1C1C';
              badgeBg = '#F05252';
              badgeTextColor = '#FFFFFF';
            } else {
              btnBg = '#FAFAFA';
              btnBorder = theme.border;
              textColor = theme.textMuted;
            }
          } else if (isThisSelected) {
            btnBg = theme.primaryLight;
            btnBorder = theme.primary;
            textColor = theme.primary;
            badgeBg = theme.primary;
            badgeTextColor = '#FFFFFF';
          }

          return (
            <Pressable
              key={`quiz-choice-${index}`}
              disabled={isSubmitted}
              onPress={() => onSelectChoice(index)}
              style={({ pressed }) => [
                styles.choiceButton,
                {
                  backgroundColor: btnBg,
                  borderColor: btnBorder,
                  opacity: pressed && !isSubmitted ? 0.85 : 1,
                  transform: [{ scale: pressed && !isSubmitted ? 0.99 : 1 }],
                },
              ]}>
              <View style={[styles.letterBadge, { backgroundColor: badgeBg }]}>
                <ThemedText type="annotation" style={{ color: badgeTextColor, fontWeight: '800' }}>
                  {isSubmitted && isThisCorrect
                    ? '✓'
                    : isSubmitted && isThisSelected && !isThisCorrect
                    ? '✕'
                    : OPTION_LETTERS[index] ?? '•'}
                </ThemedText>
              </View>

              <ThemedText
                type="default"
                style={[
                  styles.choiceText,
                  {
                    color: textColor,
                    fontWeight: isThisSelected || (isSubmitted && isThisCorrect) ? '700' : '400',
                  },
                ]}>
                {choice}
              </ThemedText>
            </Pressable>
          );
        })}
      </View>

      {/* 5. Feedback & Historical Context (Visible after submission) */}
      {isSubmitted && (
        <View style={styles.feedbackSection}>
          <View
            style={[
              styles.feedbackBanner,
              {
                backgroundColor: isSelectedChoiceCorrect ? '#DEF7EC' : '#FDE8E8',
                borderColor: isSelectedChoiceCorrect ? '#0E9F6E' : '#F05252',
              },
            ]}>
            <ThemedText
              type="smallBold"
              style={{
                color: isSelectedChoiceCorrect ? '#03543F' : '#9B1C1C',
                textAlign: 'center',
              }}>
              {isSelectedChoiceCorrect
                ? '✓ Correct! +1 step earned'
                : '✕ Incorrect (0 steps for this question)'}
            </ThemedText>
          </View>

          {question.explanation ? (
            <View style={[styles.explanationCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <ThemedText type="annotation" style={{ color: theme.secondary, fontWeight: '800' }}>
                💡 HISTORICAL CONTEXT
              </ThemedText>
              <ThemedText type="caption" style={{ color: theme.textSecondary, lineHeight: 18 }}>
                {question.explanation}
              </ThemedText>
            </View>
          ) : null}
        </View>
      )}

      {/* 6. Action Button: Submit Answer OR Next Question */}
      <View style={styles.actionContainer}>
        {!isSubmitted ? (
          <Button
            title="SUBMIT ANSWER"
            size="lg"
            variant="action"
            disabled={selectedChoice === null}
            onPress={onSubmitAnswer}
          />
        ) : (
          <Button
            title={isLastQuestion ? 'COMPLETE ROUND →' : 'NEXT QUESTION →'}
            size="lg"
            variant="primary"
            onPress={onNextQuestion}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    borderWidth: 2,
    borderRadius: BorderRadius.lg,
    padding: Spacing.four,
    gap: Spacing.three,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleCol: {
    gap: 3,
  },
  playerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  playerDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  scoreBadge: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
    borderRadius: BorderRadius.full,
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    marginVertical: 2,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  questionBox: {
    padding: Spacing.three,
    borderRadius: BorderRadius.md,
  },
  questionText: {
    lineHeight: 22,
  },
  choicesList: {
    gap: Spacing.two,
  },
  choiceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.three,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    gap: Spacing.three,
  },
  letterBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  choiceText: {
    flex: 1,
    lineHeight: 20,
  },
  feedbackSection: {
    gap: Spacing.two,
  },
  feedbackBanner: {
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  explanationCard: {
    padding: Spacing.three,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    gap: 4,
  },
  actionContainer: {
    marginTop: Spacing.one,
  },
});
