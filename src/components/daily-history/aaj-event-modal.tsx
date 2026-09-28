import React from 'react';
import { Linking, Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AnnotationTag } from '@/components/annotation-tag';
import { Button } from '@/components/button';
import { HairlineDivider } from '@/components/hairline-divider';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BorderRadius, MaxContentWidth, Spacing } from '@/constants/theme';
import { AajKaAkhyanaEvent } from '@/data/daily-history/types';
import { useTheme } from '@/hooks/use-theme';

import { CATEGORY_ICONS } from './aaj-event-card';

export interface AajEventModalProps {
  visible: boolean;
  event: AajKaAkhyanaEvent | null;
  onClose: () => void;
  onExploreInternal?: (route: string) => void;
}

export function AajEventModal({ visible, event, onClose, onExploreInternal }: AajEventModalProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  if (!event) return null;

  const icon = CATEGORY_ICONS[event.category] || '📜';

  const handleOpenSource = () => {
    if (event.sourceUrl) {
      void Linking.openURL(event.sourceUrl);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
      <ThemedView style={styles.modalContainer}>
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            {
              paddingTop: insets.top > 0 ? insets.top + Spacing.two : Spacing.four,
              paddingBottom: insets.bottom + Spacing.six,
            },
          ]}
          showsVerticalScrollIndicator={false}>
          <View style={styles.centerWrapper}>
            {/* Top Close Bar */}
            <View style={styles.topBar}>
              <Button title="← CLOSE" size="sm" variant="text" onPress={onClose} />
              <View style={styles.badgeRow}>
                <ThemedText style={{ fontSize: 16 }}>{icon}</ThemedText>
                <AnnotationTag label={event.category.toUpperCase()} variant="action" />
              </View>
            </View>

            {/* Title & Date Section */}
            <View style={styles.headerSection}>
              <View style={styles.dateRow}>
                <ThemedText type="annotation" style={{ color: theme.secondary, fontWeight: '800' }}>
                  {event.displayDate} {event.year}
                </ThemedText>
                {event.location ? (
                  <ThemedText type="annotation" themeColor="textMuted">
                    📍 {event.location}
                  </ThemedText>
                ) : null}
              </View>

              <ThemedText type="heroDisplay" style={[styles.title, { color: theme.primary }]}>
                {event.title}
              </ThemedText>
            </View>

            <HairlineDivider verticalMargin="md" />

            {/* What Happened Section */}
            <View style={styles.section}>
              <ThemedText type="sectionHeader" style={{ color: theme.primary }}>
                WHAT HAPPENED?
              </ThemedText>
              <ThemedText type="editorialLead" themeColor="textSecondary" style={styles.explanationText}>
                {event.fullExplanation || event.shortDescription}
              </ThemedText>
            </View>

            <HairlineDivider verticalMargin="md" />

            {/* Historical Significance Section */}
            <View style={styles.section}>
              <ThemedText type="sectionHeader" style={{ color: theme.secondary }}>
                HISTORICAL SIGNIFICANCE
              </ThemedText>
              <ThemedText type="default" themeColor="text" style={styles.bodyText}>
                {event.significance}
              </ThemedText>
            </View>

            {/* People Involved (if supported) */}
            {event.people && event.people.length > 0 ? (
              <>
                <HairlineDivider verticalMargin="md" />
                <View style={styles.section}>
                  <ThemedText type="sectionHeader" themeColor="textMuted">
                    PEOPLE INVOLVED
                  </ThemedText>
                  <View style={styles.peopleList}>
                    {event.people.map((person) => (
                      <View
                        key={person}
                        style={[
                          styles.personPill,
                          {
                            backgroundColor: theme.backgroundElement,
                            borderColor: theme.cardBorder,
                          },
                        ]}>
                        <ThemedText type="smallBold" style={{ color: theme.text }}>
                          👤 {person}
                        </ThemedText>
                      </View>
                    ))}
                  </View>
                </View>
              </>
            ) : null}

            {/* Tags (if present) */}
            {event.tags && event.tags.length > 0 ? (
              <View style={styles.tagsContainer}>
                {event.tags.map((tag) => (
                  <View key={tag} style={[styles.tagPill, { backgroundColor: theme.card }]}>
                    <ThemedText type="caption" themeColor="textMuted">
                      #{tag}
                    </ThemedText>
                  </View>
                ))}
              </View>
            ) : null}

            <HairlineDivider verticalMargin="lg" />

            {/* Source Attribution Box */}
            <View
              style={[
                styles.sourceBox,
                {
                  backgroundColor: theme.card,
                  borderColor: theme.cardBorder,
                },
              ]}>
              <ThemedText type="annotation" style={{ color: theme.discovery, fontWeight: '800' }}>
                DOCUMENTED PRIMARY / ARCHIVAL SOURCE
              </ThemedText>
              <ThemedText type="cardTitle" style={{ color: theme.primary, fontSize: 17 }}>
                {event.sourceName}
              </ThemedText>

              {event.sourceCitation ? (
                <ThemedText type="caption" themeColor="textSecondary" style={styles.citationText}>
                  {event.sourceCitation}
                </ThemedText>
              ) : null}

              <View style={styles.sourceActionRow}>
                {event.sourceUrl ? (
                  <Button
                    title="View Original Source ↗"
                    size="sm"
                    variant="discovery"
                    onPress={handleOpenSource}
                  />
                ) : null}

                {event.akhyanaExhibitRoute && onExploreInternal ? (
                  <Button
                    title="Explore in Akhyana →"
                    size="sm"
                    variant="action"
                    onPress={() => {
                      onClose();
                      onExploreInternal(event.akhyanaExhibitRoute!);
                    }}
                  />
                ) : null}
              </View>
            </View>
          </View>
        </ScrollView>
      </ThemedView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
  },
  scrollContent: {
    alignItems: 'center',
  },
  centerWrapper: {
    width: '100%',
    maxWidth: MaxContentWidth,
    paddingHorizontal: Spacing.four,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.two,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  headerSection: {
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    letterSpacing: -0.5,
  },
  section: {
    gap: Spacing.two,
  },
  explanationText: {
    lineHeight: 24,
  },
  bodyText: {
    lineHeight: 22,
  },
  peopleList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
    marginTop: Spacing.one,
  },
  personPill: {
    paddingHorizontal: Spacing.three,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
    marginTop: Spacing.three,
  },
  tagPill: {
    paddingHorizontal: Spacing.two,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  sourceBox: {
    padding: Spacing.four,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    gap: Spacing.two,
  },
  citationText: {
    fontStyle: 'italic',
    lineHeight: 18,
  },
  sourceActionRow: {
    flexDirection: 'row',
    gap: Spacing.two,
    marginTop: Spacing.two,
    flexWrap: 'wrap',
  },
});
