import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { AnnotationTag } from '@/components/annotation-tag';
import { ThemedText } from '@/components/themed-text';
import { BorderRadius, Spacing } from '@/constants/theme';
import { DUEL_MS } from '@/games/ludo/engine';
import { LudoDuelQuestion, LudoPlayerConfig } from '@/games/ludo/types';
import { useTheme } from '@/hooks/use-theme';

interface LudoDuelOverlayProps {
  question: LudoDuelQuestion;
  attacker: LudoPlayerConfig;
  defender: LudoPlayerConfig;
  elapsedMs: number;
  attackerChoice: number | null;
  defenderChoice: number | null;
  result: string | null;
  onAnswer: (role: 'attacker' | 'defender', choice: number) => void;
}

export function LudoDuelOverlay({
  question,
  attacker,
  defender,
  elapsedMs,
  attackerChoice,
  defenderChoice,
  result,
  onAnswer,
}: LudoDuelOverlayProps) {
  const theme = useTheme();
  const remaining = Math.max(0, Math.ceil((DUEL_MS - elapsedMs) / 1000));

  return (
    <View style={styles.overlay}>
      <ScrollView contentContainerStyle={styles.overlayInner} bounces={false}>
      <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.accent }]}>
        <View style={styles.headerRow}>
          <AnnotationTag label="HISTORICAL DUEL · 5 SECONDS" variant="action" />
          <ThemedText type="annotation" style={{ color: theme.accent, fontWeight: '800' }}>
            HISTORICAL ENCOUNTER
          </ThemedText>
        </View>

        <View style={styles.vsRow}>
          <View style={styles.side}>
            <View style={[styles.dot, { backgroundColor: attacker.color }]} />
            <ThemedText type="smallBold" style={{ color: theme.primary }}>{attacker.name}</ThemedText>
            <ThemedText type="caption" style={{ color: theme.secondary, fontWeight: '800' }}>
              ATTACK
            </ThemedText>
          </View>
          <View style={[styles.vsBadge, { backgroundColor: theme.primaryLight }]}>
            <ThemedText type="annotation" style={{ color: theme.primary, fontWeight: '900' }}>VS</ThemedText>
          </View>
          <View style={styles.side}>
            <View style={[styles.dot, { backgroundColor: defender.color }]} />
            <ThemedText type="smallBold" style={{ color: theme.primary }}>{defender.name}</ThemedText>
            <ThemedText type="caption" style={{ color: theme.discovery, fontWeight: '800' }}>
              DEFEND
            </ThemedText>
          </View>
        </View>

        <ThemedText type="heroDisplay" style={[styles.count, { color: theme.secondary }]}>
          {remaining}
        </ThemedText>

        <ThemedText type="cardTitle" style={[styles.questionText, { color: theme.text }]}>
          {question.question}
        </ThemedText>

        {result ? (
          <View style={[styles.resultBox, { backgroundColor: theme.primaryLight, borderColor: theme.primary }]}>
            <ThemedText type="smallBold" style={{ color: theme.primary, textAlign: 'center' }}>
              {result}
            </ThemedText>
          </View>
        ) : (
          <View style={styles.columns}>
            <AnswerColumn
              label="Attacker"
              locked={attackerChoice !== null}
              selected={attackerChoice}
              choices={question.choices}
              onSelect={(index) => onAnswer('attacker', index)}
            />
            <AnswerColumn
              label="Defender"
              locked={defenderChoice !== null}
              selected={defenderChoice}
              choices={question.choices}
              onSelect={(index) => onAnswer('defender', index)}
            />
          </View>
        )}
      </View>
      </ScrollView>
    </View>
  );
}

function AnswerColumn({
  label,
  locked,
  selected,
  choices,
  onSelect,
}: {
  label: string;
  locked: boolean;
  selected: number | null;
  choices: string[];
  onSelect: (index: number) => void;
}) {
  const theme = useTheme();
  return (
    <View style={styles.column}>
      <ThemedText type="annotation" style={{ color: theme.textSecondary, fontWeight: '700' }}>
        {label}
      </ThemedText>
      {choices.map((choice, index) => {
        const isSelected = selected === index;
        return (
          <Pressable
            key={`${label}-${choice}`}
            disabled={locked}
            onPress={() => onSelect(index)}
            style={[
              styles.choice,
              {
                backgroundColor: isSelected ? theme.primaryLight : theme.backgroundElement,
                borderColor: isSelected ? theme.primary : theme.border,
              },
            ]}>
            <ThemedText
              type="caption"
              style={{
                color: isSelected ? theme.primary : theme.text,
                fontWeight: isSelected ? '700' : '400',
              }}>
              {choice}
            </ThemedText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill as any,
    backgroundColor: 'rgba(36, 59, 100, 0.65)',
    justifyContent: 'center',
    padding: Spacing.three,
    zIndex: 30,
  },
  overlayInner: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  card: {
    borderWidth: 2,
    borderRadius: BorderRadius.lg,
    padding: Spacing.four,
    gap: Spacing.two,
    maxHeight: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  vsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.one,
  },
  vsBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  side: {
    alignItems: 'center',
    flex: 1,
    gap: 2,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  count: {
    textAlign: 'center',
    fontSize: 48,
    lineHeight: 52,
    fontWeight: '900',
  },
  questionText: {
    fontSize: 16,
    lineHeight: 22,
    textAlign: 'center',
  },
  resultBox: {
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    padding: Spacing.three,
    marginVertical: Spacing.one,
  },
  columns: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  column: {
    flex: 1,
    gap: Spacing.one,
  },
  choice: {
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    padding: Spacing.two,
    minHeight: 44,
    justifyContent: 'center',
  },
});
