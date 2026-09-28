import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AkhyanaHeader } from '@/components/akhyana-header';
import { AnnotationTag } from '@/components/annotation-tag';
import { HairlineDivider } from '@/components/hairline-divider';
import { ProgressBar } from '@/components/progress-bar';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BorderRadius, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { getCompletedYears } from '@/utils/completed-years';

// Mock data for the current prototype architecture
const MOCK_PROGRESS = {
  overall: {
    xp: 2850,
    level: 4,
    nextLevelXp: 4000,
  },
  games: {
    chronosearch: {
      wordsDiscovered: 42,
      xpEarned: 1200,
      completionPercent: 65,
    },
    ludo: {
      matchesPlayed: 7,
      duelsCompleted: 15,
      xpEarned: 1650,
      completionPercent: 40,
    }
  },
  topics: [
    { id: 'ancient', name: 'Ancient India', masteryScore: 85 },
    { id: 'empires', name: 'Empires & Rulers', masteryScore: 60 },
    { id: 'architecture', name: 'Architecture & Monuments', masteryScore: 45 },
    { id: 'science', name: 'Science & Inventions', masteryScore: 70 },
    { id: 'culture', name: 'Culture & Traditions', masteryScore: 50 },
    { id: 'geography', name: 'Geography & Places', masteryScore: 30 },
  ],
  badges: [
    { id: 'chrono', name: 'Chrono Explorer', desc: 'Earned through ChronoSearch gameplay.', icon: 'TIME' },
    { id: 'hunter', name: 'History Hunter', desc: 'Earned by discovering historical words.', icon: 'HUNT' },
    { id: 'duel', name: 'Duel Scholar', desc: 'Earned through historical duels in Ludo.', icon: 'DUEL' },
    { id: 'master', name: 'Topic Master', desc: 'Earned through progress across historical topics.', icon: 'MAST' },
  ]
};

