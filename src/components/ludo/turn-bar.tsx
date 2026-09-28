import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/button';
import { ThemedText } from '@/components/themed-text';
import { BorderRadius, Spacing } from '@/constants/theme';
import { LudoPlayerConfig } from '@/games/ludo/types';
import { useTheme } from '@/hooks/use-theme';

interface LudoTurnBarProps {
  player: LudoPlayerConfig;
  diceValue: number | null;
  spinValue: number | null;
  canRoll: boolean;
  busy: boolean;
  hint: string;
  onRoll: () => void;
}

export function LudoTurnBar({
  player,
  diceValue,
  spinValue,
  canRoll,
  busy,
  hint,
  onRoll,
}: LudoTurnBarProps) {
  const theme = useTheme();
  const shown = spinValue ?? diceValue;

  return (
    <View style={[styles.bar, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
      <View style={styles.who}>
        <View style={[styles.swatch, { backgroundColor: player.color }]} />
        <View>
          <ThemedText type="annotation" themeColor="textMuted">
            TO MOVE
          </ThemedText>
          <ThemedText type="smallBold">{player.name}</ThemedText>
          <ThemedText type="caption" themeColor="textSecondary">
            {player.civilizationName}
          </ThemedText>
        </View>
      </View>
      <View style={styles.diceCol}>
        <View style={[styles.dice, { borderColor: theme.primary, backgroundColor: theme.primaryLight }]}>
          <ThemedText type="editorialHeader">{shown ?? '—'}</ThemedText>
        </View>
        <Button title="Challenge" size="sm" variant="action" onPress={onRoll} disabled={!canRoll || busy} />
      </View>
      <ThemedText type="caption" themeColor="textSecondary" style={styles.hint}>
        {hint}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    borderWidth: 1,
    borderRadius: BorderRadius.lg,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  who: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  swatch: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  diceCol: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dice: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hint: {
    lineHeight: 18,
  },
});
