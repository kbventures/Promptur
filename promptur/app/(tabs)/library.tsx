import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
  Dimensions,
} from "react-native";
import * as MediaLibrary from "expo-media-library";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Asset } from "expo-media-library";

// Define the name of the album you want to check
const ALBUM_NAME = "PrompturMedia";

// Get screen width for calculating item size
const { width } = Dimensions.get("window");
const ITEM_SIZE = width / 3 - 2; // 3 items per row, with a tiny margin

export default function Library() {
  const [mediaLibraryPermission, requestMediaLibraryPermission] =
    MediaLibrary.usePermissions();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- Functions ---

  // Fetches the specific album and its assets
  const loadAssets = async () => {
    if (!mediaLibraryPermission?.granted) return;

    try {
      // 1. Find the album by name
      const album = await MediaLibrary.getAlbumAsync(ALBUM_NAME);

      if (album) {
        // 2. Get all assets (videos) from that album
        const media = await MediaLibrary.getAssetsAsync({
          album: album,
          mediaType: [MediaLibrary.MediaType.video],
          sortBy: [
            [MediaLibrary.SortBy.creationTime, false], // Sort by newest first
          ],
        });

        // 3. Update state with fetched assets
        setAssets(media.assets);
      } else {
        // If the album doesn't exist yet (no videos saved)
        setAssets([]);
      }
    } catch (error) {
      console.error("Failed to load media library assets:", error);
      Alert.alert("Error", "Could not load videos from your gallery.");
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle permission request
  const requestPermission = () => {
    requestMediaLibraryPermission();
  };

  // --- Effects ---

  // Automatically request permission if needed
  useEffect(() => {
    if (!mediaLibraryPermission) return;
    if (!mediaLibraryPermission.granted) {
      requestPermission();
    }
  }, [mediaLibraryPermission]);
  console.log(assets);
  // Load assets when permission is granted or component mounts
  useEffect(() => {
    if (mediaLibraryPermission?.granted) {
      loadAssets();
    } else if (mediaLibraryPermission?.canAskAgain === false) {
      setIsLoading(false); // Stop loading if permission is permanently denied
    }
  }, [mediaLibraryPermission?.granted]);

  // --- Render Helpers ---

  // Renders a single video thumbnail
  const renderItem = ({ item }: { item: Asset }) => (
    <TouchableOpacity style={styles.itemContainer} activeOpacity={0.8}>
      <Image
        source={{ uri: item.uri }}
        style={styles.thumbnail}
        resizeMode="cover"
      />

      {/* Overlay for Play Icon */}
      <Ionicons
        name="play-circle"
        size={36}
        color="rgba(255, 255, 255, 0.9)"
        style={styles.playIcon}
      />

      {/* Video Duration */}
      <View style={styles.durationContainer}>
        <Text style={styles.durationText}>{formatDuration(item.duration)}</Text>
      </View>

      {/* Creation Date */}
      <View style={styles.dateContainer}>
        <Text style={styles.dateText}>
          {formatDate(String(item.creationTime))}
        </Text>
      </View>
    </TouchableOpacity>
  );

  // Renders when permission is not granted
  if (mediaLibraryPermission === null || isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!mediaLibraryPermission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>
          Permission to access the media library is required to view your
          videos.
        </Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Grant Access</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Renders when there are no videos in the album
  if (assets.length === 0 && !isLoading) {
    return (
      <SafeAreaView style={styles.emptyContainer}>
        <Ionicons name="videocam-off" size={60} color="#ccc" />
        <Text style={styles.emptyText}>
          You haven&apos;t recorded any videos yet!
        </Text>
      </SafeAreaView>
    );
  }

  // --- Main Render ---
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Your Promptur Videos</Text>
      <FlatList
        data={assets}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={3} // 3 items per row
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
}

// --- Styles ---

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
    color: "#3b1f77",
  },
  list: {
    paddingHorizontal: 1,
  },
  itemContainer: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    margin: 1,
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
  },
  thumbnail: {
    width: "100%",
    height: "100%",
  },
  playIcon: {
    position: "absolute",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "white",
  },
  permissionText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#3b1f77",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: "#888",
    marginTop: 10,
    textAlign: "center",
  },
  durationContainer: {
    position: "absolute",
    bottom: 4,
    right: 4,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  durationText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
  dateContainer: {
    position: "absolute",
    top: 4,
    left: 4,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  dateText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
});
const formatDuration = (seconds: number) => {
  if (!seconds) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.round(seconds % 60);
  const paddedSeconds =
    remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;
  return `${minutes}:${paddedSeconds}`;
};

// Helper function to format creation time (milliseconds) to a short date
const formatDate = (timestamp: string) => {
  const date = new Date(timestamp);
  // Example: 12/02/25
  return date.toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "2-digit",
  });
};
