import { VideoCard } from "@/components/Video.tsx";
import { useAsync } from "@/utils/hooks.ts";
import { getPlaylistInfo, getPlaylistVideos } from "@/utils/innertube.ts";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAtomValue } from "jotai/react";
import { atomWithStorage, createJSONStorage } from "jotai/utils";
import { useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";

const storage = createJSONStorage<string>(() => AsyncStorage);
const playlistAtom = atomWithStorage("PLAYLIST_ID", "", storage);

export function Playlist() {
  const [expand, setExpand] = useState(false);
  const playlist = useAtomValue(playlistAtom);

  const info = useAsync(() => getPlaylistInfo(playlist), [playlist]);
  const videos = useAsync(() => getPlaylistVideos(playlist), [playlist]);

  return (
    <View className="flex-1">
      <Pressable
        className="items-center p-2"
        onPress={() => setExpand(!expand)}
      >
        <Text className="text-black dark:text-white">
          {Error.isError(info)
            ? info.toString()
            : info
            ? info.info.title
            : "Loading playlist..."}
        </Text>
      </Pressable>
      <View className={expand ? "flex-1" : "hidden"}>
        {Error.isError(videos)
          ? (
            <Text className="text-black dark:text-white">
              {videos.toString()}
            </Text>
          )
          : (
            <FlatList
              data={videos}
              contentContainerClassName="gap-2 py-2"
              keyExtractor={(id) => id}
              renderItem={({ item: id }) => <VideoCard id={id} />}
              maxToRenderPerBatch={15}
            />
          )}
      </View>
    </View>
  );
}
