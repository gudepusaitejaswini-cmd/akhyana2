import React, { useCallback, useMemo, useRef, useState } from 'react';
import { GestureResponderEvent, LayoutChangeEvent, PanResponder, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { BorderRadius } from '@/constants/theme';
import { cellKey, getCellFromTouchPosition, selectionPathFromDrag } from '@/games/chronosearch/engine';
import { GridCell } from '@/games/chronosearch/types';
import { useTheme } from '@/hooks/use-theme';

interface ChronoSearchWordGridProps {
  grid: string[][];
  selection: GridCell[];
  foundCellKeys: ReadonlySet<string>;
  invalidSelection: boolean;
  interactionEnabled: boolean;
  onDragActiveChange?: (active: boolean) => void;
  onSelectionChange: (path: GridCell[]) => void;
  onSelectionComplete: (path: GridCell[]) => void;
}

export function ChronoSearchWordGrid({
  grid,
  selection,
  foundCellKeys,
  invalidSelection,
  interactionEnabled,
  onDragActiveChange,
  onSelectionChange,
  onSelectionComplete,
}: ChronoSearchWordGridProps) {
  const theme = useTheme();
  const size = grid.length;
  const boardRef = useRef<View>(null);

  // Dynamic layout measurements of the actual interactive grid
  const gridLayoutRef = useRef<{ width: number; height: number }>({ width: 0, height: 0 });
  const gridScreenOriginRef = useRef<{ left: number; top: number }>({ left: 0, top: 0 });

  const startRef = useRef<GridCell | null>(null);
  const pathRef = useRef<GridCell[]>([]);
  const [boardWidth, setBoardWidth] = useState(0);
  const cellSize = boardWidth > 0 ? boardWidth / size : 0;
  const selectedKeys = new Set(selection.map(cellKey));

  const handleLayout = useCallback((event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    gridLayoutRef.current = { width, height };
    if (width > 0) {
      setBoardWidth(width);
    }
  }, []);

  // Single consistent coordinate converter for touch start, move, and end
  const getCellFromTouch = useCallback(
    (pageX: number, pageY: number): GridCell | null => {
      return getCellFromTouchPosition(
        pageX,
        pageY,
        {
          left: gridScreenOriginRef.current.left,
          top: gridScreenOriginRef.current.top,
          width: gridLayoutRef.current.width,
          height: gridLayoutRef.current.height,
        },
        size,
      );
    },
    [size],
  );

  const applyTouchMove = useCallback(
    (pageX: number, pageY: number) => {
      const start = startRef.current;
      if (!start) return;

      const currentCell = getCellFromTouch(pageX, pageY);
      if (!currentCell) return;

      const result = selectionPathFromDrag(start, currentCell, pathRef.current, size);
      pathRef.current = result.path;
      onSelectionChange(result.path);
    },
    [getCellFromTouch, onSelectionChange, size],
  );

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => interactionEnabled,
        onStartShouldSetPanResponderCapture: () => interactionEnabled,
        onMoveShouldSetPanResponder: () => interactionEnabled,
        onMoveShouldSetPanResponderCapture: () => interactionEnabled,
        onPanResponderTerminationRequest: () => false,
        onShouldBlockNativeResponder: () => true,

        onPanResponderGrant: (event: GestureResponderEvent) => {
          if (!interactionEnabled) return;
          const { pageX, pageY, locationX, locationY } = event.nativeEvent;
          onDragActiveChange?.(true);

          // Calculate exact screen position of rendered grid at this moment
          // pageX - locationX and pageY - locationY inherently accounts for any scroll, headers, or status bar
          gridScreenOriginRef.current = {
            left: pageX - locationX,
            top: pageY - locationY,
          };

          const cell = getCellFromTouch(pageX, pageY);
          if (!cell) return;

          startRef.current = cell;
          pathRef.current = [cell];
          onSelectionChange([cell]);
        },

        onPanResponderMove: (event: GestureResponderEvent) => {
          applyTouchMove(event.nativeEvent.pageX, event.nativeEvent.pageY);
        },

        onPanResponderRelease: () => {
          onDragActiveChange?.(false);
          const path = pathRef.current;
          startRef.current = null;
          pathRef.current = [];
          if (path.length >= 2) {
            onSelectionComplete(path);
          } else {
            onSelectionChange([]);
          }
        },

        onPanResponderTerminate: () => {
          onDragActiveChange?.(false);
          startRef.current = null;
          pathRef.current = [];
          onSelectionChange([]);
        },
      }),
    [
      applyTouchMove,
      getCellFromTouch,
      interactionEnabled,
      onDragActiveChange,
      onSelectionChange,
      onSelectionComplete,
    ],
  );

  return (
    <View
      ref={boardRef}
      collapsable={false}
      pointerEvents="box-only"
      onLayout={handleLayout}
      style={[
        styles.board,
        {
          backgroundColor: theme.card,
          borderColor: invalidSelection ? theme.error : theme.cardBorder,
        },
      ]}
      {...panResponder.panHandlers}>
      {grid.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row} pointerEvents="none">
          {row.map((letter, colIndex) => {
            const key = `${rowIndex}:${colIndex}`;
            const isFound = foundCellKeys.has(key);
            const isSelected = selectedKeys.has(key);

            let backgroundColor = 'transparent';
            let color: string = theme.textSecondary;
            let borderRadius = 0;
            let opacity = 1;

            if (isFound) {
              backgroundColor = theme.discovery; // Muted Teal discovery
              color = theme.surface;
              borderRadius = 10;
            } else if (isSelected) {
              backgroundColor = invalidSelection ? theme.error : theme.secondary; // Terracotta drag / Red error
              color = theme.surface;
              borderRadius = 10;
              opacity = 0.95;
            }

            return (
              <View
                key={key}
                pointerEvents="none"
                style={[
                  styles.cell,
                  {
                    width: cellSize || undefined,
                    height: cellSize || undefined,
                    backgroundColor,
                    borderRadius,
                    opacity,
                  },
                ]}>
                <ThemedText type="smallBold" style={[styles.letter, { color }]}>
                  {letter}
                </ThemedText>
              </View>
            );
          })}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  board: {
    width: '100%',
    aspectRatio: 1,
    borderWidth: 2,
    borderRadius: BorderRadius.xl,
    padding: 4,
    backgroundColor: '#FFFDF7',
    // @ts-ignore
    userSelect: 'none',
  },
  row: {
    flex: 1,
    flexDirection: 'row',
  },
  cell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 1,
  },
  letter: {
    letterSpacing: 1,
  },
});
