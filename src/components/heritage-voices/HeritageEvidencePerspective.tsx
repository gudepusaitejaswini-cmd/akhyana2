import React, { useState } from 'react';
import { View, StyleSheet, Text, Pressable } from 'react-native';
import { Colors } from '@/constants/theme';

interface Props {
  evidenceSummary?: string;
  authorPerspective?: string;
}

export function HeritageEvidencePerspective({ evidenceSummary, authorPerspective }: Props) {
  const colors = Colors.light;
  const [expanded, setExpanded] = useState(true);

  if (!evidenceSummary && !authorPerspective) return null;

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
      <Pressable onPress={() => setExpanded(!expanded)} style={styles.headerRow}>
        <View>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Evidence & Perspective</Text>
          <Text style={[styles.cardSubtitle, { color: colors.textMuted }]}>
            Transparently separating archaeological evidence from analytical interpretations
          </Text>
        </View>
        <Text style={[styles.toggleText, { color: colors.primary }]}>{expanded ? '▲ Hide' : '▼ View'}</Text>
      </Pressable>

      {expanded && (
        <View style={styles.body}>
          {evidenceSummary && (
            <View style={[styles.subSection, { borderLeftColor: colors.discovery }]}>
              <Text style={[styles.subTitle, { color: colors.discovery }]}>ARCHAEOLOGICAL / HISTORICAL EVIDENCE</Text>
              <Text style={[styles.content, { color: colors.text }]}>{evidenceSummary}</Text>
            </View>
          )}

          {authorPerspective && (
            <View style={[styles.subSection, { borderLeftColor: colors.secondary }]}>
              <Text style={[styles.subTitle, { color: colors.secondary }]}>AUTHOR PERSPECTIVE & INTERPRETATION</Text>
              <Text style={[styles.content, { color: colors.text }]}>{authorPerspective}</Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginVertical: 14,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  cardSubtitle: {
    fontSize: 11,
    marginTop: 2,
    maxWidth: '85%',
  },
  toggleText: {
    fontSize: 12,
    fontWeight: '600',
  },
  body: {
    marginTop: 14,
    gap: 12,
  },
  subSection: {
    borderLeftWidth: 3,
    paddingLeft: 10,
    gap: 4,
  },
  subTitle: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  content: {
    fontSize: 13,
    lineHeight: 19,
  },
});
