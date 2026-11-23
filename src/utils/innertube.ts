import AsyncStorage from "@react-native-async-storage/async-storage";
import { atom, useAtom, useAtomValue } from "jotai";
import { atomWithStorage, createJSONStorage } from "jotai/utils";
import useSWR from "swr";
import { Innertube } from "youtubei.js";

const innertube = Innertube.create();

const sourceAtom = atom("LOCAL" as "LOCAL" | "SERVER");
const serverAtom = atomWithStorage(
  "SERVER_URL",
  "",
  createJSONStorage(() => AsyncStorage),
);

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

export function useVideoTarget(id: string) {
  const source = useAtomValue(sourceAtom);
  const server = useAtomValue(serverAtom);

  const key = `/video/target/${id}`;
  const { data } = useSWR(key, async () => {
    if (source === "SERVER") {
      return delegate(id, server);
    } else {
      const yt = await innertube;
      const info = await yt.getBasicInfo(id, { client: "ANDROID" });
      return info
        .chooseFormat({ type: "video+audio" })
        .decipher(yt.session.player);
    }
  });

  const target = data ?? "";

  return { target, time: Date.now() };
}

export function useVideoInfo(id: string) {
  const { data: info } = useSWR(`/video/info/${id}`, async () => {
    const yt = await innertube;
    return await yt.getBasicInfo(id);
  });
  return info;
}

export function usePlaylist(id: string) {
  const { data: playlist } = useSWR(`/playlist/${id}`, async () => {
    const yt = await innertube;
    return await yt.getPlaylist(id);
  });
  return playlist;
}

export function usePlaylistVideos(id: string) {
  const { data: playlist } = useSWR(`/playlist/videos${id}`, async () => {
    const yt = await innertube;
    return await yt.getPlaylist(id);
  });
  return playlist?.videos.map(
    (video) => (video as { content_id: string }).content_id,
  );
}
