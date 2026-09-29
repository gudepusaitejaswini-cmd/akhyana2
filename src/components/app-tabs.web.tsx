import {
  TabList,
  TabListProps,
  Tabs,
  TabSlot,
  TabTrigger,
  TabTriggerSlotProps,
} from 'expo-router/ui';
import { useRouter } from 'expo-router';
import { Image, Pressable, StyleSheet, View, Platform } from 'react-native';

import { ThemedText } from './themed-text';
import { Colors, MaxContentWidth, Spacing } from '@/constants/theme';

export default function AppTabs() {
  return (
    <Tabs>
      <TabSlot style={{ height: '100%' }} />
      <TabList asChild>
        <CustomTabList>
          <TabTrigger name="index" href="/" asChild>
            <TabButton icon="🏛️">HOME</TabButton>
          </TabTrigger>
          <TabTrigger name="explore" href="/explore" asChild>
            <TabButton icon="🧭">EXPLORE</TabButton>
          </TabTrigger>
          <TabTrigger name="learn" href="/learn" asChild>
            <TabButton icon="📖">LEARN</TabButton>
          </TabTrigger>
          <TabTrigger name="games" href="/games" asChild>
            <TabButton icon="🎮">GAMES</TabButton>
          </TabTrigger>
          <TabTrigger name="aaj-ka-akhyana" href="/aaj-ka-akhyana" asChild>
            <TabButton icon="📜">AAJ KA AKHYANA</TabButton>
          </TabTrigger>
          <TabTrigger name="heritage-voices" href="/heritage-voices" asChild>
            <TabButton icon="✍️">VOICES</TabButton>
          </TabTrigger>
          <TabTrigger name="progress" href="/progress" asChild>
            <TabButton icon="🏆">PROGRESS</TabButton>
          </TabTrigger>
        </CustomTabList>
      </TabList>
    </Tabs>
  );
}

export function TabButton({ children, icon, isFocused, ...props }: TabTriggerSlotProps & { icon?: string }) {
  return (
    <Pressable
      {...props}
      style={({ pressed }) => [
        styles.tabButton,
        isFocused && styles.tabButtonActive,
        pressed && styles.pressed,
      ]}>
      {icon ? (
        <ThemedText style={[styles.tabIcon, isFocused && styles.tabIconActive]}>
          {icon}
        </ThemedText>
      ) : null}
      <ThemedText
        type="label"
        style={[
          styles.tabLabel,
          {
            color: isFocused ? '#0B332B' : '#6F6A60',
            fontWeight: isFocused ? '800' : '600',
          },
        ]}>
        {children}
      </ThemedText>
      {isFocused && <View style={styles.indicatorDot} />}
    </Pressable>
  );
}

export function CustomTabList(props: TabListProps) {
  const router = useRouter();

  return (
    <View
      {...props}
      style={styles.tabListContainer}>
      <View style={styles.innerContainer}>
        {/* Clickable Brand Logo & Wordmark linking to Home */}
        <Pressable
          onPress={() => router.push('/')}
          accessibilityRole="button"
          accessibilityLabel="Akhyana Home"
          style={({ pressed }) => [styles.brandWrapper, pressed && { opacity: 0.8 }]}>
          <View style={styles.logoBadge}>
            <Image
              source={require('@/assets/images/akhyana-logo-icon.jpg')}
              style={styles.logoImage}
              resizeMode="cover"
            />
          </View>
          <View style={styles.brandTextGroup}>
            <View style={styles.wordmarkRow}>
              <ThemedText type="label" style={styles.brandText}>
                AKHYANA
              </ThemedText>
              <View style={styles.brandDot} />
            </View>
            <ThemedText style={styles.brandTagline}>
              HERITAGE PLATFORM
            </ThemedText>
          </View>
        </Pressable>

        {/* Navigation Tabs */}
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
    borderTopColor: '#E8E1D3',
    backgroundColor: '#FFFDF7',
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
    shadowColor: '#0B332B',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 8,
  },
  innerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: MaxContentWidth,
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  brandWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 2,
    cursor: 'pointer',
  } as any,
  logoBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: '#D6A84F',
    backgroundColor: '#0B332B',
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  brandTextGroup: {
    justifyContent: 'center',
  },
  wordmarkRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 3,
  },
  brandText: {
    fontSize: 13,
    letterSpacing: 2,
    fontWeight: '900',
    color: '#0B332B',
  },
  brandDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D6A84F',
  },
  brandTagline: {
    fontSize: 7.5,
    letterSpacing: 1.2,
    fontWeight: '800',
    color: '#A84B32',
    textTransform: 'uppercase',
  },
  tabsRow: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  tabButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 5,
    backgroundColor: 'transparent',
    position: 'relative',
    cursor: 'pointer',
  } as any,
  tabButtonActive: {
    backgroundColor: '#FAF3E3',
    borderColor: '#E8E1D3',
    borderWidth: 1,
  },
  tabIcon: {
    fontSize: 12,
    opacity: 0.8,
  },
  tabIconActive: {
    opacity: 1,
    transform: [{ scale: 1.05 }],
  },
  tabLabel: {
    fontSize: 10.5,
    letterSpacing: 0.8,
  },
  indicatorDot: {
    position: 'absolute',
    bottom: 2,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D6A84F',
  },
  pressed: {
    opacity: 0.7,
  },
});
