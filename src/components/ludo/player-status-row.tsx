import React from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { BorderRadius, Spacing } from '@/constants/theme';
import { FINISH_DISTANCE, LudoPlayerConfig, LudoSeat, LudoToken } from '@/games/ludo/types';
import { useTheme } from '@/hooks/use-theme';

interface PlayerStatusRowProps {
  players: LudoPlayerConfig[];
  currentSeat: LudoSeat;
  tokens: LudoToken[];
}

export function PlayerStatusRow({ players, currentSeat, tokens }: PlayerStatusRowProps) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      {players.map((player) => {
        const isCurrent = player.seat === currentSeat;
        const isYou = player.seat === 0;
        const homeCount = tokens.filter(
          (t) => t.seat === player.seat && t.distance >= FINISH_DISTANCE,
        ).length;

        return (
          <View
            key={`status-${player.seat}`}
            style={[
              styles.playerChip,
              {
                backgroundColor: isCurrent ? theme.primaryLight : theme.card,
                borderColor: isCurrent ? theme.primary : theme.cardBorder,
                borderWidth: isCurrent ? 1.5 : 1,
              },
            ]}>
            <View style={[styles.dot, { backgroundColor: player.color }]} />
            <View style={styles.infoCol}>
              <View style={styles.nameRow}>
                <ThemedText
                  type="annotation"
                  style={{
                    color: isCurrent ? theme.primary : theme.text,
                    fontWeight: isCurrent ? '800' : '600',
                  }}>
                  {player.name}
                </ThemedText>
                {isCurrent && (
                  <View style={[styles.turnDot, { backgroundColor: theme.primary }]} />
                )}
              </View>
              <ThemedText type="caption" style={{ color: theme.textMuted, fontSize: 10 }}>
                {homeCount}/4 home
              </ThemedText>
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: Spacing.one,
    width: '100%',
    paddingVertical: Spacing.one,
  },
  playerChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.two,
    borderRadius: BorderRadius.md,
    gap: Spacing.one,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  infoCol: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  turnDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
});
