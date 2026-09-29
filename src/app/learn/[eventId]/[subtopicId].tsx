import { useEffect } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AnnotationTag } from '@/components/annotation-tag';
import { Button } from '@/components/button';
import { NotFoundState } from '@/components/not-found-state';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BorderRadius, BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { getEventById } from '@/data/historical-events';
import { useTheme } from '@/hooks/use-theme';
import { recordLearnSubtopicViewed } from '@/services/user-progress';

export default function SubtopicLearningScreen() {
  const { eventId, subtopicId } = useLocalSearchParams<{ eventId: string; subtopicId: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const event = getEventById(eventId);
  const index = event?.subtopics.findIndex((item) => item.id === subtopicId) ?? -1;
  const subtopic = index >= 0 ? event?.subtopics[index] : undefined;

  useEffect(() => {
    if (subtopic?.id) {
      recordLearnSubtopicViewed(subtopic.id);
    }
  }, [subtopic?.id]);

  if (!event || !subtopic) return <NotFoundState />;
  const next = event.subtopics[index + 1];

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
          <View style={styles.nav}>
            <Button
              title="← BACK TO LEARN"
              size="sm"
              variant="text"
              onPress={() => {
                if (router.canGoBack()) {
                  router.back();
                } else {
                  router.push('/learn');
                }
              }}
            />
          </View>
          <View style={styles.hero}>
            <AnnotationTag
              label={`SUBTOPIC ${String(index + 1).padStart(2, '0')} OF ${event.subtopics.length}`}
              variant="highlight"
            />
            <ThemedText type="annotation" style={{ color: theme.accent }}>
              {event.title.toUpperCase()}
            </ThemedText>
            <ThemedText type="heroDisplay">{subtopic.title}</ThemedText>
          </View>
          <View style={styles.section}>
            <ThemedText type="sectionHeader">FACTUAL KNOWLEDGE</ThemedText>
            <ThemedText type="editorialLead" themeColor="textSecondary">
              {subtopic.factualContent}
            </ThemedText>
            <ThemedText type="sectionHeader">CONTEXT</ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              {subtopic.context}
            </ThemedText>
            <ThemedText type="sectionHeader">IMPORTANT DETAILS</ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              {subtopic.evidence}
            </ThemedText>
          </View>
          <View style={styles.section}>
            <ThemedText type="sectionHeader">VIDEO PLAYLIST</ThemedText>
            <ThemedText type="caption" themeColor="textMuted">
              Planned 2D film assets — placeholders only; no video has been supplied yet.
            </ThemedText>
            {subtopic.videos.map((video, videoIndex) => (
              <View
                key={video.id}
                style={[styles.video, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
                <View style={styles.videoHeading}>
                  <View
                    style={[
                      styles.videoNumber,
                      {
                        backgroundColor:
                          videoIndex === 0 ? theme.primary : theme.backgroundElement,
                      },
                    ]}>
                    <ThemedText
                      type="smallBold"
                      style={{ color: videoIndex === 0 ? theme.primaryText : theme.primary }}>
                      {String(video.order).padStart(2, '0')}
                    </ThemedText>
                  </View>
                  <View style={styles.videoCopy}>
                    <ThemedText type="cardTitle" style={{ color: theme.primary }}>
                      {video.title}
                    </ThemedText>
                    <ThemedText type="caption" themeColor="textSecondary">
                      {video.description}
                    </ThemedText>
                  </View>
                </View>
                <View style={styles.videoFooter}>
                  <ThemedText type="caption" themeColor="textMuted">
                    {video.duration}
                  </ThemedText>
                  <View
                    style={[
                      styles.playPill,
                      {
                        backgroundColor:
                          videoIndex === 0 ? theme.primaryLight : theme.backgroundElement,
                      },
                    ]}>
                    <ThemedText
                      type="smallBold"
                      style={{
                        color: videoIndex === 0 ? theme.primary : theme.textSecondary,
                      }}>
                      {videoIndex === 0 ? '▶ FEATURED · PLANNED' : '▶ PLANNED'}
                    </ThemedText>
                  </View>
                </View>
              </View>
            ))}
          </View>
          <View style={styles.section}>
            <ThemedText type="sectionHeader">EVIDENCE / SOURCES</ThemedText>
            {subtopic.sources.map((source) => (
              <View key={source.id} style={[styles.source, { borderBottomColor: theme.border }]}>
                <ThemedText type="smallBold">{source.title}</ThemedText>
                <ThemedText type="caption" themeColor="textSecondary">
                  {source.authorOrInstitution}
                </ThemedText>
              </View>
            ))}
          </View>
          <View
            style={[
              styles.takeaway,
              { backgroundColor: theme.primaryLight, borderLeftColor: theme.primary },
            ]}>
            <ThemedText type="annotation" style={{ color: theme.primary }}>
              KEY TAKEAWAY
            </ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              {subtopic.takeaway}
            </ThemedText>
          </View>
          {next && (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Next subtopic: ${next.title}`}
              onPress={() => router.replace(`/learn/${event.id}/${next.id}`)}
              style={[styles.next, { backgroundColor: theme.secondary }]}>
              <ThemedText type="smallBold" style={{ color: '#FFFDF7' }}>
                NEXT SUBTOPIC →
              </ThemedText>
            </Pressable>
          )}
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { alignItems: 'center' },
  wrapper: { width: '100%', maxWidth: MaxContentWidth },
  nav: { paddingHorizontal: Spacing.four, paddingTop: Spacing.two },
  hero: { paddingHorizontal: Spacing.four, paddingTop: Spacing.three, gap: Spacing.two },
  section: { paddingHorizontal: Spacing.four, paddingTop: Spacing.five, gap: Spacing.two },
  video: { borderWidth: 1, borderRadius: BorderRadius.lg, padding: Spacing.three, gap: Spacing.two },
  videoHeading: { flexDirection: 'row', gap: Spacing.two, alignItems: 'flex-start' },
  videoNumber: { height: 34, width: 34, borderRadius: BorderRadius.md, alignItems: 'center', justifyContent: 'center' },
  videoCopy: { flex: 1, minWidth: 0, gap: 3 },
  videoFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: Spacing.two },
  playPill: { borderRadius: BorderRadius.full, paddingHorizontal: Spacing.two, paddingVertical: 6 },
  source: { gap: 3, paddingVertical: Spacing.two, borderBottomWidth: 1 },
  takeaway: { marginHorizontal: Spacing.four, marginTop: Spacing.five, padding: Spacing.four, borderLeftWidth: 3, gap: Spacing.one, borderRadius: BorderRadius.md },
  next: { marginHorizontal: Spacing.four, marginTop: Spacing.four, alignSelf: 'flex-end', paddingHorizontal: Spacing.four, paddingVertical: Spacing.three, borderRadius: BorderRadius.full },
});
