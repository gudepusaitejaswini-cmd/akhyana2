import React from 'react';
import { StyleSheet, View } from 'react-native';

import { AnnotationTag } from '@/components/annotation-tag';
import { Button } from '@/components/button';
import { ThemedText } from '@/components/themed-text';
import { BorderRadius, Spacing } from '@/constants/theme';
import { formatElapsed } from '@/games/chronosearch/engine';
import { ChronoSearchScoreBreakdown } from '@/games/chronosearch/types';
import { useTheme } from '@/hooks/use-theme';

interface ChronoSearchCompletionCardProps {
  eraTitle: string;
  puzzleTitle: string;
  wordCount: number;
  elapsedSeconds: number;
  breakdown: ChronoSearchScoreBreakdown;
  onReplay: () => void;
  onReturnToGames: () => void;
}

export function ChronoSearchCompletionCard({
  eraTitle,
  puzzleTitle,
  wordCount,
  elapsedSeconds,
  breakdown,
  onReplay,
  onReturnToGames,
}: ChronoSearchCompletionCardProps) {
  const theme = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
      <AnnotationTag label="Hunt complete" variant="action" />
      <ThemedText type="editorialHeader">The grid is read.</ThemedText>
      <ThemedText type="small" themeColor="textSecondary">
        {eraTitle} · {puzzleTitle}
      </ThemedText>
      <ThemedText type="statValue" style={{ color: theme.accent }}>{breakdown.total}</ThemedText>
      <ThemedText type="caption" themeColor="textMuted">
        Score · {breakdown.xpEarned} XP earned
      </ThemedText>
      <View style={styles.meta}>
        <ThemedText type="small" themeColor="textSecondary">
          Words discovered: {breakdown.wordsFound} / {wordCount}
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          Mini challenges: {breakdown.challengesCorrect} / {breakdown.challengesAttempted} accurate
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          Time: {formatElapsed(elapsedSeconds)}
        </ThemedText>
      </View>
      <Button title="Hunt this era again" variant="action" onPress={onReplay} />
      <Button title="Return to Games" variant="outline" onPress={onReturnToGames} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: BorderRadius.lg,
    padding: Spacing.four,
    gap: Spacing.two,
  },
  meta: {
    gap: Spacing.one,
    marginVertical: Spacing.two,
  },
});
