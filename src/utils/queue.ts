import AsyncStorage from "@react-native-async-storage/async-storage";
import { randomUUID } from "expo-crypto";
import { atom, useAtomValue } from "jotai";
import {
  atomWithDefault,
  atomWithStorage,
  createJSONStorage,
  unwrap,
} from "jotai/utils";

const storage = createJSONStorage<string[]>(() => AsyncStorage);
const storageQueueAtom = atomWithStorage("QUEUED_VIDEOS", [], storage);
const savedQueueAtom = unwrap(storageQueueAtom);
const baseQueueAtom = atomWithDefault((get) => {
  const saved = get(savedQueueAtom);
  return (saved ?? []).map((vid) => ({
    uid: randomUUID(),
    vid,
  }));
});

const queueAtom = atom(
  (get) => get(baseQueueAtom),
  (_, set, queue: { uid: string; vid: string }[]) => {
    const saved = queue.map((video) => video.vid);
    set(baseQueueAtom, queue);
    set(storageQueueAtom, saved);
  },
);

const playingAtom = atom("");

export function useQueue() {
  const queue = useAtomValue(queueAtom);
  const playing = useAtomValue(playingAtom);
  return { queue, playing };
}

export function usePlaying() {
  const queue = useAtomValue(queueAtom);
  const playing = useAtomValue(playingAtom);
  const video = queue.find((video) => video.uid === playing);
  return video ?? { uid: "", vid: "" };
}

export const resetPlayingAtom = atom(null, (_, set) => {
  set(playingAtom, "");
});

export const playAtom = atom(null, (_, set, uid: string) => {
  set(playingAtom, uid);
});

export const playNextAtom = atom(null, (get, set) => {
  const queue = get(queueAtom);
  const playing = get(playingAtom);
  const index = queue.findIndex((video) => video.uid === playing);
  if (index !== -1 && index !== queue.length - 1) {
    const next = index + 1;
    set(playingAtom, queue[next].uid);
  }
});
