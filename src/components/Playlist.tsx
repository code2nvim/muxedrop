// import { VideoCard } from "@/components/Video.tsx";
import { usePlaylist, usePlaylistVideos } from "@/utils/innertube.ts";
import { useStyle } from "@/utils/style.ts";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SymbolView } from "expo-symbols";
import { useAtomValue } from "jotai";
import { atomWithStorage, createJSONStorage, unwrap } from "jotai/utils";
import { useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";

const storage = createJSONStorage<string>(() => AsyncStorage);
const storagePlaylistAtom = atomWithStorage("PLAYLIST_ID", "", storage);
const playlistAtom = unwrap(storagePlaylistAtom, (prev) => prev ?? "");

export function Playlist() {
  const style = useStyle();

  const [expand, setExpand] = useState(false);

  const playlist = useAtomValue(playlistAtom);
  const playlistData = usePlaylist(playlist);
  const videos = usePlaylistVideos(playlist);

  return (
    <View className="w-full flex-1">
      <Pressable
        style={{
          ...style,
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
          {playlistData?.info.title ?? "Loading playlist..."}
        </Text>
      </Pressable>
      {expand && (
        <View className="flex-1">
          <FlatList
            data={videos}
            contentContainerClassName="gap-2 p-2"
            maxToRenderPerBatch={15}
            renderItem={({ index }) => (
              // <VideoCard index={index} playing={false} />
              <Text className="text-black dark:text-white">{index}</Text>
            )}
          />
        </View>
      )}
    </View>
  );
}
