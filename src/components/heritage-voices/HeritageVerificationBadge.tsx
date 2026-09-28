import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { ExpertVerificationStatus } from '@/types/heritage-voices';
import { Colors } from '@/constants/theme';

interface Props {
  status: ExpertVerificationStatus;
  isDemo?: boolean;
  showExplanation?: boolean;
}

export function HeritageVerificationBadge({ status, isDemo = false, showExplanation = false }: Props) {
  const colors = Colors.light;

  if (isDemo) {
    return (
      <View style={styles.container}>
        <View style={[styles.badge, { backgroundColor: colors.backgroundElement, borderColor: colors.cardBorder }]}>
          <Text style={[styles.badgeText, { color: colors.primary }]}>Demo Expert</Text>
        </View>
        {showExplanation && (
          <Text style={[styles.explanation, { color: colors.textSecondary }]}>
            Sample author profile for demonstration purposes.
          </Text>
        )}
      </View>
    );
  }

  if (status === 'verified') {
    return (
      <View style={styles.container}>
        <View style={[styles.badge, { backgroundColor: colors.successLight, borderColor: colors.success }]}>
          <Text style={[styles.badgeText, { color: colors.success }]}>✓ Expert Verified</Text>
        </View>
        {showExplanation && (
          <Text style={[styles.explanation, { color: colors.textSecondary }]}>
            Akhyana has verified the author's identity and professional credentials.
          </Text>
        )}
      </View>
    );
  }

  if (status === 'pending') {
    return (
      <View style={styles.container}>
        <View style={[styles.badge, { backgroundColor: colors.warningLight, borderColor: colors.warning }]}>
          <Text style={[styles.badgeText, { color: colors.warning }]}>⏳ Verification Pending</Text>
        </View>
        {showExplanation && (
          <Text style={[styles.explanation, { color: colors.textSecondary }]}>
            Credentials submitted and currently awaiting verification.
          </Text>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.badge, { backgroundColor: colors.backgroundElement, borderColor: colors.border }]}>
        <Text style={[styles.badgeText, { color: colors.textMuted }]}>Unverified Contributor</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    gap: 4,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  explanation: {
    fontSize: 11,
    lineHeight: 15,
    fontStyle: 'italic',
  },
});
