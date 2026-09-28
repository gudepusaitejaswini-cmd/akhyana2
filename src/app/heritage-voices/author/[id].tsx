import React from 'react';
import { View, StyleSheet, Text, ScrollView, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getHeritageExpertById, getArticlesByAuthor } from '@/data/heritage-voices';
import { HeritageVerificationBadge } from '@/components/heritage-voices/HeritageVerificationBadge';
import { HeritageArticleCard } from '@/components/heritage-voices/HeritageArticleCard';
import { Colors } from '@/constants/theme';

export default function HeritageAuthorScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colors = Colors.light;

  const expert = getHeritageExpertById(id);
  const articles = expert ? getArticlesByAuthor(expert.id) : [];

  if (!expert) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top + 20 }]}>
        <Text style={[styles.notFound, { color: colors.text }]}>Expert profile not found.</Text>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={{ color: colors.primary, fontWeight: '700' }}>← Go Back</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 40 },
        ]}
        showsVerticalScrollIndicator={false}>
        {/* Back Button */}
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={[styles.backBtnText, { color: colors.primary }]}>← Back</Text>
        </Pressable>

        {/* Profile Header */}
        <View style={[styles.profileCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
          <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
            <Text style={styles.avatarText}>
              {expert.name
                .split(' ')
                .map((n) => n[0])
                .slice(0, 2)
                .join('')}
            </Text>
          </View>

          <Text style={[styles.name, { color: colors.text }]}>{expert.name}</Text>
          {expert.designation && (
            <Text style={[styles.designation, { color: colors.textSecondary }]}>
              {expert.designation}
            </Text>
          )}
          {expert.institution && (
            <Text style={[styles.institution, { color: colors.textMuted }]}>
              {expert.institution}
            </Text>
          )}

          <View style={{ marginVertical: 8 }}>
            <HeritageVerificationBadge status={expert.verificationStatus} isDemo={expert.isDemo} showExplanation />
          </View>

          {expert.bio && (
            <Text style={[styles.bio, { color: colors.textSecondary }]}>{expert.bio}</Text>
          )}
        </View>

        {/* Credentials Section */}
        {expert.credentials && expert.credentials.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Verified Qualifications & Fieldwork</Text>
            <View style={styles.credentialsList}>
              {expert.credentials.map((cred) => (
                <View
                  key={cred.id}
                  style={[styles.credCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
                  <Text style={[styles.credTitle, { color: colors.text }]}>{cred.title}</Text>
                  {cred.institution && (
                    <Text style={[styles.credInst, { color: colors.textSecondary }]}>
                      {cred.institution} {cred.year ? `· ${cred.year}` : ''}
                    </Text>
                  )}
                  {cred.verificationNote && (
                    <Text style={[styles.credNote, { color: colors.textMuted }]}>
                      {cred.verificationNote}
                    </Text>
                  )}
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Published Research Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Contributions by {expert.name} ({articles.length})
          </Text>
          <View style={styles.articlesList}>
            {articles.map((art) => (
              <HeritageArticleCard key={art.id} article={art} />
            ))}
          </View>
        </View>
      </ScrollView>
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
  backBtn: {
    paddingVertical: 6,
    marginBottom: 8,
  },
  backBtnText: {
    fontSize: 14,
    fontWeight: '700',
  },
  notFound: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 40,
  },
  profileCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 18,
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  avatarText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 22,
  },
  name: {
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
  },
  designation: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 2,
  },
  institution: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 1,
  },
  bio: {
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
    marginTop: 6,
  },
  section: {
    marginBottom: 20,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 4,
  },
  credentialsList: {
    gap: 8,
  },
  credCard: {
    borderRadius: 8,
    borderWidth: 1,
    padding: 12,
    gap: 2,
  },
  credTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  credInst: {
    fontSize: 12,
  },
  credNote: {
    fontSize: 11,
    fontStyle: 'italic',
    marginTop: 4,
  },
  articlesList: {
    gap: 12,
  },
});
