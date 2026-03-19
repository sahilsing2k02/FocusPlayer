export function getPlaylistId(url) {
  const match = url.match(/[?&]list=([^&]+)/);
  return match ? match[1] : null;
}