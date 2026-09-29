import { LUDO_DISCOVERIES } from '@/data/ludo';
import {
  getQuestionsForYear,
  pickRetryDuelQuestion,
  pickYearDuelQuestion,
  shuffleYearQuestionChoices,
  YEAR_DUEL_QUESTIONS,
  YearDuelQuestion,
} from '@/data/year-duel-questions';
import { addCompletedYear } from '@/utils/completed-years';
import { recordQuestionAnswer } from '@/services/user-progress';
import {
  applyTokenMove,
  attachQuestion,
  captureTarget,
  collectDiscovery,
  createLudoGame,
  currentPlayer,
  destinationDistance,
  DUEL_MS,
  evaluateDuelAnswers,
  hasWon,
  legalTokenIds,
  legalTokenIdsWithDistance,
  nextSeat,
  resolveDuel,
  tokenById,
} from '@/games/ludo/engine';
import { getLudoYear } from '@/games/ludo/session';
import {
  LastTurnSummary,
  LudoDuelQuestion,
  LudoGameState,
  LudoPlayerConfig,
  LudoSeat,
  LudoToken,
  QuizPhase,
} from '@/games/ludo/types';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const STEP_MS = 110;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Map a canonical YearDuelQuestion to the presentation copy.
 * Choices are shuffled and correctIndex recalculated.
 */
function toDuelPresentation(question: YearDuelQuestion): LudoDuelQuestion {
  const shuffled = shuffleYearQuestionChoices(question);
  return {
    id: shuffled.id,
    question: shuffled.prompt,
    choices: shuffled.choices,
    correctIndex: shuffled.correctIndex,
    explanation: shuffled.explanation,
    era: String(shuffled.year),
    difficulty: 'easy',
  };
}

export const QUESTIONS_PER_TURN = 6;

/**
 * Pick `count` distinct historical questions for a turn.
 * Ensures no duplicates within the turn and GUARANTEES exactly `count` (6)
 * questions even if a specific calendar year has fewer than 6 base entries
 * by supplementing gracefully from the historical question bank.
 */
export function pickTurnQuestions(
  year: number,
  count: number = QUESTIONS_PER_TURN,
  usedIds: string[] = [],
): LudoDuelQuestion[] {
  const chosenYearQuestions = getQuestionsForYear(year);
  const picked: YearDuelQuestion[] = [];

  // 1. First priority: Unused questions for the exact year selected
  const unusedFromYear = chosenYearQuestions.filter((q) => !usedIds.includes(q.id));
  const shuffledUnusedYear = [...unusedFromYear].sort(() => Math.random() - 0.5);
  picked.push(...shuffledUnusedYear.slice(0, count));

  // 2. Second priority: If more needed, take other questions from the same year
  if (picked.length < count && chosenYearQuestions.length > 0) {
    const remainingYearPool = chosenYearQuestions.filter((q) => !picked.some((p) => p.id === q.id));
    const shuffledRemaining = [...remainingYearPool].sort(() => Math.random() - 0.5);
    picked.push(...shuffledRemaining.slice(0, count - picked.length));
  }

  // 3. Third priority: If selected year has fewer than 6 questions, supplement from the same decade/era
  if (picked.length < count) {
    const decadeStart = Math.floor(year / 10) * 10;
    const decadeEnd = decadeStart + 9;
    const decadeQuestions = YEAR_DUEL_QUESTIONS.filter(
      (q) => q.year >= decadeStart && q.year <= decadeEnd && !picked.some((p) => p.id === q.id),
    );

    // Unused in decade first
    const unusedDecade = decadeQuestions.filter((q) => !usedIds.includes(q.id));
    const shuffledUnusedDecade = [...unusedDecade].sort(() => Math.random() - 0.5);
    picked.push(...shuffledUnusedDecade.slice(0, count - picked.length));

    // Then any in decade
    if (picked.length < count) {
      const remainingDecade = decadeQuestions.filter((q) => !picked.some((p) => p.id === q.id));
      const shuffledRemainingDecade = [...remainingDecade].sort(() => Math.random() - 0.5);
      picked.push(...shuffledRemainingDecade.slice(0, count - picked.length));
    }
  }

  // 4. Fourth priority: If still under count, supplement from general YEAR_DUEL_QUESTIONS pool
  if (picked.length < count) {
    const otherQuestions = YEAR_DUEL_QUESTIONS.filter((q) => !picked.some((p) => p.id === q.id));
    const unusedOther = otherQuestions.filter((q) => !usedIds.includes(q.id));
    const shuffledUnusedOther = [...unusedOther].sort(() => Math.random() - 0.5);
    picked.push(...shuffledUnusedOther.slice(0, count - picked.length));

    if (picked.length < count) {
      const remainingOther = otherQuestions.filter((q) => !picked.some((p) => p.id === q.id));
      const shuffledRemainingOther = [...remainingOther].sort(() => Math.random() - 0.5);
      picked.push(...shuffledRemainingOther.slice(0, count - picked.length));
    }
  }

  // 5. Final fallback (cycle if question bank is exhausted)
  if (picked.length < count && picked.length > 0) {
    let index = 0;
    while (picked.length < count) {
      picked.push(picked[index % picked.length]);
      index++;
    }
  }

  return picked.slice(0, count).map((q) => toDuelPresentation(q));
}

