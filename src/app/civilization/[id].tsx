import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AnnotationTag } from '@/components/annotation-tag';
import { Button } from '@/components/button';
import { HairlineDivider } from '@/components/hairline-divider';
import { NotFoundState } from '@/components/not-found-state';
import { SourceCitationBadge } from '@/components/source-citation-badge';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BorderRadius, BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { CIVILIZATIONS } from '@/data/civilizations';
import { TOPICS } from '@/data/topics';
import { useTheme } from '@/hooks/use-theme';
import { useActiveCivilization } from '@/hooks/use-active-civilization';
import { recordCivilizationExplored } from '@/services/user-progress';

export default function CivilizationDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { setActiveCivilizationId } = useActiveCivilization();

  const civilization = CIVILIZATIONS.find((c) => c.id === id);

  React.useEffect(() => {
    if (civilization) {
      recordCivilizationExplored(civilization.id);
    }
  }, [civilization]);

  if (!civilization) return <NotFoundState />;
  const civilizationTopics = TOPICS.filter((t) => t.civilizationId === civilization.id);

  return (
    <ThemedView style={styles.screen}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: insets.top > 0 ? insets.top : Spacing.four,
            paddingBottom: insets.bottom + BottomTabInset + Spacing.seven,
          },
        ]}
        showsVerticalScrollIndicator={false}>
        <View style={styles.centerWrapper}>
          {/* Top Bar */}
          <View style={styles.topNavRow}>
            <Button
              title="← BACK TO ARCHIVES"
              size="sm"
              variant="text"
              onPress={() => router.back()}
            />
            <SourceCitationBadge sources={civilization.sources} />
          </View>

          {/* Hero Section */}
          <View style={styles.heroSection}>
            <AnnotationTag label={civilization.period.toUpperCase()} variant="discovery" />

            <ThemedText type="heroDisplay" style={styles.title}>
              {civilization.name}
            </ThemedText>

            <ThemedText type="annotation" style={{ color: theme.accent }}>
              {civilization.timeRange} • {civilization.region}
            </ThemedText>

            <ThemedText type="editorialLead" themeColor="textSecondary" style={styles.leadText}>
              {civilization.description}
            </ThemedText>

            {civilization.status === 'active' && (
              <Button
                title="START LEARNING →"
                size="lg"
                variant="action"
                onPress={() => {
                  setActiveCivilizationId(civilization.id);
                  router.push('/');
                }}
                style={styles.startLearningButton}
              />
            )}
          </View>

          <HairlineDivider verticalMargin="md" />

          {/* Topics & Architecture in this Civilization */}
          <View style={styles.sectionContainer}>
            <ThemedText type="sectionHeader" themeColor="text">
              THE LEARNING JOURNEY ({civilizationTopics.length} STORIES)
            </ThemedText>
            <ThemedText type="caption" themeColor="textMuted">
              These stories are arranged to follow the rise and life of Harappan urban culture.
            </ThemedText>

            {civilizationTopics.length === 0 ? (
              <View style={[styles.emptyBox, { backgroundColor: theme.backgroundElement }]}>
                <ThemedText type="small" themeColor="textMuted" style={{ textAlign: 'center' }}>
                  Curated modules for this epoch are currently undergoing academic dossier verification for the SIH 2026 expansion.
                </ThemedText>
              </View>
            ) : (
              <View style={styles.topicsList}>
                {[...civilizationTopics].sort((a, b) => a.chronologicalPosition - b.chronologicalPosition).map((topic) => (
                  <Pressable
                    key={topic.id}
                    onPress={() => router.push(`/topic/${topic.id}`)}
                    style={({ pressed }) => [
                      styles.topicRowItem,
                      { borderBottomColor: theme.border },
                      pressed && styles.pressed,
                    ]}>
                    <ThemedText type="annotation" style={{ color: theme.discovery }}>
                      0{topic.chronologicalPosition}
                    </ThemedText>

                    <View style={styles.topicMainCol}>
                      <View style={styles.topicHeaderLine}>
                        <ThemedText type="cardTitle" style={[styles.topicTitle, { color: theme.primary }]}>
                          {topic.title}
                        </ThemedText>
                        <ThemedText type="annotation" style={{ color: theme.accent }}>
                          {topic.masteryPercent}%
                        </ThemedText>
                      </View>

                      <ThemedText type="default" themeColor="textSecondary" style={styles.topicDesc}>
                        {topic.shortDescription}
                      </ThemedText>

                      <ThemedText type="smallBold" style={{ color: theme.primary, marginTop: 4 }}>
                        {topic.journeyStage} →
                      </ThemedText>
                    </View>
                  </Pressable>
                ))}
              </View>
            )}
          </View>

          <HairlineDivider verticalMargin="lg" />

          {/* Accredited Evidence Section */}
          <View style={styles.sectionContainer}>
            <ThemedText type="sectionHeader" themeColor="text">
              ACCREDITED HISTORICAL EVIDENCE
            </ThemedText>

            <View style={styles.sourcesList}>
              {civilization.sources.map((src, idx) => (
                <View key={idx} style={[styles.sourceItemRow, { backgroundColor: theme.card, borderColor: theme.cardBorder, borderWidth: 1, borderRadius: BorderRadius.md, padding: Spacing.three, marginVertical: 4 }]}>
                  <ThemedText type="smallBold" style={{ color: theme.primary }}>{src.title}</ThemedText>
                  <ThemedText type="caption" themeColor="textSecondary">
                    {src.authorOrInstitution} • {src.yearOrPeriod || 'Excavation Record'}
                  </ThemedText>
                  {src.notes && (
                    <ThemedText type="caption" style={{ color: theme.discovery, fontStyle: 'italic', marginTop: 2 }}>
                      &ldquo;{src.notes}&rdquo;
                    </ThemedText>
                  )}
                </View>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    alignItems: 'center',
  },
  centerWrapper: {
    width: '100%',
    maxWidth: MaxContentWidth,
  },
  topNavRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.two,
  },
  heroSection: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    gap: Spacing.two,
  },
  title: {
    letterSpacing: -1,
    marginTop: 4,
  },
  leadText: {
    marginTop: Spacing.one,
  },
  startLearningButton: {
    marginTop: Spacing.three,
    alignSelf: 'flex-start',
  },
  sectionContainer: {
    paddingHorizontal: Spacing.four,
    gap: Spacing.two,
  },
  emptyBox: {
    padding: Spacing.five,
    borderRadius: BorderRadius.sm,
    marginTop: Spacing.two,
  },
  topicsList: {
    marginTop: Spacing.two,
  },
  topicRowItem: {
    flexDirection: 'row',
    paddingVertical: Spacing.four,
    borderBottomWidth: 1,
    gap: Spacing.three,
  },
  topicMainCol: {
    flex: 1,
    gap: 4,
  },
  topicHeaderLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  topicTitle: {
    fontSize: 18,
  },
  topicDesc: {
    lineHeight: 22,
  },
  sourcesList: {
    marginTop: Spacing.one,
  },
  sourceItemRow: {
    paddingVertical: Spacing.three,
    borderBottomWidth: 1,
    gap: 2,
  },
  pressed: {
    opacity: 0.8,
  },
});
