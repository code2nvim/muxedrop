import { useVideoInfo, useVideoTarget } from "@/utils/innertube.ts";
import { playAtom, playNextAtom, usePlaying, useQueue } from "@/utils/queue.ts";
import { useStyle } from "@/utils/style.ts";
import { useEventListener } from "expo";
import { SymbolView } from "expo-symbols";
import { useVideoPlayer, VideoView } from "expo-video";
import { useSetAtom } from "jotai";
import { useState } from "react";
import { Image, Pressable, Text, View } from "react-native";
import { withUniwind } from "uniwind";

const StyledVideoView = withUniwind(VideoView);

export function VideoPlayer() {
  const { uid, vid } = usePlaying();
  const { target } = useVideoTarget(vid);
  const playNext = useSetAtom(playNextAtom);

  const player = useVideoPlayer(target, (player) => {
    player.staysActiveInBackground = true;
    player.volume = 0.5;
    player.play();
  });

  // useEffect(() => {
  //   if (target) {
  //     player.currentTime = 0;
  //     player.play();
  //   }
  // }, [target, player, uid]);

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

export function VideoCard({ uid, playing }: { uid: string; playing: boolean }) {
  const style = useStyle();

  const { queue } = useQueue();
  const { vid } = queue.find(({ uid: found }) => uid === found)!;
  const info = useVideoInfo(vid);

  const [expand, setExpand] = useState(false);

  return (
    <Pressable
      style={{ ...style }}
      className={`text-md gap-2 rounded-md border p-2 ${
        playing && "opacity-70"
      }`}
      onPress={() => setExpand(!expand)}
    >
      <View className="w-full flex-row gap-2">
        <Image
          source={{ uri: info?.basic_info.thumbnail?.[0].url }}
          style={{ width: 54, height: 54 }}
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
      {expand && <VideoActions uid={uid} />}
    </Pressable>
  );
}

function VideoActions({ uid }: { uid: string }) {
  const style = useStyle();

  const play = useSetAtom(playAtom);

  return (
    <View className="w-full flex-row gap-2">
      <Text className="hidden">{(console.log(uid), uid)}</Text>
      <Pressable
        style={{ ...style }}
        className="flex-1 flex-row items-center justify-center gap-1 rounded-md border p-0.5"
        onPress={() => play(uid)}
      >
        <SymbolView name={{ android: "play_arrow" }} />
        <Text className="text-black dark:text-white">Play</Text>
      </Pressable>
      <Pressable
        style={{ ...style }}
        className="flex-1 flex-row items-center justify-center gap-1 rounded-md border p-0.5"
        onPress={() => {}}
      >
        <SymbolView name={{ android: "question_mark" }} />
        <Text className="text-black dark:text-white">(TODO)</Text>
      </Pressable>
      <Pressable
        style={{ ...style }}
        className="flex-1 flex-row items-center justify-center gap-1 rounded-md border p-0.5"
      >
        <SymbolView name={{ android: "question_mark" }} />
        <Text className="text-black dark:text-white">(TODO)</Text>
      </Pressable>
    </View>
  );
}
