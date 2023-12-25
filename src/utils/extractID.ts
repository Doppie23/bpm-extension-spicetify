export default function extractIdFromSpotifyURI(uri: string): string | null {
  const parts = uri.split(":");
  if (parts.length >= 3) {
    return parts[2];
  } else {
    return null;
  }
}
