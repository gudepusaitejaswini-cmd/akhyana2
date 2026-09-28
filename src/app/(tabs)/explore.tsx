import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AkhyanaHeader } from '@/components/akhyana-header';
import { AnnotationTag } from '@/components/annotation-tag';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BorderRadius, BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { TIME_WINDOWS } from '@/data/historical-events';
import { useHistoricalJourney } from '@/hooks/use-active-civilization';
import { useTheme } from '@/hooks/use-theme';

export default function ExploreScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const { activeDecadeId, setActiveDecadeId } = useHistoricalJourney();
  const [query, setQuery] = useState('');
  const matchingWindows = useMemo(() => {
    const normalized = query.trim().toLowerCase().replace(/s$/, '');
    if (!normalized) return TIME_WINDOWS;
    return TIME_WINDOWS.filter((window) =>
      [window.label.toLowerCase().replace(/s$/, ''), String(window.startYear)].some((value) => value.includes(normalized)),
    );
  }, [query]);

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
          <AkhyanaHeader showTagline={false} subtitle="EXPLORE" />

          <View style={styles.hero}>
            <AnnotationTag label="HISTORICAL DISCOVERY" variant="discovery" />
            <ThemedText type="heroDisplay" style={{ color: theme.primary }}>
              EXPLORE INDIA{`\n`}THROUGH TIME.
            </ThemedText>
            <ThemedText type="editorialLead" themeColor="textSecondary">
              Uncover centuries of documented history across curated chronological windows. Select an era to explore authentic milestones and primary evidence.
            </ThemedText>
          </View>

          <View style={styles.section}>
            <ThemedText type="sectionHeader" style={{ color: theme.primary }}>
              SEARCH / YEAR / DECADE
            </ThemedText>
            <View
              style={[
                styles.search,
                { backgroundColor: theme.card, borderColor: theme.cardBorder },
              ]}>
              <ThemedText style={{ fontSize: 16, marginRight: 8, color: theme.discovery }}>
                🔍
              </ThemedText>
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder="Search a year, era, or decade (e.g. 1950s)..."
                placeholderTextColor={theme.textMuted}
                keyboardType="numbers-and-punctuation"
                autoCapitalize="none"
                autoCorrect={false}
                style={[styles.input, { color: theme.text }]}
              />
              {query.length > 0 && (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Clear time-window search"
                  hitSlop={8}
                  onPress={() => setQuery('')}
                  style={styles.clear}>
                  <ThemedText type="smallBold" style={{ color: theme.discovery }}>
                    CLEAR
                  </ThemedText>
                </Pressable>
              )}
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <ThemedText type="sectionHeader" style={{ color: theme.primary }}>
                CHRONOLOGICAL WINDOWS
              </ThemedText>
              <ThemedText type="caption" themeColor="textMuted">
                {matchingWindows.length} documented eras
              </ThemedText>
            </View>

            {matchingWindows.length === 0 ? (
              <View
                style={[
                  styles.empty,
                  { backgroundColor: theme.backgroundElement, borderColor: theme.border },
                ]}>
                <ThemedText type="cardTitle" style={{ color: theme.primary }}>
                  NO TIME WINDOW FOUND
                </ThemedText>
                <ThemedText type="small" themeColor="textSecondary">
                  Try searching 1890s, 1940s, 1950s, or 2010s.
                </ThemedText>
              </View>
            ) : (
              matchingWindows.map((window) => {
                const isSelected = activeDecadeId === window.id;
                return (
                  <Pressable
                    key={window.id}
                    onPress={() => {
                      setActiveDecadeId(window.id);
                      router.push(`/decade/${window.id}`);
                    }}
                    style={({ pressed }) => [
                      styles.card,
                      {
                        backgroundColor: isSelected ? theme.discoveryLight : theme.card,
                        borderColor: isSelected ? theme.discovery : theme.cardBorder,
                      },
                      pressed && styles.pressed,
                    ]}>
                    <View style={styles.cardHeaderRow}>
                      <AnnotationTag
                        label={`${window.startYear}–${window.endYear - 1}`}
                        variant={isSelected ? 'discovery' : 'default'}
                      />
                      <ThemedText type="annotation" style={{ color: theme.discovery }}>
                        TIMELINE ERA
                      </ThemedText>
                    </View>

                    <ThemedText type="editorialHeader" style={{ color: theme.primary }}>
                      {window.label}
                    </ThemedText>

                    <ThemedText type="small" themeColor="textSecondary">
                      {window.description}
                    </ThemedText>

                    <View style={styles.cardFooter}>
                      <ThemedText type="smallBold" style={{ color: theme.discovery }}>
                        EXPLORE ERA EVENTS →
                      </ThemedText>
                    </View>
                  </Pressable>
                );
              })
            )}
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
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: Spacing.one,
  },
  search: {
    minHeight: 52,
    borderWidth: 1,
    borderRadius: BorderRadius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: Spacing.three,
    paddingRight: Spacing.two,
  },
  input: { flex: 1, minWidth: 0, fontSize: 15, paddingVertical: Spacing.two },
  clear: { minHeight: 40, justifyContent: 'center', paddingHorizontal: Spacing.two },
  card: {
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
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardFooter: {
    paddingTop: Spacing.two,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E8E1D3',
    marginTop: Spacing.one,
  },
  empty: { borderWidth: 1, borderRadius: BorderRadius.lg, padding: Spacing.four, gap: Spacing.one },
  pressed: { opacity: 0.85, transform: [{ scale: 0.99 }] },
});
