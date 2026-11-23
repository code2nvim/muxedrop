import { VideoCard } from "@/components/Video.tsx";
import { useQueue } from "@/utils/queue.ts";
import { FlatList, View } from "react-native";

export function Queue() {
  const { queue, playing } = useQueue();

  return (
    <View className="flex-1 bg-transparent">
      <FlatList
        data={queue}
        contentContainerClassName="gap-2 pb-2 px-2"
        keyExtractor={({ uid }) => uid}
        maxToRenderPerBatch={15}
        renderItem={({ item: { uid } }) => (
          <VideoCard key={uid} uid={uid} playing={playing === uid} />
        )}
      />
    </View>
  );
}
