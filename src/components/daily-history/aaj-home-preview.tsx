import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AnnotationTag } from '@/components/annotation-tag';
import { ThemedText } from '@/components/themed-text';
import { BorderRadius, Spacing } from '@/constants/theme';
import { getFeaturedTodayEvent, getTodayDate } from '@/data/daily-history';
import { useTheme } from '@/hooks/use-theme';

export function AajHomePreview() {
  const router = useRouter();
  const theme = useTheme();
  const today = getTodayDate();
  const featured = getFeaturedTodayEvent();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Open Aaj Ka Akhyana daily history"
      onPress={() => router.push('/aaj-ka-akhyana')}
      style={({ pressed }) => [
        styles.container,
        {
          backgroundColor: theme.card,
          borderColor: theme.cardBorder,
        },
        pressed && styles.pressed,
      ]}>
      <View style={styles.headerRow}>
        <View style={styles.titleWithIcon}>
          <ThemedText style={{ fontSize: 18 }}>📜</ThemedText>
          <ThemedText type="smallBold" style={[styles.heading, { color: theme.primary }]}>
            AAJ KA AKHYANA
          </ThemedText>
        </View>
        <AnnotationTag label={today.displayString.toUpperCase()} variant="discovery" />
      </View>

      <ThemedText type="annotation" style={{ color: theme.secondary, fontWeight: '700' }}>
        इतिहास में आज • ON THIS DAY IN HISTORY
      </ThemedText>

      {featured ? (
        <View style={styles.eventSnippet}>
          <ThemedText type="smallBold" style={[styles.eventTitle, { color: theme.primary }]}>
            {featured.year}: {featured.title}
          </ThemedText>
          <ThemedText type="caption" themeColor="textSecondary" numberOfLines={2}>
            {featured.shortDescription}
          </ThemedText>
        </View>
      ) : (
        <ThemedText type="caption" themeColor="textMuted">
          Discover what happened on this day in history.
        </ThemedText>
      )}

      <View style={styles.ctaRow}>
        <ThemedText type="smallBold" style={{ color: theme.secondary }}>
          Explore Today’s History →
        </ThemedText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    padding: Spacing.four,
    gap: Spacing.two,
    marginVertical: Spacing.three,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  heading: {
    letterSpacing: 0.5,
  },
  eventSnippet: {
    gap: 4,
    marginTop: 2,
  },
  eventTitle: {
    fontSize: 15,
  },
  ctaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.995 }],
  },
});
