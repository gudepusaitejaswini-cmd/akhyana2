import { StyleSheet, View, ViewStyle } from 'react-native';

import { BorderRadius } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

interface ProgressBarProps {
  progress: number; // 0 to 100
  colorVariant?: 'primary' | 'accent' | 'success' | 'secondary' | 'discovery';
  height?: number;
  style?: ViewStyle;
}

export function ProgressBar({
  progress,
  colorVariant = 'primary',
  height = 6,
  style,
}: ProgressBarProps) {
  const theme = useTheme();

  const clamped = Math.max(0, Math.min(100, progress));

  let fillColor: string = theme.primary;
  if (colorVariant === 'accent') fillColor = theme.accent;
  else if (colorVariant === 'success') fillColor = theme.success;
  else if (colorVariant === 'secondary') fillColor = theme.secondary;
  else if (colorVariant === 'discovery') fillColor = theme.discovery;

  return (
    <View
      style={[
        styles.track,
        {
          height,
          backgroundColor: theme.backgroundElement,
        },
        style,
      ]}>
      <View
        style={[
          styles.fill,
          {
            width: `${clamped}%`,
            backgroundColor: fillColor,
            height,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: '100%',
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
  },
  fill: {
    borderRadius: BorderRadius.full,
  },
});
