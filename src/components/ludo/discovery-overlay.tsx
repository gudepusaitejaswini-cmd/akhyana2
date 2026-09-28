import React from 'react';
import { StyleSheet, View } from 'react-native';

import { AnnotationTag } from '@/components/annotation-tag';
import { Button } from '@/components/button';
import { ThemedText } from '@/components/themed-text';
import { BorderRadius, Spacing } from '@/constants/theme';
import { LUDO_XP } from '@/games/ludo/engine';
import { LudoDiscoveryRecord } from '@/games/ludo/types';
import { useTheme } from '@/hooks/use-theme';

interface LudoDiscoveryOverlayProps {
  discovery: LudoDiscoveryRecord;
  onContinue: () => void;
}

export function LudoDiscoveryOverlay({ discovery, onContinue }: LudoDiscoveryOverlayProps) {
  const theme = useTheme();
  return (
    <View style={styles.overlay}>
      <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
        <AnnotationTag label="Historical discovery" variant="discovery" />
        <ThemedText type="editorialHeader">{discovery.title}</ThemedText>
        <ThemedText type="annotation" style={{ color: theme.discovery }}>
          {discovery.category.toUpperCase()} · {discovery.context}
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          {discovery.description}
        </ThemedText>
        <ThemedText type="smallBold" style={{ color: theme.accent }}>
          +{LUDO_XP.discovery} XP
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
    justifyContent: 'center',
    padding: Spacing.four,
    zIndex: 25,
  },
  card: {
    borderWidth: 1,
    borderRadius: BorderRadius.lg,
    padding: Spacing.four,
    gap: Spacing.two,
  },
});
