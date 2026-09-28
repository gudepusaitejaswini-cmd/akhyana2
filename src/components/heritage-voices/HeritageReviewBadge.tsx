import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { ArticleReviewStatus } from '@/types/heritage-voices';
import { Colors } from '@/constants/theme';

interface Props {
  status: ArticleReviewStatus;
  showExplanation?: boolean;
}

export function HeritageReviewBadge({ status, showExplanation = false }: Props) {
  const colors = Colors.light;

  if (status === 'content_reviewed') {
    return (
      <View style={styles.container}>
        <View style={[styles.badge, { backgroundColor: colors.primaryLight, borderColor: colors.primary }]}>
          <Text style={[styles.badgeText, { color: colors.primary }]}>✓ Content Reviewed</Text>
        </View>
        {showExplanation && (
          <Text style={[styles.explanation, { color: colors.textSecondary }]}>
            This article has been reviewed by the Akhyana editorial/review process.
          </Text>
        )}
      </View>
    );
  }

  if (status === 'published') {
    return (
      <View style={styles.container}>
        <View style={[styles.badge, { backgroundColor: colors.backgroundElement, borderColor: colors.cardBorder }]}>
          <Text style={[styles.badgeText, { color: colors.textSecondary }]}>Published</Text>
        </View>
      </View>
    );
  }

  if (status === 'pending_review') {
    return (
      <View style={styles.container}>
        <View style={[styles.badge, { backgroundColor: colors.warningLight, borderColor: colors.warning }]}>
          <Text style={[styles.badgeText, { color: colors.warning }]}>⏳ Pending Review</Text>
        </View>
        {showExplanation && (
          <Text style={[styles.explanation, { color: colors.textSecondary }]}>
            Article submitted and queued for editorial checks.
          </Text>
        )}
      </View>
    );
  }

  if (status === 'under_review') {
    return (
      <View style={styles.container}>
        <View style={[styles.badge, { backgroundColor: colors.errorLight, borderColor: colors.error }]}>
          <Text style={[styles.badgeText, { color: colors.error }]}>⚠ Under Review</Text>
        </View>
        {showExplanation && (
          <Text style={[styles.explanation, { color: colors.textSecondary }]}>
            Article is currently undergoing reader report moderation.
          </Text>
        )}
      </View>
    );
  }

  return null;
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
