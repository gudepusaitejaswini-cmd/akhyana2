import React, { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { HairlineDivider } from '@/components/hairline-divider';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BorderRadius, MaxContentWidth, Spacing } from '@/constants/theme';
import {
  formatMonthDayLabel,
  getDaysInMonth,
  getTodayDate,
  hasEventsOnDate,
  MONTH_NAMES,
  MONTH_SHORT_NAMES,
} from '@/data/daily-history';
import { useTheme } from '@/hooks/use-theme';

interface AajDatePickerModalProps {
  visible: boolean;
  selectedMonth: number;
  selectedDay: number;
  onSelectDate: (month: number, day: number) => void;
  onClose: () => void;
}

export function AajDatePickerModal({
  visible,
  selectedMonth,
  selectedDay,
  onSelectDate,
  onClose,
}: AajDatePickerModalProps) {
  const theme = useTheme();
  const today = getTodayDate();

  // Local state for browsing months inside the picker
  const [activeMonth, setActiveMonth] = useState<number>(selectedMonth);

  const daysInMonth = getDaysInMonth(activeMonth);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const handlePickDay = (day: number) => {
    onSelectDate(activeMonth, day);
    onClose();
  };

  const handleJumpToToday = () => {
    setActiveMonth(today.month);
    onSelectDate(today.month, today.day);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <ThemedView
          style={[
            styles.modalContent,
            {
              backgroundColor: theme.background,
              borderColor: theme.cardBorder,
            },
          ]}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <ThemedText style={{ fontSize: 20 }}>📅</ThemedText>
              <ThemedText type="sectionHeader" style={{ color: theme.primary }}>
                SELECT DATE
              </ThemedText>
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Close date selector"
              onPress={onClose}
              style={[styles.closeBtn, { backgroundColor: theme.card }]}>
              <ThemedText style={{ color: theme.text, fontSize: 16, fontWeight: '700' }}>✕</ThemedText>
            </Pressable>
          </View>

          <ThemedText type="caption" themeColor="textMuted">
            Pick any month and day to discover source-verified historical events from Akhyana&apos;s curated calendar.
          </ThemedText>

          <HairlineDivider verticalMargin="sm" />

          {/* Month Selection Chips */}
          <View style={styles.sectionHeaderRow}>
            <ThemedText type="annotation" themeColor="textMuted">
              MONTH
            </ThemedText>
            <ThemedText type="smallBold" style={{ color: theme.secondary }}>
              {MONTH_NAMES[activeMonth - 1]}
            </ThemedText>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.monthsRow}>
            {MONTH_SHORT_NAMES.map((name, index) => {
              const monthNum = index + 1;
              const isSelected = activeMonth === monthNum;
              return (
                <Pressable
                  key={name}
                  onPress={() => setActiveMonth(monthNum)}
                  style={[
                    styles.monthChip,
                    {
                      backgroundColor: isSelected ? theme.primary : theme.card,
                      borderColor: isSelected ? theme.primary : theme.cardBorder,
                    },
                  ]}>
                  <ThemedText
                    type="smallBold"
                    style={{
                      color: isSelected ? '#FFFFFF' : theme.text,
                      fontSize: 12,
                    }}>
                    {name}
                  </ThemedText>
                </Pressable>
              );
            })}
          </ScrollView>

          {/* Day Grid */}
          <View style={[styles.sectionHeaderRow, { marginTop: Spacing.two }]}>
            <ThemedText type="annotation" themeColor="textMuted">
              DAYS IN {MONTH_NAMES[activeMonth - 1].toUpperCase()}
            </ThemedText>
            <View style={styles.legendRow}>
              <View style={[styles.legendDot, { backgroundColor: theme.secondary }]} />
              <ThemedText type="caption" themeColor="textMuted" style={{ fontSize: 11 }}>
                Curated Events
              </ThemedText>
            </View>
          </View>

          <ScrollView style={styles.daysScroll} showsVerticalScrollIndicator={false}>
            <View style={styles.daysGrid}>
              {days.map((day) => {
                const isSelected = activeMonth === selectedMonth && day === selectedDay;
                const isCurrentToday = activeMonth === today.month && day === today.day;
                const hasEvents = hasEventsOnDate(activeMonth, day);

                return (
                  <Pressable
                    key={day}
                    onPress={() => handlePickDay(day)}
                    style={[
                      styles.dayCell,
                      {
                        backgroundColor: isSelected
                          ? theme.primary
                          : isCurrentToday
                          ? theme.backgroundElement
                          : theme.card,
                        borderColor: isSelected
                          ? theme.primary
                          : isCurrentToday
                          ? theme.secondary
                          : theme.cardBorder,
                      },
                    ]}>
                    <ThemedText
                      type="smallBold"
                      style={{
                        color: isSelected ? '#FFFFFF' : theme.text,
                        fontSize: 13,
                      }}>
                      {day}
                    </ThemedText>
                    {hasEvents ? (
                      <View
                        style={[
                          styles.eventIndicatorDot,
                          {
                            backgroundColor: isSelected ? '#FFFFFF' : theme.secondary,
                          },
                        ]}
                      />
                    ) : null}
                  </Pressable>
                );
              })}
            </View>
          </ScrollView>

          <HairlineDivider verticalMargin="sm" />

          {/* Quick Actions Footer */}
          <View style={styles.footerRow}>
            <Pressable
              onPress={handleJumpToToday}
              style={[
                styles.todayActionBtn,
                {
                  backgroundColor: theme.card,
                  borderColor: theme.cardBorder,
                },
              ]}>
              <ThemedText type="smallBold" style={{ color: theme.secondary, fontSize: 13 }}>
                ⭐️ Jump to Today ({today.day} {MONTH_SHORT_NAMES[today.month - 1]})
              </ThemedText>
            </Pressable>

            <Pressable
              onPress={onClose}
              style={[styles.doneBtn, { backgroundColor: theme.primary }]}>
              <ThemedText type="smallBold" style={{ color: '#FFFFFF', fontSize: 13 }}>
                Close
              </ThemedText>
            </Pressable>
          </View>
        </ThemedView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.four,
  },
  modalContent: {
    width: '100%',
    maxWidth: MaxContentWidth - 80,
    maxHeight: '85%',
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    padding: Spacing.four,
    gap: Spacing.two,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  monthsRow: {
    flexDirection: 'row',
    gap: Spacing.one,
    paddingVertical: Spacing.one,
  },
  monthChip: {
    paddingHorizontal: Spacing.three,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  daysScroll: {
    maxHeight: 220,
    marginTop: Spacing.one,
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    justifyContent: 'flex-start',
    paddingVertical: Spacing.one,
  },
  dayCell: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  eventIndicatorDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    position: 'absolute',
    bottom: 4,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.one,
  },
  todayActionBtn: {
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  doneBtn: {
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.four,
    borderRadius: BorderRadius.md,
  },
});
