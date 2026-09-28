import React from 'react';
import { Linking, Pressable, StyleSheet, View } from 'react-native';

import { AnnotationTag } from '@/components/annotation-tag';
import { Button } from '@/components/button';
import { ThemedText } from '@/components/themed-text';
import { BorderRadius, Spacing } from '@/constants/theme';
import { AajCategory, AajKaAkhyanaEvent } from '@/data/daily-history/types';
import { useTheme } from '@/hooks/use-theme';

export interface AajEventCardProps {
  event: AajKaAkhyanaEvent;
  onReadMore: (event: AajKaAkhyanaEvent) => void;
  onExploreInternal?: (route: string) => void;
}

export const CATEGORY_ICONS: Record<AajCategory, string> = {
  Battles: '⚔️',
  Movements: '✊',
  'Reforms & Laws': '📜',
  'Political History': '👑',
  'Culture & Heritage': '🏛️',
  Discoveries: '🔬',
  'Historical Figures': '👤',
  'Treaties & Agreements': '🤝',
  Archaeology: '🏺',
  Other: '🌏',
};

export function AajEventCard({ event, onReadMore, onExploreInternal }: AajEventCardProps) {
  const theme = useTheme();
  const icon = CATEGORY_ICONS[event.category] || '📜';

  const handleOpenSource = () => {
    if (event.sourceUrl) {
      void Linking.openURL(event.sourceUrl);
    }
  };

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.card,
          borderColor: theme.cardBorder,
        },
      ]}>
      {/* Category and Year Row */}
      <View style={styles.topRow}>
        <View style={styles.categoryBadgeRow}>
          <ThemedText style={styles.categoryIcon}>{icon}</ThemedText>
          <AnnotationTag label={event.category.toUpperCase()} variant="discovery" />
        </View>
        <View style={[styles.yearChip, { backgroundColor: theme.primaryLight }]}>
          <ThemedText type="smallBold" style={{ color: theme.primary }}>
            {event.year}
          </ThemedText>
        </View>
      </View>

      {/* Title */}
      <ThemedText type="cardTitle" style={[styles.title, { color: theme.primary }]}>
        {event.title}
      </ThemedText>

      {/* Short Description */}
      <ThemedText type="default" themeColor="textSecondary" style={styles.description}>
        {event.shortDescription}
      </ThemedText>

      {/* Why It Matters */}
      <View
        style={[
          styles.significanceBox,
          {
            backgroundColor: theme.backgroundElement,
            borderLeftColor: theme.secondary,
          },
        ]}>
        <ThemedText type="annotation" style={{ color: theme.secondary, fontWeight: '800' }}>
          WHY IT MATTERS
        </ThemedText>
        <ThemedText type="caption" themeColor="textSecondary" style={styles.significanceText}>
          {event.significance}
        </ThemedText>
      </View>

      {/* Source Attribution (Strictly Required) */}
      <View style={[styles.sourceRow, { borderTopColor: theme.cardBorder }]}>
        <View style={styles.sourceInfo}>
          <ThemedText type="annotation" themeColor="textMuted">
            SOURCE
          </ThemedText>
          <ThemedText type="caption" style={{ color: theme.text, fontWeight: '600' }} numberOfLines={1}>
            {event.sourceName}
          </ThemedText>
        </View>

        {event.sourceUrl ? (
          <Pressable
            accessibilityRole="link"
            onPress={handleOpenSource}
            style={({ pressed }) => [styles.sourceLinkBtn, pressed && { opacity: 0.7 }]}>
            <ThemedText type="annotation" style={{ color: theme.discovery, fontWeight: '800' }}>
              View Source ↗
            </ThemedText>
          </Pressable>
        ) : null}
      </View>

      {/* Card Actions */}
      <View style={styles.actionRow}>
        <Button
          title="Read Details"
          size="sm"
          variant="outline"
          onPress={() => onReadMore(event)}
        />
        {event.akhyanaExhibitRoute && onExploreInternal ? (
          <Button
            title="Explore in Akhyana →"
            size="sm"
            variant="action"
            onPress={() => onExploreInternal(event.akhyanaExhibitRoute!)}
          />
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    padding: Spacing.four,
    gap: Spacing.three,
    marginVertical: Spacing.two,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  categoryIcon: {
    fontSize: 16,
  },
  yearChip: {
    paddingHorizontal: Spacing.two,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  title: {
    fontSize: 19,
    lineHeight: 24,
  },
  description: {
    lineHeight: 21,
  },
  significanceBox: {
    padding: Spacing.three,
    borderRadius: BorderRadius.sm,
    borderLeftWidth: 3,
    gap: 4,
  },
  significanceText: {
    lineHeight: 18,
  },
  sourceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    paddingTop: Spacing.two,
  },
  sourceInfo: {
    flex: 1,
    marginRight: Spacing.two,
    gap: 2,
  },
  sourceLinkBtn: {
    paddingVertical: 4,
    paddingHorizontal: Spacing.two,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: Spacing.two,
    marginTop: Spacing.one,
    flexWrap: 'wrap',
  },
});
