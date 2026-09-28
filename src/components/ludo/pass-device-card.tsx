import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/button';
import { HairlineDivider } from '@/components/hairline-divider';
import { ThemedText } from '@/components/themed-text';
import { BorderRadius, Spacing } from '@/constants/theme';
import { LastTurnSummary, LudoPlayerConfig } from '@/games/ludo/types';
import { useTheme } from '@/hooks/use-theme';

interface PassDeviceCardProps {
  currentPlayer: LudoPlayerConfig;
  lastSummary: LastTurnSummary | null;
  onStartTurn: () => void;
}

export function PassDeviceCard({
  currentPlayer,
  lastSummary,
  onStartTurn,
}: PassDeviceCardProps) {
  const theme = useTheme();
  const [acknowledgedSummary, setAcknowledgedSummary] = useState(false);

  // If there's a previous turn summary and the user hasn't pressed Continue yet
  if (lastSummary && !acknowledgedSummary) {
    return (
      <View style={[styles.card, { backgroundColor: '#FFFDF7', borderColor: theme.border }]}>
        <View style={styles.headerRow}>
          <ThemedText style={styles.badgeIcon}>🏁</ThemedText>
          <ThemedText type="cardTitle" style={{ color: theme.primary }}>
            TURN COMPLETE
          </ThemedText>
        </View>

        {/* Previous player results */}
        <View style={styles.summaryBox}>
          <View style={styles.playerRow}>
            <View style={[styles.playerDot, { backgroundColor: lastSummary.playerColor }]} />
            <ThemedText type="smallBold" style={{ color: theme.text }}>
              {lastSummary.playerName}
            </ThemedText>
          </View>
          <ThemedText type="editorialHeader" style={{ color: theme.secondary, marginVertical: Spacing.one }}>
            {lastSummary.correctCount} / {lastSummary.totalQuestions} CORRECT
          </ThemedText>
          <ThemedText type="caption" themeColor="textSecondary">
            {lastSummary.spacesMoved > 0
              ? `Token moved ${lastSummary.spacesMoved} spaces along the track.`
              : `No movement this turn.`}
          </ThemedText>
        </View>

        <HairlineDivider verticalMargin="md" />

        {/* Pass device prompt */}
        <View style={styles.passPromptBox}>
          <ThemedText type="annotation" style={{ color: theme.textMuted, letterSpacing: 0.5 }}>
            NEXT TURN
          </ThemedText>
          <ThemedText type="cardTitle" style={{ color: lastSummary.nextPlayerColor }}>
            PASS THE DEVICE TO {lastSummary.nextPlayerName.toUpperCase()}
          </ThemedText>
        </View>

        <Button
          title="CONTINUE →"
          size="lg"
          variant="action"
          onPress={() => setAcknowledgedSummary(true)}
        />
      </View>
    );
  }

  // Ready prompt before the current player begins rolling
  return (
    <View style={[styles.card, { backgroundColor: '#FFFDF7', borderColor: theme.border }]}>
      <View style={styles.playerHeader}>
        <View style={[styles.largePlayerDot, { backgroundColor: currentPlayer.color }]} />
        <View>
          <ThemedText type="annotation" style={{ color: theme.textMuted, letterSpacing: 0.5 }}>
            HISTORICAL CHALLENGE
          </ThemedText>
          <ThemedText type="cardTitle" style={{ color: theme.primary }}>
            {currentPlayer.name.toUpperCase()}'S TURN
          </ThemedText>
        </View>
      </View>

      <View style={[styles.privacyBox, { backgroundColor: theme.primaryLight, borderColor: theme.primary }]}>
        <ThemedText type="annotation" style={{ color: theme.primary, fontWeight: '800' }}>
          🔒 PLAYER PRIVACY
        </ThemedText>
        <ThemedText type="caption" style={{ color: theme.text, lineHeight: 18 }}>
          Pass the device to {currentPlayer.name}. Only {currentPlayer.name} should see and answer the upcoming 6 historical questions!
        </ThemedText>
      </View>

      <Button
        title={`START CHALLENGE (6 QUESTIONS) →`}
        size="lg"
        variant="action"
        onPress={onStartTurn}
      />
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  badgeIcon: {
    fontSize: 22,
  },
  summaryBox: {
    alignItems: 'center',
    paddingVertical: Spacing.two,
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  playerDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  passPromptBox: {
    alignItems: 'center',
    gap: Spacing.one,
  },
  playerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  largePlayerDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
  },
  privacyBox: {
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    padding: Spacing.three,
    gap: Spacing.one,
  },
});
