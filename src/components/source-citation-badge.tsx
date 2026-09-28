import React, { useState } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';

import { Button } from '@/components/button';
import { HairlineDivider } from '@/components/hairline-divider';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BorderRadius, Spacing } from '@/constants/theme';
import { HistoricalSource } from '@/data/types';
import { useTheme } from '@/hooks/use-theme';

interface SourceCitationBadgeProps {
  sources?: HistoricalSource[];
}

export function SourceCitationBadge({ sources = [] }: SourceCitationBadgeProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const theme = useTheme();

  if (!sources || sources.length === 0) return null;

  return (
    <>
      <Pressable
        onPress={() => setModalVisible(true)}
        style={({ pressed }) => [styles.trigger, { backgroundColor: theme.discoveryLight, borderColor: theme.discovery }, pressed && styles.pressed]}>
        <ThemedText type="annotation" style={{ color: theme.discoveryText }}>
          {sources.length === 1 ? '1 VERIFIED SOURCE' : `${sources.length} VERIFIED SOURCES`}
        </ThemedText>
      </Pressable>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <ThemedView
            type="background"
            style={[styles.modalContent, { borderColor: theme.borderStrong }]}>
            <View style={styles.modalHeader}>
              <View style={styles.titleColumn}>
                <ThemedText type="annotation" style={{ color: theme.discovery }}>
                  [ARCHIVAL VERIFICATION]
                </ThemedText>
                <ThemedText type="cardTitle" style={{ color: theme.primary }}>
                  Accredited Historical Evidence
                </ThemedText>
              </View>
              <Pressable
                onPress={() => setModalVisible(false)}
                style={styles.closeBtn}>
                <ThemedText type="smallBold">✕</ThemedText>
              </Pressable>
            </View>

            <ThemedText type="small" themeColor="textSecondary" style={styles.modalSubtext}>
              Akhyana grounds learning strictly in peer-reviewed archaeological excavations and UNESCO records rather than unverified generative models.
            </ThemedText>

            <HairlineDivider verticalMargin="sm" />

            <View style={styles.sourcesList}>
              {sources.map((source, idx) => (
                <View key={source.id || idx} style={styles.sourceItem}>
                  <View style={styles.sourceTagRow}>
                    <ThemedText type="annotation" style={{ color: theme.accent }}>
                      [{source.sourceType.toUpperCase()}]
                    </ThemedText>
                    <ThemedText type="caption" themeColor="textMuted">
                      {source.yearOrPeriod || 'Historical Record'}
                    </ThemedText>
                  </View>

                  <ThemedText type="smallBold" style={styles.sourceTitle}>
                    {source.title}
                  </ThemedText>

                  <ThemedText type="caption" themeColor="textSecondary">
                    {source.authorOrInstitution}
                  </ThemedText>

                  {source.notes && (
                    <ThemedText type="caption" themeColor="textMuted" style={styles.sourceNotes}>
                      &ldquo;{source.notes}&rdquo;
                    </ThemedText>
                  )}
                </View>
              ))}
            </View>

            <Button
              title="Close Evidence Dossier"
              variant="primary"
              size="sm"
              onPress={() => setModalVisible(false)}
              style={{ marginTop: Spacing.three }}
            />
          </ThemedView>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.two,
    paddingVertical: 5,
  },
  pressed: {
    opacity: 0.7,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: Spacing.four,
  },
  modalContent: {
    width: '100%',
    maxWidth: 540,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    padding: Spacing.five,
    gap: Spacing.two,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleColumn: {
    gap: 2,
    flex: 1,
  },
  closeBtn: {
    padding: 6,
  },
  modalSubtext: {
    lineHeight: 20,
  },
  sourcesList: {
    gap: Spacing.three,
  },
  sourceItem: {
    gap: 2,
  },
  sourceTagRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sourceTitle: {
    fontSize: 14,
    marginTop: 2,
  },
  sourceNotes: {
    fontStyle: 'italic',
    marginTop: 2,
  },
});
