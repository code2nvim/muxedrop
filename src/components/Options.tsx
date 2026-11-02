import { useStyle } from "@/utils/hooks.ts";
import { useServerURL, useSource } from "@/utils/innertube.ts";
import { SymbolView } from "expo-symbols";
import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

export function Options() {
  const style = useStyle();
  const [show, setShow] = useState(false);

  const { source, setSource } = useSource();
  const toggleSource = () => setSource(source === "LOCAL" ? "SERVER" : "LOCAL");

  return (
    <View className="w-full px-2">
      {show
        ? (
          <Pressable
            style={{ ...style }}
            className="z-50 w-full flex-row items-center justify-between rounded-md border p-1"
            onPress={() => setShow(!show)}
          >
            <Pressable onPress={toggleSource}>
              <Text className="p-1 text-black dark:text-white">{source}</Text>
            </Pressable>
            {source === "SERVER" && <ServerSource />}
          </Pressable>
        )
        : (
          <Pressable
            style={{ ...style }}
            className="flex w-full items-center rounded-md border px-2 py-1"
            onPress={() => setShow(!show)}
          >
            <View style={{ ...style }} className="h-1 w-12 rounded-md border" />
          </Pressable>
        )}
    </View>
  );
}

function ServerSource() {
  const [show, setShow] = useState(false);

  const { server, setServer } = useServerURL();

  return (
    <View className="flex-row items-center">
      {show
        ? (
          <TextInput
            value={server}
            className="p-0 text-black dark:text-white"
            onChangeText={(url) => setServer(url)}
          />
        )
        : <TextInput className="p-0" />}
      <Pressable onPress={() => setShow(!show)}>
        <SymbolView
          name={{ android: "chevron_right" }}
          size={24}
          style={{ transform: [{ rotate: show ? "0deg" : "180deg" }] }}
        />
      </Pressable>
    </View>
  );
}
