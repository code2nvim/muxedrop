import { Color } from "expo-router";
import { DependencyList, useEffect, useState } from "react";
import { ColorSchemeName, ColorValue, StyleProp } from "react-native";

export function useAsync<T>(callback: () => Promise<T>, deps: DependencyList) {
  const [data, setData] = useState<T | Error>();

  useEffect(() => {
    callback().then(setData).catch(setData);
  }, deps);

  return data;
}

export function useStyled(theme: ColorSchemeName): StyleProp<{
  backgroundColor: ColorValue;
}> {
  return theme === "dark"
    ? { backgroundColor: Color.android.system_surface_container_dark }
    : { backgroundColor: Color.android.system_surface_container_light };
}
