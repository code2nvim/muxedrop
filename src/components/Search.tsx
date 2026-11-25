import { VideoCard } from "@/components/Video.tsx";
import { searchAtom, useResults } from "@/utils/innertube.ts";
import { useStyle } from "@/utils/style.ts";
import { SymbolView } from "expo-symbols";
import { useSetAtom } from "jotai";
import { useState } from "react";
import { FlatList, Pressable, TextInput, View } from "react-native";

export function SearchBar() {
  const style = useStyle();

  const [input, setInput] = useState("");

  const search = useSetAtom(searchAtom);

  const submit = () => search(input);

  return (
    <View className="px-2">
      <View
        style={{ ...style }}
        className="flex-row items-center justify-between rounded-md border px-2"
      >
        <TextInput
          className="flex-1 text-black dark:text-white"
          value={input}
          onChangeText={setInput}
          placeholder="Search"
          onSubmitEditing={submit}
          returnKeyType="search"
        />
        <Pressable onPress={submit}>
          <SymbolView name={{ android: "search" }} />
        </Pressable>
      </View>
    </View>
  );
}

export function SearchResults() {
  const results = useResults();

  return (
    <View className="flex-1">
      <View className="flex-1">
        <FlatList
          data={results}
          contentContainerClassName="gap-2 p-2"
          maxToRenderPerBatch={15}
          renderItem={({ item: { uid } }) => (
            <VideoCard key={uid} uid={uid} from="search" />
          )}
        />
      </View>
    </View>
  );
}
