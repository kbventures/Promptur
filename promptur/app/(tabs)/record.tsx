import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StatusBar,
  Alert,
} from "react-native";
import * as MediaLibrary from "expo-media-library";
import { Ionicons, Feather } from "@expo/vector-icons";
import { AudioModule } from "expo-audio";
import { router } from "expo-router";
export default function App() {
  const [facing, setFacing] = useState<CameraType>("front"); // Default to front for selfie mode like image
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [mediaLibraryPermission, requestMediaLibraryPermission] =
    MediaLibrary.usePermissions();
  const [isRecording, setIsRecording] = useState(false);
  const cameraRef = useRef<CameraView>(null);
  const [mediaUri, setMediaUri] = useState<string>();

  // --- Permissions ---
  if (!cameraPermission || !mediaLibraryPermission) {
    return <View />;
  }

  function requestPermission() {
    requestCameraPermission();
    requestMediaLibraryPermission();
  }

  if (!cameraPermission.granted || !mediaLibraryPermission) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>
          We need camera and gallery permissions
        </Text>
        <Button onPress={requestPermission} title="Grant permission" />
      </View>
    );
  }

  // --- Logic ---

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  async function handleRecordPress() {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  }

  function stopRecording() {
    if (cameraRef.current) {
      cameraRef.current.stopRecording();
      setIsRecording(false);
    }
  }

  async function startRecording() {
    if (cameraRef.current) {
      try {
        const audioPermission =
          await AudioModule.requestRecordingPermissionsAsync();
        if (!audioPermission.granted) {
          Alert.alert("Permission Error", "Microphone permission denied");
          return;
        }

        const uriPromise = cameraRef.current.recordAsync({});
        setIsRecording(true);

        if (uriPromise) {
          const data = await uriPromise;
          console.log("Video recorded to URI:", data?.uri);
          setMediaUri(data?.uri);

          // Navigate to share screen with the uri
          router.push({
            pathname: "/(tabs)/share",
            params: { uri: data?.uri },
          });
        }
      } catch (e) {
        console.error(e);
        setIsRecording(false);
      }
    }
  }

  async function saveRecording() {
    const hasPermission = await requestMediaLibraryPermission();

    if (hasPermission.granted && mediaUri) {
      try {
        const asset = await MediaLibrary.createAssetAsync(mediaUri);
        const album = await MediaLibrary.getAlbumAsync("PrompturMedia");
        if (album == null) {
          await MediaLibrary.createAlbumAsync("PrompturMedia", asset, false);
        } else {
          await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
        }
        Alert.alert("Saved!", "Video saved to your gallery.");
        setMediaUri(undefined);
      } catch (error) {
        Alert.alert("Error", "Failed to save video");
        console.error(error);
      }
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <CameraView
        style={StyleSheet.absoluteFill}
        facing={facing}
        mode="video"
        ref={cameraRef}
      />

      <SafeAreaView style={styles.topContainer}>
        <TouchableOpacity style={styles.closeButton} onPress={router.back}>
          <Ionicons name="close" size={28} color="#3b1f77" />
        </TouchableOpacity>
      </SafeAreaView>

      <View style={styles.bottomUiContainer}>
        <View style={styles.questionCard}>
          <Text style={styles.questionText}>What makes you{"\n"}happy?</Text>
        </View>

        <View style={styles.controlBar}>
          <TouchableOpacity
            onPress={toggleCameraFacing}
            style={styles.sideButton}
          >
            <Feather name="sun" size={24} color="#3b1f77" />
          </TouchableOpacity>

          <TouchableOpacity onPress={handleRecordPress} activeOpacity={0.7}>
            <View style={styles.recordButtonOuter}>
              <View
                style={[
                  styles.recordButtonInner,
                  isRecording && styles.recordButtonInnerStop, // Changes shape when recording
                ]}
              />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={
              mediaUri
                ? saveRecording
                : () =>
                    Alert.alert("Record first", "Record a video to save it.")
            }
            style={styles.sideButton}
          >
            <Ionicons
              name="play-skip-forward-outline"
              size={24}
              color={mediaUri ? "#3b1f77" : "#ccc"}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  permissionText: {
    fontSize: 16,
    marginBottom: 20,
  },
  topContainer: {
    position: "absolute",
    top: 0,
    right: 0,
    padding: 20,
    zIndex: 10,
  },
  closeButton: {
    backgroundColor: "white",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    marginTop: 10,
  },
  bottomUiContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: "flex-end",
  },
  questionCard: {
    backgroundColor: "#3b1f77",
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    marginBottom: -10,
    zIndex: 1,
    flex: 1,
  },
  questionText: {
    color: "white",
    fontSize: 22,
    fontWeight: "600",
    textAlign: "center",
  },
  controlBar: {
    backgroundColor: "white",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingVertical: 30,
    paddingBottom: 50,
    zIndex: 2,
  },
  sideButton: {
    padding: 10,
  },
  recordButtonOuter: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 4,
    borderColor: "#3b1f77",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  recordButtonInner: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#D32F2F",
  },
  recordButtonInnerStop: {
    width: 30,
    height: 30,
    borderRadius: 4,
  },
});
