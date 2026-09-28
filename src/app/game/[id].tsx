import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AnnotationTag } from '@/components/annotation-tag';
import { Button } from '@/components/button';
import { HairlineDivider } from '@/components/hairline-divider';
import { NotFoundState } from '@/components/not-found-state';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BorderRadius, BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { GAME_MODULES } from '@/data/games';
import { useTheme } from '@/hooks/use-theme';

export default function GameDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const game = GAME_MODULES.find((module) => module.id === id);

  if (!game) return <NotFoundState />;

  const loopSteps = game.learningLoop.split('→').map((part) => part.trim()).filter(Boolean);

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
          <View style={styles.topNavRow}>
            <Button title="← BACK TO GAMES" size="sm" variant="text" onPress={() => router.back()} />
            <AnnotationTag label={game.categoryLabel.toUpperCase()} variant="action" />
          </View>

          <View style={styles.heroSection}>
            <ThemedText type="heroDisplay" style={styles.title}>
              {game.name}
            </ThemedText>
            <ThemedText type="annotation" style={{ color: theme.accent }}>
              {game.subtitle.toUpperCase()}
            </ThemedText>
            <ThemedText type="editorialLead" themeColor="textSecondary" style={styles.leadText}>
              {game.description}
            </ThemedText>
          </View>

          <HairlineDivider verticalMargin="md" />

          <View style={styles.sectionContainer}>
            <ThemedText type="sectionHeader" themeColor="text">
              HOW THE CHALLENGE WORKS
            </ThemedText>
            <View style={styles.loopStepsList}>
              {loopSteps.map((title, index) => (
                <View key={title} style={styles.loopStepRow}>
                  <ThemedText type="annotation" style={{ color: theme.accent }}>
                    {String(index + 1).padStart(2, '0')}
                  </ThemedText>
                  <View style={styles.loopStepContent}>
                    <ThemedText type="cardTitle" style={styles.loopStepTitle}>
                      {title}
                    </ThemedText>
                  </View>
                </View>
              ))}
            </View>
          </View>

          <HairlineDivider verticalMargin="lg" />

          <View style={styles.sectionContainer}>
            <View
              style={[
                styles.comingSoonBox,
                { backgroundColor: theme.card, borderColor: theme.cardBorder, borderWidth: 1, borderLeftColor: theme.secondary, borderLeftWidth: 4 },
              ]}>
              <AnnotationTag
                label={game.isLocked ? 'COMING SOON' : 'AVAILABLE'}
                variant={game.isLocked ? 'accent' : 'action'}
              />
              <ThemedText type="editorialHeader">
                {game.isLocked ? 'Gameplay is next' : game.name}
              </ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                {game.gameplayPreview}
              </ThemedText>
              {game.id === 'chronosearch' ? (
                <Button title="Begin hunt →" variant="action" onPress={() => router.push('/game/chronosearch')} />
              ) : null}
              {game.id === 'ludo-legends' ? (
                <Button title="Begin match →" variant="action" onPress={() => router.push('/game/ludo')} />
              ) : null}
            </View>
          </View>
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
  topNavRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.two,
  },
  heroSection: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    gap: Spacing.two,
  },
  title: {
    letterSpacing: -1,
    marginTop: 4,
  },
  leadText: {
    marginTop: Spacing.one,
  },
  sectionContainer: {
    paddingHorizontal: Spacing.four,
    gap: Spacing.two,
  },
  loopStepsList: {
    gap: Spacing.three,
    marginTop: Spacing.two,
  },
  loopStepRow: {
    flexDirection: 'row',
    gap: Spacing.three,
    alignItems: 'flex-start',
  },
  loopStepContent: {
    flex: 1,
    gap: 2,
  },
  loopStepTitle: {
    fontSize: 16,
  },
  comingSoonBox: {
    padding: Spacing.five,
    borderLeftWidth: 3,
    gap: Spacing.two,
    borderRadius: BorderRadius.sm,
  },
});
