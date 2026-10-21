import { Playlist } from "@/components/Playlist.tsx";
import { VideoPlayer } from "@/components/Video.tsx";
import { SafeAreaView } from "react-native-safe-area-context";
import { withUniwind } from "uniwind";

const StyledSafeAreaView = withUniwind(SafeAreaView);

export default function Player() {
  return (
    <StyledSafeAreaView className="flex-1 gap-2">
      <VideoPlayer />
      <Playlist />
    </StyledSafeAreaView>
  );
}
