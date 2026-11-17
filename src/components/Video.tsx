import { useStyle } from "@/utils/hooks.ts";
import { deciphered, getVideoInfo } from "@/utils/innertube.ts";
import { useEventListener } from "expo";
import { router } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useVideoPlayer, VideoView } from "expo-video";
import {
  atom,
  getDefaultStore,
  useAtom,
  useAtomValue,
  useSetAtom,
} from "jotai";
import { atomFamily } from "jotai-family";
import { unwrap } from "jotai/utils";
import { Image, Pressable, Text, View } from "react-native";
import { withUniwind } from "uniwind";

const StyledVideoView = withUniwind(VideoView);

const videoNextAtom = atom("");
const videoTargetAtom = atom("");
const videoInfoFamily = atomFamily((id: string) =>
  unwrap(atom(() => getVideoInfo(id)))
);

export function resetVideo() {
  getDefaultStore().set(videoTargetAtom, "");
}

export function resetVideoInfoFamily() {
  videoInfoFamily.setShouldRemove(() => true);
  videoInfoFamily.setShouldRemove(null);
}

export function VideoPlayer() {
  const next = useAtomValue(videoNextAtom);
  const target = useAtomValue(videoTargetAtom);
  const player = useVideoPlayer(target, (player) => {
    player.staysActiveInBackground = true;
    player.volume = 0.5;
    player.play();
  });

  useEventListener(player, "playToEnd", () => {
    next && deciphered(next);
  });

  return (
    <View className={target ? "aspect-video" : "hidden"}>
      <StyledVideoView
        className="size-full"
        fullscreenOptions={{ enable: true }}
        player={player}
      />
    </View>
  );
}

const expandedCardAtom = atom<string>();

export function VideoCard({
  id,
  playing = false,
}: {
  id: string;
  playing?: boolean;
}) {
  const style = useStyle();

  const [expanded, setExpanded] = useAtom(expandedCardAtom);
  const expand = expanded === id;

  const info = useAtomValue(videoInfoFamily(id));
  const setTarget = useSetAtom(videoTargetAtom);

  return (
    <Pressable
      style={{ ...style }}
      className="text-md gap-2 p-2"
      onPress={() => setExpanded(expand ? undefined : id)}
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

      <View
        className={expand ? "w-full flex-row items-center gap-1" : "hidden"}
      >
        <Pressable
          style={{ ...style }}
          className="flex-1 flex-row items-center justify-center gap-1 rounded-md border-2 p-0.5"
          onPress={async () => {
            setTarget(await deciphered(id));
            router.navigate("/");
          }}
        >
          <SymbolView name={{ android: "play_arrow" }} />
          <Text className="text-black dark:text-white">Play</Text>
        </Pressable>
        <Pressable
          style={{ ...style }}
          className="flex-1 flex-row items-center justify-center gap-1 rounded-md border-2 p-0.5"
          onPress={() => (playing ? console.log("what") : console.log("none"))}
        >
          <SymbolView name={{ android: "question_mark" }} />
          <Text className="text-black dark:text-white">(TODO)</Text>
        </Pressable>
        <Pressable
          style={{ ...style }}
          className="flex-1 flex-row items-center justify-center gap-1 rounded-md border-2 p-0.5"
        >
          <SymbolView name={{ android: "question_mark" }} />
          <Text className="text-black dark:text-white">(TODO)</Text>
        </Pressable>
      </View>
    </Pressable>
  );
}
