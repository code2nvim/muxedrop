import { Innertube } from "youtubei.js";

const innertube = Innertube.create();

export async function deciphered(id: string, server: string) {
  const abort = new AbortController();
  const timeout = setTimeout(() => abort.abort(), 5000);

  const url = await fetch(server, {
    body: JSON.stringify({ id }),
    method: "POST",
    signal: abort.signal,
  })
    .then((res) => res.json())
    .then((data: { url: string }) => data.url)
    .catch((err) => (alert(err), ""))
    .finally(() => clearTimeout(timeout));

  return url;
}

export async function getVideoInfo(id: string) {
  const yt = await innertube;
  const videoInfo = await yt.getBasicInfo(id);
  return videoInfo;
}

export async function getPlaylistInfo(id: string) {
  const yt = await innertube;
  const playlistInfo = await yt.getPlaylist(id);
  return playlistInfo;
}

export async function getPlaylistVideos(id: string) {
  const yt = await innertube;
  const playlist = await yt.getPlaylist(id);
  const videos = playlist.videos.map(
    (video) => (video as { content_id: string }).content_id,
  );
  return videos;
}
