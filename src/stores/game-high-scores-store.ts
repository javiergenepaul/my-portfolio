import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type GameScoreKey =
  | "snake"
  | "tetris"
  | "bomber"
  | "jump-easy"
  | "jump-hard"
  | "hanoi-3"
  | "hanoi-4"
  | "hanoi-5"
  | "hanoi-6";

export interface GameHighScoreEntry {
  id: string;
  name: string;
  value: number;
  displayValue: string;
  createdAt: number;
}

interface GameHighScoreState {
  playerName: string;
  scores: Record<GameScoreKey, GameHighScoreEntry[]>;
  setPlayerName: (playerName: string) => void;
  saveScore: (scoreKey: GameScoreKey, entry: Omit<GameHighScoreEntry, "id" | "createdAt">) => void;
}

const SCORE_LIMIT = 10;

const DEFAULT_SCORES: Record<GameScoreKey, GameHighScoreEntry[]> = {
  snake: [],
  tetris: [],
  bomber: [],
  "jump-easy": [],
  "jump-hard": [],
  "hanoi-3": [],
  "hanoi-4": [],
  "hanoi-5": [],
  "hanoi-6": [],
};

const ASCENDING_KEYS = new Set<GameScoreKey>([
  "hanoi-3",
  "hanoi-4",
  "hanoi-5",
  "hanoi-6",
]);

export function isAscendingScoreKey(scoreKey: GameScoreKey) {
  return ASCENDING_KEYS.has(scoreKey);
}

export function isBetterScore(
  scoreKey: GameScoreKey,
  candidate: number,
  currentBest?: number | null,
) {
  if (candidate <= 0) return false;
  if (currentBest === undefined || currentBest === null) return true;
  return isAscendingScoreKey(scoreKey)
    ? candidate < currentBest
    : candidate > currentBest;
}

function sortScores(scoreKey: GameScoreKey, scores: GameHighScoreEntry[]) {
  const ascending = isAscendingScoreKey(scoreKey);
  return [...scores]
    .sort((left, right) => {
      if (left.value !== right.value) {
        return ascending ? left.value - right.value : right.value - left.value;
      }
      return left.createdAt - right.createdAt;
    })
    .slice(0, SCORE_LIMIT);
}

export const useGameHighScoresStore = create<GameHighScoreState>()(
  persist(
    (set) => ({
      playerName: "",
      scores: DEFAULT_SCORES,
      setPlayerName: (playerName) => set({ playerName }),
      saveScore: (scoreKey, entry) =>
        set((state) => ({
          scores: {
            ...state.scores,
            [scoreKey]: sortScores(scoreKey, [
              ...(state.scores[scoreKey] ?? []),
              {
                ...entry,
                id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
                createdAt: Date.now(),
              },
            ]),
          },
        })),
    }),
    {
      name: "portfolio-game-high-scores",
      storage: createJSONStorage(() =>
        typeof window !== "undefined" ? localStorage : (null as any),
      ),
      partialize: (state) => ({
        playerName: state.playerName,
        scores: state.scores,
      }),
    },
  ),
);