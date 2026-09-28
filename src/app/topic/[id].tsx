import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, View, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AnnotationTag } from '@/components/annotation-tag';
import { Button } from '@/components/button';
import { HairlineDivider } from '@/components/hairline-divider';
import { NotFoundState } from '@/components/not-found-state';
import { SourceCitationBadge } from '@/components/source-citation-badge';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { DECADES } from '@/data/decades';
import { TOPICS } from '@/data/topics';
import { useHistoricalJourney } from '@/hooks/use-active-civilization';
import { useTheme } from '@/hooks/use-theme';

export default function TopicDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { setActivePeriodId, setActiveTopicId } = useHistoricalJourney();

  const topic = TOPICS.find((t) => t.id === id);
  if (!topic) return <NotFoundState />;

  const experience = topic.experiences[0];

  // Determine a contextual back label based on whether this topic belongs to a decade.
  const parentDecade = topic.decadeId ? DECADES.find((d) => d.id === topic.decadeId) : null;
  const backLabel = parentDecade ? `← ${parentDecade.displayLabel.toUpperCase()}` : '← LEARNING JOURNEY';

  // Label for the annotation tag
  const positionLabel = topic.decadeId
    ? `${topic.category ?? 'EVENT'} · ${topic.dateDisplay}`
    : `STORY ${String(topic.chronologicalPosition).padStart(2, '0')} · ${topic.journeyStage}`;

  return (
    <ThemedView style={styles.screen}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: insets.top || Spacing.four,
            paddingBottom: insets.bottom + BottomTabInset + Spacing.six,
          },
        ]}
        showsVerticalScrollIndicator={false}>
        <View style={styles.centerWrapper}>
          {/* Top nav */}
          <View style={styles.topNav}>
            <Button title={backLabel} size="sm" variant="text" onPress={() => router.back()} />
            <SourceCitationBadge sources={topic.sources} />
          </View>

          {/* Hero */}
          <View style={styles.hero}>
            <AnnotationTag label={positionLabel} variant="discovery" />
            <ThemedText type="heroDisplay" style={styles.title}>
              {topic.title}
            </ThemedText>
            {topic.subtitle ? (
              <ThemedText type="editorialHeader" themeColor="textSecondary" style={styles.subtitle}>
                {topic.subtitle}
              </ThemedText>
            ) : null}
            <ThemedText type="annotation" style={{ color: theme.accent }}>
              {topic.era} · {topic.region}
            </ThemedText>
            <ThemedText type="editorialLead" themeColor="textSecondary">
              {topic.fullDescription}
            </ThemedText>
          </View>

          {/* Why this matters */}
          <View style={styles.section}>
            <ThemedText type="sectionHeader">Why this matters</ThemedText>
            <View
              style={[
                styles.evidenceCard,
                { backgroundColor: theme.card, borderColor: theme.cardBorder, borderWidth: 1, borderLeftColor: theme.discovery, borderLeftWidth: 4 },
              ]}>
              <ThemedText type="small" themeColor="textSecondary">
                {topic.significance}
              </ThemedText>
            </View>

            {/* Learning objectives from the linked experience */}
            {experience?.learningObjectives.map((objective, index) => (
              <View key={objective} style={styles.objective}>
                <ThemedText type="annotation" style={{ color: theme.accent }}>
                  0{index + 1}
                </ThemedText>
                <ThemedText type="small" themeColor="textSecondary">
                  {objective}
                </ThemedText>
              </View>
            ))}
          </View>

          
          {/* Subtopics List */}
          {experience && (
            <View style={styles.section}>
              <ThemedText type="sectionHeader">SUBTOPICS</ThemedText>
              
              <View style={{ gap: Spacing.two, marginTop: Spacing.one }}>
                {experience.subtopics.map((subtopic, index) => (
                  <Pressable
                    key={index}
                    onPress={() => router.push(`/experience/${experience.id}?step=${index}`)}
                    style={({ pressed }) => [
                      {
                        padding: Spacing.four,
                        borderRadius: 12,
                        borderWidth: 1,
                        borderColor: theme.cardBorder,
                        backgroundColor: theme.card,
                        gap: Spacing.one
                      },
                      pressed && { opacity: 0.7 }
                    ]}
                  >
                    <ThemedText type="annotation" style={{ color: theme.discovery }}>
                      0{index + 1}
                    </ThemedText>
                    <ThemedText type="cardTitle" style={{ fontSize: 18, color: theme.primary }}>
                      {subtopic.title}
                    </ThemedText>
                    <ThemedText type="small" themeColor="textSecondary" numberOfLines={2}>
                      {subtopic.narrative || subtopic.factualContent || 'Explore this topic in detail.'}
                    </ThemedText>
                  </Pressable>
                ))}
              </View>
            </View>
          )}


          <HairlineDivider verticalMargin="sm" />

          {/* Source notes */}
          <View style={styles.section}>
            <ThemedText type="sectionHeader">Source notes</ThemedText>
            {topic.sources.map((source) => (
              <View key={source.id} style={[styles.source, { borderBottomColor: theme.border }]}>
                <ThemedText type="smallBold">{source.title}</ThemedText>
                <ThemedText type="caption" themeColor="textSecondary">
                  {source.authorOrInstitution} · {source.yearOrPeriod}
                </ThemedText>
                {source.notes ? (
                  <ThemedText type="caption" themeColor="textMuted" style={{ fontStyle: 'italic' }}>
                    &ldquo;{source.notes}&rdquo;
                  </ThemedText>
                ) : null}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  scrollContent: { alignItems: 'center' },
  centerWrapper: { width: '100%', maxWidth: MaxContentWidth },
  topNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.two,
  },
  hero: { paddingHorizontal: Spacing.four, paddingTop: Spacing.three, gap: Spacing.two },
  title: { letterSpacing: -1.5 },
  subtitle: { fontSize: 20, lineHeight: 26 },
  section: {
    paddingHorizontal: Spacing.four,
    gap: Spacing.two,
    marginTop: Spacing.five,
  },
  evidenceCard: {
    borderLeftWidth: 3,
    padding: Spacing.four,
    borderRadius: 10,
  },
  objective: {
    flexDirection: 'row',
    gap: Spacing.three,
    alignItems: 'flex-start',
    paddingVertical: Spacing.two,
  },
  source: {
    gap: 3,
    paddingVertical: Spacing.three,
    borderBottomWidth: 1,
  },
});