export function useLudoGame(players: LudoPlayerConfig[]) {
  const [state, setState] = useState<LudoGameState>(() => createLudoGame(players));
  const [displayTokens, setDisplayTokens] = useState<LudoToken[]>(() => createLudoGame(players).tokens);
  const [busy, setBusy] = useState(false);

  // Turn Quiz State (6 questions per turn)
  const [turnQuestions, setTurnQuestions] = useState<LudoDuelQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);

  // Turn Transition Summary
  const [lastTurnSummary, setLastTurnSummary] = useState<LastTurnSummary | null>(null);

  // Duel State
  const [duelChoices, setDuelChoices] = useState<{
    attacker: number | null;
    defender: number | null;
    attackerAt: number | null;
    defenderAt: number | null;
  }>({ attacker: null, defender: null, attackerAt: null, defenderAt: null });
  const [duelElapsed, setDuelElapsed] = useState(0);
  const [duelResult, setDuelResult] = useState<string | null>(null);
  const resolvedRef = useRef(false);
  const duelStartRef = useRef(0);
  const finishTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stateRef = useRef(state);
  stateRef.current = state;

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (finishTimerRef.current) clearTimeout(finishTimerRef.current);
    };
  }, []);

  // ----- Year-based quiz cycle state -----
  const [quizYear, setQuizYearState] = useState<number>(() => getLudoYear() ?? 1956);
  const [quizPhase, setQuizPhase] = useState<QuizPhase>('initial');
  const [usedQuestionIds, setUsedQuestionIds] = useState<string[]>([]);
  const [incorrectQuestionIds, setIncorrectQuestionIds] = useState<string[]>([]);
  const quizPhaseRef = useRef<QuizPhase>('initial');
  const usedRef = useRef<string[]>([]);
  const incorrectRef = useRef<string[]>([]);
  const presentedRef = useRef<YearDuelQuestion | null>(null);

  const setQuizPhaseSafe = (phase: QuizPhase) => {
    quizPhaseRef.current = phase;
    setQuizPhase(phase);
  };

  const legalIds = useMemo(() => legalTokenIds(state), [state]);
  const player = currentPlayer(state);

  // ----- 1. Start Player Turn (Pass -> Immediate 6-Question Quiz) -----
  const startPlayerTurn = useCallback(() => {
    setLastTurnSummary(null);
    setDuelResult(null);
    setSelectedChoice(null);
    setIsAnswerSubmitted(false);

    // Pick exactly 6 historical questions for this turn
    const questions = pickTurnQuestions(quizYear, QUESTIONS_PER_TURN, usedRef.current);
    const newUsed = [...usedRef.current, ...questions.map((q) => q.id)];
    usedRef.current = newUsed;
    setUsedQuestionIds(newUsed);

    setTurnQuestions(questions);
    setCurrentQuestionIndex(0);
    setCorrectAnswersCount(0);

    setState((cur) => ({
      ...cur,
      phase: 'turn_quiz',
      earnedSteps: 0,
      diceValue: null,
      rawDiceRoll: null,
      hasRolled: true,
      turnQuestions: questions,
      currentQuestionIndex: 0,
      correctAnswersCount: 0,
      pendingCapture: null,
      pendingQuestion: null,
    }));
  }, [quizYear]);

  // ----- 2. Select Choice for Current Question -----
  const selectChoice = useCallback(
    (choiceIndex: number) => {
      if (isAnswerSubmitted) return;
      setSelectedChoice(choiceIndex);
    },
    [isAnswerSubmitted],
  );

  // ----- 3. Submit Answer with Instant Verification & Feedback -----
  const submitAnswer = useCallback(() => {
    if (selectedChoice === null || isAnswerSubmitted) return;
    const currentQ = turnQuestions[currentQuestionIndex];
    if (!currentQ) return;

    setIsAnswerSubmitted(true);
    const isCorrect = selectedChoice === currentQ.correctIndex;
    const nextCorrect = isCorrect ? correctAnswersCount + 1 : correctAnswersCount;
    setCorrectAnswersCount(nextCorrect);

    // Record learning signal in Akhyana Progress & Mastery system
    recordQuestionAnswer({
      questionId: currentQ.id,
      isCorrect,
      year: quizYear,
      promptOrText: currentQ.question,
      theme: currentQ.era,
    });

    setState((cur) => ({
      ...cur,
      correctAnswersCount: nextCorrect,
    }));
  }, [selectedChoice, isAnswerSubmitted, turnQuestions, currentQuestionIndex, correctAnswersCount]);

  // ----- 4. Next Question / Complete Round after 6 Questions -----
  const nextQuestion = useCallback(() => {
    if (!isAnswerSubmitted) return;

    if (currentQuestionIndex + 1 < QUESTIONS_PER_TURN && currentQuestionIndex + 1 < turnQuestions.length) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedChoice(null);
      setIsAnswerSubmitted(false);
      setState((cur) => ({
        ...cur,
        currentQuestionIndex: cur.currentQuestionIndex + 1,
      }));
    } else {
      // Completed all 6 questions -> Move to round summary
      const finalSteps = correctAnswersCount;
      setSelectedChoice(null);
      setIsAnswerSubmitted(false);
      setState((cur) => ({
        ...cur,
        phase: 'quiz_summary',
        earnedSteps: finalSteps,
        diceValue: finalSteps,
      }));
    }
  }, [isAnswerSubmitted, currentQuestionIndex, turnQuestions.length, correctAnswersCount]);

  // ----- 5. Pass Turn to Next Player -----
  const passTurn = useCallback((spacesMoved: number = 0) => {
    const cur = stateRef.current;
    const curPlayer = currentPlayer(cur);
    const next = nextSeat(cur, curPlayer.seat);
    const nextPlayer = cur.players.find((p) => p.seat === next) ?? cur.players[0];

    const summary: LastTurnSummary = {
      playerSeat: curPlayer.seat,
      playerName: curPlayer.name,
      playerColor: curPlayer.color,
      correctCount: cur.correctAnswersCount,
      totalQuestions: QUESTIONS_PER_TURN,
      spacesMoved,
      nextSeat: next,
      nextPlayerName: nextPlayer.name,
      nextPlayerColor: nextPlayer.color,
    };

    setLastTurnSummary(summary);
    setSelectedChoice(null);
    setIsAnswerSubmitted(false);
    setTurnQuestions([]);
    setCurrentQuestionIndex(0);
    setCorrectAnswersCount(0);

    setState((prev) => ({
      ...prev,
      currentSeat: next,
      phase: 'pass_turn',
      earnedSteps: 0,
      diceValue: null,
      rawDiceRoll: null,
      turnQuestions: [],
      currentQuestionIndex: 0,
      correctAnswersCount: 0,
      hasRolled: false,
      pendingCapture: null,
      pendingQuestion: null,
      lastTurnSummary: summary,
      turnNonce: prev.turnNonce + 1,
    }));
  }, []);

  // ----- 6. Proceed from Summary to Move Token -----
  const proceedToMove = useCallback(() => {
    const cur = stateRef.current;
    const steps = cur.correctAnswersCount;
    const legals = legalTokenIdsWithDistance(cur, steps);

    if (steps > 0 && legals.length > 0) {
      setState((prev) => ({
        ...prev,
        phase: 'selecting',
        earnedSteps: steps,
        diceValue: steps,
      }));
    } else {
      // 0 correct or no legal moves: pass turn directly
      passTurn(0);
    }
  }, [passTurn]);

  // ----- 7. Token Movement Animation & Duel Check -----
  const moveToken = useCallback(
    async (tokenId: string) => {
      const current = stateRef.current;
      const steps = current.earnedSteps || current.diceValue || 0;
      if (busy || current.phase !== 'selecting' || steps <= 0) return;
      if (!legalTokenIds(current).includes(tokenId)) return;
      const token = tokenById(current, tokenId);
      if (!token) return;
      const nextDistance = destinationDistance(token, steps);
      if (nextDistance === null) return;

      setBusy(true);
      if (token.distance < 0) {
        setDisplayTokens((tokens) =>
          tokens.map((item) => (item.id === tokenId ? { ...item, distance: 0 } : item)),
        );
        await sleep(STEP_MS * 2);
        for (let distance = 1; distance <= nextDistance; distance += 1) {
          setDisplayTokens((tokens) =>
            tokens.map((item) => (item.id === tokenId ? { ...item, distance } : item)),
          );
          await sleep(STEP_MS);
        }
      } else {
        for (let distance = token.distance + 1; distance <= nextDistance; distance += 1) {
          setDisplayTokens((tokens) =>
            tokens.map((item) => (item.id === tokenId ? { ...item, distance } : item)),
          );
          await sleep(STEP_MS);
        }
      }

      const moved = applyTokenMove(current, tokenId, LUDO_DISCOVERIES);
      setDisplayTokens(moved.tokens);
      setBusy(false);

      if (moved.phase === 'duel') {
        setState(moved);
      } else if (hasWon(moved, current.currentSeat)) {
        setState({
          ...moved,
          phase: 'complete',
          winnerSeat: current.currentSeat,
        });
      } else {
        // Normal move completed: attach summary and pass to next player
        const curPlayer = currentPlayer(current);
        const next = moved.currentSeat;
        const nextPlayer = current.players.find((p) => p.seat === next) ?? current.players[0];
        const summary: LastTurnSummary = {
          playerSeat: curPlayer.seat,
          playerName: curPlayer.name,
          playerColor: curPlayer.color,
          correctCount: current.correctAnswersCount,
          totalQuestions: current.turnQuestions.length || QUESTIONS_PER_TURN,
          spacesMoved: steps,
          nextSeat: next,
          nextPlayerName: nextPlayer.name,
          nextPlayerColor: nextPlayer.color,
        };
        setLastTurnSummary(summary);
        setState({
          ...moved,
          lastTurnSummary: summary,
        });
      }
    },
    [busy],
  );

  // ----- 8. Historical Duel Question Setup & Timer -----
  useEffect(() => {
    if (state.phase !== 'duel' || !state.pendingCapture) return;
    resolvedRef.current = false;
    setDuelChoices({ attacker: null, defender: null, attackerAt: null, defenderAt: null });
    setDuelElapsed(0);
    setDuelResult(null);
    duelStartRef.current = Date.now();
    setState((current) => {
      if (current.pendingQuestion) return current;
      const year = quizYear;
      let canonical: YearDuelQuestion | undefined;
      if (quizPhaseRef.current === 'retry') {
        canonical = pickRetryDuelQuestion(year, incorrectRef.current);
      } else {
        canonical = pickYearDuelQuestion(year, usedRef.current);
      }
      if (!canonical) return current;
      presentedRef.current = canonical;
      if (!usedRef.current.includes(canonical.id)) {
        usedRef.current = [...usedRef.current, canonical.id];
        setUsedQuestionIds(usedRef.current);
      }
      return attachQuestion(current, toDuelPresentation(canonical));
    });
  }, [state.phase, state.pendingCapture?.attackerTokenId, state.pendingCapture?.defenderTokenId, quizYear]);

  useEffect(() => {
    if (state.phase !== 'duel' || !state.pendingQuestion) return;
    const timer = setInterval(() => {
      setDuelElapsed(Date.now() - duelStartRef.current);
    }, 80);
    return () => clearInterval(timer);
  }, [state.phase, state.pendingQuestion]);

  // ----- 9. Duel Answer & Resolution -----
  const finishDuel = useCallback((outcome: 'attacker' | 'defender' | 'none') => {
    if (resolvedRef.current) return;
    resolvedRef.current = true;
    setDuelResult(
      outcome === 'attacker'
        ? '✓ Correct! Attack holds. Capture successful.'
        : outcome === 'defender'
        ? '✕ Incorrect. Defence holds. Opponent survives.'
        : '⏱ Time expired! Opponent holds position.',
    );

    if (presentedRef.current && (outcome === 'attacker' || outcome === 'defender')) {
      recordQuestionAnswer({
        questionId: presentedRef.current.id,
        isCorrect: outcome === 'attacker',
        year: quizYear,
        promptOrText: presentedRef.current.prompt,
        theme: presentedRef.current.theme,
      });
    }

    if (finishTimerRef.current) clearTimeout(finishTimerRef.current);
    finishTimerRef.current = setTimeout(() => {
      const activeSeat = stateRef.current.currentSeat;
      const cur = stateRef.current;
      const next = resolveDuel(cur, outcome, LUDO_DISCOVERIES);
      setDisplayTokens(next.tokens);

      if (hasWon(next, activeSeat)) {
        setState({
          ...next,
          phase: 'complete',
          winnerSeat: activeSeat,
        });
        return;
      }

      const attackerPlayer = cur.players.find((p) => p.seat === activeSeat) ?? cur.players[0];
      const nextPlayer = cur.players.find((p) => p.seat === next.currentSeat) ?? cur.players[0];
      const summary: LastTurnSummary = {
        playerSeat: attackerPlayer.seat,
        playerName: attackerPlayer.name,
        playerColor: attackerPlayer.color,
        correctCount: cur.correctAnswersCount,
        totalQuestions: cur.turnQuestions.length || QUESTIONS_PER_TURN,
        spacesMoved: cur.earnedSteps || cur.diceValue || 0,
        nextSeat: next.currentSeat,
        nextPlayerName: nextPlayer.name,
        nextPlayerColor: nextPlayer.color,
      };
      setLastTurnSummary(summary);
      setState({
        ...next,
        lastTurnSummary: summary,
      });

      setDuelResult(null);
      presentedRef.current = null;
    }, 1200);
  }, []);

  const answerDuel = useCallback((role: 'attacker' | 'defender', choice: number) => {
    if (stateRef.current.phase !== 'duel' || resolvedRef.current) return;
    const at = Date.now() - duelStartRef.current;
    if (at > DUEL_MS) return;
    setDuelChoices((current) => {
      if (role === 'attacker' && current.attacker !== null) return current;
      if (role === 'defender' && current.defender !== null) return current;
      return role === 'attacker'
        ? { ...current, attacker: choice, attackerAt: at }
        : { ...current, defender: choice, defenderAt: at };
    });
  }, []);

  useEffect(() => {
    if (state.phase !== 'duel' || !state.pendingQuestion || resolvedRef.current) return;
    if (!state.pendingCapture) {
      finishDuel('none');
      return;
    }
    const outcome = evaluateDuelAnswers({
      correctIndex: state.pendingQuestion.correctIndex,
      attackerChoice: duelChoices.attacker,
      defenderChoice: duelChoices.defender,
      attackerAtMs: duelChoices.attackerAt,
      defenderAtMs: duelChoices.defenderAt,
      elapsedMs: duelElapsed,
    });
    if (outcome !== 'pending') finishDuel(outcome);
  }, [duelChoices, duelElapsed, finishDuel, state.pendingQuestion, state.phase]);

  const continueDiscovery = useCallback(() => {
    setState((current) => {
      const next = collectDiscovery(current, LUDO_DISCOVERIES);
      setDisplayTokens(next.tokens);
      return next;
    });
  }, []);

  const selectNextYear = useCallback((year: number) => {
    setQuizYearState(year);
    setQuizPhaseSafe('initial');
    usedRef.current = [];
    incorrectRef.current = [];
    presentedRef.current = null;
    setUsedQuestionIds([]);
    setIncorrectQuestionIds([]);
  }, []);

  const reset = useCallback(() => {
    const next = createLudoGame(players);
    setState(next);
    setDisplayTokens(next.tokens);
    setBusy(false);
    setSelectedChoice(null);
    setIsAnswerSubmitted(false);
    setLastTurnSummary(null);
    setTurnQuestions([]);
    setCurrentQuestionIndex(0);
    setCorrectAnswersCount(0);
    setDuelResult(null);
    usedRef.current = [];
    incorrectRef.current = [];
    presentedRef.current = null;
    setUsedQuestionIds([]);
    setIncorrectQuestionIds([]);
    setQuizPhaseSafe('initial');
    const year = getLudoYear();
    if (year) setQuizYearState(year);
  }, [players]);

  return {
    state,
    displayTokens,
    player,
    legalIds,
    busy,
    questionsPerTurn: QUESTIONS_PER_TURN,
    turnQuestions,
    currentQuestionIndex,
    correctAnswersCount,
    selectedChoice,
    isAnswerSubmitted,
    lastTurnSummary,
    duelChoices,
    duelElapsed,
    duelResult,
    startPlayerTurn,
    selectChoice,
    submitAnswer,
    nextQuestion,
    proceedToMove,
    passTurn,
    moveToken,
    answerDuel,
    continueDiscovery,
    reset,
    // Year-based quiz cycle
    quizYear,
    quizPhase,
    usedQuestionIds,
    incorrectQuestionIds,
    selectNextYear,
  };
}
