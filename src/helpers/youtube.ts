// The native app serves this page from a local `file://` bundle, so the page
// has no origin and the browser omits the Referer. YouTube rejects embedded
// players without one (error 153), so the IFrame API is told to identify the
// embedder with this origin instead.
export const FALLBACK_EMBEDDER_ORIGIN = 'https://little-world.com';

export function getEmbedderOrigin(locationOrigin: string): string {
  return locationOrigin.startsWith('http')
    ? locationOrigin
    : FALLBACK_EMBEDDER_ORIGIN;
}

export function extractYoutubeId(input: string): string | null {
  // Accept raw ids, youtu.be links, and youtube.com links.
  // YouTube video ids are always 11 chars (letters, digits, _ and -).
  const rawIdMatch = input.match(/^[a-zA-Z0-9_-]{11}$/);
  if (rawIdMatch) return input;

  try {
    const url = new URL(input);
    const host = url.hostname.toLowerCase();

    if (host === 'youtu.be') {
      const pathParts = url.pathname.split('/').filter(Boolean);
      return pathParts[0] ?? null;
    }

    if (host.includes('youtube.com')) {
      // https://www.youtube.com/watch?v=<id>
      const v = url.searchParams.get('v');
      if (v && /^[a-zA-Z0-9_-]{11}$/.test(v)) return v;

      // https://www.youtube.com/embed/<id>
      const embedMatch = url.pathname.match(/\/embed\/([a-zA-Z0-9_-]{11})/);
      if (embedMatch?.[1]) return embedMatch[1];

      // https://www.youtube.com/shorts/<id>
      const shortsMatch = url.pathname.match(/\/shorts\/([a-zA-Z0-9_-]{11})/);
      if (shortsMatch?.[1]) return shortsMatch[1];
    }
  } catch {
    // Fall back to regex matching below.
  }

  const idMatch = input.match(
    /(?:v=|embed\/|shorts\/|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
  );
  return idMatch?.[1] ?? null;
}
