import { Playlist } from "@/components/Playlist.tsx";
import { SafeAreaView } from "react-native-safe-area-context";
import { withUniwind } from "uniwind";

const StyledSafeAreaView = withUniwind(SafeAreaView);

export default function Library() {
  return (
    <StyledSafeAreaView className="flex-1 items-center justify-center">
      <Playlist />
    </StyledSafeAreaView>
  );
}
