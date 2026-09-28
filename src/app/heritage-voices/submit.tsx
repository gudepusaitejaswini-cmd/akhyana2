import React, { useState } from 'react';
import { View, StyleSheet, Text, ScrollView, TextInput, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  HERITAGE_CATEGORIES,
  HERITAGE_EXPERTS,
  submitHeritageArticle,
} from '@/data/heritage-voices';
import { HeritageSource, HeritageSourceType } from '@/types/heritage-voices';
import { Colors } from '@/constants/theme';

export default function ArticleSubmitScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colors = Colors.light;

  // For testing verification states in MVP demo:
  // Active expert can be selected to simulate verified vs unverified/pending contributors
  const [selectedAuthorId, setSelectedAuthorId] = useState<string>(HERITAGE_EXPERTS[0]?.id || '');
  const activeExpert = HERITAGE_EXPERTS.find((e) => e.id === selectedAuthorId);

  // Multi-step: 1 = Details, 2 = Sources, 3 = Review, 4 = Confirmation
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form Fields
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [category, setCategory] = useState<string>(HERITAGE_CATEGORIES[1]);
  const [tagsText, setTagsText] = useState('');
  const [content, setContent] = useState('');
  const [contentNote, setContentNote] = useState('');
  const [evidenceSummary, setEvidenceSummary] = useState('');
  const [authorPerspective, setAuthorPerspective] = useState('');

  // Sources State (At least one source/reference required)
  const [sources, setSources] = useState<HeritageSource[]>([]);
  const [newSourceTitle, setNewSourceTitle] = useState('');
  const [newSourceAuthor, setNewSourceAuthor] = useState('');
  const [newSourcePublisher, setNewSourcePublisher] = useState('');
  const [newSourceYear, setNewSourceYear] = useState('');
  const [newSourceType, setNewSourceType] = useState<HeritageSourceType>('academic');

  const [validationError, setValidationError] = useState('');

  // Strict Access Control Guard:
  const isVerifiedContributor = activeExpert && activeExpert.verificationStatus === 'verified';

  if (!isVerifiedContributor) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.contentWrapper, { paddingTop: insets.top + 20 }]}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Text style={[styles.backBtnText, { color: colors.primary }]}>← Back</Text>
          </Pressable>

          <View style={[styles.warningCard, { backgroundColor: colors.warningLight, borderColor: colors.warning }]}>
            <Text style={styles.warningIcon}>🔒</Text>
            <Text style={[styles.warningTitle, { color: colors.text }]}>Expert Verification Required</Text>
            <Text style={[styles.warningDesc, { color: colors.textSecondary }]}>
              Only verified heritage experts and researchers can submit articles for review. Unverified contributors cannot publish or submit articles.
            </Text>
          </View>
        </View>
      </View>
    );
  }

  const handleStep1Next = () => {
    if (!title.trim() || !summary.trim() || !content.trim()) {
      setValidationError('Please fill in the required fields: Title, Summary, and Article Content.');
      return;
    }
    setValidationError('');
    setStep(2);
  };

  const handleAddSource = () => {
    if (!newSourceTitle.trim()) {
      setValidationError('Source title is required.');
      return;
    }
    const newSrc: HeritageSource = {
      id: 'src-' + String(Date.now()),
      title: newSourceTitle.trim(),
      author: newSourceAuthor.trim() || undefined,
      publisher: newSourcePublisher.trim() || undefined,
      year: newSourceYear.trim() || undefined,
      sourceType: newSourceType,
    };
    setSources([...sources, newSrc]);
    setNewSourceTitle('');
    setNewSourceAuthor('');
    setNewSourcePublisher('');
    setNewSourceYear('');
    setValidationError('');
  };

  const handleRemoveSource = (id: string) => {
    setSources(sources.filter((s: HeritageSource) => s.id !== id));
  };

  const handleStep2Next = () => {
    if (sources.length === 0) {
      setValidationError('At least one source / reference citation is required.');
      return;
    }
    setValidationError('');
    setStep(3);
  };

  const handleSubmit = () => {
    // Double check submission access control
    if (!activeExpert || activeExpert.verificationStatus !== 'verified') {
      setValidationError('Expert Verification Required: Only verified contributors can submit articles.');
      return;
    }
    if (sources.length === 0) {
      setValidationError('At least one source / reference citation is required.');
      return;
    }

    submitHeritageArticle({
      title: title.trim(),
      summary: summary.trim(),
      content: content.trim(),
      authorId: activeExpert.id,
      category,
      tags: tagsText.split(',').map((t: string) => t.trim()).filter(Boolean),
      sources,
      contentNote: contentNote.trim() || undefined,
      evidenceSummary: evidenceSummary.trim() || undefined,
      authorPerspective: authorPerspective.trim() || undefined,
      readTimeMinutes: Math.max(1, Math.ceil(content.trim().split(/\s+/).length / 150)),
    });
    setStep(4);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 60 },
        ]}
        showsVerticalScrollIndicator={false}>
        {/* Back Navigation */}
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={[styles.backBtnText, { color: colors.primary }]}>← Back</Text>
        </Pressable>

        {step < 4 && (
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text }]}>Submit Research Article</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Contributing as <Text style={{ fontWeight: '700' }}>{activeExpert.name}</Text> ({activeExpert.isDemo ? 'Demo Expert' : 'Verified Contributor'})
            </Text>

            {/* Stepper indicator */}
            <View style={styles.stepperRow}>
              <Text style={[styles.stepItem, step === 1 && styles.stepActive]}>1. Details</Text>
              <Text style={[styles.stepItem, step === 2 && styles.stepActive]}>2. Sources</Text>
              <Text style={[styles.stepItem, step === 3 && styles.stepActive]}>3. Review</Text>
            </View>
          </View>
        )}

        {validationError ? (
          <View style={[styles.errorBox, { backgroundColor: '#FDE8E8', borderColor: '#E53E3E' }]}>
            <Text style={{ color: '#9B2C2C', fontSize: 13, fontWeight: '600' }}>{validationError}</Text>
          </View>
        ) : null}

        {/* STEP 1: Article Details */}
        {step === 1 && (
          <View style={styles.formSection}>
            <Text style={[styles.fieldLabel, { color: colors.text }]}>Article Title *</Text>
            <TextInput
              style={[styles.input, { borderColor: colors.cardBorder, color: colors.text }]}
              placeholder="e.g. Stratigraphical Sequences at Sannati..."
              placeholderTextColor={colors.textMuted}
              value={title}
              onChangeText={setTitle}
            />

            <Text style={[styles.fieldLabel, { color: colors.text }]}>Summary / Abstract *</Text>
            <TextInput
              style={[styles.input, { borderColor: colors.cardBorder, color: colors.text, minHeight: 60 }]}
              placeholder="A concise 2-3 sentence overview..."
              placeholderTextColor={colors.textMuted}
              multiline
              numberOfLines={3}
              value={summary}
              onChangeText={setSummary}
            />

            <Text style={[styles.fieldLabel, { color: colors.text }]}>Category *</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
              {HERITAGE_CATEGORIES.filter((c) => c !== 'All').map((cat) => (
                <Pressable
                  key={cat}
                  style={[
                    styles.catChip,
                    { borderColor: colors.cardBorder },
                    category === cat && { backgroundColor: colors.primary, borderColor: colors.primary },
                  ]}
                  onPress={() => setCategory(cat)}>
                  <Text style={[styles.catText, { color: category === cat ? '#FFFFFF' : colors.text }]}>
                    {cat}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>

            <Text style={[styles.fieldLabel, { color: colors.text }]}>Tags (comma-separated)</Text>
            <TextInput
              style={[styles.input, { borderColor: colors.cardBorder, color: colors.text }]}
              placeholder="Archaeology, Inscriptions, Early Historic"
              placeholderTextColor={colors.textMuted}
              value={tagsText}
              onChangeText={setTagsText}
            />

            <Text style={[styles.fieldLabel, { color: colors.text }]}>Article Content *</Text>
            <TextInput
              style={[styles.input, { borderColor: colors.cardBorder, color: colors.text, minHeight: 140 }]}
              placeholder="Full text of the article or research finding..."
              placeholderTextColor={colors.textMuted}
              multiline
              numberOfLines={8}
              value={content}
              onChangeText={setContent}
            />

            <Text style={[styles.fieldLabel, { color: colors.text }]}>Content Note (Optional sensitive topic notice)</Text>
            <TextInput
              style={[styles.input, { borderColor: colors.cardBorder, color: colors.text }]}
              placeholder="e.g. Discusses excavation of ancient burial urns..."
              placeholderTextColor={colors.textMuted}
              value={contentNote}
              onChangeText={setContentNote}
            />

            <Text style={[styles.fieldLabel, { color: colors.text }]}>Evidence Summary (Archaeological / Archival Records)</Text>
            <TextInput
              style={[styles.input, { borderColor: colors.cardBorder, color: colors.text, minHeight: 60 }]}
              placeholder="Concrete empirical, stratigraphic, or epigraphic evidence..."
              placeholderTextColor={colors.textMuted}
              multiline
              numberOfLines={3}
              value={evidenceSummary}
              onChangeText={setEvidenceSummary}
            />

            <Text style={[styles.fieldLabel, { color: colors.text }]}>Author Perspective (Analysis & Interpretation)</Text>
            <TextInput
              style={[styles.input, { borderColor: colors.cardBorder, color: colors.text, minHeight: 60 }]}
              placeholder="The author's theoretical perspective, argument, or synthesis..."
              placeholderTextColor={colors.textMuted}
              multiline
              numberOfLines={3}
              value={authorPerspective}
              onChangeText={setAuthorPerspective}
            />

            <Pressable style={[styles.primaryBtn, { backgroundColor: colors.primary }]} onPress={handleStep1Next}>
              <Text style={styles.primaryBtnText}>Next: Add Sources →</Text>
            </Pressable>
          </View>
        )}

        {/* STEP 2: Sources */}
        {step === 2 && (
          <View style={styles.formSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Sources & References</Text>
            <Text style={[styles.sectionDesc, { color: colors.textSecondary }]}>
              Every submitted Heritage Voices article must cite at least one source / reference citation.
            </Text>

            {/* List of added sources */}
            {sources.map((s: HeritageSource) => (
              <View key={s.id} style={[styles.sourceItem, { borderColor: colors.cardBorder, backgroundColor: colors.card }]}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.sourceItemTitle, { color: colors.text }]}>{s.title}</Text>
                  <Text style={{ fontSize: 11, color: colors.textSecondary }}>
                    {s.author ? `${s.author} · ` : ''}{s.sourceType} {s.year ? `(${s.year})` : ''}
                  </Text>
                </View>
                <Pressable onPress={() => handleRemoveSource(s.id)}>
                  <Text style={{ color: '#E53E3E', fontSize: 13, fontWeight: '700' }}>Remove</Text>
                </Pressable>
              </View>
            ))}

            {/* Add Source Subform */}
            <View style={[styles.addSourceBox, { backgroundColor: colors.backgroundElement, borderColor: colors.cardBorder }]}>
              <Text style={[styles.fieldLabel, { color: colors.text }]}>Add Source Citation</Text>
              <TextInput
                style={[styles.input, { borderColor: colors.cardBorder, color: colors.text }]}
                placeholder="Publication Title or Archival Document *"
                placeholderTextColor={colors.textMuted}
                value={newSourceTitle}
                onChangeText={setNewSourceTitle}
              />
              <TextInput
                style={[styles.input, { borderColor: colors.cardBorder, color: colors.text }]}
                placeholder="Author / Researcher name"
                placeholderTextColor={colors.textMuted}
                value={newSourceAuthor}
                onChangeText={setNewSourceAuthor}
              />
              <TextInput
                style={[styles.input, { borderColor: colors.cardBorder, color: colors.text }]}
                placeholder="Publisher or Institution"
                placeholderTextColor={colors.textMuted}
                value={newSourcePublisher}
                onChangeText={setNewSourcePublisher}
              />
              <TextInput
                style={[styles.input, { borderColor: colors.cardBorder, color: colors.text }]}
                placeholder="Year (e.g. 2022)"
                placeholderTextColor={colors.textMuted}
                value={newSourceYear}
                onChangeText={setNewSourceYear}
              />

              <Pressable style={[styles.secondaryBtn, { borderColor: colors.primary }]} onPress={handleAddSource}>
                <Text style={[styles.secondaryBtnText, { color: colors.primary }]}>+ Add Source / Reference</Text>
              </Pressable>
            </View>

            <View style={styles.btnRow}>
              <Pressable style={[styles.outlineBtn, { borderColor: colors.cardBorder }]} onPress={() => setStep(1)}>
                <Text style={{ color: colors.text, fontWeight: '700' }}>← Back</Text>
              </Pressable>
              <Pressable style={[styles.primaryBtn, { backgroundColor: colors.primary, flex: 1 }]} onPress={handleStep2Next}>
                <Text style={styles.primaryBtnText}>Review Submission →</Text>
              </Pressable>
            </View>
          </View>
        )}

        {/* STEP 3: Review */}
        {step === 3 && (
          <View style={styles.formSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Submission Preview</Text>
            <Text style={[styles.sectionDesc, { color: colors.textSecondary }]}>
              Review your details before submitting to the editorial queue.
            </Text>

            <View style={[styles.previewCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
              <Text style={[styles.previewTitle, { color: colors.text }]}>{title}</Text>
              <Text style={{ fontSize: 12, color: colors.primary, marginBottom: 8 }}>
                Author: {activeExpert.name} · {category}
              </Text>
              <Text style={[styles.previewSummary, { color: colors.textSecondary }]}>{summary}</Text>
              <Text style={[styles.previewContent, { color: colors.text }]}>{content}</Text>

              {contentNote ? (
                <View style={[styles.previewNote, { backgroundColor: colors.warningLight }]}>
                  <Text style={{ fontSize: 12, color: colors.warning, fontWeight: '700' }}>Content Note: {contentNote}</Text>
                </View>
              ) : null}

              {evidenceSummary ? (
                <View style={styles.previewSub}>
                  <Text style={{ fontSize: 11, fontWeight: '800', color: colors.primary }}>EVIDENCE:</Text>
                  <Text style={{ fontSize: 12, color: colors.text }}>{evidenceSummary}</Text>
                </View>
              ) : null}

              {authorPerspective ? (
                <View style={styles.previewSub}>
                  <Text style={{ fontSize: 11, fontWeight: '800', color: colors.secondary }}>AUTHOR PERSPECTIVE:</Text>
                  <Text style={{ fontSize: 12, color: colors.text }}>{authorPerspective}</Text>
                </View>
              ) : null}

              <Text style={{ fontSize: 13, fontWeight: '800', marginTop: 12, color: colors.text }}>
                Sources ({sources.length}):
              </Text>
              {sources.map((s: HeritageSource) => (
                <Text key={s.id} style={{ fontSize: 12, color: colors.textSecondary }}>• {s.title} ({s.sourceType})</Text>
              ))}
            </View>

            <View style={styles.btnRow}>
              <Pressable style={[styles.outlineBtn, { borderColor: colors.cardBorder }]} onPress={() => setStep(2)}>
                <Text style={{ color: colors.text, fontWeight: '700' }}>← Back</Text>
              </Pressable>
              <Pressable style={[styles.primaryBtn, { backgroundColor: colors.primary, flex: 1 }]} onPress={handleSubmit}>
                <Text style={styles.primaryBtnText}>Submit for Review</Text>
              </Pressable>
            </View>
          </View>
        )}

        {/* STEP 4: Confirmation */}
        {step === 4 && (
          <View style={styles.confirmationBox}>
            <Text style={styles.confirmIcon}>🏛️</Text>
            <Text style={[styles.confirmTitle, { color: colors.text }]}>Submitted for Review</Text>
            <Text style={[styles.confirmSubtitle, { color: colors.textSecondary }]}>
              Your article has been submitted to the editorial moderation queue.
            </Text>
            <Text style={[styles.confirmNote, { color: colors.textMuted }]}>
              The article is set to <Text style={{ fontWeight: '700' }}>pending_review</Text> and will not appear publicly until reviewed by moderators.
            </Text>
            <Pressable
              style={[styles.primaryBtn, { backgroundColor: colors.primary, marginTop: 24, width: '100%' }]}
              onPress={() => router.replace('/heritage-voices')}>
              <Text style={styles.primaryBtnText}>Back to Heritage Voices</Text>
            </Pressable>
          </View>
        )}
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
  contentWrapper: {
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
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  stepperRow: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 12,
  },
  stepItem: {
    fontSize: 12,
    color: '#899477',
    fontWeight: '600',
  },
  stepActive: {
    color: '#30452F',
    fontWeight: '800',
    textDecorationLine: 'underline',
  },
  errorBox: {
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 12,
  },
  formSection: {
    gap: 8,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '700',
    marginTop: 6,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    fontSize: 13,
    backgroundColor: '#FCFBF4',
  },
  catChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    marginRight: 6,
    backgroundColor: '#FCFBF4',
  },
  catText: {
    fontSize: 12,
    fontWeight: '600',
  },
  primaryBtn: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 14,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
  },
  sectionDesc: {
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 8,
  },
  sourceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 6,
  },
  sourceItemTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  addSourceBox: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    gap: 8,
    marginTop: 10,
  },
  secondaryBtn: {
    borderWidth: 1,
    borderRadius: 6,
    paddingVertical: 8,
    alignItems: 'center',
    marginTop: 4,
  },
  secondaryBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  btnRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
    alignItems: 'center',
  },
  outlineBtn: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  previewCard: {
    borderRadius: 10,
    borderWidth: 1,
    padding: 14,
    gap: 6,
  },
  previewTitle: {
    fontSize: 17,
    fontWeight: '800',
  },
  previewSummary: {
    fontSize: 13,
    fontStyle: 'italic',
    lineHeight: 18,
  },
  previewContent: {
    fontSize: 13,
    lineHeight: 18,
    marginVertical: 6,
  },
  previewNote: {
    padding: 8,
    borderRadius: 6,
    marginVertical: 4,
  },
  previewSub: {
    gap: 2,
    marginTop: 4,
  },
  confirmationBox: {
    alignItems: 'center',
    paddingVertical: 40,
    gap: 8,
  },
  confirmIcon: {
    fontSize: 50,
  },
  confirmTitle: {
    fontSize: 20,
    fontWeight: '800',
  },
  confirmSubtitle: {
    fontSize: 14,
    textAlign: 'center',
  },
  confirmNote: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
    paddingHorizontal: 20,
  },
  warningCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 24,
    alignItems: 'center',
    gap: 10,
    marginTop: 40,
  },
  warningIcon: {
    fontSize: 40,
  },
  warningTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  warningDesc: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
  },
});
