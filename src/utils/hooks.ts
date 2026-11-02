import { Color } from "expo-router";
import { DependencyList, useEffect, useState } from "react";
import { ColorValue, StyleProp, useColorScheme } from "react-native";

export function useAsync<T>(callback: () => Promise<T>, deps: DependencyList) {
  const [data, setData] = useState<T | Error>();

  useEffect(() => {
    callback().then(setData).catch(setData);
  }, deps);

  return data;
}

export function useStyle(): StyleProp<{
  backgroundColor: ColorValue;
  borderColor: ColorValue;
}> {
  const colorScheme = useColorScheme();

  return colorScheme === "dark"
    ? {
      backgroundColor: Color.android.system_surface_container_dark,
      borderColor: Color.android.system_surface_bright_dark,
    }
    : {
      backgroundColor: Color.android.system_surface_container_light,
      borderColor: Color.android.system_surface_dim_light,
    };
}
