import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AnnotationTag } from '@/components/annotation-tag';
import { Button } from '@/components/button';
import { EditorialCard } from '@/components/editorial-card';
import { HairlineDivider } from '@/components/hairline-divider';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BorderRadius, MaxContentWidth, Spacing } from '@/constants/theme';
import {
  getChronoSearchDecades,
  PRESERVED_ERA_PUZZLES,
} from '@/data/chronosearch';
import { useTheme } from '@/hooks/use-theme';

export default function ChronoSearchScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const theme = useTheme();

  const decades = getChronoSearchDecades();
  const [selectedDecade, setSelectedDecade] = useState<number>(decades[0]?.decade ?? 1940);

  const activeDecadeGroup = decades.find((d) => d.decade === selectedDecade) ?? decades[0];
  const puzzlesForDecade = activeDecadeGroup ? activeDecadeGroup.puzzles : [];

  return (
    <ThemedView style={styles.screen}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: insets.top > 0 ? insets.top : Spacing.four,
            paddingBottom: insets.bottom + Spacing.seven,
          },
        ]}
        showsVerticalScrollIndicator={false}>
        <View style={styles.center}>
          {/* Header */}
          <View style={styles.section}>
            <Button title="← BACK TO GAMES" size="sm" variant="text" onPress={() => router.back()} />
            <ThemedText type="heroDisplay" style={styles.title}>
              CHRONOSEARCH
            </ThemedText>
            <ThemedText type="editorialLead" themeColor="textSecondary">
              Hunt through history. Explore word search puzzles organized by decade and exact year to uncover authentic primary evidence.
            </ThemedText>
          </View>

          <HairlineDivider verticalMargin="md" />

          {/* Decade Selector */}
          <View style={styles.section}>
            <ThemedText type="annotation" themeColor="textMuted">
              SELECT DECADE
            </ThemedText>
            <View style={styles.decadeRow}>
              {decades.map((d) => {
                const isSelected = d.decade === selectedDecade;
                return (
                  <Pressable
                    key={d.decade}
                    onPress={() => setSelectedDecade(d.decade)}
                    style={[
                      styles.decadeChip,
                      {
                        backgroundColor: isSelected ? theme.primary : theme.card,
                        borderColor: isSelected ? theme.primary : theme.cardBorder,
                      },
                    ]}>
                    <ThemedText
                      type="smallBold"
                      style={{ color: isSelected ? '#FFFFFF' : theme.text }}>
                      {d.displayLabel}
                    </ThemedText>
                  </Pressable>
                );
              })}
            </View>

            {activeDecadeGroup ? (
              <ThemedText type="caption" themeColor="textSecondary" style={styles.decadeSummary}>
                {activeDecadeGroup.summary}
              </ThemedText>
            ) : null}
          </View>

          {/* Year & Puzzle Cards */}
          <View style={[styles.section, { marginTop: Spacing.two }]}>
            <ThemedText type="annotation" themeColor="textMuted">
              PUZZLES BY YEAR IN THE {activeDecadeGroup?.displayLabel}
            </ThemedText>
            <View style={styles.list}>
              {puzzlesForDecade.map((puzzle) => (
                <EditorialCard
                  key={puzzle.id}
                  variant="default"
                  onPress={() => router.push(`/game/chronosearch/${puzzle.id}`)}>
                  <View style={styles.cardHeaderRow}>
                    <AnnotationTag
                      label={puzzle.year ? `YEAR ${puzzle.year}` : `${activeDecadeGroup.displayLabel}`}
                      variant="discovery"
                    />
                    <ThemedText type="annotation" themeColor="textMuted">
                      {puzzle.words.length} HISTORICAL WORDS
                    </ThemedText>
                  </View>
                  <ThemedText type="cardTitle" style={[styles.cardTitle, { color: theme.primary }]}>
                    {puzzle.title}
                  </ThemedText>
                  {puzzle.description ? (
                    <ThemedText type="small" themeColor="textSecondary">
                      {puzzle.description}
                    </ThemedText>
                  ) : null}
                  <ThemedText type="smallBold" style={[styles.cta, { color: theme.secondary }]}>
                    Play {puzzle.year ? `${puzzle.year} Puzzle` : 'Puzzle'} →
                  </ThemedText>
                </EditorialCard>
              ))}
            </View>
          </View>

          <HairlineDivider verticalMargin="lg" />

          {/* Preserved Ancient/Classical Era Archive */}
          <View style={styles.section}>
            <ThemedText type="annotation" themeColor="textMuted">
              PRESERVED HISTORICAL ERA ARCHIVE
            </ThemedText>
            <ThemedText type="caption" themeColor="textMuted">
              Ancient and classical eras preserved without fabricated year metadata.
            </ThemedText>
            <View style={styles.list}>
              {PRESERVED_ERA_PUZZLES.map((puzzle) => (
                <EditorialCard
                  key={puzzle.id}
                  variant="muted"
                  onPress={() => router.push(`/game/chronosearch/${puzzle.id}`)}>
                  <View style={styles.cardHeaderRow}>
                    <AnnotationTag label="ANCIENT / CLASSICAL" variant="discovery" />
                    <ThemedText type="annotation" themeColor="textMuted">
                      {puzzle.words.length} WORDS
                    </ThemedText>
                  </View>
                  <ThemedText type="smallBold" style={[styles.cardTitle, { color: theme.primary }]}>
                    {puzzle.title}
                  </ThemedText>
                  <ThemedText type="smallBold" style={[styles.cta, { color: theme.secondary }]}>
                    Play Era Puzzle →
                  </ThemedText>
                </EditorialCard>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    alignItems: 'center',
  },
  center: {
    width: '100%',
    maxWidth: MaxContentWidth,
  },
  section: {
    paddingHorizontal: Spacing.four,
    gap: Spacing.two,
  },
  title: {
    letterSpacing: -1,
  },
  decadeRow: {
    flexDirection: 'row',
    gap: Spacing.two,
    marginTop: Spacing.one,
  },
  decadeChip: {
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  decadeSummary: {
    marginTop: Spacing.one,
    fontStyle: 'italic',
  },
  list: {
    gap: Spacing.three,
    marginTop: Spacing.two,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.two,
  },
  cardTitle: {
    marginBottom: Spacing.one,
  },
  cta: {
    marginTop: Spacing.three,
  },
});
