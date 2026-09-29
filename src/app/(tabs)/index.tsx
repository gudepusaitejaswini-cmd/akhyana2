import React from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { AkhyanaHeader } from '@/components/akhyana-header';
import { AnnotationTag } from '@/components/annotation-tag';
import { AajHomePreview } from '@/components/daily-history/aaj-home-preview';
import {
  BorderRadius,
  BottomTabInset,
  MaxContentWidth,
  Spacing,
} from '@/constants/theme';
import { INITIAL_HERITAGE_ARTICLES } from '@/data/heritage-voices';
import { CIVILIZATIONS } from '@/data/civilizations';
import { useTheme } from '@/hooks/use-theme';

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  const featuredArticle = INITIAL_HERITAGE_ARTICLES[0];
  const featuredCivilization = CIVILIZATIONS[0];

  return (
    <ThemedView style={styles.screen}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: insets.top || Spacing.four,
            paddingBottom: insets.bottom + BottomTabInset + Spacing.eight,
          },
        ]}
        showsVerticalScrollIndicator={false}>
        <View style={styles.wrapper}>
          {/* Top Brand Header */}
          <AkhyanaHeader showTagline={true} />

          {/* Daily History Preview */}
          <AajHomePreview />

          {/* ================================================== */}
          {/* SECTION 1 — HERO BRANDING */}
          {/* ================================================== */}
          <View style={styles.heroSection}>
            <View style={styles.heroCard}>
              {/* Subtle background glow */}
              <View style={styles.heroGlow} />

              {/* Logo Emblem Display */}
              <View style={styles.heroLogoWrapper}>
                <Image
                  source={require('@/assets/images/akhyana-logo-full.jpg')}
                  style={styles.heroLogoImage}
                  resizeMode="contain"
                />
              </View>

              {/* Tagline Pill */}
              <View style={styles.taglinePill}>
                <ThemedText style={styles.taglinePillText}>
                  PLAY • EXPLORE • LEARN
                </ThemedText>
              </View>

              {/* Main Headline */}
              <ThemedText style={styles.heroHeadline}>
                History isn't just something you read.{'\n'}
                <ThemedText style={styles.heroHeadlineAccent}>
                  It's something you explore.
                </ThemedText>
              </ThemedText>

              {/* Supporting Subtext */}
              <ThemedText style={styles.heroSubtext}>
                Explore India's history, culture and heritage through stories,
                interactive experiences, games and voices from those who study
                and preserve it.
              </ThemedText>

              {/* CTA Action Buttons */}
              <View style={styles.heroActionsRow}>
                <Pressable
                  onPress={() => router.push('/explore')}
                  style={({ pressed }) => [
                    styles.primaryCtaBtn,
                    pressed && styles.btnPressed,
                  ]}>
                  <ThemedText style={styles.primaryCtaText}>
                    START EXPLORING →
                  </ThemedText>
                </Pressable>

                <Pressable
                  onPress={() => router.push('/games')}
                  style={({ pressed }) => [
                    styles.secondaryCtaBtn,
                    pressed && styles.btnPressed,
                  ]}>
                  <ThemedText style={styles.secondaryCtaText}>
                    PLAY & LEARN 🎮
                  </ThemedText>
                </Pressable>
              </View>
            </View>
          </View>

          {/* ================================================== */}
          {/* SECTION 2 — WHAT IS AKHYANA? */}
          {/* ================================================== */}
          <View style={styles.sectionShell}>
            <View style={styles.sectionHeader}>
              <AnnotationTag label="THE AKHYANA EXPERIENCE" variant="highlight" />
              <ThemedText type="heroDisplay" style={styles.sectionTitleDark}>
                From memorization{'\n'}to living experience.
              </ThemedText>
              <ThemedText type="editorialLead" style={styles.sectionSubtitle}>
                Akhyana turns history from something you memorize into something
                you experience. We bring verified historical evidence into interactive
                investigations, games, and research.
              </ThemedText>
            </View>

            {/* 4 Pillars Grid */}
            <View style={[styles.pillarsGrid, isMobile && styles.pillarsGridMobile]}>
              <View style={styles.pillarCard}>
                <ThemedText style={styles.pillarIcon}>🧭</ThemedText>
                <ThemedText style={styles.pillarTitle}>Explore Across Time</ThemedText>
                <ThemedText style={styles.pillarDesc}>
                  Journey through 5,000+ years of Indian civilization, from Harappan
                  drainage engineering to 20th-century democratic movements.
                </ThemedText>
              </View>

              <View style={styles.pillarCard}>
                <ThemedText style={styles.pillarIcon}>📜</ThemedText>
                <ThemedText style={styles.pillarTitle}>Evidence & Sources</ThemedText>
                <ThemedText style={styles.pillarDesc}>
                  Every event links directly to authenticated institutional records,
                  the National Archives of India, ASI surveys, and India Code.
                </ThemedText>
              </View>

              <View style={styles.pillarCard}>
                <ThemedText style={styles.pillarIcon}>🎮</ThemedText>
                <ThemedText style={styles.pillarTitle}>Games of Mind</ThemedText>
                <ThemedText style={styles.pillarDesc}>
                  Sharpen historical recall with ChronoSearch word-hunts and 6-question
                  Ludo civilization duels without relying on dice luck.
                </ThemedText>
              </View>

              <View style={styles.pillarCard}>
                <ThemedText style={styles.pillarIcon}>✍️</ThemedText>
                <ThemedText style={styles.pillarTitle}>Heritage Voices</ThemedText>
                <ThemedText style={styles.pillarDesc}>
                  Peer-reviewed fieldwork, interpretations, and research essays contributed
                  by archaeologists, epigraphists, and historians.
                </ThemedText>
              </View>
            </View>
          </View>

          {/* ================================================== */}
          {/* SECTION 3 — EXPLORE */}
          {/* ================================================== */}
          <View style={styles.sectionShell}>
            <View style={styles.sectionHeader}>
              <AnnotationTag label="CURATED DISCOVERY" variant="neutral" />
              <ThemedText type="heroDisplay" style={styles.sectionTitleDark}>
                Explore India across time.
              </ThemedText>
              <ThemedText type="editorialLead" style={styles.sectionSubtitle}>
                Choose your pathway: immerse in great civilizations, trace key decades,
                or follow specific historical events through 10 focused learning lenses.
              </ThemedText>
            </View>

            <View style={[styles.cardsGrid, isMobile && styles.cardsGridMobile]}>
              {/* Card 1: Civilizations */}
              <View style={styles.featureCard}>
                <View style={styles.cardHeaderRow}>
                  <ThemedText style={styles.cardEyebrow}>01 / CIVILIZATIONS</ThemedText>
                  <View style={styles.badgePill}>
                    <ThemedText style={styles.badgePillText}>Interactive</ThemedText>
                  </View>
                </View>
                <ThemedText style={styles.cardHeading}>
                  {featuredCivilization.name}
                </ThemedText>
                <ThemedText style={styles.cardPeriod}>
                  {featuredCivilization.timeRange}
                </ThemedText>
                <ThemedText style={styles.cardBody}>
                  {featuredCivilization.tagline}
                </ThemedText>
                <Pressable
                  onPress={() => router.push('/explore')}
                  style={({ pressed }) => [
                    styles.cardActionBtn,
                    pressed && styles.btnPressed,
                  ]}>
                  <ThemedText style={styles.cardActionText}>
                    EXPLORE CIVILIZATIONS →
                  </ThemedText>
                </Pressable>
              </View>

              {/* Card 2: Timeline of Decades */}
              <View style={styles.featureCard}>
                <View style={styles.cardHeaderRow}>
                  <ThemedText style={styles.cardEyebrow}>02 / DECADES</ThemedText>
                  <View style={[styles.badgePill, { backgroundColor: '#FAF3E3' }]}>
                    <ThemedText style={[styles.badgePillText, { color: '#7D5C1E' }]}>Timeline</ThemedText>
                  </View>
                </View>
                <ThemedText style={styles.cardHeading}>
                  The 1890s: Reform & Contestation
                </ThemedText>
                <ThemedText style={styles.cardPeriod}>
                  Late Colonial India (1890–1900)
                </ThemedText>
                <ThemedText style={styles.cardBody}>
                  The Indian Councils Act, famine relief inquiries, public health crises,
                  and Birsa Munda's Ulgulan movement.
                </ThemedText>
                <Pressable
                  onPress={() => router.push('/decade/1890s')}
                  style={({ pressed }) => [
                    styles.cardActionBtn,
                    pressed && styles.btnPressed,
                  ]}>
                  <ThemedText style={styles.cardActionText}>
                    VIEW 1890s DECADE →
                  </ThemedText>
                </Pressable>
              </View>

              {/* Card 3: Milestone Events */}
              <View style={styles.featureCard}>
                <View style={styles.cardHeaderRow}>
                  <ThemedText style={styles.cardEyebrow}>03 / MILESTONES</ThemedText>
                  <View style={[styles.badgePill, { backgroundColor: '#E8F1EC' }]}>
                    <ThemedText style={[styles.badgePillText, { color: '#0B332B' }]}>33 Events</ThemedText>
                  </View>
                </View>
                <ThemedText style={styles.cardHeading}>
                  Documented Events & Archives
                </ThemedText>
                <ThemedText style={styles.cardPeriod}>
                  Setting • People • Evidence • Legacy
                </ThemedText>
                <ThemedText style={styles.cardBody}>
                  Investigate verified historical events through focused subtopics,
                  chronology, and primary source evidence.
                </ThemedText>
                <Pressable
                  onPress={() => router.push('/explore')}
                  style={({ pressed }) => [
                    styles.cardActionBtn,
                    pressed && styles.btnPressed,
                  ]}>
                  <ThemedText style={styles.cardActionText}>
                    BROWSE ALL EVENTS →
                  </ThemedText>
                </Pressable>
              </View>
            </View>
          </View>

          {/* ================================================== */}
          {/* SECTION 4 — HERITAGE VOICES */}
          {/* ================================================== */}
          <View style={styles.sectionShell}>
            <View style={styles.voicesBanner}>
              <View style={styles.voicesHeader}>
                <AnnotationTag label="RESEARCH & PERSPECTIVES" variant="highlight" />
                <ThemedText style={styles.voicesMainTitle}>
                  Heritage Voices
                </ThemedText>
                <ThemedText style={styles.voicesQuote}>
                  "History is not only what happened. It is also how we understand
                  and interpret what happened."
                </ThemedText>
              </View>

              {/* Featured Article Card */}
              {featuredArticle && (
                <View style={styles.featuredVoiceCard}>
                  <View style={styles.voiceMetaRow}>
                    <View style={styles.voiceCategoryPill}>
                      <ThemedText style={styles.voiceCategoryText}>
                        {featuredArticle.category.toUpperCase()}
                      </ThemedText>
                    </View>
                    <ThemedText style={styles.voiceReadTime}>
                      ⏱️ {featuredArticle.readTimeMinutes} min read
                    </ThemedText>
                  </View>

                  <ThemedText style={styles.voiceArticleTitle}>
                    {featuredArticle.title}
                  </ThemedText>

                  <ThemedText style={styles.voiceSummary}>
                    {featuredArticle.summary}
                  </ThemedText>

                  <View style={styles.voiceActionRow}>
                    <Pressable
                      onPress={() => router.push(`/heritage-voices/article/${featuredArticle.id}`)}
                      style={({ pressed }) => [
                        styles.voiceReadBtn,
                        pressed && styles.btnPressed,
                      ]}>
                      <ThemedText style={styles.voiceReadBtnText}>
                        READ RESEARCH ARTICLE →
                      </ThemedText>
                    </Pressable>

                    <Pressable
                      onPress={() => router.push('/heritage-voices')}
                      style={({ pressed }) => [
                        styles.voiceBrowseBtn,
                        pressed && styles.btnPressed,
                      ]}>
                      <ThemedText style={styles.voiceBrowseBtnText}>
                        ALL VOICES ({INITIAL_HERITAGE_ARTICLES.length})
                      </ThemedText>
                    </Pressable>
                  </View>
                </View>
              )}
            </View>
          </View>

          {/* ================================================== */}
          {/* SECTION 5 — LEARN THROUGH PLAY */}
          {/* ================================================== */}
          <View style={styles.sectionShell}>
            <View style={styles.sectionHeader}>
              <AnnotationTag label="INTERACTIVE LEARNING" variant="neutral" />
              <ThemedText type="heroDisplay" style={styles.sectionTitleDark}>
                Learn through play.
              </ThemedText>
              <ThemedText type="editorialLead" style={styles.sectionSubtitle}>
                Knowledge is more memorable when it moves. Master Indian history
                without feeling like you are studying.
              </ThemedText>
            </View>

            <View style={[styles.gamesGrid, isMobile && styles.gamesGridMobile]}>
              {/* Game 1: ChronoSearch */}
              <View style={[styles.gameCard, { backgroundColor: '#FAF3E3', borderColor: '#E8DCBD' }]}>
                <View style={styles.gameNumberPill}>
                  <ThemedText style={styles.gameNumberText}>GAME / 01</ThemedText>
                </View>
                <ThemedText style={styles.gameTitle}>
                  Chrono<ThemedText style={{ color: '#0B332B' }}>Search</ThemedText>
                </ThemedText>
                <ThemedText style={styles.gameTagline}>
                  "Hunt Through History."
                </ThemedText>
                <View style={styles.gameFeaturesList}>
                  <ThemedText style={styles.gameFeatureItem}>
                    • Uncover hidden historical terms in authentic grid puzzles
                  </ThemedText>
                  <ThemedText style={styles.gameFeatureItem}>
                    • Reveal verified artifact cards upon word discovery
                  </ThemedText>
                  <ThemedText style={styles.gameFeatureItem}>
                    • Answer knowledge check questions to earn XP
                  </ThemedText>
                </View>
                <Pressable
                  onPress={() => router.push('/game/chronosearch')}
                  style={({ pressed }) => [
                    styles.gamePlayBtn,
                    { backgroundColor: '#0B332B' },
                    pressed && styles.btnPressed,
                  ]}>
                  <ThemedText style={styles.gamePlayBtnText}>
                    PLAY CHRONOSEARCH →
                  </ThemedText>
                </Pressable>
              </View>

              {/* Game 2: Ludo / Chaupar */}
              <View style={[styles.gameCard, { backgroundColor: '#E8F1EC', borderColor: '#C8DDD0' }]}>
                <View style={[styles.gameNumberPill, { backgroundColor: '#0B332B' }]}>
                  <ThemedText style={[styles.gameNumberText, { color: '#D6A84F' }]}>GAME / 02</ThemedText>
                </View>
                <ThemedText style={styles.gameTitle}>
                  Ludo: <ThemedText style={{ color: '#A84B32' }}>Civilization</ThemedText>
                </ThemedText>
                <ThemedText style={styles.gameTagline}>
                  "Every move has a story."
                </ThemedText>
                <View style={styles.gameFeaturesList}>
                  <ThemedText style={styles.gameFeatureItem}>
                    • Rapid-fire 6-question quiz turn engine
                  </ThemedText>
                  <ThemedText style={styles.gameFeatureItem}>
                    • Zero dice luck — accuracy calculates movement steps
                  </ThemedText>
                  <ThemedText style={styles.gameFeatureItem}>
                    • Historical token collisions trigger knowledge duels
                  </ThemedText>
                </View>
                <Pressable
                  onPress={() => router.push('/game/ludo')}
                  style={({ pressed }) => [
                    styles.gamePlayBtn,
                    { backgroundColor: '#A84B32' },
                    pressed && styles.btnPressed,
                  ]}>
                  <ThemedText style={styles.gamePlayBtnText}>
                    PLAY LUDO DUEL →
                  </ThemedText>
                </Pressable>
              </View>
            </View>
          </View>

          {/* ================================================== */}
          {/* SECTION 6 — PAST → PRESENT (THE LIVING THREAD) */}
          {/* ================================================== */}
          <View style={styles.sectionShell}>
            <View style={styles.sectionHeader}>
              <AnnotationTag label="THE LIVING THREAD" variant="highlight" />
              <ThemedText type="heroDisplay" style={styles.sectionTitleDark}>
                Past → Change → Today.
              </ThemedText>
              <ThemedText type="editorialLead" style={styles.sectionSubtitle}>
                History is not an isolated past. It is the living architecture of
                modern Indian society, science, and governance.
              </ThemedText>
            </View>

            <View style={styles.threadContainer}>
              {/* Connection 1 */}
              <View style={styles.threadRow}>
                <View style={styles.threadStep}>
                  <ThemedText style={styles.threadEraBadge}>2500 BCE</ThemedText>
                  <ThemedText style={styles.threadStepTitle}>Harappan City Planning</ThemedText>
                  <ThemedText style={styles.threadStepDesc}>Orthogonal grid streets & standardized brick sewers.</ThemedText>
                </View>
                <ThemedText style={styles.threadArrow}>→</ThemedText>
                <View style={styles.threadStep}>
                  <ThemedText style={styles.threadEraBadge}>TODAY</ThemedText>
                  <ThemedText style={styles.threadStepTitle}>Smart Cities Mission</ThemedText>
                  <ThemedText style={styles.threadStepDesc}>Urban drainage, zoning, and sustainable municipal infrastructure.</ThemedText>
                </View>
              </View>

              {/* Connection 2 */}
              <View style={styles.threadRow}>
                <View style={styles.threadStep}>
                  <ThemedText style={styles.threadEraBadge}>920 CE</ThemedText>
                  <ThemedText style={styles.threadStepTitle}>Chola Uttaramerur</ThemedText>
                  <ThemedText style={styles.threadStepDesc}>Inscriptions detailing qualifications, secret ballot, and village assemblies.</ThemedText>
                </View>
                <ThemedText style={styles.threadArrow}>→</ThemedText>
                <View style={styles.threadStep}>
                  <ThemedText style={styles.threadEraBadge}>TODAY</ThemedText>
                  <ThemedText style={styles.threadStepTitle}>Panchayati Raj & Republic</ThemedText>
                  <ThemedText style={styles.threadStepDesc}>Local self-governance and constitutional voting rights.</ThemedText>
                </View>
              </View>

              {/* Connection 3 */}
              <View style={styles.threadRow}>
                <View style={styles.threadStep}>
                  <ThemedText style={styles.threadEraBadge}>499 CE</ThemedText>
                  <ThemedText style={styles.threadStepTitle}>Aryabhatiya Astronomy</ThemedText>
                  <ThemedText style={styles.threadStepDesc}>Earth's rotation, planetary models, and decimal mathematics.</ThemedText>
                </View>
                <ThemedText style={styles.threadArrow}>→</ThemedText>
                <View style={styles.threadStep}>
                  <ThemedText style={styles.threadEraBadge}>TODAY</ThemedText>
                  <ThemedText style={styles.threadStepTitle}>ISRO Deep Space Missions</ThemedText>
                  <ThemedText style={styles.threadStepDesc}>Chandrayaan-3 lunar landing and Aditya-L1 solar exploration.</ThemedText>
                </View>
              </View>
            </View>
          </View>

          {/* ================================================== */}
          {/* SECTION 7 — FINAL CALL TO ACTION */}
          {/* ================================================== */}
          <View style={styles.sectionShell}>
            <View style={styles.finalCtaBox}>
              <ThemedText style={styles.finalCtaEyebrow}>YOUR JOURNEY BEGINS</ThemedText>
              <ThemedText style={styles.finalCtaHeading}>
                Experience India's stories.{'\n'}
                Not just dates.
              </ThemedText>
              <ThemedText style={styles.finalCtaSubtext}>
                Join thousands exploring our cultural roots through verified evidence,
                archival records, and engaging interactive challenges.
              </ThemedText>
              <View style={styles.finalCtaBtnRow}>
                <Pressable
                  onPress={() => router.push('/explore')}
                  style={({ pressed }) => [
                    styles.finalCtaGoldBtn,
                    pressed && styles.btnPressed,
                  ]}>
                  <ThemedText style={styles.finalCtaGoldBtnText}>
                    START EXPLORING AKHYANA →
                  </ThemedText>
                </Pressable>

                <Pressable
                  onPress={() => router.push('/games')}
                  style={({ pressed }) => [
                    styles.finalCtaOutlinedBtn,
                    pressed && styles.btnPressed,
                  ]}>
                  <ThemedText style={styles.finalCtaOutlinedBtnText}>
                    PLAY HISTORY GAMES 🎮
                  </ThemedText>
                </Pressable>
              </View>
            </View>
          </View>

          {/* ================================================== */}
          {/* FOOTER & INSTITUTIONAL TRUST */}
          {/* ================================================== */}
          <View style={styles.footerShell}>
            <View style={styles.footerBrandRow}>
              <View style={styles.footerLogoBadge}>
                <Image
                  source={require('@/assets/images/akhyana-logo-icon.jpg')}
                  style={styles.footerLogoImg}
                  resizeMode="cover"
                />
              </View>
              <View>
                <ThemedText style={styles.footerWordmark}>AKHYANA</ThemedText>
                <ThemedText style={styles.footerTagline}>PLAY • EXPLORE • LEARN</ThemedText>
              </View>
            </View>

            <ThemedText style={styles.footerSourcesTitle}>
              OFFICIAL RECORDS & ARCHIVAL REFERENCES
            </ThemedText>
            <View style={styles.sourcesTagsWrap}>
              {[
                'National Archives of India',
                'Archaeological Survey of India',
                'Parliament of India Archives',
                'India Code Legislative Portal',
                'Indian Space Research Organisation',
                'Reserve Bank of India History Cell',
                'Ministry of Culture',
              ].map((s) => (
                <View key={s} style={styles.sourceTag}>
                  <ThemedText style={styles.sourceTagText}>{s}</ThemedText>
                </View>
              ))}
            </View>

            <View style={styles.footerDivider} />

            <View style={styles.footerNavLinks}>
              <Pressable onPress={() => router.push('/')}><ThemedText style={styles.footerNavLink}>Home</ThemedText></Pressable>
              <Pressable onPress={() => router.push('/explore')}><ThemedText style={styles.footerNavLink}>Explore</ThemedText></Pressable>
              <Pressable onPress={() => router.push('/games')}><ThemedText style={styles.footerNavLink}>Games</ThemedText></Pressable>
              <Pressable onPress={() => router.push('/aaj-ka-akhyana')}><ThemedText style={styles.footerNavLink}>Aaj Ka Akhyana</ThemedText></Pressable>
              <Pressable onPress={() => router.push('/heritage-voices')}><ThemedText style={styles.footerNavLink}>Heritage Voices</ThemedText></Pressable>
              <Pressable onPress={() => router.push('/progress')}><ThemedText style={styles.footerNavLink}>Progress</ThemedText></Pressable>
            </View>

            <ThemedText style={styles.copyrightText}>
              © 2026 Akhyana. Dedicated to evidence-backed Indian history, culture and heritage learning.
            </ThemedText>
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F8F3E8' },
  content: { alignItems: 'center' },
  wrapper: { width: '100%', maxWidth: MaxContentWidth },

  // Hero Section
  heroSection: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.two,
    paddingBottom: Spacing.four,
  },
  heroCard: {
    backgroundColor: '#0B332B',
    borderRadius: BorderRadius.xl,
    paddingVertical: Spacing.six,
    paddingHorizontal: Spacing.five,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#D6A84F',
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#0B332B',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  heroGlow: {
    position: 'absolute',
    top: -50,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(214, 168, 79, 0.08)',
  },
  heroLogoWrapper: {
    width: 220,
    height: 220,
    borderRadius: 110,
    overflow: 'hidden',
    marginBottom: Spacing.three,
    borderWidth: 2,
    borderColor: '#D6A84F',
    shadowColor: '#D6A84F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  heroLogoImage: {
    width: '100%',
    height: '100%',
  },
  taglinePill: {
    backgroundColor: 'rgba(214, 168, 79, 0.15)',
    borderColor: '#D6A84F',
    borderWidth: 1,
    paddingVertical: 4,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginBottom: Spacing.three,
  },
  taglinePillText: {
    color: '#D6A84F',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 2,
  },
  heroHeadline: {
    color: '#F7F1E3',
    fontSize: 28,
    lineHeight: 36,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: Spacing.three,
  },
  heroHeadlineAccent: {
    color: '#D6A84F',
  },
  heroSubtext: {
    color: '#D8DDD6',
    fontSize: 15,
    lineHeight: 23,
    textAlign: 'center',
    maxWidth: 580,
    marginBottom: Spacing.five,
  },
  heroActionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.three,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryCtaBtn: {
    backgroundColor: '#D6A84F',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: BorderRadius.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  primaryCtaText: {
    color: '#0B332B',
    fontWeight: '900',
    fontSize: 12,
    letterSpacing: 1.5,
  },
  secondaryCtaBtn: {
    backgroundColor: 'transparent',
    borderColor: '#D6A84F',
    borderWidth: 1.5,
    paddingVertical: 13,
    paddingHorizontal: 22,
    borderRadius: BorderRadius.lg,
  },
  secondaryCtaText: {
    color: '#F7F1E3',
    fontWeight: '800',
    fontSize: 12,
    letterSpacing: 1,
  },
  btnPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },

  // Generic Section Shell
  sectionShell: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.six,
  },
  sectionHeader: {
    marginBottom: Spacing.four,
    gap: Spacing.two,
  },
  sectionTitleDark: {
    color: '#0B332B',
  },
  sectionSubtitle: {
    color: '#6F6A60',
  },

  // Section 2: Pillars Grid
  pillarsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.three,
  },
  pillarsGridMobile: {
    flexDirection: 'column',
  },
  pillarCard: {
    flex: 1,
    minWidth: 160,
    backgroundColor: '#FFFDF7',
    borderWidth: 1,
    borderColor: '#E8E1D3',
    borderRadius: BorderRadius.lg,
    padding: Spacing.four,
    gap: Spacing.two,
  },
  pillarIcon: {
    fontSize: 28,
    marginBottom: 4,
  },
  pillarTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0B332B',
  },
  pillarDesc: {
    fontSize: 13,
    lineHeight: 19,
    color: '#6F6A60',
  },

  // Section 3: Cards Grid
  cardsGrid: {
    flexDirection: 'row',
    gap: Spacing.three,
  },
  cardsGridMobile: {
    flexDirection: 'column',
  },
  featureCard: {
    flex: 1,
    backgroundColor: '#FFFDF7',
    borderWidth: 1,
    borderColor: '#E8E1D3',
    borderRadius: BorderRadius.lg,
    padding: Spacing.four,
    gap: Spacing.two,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  cardEyebrow: {
    fontSize: 10,
    fontWeight: '800',
    color: '#A84B32',
    letterSpacing: 1.2,
  },
  badgePill: {
    backgroundColor: '#E8F1EC',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  badgePillText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0B332B',
  },
  cardHeading: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0B332B',
    lineHeight: 24,
  },
  cardPeriod: {
    fontSize: 12,
    fontWeight: '700',
    color: '#7D5C1E',
  },
  cardBody: {
    fontSize: 13,
    lineHeight: 19,
    color: '#6F6A60',
    flex: 1,
  },
  cardActionBtn: {
    marginTop: Spacing.two,
    paddingVertical: 10,
    alignItems: 'flex-start',
  },
  cardActionText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#A84B32',
    letterSpacing: 1,
  },

  // Section 4: Heritage Voices Banner
  voicesBanner: {
    backgroundColor: '#0B332B',
    borderRadius: BorderRadius.xl,
    padding: Spacing.five,
    borderWidth: 1.5,
    borderColor: '#D6A84F',
    gap: Spacing.four,
  },
  voicesHeader: {
    gap: Spacing.two,
  },
  voicesMainTitle: {
    color: '#F7F1E3',
    fontSize: 26,
    fontWeight: '900',
  },
  voicesQuote: {
    color: '#D6A84F',
    fontSize: 15,
    fontStyle: 'italic',
    lineHeight: 22,
  },
  featuredVoiceCard: {
    backgroundColor: '#FFFDF7',
    borderRadius: BorderRadius.lg,
    padding: Spacing.four,
    gap: Spacing.two,
  },
  voiceMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  voiceCategoryPill: {
    backgroundColor: '#0B332B',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  voiceCategoryText: {
    color: '#F7F1E3',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  voiceReadTime: {
    fontSize: 12,
    color: '#6F6A60',
    fontWeight: '600',
  },
  voiceArticleTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0B332B',
    lineHeight: 24,
  },
  voiceSummary: {
    fontSize: 13,
    lineHeight: 20,
    color: '#6F6A60',
  },
  voiceActionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
    marginTop: Spacing.two,
    paddingTop: Spacing.two,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E8E1D3',
  },
  voiceReadBtn: {
    backgroundColor: '#0B332B',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: BorderRadius.md,
  },
  voiceReadBtnText: {
    color: '#F7F1E3',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },
  voiceBrowseBtn: {
    borderColor: '#0B332B',
    borderWidth: 1,
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: BorderRadius.md,
  },
  voiceBrowseBtnText: {
    color: '#0B332B',
    fontSize: 11,
    fontWeight: '800',
  },

  // Section 5: Games Grid
  gamesGrid: {
    flexDirection: 'row',
    gap: Spacing.three,
  },
  gamesGridMobile: {
    flexDirection: 'column',
  },
  gameCard: {
    flex: 1,
    borderWidth: 1,
    borderRadius: BorderRadius.lg,
    padding: Spacing.four,
    gap: Spacing.two,
  },
  gameNumberPill: {
    alignSelf: 'flex-start',
    backgroundColor: '#D6A84F',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  gameNumberText: {
    color: '#0B332B',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  gameTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0B332B',
  },
  gameTagline: {
    fontSize: 13,
    fontStyle: 'italic',
    color: '#6F6A60',
  },
  gameFeaturesList: {
    gap: 6,
    marginVertical: Spacing.two,
  },
  gameFeatureItem: {
    fontSize: 12.5,
    lineHeight: 18,
    color: '#252525',
  },
  gamePlayBtn: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    marginTop: 'auto',
  },
  gamePlayBtnText: {
    color: '#FFFDF7',
    fontSize: 11.5,
    fontWeight: '900',
    letterSpacing: 1.2,
  },

  // Section 6: Thread
  threadContainer: {
    backgroundColor: '#FFFDF7',
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: '#E8E1D3',
    padding: Spacing.four,
    gap: Spacing.four,
  },
  threadRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: Spacing.three,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E8E1D3',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  threadStep: {
    flex: 1,
    minWidth: 140,
    gap: 2,
  },
  threadEraBadge: {
    fontSize: 10,
    fontWeight: '900',
    color: '#A84B32',
    letterSpacing: 1.2,
  },
  threadStepTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0B332B',
  },
  threadStepDesc: {
    fontSize: 12,
    color: '#6F6A60',
    lineHeight: 17,
  },
  threadArrow: {
    fontSize: 20,
    color: '#D6A84F',
    fontWeight: '900',
    paddingHorizontal: Spacing.two,
  },

  // Section 7: Final CTA
  finalCtaBox: {
    backgroundColor: '#0B332B',
    borderRadius: BorderRadius.xl,
    padding: Spacing.six,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#D6A84F',
    gap: Spacing.three,
  },
  finalCtaEyebrow: {
    color: '#D6A84F',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 2,
  },
  finalCtaHeading: {
    color: '#F7F1E3',
    fontSize: 26,
    lineHeight: 34,
    fontWeight: '900',
    textAlign: 'center',
  },
  finalCtaSubtext: {
    color: '#D8DDD6',
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
    maxWidth: 520,
  },
  finalCtaBtnRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.three,
    marginTop: Spacing.two,
    justifyContent: 'center',
  },
  finalCtaGoldBtn: {
    backgroundColor: '#D6A84F',
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderRadius: BorderRadius.lg,
  },
  finalCtaGoldBtnText: {
    color: '#0B332B',
    fontWeight: '900',
    fontSize: 12,
    letterSpacing: 1.2,
  },
  finalCtaOutlinedBtn: {
    borderColor: '#D6A84F',
    borderWidth: 1.5,
    paddingVertical: 13,
    paddingHorizontal: 20,
    borderRadius: BorderRadius.lg,
  },
  finalCtaOutlinedBtnText: {
    color: '#F7F1E3',
    fontWeight: '800',
    fontSize: 12,
  },

  // Footer
  footerShell: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.eight,
    paddingBottom: Spacing.four,
    alignItems: 'center',
    gap: Spacing.three,
  },
  footerBrandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  footerLogoBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: '#D6A84F',
    backgroundColor: '#0B332B',
  },
  footerLogoImg: {
    width: '100%',
    height: '100%',
  },
  footerWordmark: {
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 2.5,
    color: '#0B332B',
  },
  footerTagline: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.5,
    color: '#A84B32',
  },
  footerSourcesTitle: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.5,
    color: '#7D5C1E',
    marginTop: Spacing.two,
  },
  sourcesTagsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    justifyContent: 'center',
    maxWidth: 680,
  },
  sourceTag: {
    backgroundColor: '#FFFDF7',
    borderColor: '#E8E1D3',
    borderWidth: 1,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  sourceTagText: {
    fontSize: 10.5,
    color: '#6F6A60',
    fontWeight: '600',
  },
  footerDivider: {
    width: '100%',
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#D2C8B8',
    marginVertical: Spacing.two,
  },
  footerNavLinks: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.four,
    justifyContent: 'center',
  },
  footerNavLink: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0B332B',
  },
  copyrightText: {
    fontSize: 11,
    color: '#6F6A60',
    textAlign: 'center',
    marginTop: Spacing.two,
  },
});
