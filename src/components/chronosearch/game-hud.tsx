import React from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { BorderRadius, Spacing } from '@/constants/theme';
import { formatElapsed } from '@/games/chronosearch/engine';
import { useTheme } from '@/hooks/use-theme';

interface ChronoSearchHudProps {
  eraTitle: string;
  puzzleTitle: string;
  score: number;
  elapsedSeconds: number;
  wordsFound: number;
  wordCount: number;
}

export function ChronoSearchHud({
  eraTitle,
  puzzleTitle,
  score,
  elapsedSeconds,
  wordsFound,
  wordCount,
}: ChronoSearchHudProps) {
  const theme = useTheme();
  return (
    <View style={[styles.hud, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
      <View style={styles.titleBlock}>
        <ThemedText type="annotation" themeColor="textMuted">
          {eraTitle.toUpperCase()}
        </ThemedText>
        <ThemedText type="smallBold">{puzzleTitle}</ThemedText>
      </View>
      <View style={styles.statsRow}>
        <HudStat label="Score" value={`${score}`} />
        <HudStat label="XP" value={`${score}`} />
        <HudStat label="Time" value={formatElapsed(elapsedSeconds)} />
        <HudStat label="Found" value={`${wordsFound}/${wordCount}`} />
      </View>
    </View>
  );
}



function HudStat({ label, value }: { label: string; value: string }) {
  const theme = useTheme();
  const isXpOrScore = label === 'Score' || label === 'XP';
  return (
    <View style={[styles.stat, { backgroundColor: theme.backgroundElement, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6, flex: 1, marginHorizontal: 2, alignItems: 'center' }]}>
      <ThemedText type="annotation" style={{ color: isXpOrScore ? theme.accent : theme.textSecondary, fontSize: 10 }}>
        {label.toUpperCase()}
      </ThemedText>
      <ThemedText type="smallBold" style={{ color: theme.primary, marginTop: 2 }}>{value}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  hud: {
    borderWidth: 1,
    borderRadius: BorderRadius.lg,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  titleBlock: {
    gap: 2,
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.one,
    justifyContent: 'space-between',
  },
  stat: {
    gap: 2,
  },
});
