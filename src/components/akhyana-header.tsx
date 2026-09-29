import React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { BorderRadius, Spacing } from '@/constants/theme';
import { MOCK_USER_PROGRESS } from '@/data/progress';
import { useTheme } from '@/hooks/use-theme';

interface AkhyanaHeaderProps {
  showTagline?: boolean;
  subtitle?: string;
}

export function AkhyanaHeader({ showTagline = true, subtitle }: AkhyanaHeaderProps) {
  const theme = useTheme();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <Pressable
          onPress={() => router.push('/')}
          accessibilityRole="button"
          accessibilityLabel="Akhyana Home"
          style={({ pressed }) => [styles.brandRow, pressed && { opacity: 0.8 }]}>
          <View style={styles.logoBadgeWrapper}>
            <Image
              source={require('@/assets/images/akhyana-logo-icon.jpg')}
              style={styles.logoIcon}
              resizeMode="cover"
            />
          </View>
          <View style={styles.brandTextGroup}>
            <View style={styles.wordmarkRow}>
              <ThemedText type="editorialHeader" style={[styles.brandWordmark, { color: theme.heritageGreen || '#0B332B' }]}>
                AKHYANA
              </ThemedText>
              <View style={[styles.brandDot, { backgroundColor: theme.antiqueGold || '#D6A84F' }]} />
            </View>
            {showTagline && (
              <ThemedText type="caption" style={[styles.headerTagline, { color: theme.antiqueGold || '#D6A84F' }]}>
                PLAY • EXPLORE • LEARN
              </ThemedText>
            )}
          </View>
        </Pressable>

        {/* Minimal metadata text */}
        <View style={styles.metaRow}>
          <View style={[styles.metaBadge, { backgroundColor: '#FAF3E3', borderColor: '#E8E1D3' }]}>
            <ThemedText type="annotation" style={{ color: theme.antiqueGold || '#7D5C1E', fontWeight: '800', fontSize: 10 }}>
              🔥 {MOCK_USER_PROGRESS.streakDays}D
            </ThemedText>
          </View>
          <View style={[styles.metaBadge, { backgroundColor: '#E8F1EC', borderColor: '#C8DDD0' }]}>
            <ThemedText type="annotation" style={{ color: theme.heritageGreen || '#0B332B', fontWeight: '800', fontSize: 10 }}>
              ⚡ {MOCK_USER_PROGRESS.currentXp} XP
            </ThemedText>
          </View>
        </View>
      </View>

      {subtitle && (
        <ThemedText type="small" themeColor="textSecondary" style={styles.customSubtitle}>
          {subtitle}
        </ThemedText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    paddingBottom: Spacing.two,
    gap: 4,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  logoBadgeWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: '#D6A84F',
    backgroundColor: '#0B332B',
    shadowColor: '#0B332B',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },
  logoIcon: {
    width: '100%',
    height: '100%',
  },
  brandTextGroup: {
    justifyContent: 'center',
  },
  wordmarkRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  brandWordmark: {
    fontSize: 20,
    lineHeight: 22,
    fontWeight: '900',
    letterSpacing: 2.5,
  },
  brandDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  headerTagline: {
    fontSize: 8.5,
    fontWeight: '800',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginTop: 1,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
  },
  customSubtitle: {
    fontSize: 13,
    lineHeight: 18,
    marginTop: 2,
    letterSpacing: 0.5,
  },
});
