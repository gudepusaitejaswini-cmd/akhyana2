import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AnnotationTag } from '@/components/annotation-tag';
import { Button } from '@/components/button';
import { NotFoundState } from '@/components/not-found-state';
import { SourceCitationBadge } from '@/components/source-citation-badge';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { TOPICS } from '@/data/topics';
import { TIME_PERIODS } from '@/data/timeline';
import { useHistoricalJourney } from '@/hooks/use-active-civilization';
import { useTheme } from '@/hooks/use-theme';

export default function TimePeriodScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { setActivePeriodId, setActiveTopicId } = useHistoricalJourney();
  const period = TIME_PERIODS.find((item) => item.id === id);
  if (!period) return <NotFoundState />;
  const topics = TOPICS.filter((topic) => topic.periodId === period.id).sort((a, b) => a.chronologicalPosition - b.chronologicalPosition);

  return <ThemedView style={styles.screen}><ScrollView contentContainerStyle={[styles.content, { paddingTop: insets.top || Spacing.four, paddingBottom: insets.bottom + BottomTabInset + Spacing.six }]} showsVerticalScrollIndicator={false}><View style={styles.wrapper}>
    <View style={styles.topNav}><Button title="← INDIA TIMELINE" size="sm" variant="text" onPress={() => router.back()} /></View>
    <View style={styles.hero}><AnnotationTag label="TIME PERIOD" variant="discovery" /><ThemedText type="heroDisplay">{period.title.toUpperCase()}</ThemedText><ThemedText type="annotation" style={{ color: theme.accent }}>{period.dateDisplay}</ThemedText><ThemedText type="editorialLead" themeColor="textSecondary">{period.shortDescription}</ThemedText></View>
    <View style={styles.section}><ThemedText type="sectionHeader">Historical topics</ThemedText><ThemedText type="caption" themeColor="textMuted">Dates are shown at the level supported by the available historical record.</ThemedText>
      {topics.map((topic) => <Pressable key={topic.id} onPress={() => { setActivePeriodId(period.id); setActiveTopicId(topic.id); router.push(`/topic/${topic.id}`); }} style={({ pressed }) => [styles.topic, { backgroundColor: theme.card, borderColor: theme.cardBorder, borderWidth: 1, borderRadius: 12, padding: 14, marginVertical: 4 }, pressed && styles.pressed]}><View style={styles.date}><ThemedText type="annotation" style={{ color: theme.discovery }}>{topic.dateDisplay}</ThemedText></View><View style={styles.topicCopy}><View style={styles.topicHead}><ThemedText type="cardTitle" style={{ flex: 1, color: theme.primary }}>{topic.title}</ThemedText><SourceCitationBadge sources={topic.sources} /></View><ThemedText type="small" themeColor="textSecondary">{topic.subtitle}</ThemedText><ThemedText type="caption" themeColor="textMuted">{topic.significance}</ThemedText><ThemedText type="smallBold" style={{ color: theme.primary }}>VIEW TOPIC →</ThemedText></View></Pressable>)}
      {!topics.length && <ThemedText type="small" themeColor="textMuted">This period is being prepared as a future collection.</ThemedText>}
    </View>
  </View></ScrollView></ThemedView>;
}

const styles = StyleSheet.create({ screen: { flex: 1 }, content: { alignItems: 'center' }, wrapper: { width: '100%', maxWidth: MaxContentWidth }, topNav: { paddingHorizontal: Spacing.four, paddingTop: Spacing.two }, hero: { paddingHorizontal: Spacing.four, paddingTop: Spacing.three, gap: Spacing.two }, section: { paddingHorizontal: Spacing.four, paddingTop: Spacing.six, gap: Spacing.two }, topic: { flexDirection: 'row', gap: Spacing.three, paddingVertical: Spacing.four, borderBottomWidth: 1 }, date: { width: 92, paddingTop: 3 }, topicCopy: { flex: 1, gap: 5 }, topicHead: { flexDirection: 'row', gap: Spacing.two, alignItems: 'flex-start' }, pressed: { opacity: 0.82 } });
