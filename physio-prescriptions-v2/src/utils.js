export function parseYouTubeId(url) {
  if (!url) return null;
  // Standard YouTube URL
  let match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/
  );
  if (match && match[1]) return match[1];

  // Fallback: Try to extract 11-char ID from query param v=
  match = url.match(/[?&]v=([A-Za-z0-9_-]{11})/);
  if (match && match[1]) return match[1];

  return null;
}
