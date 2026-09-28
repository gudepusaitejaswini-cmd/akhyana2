import React from 'react';
import { StyleSheet, View } from 'react-native';

import { AnnotationTag } from '@/components/annotation-tag';
import { Button } from '@/components/button';
import { ThemedText } from '@/components/themed-text';
import { BorderRadius, Spacing } from '@/constants/theme';
import { LudoGameState, LudoPlayerConfig } from '@/games/ludo/types';
import { useTheme } from '@/hooks/use-theme';

interface LudoVictoryCardProps {
  winner: LudoPlayerConfig;
  state: LudoGameState;
  onReplay: () => void;
  onReturnToGames: () => void;
}

export function LudoVictoryCard({ winner, state, onReplay, onReturnToGames }: LudoVictoryCardProps) {
  const theme = useTheme();
  const key = String(winner.seat);
  const collected = state.collections[key]?.length ?? 0;
  const duels = state.duelsWon[key] ?? 0;

  return (
    <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
      <AnnotationTag label="Match complete" variant="action" />
      <ThemedText type="editorialHeader">{winner.name} holds the board.</ThemedText>
      <ThemedText type="small" themeColor="textSecondary">
        {winner.civilizationName}
      </ThemedText>
      <ThemedText type="statValue" style={{ color: theme.accent }}>{state.xp[key] ?? 0}</ThemedText>
      <ThemedText type="caption" themeColor="textMuted">
        Session XP
      </ThemedText>
      <View style={styles.meta}>
        <ThemedText type="small" themeColor="textSecondary">
          Discoveries collected: {collected}
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          Duels won: {duels} / {state.duelsFought} fought
        </ThemedText>
      </View>
      <Button title="Play again" variant="action" onPress={onReplay} />
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
