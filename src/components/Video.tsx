import {
  useGenPlaylist,
  useResults,
  useVideoInfo,
  useVideoTarget,
} from "@/utils/innertube.ts";
import {
  playAtom,
  playNextAtom,
  playQueueAtom,
  removeVideoAtom,
  usePlaying,
  useQueue,
} from "@/utils/queue.ts";
import { useStyle } from "@/utils/style.ts";
import { useEventListener } from "expo";
import { SymbolView } from "expo-symbols";
import { useVideoPlayer, VideoView } from "expo-video";
import { atom, useAtomValue, useSetAtom } from "jotai";
import { selectAtom } from "jotai/utils";
import { useEffect } from "react";
import { Image, Pressable, Text, View } from "react-native";
import { withUniwind } from "uniwind";

const StyledVideoView = withUniwind(VideoView);

export function VideoPlayer() {
  const { uid, vid } = usePlaying();
  const { target } = useVideoTarget(vid);
  const playNext = useSetAtom(playNextAtom);

  const player = useVideoPlayer(target ?? "", (player) => {
    player.staysActiveInBackground = true;
    player.volume = 0.5;
    player.play();
  });

  useEffect(() => {
    if (target) {
      player.currentTime = 0;
      player.play();
    }
  }, [target, player, uid]);

  useEventListener(player, "playToEnd", () => {
    playNext();
  });

  return (
    <View className={vid ? "aspect-video" : "hidden"}>
      <StyledVideoView
        className="size-full"
        fullscreenOptions={{ enable: true }}
        player={player}
      />
    </View>
  );
}

function useVideoFrom(uid: string, from?: string) {
  const results = useResults();
  const playlist = useGenPlaylist(from ?? "");
  const { queue, playing } = useQueue();

  if (from === "search") {
    const vid = results?.find((video) => video.uid === uid)?.vid;
    return { vid, playing: "" };
  } else if (from) {
    const vid = playlist?.find((video) => video.uid === uid)?.vid;
    return { vid, playing: "" };
  } else {
    const vid = queue.find((video) => video.uid === uid)?.vid;
    return { vid, playing };
  }
}

const expandedAtom = atom<string>();

export function VideoCard({ uid, from }: { uid: string; from?: string }) {
  const style = useStyle();

  const { vid, playing } = useVideoFrom(uid, from);
  const info = useVideoInfo(vid ?? "");

  const expand = useAtomValue(
    selectAtom(expandedAtom, (expanded) => expanded === uid),
  );
  const setExpanded = useSetAtom(expandedAtom);

  return (
    <Pressable
      style={{ ...style }}
      className={`text-md gap-2 rounded-md border p-2 ${
        uid === playing && "opacity-70"
      }`}
      onPress={() => setExpanded(expand ? undefined : uid)}
    >
      <View className="w-full flex-row gap-2">
        <Image
          source={{ uri: info?.basic_info.thumbnail?.[0].url }}
          style={{ width: 96 }}
          className="aspect-video"
          resizeMode="cover"
        />
        <View className="flex-1 justify-between">
          <Text
            className="text-black dark:text-white"
            numberOfLines={expand ? undefined : 1}
          >
            {info?.basic_info.title ?? (
              <Text className="text-xs">Loading...</Text>
            )}
          </Text>
          <View className="flex-row items-center justify-between gap-2">
            <Text
              className="flex-1 text-black dark:text-white"
              numberOfLines={1}
            >
              {info?.basic_info.author}
            </Text>
            <Text className="text-black dark:text-white">
              {info?.basic_info.upload_date?.substring(0, 10)}
            </Text>
          </View>
        </View>
      </View>
      {expand && <VideoActions uid={uid} from={from} />}
    </Pressable>
  );
}

function VideoActions({ uid, from }: { uid: string; from?: string }) {
  const style = useStyle();

  const play = useSetAtom(playAtom);
  const remove = useSetAtom(removeVideoAtom);

  const playlist = useGenPlaylist(from ?? "") ?? [];
  const playQueue = useSetAtom(playQueueAtom);

  const results = useResults();

  return (
    <View className="w-full flex-row gap-2 pt-1">
      <Text className="hidden">{uid}</Text>
      <Pressable
        style={{ ...style }}
        className="flex-1 flex-row items-center justify-center gap-1 rounded-md border p-1"
        onPress={from
          ? () =>
            playQueue(
              from === "search"
                ? [
                  {
                    uid,
                    vid: results.find((video) => video.uid === uid)?.vid!,
                  },
                ]
                : playlist,
              uid,
            )
          : () => play(uid)}
      >
        <SymbolView name={{ android: "play_circle" }} />
        <Text className="text-black dark:text-white">Play</Text>
      </Pressable>
      <Pressable
        style={{ ...style }}
        className="flex-1 flex-row items-center justify-center gap-1 rounded-md border p-1"
        onPress={() => from || remove(uid)}
      >
        <SymbolView name={{ android: "delete" }} />
        <Text className="text-black dark:text-white">Remove</Text>
      </Pressable>
      <Pressable
        style={{ ...style }}
        className="flex-1 flex-row items-center justify-center gap-1 rounded-md border p-1"
      >
        <SymbolView name={{ android: "menu" }} />
        <Text className="text-black dark:text-white">More</Text>
      </Pressable>
    </View>
  );
}
