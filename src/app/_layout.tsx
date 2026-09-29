import { DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { Colors } from '@/constants/theme';
import { ActiveCivilizationProvider } from '@/hooks/use-active-civilization';

SplashScreen.preventAutoHideAsync();

const AkhyanaTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: Colors.light.background,
    card: Colors.light.card,
    text: Colors.light.text,
    border: Colors.light.border,
    primary: Colors.light.primary,
  },
};

export default function RootLayout() {
  return (
    <ThemeProvider value={AkhyanaTheme}>
      <ActiveCivilizationProvider>
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: Colors.light.background } }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="period/[id]" />
          <Stack.Screen name="decade/[id]" />
          <Stack.Screen name="civilization/[id]" />
          <Stack.Screen name="topic/[id]" />
          <Stack.Screen name="experience/[id]" />
          <Stack.Screen name="game/[id]" />
          <Stack.Screen name="game/chronosearch/index" />
          <Stack.Screen name="game/chronosearch/[puzzleId]" />
          <Stack.Screen name="game/ludo/index" />
          <Stack.Screen name="game/ludo/play" />
          <Stack.Screen name="not-found" />
        </Stack>
        <AnimatedSplashOverlay />
      </ActiveCivilizationProvider>
    </ThemeProvider>
  );
}
