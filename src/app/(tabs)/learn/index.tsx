import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AkhyanaHeader } from '@/components/akhyana-header';
import { AnnotationTag } from '@/components/annotation-tag';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BorderRadius, BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { getEventById } from '@/data/historical-events';
import { useHistoricalJourney } from '@/hooks/use-active-civilization';
import { useTheme } from '@/hooks/use-theme';
import { AajHomePreview } from '@/components/daily-history/aaj-home-preview';

export default function LearnScreen() {
  const { eventId } = useLocalSearchParams<{ eventId?: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const { activeEventId, setActiveEventId } = useHistoricalJourney();
  const resolvedId = eventId ?? activeEventId ?? undefined;
  const event = getEventById(resolvedId);
  useEffect(() => { if (eventId) setActiveEventId(eventId); }, [eventId, setActiveEventId]);

  if (!event) {
    return (
      <ThemedView style={styles.screen}>
        <ScrollView
          contentContainerStyle={[
            styles.content,
            {
              paddingTop: insets.top || Spacing.four,
              paddingBottom: insets.bottom + BottomTabInset + Spacing.six,
            },
          ]}
          showsVerticalScrollIndicator={false}>
          <View style={styles.wrapper}>
            <AkhyanaHeader showTagline={false} subtitle="LEARN" />
            <AajHomePreview />
            <View style={styles.empty}>
              <AnnotationTag label="HISTORICAL JOURNEY" variant="highlight" />
              <ThemedText type="heroDisplay" style={{ color: theme.primary }}>
                CHOOSE AN{`\n`}EVENT.
              </ThemedText>
              <ThemedText type="editorialLead" themeColor="textSecondary">
                Choose an event from Explore to begin learning. Your selected historical event will appear here as your active learning path.
              </ThemedText>
              <Pressable
                onPress={() => router.push('/explore')}
                style={({ pressed }) => [
                  styles.exploreButton,
                  { backgroundColor: theme.primary },
                  pressed && { opacity: 0.85, transform: [{ scale: 0.99 }] },
                ]}>
                <ThemedText type="smallBold" style={{ color: theme.primaryText }}>
                  GO TO EXPLORE →
                </ThemedText>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.screen}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: insets.top || Spacing.four,
            paddingBottom: insets.bottom + BottomTabInset + Spacing.six,
          },
        ]}
        showsVerticalScrollIndicator={false}>
        <View style={styles.wrapper}>
          <AkhyanaHeader showTagline={false} subtitle="LEARN" />
          <AajHomePreview />
          <View style={styles.hero}>
            <AnnotationTag
              label={`${event.date} · ${event.category.toUpperCase()}`}
              variant="highlight"
            />
            <ThemedText type="heroDisplay" style={{ color: theme.primary }}>
              {event.title}
            </ThemedText>
            <ThemedText type="annotation" style={{ color: theme.accent, fontWeight: '800' }}>
              📍 {event.location} · {event.region}
            </ThemedText>
            <ThemedText type="editorialLead" themeColor="textSecondary">
              {event.description}
            </ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              {event.significance}
            </ThemedText>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <ThemedText type="sectionHeader" style={{ color: theme.primary }}>
                SUBTOPICS
              </ThemedText>
              <ThemedText type="caption" themeColor="textMuted">
                10 focused lenses · planned playlists
              </ThemedText>
            </View>

            {event.subtopics.map((subtopic, index) => (
              <Pressable
                key={subtopic.id}
                onPress={() => router.push(`/learn/${event.id}/${subtopic.id}`)}
                style={({ pressed }) => [
                  styles.subtopic,
                  { backgroundColor: theme.card, borderColor: theme.cardBorder },
                  pressed && styles.pressed,
                ]}>
                <View style={styles.subtopicHeading}>
                  <View
                    style={[
                      styles.numberBadge,
                      {
                        backgroundColor:
                          index % 2 === 0 ? theme.primaryLight : theme.accentLight,
                      },
                    ]}>
                    <ThemedText
                      type="annotation"
                      style={{
                        color: index % 2 === 0 ? theme.primary : theme.accentText,
                        fontWeight: '800',
                      }}>
                      {String(index + 1).padStart(2, '0')}
                    </ThemedText>
                  </View>
                  <ThemedText type="cardTitle" style={[styles.subtopicTitle, { color: theme.primary }]}>
                    {subtopic.title}
                  </ThemedText>
                </View>

                <ThemedText type="caption" themeColor="textSecondary" numberOfLines={2}>
                  {subtopic.context}
                </ThemedText>

                <View style={styles.subtopicAction}>
                  <ThemedText type="smallBold" style={{ color: theme.secondary }}>
                    OPEN SUBTOPIC
                  </ThemedText>
                  <View style={[styles.openIcon, { backgroundColor: theme.primary }]}>
                    <ThemedText type="smallBold" style={{ color: theme.primaryText }}>
                      →
                    </ThemedText>
                  </View>
                </View>
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { alignItems: 'center' },
  wrapper: { width: '100%', maxWidth: MaxContentWidth },
  hero: { paddingHorizontal: Spacing.four, paddingTop: Spacing.four, gap: Spacing.two },
  section: { paddingHorizontal: Spacing.four, paddingTop: Spacing.six, gap: Spacing.two },
  sectionHeaderRow: { marginBottom: Spacing.one, gap: 2 },
  empty: { paddingHorizontal: Spacing.four, paddingTop: Spacing.eight, gap: Spacing.three },
  exploreButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.five,
    paddingVertical: Spacing.three,
    borderRadius: BorderRadius.lg,
    marginTop: Spacing.two,
  },
  subtopic: {
    borderWidth: 1,
    borderRadius: BorderRadius.lg,
    padding: Spacing.four,
    gap: Spacing.two,
    shadowColor: '#243B64',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  subtopicHeading: { flexDirection: 'row', alignItems: 'center', gap: Spacing.three },
  numberBadge: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subtopicTitle: { flex: 1, fontSize: 18 },
  subtopicAction: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.one,
    paddingTop: Spacing.two,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E8E1D3',
  },
  openIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: { opacity: 0.85, transform: [{ scale: 0.99 }] },
});