export default function ProgressScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const data = MOCK_PROGRESS;
  const [completedYearsList, setCompletedYearsList] = useState<number[]>([]);

  useEffect(() => {
    void getCompletedYears().then((years) => setCompletedYearsList(years));
  }, []);

  return (
    <ThemedView style={styles.screen}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: insets.top > 0 ? insets.top : Spacing.three,
            paddingBottom: insets.bottom + Spacing.six,
          },
        ]}
        showsVerticalScrollIndicator={false}>
        <View style={styles.centerWrapper}>
          <AkhyanaHeader showTagline={false} />

          <View style={styles.titleSection}>
            <ThemedText type="heroDisplay" style={[styles.pageTitle, { color: theme.primary }]}>
              YOUR{'\n'}MASTERY.
            </ThemedText>
            <ThemedText type="editorialLead" themeColor="textSecondary" style={styles.pageLead}>
              Play games, discover history, and build your knowledge profile.
            </ThemedText>
          </View>

          <HairlineDivider verticalMargin="md" />

          {/* YOUR PROGRESS */}
          <View style={styles.section}>
            <ThemedText type="sectionHeader" style={{ color: theme.primary }}>
              YOUR PROGRESS
            </ThemedText>

            <View style={styles.statHeroBox}>
              <ThemedText type="annotation" style={{ color: theme.accent, fontWeight: '800' }}>
                LIFETIME KNOWLEDGE EARNED
              </ThemedText>
              <ThemedText type="heroDisplay" style={[styles.largeMasteryNumber, { color: theme.primary }]}>
                {data.overall.xp}{' '}
                <ThemedText type="editorialLead" style={{ color: theme.accent, fontWeight: '900', fontSize: 28 }}>
                  XP
                </ThemedText>
              </ThemedText>
            </View>

            <View style={styles.xpSection}>
              <View style={styles.xpHeaderRow}>
                <ThemedText type="smallBold" style={{ color: theme.primary }}>
                  LEVEL {data.overall.level}
                </ThemedText>
                <ThemedText type="caption" themeColor="textMuted">
                  {data.overall.xp} / {data.overall.nextLevelXp} XP TO LEVEL {data.overall.level + 1}
                </ThemedText>
              </View>
              <ProgressBar
                progress={Math.round((data.overall.xp / data.overall.nextLevelXp) * 100)}
                colorVariant="accent"
                height={8}
              />
            </View>
          </View>

          <HairlineDivider verticalMargin="lg" />

          {/* GAME PROGRESS */}
          <View style={styles.section}>
            <ThemedText type="sectionHeader" style={{ color: theme.primary }}>
              GAME PROGRESS
            </ThemedText>

            <View style={styles.gameCardList}>
              {/* ChronoSearch */}
              <View style={[styles.gameCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
                <View style={styles.gameCardTop}>
                  <ThemedText type="cardTitle" style={{ fontSize: 18, color: theme.primary }}>
                    ChronoSearch
                  </ThemedText>
                  <AnnotationTag label={`${data.games.chronosearch.completionPercent}%`} variant="discovery" />
                </View>
                <View style={styles.gameStatsRow}>
                  <View style={styles.gameStatCol}>
                    <ThemedText type="caption" themeColor="textMuted">WORDS DISCOVERED</ThemedText>
                    <ThemedText type="smallBold" style={{ color: theme.text }}>{data.games.chronosearch.wordsDiscovered}</ThemedText>
                  </View>
                  <View style={styles.gameStatCol}>
                    <ThemedText type="caption" themeColor="textMuted">XP EARNED</ThemedText>
                    <ThemedText type="smallBold" style={{ color: theme.accent }}>+{data.games.chronosearch.xpEarned} XP</ThemedText>
                  </View>
                </View>
                <ProgressBar progress={data.games.chronosearch.completionPercent} colorVariant="discovery" height={5} />
              </View>

              {/* Ludo */}
              <View style={[styles.gameCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
                <View style={styles.gameCardTop}>
                  <ThemedText type="cardTitle" style={{ fontSize: 18, color: theme.primary }}>
                    Ludo: Legends of Civilization
                  </ThemedText>
                  <AnnotationTag label={`${data.games.ludo.completionPercent}%`} variant="action" />
                </View>
                <View style={styles.gameStatsRow}>
                  <View style={styles.gameStatCol}>
                    <ThemedText type="caption" themeColor="textMuted">MATCHES PLAYED</ThemedText>
                    <ThemedText type="smallBold" style={{ color: theme.text }}>{data.games.ludo.matchesPlayed}</ThemedText>
                  </View>
                  <View style={styles.gameStatCol}>
                    <ThemedText type="caption" themeColor="textMuted">DUELS WON</ThemedText>
                    <ThemedText type="smallBold" style={{ color: theme.text }}>{data.games.ludo.duelsCompleted}</ThemedText>
                  </View>
                  <View style={styles.gameStatCol}>
                    <ThemedText type="caption" themeColor="textMuted">XP EARNED</ThemedText>
                    <ThemedText type="smallBold" style={{ color: theme.accent }}>+{data.games.ludo.xpEarned} XP</ThemedText>
                  </View>
                </View>
                <ProgressBar progress={data.games.ludo.completionPercent} colorVariant="secondary" height={5} />
              </View>
            </View>
          </View>

          <HairlineDivider verticalMargin="lg" />

          {/* TOPIC MASTERY */}
          <View style={styles.section}>
            <View style={styles.flexBetween}>
              <ThemedText type="sectionHeader" style={{ color: theme.primary }}>
                TOPIC MASTERY
              </ThemedText>
            </View>
            <ThemedText type="small" themeColor="textSecondary">
              Historical knowledge demonstrated through gameplay and learning paths.
            </ThemedText>

            <View style={styles.topicList}>
              {data.topics.map((topic) => (
                <View
                  key={topic.id}
                  style={[styles.topicRow, { borderBottomColor: theme.cardBorder }]}>
                  <View style={styles.topicMainCol}>
                    <View style={styles.topicTitleLine}>
                      <ThemedText type="cardTitle" style={[styles.topicNameText, { color: theme.primary }]}>
                        {topic.name}
                      </ThemedText>
                      <ThemedText type="editorialHeader" style={[styles.topicPercentText, { color: theme.accent, fontWeight: '800' }]}>
                        {topic.masteryScore}%
                      </ThemedText>
                    </View>
                    <View style={styles.topicBarWrapper}>
                      <ProgressBar
                        progress={topic.masteryScore}
                        colorVariant="accent"
                        height={5}
                      />
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>

          <HairlineDivider verticalMargin="lg" />

          {/* BADGES EARNED */}
          <View style={styles.section}>
            <ThemedText type="sectionHeader" style={{ color: theme.primary }}>
              BADGES & MILESTONES
            </ThemedText>
            
            <View style={styles.badgesList}>
              {/* Dynamic Completed Year Badges */}
              {completedYearsList.map((year) => (
                <View
                  key={`year-badge-${year}`}
                  style={[
                    styles.badgeRowItem,
                    { borderBottomColor: theme.cardBorder },
                  ]}>
                  <View style={[styles.badgeIconBox, { backgroundColor: theme.accentLight }]}>
                    <ThemedText type="smallBold" style={{ color: theme.accentText }}>
                      YEAR
                    </ThemedText>
                  </View>

                  <View style={styles.badgeContentCol}>
                    <ThemedText type="cardTitle" style={{ fontSize: 18, color: theme.primary }}>
                      {year}
                    </ThemedText>
                    <ThemedText type="small" themeColor="textSecondary">
                      Completed Year · Mastered in Ludo Historical Duels
                    </ThemedText>
                  </View>
                  <AnnotationTag label="MASTERED" variant="accent" />
                </View>
              ))}

              {data.badges.map((badge) => (
                <View
                  key={badge.id}
                  style={[
                    styles.badgeRowItem,
                    { borderBottomColor: theme.cardBorder },
                  ]}>
                  <View style={[styles.badgeIconBox, { backgroundColor: theme.primaryLight }]}>
                    <ThemedText type="smallBold" style={{ color: theme.primary }}>
                      {badge.icon}
                    </ThemedText>
                  </View>

                  <View style={styles.badgeContentCol}>
                    <ThemedText type="cardTitle" style={{ fontSize: 18, color: theme.primary }}>
                      {badge.name}
                    </ThemedText>
                    <ThemedText type="small" themeColor="textSecondary">
                      {badge.desc}
                    </ThemedText>
                  </View>
                  <AnnotationTag label="EARNED" variant="highlight" />
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  scrollView: { flex: 1 },
  scrollContent: { alignItems: 'center' },
  centerWrapper: { width: '100%', maxWidth: MaxContentWidth },
  titleSection: { paddingHorizontal: Spacing.four, paddingTop: Spacing.three, gap: Spacing.two },
  pageTitle: { letterSpacing: -1 },
  pageLead: { marginTop: Spacing.one },
  section: { paddingHorizontal: Spacing.four, gap: Spacing.three },
  statHeroBox: { gap: Spacing.one, paddingVertical: Spacing.two },
  largeMasteryNumber: { fontSize: 54, lineHeight: 58, fontWeight: '900', letterSpacing: -2 },
  xpSection: { gap: Spacing.one, marginTop: Spacing.one },
  xpHeaderRow: { flexDirection: 'row', justifyContent: 'space-between' },
  
  gameCardList: { gap: Spacing.three, marginTop: Spacing.one },
  gameCard: { borderWidth: 1, borderRadius: BorderRadius.md, padding: Spacing.four, gap: Spacing.three },
  gameCardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  gameStatsRow: { flexDirection: 'row', gap: Spacing.three, marginVertical: Spacing.one },
  gameStatCol: { flex: 1, gap: 2 },
  
  flexBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  topicList: { marginTop: Spacing.one },
  topicRow: { paddingVertical: Spacing.three, borderBottomWidth: 1 },
  topicMainCol: { gap: Spacing.one },
  topicTitleLine: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  topicNameText: { fontSize: 17 },
  topicPercentText: { fontSize: 22, lineHeight: 26 },
  topicBarWrapper: { marginTop: 6 },
  
  badgesList: { marginTop: Spacing.one },
  badgeRowItem: { flexDirection: 'row', paddingVertical: Spacing.four, borderBottomWidth: 1, gap: Spacing.three, alignItems: 'center' },
  badgeIconBox: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  badgeContentCol: { flex: 1, gap: 2 },
});
