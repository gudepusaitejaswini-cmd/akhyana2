import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AnnotationTag } from '@/components/annotation-tag';
import { Button } from '@/components/button';
import { HairlineDivider } from '@/components/hairline-divider';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BorderRadius, MaxContentWidth, Spacing } from '@/constants/theme';
import { getYearsWithQuestions, hasYearQuestions } from '@/data/year-duel-questions';
import { seatsForPlayerCount } from '@/games/ludo/engine';
import { setLudoSetup } from '@/games/ludo/session';
import { LudoPlayerConfig } from '@/games/ludo/types';
import { useTheme } from '@/hooks/use-theme';

const PLAYER_COLORS = ['#243B64', '#C96B4B', '#D4A84F', '#3F7C78'];
const POPULAR_YEARS = [1950, 1951, 1952, 1953, 1954, 1955, 1956, 1957, 1958, 1959];

export default function LudoSetupScreen() {
  const router = useRouter();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [count, setCount] = useState<2 | 3 | 4>(2);
  const [selectedYear, setSelectedYear] = useState<number>(1956);
  const [customYearInput, setCustomYearInput] = useState<string>('');
  const [playerNames, setPlayerNames] = useState<string[]>(['Player 1', 'Player 2', 'Player 3', 'Player 4']);

  const seats = useMemo(() => seatsForPlayerCount(count), [count]);
  const availableYears = useMemo(() => getYearsWithQuestions(), []);

  const effectiveYear = useMemo(() => {
    const custom = parseInt(customYearInput.trim(), 10);
    if (!isNaN(custom) && custom > 0) return custom;
    return selectedYear;
  }, [customYearInput, selectedYear]);

  const yearHasQuestions = useMemo(() => hasYearQuestions(effectiveYear), [effectiveYear]);

  const handleNameChange = (text: string, index: number) => {
    setPlayerNames((prev) => {
      const copy = [...prev];
      copy[index] = text;
      return copy;
    });
  };

  const start = () => {
    const players: LudoPlayerConfig[] = seats.map((seat, index) => {
      const rawName = playerNames[index]?.trim();
      const name = rawName || `Player ${index + 1}`;
      return {
        seat,
        name,
        civilizationId: `player-${index + 1}`,
        civilizationName: name,
        color: PLAYER_COLORS[seat] ?? PLAYER_COLORS[index % PLAYER_COLORS.length],
        isAi: false,
      };
    });
    setLudoSetup(players, effectiveYear);
    router.push('/game/ludo/play');
  };

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
            <ThemedText type="heroDisplay" style={[styles.title, { color: theme.primary }]}>
              CHAUPAR
            </ThemedText>
            <ThemedText type="annotation" style={{ color: theme.secondary, fontWeight: '800' }}>
              LOCAL 2–4 PLAYER PASS-AND-PLAY
            </ThemedText>
            <ThemedText type="editorialLead" themeColor="textSecondary">
              Roll the dice to determine questions; your correct answers determine your movement distance!
            </ThemedText>
          </View>

          <HairlineDivider verticalMargin="md" />

          {/* PLAYER COUNT */}
          <View style={styles.section}>
            <ThemedText type="sectionHeader" style={{ color: theme.primary }}>HOW MANY PLAYERS?</ThemedText>
            <View style={styles.countRow}>
              {([2, 3, 4] as const).map((value) => (
                <Pressable
                  key={value}
                  onPress={() => setCount(value)}
                  style={[
                    styles.countChip,
                    {
                      backgroundColor: count === value ? theme.primaryLight : theme.card,
                      borderColor: count === value ? theme.primary : theme.cardBorder,
                    },
                  ]}>
                  <ThemedText
                    type="smallBold"
                    style={{ color: count === value ? theme.primary : theme.text }}>
                    {value} PLAYERS
                  </ThemedText>
                </Pressable>
              ))}
            </View>
          </View>

          <HairlineDivider verticalMargin="md" />

          {/* PLAYER NAMES */}
          <View style={styles.section}>
            <ThemedText type="sectionHeader" style={{ color: theme.primary }}>PLAYER NAMES</ThemedText>
            <ThemedText type="caption" themeColor="textSecondary">
              Customize display names for each player sharing this device:
            </ThemedText>

            <View style={styles.namesList}>
              {seats.map((seat, index) => {
                const color = PLAYER_COLORS[seat] ?? PLAYER_COLORS[index % PLAYER_COLORS.length];
                return (
                  <View key={`name-row-${seat}`} style={[styles.nameRowItem, { backgroundColor: theme.card, borderColor: theme.border }]}>
                    <View style={[styles.colorDot, { backgroundColor: color }]} />
                    <ThemedText type="smallBold" style={{ width: 70, color: theme.primary }}>
                      Player {index + 1}:
                    </ThemedText>
                    <TextInput
                      style={[styles.nameInput, { color: theme.text }]}
                      value={playerNames[index] ?? `Player ${index + 1}`}
                      onChangeText={(t) => handleNameChange(t, index)}
                      placeholder={`Player ${index + 1}`}
                      placeholderTextColor={theme.textMuted}
                      maxLength={15}
                    />
                  </View>
                );
              })}
            </View>
          </View>

          <HairlineDivider verticalMargin="md" />

          {/* QUIZ YEAR */}
          <View style={styles.section}>
            <ThemedText type="sectionHeader" style={{ color: theme.primary }}>HISTORICAL QUIZ YEAR</ThemedText>
            <ThemedText type="caption" themeColor="textSecondary">
              All question challenges during this match will test knowledge from this year:
            </ThemedText>

            <View style={styles.yearGrid}>
              {POPULAR_YEARS.map((y) => {
                const isSelected = effectiveYear === y && !customYearInput.trim();
                const supported = availableYears.includes(y);
                return (
                  <Pressable
                    key={y}
                    onPress={() => {
                      setSelectedYear(y);
                      setCustomYearInput('');
                    }}
                    style={[
                      styles.yearChip,
                      {
                        backgroundColor: isSelected ? theme.primaryLight : theme.card,
                        borderColor: isSelected ? theme.primary : theme.cardBorder,
                      },
                    ]}>
                    <ThemedText
                      type="smallBold"
                      style={{ color: isSelected ? theme.primary : theme.text }}>
                      {y}
                    </ThemedText>
                    {supported ? (
                      <ThemedText type="annotation" style={{ color: isSelected ? theme.primary : theme.textMuted }}>
                        VERIFIED
                      </ThemedText>
                    ) : null}
                  </Pressable>
                );
              })}
            </View>

            <View style={styles.customYearRow}>
              <ThemedText type="caption" themeColor="textSecondary">Or enter year:</ThemedText>
              <TextInput
                style={[
                  styles.yearInput,
                  {
                    color: theme.text,
                    backgroundColor: theme.card,
                    borderColor: theme.border,
                  },
                ]}
                placeholder="e.g. 1956"
                placeholderTextColor={theme.textMuted}
                keyboardType="numeric"
                value={customYearInput}
                onChangeText={setCustomYearInput}
                maxLength={4}
              />
            </View>

            <View style={[styles.activeYearBadge, { backgroundColor: theme.primaryLight, borderColor: theme.primary }]}>
              <ThemedText type="smallBold" style={{ color: theme.primary }}>
                Active Quiz Year: {effectiveYear}
              </ThemedText>
              {!yearHasQuestions ? (
                <AnnotationTag label="No verified questions yet" variant="accent" />
              ) : (
                <AnnotationTag label="Ready for match" variant="highlight" />
              )}
            </View>
          </View>

          {/* START BUTTON */}
          <View style={styles.section}>
            <Button
              title="START GAME →"
              size="lg"
              variant="action"
              onPress={start}
              disabled={!yearHasQuestions}
            />
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { alignItems: 'center' },
  center: { width: '100%', maxWidth: MaxContentWidth },
  section: { paddingHorizontal: Spacing.four, gap: Spacing.two, marginBottom: Spacing.three },
  title: { letterSpacing: -1 },
  countRow: { flexDirection: 'row', gap: Spacing.two },
  countChip: {
    flex: 1,
    height: 48,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  namesList: { gap: Spacing.two, marginTop: Spacing.one },
  nameRowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.three,
    height: 48,
    gap: Spacing.two,
  },
  colorDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  nameInput: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
  },
  yearGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  yearChip: {
    width: '30%',
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    padding: Spacing.two,
    alignItems: 'center',
    gap: 2,
  },
  customYearRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two, marginTop: Spacing.two },
  yearInput: {
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
    minWidth: 100,
    fontSize: 16,
  },
  activeYearBadge: {
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    padding: Spacing.three,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.two,
  },
});
