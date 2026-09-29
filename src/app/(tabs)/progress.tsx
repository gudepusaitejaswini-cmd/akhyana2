import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AkhyanaHeader } from '@/components/akhyana-header';
import { AnnotationTag } from '@/components/annotation-tag';
import { Button } from '@/components/button';
import { HairlineDivider } from '@/components/hairline-divider';
import { ProgressBar } from '@/components/progress-bar';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BorderRadius, BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { CIVILIZATIONS } from '@/data/civilizations';
import { ARTIFACTS } from '@/data/artifacts';
import { EXPERIENCES } from '@/data/experiences';
import { useTheme } from '@/hooks/use-theme';
import {
  getAchievementsDefinitions,
  getAreasToStrengthen,
  getJourneyTimelineStatus,
  getMasteredTopicsCount,
  HISTORICAL_CATEGORIES,
  useUserProgress,
} from '@/services/user-progress';
import { getCompletedYears } from '@/utils/completed-years';

export default function ProgressScreen() {
  const router = useRouter();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { progress } = useUserProgress();

  const [completedYearsList, setCompletedYearsList] = useState<number[]>([]);

  useEffect(() => {
    void getCompletedYears().then((years) => setCompletedYearsList(years));
  }, []);

  // Mastery Calculations
  const questionsAnswered = progress.questionsAnswered;
  const correctAnswers = progress.correctAnswers;
  const overallAccuracy = questionsAnswered > 0 ? Math.round((correctAnswers / questionsAnswered) * 100) : 0;
  const { masteredCount: topicsMasteredCount, totalTopics } = getMasteredTopicsCount(progress);

  // Exploration Stats
  const exploredCivCount = progress.exploration.civilizations.length;
  const totalCivCount = CIVILIZATIONS.length; // 7

  const discoveredArtifactsCount = progress.exploration.artifacts.length;
  const totalArtifactsCount = ARTIFACTS.length; // 4

  const viewedExhibitsCount = progress.exploration.exhibitsViewed.length;
  const totalExhibitsCount = EXPERIENCES.length; // 4

  const timelineEventsCount = progress.exploration.timelineEventsViewed.length;
  const heritageVoicesCount = progress.exploration.heritageVoicesRead.length;
  const aajKaAkhyanaCount = progress.exploration.aajKaAkhyanaViewed.length;

  // Areas to strengthen
  const weakAreas = getAreasToStrengthen(progress);

  // Historical Journey Timeline
  const journeyTimeline = getJourneyTimelineStatus(progress);

  // Achievements
  const achievements = getAchievementsDefinitions(progress);

  const isBrandNewUser = questionsAnswered === 0 && exploredCivCount === 0 && viewedExhibitsCount === 0;

  return (
    <ThemedView style={styles.screen}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: insets.top > 0 ? insets.top : Spacing.three,
            paddingBottom: insets.bottom + BottomTabInset + Spacing.seven,
          },
        ]}
        showsVerticalScrollIndicator={false}>
        <View style={styles.centerWrapper}>
          <AkhyanaHeader showTagline={false} subtitle="LEARNING & DISCOVERY" />

          {/* PAGE TITLE */}
          <View style={styles.titleSection}>
            <AnnotationTag label="ACADEMIC PROFILE" variant="discovery" />
            <ThemedText type="heroDisplay" style={[styles.pageTitle, { color: theme.primary }]}>
              YOUR HISTORICAL{'\n'}JOURNEY.
            </ThemedText>
            <ThemedText type="editorialLead" themeColor="textSecondary" style={styles.pageLead}>
              Demonstrated mastery and real exploration across India’s documented epochs.
            </ThemedText>
          </View>

          <HairlineDivider verticalMargin="md" />

          {/* ================================================================ */}
          {/* SECTION 2: TOP SECTION — HISTORICAL MASTERY                      */}
          {/* ================================================================ */}
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <ThemedText type="sectionHeader" style={{ color: theme.primary }}>
                HISTORICAL MASTERY
              </ThemedText>
              <AnnotationTag
                label={questionsAnswered > 0 ? `${questionsAnswered} ASSESSED` : 'UNTESTED'}
                variant={questionsAnswered > 0 ? 'accent' : 'default'}
              />
            </View>

            {/* Prominent Mastery Indicator Hero Card */}
            <View
              style={[
                styles.masteryHeroCard,
                {
                  backgroundColor: theme.card,
                  borderColor: theme.cardBorder,
                },
              ]}>
              <View style={styles.heroCenterBlock}>
                <ThemedText type="annotation" style={{ color: theme.accentText, fontWeight: '800', letterSpacing: 1.5 }}>
                  DEMONSTRATED HISTORICAL MASTERY
                </ThemedText>

                <View style={styles.masteryDisplayRow}>
                  <ThemedText type="heroDisplay" style={[styles.largeMasteryNumber, { color: theme.primary }]}>
                    {overallAccuracy}%
                  </ThemedText>
                </View>

                <ThemedText type="small" themeColor="textSecondary" style={styles.masterySubtext}>
                  {questionsAnswered > 0
                    ? `Calculated from ${correctAnswers} correct answers out of ${questionsAnswered} verified questions.`
                    : 'Mastery reflects proven knowledge from quizzes and historical challenges.'}
                </ThemedText>
              </View>

              <HairlineDivider verticalMargin="sm" />

              {/* Supporting Statistics Grid */}
              <View style={styles.supportingStatsGrid}>
                {/* 1. Questions Answered */}
                <View style={[styles.statBox, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
                  <ThemedText type="caption" themeColor="textMuted">
                    QUESTIONS ANSWERED
                  </ThemedText>
                  <ThemedText type="cardTitle" style={[styles.statNumber, { color: theme.primary }]}>
                    {questionsAnswered}
                  </ThemedText>
                  <ThemedText type="caption" themeColor="textSecondary">
                    Total Questions
                  </ThemedText>
                </View>

                {/* 2. Correct Answers */}
                <View style={[styles.statBox, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
                  <ThemedText type="caption" themeColor="textMuted">
                    CORRECT ANSWERS
                  </ThemedText>
                  <ThemedText type="cardTitle" style={[styles.statNumber, { color: theme.success }]}>
                    {correctAnswers}
                  </ThemedText>
                  <ThemedText type="caption" themeColor="textSecondary">
                    Verified Correct
                  </ThemedText>
                </View>

                {/* 3. Overall Accuracy */}
                <View style={[styles.statBox, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
                  <ThemedText type="caption" themeColor="textMuted">
                    OVERALL ACCURACY
                  </ThemedText>
                  <ThemedText type="cardTitle" style={[styles.statNumber, { color: theme.accent }]}>
                    {overallAccuracy}%
                  </ThemedText>
                  <ThemedText type="caption" themeColor="textSecondary">
                    Success Rate
                  </ThemedText>
                </View>

                {/* 4. Topics Mastered */}
                <View style={[styles.statBox, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
                  <ThemedText type="caption" themeColor="textMuted">
                    TOPICS MASTERED
                  </ThemedText>
                  <ThemedText type="cardTitle" style={[styles.statNumber, { color: theme.discovery }]}>
                    {topicsMasteredCount} / {totalTopics}
                  </ThemedText>
                  <ThemedText type="caption" themeColor="textSecondary">
                    ≥75% Demonstrated
                  </ThemedText>
                </View>
              </View>

              {/* New User Encouragement */}
              {isBrandNewUser ? (
                <View style={[styles.newUserBox, { backgroundColor: theme.primaryLight, borderColor: theme.primary }]}>
                  <ThemedText style={{ fontSize: 24 }}>🧭</ThemedText>
                  <View style={{ flex: 1, gap: 2 }}>
                    <ThemedText type="smallBold" style={{ color: theme.primary }}>
                      Start exploring history to build your journey.
                    </ThemedText>
                    <ThemedText type="caption" style={{ color: theme.textSecondary }}>
                      Explore time windows, read research, or play Ludo to demonstrate knowledge.
                    </ThemedText>
                  </View>
                  <Button
                    title="Start Exploring →"
                    size="sm"
                    variant="action"
                    onPress={() => router.push('/explore')}
                  />
                </View>
              ) : null}
            </View>
          </View>

          <HairlineDivider verticalMargin="lg" />

          {/* ================================================================ */}
          {/* SECTION 3: 🧠 MASTERY BY HISTORICAL AREA                         */}
          {/* ================================================================ */}
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <ThemedText type="sectionHeader" style={{ color: theme.primary }}>
                🧠 MASTERY BY HISTORICAL AREA
              </ThemedText>
              <ThemedText type="caption" themeColor="textMuted">
                Demonstrated Performance
              </ThemedText>
            </View>
            <ThemedText type="small" themeColor="textSecondary">
              Calculated strictly from answered questions within each epoch. No arbitrary scores.
            </ThemedText>

            <View style={styles.categoryMasteryList}>
              {HISTORICAL_CATEGORIES.map((catName) => {
                const record = progress.categoryMastery[catName];
                const hasData = record && record.answered > 0;
                const masteryScore = hasData ? Math.round((record.correct / record.answered) * 100) : 0;

                return (
                  <View
                    key={catName}
                    style={[
                      styles.categoryCard,
                      { backgroundColor: theme.card, borderColor: theme.cardBorder },
                    ]}>
                    <View style={styles.categoryCardHeader}>
                      <View style={{ gap: 2 }}>
                        <ThemedText type="cardTitle" style={{ color: theme.primary, fontSize: 17 }}>
                          {catName}
                        </ThemedText>
                        <ThemedText type="caption" themeColor="textMuted">
                          {hasData
                            ? `${record.correct} of ${record.answered} answers verified correct`
                            : 'No quiz questions answered in this area yet'}
                        </ThemedText>
                      </View>

                      {hasData ? (
                        <ThemedText type="editorialHeader" style={{ color: theme.accent, fontWeight: '800', fontSize: 22 }}>
                          {masteryScore}%
                        </ThemedText>
                      ) : (
                        <AnnotationTag label="Start exploring" variant="default" />
                      )}
                    </View>

                    <View style={styles.categoryBarContainer}>
                      {hasData ? (
                        <ProgressBar progress={masteryScore} colorVariant="accent" height={7} />
                      ) : (
                        <View style={[styles.emptyBarTrack, { backgroundColor: theme.backgroundElement }]} />
                      )}
                    </View>
                  </View>
                );
              })}
            </View>
          </View>

          <HairlineDivider verticalMargin="lg" />

          {/* ================================================================ */}
          {/* SECTION 6: 🗺️ EXPLORATION SECTION                               */}
          {/* ================================================================ */}
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <ThemedText type="sectionHeader" style={{ color: theme.primary }}>
                🗺️ EXPLORATION
              </ThemedText>
              <AnnotationTag label="DISCOVERED" variant="discovery" />
            </View>
            <ThemedText type="small" themeColor="textSecondary">
              Authentic milestones, sources, and exhibits uncovered in your Akhyana archive.
            </ThemedText>

            <View style={styles.explorationGrid}>
              {/* 1. Civilizations */}
              <Pressable
                onPress={() => router.push('/explore')}
                style={({ pressed }) => [
                  styles.explorationCard,
                  { backgroundColor: theme.card, borderColor: theme.cardBorder },
                  pressed && styles.pressed,
                ]}>
                <ThemedText style={{ fontSize: 26 }}>🏛️</ThemedText>
                <ThemedText type="caption" themeColor="textMuted">
                  CIVILIZATIONS
                </ThemedText>
                <ThemedText type="editorialHeader" style={{ color: theme.primary }}>
                  {exploredCivCount} / {totalCivCount}
                </ThemedText>
                <ThemedText type="caption" themeColor="textSecondary">
                  Documented Cultures
                </ThemedText>
              </Pressable>

              {/* 2. Artifacts */}
              <Pressable
                onPress={() => router.push('/civilization/indus-valley')}
                style={({ pressed }) => [
                  styles.explorationCard,
                  { backgroundColor: theme.card, borderColor: theme.cardBorder },
                  pressed && styles.pressed,
                ]}>
                <ThemedText style={{ fontSize: 26 }}>🏺</ThemedText>
                <ThemedText type="caption" themeColor="textMuted">
                  ARTIFACTS
                </ThemedText>
                <ThemedText type="editorialHeader" style={{ color: theme.primary }}>
                  {discoveredArtifactsCount} / {totalArtifactsCount}
                </ThemedText>
                <ThemedText type="caption" themeColor="textSecondary">
                  Discovered Relics
                </ThemedText>
              </Pressable>

              {/* 3. Exhibits Viewed */}
              <Pressable
                onPress={() => router.push('/')}
                style={({ pressed }) => [
                  styles.explorationCard,
                  { backgroundColor: theme.card, borderColor: theme.cardBorder },
                  pressed && styles.pressed,
                ]}>
                <ThemedText style={{ fontSize: 26 }}>📜</ThemedText>
                <ThemedText type="caption" themeColor="textMuted">
                  EXHIBITS VIEWED
                </ThemedText>
                <ThemedText type="editorialHeader" style={{ color: theme.primary }}>
                  {viewedExhibitsCount} / {totalExhibitsCount}
                </ThemedText>
                <ThemedText type="caption" themeColor="textSecondary">
                  Learning Modules
                </ThemedText>
              </Pressable>

              {/* 4. Timeline Events */}
              <Pressable
                onPress={() => router.push('/explore')}
                style={({ pressed }) => [
                  styles.explorationCard,
                  { backgroundColor: theme.card, borderColor: theme.cardBorder },
                  pressed && styles.pressed,
                ]}>
                <ThemedText style={{ fontSize: 26 }}>⏳</ThemedText>
                <ThemedText type="caption" themeColor="textMuted">
                  TIMELINE EVENTS
                </ThemedText>
                <ThemedText type="editorialHeader" style={{ color: theme.primary }}>
                  {timelineEventsCount}
                </ThemedText>
                <ThemedText type="caption" themeColor="textSecondary">
                  Milestones Explored
                </ThemedText>
              </Pressable>

              {/* 5. Heritage Voices */}
              <Pressable
                onPress={() => router.push('/heritage-voices')}
                style={({ pressed }) => [
                  styles.explorationCard,
                  { backgroundColor: theme.card, borderColor: theme.cardBorder },
                  pressed && styles.pressed,
                ]}>
                <ThemedText style={{ fontSize: 26 }}>🖋️</ThemedText>
                <ThemedText type="caption" themeColor="textMuted">
                  HERITAGE VOICES
                </ThemedText>
                <ThemedText type="editorialHeader" style={{ color: theme.primary }}>
                  {heritageVoicesCount}
                </ThemedText>
                <ThemedText type="caption" themeColor="textSecondary">
                  Articles Read
                </ThemedText>
              </Pressable>

              {/* 6. Aaj Ka Akhyana */}
              <Pressable
                onPress={() => router.push('/aaj-ka-akhyana')}
                style={({ pressed }) => [
                  styles.explorationCard,
                  { backgroundColor: theme.card, borderColor: theme.cardBorder },
                  pressed && styles.pressed,
                ]}>
                <ThemedText style={{ fontSize: 26 }}>📅</ThemedText>
                <ThemedText type="caption" themeColor="textMuted">
                  AAJ KA AKHYANA
                </ThemedText>
                <ThemedText type="editorialHeader" style={{ color: theme.primary }}>
                  {aajKaAkhyanaCount}
                </ThemedText>
                <ThemedText type="caption" themeColor="textSecondary">
                  Daily Events Explored
                </ThemedText>
              </Pressable>
            </View>
          </View>

          <HairlineDivider verticalMargin="lg" />

          {/* ================================================================ */}
          {/* SECTION 7: 🏛️ YOUR JOURNEY THROUGH HISTORY (TIMELINE)            */}
          {/* ================================================================ */}
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <ThemedText type="sectionHeader" style={{ color: theme.primary }}>
                🏛️ YOUR JOURNEY THROUGH HISTORY
              </ThemedText>
              <ThemedText type="caption" themeColor="textMuted">
                Chronological Epochs
              </ThemedText>
            </View>
            <ThemedText type="small" themeColor="textSecondary">
              Your path through Indian history from Bronze Age urbanism to the modern republic.
            </ThemedText>

            {/* Visual Node-Connector Timeline */}
            <View style={[styles.timelineContainer, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
              {journeyTimeline.map((item, index) => {
                const isLast = index === journeyTimeline.length - 1;
                const nodeSymbol = item.masteryPercent !== null && item.masteryPercent >= 70 ? '●' : item.isExplored ? '◐' : '○';

                return (
                  <View key={item.id} style={styles.timelineRow}>
                    {/* Left node & connector line */}
                    <View style={styles.timelineColLeft}>
                      <View
                        style={[
                          styles.timelineNodeBox,
                          {
                            backgroundColor:
                              item.masteryPercent !== null && item.masteryPercent >= 70
                                ? theme.accent
                                : item.isExplored
                                ? theme.primary
                                : theme.backgroundElement,
                            borderColor: theme.borderStrong,
                          },
                        ]}>
                        <ThemedText style={{ color: item.isExplored ? '#FFFFFF' : theme.textMuted, fontSize: 13, fontWeight: '800' }}>
                          {nodeSymbol}
                        </ThemedText>
                      </View>
                      {!isLast ? (
                        <View style={[styles.timelineConnectorLine, { backgroundColor: theme.borderStrong }]} />
                      ) : null}
                    </View>

                    {/* Right details content */}
                    <View style={styles.timelineColRight}>
                      <View style={styles.timelineHeaderLine}>
                        <ThemedText type="cardTitle" style={{ color: theme.primary, fontSize: 17 }}>
                          {item.label}
                        </ThemedText>
                        <AnnotationTag
                          label={
                            item.masteryPercent !== null
                              ? `${item.masteryPercent}% MASTERY`
                              : item.isExplored
                              ? 'EXPLORED'
                              : 'UNEXPLORED'
                          }
                          variant={
                            item.masteryPercent !== null
                              ? 'accent'
                              : item.isExplored
                              ? 'discovery'
                              : 'default'
                          }
                        />
                      </View>

                      <ThemedText type="caption" themeColor="textMuted">
                        {item.timeRange} · {item.sublabel}
                      </ThemedText>

                      <ThemedText type="small" themeColor="textSecondary" style={{ marginTop: 2 }}>
                        {item.masteryPercent !== null
                          ? `${item.questionsAnswered} questions tested · ${item.masteryPercent}% demonstrated accuracy`
                          : item.isExplored
                          ? 'Explored in archive · Complete quizzes to establish mastery.'
                          : 'Not yet visited. Discover milestones from this period in Explore.'}
                      </ThemedText>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>

          <HairlineDivider verticalMargin="lg" />

          {/* ================================================================ */}
          {/* SECTION 8 & 9: 💡 AREAS TO STRENGTHEN & PRACTICE ACTION          */}
          {/* ================================================================ */}
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <ThemedText type="sectionHeader" style={{ color: theme.primary }}>
                💡 AREAS TO STRENGTHEN
              </ThemedText>
              <AnnotationTag label="FOCUSED REVISION" variant="highlight" />
            </View>

            {weakAreas.length > 0 ? (
              <View style={styles.weakAreasBox}>
                <ThemedText type="small" themeColor="textSecondary">
                  Categories or topics where demonstrated accuracy has room for growth.
                </ThemedText>

                <View style={styles.weakAreasList}>
                  {weakAreas.map((item) => (
                    <View
                      key={item.id}
                      style={[styles.weakItemCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
                      <View style={{ flex: 1, gap: 2 }}>
                        <ThemedText type="smallBold" style={{ color: theme.primary }}>
                          {item.name}
                        </ThemedText>
                        <ThemedText type="caption" themeColor="textMuted">
                          {item.answeredCount} question{item.answeredCount === 1 ? '' : 's'} answered
                        </ThemedText>
                      </View>

                      <View style={styles.weakItemRight}>
                        <ThemedText type="editorialHeader" style={{ color: theme.secondary, fontWeight: '800' }}>
                          {item.accuracyPercent}%
                        </ThemedText>
                        <ThemedText type="caption" themeColor="textMuted">
                          Accuracy
                        </ThemedText>
                      </View>
                    </View>
                  ))}
                </View>

                <Button
                  title="Practice These Topics →"
                  size="md"
                  variant="action"
                  onPress={() => router.push(`/practice?area=${encodeURIComponent(weakAreas[0].name)}` as any)}
                />
              </View>
            ) : (
              <View
                style={[
                  styles.emptyWeakBox,
                  { backgroundColor: theme.card, borderColor: theme.cardBorder },
                ]}>
                <ThemedText style={{ fontSize: 28 }}>🌱</ThemedText>
                <ThemedText type="cardTitle" style={{ color: theme.primary, textAlign: 'center' }}>
                  {questionsAnswered === 0
                    ? 'Answer more questions to discover areas you can strengthen.'
                    : 'Great historical consistency! All tested areas are above 70% accuracy.'}
                </ThemedText>
                <ThemedText type="small" themeColor="textSecondary" style={{ textAlign: 'center' }}>
                  {questionsAnswered === 0
                    ? 'Take quizzes in Ludo or learning modules to map out your understanding.'
                    : 'Continue challenging your recall with comprehensive practice quizzes.'}
                </ThemedText>
                <Button
                  title="Practice Question Bank →"
                  size="sm"
                  variant="secondary"
                  onPress={() => router.push('/practice' as any)}
                />
              </View>
            )}
          </View>

          <HairlineDivider verticalMargin="lg" />

          {/* ================================================================ */}
          {/* SECTION 10: 🏅 ACHIEVEMENTS                                      */}
          {/* ================================================================ */}
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <ThemedText type="sectionHeader" style={{ color: theme.primary }}>
                🏅 ACHIEVEMENTS
              </ThemedText>
              <ThemedText type="caption" themeColor="textMuted">
                Verified Milestones
              </ThemedText>
            </View>
            <ThemedText type="small" themeColor="textSecondary">
              Earned solely through genuine historical exploration and verified quiz mastery.
            </ThemedText>

            <View style={styles.achievementsList}>
              {achievements.map((ach) => (
                <View
                  key={ach.id}
                  style={[
                    styles.achievementCard,
                    {
                      backgroundColor: ach.unlocked ? theme.accentLight : theme.card,
                      borderColor: ach.unlocked ? theme.accent : theme.cardBorder,
                      opacity: ach.unlocked ? 1 : 0.75,
                    },
                  ]}>
                  <View
                    style={[
                      styles.achievementIconBox,
                      {
                        backgroundColor: ach.unlocked ? theme.accent : theme.backgroundElement,
                        borderColor: ach.unlocked ? theme.accentText : theme.border,
                      },
                    ]}>
                    <ThemedText style={{ fontSize: 24 }}>{ach.icon}</ThemedText>
                  </View>

                  <View style={styles.achievementContent}>
                    <View style={styles.achievementTitleRow}>
                      <ThemedText type="smallBold" style={{ color: theme.primary, fontSize: 16 }}>
                        {ach.title}
                      </ThemedText>
                      <AnnotationTag
                        label={ach.unlocked ? 'UNLOCKED' : 'LOCKED'}
                        variant={ach.unlocked ? 'accent' : 'default'}
                      />
                    </View>

                    <ThemedText type="small" themeColor="textSecondary">
                      {ach.description}
                    </ThemedText>

                    <View style={styles.achievementProgressBarWrapper}>
                      <ProgressBar
                        progress={ach.progressPercent}
                        colorVariant={ach.unlocked ? 'accent' : 'secondary'}
                        height={4}
                      />
                      <ThemedText type="caption" themeColor="textMuted" style={{ marginTop: 2 }}>
                        {ach.progressText}
                      </ThemedText>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Dynamic Mastered Years from Ludo Duels */}
          {completedYearsList.length > 0 ? (
            <>
              <HairlineDivider verticalMargin="lg" />
              <View style={styles.section}>
                <ThemedText type="sectionHeader" style={{ color: theme.primary }}>
                  MASTERED YEARS IN LUDO
                </ThemedText>
                <View style={styles.yearsBadgesGrid}>
                  {completedYearsList.map((year) => (
                    <View
                      key={`year-${year}`}
                      style={[styles.yearBadgeItem, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
                      <ThemedText type="smallBold" style={{ color: theme.accent, fontSize: 18 }}>
                        {year}
                      </ThemedText>
                      <AnnotationTag label="MASTERED" variant="accent" />
                    </View>
                  ))}
                </View>
              </View>
            </>
          ) : null}
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  scrollView: { flex: 1 },
  scrollContent: { alignItems: 'center' },
  centerWrapper: { width: '100%', maxWidth: MaxContentWidth, paddingHorizontal: Spacing.four },
  titleSection: { gap: Spacing.two, marginTop: Spacing.two },
  pageTitle: { fontSize: 36, lineHeight: 42, letterSpacing: -0.5 },
  pageLead: { fontSize: 16, lineHeight: 24 },
  section: { gap: Spacing.three, width: '100%' },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  masteryHeroCard: {
    padding: Spacing.four,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    gap: Spacing.three,
  },
  heroCenterBlock: {
    alignItems: 'center',
    gap: Spacing.one,
    paddingVertical: Spacing.two,
  },
  masteryDisplayRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: Spacing.one,
  },
  largeMasteryNumber: {
    fontSize: 54,
    lineHeight: 60,
    fontWeight: '900',
    letterSpacing: -1,
  },
  masterySubtext: {
    textAlign: 'center',
    maxWidth: 420,
    fontSize: 14,
    lineHeight: 20,
  },
  supportingStatsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  statBox: {
    flex: 1,
    minWidth: 140,
    padding: Spacing.three,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    gap: 4,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '800',
  },
  newUserBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.three,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    gap: Spacing.three,
    marginTop: Spacing.two,
  },
  categoryMasteryList: {
    gap: Spacing.two,
  },
  categoryCard: {
    padding: Spacing.three,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    gap: Spacing.two,
  },
  categoryCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  categoryBarContainer: {
    width: '100%',
  },
  emptyBarTrack: {
    height: 7,
    borderRadius: 4,
    width: '100%',
  },
  explorationGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  explorationCard: {
    flex: 1,
    minWidth: 145,
    padding: Spacing.three,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    gap: Spacing.one,
    alignItems: 'flex-start',
  },
  timelineContainer: {
    padding: Spacing.four,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    gap: Spacing.four,
  },
  timelineRow: {
    flexDirection: 'row',
    gap: Spacing.three,
  },
  timelineColLeft: {
    alignItems: 'center',
    width: 28,
  },
  timelineNodeBox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  timelineConnectorLine: {
    width: 2,
    flex: 1,
    marginTop: 4,
    marginBottom: -8,
  },
  timelineColRight: {
    flex: 1,
    gap: 2,
  },
  timelineHeaderLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  weakAreasBox: {
    gap: Spacing.three,
  },
  weakAreasList: {
    gap: Spacing.two,
  },
  weakItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.three,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  weakItemRight: {
    alignItems: 'flex-end',
  },
  emptyWeakBox: {
    padding: Spacing.four,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    gap: Spacing.two,
    alignItems: 'center',
  },
  achievementsList: {
    gap: Spacing.two,
  },
  achievementCard: {
    flexDirection: 'row',
    padding: Spacing.three,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    gap: Spacing.three,
    alignItems: 'flex-start',
  },
  achievementIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  achievementContent: {
    flex: 1,
    gap: 4,
  },
  achievementTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  achievementProgressBarWrapper: {
    marginTop: Spacing.one,
  },
  yearsBadgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  yearBadgeItem: {
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
});
