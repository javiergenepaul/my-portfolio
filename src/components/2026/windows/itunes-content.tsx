"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  AlertCircle,
  Headphones,
  ListMusic,
  Pause,
  Play,
  RefreshCw,
  SkipBack,
  SkipForward,
  Volume2,
} from "lucide-react";
import { translate, useLocaleRefresh } from "@/i18n";
import { useIsMobile } from "../hooks";

type MusicTrack = {
  id: string;
  title: string;
  artist: string;
  album: string;
  collection: string;
  src: string;
  fileName: string;
  preview?: boolean;
};

type MusicResponse = {
  tracks: MusicTrack[];
};

let sharedItunesAudio: HTMLAudioElement | null = null;
const itunesSessionState: {
  didInitialize: boolean;
  activeCollection: string;
  currentTrackId: string | null;
  isPlaying: boolean;
} = {
  didInitialize: false,
  activeCollection: "all",
  currentTrackId: null,
  isPlaying: false,
};

const DEFAULT_COLLECTION = "My Playlist";
const DEFAULT_TRACK_MATCHERS = [
  "viva la vida",
  "/music/my playlist/coldplay - viva la vida",
];

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${mins}:${secs}`;
}

function sortCollections(left: string, right: string) {
  const normalizedLeft = left.trim().toLowerCase();
  const normalizedRight = right.trim().toLowerCase();
  const leftIsMyPlaylist =
    normalizedLeft === "my playlist" || normalizedLeft === "playlist";
  const rightIsMyPlaylist =
    normalizedRight === "my playlist" || normalizedRight === "playlist";

  if (leftIsMyPlaylist && !rightIsMyPlaylist) return -1;
  if (!leftIsMyPlaylist && rightIsMyPlaylist) return 1;

  return left.localeCompare(right);
}

function isDefaultTrack(track: MusicTrack) {
  const haystacks = [track.title, track.fileName, track.src].map((value) =>
    value.toLowerCase(),
  );

  return DEFAULT_TRACK_MATCHERS.some((needle) =>
    haystacks.some((haystack) => haystack.includes(needle)),
  );
}

function getSharedItunesAudio() {
  if (typeof window === "undefined") return null;

  if (!sharedItunesAudio) {
    sharedItunesAudio = new Audio();
    sharedItunesAudio.preload = "metadata";
  }

  return sharedItunesAudio;
}

export function ItunesContent() {
  useLocaleRefresh();
  const isMobile = useIsMobile();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fetchStartedRef = useRef(false);
  const [audioReady, setAudioReady] = useState(false);
  const [tracks, setTracks] = useState<MusicTrack[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCollection, setActiveCollection] = useState<string>(
    itunesSessionState.activeCollection,
  );
  const [currentTrackId, setCurrentTrackId] = useState<string | null>(
    itunesSessionState.currentTrackId,
  );
  const [isPlaying, setIsPlaying] = useState(itunesSessionState.isPlaying);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);

  const loadTracks = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/music", { cache: "no-store" });
      if (!response.ok) throw new Error("request_failed");
      const data = (await response.json()) as MusicResponse;
      const defaultTrack =
        data.tracks.find(isDefaultTrack) ?? data.tracks[0] ?? null;
      const sessionTrack = itunesSessionState.currentTrackId
        ? (data.tracks.find(
            (track) => track.id === itunesSessionState.currentTrackId,
          ) ?? null)
        : null;
      const nextTrack = sessionTrack ?? defaultTrack;

      setTracks(data.tracks);
      setCurrentTrackId((prev) => {
        if (prev && data.tracks.some((track) => track.id === prev)) return prev;
        return nextTrack?.id ?? null;
      });

      if (!itunesSessionState.didInitialize && defaultTrack) {
        itunesSessionState.didInitialize = true;
        itunesSessionState.activeCollection =
          defaultTrack.collection || DEFAULT_COLLECTION;
        itunesSessionState.currentTrackId = defaultTrack.id;
        itunesSessionState.isPlaying = false;

        setActiveCollection(defaultTrack.collection || DEFAULT_COLLECTION);
        setIsPlaying(false);
      } else if (nextTrack) {
        setActiveCollection(
          itunesSessionState.activeCollection ||
            nextTrack.collection ||
            DEFAULT_COLLECTION,
        );
        setIsPlaying(itunesSessionState.isPlaying);
      }
    } catch {
      setError(translate("win26.itunes.error"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const audio = getSharedItunesAudio();
    if (!audio) return;

    audioRef.current = audio;
    audio.volume = volume;
    setCurrentTime(audio.currentTime || 0);
    setDuration(audio.duration || 0);
    setAudioReady(true);
  }, []);

  useEffect(() => {
    if (fetchStartedRef.current) return;
    fetchStartedRef.current = true;
    void loadTracks();
  }, []);

  const collections = useMemo(() => {
    const items = Array.from(new Set(tracks.map((track) => track.collection)));
    return items.sort(sortCollections);
  }, [tracks]);

  const visibleTracks = useMemo(() => {
    if (activeCollection === "all") return tracks;
    return tracks.filter((track) => track.collection === activeCollection);
  }, [activeCollection, tracks]);

  const currentTrack = useMemo(
    () => tracks.find((track) => track.id === currentTrackId) ?? null,
    [currentTrackId, tracks],
  );

  useEffect(() => {
    if (!audioReady) return;

    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    if (audio.dataset.trackId !== currentTrack.id) {
      audio.src = currentTrack.src;
      audio.dataset.trackId = currentTrack.id;
      audio.load();
      setCurrentTime(0);
      setDuration(0);
    }

    if (isPlaying) {
      if (audio.paused) {
        void audio.play().catch(() => setIsPlaying(false));
      }
    } else {
      audio.pause();
    }
  }, [audioReady, currentTrack, isPlaying]);

  useEffect(() => {
    if (!audioReady) return;

    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume;
  }, [audioReady, volume]);

  useEffect(() => {
    itunesSessionState.activeCollection = activeCollection;
  }, [activeCollection]);

  useEffect(() => {
    itunesSessionState.currentTrackId = currentTrackId;
  }, [currentTrackId]);

  useEffect(() => {
    itunesSessionState.isPlaying = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    if (!audioReady) return;

    const audio = audioRef.current;
    if (!audio) return;

    const handleTime = () => setCurrentTime(audio.currentTime);
    const handleDuration = () => setDuration(audio.duration || 0);
    const handleEnded = () => {
      if (!visibleTracks.length || !currentTrackId) {
        setIsPlaying(false);
        return;
      }
      const index = visibleTracks.findIndex(
        (track) => track.id === currentTrackId,
      );
      const nextTrack = visibleTracks[(index + 1) % visibleTracks.length];
      setCurrentTrackId(nextTrack?.id ?? null);
      setIsPlaying(Boolean(nextTrack));
    };

    audio.addEventListener("timeupdate", handleTime);
    audio.addEventListener("loadedmetadata", handleDuration);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTime);
      audio.removeEventListener("loadedmetadata", handleDuration);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [audioReady, currentTrackId, visibleTracks]);

  useEffect(() => {
    if (activeCollection === "all") return;
    if (visibleTracks.length > 0) return;
    setActiveCollection("all");
  }, [activeCollection, visibleTracks.length]);

  const playTrack = (trackId: string) => {
    setCurrentTrackId(trackId);
    setIsPlaying(true);
  };

  const togglePlayback = async () => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;
    if (audio.paused) {
      setIsPlaying(true);
      await audio.play().catch(() => setIsPlaying(false));
      return;
    }
    audio.pause();
    setIsPlaying(false);
  };

  const skipTrack = (direction: -1 | 1) => {
    const pool = visibleTracks.length ? visibleTracks : tracks;
    if (!pool.length) return;
    const currentIndex = pool.findIndex((track) => track.id === currentTrackId);
    const safeIndex = currentIndex === -1 ? 0 : currentIndex;
    const nextIndex = (safeIndex + direction + pool.length) % pool.length;
    setCurrentTrackId(pool[nextIndex].id);
    setIsPlaying(true);
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="font-mac flex flex-1 min-h-0 overflow-hidden">
      <div
        className="flex flex-1 min-h-0 overflow-hidden"
        style={{ flexDirection: isMobile ? "column" : "row" }}
      >
        <aside
          className="shrink-0 bg-a26-sidebar border-a26-glass-border"
          style={{
            width: isMobile ? "100%" : 220,
            borderRight: isMobile
              ? "none"
              : "1px solid var(--a26-glass-border)",
            borderBottom: isMobile
              ? "1px solid var(--a26-glass-border)"
              : "none",
          }}
        >
          <div className="flex items-center gap-2 px-4 py-3 border-b border-a26-glass-border">
            <div
              className="flex items-center justify-center w-8 h-8 rounded-[10px]"
              style={{
                background: "color-mix(in srgb, #EC4899 16%, transparent)",
                border:
                  "1px solid color-mix(in srgb, #EC4899 28%, transparent)",
              }}
            >
              <Headphones size={16} color="#EC4899" />
            </div>
            <div className="min-w-0">
              <div className="text-a26-text text-[13px] font-semibold">
                {translate("win26.itunes.title")}
              </div>
              <div className="text-a26-mid text-[11px]">
                {translate("win26.itunes.subtitle")}
              </div>
            </div>
          </div>

          <div
            className="win26-scroll overflow-auto p-2 [scrollbar-width:thin]"
            style={{ maxHeight: isMobile ? 176 : "calc(100% - 61px)" }}
          >
            <button
              onClick={() => setActiveCollection("all")}
              className="font-mac flex items-center w-full gap-2 rounded-[10px] border-none cursor-pointer px-3 py-2 text-left"
              style={{
                background:
                  activeCollection === "all"
                    ? "color-mix(in srgb, #EC4899 12%, transparent)"
                    : "transparent",
                color:
                  activeCollection === "all"
                    ? "var(--a26-text)"
                    : "var(--a26-text-mid)",
              }}
            >
              <ListMusic size={14} />
              <span className="flex-1 text-[12px] font-medium">
                {translate("win26.itunes.allSongs")}
              </span>
              <span className="text-[10px] opacity-70">{tracks.length}</span>
            </button>

            <div className="px-3 pt-3 pb-1 text-[10px] font-semibold tracking-[0.14em] uppercase text-a26-muted">
              {translate("win26.itunes.collections")}
            </div>

            <div className="flex flex-col gap-1">
              {collections.map((collection) => {
                const collectionCount = tracks.filter(
                  (track) => track.collection === collection,
                ).length;

                return (
                  <button
                    key={collection}
                    onClick={() => setActiveCollection(collection)}
                    className="font-mac flex items-center w-full gap-2 rounded-[10px] border-none cursor-pointer px-3 py-2 text-left"
                    style={{
                      background:
                        activeCollection === collection
                          ? "color-mix(in srgb, #EC4899 12%, transparent)"
                          : "transparent",
                      color:
                        activeCollection === collection
                          ? "var(--a26-text)"
                          : "var(--a26-text-mid)",
                    }}
                  >
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ background: "#EC4899", opacity: 0.9 }}
                    />
                    <span className="flex-1 text-[12px] truncate">
                      {collection}
                    </span>
                    <span className="text-[10px] opacity-70">
                      {collectionCount}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        <section className="flex flex-1 min-h-0 flex-col overflow-hidden">
          <div className="shrink-0 border-b border-a26-glass-border bg-a26-title-bar px-4 py-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-a26-text text-[14px] font-semibold">
                  {activeCollection === "all"
                    ? translate("win26.itunes.libraryTitle")
                    : activeCollection}
                </div>
                <div className="text-a26-mid text-[11px] mt-1">
                  {translate("win26.itunes.libraryMeta", {
                    tracks: visibleTracks.length,
                    collections: collections.length,
                  })}
                </div>
              </div>
              <button
                onClick={() => void loadTracks()}
                className="font-mac flex items-center gap-1.5 bg-a26-glass border border-a26-glass-border rounded-[9px] cursor-pointer px-3 py-1.75 text-[11px] text-a26-text"
              >
                <RefreshCw size={12} />
                {translate("win26.itunes.refresh")}
              </button>
            </div>
          </div>

          <div
            className="win26-scroll flex-1 overflow-auto px-3 py-3 [scrollbar-width:thin]"
            style={{ scrollbarColor: "rgba(255,255,255,0.18) transparent" }}
          >
            {loading ? (
              <div className="flex h-full min-h-52 items-center justify-center text-a26-mid text-[12px]">
                {translate("win26.itunes.loading")}
              </div>
            ) : error ? (
              <div className="flex h-full min-h-52 flex-col items-center justify-center gap-3 text-center px-6">
                <AlertCircle size={18} color="#FB7185" />
                <div className="text-a26-text text-[13px] font-medium">
                  {error}
                </div>
                <button
                  onClick={() => void loadTracks()}
                  className="font-mac bg-a26-glass border border-a26-glass-border rounded-[9px] cursor-pointer px-3 py-1.75 text-[11px] text-a26-text"
                >
                  {translate("win26.itunes.tryAgain")}
                </button>
              </div>
            ) : visibleTracks.length === 0 ? (
              <div className="flex h-full min-h-52 flex-col items-center justify-center gap-3 text-center px-6">
                <div
                  className="flex items-center justify-center w-14 h-14 rounded-[18px]"
                  style={{
                    background: "color-mix(in srgb, #EC4899 12%, transparent)",
                    border:
                      "1px solid color-mix(in srgb, #EC4899 22%, transparent)",
                  }}
                >
                  <Headphones size={28} color="#EC4899" />
                </div>
                <div className="text-a26-text text-[14px] font-semibold">
                  {translate("win26.itunes.emptyTitle")}
                </div>
                <p className="m-0 max-w-xs text-a26-mid text-[12px] leading-[1.7]">
                  {translate("win26.itunes.emptyBody")}
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {visibleTracks.map((track, index) => {
                  const active = track.id === currentTrackId;
                  return (
                    <button
                      key={track.id}
                      onClick={() => playTrack(track.id)}
                      className="font-mac bg-a26-card border border-a26-card-border flex items-center gap-3 rounded-xl cursor-pointer px-3 py-3 text-left"
                      style={{
                        background: active
                          ? "color-mix(in srgb, #EC4899 8%, var(--a26-card))"
                          : undefined,
                        borderColor: active
                          ? "color-mix(in srgb, #EC4899 28%, transparent)"
                          : undefined,
                      }}
                    >
                      <div
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px]"
                        style={{
                          background:
                            active && isPlaying
                              ? "linear-gradient(160deg, #FB7185 0%, #C026D3 100%)"
                              : "color-mix(in srgb, #EC4899 12%, transparent)",
                        }}
                      >
                        {active && isPlaying ? (
                          <Pause size={15} color="white" />
                        ) : (
                          <Play
                            size={15}
                            color={active ? "white" : "#EC4899"}
                          />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-a26-text text-[13px] font-semibold truncate">
                            {track.title}
                          </span>
                          <span className="text-a26-muted text-[10px] shrink-0">
                            #{index + 1}
                          </span>
                          {track.preview && (
                            <span
                              className="shrink-0 rounded-[5px] px-1.5 py-0.5 text-[9px] font-semibold tracking-wide"
                              style={{
                                background:
                                  "color-mix(in srgb, #EC4899 14%, transparent)",
                                color: "#EC4899",
                                border:
                                  "1px solid color-mix(in srgb, #EC4899 28%, transparent)",
                              }}
                            >
                              30s
                            </span>
                          )}
                        </div>
                        <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-a26-mid text-[11px]">
                          <span>{track.artist}</span>
                          <span>•</span>
                          <span>{track.album}</span>
                          <span>•</span>
                          <span>{track.collection}</span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="shrink-0 border-t border-a26-glass-border bg-a26-title-bar px-4 py-3">
            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              <div className="min-w-0 flex-1">
                <div className="text-a26-text text-[13px] font-semibold truncate">
                  {currentTrack?.title ??
                    translate("win26.itunes.nothingPlaying")}
                </div>
                <div className="text-a26-mid text-[11px] mt-1 truncate">
                  {currentTrack
                    ? `${currentTrack.artist} • ${currentTrack.album}`
                    : translate("win26.itunes.pickTrack")}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => skipTrack(-1)}
                  disabled={!tracks.length}
                  className="font-mac bg-a26-glass border border-a26-glass-border flex h-9 w-9 items-center justify-center rounded-full cursor-pointer disabled:opacity-50"
                >
                  <SkipBack size={14} />
                </button>
                <button
                  onClick={() => void togglePlayback()}
                  disabled={!currentTrack}
                  className="font-mac border-none flex h-10 w-10 items-center justify-center rounded-full cursor-pointer disabled:opacity-50"
                  style={{
                    background:
                      "linear-gradient(160deg, #FB7185 0%, #C026D3 100%)",
                    color: "white",
                  }}
                >
                  {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                </button>
                <button
                  onClick={() => skipTrack(1)}
                  disabled={!tracks.length}
                  className="font-mac bg-a26-glass border border-a26-glass-border flex h-9 w-9 items-center justify-center rounded-full cursor-pointer disabled:opacity-50"
                >
                  <SkipForward size={14} />
                </button>
              </div>

              <div className="flex items-center gap-2 md:w-56">
                <Volume2 size={14} className="text-a26-mid shrink-0" />
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={volume}
                  onChange={(event) => setVolume(Number(event.target.value))}
                  className="w-full accent-pink-500"
                />
              </div>
            </div>

            <div className="mt-3 flex items-center gap-3">
              <span className="text-a26-muted text-[10px] tabular-nums">
                {formatTime(currentTime)}
              </span>
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-a26-glass">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${Math.min(progress, 100)}%`,
                    background:
                      "linear-gradient(90deg, #FB7185 0%, #C026D3 100%)",
                  }}
                />
              </div>
              <span className="text-a26-muted text-[10px] tabular-nums">
                {formatTime(duration)}
              </span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
