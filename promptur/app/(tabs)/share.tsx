import { View, Text, Button } from "react-native";
import { VideoView } from "expo-video";
import * as Sharing from "expo-sharing";
import { useLocalSearchParams } from "expo-router"; // <-- IMPORTANT

export default function ShareVideoScreen() {
  const { uri } = useLocalSearchParams(); // <-- instead of route.params
  const videoUri = Array.isArray(uri) ? uri[0] : uri; // safety for router arrays

  const shareVideo = async () => {
    const canShare = await Sharing.isAvailableAsync();
    if (!canShare || !videoUri) return;
    await Sharing.shareAsync(videoUri, {
      mimeType: "video/mp4",
      dialogTitle: "Share to Instagram",
    });
  };
  console.log("Video URI in Share Screen:", videoUri);

  return (
    <View style={{ flex: 1, backgroundColor: "#000", padding: 20 }}>
      <Text
        style={{
          color: "white",
          textAlign: "center",
          marginBottom: 16,
          fontSize: 18,
        }}
      >
        Preview your recording
      </Text>

      {/* {videoUri && (
        <VideoView
          style={{ width: "100%", height: 420, borderRadius: 12 }}
          source={{ uri: videoUri }}
          nativeControls
          resizeMode="contain"
        />
      )} */}

      <View style={{ marginTop: 30 }}>
        <Button title="Share to Instagram" onPress={shareVideo} />
      </View>
    </View>
  );
}
