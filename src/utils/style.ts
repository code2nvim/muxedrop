import { Color } from "expo-router";
import { ColorValue, StyleProp, useColorScheme } from "react-native";

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
