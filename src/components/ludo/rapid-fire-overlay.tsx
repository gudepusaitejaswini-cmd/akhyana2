import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Pressable } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { AnnotationTag } from '@/components/annotation-tag';
import { Button } from '@/components/button';
import { BorderRadius, Spacing } from '@/constants/theme';
import { LUDO_TOPICS, RAPID_FIRE_QUESTIONS } from '@/data/ludo';
import { useTheme } from '@/hooks/use-theme';

export function RapidFireOverlay({ playerName, onComplete }: { playerName: string; onComplete: (score: number) => void }) {
  const theme = useTheme();
  const [topic, setTopic] = useState<string | null>(null);
  const [qIndex, setQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const activeQuestions = topic ? RAPID_FIRE_QUESTIONS[topic] : [];

  const handleSelectTopic = (id: string) => {
    setTopic(id);
    setQIndex(0);
    setScore(0);
    setIsFinished(false);
  };

  const handleAnswer = (choiceIdx: number) => {
    if (choiceIdx === activeQuestions[qIndex].correct) {
      setScore(s => s + 1);
    }
    
    if (qIndex + 1 < 6) {
      setQIndex(q => q + 1);
    } else {
      setIsFinished(true);
    }
  };

  if (!topic) {
    return (
      <View style={styles.overlay}>
        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
          <AnnotationTag label={playerName.toUpperCase()} variant="action" />
          <ThemedText type="editorialHeader" style={{ textAlign: 'center', marginTop: 12 }}>
            Choose your challenge topic
          </ThemedText>
          <ThemedText type="small" themeColor="textSecondary" style={{ textAlign: 'center', marginBottom: 20 }}>
            6 QUESTIONS. 5 SECONDS EACH.
          </ThemedText>

          <View style={{ gap: Spacing.three }}>
            {LUDO_TOPICS.map(t => (
              <Pressable
                key={t.id}
                onPress={() => handleSelectTopic(t.id)}
                style={({pressed}) => [
                  styles.topicBtn,
                  { backgroundColor: theme.backgroundElement, borderColor: theme.border },
                  pressed && { opacity: 0.8 }
                ]}>
                <ThemedText type="smallBold">{t.title}</ThemedText>
                <ThemedText type="caption" themeColor="textSecondary">{t.desc}</ThemedText>
              </Pressable>
            ))}
          </View>
        </View>
      </View>
    );
  }

  if (isFinished) {
    return (
      <View style={styles.overlay}>
        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.accent, alignItems: 'center' }]}>
          <AnnotationTag label="HISTORICAL CHALLENGE COMPLETE" variant="accent" />
          <ThemedText type="heroDisplay" style={{ marginTop: 24 }}>
            {score} / 6 CORRECT
          </ThemedText>
          
          <View style={{ marginVertical: 24, alignItems: 'center' }}>
            <ThemedText type="smallBold" themeColor="textSecondary">SPACES TO MOVE</ThemedText>
            <View style={{ width: 64, height: 64, borderRadius: 16, backgroundColor: theme.primary, alignItems: 'center', justifyContent: 'center', marginTop: 8 }}>
              <ThemedText type="heroDisplay" style={{ color: theme.primaryText }}>{score}</ThemedText>
            </View>
          </View>
          
          <Button title="CONTINUE TO BOARD →" size="lg" variant="action" onPress={() => onComplete(score)} />
        </View>
      </View>
    );
  }

  const q = activeQuestions[qIndex];

  return (
    <View style={styles.overlay}>
      <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <AnnotationTag label={`QUESTION ${qIndex + 1} / 6`} variant="discovery" />
          <ThemedText type="smallBold" style={{ color: theme.success }}>CORRECT: {score}</ThemedText>
        </View>
        
        <ThemedText type="editorialHeader" style={{ marginBottom: 24, minHeight: 60 }}>
          {q.q}
        </ThemedText>

        <View style={{ gap: Spacing.two }}>
          {q.options.map((opt, i) => (
            <Pressable
              key={i}
              onPress={() => handleAnswer(i)}
              style={({pressed}) => [
                styles.choice,
                { backgroundColor: theme.backgroundElement, borderColor: theme.border },
                pressed && { opacity: 0.7, backgroundColor: theme.primaryLight }
              ]}>
              <ThemedText type="smallBold">{opt}</ThemedText>
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill as any,
    backgroundColor: 'rgba(36, 59, 100, 0.65)',
    justifyContent: 'center',
    padding: Spacing.four,
    zIndex: 40,
  },
  card: {
    borderWidth: 2,
    borderRadius: BorderRadius.xl,
    padding: Spacing.four,
    width: '100%',
    shadowColor: '#243B64',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  topicBtn: {
    padding: Spacing.three,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    gap: 4,
  },
  choice: {
    padding: Spacing.four,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
  }
});
