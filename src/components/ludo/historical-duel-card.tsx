import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { BorderRadius, Spacing } from '@/constants/theme';
import { DUEL_MS } from '@/games/ludo/engine';
import { LudoDuelQuestion, LudoPlayerConfig } from '@/games/ludo/types';
import { useTheme } from '@/hooks/use-theme';

interface HistoricalDuelCardProps {
  isDuelActive: boolean;
  quizYear: number;
  question?: LudoDuelQuestion | null;
  attacker?: LudoPlayerConfig;
  defender?: LudoPlayerConfig;
  elapsedMs?: number;
  selectedChoice: number | null;
  result: string | null;
  onAnswer: (choice: number) => void;
  duelsWonCount: number;
  xpCount: number;
}

const OPTION_LETTERS = ['A', 'B', 'C', 'D'];

export function HistoricalDuelCard({
  isDuelActive,
  quizYear,
  question,
  attacker,
  defender,
  elapsedMs = 0,
  selectedChoice,
  result,
  onAnswer,
  duelsWonCount,
  xpCount,
}: HistoricalDuelCardProps) {
  const theme = useTheme();

  // ----- State A: No Duel Active (Compact Guidance Card) -----
  if (!isDuelActive || !question || !attacker || !defender) {
    return (
      <View style={[styles.compactCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
        <View style={styles.compactHeaderRow}>
          <View style={styles.tagRow}>
            <ThemedText style={styles.duelIcon}>⚔️</ThemedText>
            <ThemedText type="smallBold" style={{ color: theme.primary }}>
              HISTORICAL DUEL · YEAR {quizYear}
            </ThemedText>
          </View>
          <ThemedText type="caption" style={{ color: theme.secondary, fontWeight: '700' }}>
            DUELS WON: {duelsWonCount}
          </ThemedText>
        </View>

        <ThemedText type="caption" style={{ color: theme.textSecondary, lineHeight: 18 }}>
          Landing on an opponent's token triggers a historical challenge. Answer correctly to capture them!
        </ThemedText>
      </View>
    );
  }

  // ----- State B & C: Duel Active / Answer Selected -----
  const remainingSeconds = Math.max(0, Math.ceil((DUEL_MS - elapsedMs) / 1000));
  const isAttackerHuman = !attacker.isAi;
  const isDefenderHuman = !defender.isAi;
  const canAnswer = (isAttackerHuman || isDefenderHuman) && selectedChoice === null && !result;

  const duelSubtitle = attacker.seat === 0
    ? `You landed on ${defender.name}! Answer correctly to capture them.`
    : defender.seat === 0
    ? `${attacker.name} challenged your token! Defend your position.`
    : `${attacker.name} landed on ${defender.name}!`;

  return (
    <View
      style={[
        styles.duelCard,
        {
          backgroundColor: '#FFFDF7', // Soft Ivory
          borderColor: theme.secondary, // Terracotta #C96B4B
        },
      ]}>
      {/* 1. Header with Title and Countdown Timer */}
      <View style={styles.duelHeaderRow}>
        <View style={styles.duelTitleGroup}>
          <ThemedText style={styles.duelIcon}>⚔️</ThemedText>
          <View>
            <ThemedText type="smallBold" style={{ color: theme.primary, letterSpacing: 0.5 }}>
              HISTORICAL DUEL · {quizYear}
            </ThemedText>
            <ThemedText type="caption" style={{ color: theme.textSecondary }}>
              {duelSubtitle}
            </ThemedText>
          </View>
        </View>

        <View
          style={[
            styles.timerPill,
            {
              backgroundColor: remainingSeconds <= 3 ? '#FDE8E8' : theme.primaryLight,
              borderColor: remainingSeconds <= 3 ? '#E02424' : theme.primary,
            },
          ]}>
          <ThemedText
            type="annotation"
            style={{
              color: remainingSeconds <= 3 ? '#E02424' : theme.primary,
              fontWeight: '900',
            }}>
            ⏱ {remainingSeconds.toString().padStart(2, '0')}s
          </ThemedText>
        </View>
      </View>

      {/* 2. Opponents vs Row */}
      <View style={[styles.vsRow, { backgroundColor: theme.backgroundElement }]}>
        <View style={styles.combatant}>
          <View style={[styles.playerDot, { backgroundColor: attacker.color }]} />
          <ThemedText type="smallBold" style={{ color: theme.primary }}>
            {attacker.name}
          </ThemedText>
          <View style={[styles.roleBadge, { backgroundColor: theme.secondary + '20' }]}>
            <ThemedText type="annotation" style={{ color: theme.secondary, fontWeight: '800' }}>
              ATTACK
            </ThemedText>
          </View>
        </View>

        <ThemedText type="annotation" style={{ color: theme.textMuted, fontWeight: '900' }}>
          VS
        </ThemedText>

        <View style={styles.combatant}>
          <View style={[styles.playerDot, { backgroundColor: defender.color }]} />
          <ThemedText type="smallBold" style={{ color: theme.primary }}>
            {defender.name}
          </ThemedText>
          <View style={[styles.roleBadge, { backgroundColor: theme.discovery + '20' }]}>
            <ThemedText type="annotation" style={{ color: theme.discovery, fontWeight: '800' }}>
              DEFEND
            </ThemedText>
          </View>
        </View>
      </View>

      {/* 3. Question Prompt */}
      <View style={styles.questionBox}>
        <ThemedText type="editorialHeader" style={[styles.questionText, { color: theme.text }]}>
          {question.question}
        </ThemedText>
      </View>

      {/* 4. Instant Result Feedback Banner (State C) */}
      {result ? (
        <View
          style={[
            styles.resultBanner,
            {
              backgroundColor: result.includes('✓')
                ? '#DEF7EC'
                : result.includes('✕')
                ? '#FDE8E8'
                : theme.primaryLight,
              borderColor: result.includes('✓')
                ? '#0E9F6E'
                : result.includes('✕')
                ? '#F05252'
                : theme.primary,
            },
          ]}>
          <ThemedText
            type="smallBold"
            style={{
              color: result.includes('✓')
                ? '#03543F'
                : result.includes('✕')
                ? '#9B1C1C'
                : theme.primary,
              textAlign: 'center',
            }}>
            {result}
          </ThemedText>
        </View>
      ) : null}

      {/* 5. Answer Choices */}
      <View style={styles.choicesList}>
        {question.choices.map((choice, index) => {
          const isSelected = selectedChoice === index;
          const isCorrect = question.correctIndex === index;
          const showAnswerValidation = selectedChoice !== null || result !== null;

          let optionBg: string = theme.card;
          let optionBorder: string = theme.border;
          let textColor: string = theme.text;

          if (showAnswerValidation) {
            if (isCorrect) {
              optionBg = '#EDFDF5';
              optionBorder = '#0E9F6E';
              textColor = '#03543F';
            } else if (isSelected && !isCorrect) {
              optionBg = '#FDF2F2';
              optionBorder = '#F05252';
              textColor = '#9B1C1C';
            }
          } else if (isSelected) {
            optionBg = theme.primaryLight;
            optionBorder = theme.primary;
            textColor = theme.primary;
          }

          return (
            <Pressable
              key={`choice-${index}-${choice}`}
              disabled={!canAnswer}
              onPress={() => onAnswer(index)}
              style={({ pressed }) => [
                styles.choiceButton,
                {
                  backgroundColor: optionBg,
                  borderColor: optionBorder,
                  opacity: !canAnswer && !showAnswerValidation ? 0.7 : pressed ? 0.8 : 1,
                  transform: [{ scale: pressed && canAnswer ? 0.99 : 1 }],
                },
              ]}>
              <View
                style={[
                  styles.letterBadge,
                  {
                    backgroundColor: isSelected
                      ? theme.primary
                      : showAnswerValidation && isCorrect
                      ? '#0E9F6E'
                      : theme.backgroundElement,
                  },
                ]}>
                <ThemedText
                  type="annotation"
                  style={{
                    color: isSelected || (showAnswerValidation && isCorrect) ? '#FFFFFF' : theme.textSecondary,
                    fontWeight: '800',
                  }}>
                  {OPTION_LETTERS[index] ?? '•'}
                </ThemedText>
              </View>

              <ThemedText
                type="default"
                style={[
                  styles.choiceText,
                  {
                    color: textColor,
                    fontWeight: isSelected || (showAnswerValidation && isCorrect) ? '700' : '400',
                  },
                ]}>
                {choice}
              </ThemedText>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  compactCard: {
    width: '100%',
    borderWidth: 1,
    borderRadius: BorderRadius.lg,
    padding: Spacing.three,
    gap: Spacing.one,
  },
  compactHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  duelIcon: {
    fontSize: 16,
  },
  duelCard: {
    width: '100%',
    borderWidth: 2,
    borderRadius: BorderRadius.lg,
    padding: Spacing.three,
    gap: Spacing.two,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  duelHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  duelTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    flex: 1,
  },
  timerPill: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  vsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.two,
    borderRadius: BorderRadius.md,
  },
  combatant: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  playerDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  roleBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  questionBox: {
    paddingVertical: Spacing.one,
  },
  questionText: {
    fontSize: 15,
    lineHeight: 22,
  },
  resultBanner: {
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
  },
  choicesList: {
    gap: Spacing.one,
  },
  choiceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    paddingVertical: 10,
    paddingHorizontal: 12,
    minHeight: 46,
    gap: Spacing.two,
  },
  letterBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  choiceText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
});
