import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AnnotationTag } from '@/components/annotation-tag';
import { Button } from '@/components/button';
import { NotFoundState } from '@/components/not-found-state';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BorderRadius, BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { getEventsForWindow, TIME_WINDOWS } from '@/data/historical-events';
import { useHistoricalJourney } from '@/hooks/use-active-civilization';
import { useTheme } from '@/hooks/use-theme';

export default function DecadeScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const { setActiveDecadeId, setActiveEventId } = useHistoricalJourney();
  const window = TIME_WINDOWS.find((item) => item.id === id);
  if (!window) return <NotFoundState />;
  const events = getEventsForWindow(window.id);

  return <ThemedView style={styles.screen}><ScrollView contentContainerStyle={[styles.content, { paddingTop: insets.top || Spacing.four, paddingBottom: insets.bottom + BottomTabInset + Spacing.six }]} showsVerticalScrollIndicator={false}><View style={styles.wrapper}>
    <View style={styles.nav}><Button title="← EXPLORE TIME" size="sm" variant="text" onPress={() => router.back()} /></View>
    <View style={styles.hero}><AnnotationTag label="INDIA · CHRONOLOGICAL EVENTS" variant="discovery" /><ThemedText type="heroDisplay">{window.label}</ThemedText><ThemedText type="editorialLead" themeColor="textSecondary">{window.description}</ThemedText></View>
    <View style={styles.section}><ThemedText type="sectionHeader">{events.length} EVENTS</ThemedText>{events.map((event) => <Pressable key={event.id} onPress={() => { setActiveDecadeId(window.id); setActiveEventId(event.id); router.push({ pathname: '/', params: { eventId: event.id } }); }} style={({ pressed }) => [styles.event, { backgroundColor: theme.card, borderColor: theme.cardBorder }, pressed && styles.pressed]}><View style={styles.meta}><View style={[styles.yearChip, { backgroundColor: theme.discoveryLight }]}><ThemedText type="smallBold" style={{ color: theme.discovery }}>{event.year}</ThemedText></View><AnnotationTag label={event.category.toUpperCase()} variant="default" /></View><ThemedText type="cardTitle" style={{ color: theme.primary }}>{event.title}</ThemedText><ThemedText type="small" themeColor="textSecondary">{event.description}</ThemedText><ThemedText type="caption" themeColor="textMuted">{event.date} · {event.location}</ThemedText><View style={styles.actionRow}><ThemedText type="smallBold" style={{ color: theme.primary }}>OPEN IN LEARN</ThemedText><View style={[styles.actionIcon, { backgroundColor: theme.primary }]}><ThemedText type="smallBold" style={{ color: theme.primaryText }}>→</ThemedText></View></View></Pressable>)}</View>
  </View></ScrollView></ThemedView>;
}

const styles = StyleSheet.create({ screen: { flex: 1 }, content: { alignItems: 'center' }, wrapper: { width: '100%', maxWidth: MaxContentWidth }, nav: { paddingHorizontal: Spacing.four, paddingTop: Spacing.two }, hero: { paddingHorizontal: Spacing.four, paddingTop: Spacing.three, gap: Spacing.two }, section: { paddingHorizontal: Spacing.four, paddingTop: Spacing.five, gap: Spacing.three }, event: { padding: Spacing.three, gap: Spacing.one, borderWidth: 1, borderRadius: BorderRadius.lg }, meta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: Spacing.two }, yearChip: { minWidth: 54, minHeight: 32, borderRadius: BorderRadius.md, justifyContent: 'center', alignItems: 'center', paddingHorizontal: Spacing.two }, actionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: Spacing.one }, actionIcon: { width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center' }, pressed: { opacity: 0.8, transform: [{ scale: 0.99 }] } });
