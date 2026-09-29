import * as SplashScreen from 'expo-splash-screen';
import { useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import Animated, { Easing, Keyframe } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

const DURATION = 700;

export function AnimatedSplashOverlay() {
  const [animate, setAnimate] = useState(false);
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  const splashKeyframe = new Keyframe({
    0: {
      transform: [{ scale: 1 }],
      opacity: 1,
    },
    30: {
      opacity: 1,
      transform: [{ scale: 1 }],
    },
    75: {
      opacity: 0,
      transform: [{ scale: 1.05 }],
      easing: Easing.out(Easing.ease),
    },
    100: {
      opacity: 0,
      transform: [{ scale: 1.08 }],
    },
  });

  const splashContent = (
    <View style={styles.contentWrap}>
      <View style={styles.logoCircle}>
        <Image
          source={require('@/assets/images/akhyana-logo-icon.jpg')}
          style={styles.logoImg}
          resizeMode="cover"
        />
      </View>
      <Text style={styles.wordmark}>AKHYANA</Text>
      <Text style={styles.tagline}>PLAY • EXPLORE • LEARN</Text>
    </View>
  );

  return animate ? (
    <Animated.View
      entering={splashKeyframe.duration(DURATION).withCallback((finished) => {
        'worklet';
        if (finished) {
          scheduleOnRN(setVisible, false);
        }
      })}
      style={styles.splashOverlay}>
      {splashContent}
    </Animated.View>
  ) : (
    <View
      onLayout={() => {
        SplashScreen.hideAsync().finally(() => {
          setAnimate(true);
        });
      }}
      style={styles.splashOverlay}>
      {splashContent}
    </View>
  );
}

const styles = StyleSheet.create({
  splashOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#0B332B',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  contentWrap: {
    alignItems: 'center',
    gap: 12,
  },
  logoCircle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#D6A84F',
    backgroundColor: '#0B332B',
  },
  logoImg: {
    width: '100%',
    height: '100%',
  },
  wordmark: {
    color: '#D6A84F',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 4,
  },
  tagline: {
    color: '#F7F1E3',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 2,
  },
});
