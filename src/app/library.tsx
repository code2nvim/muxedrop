import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { withUniwind } from "uniwind";

const StyledSafeAreaView = withUniwind(SafeAreaView);

export default function Library() {
  return (
    <StyledSafeAreaView className="flex-1 items-center justify-center">
      <Text className="text-black dark:text-white">Library</Text>
    </StyledSafeAreaView>
  );
}
