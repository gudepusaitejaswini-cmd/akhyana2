import { StyleSheet, View, ViewStyle } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { BorderRadius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

interface AnnotationTagProps {
  label: string;
  variant?: 'default' | 'accent' | 'highlight' | 'discovery' | 'action' | 'success' | 'error';
  style?: ViewStyle;
}

export function AnnotationTag({ label, variant = 'default', style }: AnnotationTagProps) {
  const theme = useTheme();

  let textColor: string = theme.textSecondary;
  let backgroundColor: string = theme.backgroundElement;
  let borderColor: string = theme.border;

  if (variant === 'accent') {
    textColor = theme.accentText;
    backgroundColor = theme.accentLight;
    borderColor = theme.accent;
  } else if (variant === 'highlight') {
    textColor = theme.primary;
    backgroundColor = theme.primaryLight;
    borderColor = theme.primary;
  } else if (variant === 'discovery') {
    textColor = theme.discoveryText;
    backgroundColor = theme.discoveryLight;
    borderColor = theme.discovery;
  } else if (variant === 'action') {
    textColor = theme.secondary;
    backgroundColor = theme.secondaryLight;
    borderColor = theme.secondary;
  } else if (variant === 'success') {
    textColor = theme.success;
    backgroundColor = theme.successLight;
    borderColor = theme.success;
  } else if (variant === 'error') {
    textColor = theme.error;
    backgroundColor = theme.errorLight;
    borderColor = theme.error;
  }

  return (
    <View style={[styles.container, { backgroundColor, borderColor }, style]}>
      <ThemedText type="annotation" style={[styles.text, { color: textColor }]}>
        {label}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-start',
    marginVertical: 2,
    paddingHorizontal: Spacing.two,
    paddingVertical: 5,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  text: {
    letterSpacing: 1.1,
    fontSize: 10,
    fontWeight: '800',
  },
});
