import { useAsync, useStyled } from "@/utils/hooks.ts";
import { deciphered, getVideoInfo } from "@/utils/innertube.ts";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useVideoPlayer, VideoView } from "expo-video";
import { atom, useAtomValue, useSetAtom } from "jotai";
import { atomWithStorage, createJSONStorage } from "jotai/utils";
import { Pressable, Text, useColorScheme, View } from "react-native";
import { withUniwind } from "uniwind";

const StyledVideoView = withUniwind(VideoView);

const storage = createJSONStorage<string>(() => AsyncStorage);
const serverAtom = atomWithStorage("SERVER_URL", "", storage);

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
  const setTarget = useSetAtom(targetAtom);
  const info = useAsync(() => getVideoInfo(id), [id]);

  const server = useAtomValue(serverAtom);

  const colorScheme = useColorScheme();
  const styled = useStyled(colorScheme);

  return (
    <View className="px-2">
      {Error.isError(info)
        ? <Text className="text-black dark:text-white">{info.toString()}</Text>
        : (
          <Pressable
            style={{ ...styled }}
            className="text-md rounded-md p-2"
            onPress={async () => {
              setTarget(await deciphered(id, server));
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
