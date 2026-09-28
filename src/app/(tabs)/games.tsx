import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AkhyanaHeader } from '@/components/akhyana-header';
import { AnnotationTag } from '@/components/annotation-tag';
import { Button } from '@/components/button';
import { HairlineDivider } from '@/components/hairline-divider';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BorderRadius, BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { GAME_MODULES } from '@/data/games';
import { useTheme } from '@/hooks/use-theme';

export default function GamesScreen() {
  const router = useRouter();
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const chronoSearch = GAME_MODULES.find((game) => game.id === 'chronosearch') ?? GAME_MODULES[0];
  const ludo = GAME_MODULES.find((game) => game.id === 'ludo-legends');

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
          <AkhyanaHeader showTagline={false} />

          <View style={styles.titleSection}>
            <ThemedText type="heroDisplay" style={[styles.pageTitle, { color: theme.primary }]}>
              PLAY WITH{'\n'}HISTORY.
            </ThemedText>
            <ThemedText type="editorialLead" themeColor="textSecondary" style={styles.pageLead}>
              Hunt hidden words across Indian eras, then earn XP as each discovery opens a short historical explanation.
            </ThemedText>
          </View>

          <HairlineDivider verticalMargin="md" />

          <View style={styles.philosophySection}>
            <View
              style={[
                styles.philosophyBlock,
                { backgroundColor: theme.backgroundElement, borderLeftColor: theme.secondary },
              ]}>
              <AnnotationTag label="01 — ACTIVE PLAY" variant="action" />
              <ThemedText type="editorialHeader" style={[styles.philosophyHeading, { color: theme.primary }]}>
                Search → Discover → Learn → Earn XP
              </ThemedText>
              <ThemedText type="small" themeColor="textSecondary" style={styles.philosophyBody}>
                Hold a letter, swipe the word, release. Valid paths earn score and XP; important finds include a short challenge.
              </ThemedText>
            </View>
          </View>

          <HairlineDivider verticalMargin="lg" />

          <View style={styles.featuredGameSection}>
            <View style={styles.featuredHeaderRow}>
              <AnnotationTag label="CHRONOSEARCH" variant="highlight" />
              <ThemedText type="annotation" style={{ color: theme.accent, fontWeight: '800' }}>
                SESSION XP + REWARDS
              </ThemedText>
            </View>

            <ThemedText type="heroDisplay" style={[styles.gameHeroTitle, { color: theme.primary }]}>
              HUNT THROUGH{'\n'}HISTORY.
            </ThemedText>

            <ThemedText type="annotation" style={{ color: theme.textMuted }}>
              WORD SEARCH • SOLO DISCOVERY
            </ThemedText>

            <ThemedText type="editorialLead" themeColor="textSecondary">
              {chronoSearch.description}
            </ThemedText>

            <View
              style={[
                styles.howItWorksBox,
                { backgroundColor: theme.card, borderColor: theme.cardBorder },
              ]}>
              <ThemedText type="sectionHeader" style={{ color: theme.primary }}>
                HOW IT WORKS
              </ThemedText>
              <View style={styles.stepsList}>
                {[
                  { step: '01', title: 'CHOOSE ERA', desc: 'Open a compact historical grid.' },
                  { step: '02', title: 'SWIPE TO FIND', desc: 'Hold the first letter and drag through the word.' },
                  { step: '03', title: 'DISCOVER', desc: 'Read a short sourced explanation and earn XP.' },
                  { step: '04', title: 'CHALLENGE', desc: 'Important words may ask one follow-up question.' },
                ].map((item) => (
                  <View key={item.step} style={styles.stepItem}>
                    <ThemedText type="annotation" style={{ color: theme.secondary, fontWeight: '800' }}>
                      {item.step}
                    </ThemedText>
                    <View style={styles.stepContent}>
                      <ThemedText type="smallBold" style={{ color: theme.text }}>{item.title}</ThemedText>
                      <ThemedText type="caption" themeColor="textSecondary">
                        {item.desc}
                      </ThemedText>
                    </View>
                  </View>
                ))}
              </View>
            </View>

            <Button
              title="BEGIN CHRONOSEARCH →"
              size="lg"
              variant="action"
              onPress={() => router.push('/game/chronosearch')}
            />
          </View>

          <HairlineDivider verticalMargin="lg" />

          {ludo ? (
            <View style={styles.secondaryGamesSection}>
              <ThemedText type="sectionHeader" style={{ color: theme.primary }}>
                02 — STRATEGY & HISTORICAL DUELS
              </ThemedText>
              <Pressable
                onPress={() => router.push('/game/ludo')}
                style={({ pressed }) => [
                  styles.secondaryGameRow,
                  { borderBottomColor: theme.cardBorder },
                  pressed && styles.pressed,
                ]}>
                <View style={styles.gameNumCol}>
                  <ThemedText type="annotation" style={{ color: theme.secondary, fontWeight: '800' }}>
                    02
                  </ThemedText>
                </View>
                <View style={styles.gameMainCol}>
                  <View style={styles.gameTitleLine}>
                    <ThemedText type="cardTitle" style={[styles.secGameTitle, { color: theme.primary }]}>
                      {ludo.name}
                    </ThemedText>
                    <AnnotationTag label="PLAYABLE" variant="accent" />
                  </View>
                  <ThemedText type="annotation" style={{ color: theme.secondary }}>
                    [{ludo.categoryLabel.toUpperCase()}]
                  </ThemedText>
                  <ThemedText type="small" themeColor="textSecondary" style={styles.secGameDesc}>
                    {ludo.description}
                  </ThemedText>
                  <View
                    style={[styles.gameplayLoopBox, { backgroundColor: theme.backgroundElement }]}>
                    <ThemedText type="annotation" style={{ color: theme.primary, fontWeight: '700' }}>
                      HISTORICAL DUEL MECHANIC
                    </ThemedText>
                    <ThemedText type="caption" themeColor="textSecondary">
                      {ludo.gameplayPreview}
                    </ThemedText>
                  </View>

                  <View
                    style={[
                      styles.howItWorksBox,
                      { backgroundColor: theme.card, borderColor: theme.cardBorder, marginTop: 12 },
                    ]}>
                    <ThemedText type="sectionHeader" style={{ color: theme.primary }}>
                      HOW IT WORKS
                    </ThemedText>
                    <View style={styles.stepsList}>
                      {[
                        { step: '01', title: 'CHOOSE TOPICS', desc: 'Choose the historical topics from which the game will ask questions.' },
                        { step: '02', title: 'ROLL', desc: 'Every dice roll is generated through 6 rapid-fire easy history questions.' },
                        { step: '03', title: 'ANSWER', desc: 'The player answers all 6 questions.' },
                        { step: '04', title: 'MOVE', desc: 'The number of correct answers (0–6) becomes the dice value.' },
                        { step: '05', title: 'HISTORICAL DUEL', desc: "If an attacking token lands on an opponent's token, trigger the 5-second Historical Duel." },
                        { step: '06', title: 'CAPTURE OR DEFEND', desc: 'Both players receive the same history question. The correct/fastest response determines whether the attacking player captures the token or the defender stops the attack.' },
                      ].map((item) => (
                        <View key={item.step} style={styles.stepItem}>
                          <ThemedText type="annotation" style={{ color: theme.secondary, fontWeight: '800' }}>
                            {item.step}
                          </ThemedText>
                          <View style={styles.stepContent}>
                            <ThemedText type="smallBold" style={{ color: theme.text }}>{item.title}</ThemedText>
                            <ThemedText type="caption" themeColor="textSecondary">
                              {item.desc}
                            </ThemedText>
                          </View>
                        </View>
                      ))}
                    </View>
                  </View>
                  <ThemedText type="smallBold" style={{ color: theme.secondary, marginTop: 4 }}>
                    Begin match →
                  </ThemedText>
                </View>
              </Pressable>
            </View>
          ) : null}
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
  titleSection: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    gap: Spacing.two,
  },
  pageTitle: {
    letterSpacing: -1,
  },
  pageLead: {
    marginTop: Spacing.one,
  },
  philosophySection: {
    paddingHorizontal: Spacing.four,
  },
  philosophyBlock: {
    padding: Spacing.four,
    borderLeftWidth: 3,
    gap: Spacing.one,
    borderRadius: BorderRadius.sm,
  },
  philosophyHeading: {
    fontSize: 20,
    marginTop: 2,
  },
  philosophyBody: {
    lineHeight: 20,
  },
  featuredGameSection: {
    paddingHorizontal: Spacing.four,
    gap: Spacing.two,
  },
  featuredHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  gameHeroTitle: {
    letterSpacing: -1,
    marginTop: 4,
  },
  howItWorksBox: {
    padding: Spacing.four,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    gap: Spacing.three,
    marginVertical: Spacing.two,
  },
  stepsList: {
    gap: Spacing.two,
  },
  stepItem: {
    flexDirection: 'row',
    gap: Spacing.two,
    alignItems: 'flex-start',
  },
  stepContent: {
    flex: 1,
    gap: 2,
  },
  secondaryGamesSection: {
    paddingHorizontal: Spacing.four,
    gap: Spacing.two,
  },
  secondaryGameRow: {
    flexDirection: 'row',
    paddingVertical: Spacing.four,
    borderBottomWidth: 1,
    gap: Spacing.three,
  },
  gameNumCol: {
    width: 24,
    paddingTop: 2,
  },
  gameMainCol: {
    flex: 1,
    gap: Spacing.one,
  },
  gameTitleLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    gap: Spacing.two,
  },
  secGameTitle: {
    fontSize: 18,
    flex: 1,
  },
  secGameDesc: {
    lineHeight: 20,
  },
  gameplayLoopBox: {
    padding: Spacing.two,
    borderRadius: BorderRadius.sm,
    gap: 2,
    marginTop: 4,
  },
  pressed: {
    opacity: 0.8,
  },
});
