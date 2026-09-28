import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/button';
import { ThemedText } from '@/components/themed-text';
import { BorderRadius, Spacing } from '@/constants/theme';
import { LudoPlayerConfig } from '@/games/ludo/types';
import { useTheme } from '@/hooks/use-theme';

interface QuizSummaryCardProps {
  player: LudoPlayerConfig;
  correctCount: number;
  totalQuestions?: number;
  hasLegalMoves: boolean;
  onProceedToMove: () => void;
  onPassTurn: () => void;
}

export function QuizSummaryCard({
  player,
  correctCount,
  totalQuestions = 6,
  hasLegalMoves,
  onProceedToMove,
  onPassTurn,
}: QuizSummaryCardProps) {
  const theme = useTheme();
  const isPerfect = correctCount === totalQuestions;
  const isZero = correctCount === 0;

  return (
    <View style={[styles.card, { backgroundColor: '#FFFDF7', borderColor: isZero ? theme.border : theme.secondary }]}>
      {/* 1. Header Banner */}
      <View style={styles.header}>
        <ThemedText style={styles.icon}>
          {isPerfect ? '🎉' : isZero ? '🥀' : '🎯'}
        </ThemedText>
        <ThemedText type="cardTitle" style={{ color: isPerfect ? theme.primary : theme.text }}>
          {isPerfect ? 'PERFECT ROUND!' : isZero ? 'CHALLENGE COMPLETE' : 'ROUND COMPLETE'}
        </ThemedText>
      </View>

      {/* 2. Score Announcement */}
      <View style={styles.scoreBox}>
        <ThemedText type="heroDisplay" style={{ color: isZero ? theme.textMuted : theme.secondary }}>
          {correctCount} / {totalQuestions}
        </ThemedText>
        <ThemedText type="smallBold" style={{ color: theme.primary }}>
          CORRECT ANSWERS
        </ThemedText>
      </View>

      {/* 3. Movement Explanation */}
      <View style={[styles.messageBox, { backgroundColor: theme.backgroundElement }]}>
        {isZero ? (
          <ThemedText type="caption" style={{ color: theme.textSecondary, textAlign: 'center', lineHeight: 20 }}>
            0 / {totalQuestions} Correct — You don't move this turn.{'\n'}Better luck on your next turn!
          </ThemedText>
        ) : !hasLegalMoves ? (
          <ThemedText type="caption" style={{ color: theme.textSecondary, textAlign: 'center', lineHeight: 20 }}>
            You earned {correctCount} steps, but you have no legal moves for this distance.{'\n'}Turn passes!
          </ThemedText>
        ) : (
          <ThemedText type="caption" style={{ color: theme.text, textAlign: 'center', lineHeight: 20 }}>
            Your knowledge earned you <ThemedText type="smallBold" style={{ color: theme.secondary }}>{correctCount} steps</ThemedText> of token movement!
          </ThemedText>
        )}
      </View>

      {/* 4. Action Button */}
      {correctCount > 0 && hasLegalMoves ? (
        <Button
          title={`SELECT TOKEN / MOVE (${correctCount} STEPS) →`}
          size="lg"
          variant="action"
          onPress={onProceedToMove}
        />
      ) : (
        <Button
          title="PASS THE DEVICE →"
          size="lg"
          variant="primary"
          onPress={onPassTurn}
        />
      )}
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
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    justifyContent: 'center',
  },
  icon: {
    fontSize: 24,
  },
  scoreBox: {
    alignItems: 'center',
    gap: 2,
    paddingVertical: Spacing.one,
  },
  messageBox: {
    padding: Spacing.three,
    borderRadius: BorderRadius.md,
  },
});
