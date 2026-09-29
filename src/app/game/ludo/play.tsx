import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AnnotationTag } from '@/components/annotation-tag';
import { Button } from '@/components/button';
import { LudoDiscoveryOverlay } from '@/components/ludo/discovery-overlay';
import { HistoricalDuelCard } from '@/components/ludo/historical-duel-card';
import { LudoBoard } from '@/components/ludo/ludo-board';
import { PassDeviceCard } from '@/components/ludo/pass-device-card';
import { PlayerStatusRow } from '@/components/ludo/player-status-row';
import { QuizSummaryCard } from '@/components/ludo/quiz-summary-card';
import { TurnQuizCard } from '@/components/ludo/turn-quiz-card';
import { LudoVictoryCard } from '@/components/ludo/victory-card';
import { NotFoundState } from '@/components/not-found-state';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BorderRadius, MaxContentWidth, Spacing } from '@/constants/theme';
import { LUDO_DISCOVERIES } from '@/data/ludo';
import { getYearsWithQuestions } from '@/data/year-duel-questions';
import { legalTokenIdsWithDistance } from '@/games/ludo/engine';
import { getLudoSetup } from '@/games/ludo/session';
import { useLudoGame } from '@/hooks/use-ludo-game';
import { useTheme } from '@/hooks/use-theme';

export default function LudoPlayScreen() {
  const setup = getLudoSetup();
  return <LudoPlay players={setup} />;
}

