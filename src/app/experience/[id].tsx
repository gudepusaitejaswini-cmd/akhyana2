import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AnnotationTag } from '@/components/annotation-tag';
import { Button } from '@/components/button';
import { HairlineDivider } from '@/components/hairline-divider';
import { LearningVideoPlaceholder } from '@/components/learning-video-placeholder';
import { NotFoundState } from '@/components/not-found-state';
import { ProgressBar } from '@/components/progress-bar';
import { SourceCitationBadge } from '@/components/source-citation-badge';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BorderRadius, BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { EXPERIENCES } from '@/data/experiences';
import { useTheme } from '@/hooks/use-theme';
import { heritageGuideService } from '@/services/ai';
import { recordExhibitViewed, recordQuestionAnswer } from '@/services/user-progress';

export default function ExperienceDetailScreen() {
  const { id, step } = useLocalSearchParams<{ id: string, step?: string }>();
  const router = useRouter();
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const experience = EXPERIENCES.find((e) => e.id === id);

  const [currentStepIndex, setCurrentStepIndex] = useState(step ? parseInt(step, 10) : 0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [guideHint, setGuideHint] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  React.useEffect(() => {
    if (step) {
      setCurrentStepIndex(parseInt(step, 10));
    }
  }, [step]);

  React.useEffect(() => {
    if (experience) {
      recordExhibitViewed(experience.id);
    }
  }, [experience]);

  if (!experience) return <NotFoundState />;

  const currentStep = experience.subtopics[currentStepIndex] || experience.subtopics[0];
  const stepProgress = Math.round(((currentStepIndex + 1) / experience.subtopics.length) * 100);

  const handleSelectOption = (idx: number) => {
    if (selectedOptionIndex === null && currentStep.options?.[idx]) {
      const opt = currentStep.options[idx];
      recordQuestionAnswer({
        questionId: `${experience.id}-step-${currentStep.stepNumber}`,
        isCorrect: opt.isHistoricallyAccurate,
        topicId: experience.topicId,
        category: 'Ancient India',
        promptOrText: currentStep.choicePrompt || currentStep.title,
      });
    }
    setSelectedOptionIndex(idx);
  };

  const handleNextStep = () => {
    if (currentStepIndex < experience.subtopics.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
      setSelectedOptionIndex(null);
      setGuideHint(null);
    } else {
      setIsCompleted(true);
    }
  };

  const handleAskGuide = async () => {
    const hint = await heritageGuideService.generateContextualHint(
      currentStep.choicePrompt || currentStep.title,
      experience.topicId
    );
    setGuideHint(hint);
    setIsGuideOpen(true);
  };

  return (
    <ThemedView style={styles.screen}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: insets.top > 0 ? insets.top : Spacing.four,
            paddingBottom: insets.bottom + BottomTabInset + Spacing.seven,
          },
        ]}
        showsVerticalScrollIndicator={false}>
        <View style={styles.centerWrapper}>
          {/* Top Bar */}
          <View style={styles.topNavRow}>
            <Button
              title="← EXIT EXHIBIT"
              size="sm"
              variant="text"
              onPress={() => router.back()}
            />
            <SourceCitationBadge sources={experience.sources} />
          </View>

          {/* Experience Progress Header */}
          <View style={styles.headerSection}>
            <View style={styles.progressLabelRow}>
              <AnnotationTag label={`SUBTOPIC 0${currentStepIndex + 1} OF 0${experience.subtopics.length}`} variant="highlight" />
              <ThemedText type="annotation" themeColor="textMuted">
                ⏱ {experience.estimatedMinutes} MIN
              </ThemedText>
            </View>

            <ProgressBar progress={stepProgress} colorVariant="primary" height={4} />

            <ThemedText type="heroDisplay" style={styles.expTitle}>
              {experience.title}
            </ThemedText>

            <View style={styles.subtopicMap}>
              <ThemedText type="annotation" themeColor="textMuted">LEARNING SUBTOPICS</ThemedText>
              <View style={styles.subtopicList}>
                {experience.subtopics.map((subtopic, index) => {
                  const selected = currentStepIndex === index;
                  return (
                    <Pressable
                      key={`${subtopic.stepNumber}-${subtopic.title}`}
                      onPress={() => {
                        setCurrentStepIndex(index);
                        setSelectedOptionIndex(null);
                        setGuideHint(null);
                      }}
                      style={[styles.subtopicItem, { borderColor: selected ? theme.primary : theme.border, backgroundColor: selected ? theme.primaryLight : theme.card }]}>
                      <ThemedText type="annotation" style={{ color: selected ? theme.primary : theme.textMuted }}>0{index + 1}</ThemedText>
                      <ThemedText type="caption" style={{ color: selected ? theme.text : theme.textSecondary, flex: 1 }}>{subtopic.title}</ThemedText>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          </View>

          <HairlineDivider verticalMargin="sm" />

                    {/* STEP NARRATIVE & DECISION */}
          {!isCompleted ? (
            <View style={styles.stepSection}>
              <ThemedText type="editorialHeader" style={styles.stepTitle}>
                {currentStep.title}
              </ThemedText>

              <ThemedText type="editorialLead" themeColor="textSecondary" style={styles.narrativeLead}>
                {currentStep.narrative || currentStep.factualContent}
              </ThemedText>
              
              {currentStep.context && (
                <ThemedText type="editorialLead" themeColor="textSecondary" style={styles.narrativeLead}>
                  {currentStep.context}
                </ThemedText>
              )}

              {/* VIDEO SEQUENCE */}
              {currentStep.videos && currentStep.videos.length > 0 ? (
                <View style={{ gap: Spacing.four, marginVertical: Spacing.two }}>
                  <ThemedText type="annotation" themeColor="textMuted">VIDEO SEQUENCE ({currentStep.videos.length})</ThemedText>
                  {currentStep.videos.map((vid, vIdx) => (
                    <LearningVideoPlaceholder key={vid.id || vIdx.toString()} video={vid} />
                  ))}
                </View>
              ) : currentStep.video ? (
                <View style={{ gap: Spacing.two, marginVertical: Spacing.two }}>
                   <ThemedText type="annotation" themeColor="textMuted">VIDEO</ThemedText>
                   <LearningVideoPlaceholder video={currentStep.video} />
                </View>
              ) : (experience.video ? <LearningVideoPlaceholder video={experience.video} /> : null)}

              {/* EVIDENCE / SOURCES */}
              {currentStep.historicalEvidence && (
                <View
                  style={[
                    styles.evidenceQuoteBox,
                    { backgroundColor: theme.backgroundElement, borderLeftColor: theme.primary },
                  ]}>
                  <AnnotationTag label="EVIDENCE & SOURCES" variant="highlight" />
                  <ThemedText type="small" themeColor="textSecondary" style={styles.evidenceText}>
                    {currentStep.historicalEvidence}
                  </ThemedText>
                </View>
              )}
              
              {currentStep.sources && currentStep.sources.length > 0 && (
                <View style={{ marginTop: Spacing.two, gap: Spacing.one }}>
                  {currentStep.sources.map((s, idx) => (
                    <View key={idx} style={{ padding: Spacing.two, backgroundColor: theme.card, borderRadius: 8 }}>
                      <ThemedText type="smallBold">{s.title}</ThemedText>
                      <ThemedText type="caption" themeColor="textMuted">{s.authorOrInstitution}</ThemedText>
                    </View>
                  ))}
                </View>
              )}

              {/* TAKEAWAY */}
              {(currentStep.takeaway || currentStep.explanation) && (
                <View style={{ marginTop: Spacing.two }}>
                  <ThemedText type="annotation" style={{ color: theme.accent, marginBottom: 4 }}>
                    KEY TAKEAWAY
                  </ThemedText>
                  <ThemedText type="small" themeColor="textSecondary">
                    {currentStep.takeaway || currentStep.explanation}
                  </ThemedText>
                </View>
              )}

              {/* Interactive Decision / Consequence */}

              {currentStep.choicePrompt && (
                <View style={styles.decisionContainer}>
                  <ThemedText type="sectionHeader" themeColor="text" style={styles.decisionPrompt}>
                    {currentStep.choicePrompt}
                  </ThemedText>

                  <View style={styles.optionsList}>
                    {currentStep.options?.map((opt, idx) => {
                      const isSelected = selectedOptionIndex === idx;

                      return (
                        <Pressable
                          key={idx}
                          onPress={() => handleSelectOption(idx)}
                          style={({ pressed }) => [
                            styles.optionItem,
                            {
                              backgroundColor: isSelected
                                ? opt.isHistoricallyAccurate
                                  ? theme.successLight
                                  : theme.errorLight
                                : theme.card,
                              borderColor: isSelected
                                ? opt.isHistoricallyAccurate
                                  ? theme.success
                                  : theme.error
                                : theme.cardBorder,
                            },
                            pressed && styles.pressed,
                          ]}>
                          <ThemedText
                            type="smallBold"
                            style={{
                              color: isSelected
                                ? opt.isHistoricallyAccurate
                                  ? theme.success
                                  : theme.error
                                : theme.text,
                            }}>
                            {opt.label}
                          </ThemedText>

                          {isSelected && (
                            <View style={styles.consequenceBox}>
                              <AnnotationTag
                                label={opt.isHistoricallyAccurate ? 'HISTORICALLY ACCURATE' : 'HISTORICAL FLAW'}
                                variant={opt.isHistoricallyAccurate ? 'success' : 'error'}
                              />
                              <ThemedText
                                type="small"
                                style={{
                                  color: opt.isHistoricallyAccurate
                                    ? theme.success
                                    : theme.error,
                                  lineHeight: 20,
                                }}>
                                {opt.historicalConsequence}
                              </ThemedText>
                            </View>
                          )}
                        </Pressable>
                      );
                    })}
                  </View>
                </View>
              )}

              {/* Navigation Actions */}
              <View style={styles.actionRow}>
                <Button
                  title="💡 AI Guide Hint"
                  size="sm"
                  variant="subtle"
                  onPress={handleAskGuide}
                />

                <Button
                  title={
                    currentStepIndex < experience.subtopics.length - 1
                      ? 'NEXT SUBTOPIC →'
                      : 'COMPLETE EXHIBIT ✓'
                  }
                  size="md"
                  variant="action"
                  onPress={handleNextStep}
                />
              </View>
            </View>
          ) : (
            /* COMPLETION SCREEN */
            <View style={styles.completionSection}>
              <AnnotationTag label="LEARNING COMPLETE" variant="highlight" />

              <ThemedText type="heroDisplay" style={styles.completionTitle}>
                {'EXPERIENCE\nCOMPLETED.'}
              </ThemedText>

              <ThemedText type="editorialLead" themeColor="textSecondary">
                You have completed: <ThemedText type="editorialLead" style={{ fontWeight: '700' }}>{experience.title}</ThemedText>
              </ThemedText>

              <ThemedText type="sectionHeader" style={{ marginTop: Spacing.two }}>
                Key takeaways
              </ThemedText>

              <View style={styles.recapList}>
                {experience.recapPoints.map((point, index) => (
                  <View key={point} style={styles.recapRow}>
                    <ThemedText type="annotation" style={{ color: theme.accent }}>0{index + 1}</ThemedText>
                    <ThemedText type="small" themeColor="textSecondary" style={{ flex: 1 }}>{point}</ThemedText>
                  </View>
                ))}
              </View>

              {experience.xpReward > 0 && (
                <View
                  style={[
                    styles.rewardStatBox,
                    { backgroundColor: theme.backgroundElement, borderLeftColor: theme.primary },
                  ]}>
                  <ThemedText type="statValue" style={{ color: theme.accent }}>
                    +{experience.xpReward} XP
                  </ThemedText>
                  <ThemedText type="annotation" themeColor="textMuted">
                    PROGRESS RECORDED
                  </ThemedText>
                </View>
              )}

              <View style={styles.completionButtons}>
                <Button
                  title="← BACK TO EVENT"
                  size="lg"
                  variant="primary"
                  onPress={() => router.back()}
                />
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* AI HERITAGE GUIDE HINT MODAL */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isGuideOpen}
        onRequestClose={() => setIsGuideOpen(false)}>
        <View style={styles.modalOverlay}>
          <ThemedView
            type="background"
            style={[styles.modalContent, { borderColor: theme.borderStrong }]}>
            <View style={styles.modalHeader}>
              <View style={styles.modalTitleCol}>
                <AnnotationTag label="AI HERITAGE GUIDE" variant="highlight" />
                <ThemedText type="cardTitle">Contextual Archaeological Hint</ThemedText>
              </View>
              <Pressable onPress={() => setIsGuideOpen(false)} style={styles.closeBtn}>
                <ThemedText type="smallBold">✕</ThemedText>
              </Pressable>
            </View>

            <HairlineDivider verticalMargin="sm" />

            <ThemedText type="editorialLead" themeColor="textSecondary" style={styles.hintLead}>
              {guideHint || 'Consider the ecological wind patterns and sanitation trade-offs.'}
            </ThemedText>

            <Button
              title="Return to Decision"
              variant="primary"
              size="sm"
              onPress={() => setIsGuideOpen(false)}
              style={{ marginTop: Spacing.three }}
            />
          </ThemedView>
        </View>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    alignItems: 'center',
  },
  centerWrapper: {
    width: '100%',
    maxWidth: MaxContentWidth,
  },
  topNavRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.two,
  },
  headerSection: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.two,
    gap: Spacing.two,
  },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  expTitle: {
    letterSpacing: -1,
    marginTop: 4,
  },
  subtopicMap: {
    gap: Spacing.one,
    marginTop: Spacing.one,
  },
  subtopicList: {
    gap: Spacing.one,
  },
  subtopicItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.two,
  },
  stepSection: {
    paddingHorizontal: Spacing.four,
    gap: Spacing.three,
  },
  stepTitle: {
    fontSize: 24,
  },
  narrativeLead: {
    lineHeight: 26,
  },
  evidenceQuoteBox: {
    padding: Spacing.four,
    borderLeftWidth: 3,
    gap: Spacing.one,
    borderRadius: BorderRadius.sm,
    marginVertical: Spacing.one,
  },
  evidenceText: {
    lineHeight: 20,
    fontStyle: 'italic',
  },
  decisionContainer: {
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
  decisionPrompt: {
    fontSize: 15,
  },
  optionsList: {
    gap: Spacing.two,
  },
  optionItem: {
    padding: Spacing.four,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    gap: Spacing.two,
  },
  consequenceBox: {
    gap: 4,
    marginTop: 4,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.four,
    gap: Spacing.two,
  },
  completionSection: {
    paddingHorizontal: Spacing.four,
    gap: Spacing.three,
    paddingTop: Spacing.three,
  },
  completionTitle: {
    letterSpacing: -1,
  },
  rewardStatBox: {
    padding: Spacing.four,
    borderLeftWidth: 3,
    gap: 4,
    borderRadius: BorderRadius.sm,
    marginVertical: Spacing.two,
  },
  completionButtons: {
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
  recapList: {
    gap: Spacing.two,
  },
  recapRow: {
    flexDirection: 'row',
    gap: Spacing.two,
    alignItems: 'flex-start',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(36, 59, 100, 0.65)',
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
  modalTitleCol: {
    gap: 2,
    flex: 1,
  },
  closeBtn: {
    padding: 6,
  },
  hintLead: {
    lineHeight: 24,
    fontStyle: 'italic',
  },
  pressed: {
    opacity: 0.8,
  },
});
