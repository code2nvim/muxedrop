import { VideoCard } from "@/components/Video.tsx";
import { getPlaylistInfo } from "@/utils/innertube.ts";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { atom, useAtomValue } from "jotai";
import { atomWithStorage, createJSONStorage, unwrap } from "jotai/utils";
import { useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";

const storage = createJSONStorage<string>(() => AsyncStorage);
const playlistAtom = atomWithStorage("PLAYLIST_ID", "", storage);
const playlistInfoAtom = unwrap(
  atom(async (get) => {
    const playlist = await get(playlistAtom);
    if (!playlist) return;
    return await getPlaylistInfo(playlist);
  }),
);

export function Playlist() {
  const [expand, setExpand] = useState(false);

  const info = useAtomValue(playlistInfoAtom);
  const videos = info?.videos.map(
    (video) => (video as { content_id: string }).content_id,
  );

  return (
    <View className="flex-1">
      <Pressable
        className="items-center p-2"
        onPress={() => setExpand(!expand)}
      >
        <Text className="text-black dark:text-white">
          {info?.info.title ?? "Loading playlist..."}
        </Text>
      </Pressable>
      <View className={expand ? "flex-1" : "hidden"}>
        <FlatList
          data={videos}
          contentContainerClassName="gap-2 p-2"
          keyExtractor={(id) => id}
          maxToRenderPerBatch={15}
          renderItem={({ item: id }) => <VideoCard id={id} />}
        />
      </View>
    </View>
  );
}
