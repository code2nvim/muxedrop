import { resetVideoInfoFamily } from "@/components/Video.tsx";
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
        className="w-full items-center justify-center rounded-md border"
        onPress={() => setShow(!show)}
      >
        <View className={show ? "w-full justify-center p-2" : "hidden"}>
          <ResetCache />
          <ServerSource />
        </View>
        <View
          style={{ ...style }}
          className={show ? "hidden" : "m-1 h-1 w-12 rounded-md border"}
        />
      </Pressable>
    </View>
  );
}

function ResetCache() {
  const reset = () => {
    resetVideoInfoFamily();
  };

  return (
    <View className="flex-row items-center justify-between">
      <Text className="text-black dark:text-white">RESET</Text>
      <Pressable onPress={reset}>
        <SymbolView name={{ android: "refresh" }} />
      </Pressable>
    </View>
  );
}

function ServerSource() {
  const [show, setShow] = useState(false);
  const toggleShow = () => setShow(!show);

  const { server, setServer } = useServerURL();
  const { source, setSource } = useSource();
  const toggleSource = () => {
    setSource(source === "LOCAL" ? "SERVER" : "LOCAL");
    setShow(false);
  };

  return (
    <View className="flex-row items-center justify-between">
      <Pressable onPress={toggleSource}>
        <Text className="text-black dark:text-white">{source}</Text>
      </Pressable>
      <TextInput
        className="p-0 text-black dark:text-white"
        value={show ? server : ""}
        editable={show}
        onChangeText={(url) => setServer(url)}
      />
      <Pressable onPress={toggleShow}>
        <SymbolView
          name={{ android: "chevron_right" }}
          style={{
            opacity: source === "LOCAL" ? 0 : 1,
            transform: [{ rotate: show ? "0deg" : "180deg" }],
          }}
        />
      </Pressable>
    </View>
  );
}