function LudoPlay({ players }: { players: NonNullable<ReturnType<typeof getLudoSetup>> }) {
  const router = useRouter();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const game = useLudoGame(players);
  const { state } = game;
  const winner = state.players.find((player) => player.seat === state.winnerSeat);
  const attacker = state.players.find((player) => player.seat === state.pendingCapture?.attackerSeat);
  const defender = state.players.find((player) => player.seat === state.pendingCapture?.defenderSeat);
  const discovery = LUDO_DISCOVERIES.find((item) => item.id === state.pendingDiscovery?.discoveryId);

  const [showNextYearPicker, setShowNextYearPicker] = useState(false);
  const [showRulesModal, setShowRulesModal] = useState(false);
  const availableYears = useMemo(() => getYearsWithQuestions(), []);

  const hasLegalMovesForEarnedDistance = legalTokenIdsWithDistance(state, game.correctAnswersCount).length > 0;

  return (
    <ThemedView style={styles.screen}>
      <ScrollView
        scrollEnabled={true}
        bounces={false}
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: insets.top > 0 ? insets.top : Spacing.three,
            paddingBottom: insets.bottom + Spacing.six,
          },
        ]}
        showsVerticalScrollIndicator={false}>
        <View style={styles.center}>
          <View style={styles.section}>
            {/* AREA 1: Top Navigation Bar & Quiz Year Badge */}
            <View style={styles.topBar}>
              <Button title="← SETUP" size="sm" variant="text" onPress={() => router.replace('/game/ludo')} />
              <Pressable
                accessibilityRole="button"
                role="button"
                accessibilityLabel="Chaupar Rules and How to Play"
                onPress={() => setShowRulesModal(true)}
                style={({ pressed }) => [styles.rulesBtn, pressed && { opacity: 0.7 }]}>
                <ThemedText type="smallBold" style={[styles.gameTitle, { color: theme.primary }]}>
                  CHAUPAR ℹ️
                </ThemedText>
              </Pressable>
              <View style={styles.yearStatusBadge}>
                <ThemedText type="smallBold">QUIZ: {game.quizYear}</ThemedText>
                {game.quizPhase === 'retry' ? (
                  <AnnotationTag label="RETRY" variant="accent" />
                ) : game.quizPhase === 'year_complete' ? (
                  <AnnotationTag label="COMPLETED" variant="highlight" />
                ) : null}
              </View>
            </View>

            {/* Compact Player Status Row */}
            <PlayerStatusRow
              players={state.players}
              currentSeat={state.currentSeat}
              tokens={game.displayTokens}
            />

            {/* Year Completion Banner */}
            {game.quizPhase === 'year_complete' ? (
              <View style={[styles.completionBanner, { backgroundColor: theme.card, borderColor: theme.primary }]}>
                <ThemedText type="cardTitle">{game.quizYear} COMPLETED</ThemedText>
                <ThemedText type="caption" themeColor="textSecondary">
                  All questions mastered. Achievement recorded. Select the next year to continue this match.
                </ThemedText>
                <Button
                  title="SELECT NEXT YEAR"
                  size="sm"
                  onPress={() => setShowNextYearPicker(true)}
                />
              </View>
            ) : null}

            {/* VICTORY STATE */}
            {state.phase === 'complete' && winner ? (
              <LudoVictoryCard
                winner={winner}
                state={state}
                onReplay={game.reset}
                onReturnToGames={() => router.replace('/games')}
              />
            ) : (
              <>
                {/* AREA 2: Centered, Resized Ludo Board */}
                <LudoBoard
                  players={state.players}
                  tokens={game.displayTokens}
                  legalIds={game.busy ? [] : game.legalIds}
                  disabled={Boolean(game.busy || state.phase !== 'selecting')}
                  onTokenPress={game.moveToken}
                />

                {/* AREA 3 & 4: DYNAMIC PLAY PHASES */}

                {/* PHASE A: PASS THE DEVICE PRIVACY GATE */}
                {state.phase === 'pass_turn' ? (
                  <PassDeviceCard
                    currentPlayer={game.player}
                    lastSummary={game.lastTurnSummary}
                    onStartTurn={game.startPlayerTurn}
                  />
                ) : null}

                {/* PHASE B: TURN HISTORICAL QUIZ (6 questions per turn) */}
                {state.phase === 'turn_quiz' ? (
                  <TurnQuizCard
                    player={game.player}
                    questions={game.turnQuestions}
                    currentIndex={game.currentQuestionIndex}
                    correctCount={game.correctAnswersCount}
                    totalQuestions={game.questionsPerTurn}
                    selectedChoice={game.selectedChoice}
                    isSubmitted={game.isAnswerSubmitted}
                    onSelectChoice={game.selectChoice}
                    onSubmitAnswer={game.submitAnswer}
                    onNextQuestion={game.nextQuestion}
                  />
                ) : null}

                {/* PHASE C: ROUND SUMMARY & MOVEMENT STEPS EARNED */}
                {state.phase === 'quiz_summary' ? (
                  <QuizSummaryCard
                    player={game.player}
                    correctCount={game.correctAnswersCount}
                    totalQuestions={game.questionsPerTurn}
                    hasLegalMoves={hasLegalMovesForEarnedDistance}
                    onProceedToMove={game.proceedToMove}
                    onPassTurn={() => game.passTurn(0)}
                  />
                ) : null}

                {/* PHASE D: SELECTING TOKEN TO MOVE */}
                {state.phase === 'selecting' ? (
                  <View style={[styles.selectingBanner, { backgroundColor: theme.primaryLight, borderColor: theme.primary }]}>
                    <View style={styles.selectingHeader}>
                      <ThemedText style={{ fontSize: 20 }}>🏃</ThemedText>
                      <View>
                        <ThemedText type="smallBold" style={{ color: theme.primary }}>
                          MOVE YOUR TOKEN ({state.earnedSteps} {state.earnedSteps === 1 ? 'STEP' : 'STEPS'})
                        </ThemedText>
                        <ThemedText type="caption" style={{ color: theme.textSecondary }}>
                          Tap any highlighted token on the board to move it forward.
                        </ThemedText>
                      </View>
                    </View>
                  </View>
                ) : null}

                {/* PHASE F: HISTORICAL DUEL ON CAPTURE */}
                {state.phase === 'duel' && state.pendingQuestion && attacker && defender ? (
                  <HistoricalDuelCard
                    isDuelActive={true}
                    quizYear={game.quizYear}
                    question={state.pendingQuestion}
                    attacker={attacker}
                    defender={defender}
                    elapsedMs={game.duelElapsed}
                    selectedChoice={game.duelChoices.attacker}
                    result={game.duelResult}
                    onAnswer={(choice) => game.answerDuel('attacker', choice)}
                    duelsWonCount={state.duelsWon[String(game.player.seat)] ?? 0}
                    xpCount={state.xp[String(game.player.seat)] ?? 0}
                  />
                ) : null}

                <ThemedText type="caption" themeColor="textMuted" style={styles.footerHint}>
                  Safe cells are marked with star symbols. Landing on normal path cells triggers a Historical Duel!
                </ThemedText>
              </>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Next Year Selection Modal */}
      <Modal visible={showNextYearPicker} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <ThemedText type="cardTitle">Select Next Quiz Year</ThemedText>
            <ThemedText type="caption" themeColor="textSecondary">
              The current Chaupar match continues without resetting. Only the quiz question cycle will update.
            </ThemedText>
            <View style={styles.modalYearList}>
              {availableYears.map((y) => (
                <Pressable
                  key={y}
                  onPress={() => {
                    game.selectNextYear(y);
                    setShowNextYearPicker(false);
                  }}
                  style={[
                    styles.modalYearChip,
                    {
                      backgroundColor: game.quizYear === y ? theme.primaryLight : theme.background,
                      borderColor: game.quizYear === y ? theme.primary : theme.border,
                    },
                  ]}>
                  <ThemedText type="smallBold">{y}</ThemedText>
                </Pressable>
              ))}
            </View>
            <Button title="Cancel" variant="text" size="sm" onPress={() => setShowNextYearPicker(false)} />
          </View>
        </View>
      </Modal>

      {/* How to Play Chaupar Rules Modal */}
      <Modal visible={showRulesModal} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalCard, { backgroundColor: theme.card, borderColor: theme.border, maxWidth: 440 }]}>
            <ThemedText type="cardTitle">HOW TO PLAY — CHAUPAR</ThemedText>
            <ThemedText type="caption" themeColor="textSecondary">
              Answer six historical questions. Your number of correct answers determines how many spaces you can move.
            </ThemedText>
            <View style={{ gap: Spacing.two, marginVertical: Spacing.one }}>
              <ThemedText type="small">1. NO DICE: Each player turn consists of exactly 6 historical questions.</ThemedText>
              <ThemedText type="small">2. MOVEMENT: 0 correct = 0 spaces, up to 6 correct = 6 spaces.</ThemedText>
              <ThemedText type="small">3. TOKEN MOVE: After answering all 6, tap any legal token to advance.</ThemedText>
              <ThemedText type="small">4. SAFE HAVENS: Star cells protect tokens from duels.</ThemedText>
              <ThemedText type="small">5. HISTORICAL DUELS: Landing on opponent tokens triggers a timed knowledge duel.</ThemedText>
              <ThemedText type="small">6. VICTORY: Be the first to bring all 4 civilization tokens to the center.</ThemedText>
            </View>
            <Button title="Close" variant="primary" size="sm" onPress={() => setShowRulesModal(false)} />
          </View>
        </View>
      </Modal>

      {state.phase === 'discovery' && discovery ? (
        <LudoDiscoveryOverlay discovery={discovery} onContinue={game.continueDiscovery} />
      ) : null}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { alignItems: 'center', flexGrow: 1 },
  center: { width: '100%', maxWidth: MaxContentWidth, flex: 1 },
  section: { paddingHorizontal: Spacing.three, gap: Spacing.two, flex: 1 },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  rulesBtn: { paddingHorizontal: Spacing.two, paddingVertical: Spacing.one },
  gameTitle: { letterSpacing: 0.5, fontWeight: '800' },
  yearStatusBadge: { flexDirection: 'row', alignItems: 'center', gap: Spacing.one },
  completionBanner: {
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    padding: Spacing.three,
    gap: Spacing.one,
    marginVertical: Spacing.two,
  },
  guidanceCard: {
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    padding: Spacing.three,
    gap: 4,
  },
  selectingBanner: {
    borderWidth: 1.5,
    borderRadius: BorderRadius.md,
    padding: Spacing.three,
  },
  selectingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  footerHint: {
    textAlign: 'center',
    fontSize: 11,
    paddingVertical: Spacing.one,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.four,
  },
  modalCard: {
    width: '100%',
    maxWidth: 360,
    borderWidth: 1,
    borderRadius: BorderRadius.lg,
    padding: Spacing.four,
    gap: Spacing.three,
  },
  modalYearList: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  modalYearChip: {
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
  },
});
