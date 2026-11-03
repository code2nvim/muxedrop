import { useStyle } from "@/utils/hooks.ts";
import { useServerURL, useSource } from "@/utils/innertube.ts";
import { SymbolView } from "expo-symbols";
import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

export function Options() {
  const style = useStyle();

  const [show, setShow] = useState(false);

  return (
    <View className="w-full px-2">
      <Pressable
        style={{ ...style }}
        className="flex w-full items-center rounded-md border p-1"
        onPress={() => setShow(!show)}
      >
        <View className={show ? "w-full flex-row justify-between" : "hidden"}>
          <ServerSource />
        </View>
        <View
          style={{ ...style }}
          className={show ? "hidden" : "h-1 w-12 rounded-md border"}
        />
      </Pressable>
    </View>
  );
}

function ServerSource() {
  const [show, setShow] = useState(false);

  const { source, setSource } = useSource();
  const { server, setServer } = useServerURL();
  const toggleSource = () => setSource(source === "LOCAL" ? "SERVER" : "LOCAL");

  return (
    <>
      <Pressable onPress={toggleSource}>
        <Text className="p-1 text-black dark:text-white">{source}</Text>
      </Pressable>
      <View
        className={`${source === "LOCAL" && "hidden"} flex-row items-center`}
      >
        {show
          ? (
            <TextInput
              value={server}
              className="p-0 text-black dark:text-white"
              onChangeText={(url) => setServer(url)}
            />
          )
          : <TextInput className="p-0" />}
        <Pressable onPress={() => setShow((show) => !show)}>
          <SymbolView
            name={{ android: "chevron_right" }}
            size={24}
            style={{ transform: [{ rotate: show ? "0deg" : "180deg" }] }}
          />
        </Pressable>
      </View>
    </>
  );
}
