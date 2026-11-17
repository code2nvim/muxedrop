import { VideoCard } from "@/components/Video.tsx";
import { useStyle } from "@/utils/hooks.ts";
import { getPlaylistInfo } from "@/utils/innertube.ts";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SymbolView } from "expo-symbols";
import { atom, useAtomValue } from "jotai";
import { atomWithStorage, createJSONStorage, unwrap } from "jotai/utils";
import { useState } from "react";
import { FlatList, Pressable, Text, useColorScheme, View } from "react-native";

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
  const style = useStyle();
  const colorScheme = useColorScheme();

  const [expand, setExpand] = useState(false);

  const info = useAtomValue(playlistInfoAtom);
  const videos = info?.videos.map(
    (video) => (video as { content_id: string }).content_id,
  );

  return (
    <View className="w-full flex-1 gap-2 p-2">
      <Pressable
        style={{
          ...style,
          backgroundColor: colorScheme === "dark" ? "black" : "white",
          overflow: expand ? "visible" : "hidden",
        }}
        className="flex-row items-center justify-start gap-1 rounded-md border-2 p-2"
        onPress={() => setExpand(!expand)}
      >
        <SymbolView
          name={{ android: "chevron_right" }}
          style={{ transform: [{ rotate: expand ? "90deg" : "0deg" }] }}
        />
        <Text
          className="flex-1 text-black dark:text-white"
          numberOfLines={expand ? 0 : 1}
        >
          {info?.info.title ?? "Loading playlist..."}
        </Text>
      </Pressable>
      <View className={expand ? "flex-1" : "hidden"}>
        <FlatList
          data={videos}
          contentContainerClassName="gap-2"
          keyExtractor={(id) => id}
          maxToRenderPerBatch={15}
          renderItem={({ item: id }) => <VideoCard id={id} />}
        />
      </View>
    </View>
  );
}
