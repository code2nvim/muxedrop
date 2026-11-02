import { useAsync, useStyle } from "@/utils/hooks.ts";
import { deciphered, getVideoInfo } from "@/utils/innertube.ts";
import { useVideoPlayer, VideoView } from "expo-video";
import { atom, useAtomValue, useSetAtom } from "jotai";
import { Pressable, Text, View } from "react-native";
import { withUniwind } from "uniwind";

const StyledVideoView = withUniwind(VideoView);

const targetAtom = atom("");

export function VideoPlayer() {
  const target = useAtomValue(targetAtom);
  const player = useVideoPlayer(target, (player) => {
    player.staysActiveInBackground = true;
    player.volume = 0.5;
    player.play();
  });

  return (
    target && (
      <View className="aspect-video">
        <StyledVideoView
          className="size-full"
          fullscreenOptions={{ enable: true }}
          player={player}
        />
      </View>
    )
  );
}

export function VideoCard({ id }: { id: string }) {
  const style = useStyle();
  const info = useAsync(() => getVideoInfo(id), [id]);
  const setTarget = useSetAtom(targetAtom);

  return (
    <View className="px-2">
      {Error.isError(info)
        ? <Text className="text-black dark:text-white">{info.toString()}</Text>
        : (
          <Pressable
            style={{ ...style }}
            className="text-md rounded-md border p-2"
            onPress={async () => {
              setTarget(await deciphered(id));
            }}
          >
            <Text className="text-black dark:text-white">
              {info?.basic_info.title}
            </Text>
          </Pressable>
        )}
    </View>
  );
}
