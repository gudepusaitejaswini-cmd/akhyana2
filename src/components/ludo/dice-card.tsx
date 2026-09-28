import React from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { BorderRadius } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

interface DiceCardProps {
  value: number | null;
  spinValue: number | null;
  busy?: boolean;
}

/**
 * Authentic 3x3 dice pip grid rendering for Chaupar/Ludo.
 * Pip positions in 3x3 grid (row, col from 0 to 2):
 * 1: [1,1]
 * 2: [0,2], [2,0]
 * 3: [0,2], [1,1], [2,0]
 * 4: [0,0], [0,2], [2,0], [2,2]
 * 5: [0,0], [0,2], [1,1], [2,0], [2,2]
 * 6: [0,0], [0,2], [1,0], [1,2], [2,0], [2,2]
 */
const PIP_COORDS: Record<number, [number, number][]> = {
  1: [[1, 1]],
  2: [[0, 2], [2, 0]],
  3: [[0, 2], [1, 1], [2, 0]],
  4: [[0, 0], [0, 2], [2, 0], [2, 2]],
  5: [[0, 0], [0, 2], [1, 1], [2, 0], [2, 2]],
  6: [[0, 0], [0, 2], [1, 0], [1, 2], [2, 0], [2, 2]],
};

export function DiceCard({ value, spinValue, busy }: DiceCardProps) {
  const theme = useTheme();
  const currentVal = spinValue ?? value;

  const pips = currentVal && currentVal >= 1 && currentVal <= 6 ? PIP_COORDS[currentVal] : null;

  return (
    <View
      style={[
        styles.diceCard,
        {
          backgroundColor: '#FFFDF7', // Soft Ivory
          borderColor: busy ? theme.accent : theme.border,
          shadowColor: '#243B64',
        },
      ]}>
      {pips ? (
        <View style={styles.grid}>
          {[0, 1, 2].map((row) => (
            <View key={`r-${row}`} style={styles.row}>
              {[0, 1, 2].map((col) => {
                const hasPip = pips.some(([r, c]) => r === row && c === col);
                return (
                  <View key={`c-${row}-${col}`} style={styles.pipCell}>
                    {hasPip && (
                      <View
                        style={[
                          styles.pip,
                          {
                            backgroundColor: currentVal === 6 ? '#C96B4B' : '#243B64',
                          },
                        ]}
                      />
                    )}
                  </View>
                );
              })}
            </View>
          ))}
        </View>
      ) : (
        <View style={styles.placeholder}>
          <ThemedText style={styles.diceEmoji}>🎲</ThemedText>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  diceCard: {
    width: 62,
    height: 62,
    borderRadius: BorderRadius.md,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 6,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  grid: {
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
  },
  pipCell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pip: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  placeholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  diceEmoji: {
    fontSize: 28,
    lineHeight: 34,
  },
});
