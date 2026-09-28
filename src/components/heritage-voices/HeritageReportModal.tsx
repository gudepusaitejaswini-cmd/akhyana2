import React, { useState } from 'react';
import { View, StyleSheet, Text, Modal, Pressable, TextInput, ScrollView } from 'react-native';
import { HeritageReportReason } from '@/types/heritage-voices';
import { reportHeritageArticle } from '@/data/heritage-voices';
import { Colors } from '@/constants/theme';

interface Props {
  visible: boolean;
  articleId: string;
  onClose: () => void;
}

const REASONS: { label: string; value: HeritageReportReason }[] = [
  { label: 'Inaccurate Citation', value: 'inaccurate_citation' },
  { label: 'Plagiarism', value: 'plagiarism' },
  { label: 'Misrepresented Evidence', value: 'misrepresented_evidence' },
  { label: 'Misinformation / historically inaccurate', value: 'misinformation' },
  { label: 'Unsupported claim / missing sources', value: 'unsupported_claim' },
  { label: 'Misleading interpretation', value: 'misleading_interpretation' },
  { label: 'Hate speech or discrimination', value: 'hate_speech' },
  { label: 'Religious/community sensitivity', value: 'religious_sensitivity' },
  { label: 'Political or ideological propaganda', value: 'political_propaganda' },
  { label: 'Graphic or disturbing content', value: 'graphic_content' },
  { label: 'Offensive/inappropriate content', value: 'offensive_content' },
  { label: 'Other', value: 'other' },
];

export function HeritageReportModal({ visible, articleId, onClose }: Props) {
  const colors = Colors.light;
  const [selectedReason, setSelectedReason] = useState<HeritageReportReason | null>(null);
  const [details, setDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!selectedReason) return;
    reportHeritageArticle({
      articleId,
      reason: selectedReason,
      details: details.trim() || undefined,
    });
    setSubmitted(true);
  };

  const handleClose = () => {
    setSelectedReason(null);
    setDetails('');
    setSubmitted(false);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
      <View style={styles.overlay}>
        <View style={[styles.modalCard, { backgroundColor: colors.surface }]}>
          {!submitted ? (
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Report this Article</Text>
              <Text style={[styles.modalSubtitle, { color: colors.textSecondary }]}>
                Help us keep Heritage Voices accurate, respectful, and transparent.
              </Text>

              <Text style={[styles.fieldLabel, { color: colors.text }]}>Reason (Select one)</Text>
              <View style={styles.reasonsList}>
                {REASONS.map((r) => (
                  <Pressable
                    key={r.value}
                    style={[
                      styles.reasonRow,
                      { borderColor: colors.cardBorder },
                      selectedReason === r.value && { backgroundColor: colors.primaryLight, borderColor: colors.primary },
                    ]}
                    onPress={() => setSelectedReason(r.value)}>
                    <Text
                      style={[
                        styles.reasonText,
                        { color: colors.text },
                        selectedReason === r.value && { fontWeight: '700', color: colors.primary },
                      ]}>
                      {r.label}
                    </Text>
                  </Pressable>
                ))}
              </View>

              <Text style={[styles.fieldLabel, { color: colors.text }]}>Additional details (optional)</Text>
              <TextInput
                style={[styles.input, { borderColor: colors.cardBorder, color: colors.text }]}
                placeholder="Tell us more about the issue..."
                placeholderTextColor={colors.textMuted}
                multiline
                numberOfLines={3}
                value={details}
                onChangeText={setDetails}
              />

              <View style={styles.actionRow}>
                <Pressable style={[styles.button, styles.cancelBtn]} onPress={handleClose}>
                  <Text style={[styles.btnText, { color: colors.textMuted }]}>Cancel</Text>
                </Pressable>
                <Pressable
                  style={[
                    styles.button,
                    styles.submitBtn,
                    { backgroundColor: selectedReason ? colors.primary : colors.backgroundElement },
                  ]}
                  disabled={!selectedReason}
                  onPress={handleSubmit}>
                  <Text style={[styles.btnText, { color: selectedReason ? '#FFFFFF' : colors.textMuted }]}>
                    Submit Report
                  </Text>
                </Pressable>
              </View>
            </ScrollView>
          ) : (
            <View style={styles.successBox}>
              <Text style={styles.successIcon}>✓</Text>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Report Submitted</Text>
              <Text style={[styles.modalSubtitle, { color: colors.textSecondary, textAlign: 'center' }]}>
                Thank you for your report. It has been recorded for review. Reports do not automatically delete or modify articles.
              </Text>
              <Pressable style={[styles.button, styles.submitBtn, { backgroundColor: colors.primary, marginTop: 16 }]} onPress={handleClose}>
                <Text style={[styles.btnText, { color: '#FFFFFF' }]}>Done</Text>
              </Pressable>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    maxHeight: '85%',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  modalSubtitle: {
    fontSize: 13,
    marginTop: 4,
    marginBottom: 16,
    lineHeight: 18,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 8,
    marginTop: 10,
  },
  reasonsList: {
    gap: 6,
  },
  reasonRow: {
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
  },
  reasonText: {
    fontSize: 13,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    fontSize: 13,
    textAlignVertical: 'top',
    minHeight: 70,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 20,
    marginBottom: 10,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  cancelBtn: {},
  submitBtn: {},
  btnText: {
    fontSize: 13,
    fontWeight: '700',
  },
  successBox: {
    alignItems: 'center',
    paddingVertical: 24,
    gap: 8,
  },
  successIcon: {
    fontSize: 40,
    color: '#30452F',
  },
});
