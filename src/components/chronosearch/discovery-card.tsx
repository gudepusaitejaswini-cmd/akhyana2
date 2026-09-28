import React from 'react';
import { StyleSheet, View } from 'react-native';

import { AnnotationTag } from '@/components/annotation-tag';
import { Button } from '@/components/button';
import { ThemedText } from '@/components/themed-text';
import { BorderRadius, Spacing } from '@/constants/theme';
import { ChronoSearchWordDef } from '@/games/chronosearch/types';
import { useTheme } from '@/hooks/use-theme';

interface ChronoSearchDiscoveryCardProps {
  word: ChronoSearchWordDef;
  xpEarned: number;
  onContinue: () => void;
}

export function ChronoSearchDiscoveryCard({ word, xpEarned, onContinue }: ChronoSearchDiscoveryCardProps) {
  const theme = useTheme();

  return (
    <View style={styles.overlay}>
      <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
        <AnnotationTag label="Historical discovery" variant="discovery" />
        <ThemedText type="editorialHeader">{word.displayLabel}</ThemedText>
        <ThemedText type="annotation" style={{ color: theme.discovery }}>
          {word.category.toUpperCase()}
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary" style={styles.body}>
          {word.explanation}
        </ThemedText>
        <ThemedText type="smallBold" style={{ color: theme.accent }}>
          +{xpEarned} XP
        </ThemedText>
        <Button title="Continue" variant="action" onPress={onContinue} />
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
  body: {
    lineHeight: 22,
  },
});
