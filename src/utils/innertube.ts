import AsyncStorage from "@react-native-async-storage/async-storage";
import { atom, useAtom, useAtomValue } from "jotai";
import { atomWithStorage, createJSONStorage } from "jotai/utils";
import useSWR from "swr";
import useSWRImmutable from "swr/immutable";
import { Innertube, YTNodes } from "youtubei.js";

const innertube = Innertube.create();

const sourceAtom = atom("LOCAL" as "LOCAL" | "SERVER");
const serverAtom = atomWithStorage(
  "SERVER_URL",
  ":8000",
  createJSONStorage(() => AsyncStorage),
);

const resultsAtom = atom([] as { uid: string; vid: string }[]);

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
  const { data: target } = useSWR(key, async () => {
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

  return { target, time: Date.now() };
}

export function useVideoInfo(id: string) {
  const key = id ? `/video/info/${id}` : null;
  const { data: info } = useSWRImmutable(key, async () => {
    const yt = await innertube;
    return await yt.getBasicInfo(id);
  });
  return info;
}

export function usePlaylist(id: string) {
  const { data: playlist } = useSWRImmutable(
    id ? `/playlist/${id}` : null,
    async () => {
      const yt = await innertube;
      return await yt.getPlaylist(id);
    },
  );
  return playlist;
}

export function useGenPlaylist(id: string) {
  const videos = usePlaylistVideos(id);
  const { data: playlist } = useSWRImmutable(
    id && videos ? `/playlist/gen/${id}` : null,
    () => {
      const playlist = (videos ?? []).map((vid, idx) => ({
        uid: `${id}-${idx}`,
        vid,
      }));
      return playlist;
    },
  );
  return playlist;
}

export function usePlaylistVideos(id: string) {
  const playlist = usePlaylist(id);
  const { data: videos } = useSWRImmutable(
    id && playlist ? `/playlist/videos/${id}` : null,
    () => {
      const videos = playlist?.videos
        .filter((video) => video.is(YTNodes.LockupView))
        .map((video) => video.content_id ?? "");
      return videos;
    },
  );
  return videos;
}

export const searchAtom = atom(null, async (_, set, query: string) => {
  const yt = await innertube;
  const search = await yt.search(query);
  const results = search.videos
    .filter((video) => video.is(YTNodes.Video))
    .map(({ video_id }) => video_id)
    .map((vid, idx) => ({
      uid: `${vid}-${idx}`,
      vid,
    }));
  set(resultsAtom, results);
});

export function useResults() {
  const results = useAtomValue(resultsAtom);
  return results;
}
