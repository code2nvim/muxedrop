import { Playlist } from "@/components/Playlist.tsx";
import { SafeAreaView } from "react-native-safe-area-context";
import { withUniwind } from "uniwind";

const StyledSafeAreaView = withUniwind(SafeAreaView);

export default function Library() {
  return (
    <StyledSafeAreaView
      edges={["top", "right", "left"]}
      className="flex-1 gap-2"
    >
      <Playlist />
    </StyledSafeAreaView>
  );
}
