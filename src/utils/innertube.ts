import AsyncStorage from "@react-native-async-storage/async-storage";
import { atom, getDefaultStore, useAtom } from "jotai";
import { atomWithStorage, createJSONStorage } from "jotai/utils";
import { Innertube } from "youtubei.js";

const innertube = Innertube.create();

const store = getDefaultStore();
const storage = createJSONStorage<string>(() => AsyncStorage);

const sourceAtom = atom("LOCAL" as "LOCAL" | "SERVER");
const serverAtom = atomWithStorage("SERVER_URL", "", storage);

export function useServerURL() {
  const [server, setServer] = useAtom(serverAtom);
  return { server, setServer };
}

export function useSource() {
  const [source, setSource] = useAtom(sourceAtom);
  return { source, setSource };
}

async function delegate(id: string, url: string) {
  const abort = new AbortController();
  const timeout = setTimeout(() => abort.abort(), 5000);

  const target = await fetch(url, {
    body: JSON.stringify({ id }),
    method: "POST",
    signal: abort.signal,
  })
    .then((res) => res.json())
    .then((data: { url: string }) => data.url)
    .catch((err) => (alert(err), ""))
    .finally(() => clearTimeout(timeout));

  return target;
}

export async function deciphered(id: string) {
  const source = store.get(sourceAtom);
  if (source === "SERVER") {
    const server = await store.get(serverAtom);
    return delegate(id, server);
  }

  const yt = await innertube;
  const info = await yt.getBasicInfo(id, {
    client: "ANDROID",
  });

  const target = await info
    .chooseFormat({ type: "video+audio" })
    .decipher(yt.session.player);

  return target;
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
