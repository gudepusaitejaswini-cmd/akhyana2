import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AnnotationTag } from '@/components/annotation-tag';
import { Button } from '@/components/button';
import { ThemedText } from '@/components/themed-text';
import { BorderRadius, Spacing } from '@/constants/theme';
import { ChronoSearchWordDef } from '@/games/chronosearch/types';
import { useTheme } from '@/hooks/use-theme';

interface ChronoSearchChallengeCardProps {
  word: ChronoSearchWordDef;
  selectedIndex: number | null;
  xpAwarded: number;
  onSelect: (index: number) => void;
  onContinue: () => void;
}

export function ChronoSearchChallengeCard({
  word,
  selectedIndex,
  xpAwarded,
  onSelect,
  onContinue,
}: ChronoSearchChallengeCardProps) {
  const theme = useTheme();
  const challenge = word.challenge;
  if (!challenge) return null;

  const hasAnswered = selectedIndex !== null;
  const isCorrect = selectedIndex === challenge.correctIndex;

  return (
    <View style={styles.overlay}>
      <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
        <AnnotationTag label="Mini challenge" variant="accent" />
        <ThemedText type="editorialHeader">A closer look</ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          {challenge.question}
        </ThemedText>
        <View style={styles.choices}>
          {challenge.choices.map((choice, index) => {
            const isSelected = selectedIndex === index;
            let backgroundColor: string = theme.background;
            let borderColor: string = theme.border;
            let textColor: string = theme.text;
            if (isSelected && hasAnswered) {
              backgroundColor = isCorrect ? theme.successLight : theme.errorLight;
              borderColor = isCorrect ? theme.success : theme.error;
              textColor = isCorrect ? theme.success : theme.error;
            }

            return (
              <Pressable
                key={choice}
                onPress={() => onSelect(index)}
                disabled={hasAnswered}
                style={[styles.choice, { backgroundColor, borderColor }]}>
                <ThemedText type="smallBold" style={{ color: textColor }}>
                  {choice}
                </ThemedText>
              </Pressable>
            );
          })}
        </View>
        {hasAnswered ? (
          <>
            <AnnotationTag
              label={isCorrect ? 'Accurate' : 'Not quite'}
              variant={isCorrect ? 'success' : 'error'}
            />
            <ThemedText type="small" themeColor="textSecondary">
              {challenge.explanation}
            </ThemedText>
            {isCorrect ? (
              <ThemedText type="smallBold" style={{ color: theme.accent }}>
                +{xpAwarded} XP
              </ThemedText>
            ) : null}
            <Button title="Continue the hunt" variant="action" onPress={onContinue} />
          </>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(36, 59, 100, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.four,
    zIndex: 20,
  },
  card: {
    width: '100%',
    maxWidth: 480,
    borderWidth: 1,
    borderRadius: BorderRadius.lg,
    padding: Spacing.four,
    gap: Spacing.two,
  },
  choices: {
    gap: Spacing.two,
  },
  choice: {
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    padding: Spacing.three,
  },
});
