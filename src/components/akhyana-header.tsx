import React from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { MOCK_USER_PROGRESS } from '@/data/progress';
import { useTheme } from '@/hooks/use-theme';

interface AkhyanaHeaderProps {
  showTagline?: boolean;
  subtitle?: string;
}

export function AkhyanaHeader({ showTagline = true, subtitle }: AkhyanaHeaderProps) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.brandRow}>
          <ThemedText type="editorialHeader" style={[styles.brandWordmark, { color: theme.primary }]}>
            AKHYANA
          </ThemedText>
          <View style={[styles.brandDot, { backgroundColor: theme.accent }]} />
        </View>

        {/* Minimal metadata text */}
        <View style={styles.metaRow}>
          <ThemedText type="annotation" style={{ color: theme.accent }}>
            JOURNEY {MOCK_USER_PROGRESS.streakDays}D
          </ThemedText>
          <ThemedText type="annotation" style={{ color: theme.borderStrong }}>
            /
          </ThemedText>
          <ThemedText type="annotation" style={{ color: theme.primary, fontWeight: '800' }}>
            {MOCK_USER_PROGRESS.currentXp} XP
          </ThemedText>
        </View>
      </View>

      {showTagline && (
        <ThemedText type="caption" themeColor="textMuted" style={styles.tagline}>
          The game-based cultural learning platform
        </ThemedText>
      )}

      {subtitle && (
        <ThemedText type="small" themeColor="textSecondary" style={styles.customSubtitle}>
          {subtitle}
        </ThemedText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.four,
    paddingBottom: Spacing.two,
    gap: 4,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  brandWordmark: {
    fontSize: 19,
    lineHeight: 24,
    fontWeight: '900',
    letterSpacing: 3,
  },
  brandDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  tagline: {
    fontSize: 11,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  customSubtitle: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 2,
  },
});
