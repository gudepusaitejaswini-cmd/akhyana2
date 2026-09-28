import {
  TabList,
  TabListProps,
  Tabs,
  TabSlot,
  TabTrigger,
  TabTriggerSlotProps,
} from 'expo-router/ui';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from './themed-text';

import { Colors, MaxContentWidth, Spacing } from '@/constants/theme';

export default function AppTabs() {
  return (
    <Tabs>
      <TabSlot style={{ height: '100%' }} />
      <TabList asChild>
        <CustomTabList>
          <TabTrigger name="index" href="/" asChild>
            <TabButton>LEARN</TabButton>
          </TabTrigger>
          <TabTrigger name="games" href="/games" asChild>
            <TabButton>GAMES</TabButton>
          </TabTrigger>
          <TabTrigger name="explore" href="/explore" asChild>
            <TabButton>EXPLORE</TabButton>
          </TabTrigger>
          <TabTrigger name="aaj-ka-akhyana" href="/aaj-ka-akhyana" asChild>
            <TabButton>AAJ KA AKHYANA</TabButton>
          </TabTrigger>
          <TabTrigger name="heritage-voices" href="/heritage-voices" asChild>
            <TabButton>VOICES</TabButton>
          </TabTrigger>
          <TabTrigger name="progress" href="/progress" asChild>
            <TabButton>PROGRESS</TabButton>
          </TabTrigger>
        </CustomTabList>
      </TabList>
    </Tabs>
  );
}

export function TabButton({ children, isFocused, ...props }: TabTriggerSlotProps) {
  const colors = Colors.light;

  return (
    <Pressable {...props} style={({ pressed }) => [styles.tabButton, isFocused && { backgroundColor: colors.primaryLight }, pressed && styles.pressed]}>
      <ThemedText
        type="label"
        style={[
          styles.tabLabel,
          {
            color: isFocused ? colors.primary : colors.mutedText,
            fontWeight: isFocused ? '800' : '600',
          },
        ]}>
        {children}
      </ThemedText>
      {isFocused && <View style={[styles.indicatorDot, { backgroundColor: colors.accent }]} />}
    </Pressable>
  );
}

export function CustomTabList(props: TabListProps) {
  const colors = Colors.light;

  return (
    <View
      {...props}
      style={[
        styles.tabListContainer,
        { backgroundColor: colors.surface, borderTopColor: colors.border },
      ]}>
      <View style={styles.innerContainer}>
        <View style={styles.brandWordmarkBox}>
          <ThemedText type="label" style={[styles.brandText, { color: colors.primary }]}>
            AKHYANA
          </ThemedText>
        </View>
        <View style={styles.tabsRow}>{props.children}</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tabListContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    borderTopWidth: 1,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.four,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: MaxContentWidth,
  },
  brandWordmarkBox: {
    paddingVertical: Spacing.one,
  },
  brandText: {
    fontSize: 12,
    letterSpacing: 2,
    fontWeight: '900',
  },
  tabsRow: {
    flexDirection: 'row',
    gap: Spacing.four,
    alignItems: 'center',
  },
  tabButton: {
    paddingVertical: 6,
    paddingHorizontal: Spacing.two,
    borderRadius: 16,
    alignItems: 'center',
    gap: 3,
  },
  tabLabel: {
    fontSize: 11,
    letterSpacing: 1.2,
  },
  indicatorDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
  },
  pressed: {
    opacity: 0.7,
  },
});
