import React from 'react';
import { View, StyleSheet, Platform, Text } from 'react-native';
import { Tabs } from 'expo-router';
import { Colors, Spacing } from '@/constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function AppTabs() {
  const colors = Colors.light;
  const insets = useSafeAreaInsets();
  
  const bottomInset = Math.max(insets.bottom, 16);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.cardBorder,
          elevation: 2,
          shadowColor: colors.primary,
          shadowOpacity: 0.06,
          shadowOffset: { width: 0, height: -2 },
          shadowRadius: 8,
          height: 60 + bottomInset,
          paddingBottom: bottomInset,
          paddingTop: 8,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.mutedText,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => (
            <TabIcon name="🏛️" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="learn"
        options={{
          title: 'Learn',
          tabBarIcon: ({ focused }) => (
            <TabIcon name="📖" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="games"
        options={{
          title: 'Games',
          tabBarIcon: ({ focused }) => (
            <TabIcon name="🎮" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ focused }) => (
            <TabIcon name="🧭" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="aaj-ka-akhyana"
        options={{
          title: 'Aaj',
          tabBarIcon: ({ focused }) => (
            <TabIcon name="📜" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="heritage-voices"
        options={{
          title: 'Voices',
          tabBarIcon: ({ focused }) => (
            <TabIcon name="🏛️" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: 'Progress',
          tabBarIcon: ({ focused }) => (
            <TabIcon name="🏆" focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}

function TabIcon({ name, focused }: { name: string; focused: boolean }) {
  const colors = Colors.light;

  return (
    <View style={[
      styles.iconContainer, 
      focused && { backgroundColor: colors.primaryLight }
    ]}>
      <Text style={{
        fontSize: 22,
        textAlign: 'center',
        includeFontPadding: false,
      }}>
        {name}
      </Text>
      {focused && <View style={[styles.activeDot, { backgroundColor: colors.accent }]} />}
    </View>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    paddingHorizontal: Spacing.three,
    paddingVertical: 3,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 2,
  },
});
