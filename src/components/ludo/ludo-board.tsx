import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import {
  BASE_AREAS,
  cellForToken,
  HOME_PATH_CELLS,
  isPathCell,
  TRACK_CELLS,
} from '@/games/ludo/board';
import { isSafeTrack } from '@/games/ludo/engine';
import { LudoPlayerConfig, LudoSeat, LudoToken } from '@/games/ludo/types';
import { useTheme } from '@/hooks/use-theme';

interface LudoBoardProps {
  players: LudoPlayerConfig[];
  tokens: LudoToken[];
  legalIds: string[];
  disabled: boolean;
  onTokenPress: (tokenId: string) => void;
}

const SEATS: LudoSeat[] = [0, 1, 2, 3];

export function LudoBoard({ players, tokens, legalIds, disabled, onTokenPress }: LudoBoardProps) {
  const theme = useTheme();
  const colorBySeat = new Map(players.map((player) => [player.seat, player.color]));
  const boardSize = 15;
  const cells = Array.from({ length: boardSize * boardSize }, (_, index) => ({
    row: Math.floor(index / boardSize),
    col: index % boardSize,
  }));

  const tokensByCell = new Map<string, LudoToken[]>();
  for (const token of tokens) {
    const cell = cellForToken(token.seat, token.index, token.distance);
    const key = `${cell.row}:${cell.col}`;
    const list = tokensByCell.get(key) ?? [];
    list.push(token);
    tokensByCell.set(key, list);
  }

  const safeKeys = new Set(
    TRACK_CELLS.filter((_, index) => isSafeTrack(index)).map((cell) => `${cell.row}:${cell.col}`),
  );

  return (
    <View style={[styles.board, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
      {SEATS.map((seat) => {
        const area = BASE_AREAS[seat];
        const color = colorBySeat.get(seat) ?? theme.border;
        return (
          <View
            key={`base-${seat}`}
            pointerEvents="none"
            style={[
              styles.base,
              {
                top: `${(area.row / 15) * 100}%`,
                left: `${(area.col / 15) * 100}%`,
                width: `${(area.size / 15) * 100}%`,
                height: `${(area.size / 15) * 100}%`,
                backgroundColor: color,
                borderColor: 'rgba(0,0,0,0.1)',
                padding: '4%',
              },
            ]}
          >
            <View style={{ flex: 1, backgroundColor: theme.surface, borderRadius: 8 }} />
          </View>
        );
      })}
      {SEATS.map((seat) =>
        HOME_PATH_CELLS[seat].map((cell, index) => {
          const color = colorBySeat.get(seat) ?? theme.primaryLight;
          return (
            <View
              key={`home-${seat}-${index}`}
              pointerEvents="none"
              style={[
                styles.homeCell,
                {
                  top: `${(cell.row / 15) * 100}%`,
                  left: `${(cell.col / 15) * 100}%`,
                  width: `${100 / 15}%`,
                  height: `${100 / 15}%`,
                  backgroundColor: color,
                  opacity: 0.85,
                  borderWidth: 1,
                  borderColor: 'rgba(0,0,0,0.05)',
                },
              ]}
            />
          );
        }),
      )}
      
      {cells.map((cell) => {
        const path = isPathCell(cell.row, cell.col);
        const safe = safeKeys.has(`${cell.row}:${cell.col}`);
        if (!path) return null; // Don't draw spreadsheet!

        return (
          <View
            key={`c-${cell.row}-${cell.col}`}
            pointerEvents="none"
            style={[
              styles.gridCell,
              {
                top: `${(cell.row / 15) * 100}%`,
                left: `${(cell.col / 15) * 100}%`,
                width: `${100 / 15}%`,
                height: `${100 / 15}%`,
                borderColor: theme.border,
                backgroundColor: safe ? theme.backgroundSelected : theme.card,
              },
            ]}
          />
        );
      })}

      {Array.from(tokensByCell.entries()).map(([key, group]) => {
        const [row, col] = key.split(':').map(Number);
        return (
          <View
            key={key}
            style={[
              styles.tokenStack,
              {
                top: `${(row / 15) * 100}%`,
                left: `${(col / 15) * 100}%`,
                width: `${100 / 15}%`,
                height: `${100 / 15}%`,
              },
            ]}>
            {group.map((token, index) => {
              const color = colorBySeat.get(token.seat) ?? theme.primary;
              const legal = legalIds.includes(token.id);
              return (
                
                <Pressable
                  key={token.id}
                  disabled={disabled || !legal}
                  onPress={() => onTokenPress(token.id)}
                  style={[
                    styles.token,
                    {
                      backgroundColor: color,
                      borderColor: '#FFFFFF',
                      borderWidth: legal ? 3 : 2,
                      transform: [{ translateX: index * 4 }, { translateY: index * 4 }],
                      zIndex: index + 1,
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.3,
                      shadowRadius: 2,
                      elevation: 4,
                    },
                  ]}>
                  {legal && <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#FFFFFF' }} />}
                </Pressable>

              );
            })}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  board: {
    width: '100%',
    maxWidth: 350,
    maxHeight: 350,
    aspectRatio: 1,
    alignSelf: 'center',
    borderWidth: 2,
    borderRadius: 12,
    borderColor: '#D8D8D0',
    overflow: 'hidden',
    position: 'relative',
  },
  base: {
    position: 'absolute',
    borderWidth: 1,
    borderRadius: 8,
  },
  homeCell: {
    position: 'absolute',
  },
  gridCell: {
    position: 'absolute',
    borderWidth: StyleSheet.hairlineWidth,
  },
  tokenStack: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  token: {
    position: 'absolute',
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tokenLabel: {
    color: '#FCFBF4',
    fontSize: 8,
    lineHeight: 10,
  },
});
