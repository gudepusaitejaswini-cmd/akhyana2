import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AkhyanaHeader } from '@/components/akhyana-header';
import { AnnotationTag } from '@/components/annotation-tag';
import { Button } from '@/components/button';
import { HairlineDivider } from '@/components/hairline-divider';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BorderRadius, BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import {
  AajCategory,
  AajKaAkhyanaEvent,
  formatMonthDayLabel,
  getAllAvailableDates,
  getEventsForDate,
  getTodayDate,
} from '@/data/daily-history';
import { AajEventCard, CATEGORY_ICONS } from '@/components/daily-history/aaj-event-card';
import { AajEventModal } from '@/components/daily-history/aaj-event-modal';
import { useTheme } from '@/hooks/use-theme';

const ALL_CATEGORIES: ('All' | AajCategory)[] = [
  'All',
  'Battles',
  'Movements',
  'Reforms & Laws',
  'Political History',
  'Culture & Heritage',
  'Discoveries',
  'Historical Figures',
  'Treaties & Agreements',
  'Archaeology',
];

export default function AajKaAkhyanaScreen() {
  const router = useRouter();
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const today = getTodayDate();
  const [selectedMonth, setSelectedMonth] = useState<number>(today.month);
  const [selectedDay, setSelectedDay] = useState<number>(today.day);
  const [selectedCategory, setSelectedCategory] = useState<'All' | AajCategory>('All');
  const [activeModalEvent, setActiveModalEvent] = useState<AajKaAkhyanaEvent | null>(null);

  // Available dates for quick switching
  const availableDates = useMemo(() => getAllAvailableDates(), []);

  // Events for selected date
  const eventsForSelectedDate = useMemo(
    () => getEventsForDate(selectedMonth, selectedDay),
    [selectedMonth, selectedDay]
  );

  // Filtered by category
  const filteredEvents = useMemo(() => {
    if (selectedCategory === 'All') return eventsForSelectedDate;
    return eventsForSelectedDate.filter((e) => e.category === selectedCategory);
  }, [eventsForSelectedDate, selectedCategory]);

  const isTodaySelected = selectedMonth === today.month && selectedDay === today.day;
  const selectedDateLabel = isTodaySelected
    ? today.displayString
    : `${formatMonthDayLabel(selectedMonth, selectedDay)} ${today.year}`;

  const handleSelectDate = (month: number, day: number) => {
    setSelectedMonth(month);
    setSelectedDay(day);
    setSelectedCategory('All');
  };

  const handleTestEmptyDate = () => {
    // 29 September currently has 0 events in the curated database
    setSelectedMonth(9);
    setSelectedDay(29);
    setSelectedCategory('All');
  };

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
          <AkhyanaHeader showTagline={false} subtitle="AAJ KA AKHYANA" />

          {/* Hero Section */}
          <View style={styles.heroSection}>
            <View style={styles.heroBadgeRow}>
              <AnnotationTag label="📜 AAJ KA AKHYANA" variant="highlight" />
              <ThemedText type="annotation" style={{ color: theme.secondary, fontWeight: '800' }}>
                इतिहास में आज
              </ThemedText>
            </View>

            <ThemedText type="heroDisplay" style={[styles.mainTitle, { color: theme.primary }]}>
              {selectedDateLabel}
            </ThemedText>

            <ThemedText type="editorialLead" themeColor="textSecondary" style={styles.tagline}>
              &ldquo;History has something to tell you about this day.&rdquo;
            </ThemedText>
            <ThemedText type="caption" themeColor="textMuted">
              Discover what happened on this day in history. Every milestone is strictly verified from approved national and academic archives.
            </ThemedText>
          </View>

          <HairlineDivider verticalMargin="md" />

          {/* Date Selector Row */}
          <View style={styles.dateSelectorContainer}>
            <View style={styles.dateSelectorHeader}>
              <ThemedText type="annotation" themeColor="textMuted">
                SELECT DATE
              </ThemedText>
              {!isTodaySelected ? (
                <Pressable
                  onPress={() => handleSelectDate(today.month, today.day)}
                  style={styles.todayBtn}>
                  <ThemedText type="annotation" style={{ color: theme.secondary, fontWeight: '800' }}>
                    ↩ Jump to Today ({today.day} Sept)
                  </ThemedText>
                </Pressable>
              ) : null}
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dateChipsRow}>
              {/* Today Chip */}
              <Pressable
                onPress={() => handleSelectDate(today.month, today.day)}
                style={[
                  styles.dateChip,
                  {
                    backgroundColor: isTodaySelected ? theme.primary : theme.card,
                    borderColor: isTodaySelected ? theme.primary : theme.cardBorder,
                  },
                ]}>
                <ThemedText
                  type="smallBold"
                  style={{ color: isTodaySelected ? '#FFFFFF' : theme.text }}>
                  ⭐️ Today ({today.day} Sept)
                </ThemedText>
              </Pressable>

              {/* Other Curated Landmark Dates */}
              {availableDates
                .filter((d) => !(d.month === today.month && d.day === today.day))
                .map((d) => {
                  const isSelected = selectedMonth === d.month && selectedDay === d.day;
                  return (
                    <Pressable
                      key={d.formattedKey}
                      onPress={() => handleSelectDate(d.month, d.day)}
                      style={[
                        styles.dateChip,
                        {
                          backgroundColor: isSelected ? theme.primary : theme.card,
                          borderColor: isSelected ? theme.primary : theme.cardBorder,
                        },
                      ]}>
                      <ThemedText
                        type="smallBold"
                        style={{ color: isSelected ? '#FFFFFF' : theme.text }}>
                        {d.displayString} ({d.count})
                      </ThemedText>
                    </Pressable>
                  );
                })}

              {/* Date with 0 events button (for testing empty state) */}
              <Pressable
                onPress={handleTestEmptyDate}
                style={[
                  styles.dateChip,
                  {
                    backgroundColor: selectedMonth === 9 && selectedDay === 29 ? theme.primary : theme.backgroundElement,
                    borderColor: theme.cardBorder,
                  },
                ]}>
                <ThemedText
                  type="smallBold"
                  style={{ color: selectedMonth === 9 && selectedDay === 29 ? '#FFFFFF' : theme.textMuted }}>
                  Test Empty Date (29 Sept)
                </ThemedText>
              </Pressable>
            </ScrollView>
          </View>

          <HairlineDivider verticalMargin="md" />

          {/* Category Filter Pills */}
          <View style={styles.categoryFilterContainer}>
            <ThemedText type="annotation" themeColor="textMuted">
              FILTER BY CATEGORY
            </ThemedText>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryChipsRow}>
              {ALL_CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat;
                const icon = cat === 'All' ? '🌟' : CATEGORY_ICONS[cat] || '📜';
                return (
                  <Pressable
                    key={cat}
                    onPress={() => setSelectedCategory(cat)}
                    style={[
                      styles.categoryChip,
                      {
                        backgroundColor: isSelected ? theme.primary : theme.card,
                        borderColor: isSelected ? theme.primary : theme.cardBorder,
                      },
                    ]}>
                    <ThemedText style={{ fontSize: 13, marginRight: 4 }}>{icon}</ThemedText>
                    <ThemedText
                      type="caption"
                      style={{
                        color: isSelected ? '#FFFFFF' : theme.text,
                        fontWeight: isSelected ? '800' : '600',
                      }}>
                      {cat}
                    </ThemedText>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>

          {/* Events Section */}
          <View style={styles.eventsSection}>
            <View style={styles.eventsSectionHeader}>
              <ThemedText type="sectionHeader" style={{ color: theme.primary }}>
                {isTodaySelected ? 'TODAY IN HISTORY' : `EVENTS ON ${formatMonthDayLabel(selectedMonth, selectedDay).toUpperCase()}`}
              </ThemedText>
              <ThemedText type="caption" themeColor="textMuted">
                {filteredEvents.length} {filteredEvents.length === 1 ? 'documented milestone' : 'documented milestones'}
              </ThemedText>
            </View>

            {filteredEvents.length === 0 ? (
              /* NO EVENTS AVAILABLE EMPTY STATE */
              <View
                style={[
                  styles.emptyStateContainer,
                  {
                    backgroundColor: theme.card,
                    borderColor: theme.cardBorder,
                  },
                ]}>
                <ThemedText style={{ fontSize: 32, marginBottom: Spacing.two }}>📜</ThemedText>
                <ThemedText type="editorialHeader" style={{ color: theme.primary, textAlign: 'center' }}>
                  Nothing has been added for this date yet.
                </ThemedText>
                <ThemedText type="editorialLead" themeColor="textSecondary" style={styles.emptyLead}>
                  Akhyana’s historical collection is growing. Check back tomorrow.
                </ThemedText>
                <ThemedText type="caption" themeColor="textMuted" style={{ textAlign: 'center', marginBottom: Spacing.two }}>
                  All entries must meet strict source-verification guidelines before inclusion.
                </ThemedText>
                <Button
                  title="Explore History Instead →"
                  size="md"
                  variant="action"
                  onPress={() => router.push('/explore')}
                />
              </View>
            ) : (
              filteredEvents.map((event) => (
                <AajEventCard
                  key={event.id}
                  event={event}
                  onReadMore={(e) => setActiveModalEvent(e)}
                  onExploreInternal={(route) => router.push(route as any)}
                />
              ))
            )}
          </View>
        </View>
      </ScrollView>

      {/* Detail Modal */}
      <AajEventModal
        visible={Boolean(activeModalEvent)}
        event={activeModalEvent}
        onClose={() => setActiveModalEvent(null)}
        onExploreInternal={(route) => router.push(route as any)}
      />
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
  heroSection: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    gap: Spacing.two,
  },
  heroBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  mainTitle: {
    letterSpacing: -1,
    marginTop: 4,
  },
  tagline: {
    fontStyle: 'italic',
  },
  dateSelectorContainer: {
    paddingHorizontal: Spacing.four,
    gap: Spacing.two,
  },
  dateSelectorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  todayBtn: {
    paddingVertical: 2,
    paddingHorizontal: Spacing.two,
  },
  dateChipsRow: {
    flexDirection: 'row',
    gap: Spacing.two,
    paddingVertical: Spacing.one,
  },
  dateChip: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  categoryFilterContainer: {
    paddingHorizontal: Spacing.four,
    gap: Spacing.two,
  },
  categoryChipsRow: {
    flexDirection: 'row',
    gap: Spacing.two,
    paddingVertical: Spacing.one,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  eventsSection: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.four,
    gap: Spacing.two,
  },
  eventsSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: Spacing.one,
  },
  emptyStateContainer: {
    padding: Spacing.six,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    alignItems: 'center',
    gap: Spacing.two,
    marginVertical: Spacing.four,
  },
  emptyLead: {
    textAlign: 'center',
    maxWidth: 420,
    marginTop: 4,
  },
});
