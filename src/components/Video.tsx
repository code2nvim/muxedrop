import { useStyle } from "@/utils/hooks.ts";
import { deciphered, getVideoInfo } from "@/utils/innertube.ts";
import { useVideoPlayer, VideoView } from "expo-video";
import { atom, useAtomValue, useSetAtom } from "jotai";
import { atomFamily } from "jotai-family";
import { unwrap } from "jotai/utils";
import { Pressable, Text, View } from "react-native";
import { withUniwind } from "uniwind";

const StyledVideoView = withUniwind(VideoView);

const videoTargetAtom = atom("");
const videoInfoFamily = atomFamily((id: string) =>
  unwrap(atom(() => getVideoInfo(id)))
);

export function resetVideoInfoFamily() {
  videoInfoFamily.setShouldRemove(() => true);
  videoInfoFamily.setShouldRemove(null);
}

export function VideoPlayer() {
  const target = useAtomValue(videoTargetAtom);
  const player = useVideoPlayer(target, (player) => {
    player.staysActiveInBackground = true;
    player.volume = 0.5;
    player.play();
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

export function VideoCard({ id }: { id: string }) {
  const style = useStyle();

  const info = useAtomValue(videoInfoFamily(id));
  const setTarget = useSetAtom(videoTargetAtom);

  return (
    <Pressable
      style={{ ...style }}
      className="text-md rounded-md border p-2"
      onPress={async () => {
        setTarget(await deciphered(id));
      }}
    >
      <Text className="text-black dark:text-white">
        {info?.basic_info.title ?? <Text className="text-xs">Loading...</Text>}
      </Text>
    </Pressable>
  );
}
