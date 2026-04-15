import { NextResponse } from "next/server";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const MUSIC_ROOT = path.join(process.cwd(), "public", "music");
const PLAYLIST_JSON = path.join(MUSIC_ROOT, "playlist.json");
const AUDIO_EXTENSIONS = new Set([
  ".mp3",
  ".m4a",
  ".mp4",
  ".wav",
  ".ogg",
  ".flac",
  ".aac",
]);

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

type PlaylistEntry = {
  title: string;
  artist: string;
  album?: string;
  collection?: string;
  src: string;
};

type ItunesQuery = {
  term: string;
  limit?: number;
  collection?: string;
};

type PlaylistConfig = {
  tracks?: PlaylistEntry[];
  itunes?: ItunesQuery[];
};

type ItunesResult = {
  trackId: number;
  trackName: string;
  artistName: string;
  collectionName: string;
  previewUrl: string;
};

type ItunesResponse = {
  results: ItunesResult[];
};

function toTitleCase(value: string) {
  return value.replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim();
}

function parseTrackMeta(fileName: string, collection: string) {
  const baseName = fileName.replace(/\.[^.]+$/, "");
  const normalized = baseName.replace(/^\d+[._ -]*/, "").trim();
  const pieces = normalized.split(" - ").map((part) => toTitleCase(part));

  if (pieces.length >= 3) {
    return {
      artist: pieces[0],
      album: pieces[1],
      title: pieces.slice(2).join(" - "),
    };
  }

  if (pieces.length === 2) {
    return {
      artist: pieces[0],
      album: toTitleCase(collection),
      title: pieces[1],
    };
  }

  return {
    artist: "Unknown Artist",
    album: toTitleCase(collection),
    title: toTitleCase(normalized || baseName),
  };
}

async function walkMusicDir(
  dirPath: string,
  relativeDir = "",
): Promise<MusicTrack[]> {
  const entries = await readdir(dirPath, { withFileTypes: true });
  const tracks = await Promise.all(
    entries.map(async (entry) => {
      const absolutePath = path.join(dirPath, entry.name);
      const relativePath = path.join(relativeDir, entry.name);

      if (entry.isDirectory()) {
        return walkMusicDir(absolutePath, relativePath);
      }

      const extension = path.extname(entry.name).toLowerCase();
      if (!AUDIO_EXTENSIONS.has(extension)) return [];

      const collectionPath = path.dirname(relativePath);
      const collection =
        collectionPath === "."
          ? "Singles"
          : collectionPath.split(path.sep).join(" / ");
      const meta = parseTrackMeta(entry.name, collection);
      const src = `/music/${relativePath.split(path.sep).join("/")}`;

      return [
        {
          id: src,
          src,
          collection,
          fileName: entry.name,
          ...meta,
        },
      ];
    }),
  );

  return tracks.flat().sort((left, right) => {
    const byCollection = left.collection.localeCompare(right.collection);
    if (byCollection !== 0) return byCollection;
    return left.title.localeCompare(right.title);
  });
}

async function fetchItunesTracks(query: ItunesQuery): Promise<MusicTrack[]> {
  try {
    const limit = Math.min(query.limit ?? 10, 25);
    const url = `https://itunes.apple.com/search?term=${encodeURIComponent(query.term)}&media=music&entity=song&limit=${limit}`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const data = (await res.json()) as ItunesResponse;
    return data.results
      .filter((item) => item.previewUrl)
      .map((item) => ({
        id: `itunes-${item.trackId}`,
        src: item.previewUrl,
        title: item.trackName,
        artist: item.artistName,
        album: item.collectionName,
        collection: query.collection ?? item.collectionName,
        fileName: `${item.trackName}.m4a`,
        preview: true,
      }));
  } catch {
    return [];
  }
}

async function loadPlaylistJson(): Promise<{
  manual: MusicTrack[];
  itunesQueries: ItunesQuery[];
}> {
  try {
    const raw = await readFile(PLAYLIST_JSON, "utf-8");
    const parsed = JSON.parse(raw) as PlaylistConfig | PlaylistEntry[];

    // Support both old array format and new object format
    if (Array.isArray(parsed)) {
      const manual = parsed
        .filter((entry) => entry?.src && entry?.title)
        .map((entry) => ({
          id: entry.src,
          src: entry.src,
          title: entry.title,
          artist: entry.artist ?? "Unknown Artist",
          album: entry.album ?? entry.collection ?? "Unknown Album",
          collection: entry.collection ?? "Playlist",
          fileName: entry.src.split("/").pop() ?? entry.title,
        }));
      return { manual, itunesQueries: [] };
    }

    const manual = (parsed.tracks ?? [])
      .filter((entry) => entry?.src && entry?.title)
      .map((entry) => ({
        id: entry.src,
        src: entry.src,
        title: entry.title,
        artist: entry.artist ?? "Unknown Artist",
        album: entry.album ?? entry.collection ?? "Unknown Album",
        collection: entry.collection ?? "Playlist",
        fileName: entry.src.split("/").pop() ?? entry.title,
      }));

    return { manual, itunesQueries: parsed.itunes ?? [] };
  } catch {
    return { manual: [], itunesQueries: [] };
  }
}

export async function GET() {
  try {
    const [fsTracks, { manual, itunesQueries }] = await Promise.all([
      walkMusicDir(MUSIC_ROOT).catch((error) => {
        if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
        throw error;
      }),
      loadPlaylistJson(),
    ]);

    const itunesTracks = (
      await Promise.all(itunesQueries.map(fetchItunesTracks))
    ).flat();

    const seen = new Set<string>();
    const tracks: MusicTrack[] = [];

    for (const track of [...manual, ...itunesTracks, ...fsTracks]) {
      if (!seen.has(track.id)) {
        seen.add(track.id);
        tracks.push(track);
      }
    }

    return NextResponse.json({ tracks });
  } catch {
    return NextResponse.json(
      { message: "Failed to read music library." },
      { status: 500 },
    );
  }
}
