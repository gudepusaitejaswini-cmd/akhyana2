import React, { useState } from 'react';
import { View, StyleSheet, Text, ScrollView, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getHeritageArticleById, getHeritageExpertById } from '@/data/heritage-voices';
import { HeritageAuthorBadge } from '@/components/heritage-voices/HeritageAuthorBadge';
import { HeritageVerificationBadge } from '@/components/heritage-voices/HeritageVerificationBadge';
import { HeritageReviewBadge } from '@/components/heritage-voices/HeritageReviewBadge';
import { HeritageContentNote } from '@/components/heritage-voices/HeritageContentNote';
import { HeritageEvidencePerspective } from '@/components/heritage-voices/HeritageEvidencePerspective';
import { HeritageSourceList } from '@/components/heritage-voices/HeritageSourceList';
import { HeritageReportModal } from '@/components/heritage-voices/HeritageReportModal';
import { Colors } from '@/constants/theme';

export default function ArticleDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colors = Colors.light;

  const [reportModalVisible, setReportModalVisible] = useState(false);

  const article = id ? getHeritageArticleById(id) : undefined;
  const author = article ? getHeritageExpertById(article.authorId) : undefined;

  if (!article) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: colors.background, paddingTop: insets.top }]}>
        <Text style={[styles.notFoundTitle, { color: colors.text }]}>Article Not Found</Text>
        <Pressable onPress={() => router.back()} style={styles.backLink}>
          <Text style={{ color: colors.primary, fontWeight: '700' }}>← Go back</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 60 },
        ]}
        showsVerticalScrollIndicator={false}>
        {/* Navigation Bar */}
        <View style={styles.navBar}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Text style={[styles.backBtnText, { color: colors.primary }]}>← Back</Text>
          </Pressable>
          <Pressable onPress={() => setReportModalVisible(true)} style={styles.reportBtn}>
            <Text style={[styles.reportBtnText, { color: colors.warning }]}>🚩 Report</Text>
          </Pressable>
        </View>

        {/* Category & Metadata */}
        <View style={styles.metaRow}>
          <View style={[styles.categoryBadge, { backgroundColor: colors.primaryLight }]}>
            <Text style={[styles.categoryText, { color: colors.primary }]}>{article.category}</Text>
          </View>
          {article.publishedAt && (
            <Text style={[styles.dateText, { color: colors.textMuted }]}>{article.publishedAt}</Text>
          )}
          {article.readTimeMinutes && (
            <Text style={[styles.dateText, { color: colors.textMuted }]}>· {article.readTimeMinutes} min read</Text>
          )}
        </View>

        {/* Article Title */}
        <Text style={[styles.title, { color: colors.text }]}>{article.title}</Text>

        {/* Author Details with Verification */}
        {author && (
          <View style={[styles.authorSection, { borderColor: colors.border }]}>
            <HeritageAuthorBadge expert={author} />
          </View>
        )}

        {/* Editorial Review & Verification Clarification */}
        <View style={[styles.trustBox, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
          <Text style={[styles.trustTitle, { color: colors.text }]}>Status & Transparency</Text>
          <View style={styles.badgeRow}>
            <HeritageVerificationBadge status={article.verificationStatus} showExplanation />
          </View>
          <View style={styles.badgeRow}>
            <HeritageReviewBadge status={article.reviewStatus} showExplanation />
          </View>
        </View>

        {/* Sensitive Content Note */}
        <HeritageContentNote contentNote={article.contentNote} />

        {/* Article Summary */}
        <View style={[styles.summaryBox, { backgroundColor: colors.backgroundElement }]}>
          <Text style={[styles.summaryText, { color: colors.text }]}>{article.summary}</Text>
        </View>

        {/* Article Content */}
        <View style={styles.contentBody}>
          <Text style={[styles.bodyText, { color: colors.text }]}>{article.content}</Text>
        </View>

        {/* Evidence & Perspective Section */}
        <HeritageEvidencePerspective
          evidenceSummary={article.evidenceSummary}
          authorPerspective={article.authorPerspective}
        />

        {/* Sources & References */}
        <HeritageSourceList sources={article.sources} />

        {/* Bottom Report Button */}
        <View style={[styles.bottomReportBox, { borderTopColor: colors.border }]}>
          <Pressable onPress={() => setReportModalVisible(true)} style={styles.bottomReportAction}>
            <Text style={[styles.bottomReportText, { color: colors.textMuted }]}>
              🚩 Report an issue with this article (Misinformation, Sensitivity, Sources)
            </Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* Report Modal */}
      <HeritageReportModal
        visible={reportModalVisible}
        articleId={article.id}
        onClose={() => setReportModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notFoundTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  backLink: {
    marginTop: 10,
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  backBtn: {
    paddingVertical: 6,
  },
  backBtnText: {
    fontSize: 14,
    fontWeight: '700',
  },
  reportBtn: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#EFEBD8',
  },
  reportBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '800',
  },
  dateText: {
    fontSize: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 30,
    marginBottom: 16,
  },
  authorSection: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    paddingVertical: 12,
    marginBottom: 14,
  },
  trustBox: {
    borderRadius: 10,
    borderWidth: 1,
    padding: 12,
    gap: 10,
    marginBottom: 14,
  },
  trustTitle: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  badgeRow: {
    gap: 2,
  },
  summaryBox: {
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  summaryText: {
    fontSize: 14,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  contentBody: {
    marginBottom: 16,
  },
  bodyText: {
    fontSize: 15,
    lineHeight: 24,
  },
  bottomReportBox: {
    borderTopWidth: 1,
    paddingTop: 16,
    marginTop: 20,
    alignItems: 'center',
  },
  bottomReportAction: {
    padding: 10,
  },
  bottomReportText: {
    fontSize: 12,
    textAlign: 'center',
  },
});
