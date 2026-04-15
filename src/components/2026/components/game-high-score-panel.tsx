"use client";

import { useEffect, useMemo, useState } from "react";
import { useGameHighScoresStore, type GameScoreKey } from "@/stores";
import { translate, useLocaleRefresh } from "@/i18n";

const EMPTY_SCORES: ReadonlyArray<{
  id: string;
  name: string;
  value: number;
  displayValue: string;
  createdAt: number;
}> = [];

export function GameHighScorePanel({
  scoreKey,
  title,
  accentColor,
  currentValue,
  currentDisplayValue,
  runToken,
  canSubmit,
  isRecord = false,
  note,
  emptyLabel = "No saved scores yet",
}: {
  scoreKey: GameScoreKey;
  title: string;
  accentColor: string;
  currentValue: number;
  currentDisplayValue: string;
  runToken: number;
  canSubmit: boolean;
  isRecord?: boolean;
  note?: string;
  emptyLabel?: string;
}) {
  useLocaleRefresh();
  const playerName = useGameHighScoresStore((state) => state.playerName);
  const setPlayerName = useGameHighScoresStore((state) => state.setPlayerName);
  const saveScore = useGameHighScoresStore((state) => state.saveScore);
  const scores = useGameHighScoresStore(
    (state) => state.scores[scoreKey] ?? EMPTY_SCORES,
  );
  const [savedRunToken, setSavedRunToken] = useState<number | null>(null);

  useEffect(() => {
    setSavedRunToken(null);
  }, [runToken]);

  const trimmedName = playerName.trim();
  const hasSaved = savedRunToken === runToken;
  const isDisabled = !canSubmit || currentValue <= 0 || hasSaved;

  const helperText = useMemo(() => {
    if (hasSaved) return translate("win26.gameUi.savedForRun" as any);
    if (!canSubmit) return translate("win26.gameUi.finishRunToSave" as any);
    if (isRecord) return translate("win26.gameUi.saveNewRecord" as any);
    return note ?? translate("win26.gameUi.saveRunDefault" as any);
  }, [canSubmit, hasSaved, isRecord, note]);

  return (
    <div
      className="font-mac flex flex-col gap-3 rounded-xl border p-3"
      style={{
        background: "rgba(255,255,255,0.04)",
        borderColor: "rgba(255,255,255,0.08)",
      }}
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <div
            className="text-[10px] font-bold uppercase tracking-[0.18em]"
            style={{ color: isRecord ? accentColor : "rgba(255,255,255,0.34)" }}
          >
            {isRecord
              ? translate("win26.gameUi.newHighScore" as any)
              : translate("win26.gameUi.highScores" as any)}
          </div>
          <div className="mt-1 text-[13px] font-semibold text-white">
            {title}
          </div>
        </div>
        <div className="text-right">
          <div
            className="text-[10px] font-bold uppercase tracking-[0.16em]"
            style={{ color: "rgba(255,255,255,0.28)" }}
          >
            {translate("win26.gameUi.current" as any)}
          </div>
          <div
            className="mt-1 font-mono text-[14px] font-bold"
            style={{ color: accentColor }}
          >
            {currentDisplayValue}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          value={playerName}
          maxLength={24}
          onChange={(event) => setPlayerName(event.target.value)}
          placeholder={translate("win26.gameUi.namePlaceholder" as any)}
          className="font-mac min-w-0 flex-1 rounded-[9px] border px-3 py-2 text-[12px] text-white outline-none"
          style={{
            background: "rgba(0,0,0,0.24)",
            borderColor: "rgba(255,255,255,0.10)",
          }}
        />
        <button
          onClick={() => {
            saveScore(scoreKey, {
              name:
                trimmedName || translate("win26.gameUi.defaultPlayer" as any),
              value: currentValue,
              displayValue: currentDisplayValue,
            });
            setSavedRunToken(runToken);
          }}
          disabled={isDisabled}
          className="font-mac rounded-[9px] border-none px-4 py-2 text-[12px] font-semibold transition-opacity"
          style={{
            background: isDisabled ? "rgba(255,255,255,0.08)" : accentColor,
            color: isDisabled ? "rgba(255,255,255,0.42)" : "#0A0A0A",
            cursor: isDisabled ? "default" : "pointer",
            opacity: isDisabled ? 0.72 : 1,
          }}
        >
          {hasSaved
            ? translate("win26.gameUi.saved" as any)
            : translate("win26.gameUi.saveScore" as any)}
        </button>
      </div>

      <div className="text-[10px]" style={{ color: "rgba(255,255,255,0.34)" }}>
        {helperText}
      </div>

      <div className="flex flex-col gap-1.5">
        {scores.length > 0 ? (
          scores.slice(0, 5).map((entry, index) => (
            <div
              key={entry.id}
              className="flex items-center justify-between gap-3 rounded-[9px] px-2.5 py-2"
              style={{ background: "rgba(255,255,255,0.04)" }}
            >
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="font-mono text-[11px] font-bold"
                  style={{ color: accentColor }}
                >
                  #{index + 1}
                </span>
                <span className="truncate text-[12px] text-white">
                  {entry.name}
                </span>
              </div>
              <span
                className="shrink-0 font-mono text-[11px] font-semibold"
                style={{ color: "rgba(255,255,255,0.72)" }}
              >
                {entry.displayValue}
              </span>
            </div>
          ))
        ) : (
          <div
            className="rounded-[9px] px-2.5 py-2 text-[11px]"
            style={{
              background: "rgba(255,255,255,0.03)",
              color: "rgba(255,255,255,0.28)",
            }}
          >
            {emptyLabel || translate("win26.gameUi.noSavedScoresYet" as any)}
          </div>
        )}
      </div>
    </div>
  );
}
