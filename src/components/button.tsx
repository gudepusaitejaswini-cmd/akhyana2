import React from 'react';
import { Pressable, StyleSheet, ViewStyle } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { BorderRadius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'action' | 'discovery' | 'achievement' | 'outline' | 'text' | 'subtle';
  size?: 'sm' | 'md' | 'lg';
  icon?: string;
  disabled?: boolean;
  style?: ViewStyle;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  icon,
  disabled = false,
  style,
}: ButtonProps) {
  const theme = useTheme();

  let backgroundColor: string = theme.primary;
  let textColor: string = theme.primaryText;
  let borderColor: string = 'transparent';

  if (variant === 'secondary' || variant === 'action') {
    backgroundColor = theme.secondary; // Terracotta #C96B4B
    textColor = theme.primaryText; // #FFFDF7
    borderColor = 'transparent';
  } else if (variant === 'discovery') {
    backgroundColor = theme.discovery; // Muted Teal #3F7C78
    textColor = theme.primaryText; // #FFFDF7
    borderColor = 'transparent';
  } else if (variant === 'achievement') {
    backgroundColor = theme.accent; // Muted Gold #D4A84F
    textColor = theme.primary; // Deep Indigo #243B64
    borderColor = 'transparent';
  } else if (variant === 'outline') {
    backgroundColor = 'transparent';
    textColor = theme.primary;
    borderColor = theme.primary;
  } else if (variant === 'text') {
    backgroundColor = 'transparent';
    textColor = theme.primary;
    borderColor = 'transparent';
  } else if (variant === 'subtle') {
    backgroundColor = theme.backgroundElement;
    textColor = theme.text;
    borderColor = theme.border;
  }

  const isSmall = size === 'sm';
  const isLarge = size === 'lg';
  const isText = variant === 'text';

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor: disabled ? theme.backgroundElement : backgroundColor,
          borderColor: disabled ? theme.border : borderColor,
        },
        isSmall && styles.sizeSm,
        isLarge && styles.sizeLg,
        isText && styles.textVariant,
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}>
      {icon && <ThemedText style={styles.icon}>{icon}</ThemedText>}
      <ThemedText
        type={isSmall ? 'smallBold' : isLarge ? 'cardTitle' : 'smallBold'}
        style={[
          styles.text,
          { color: disabled ? theme.textMuted : textColor },
          isSmall && styles.textSm,
          isText && styles.underlineText,
        ]}>
        {title}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: Spacing.four,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    gap: Spacing.two,
  },
  sizeSm: {
    paddingVertical: 8,
    paddingHorizontal: Spacing.three,
    borderRadius: BorderRadius.full,
    gap: 4,
  },
  sizeLg: {
    paddingVertical: 18,
    paddingHorizontal: Spacing.six,
    borderRadius: BorderRadius.full,
    gap: Spacing.two,
  },
  textVariant: {
    paddingVertical: 4,
    paddingHorizontal: 0,
    borderWidth: 0,
    justifyContent: 'flex-start',
    alignSelf: 'flex-start',
  },
  underlineText: {
    textDecorationLine: 'underline',
  },
  text: {
    letterSpacing: 0.5,
    fontWeight: '700',
  },
  textSm: {
    fontSize: 12,
  },
  icon: {
    fontSize: 14,
  },
  pressed: {
    opacity: 0.8,
  },
  disabled: {
    opacity: 0.5,
  },
});
