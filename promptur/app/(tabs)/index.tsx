import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";

export default function Index() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.headerText}>Login</Text>
        <Text style={styles.subheaderText}>
          Choose a social media to login and start sharing your media at any
          moment!
        </Text>
      </View>
      <TouchableOpacity
        style={styles.googleButton}
        onPress={() => router.push("/record")}
      >
        <Ionicons name="logo-google" size={24} color="#4285F4" />
        <Text style={styles.googleButtonText}>Sign in with Google</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    display: "flex",
    padding: 20,
    gap: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#E97463",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#360E93",
    textAlign: "left",
    alignSelf: "flex-start",
  },
  subheaderText: {
    fontSize: 18,
    color: "#575757",
    textAlign: "left",
  },

  googleButton: {
    flexDirection: "row", // Arrange icon and text horizontally
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF", // White background
    borderWidth: 1,
    borderColor: "#ccc", // Light border
    borderRadius: 4, // Slight rounding
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: "80%", // Make it a reasonable width
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  googleButtonText: {
    fontSize: 16,
    color: "#575757", // Dark gray text
    fontWeight: "600",
    marginLeft: 10, // Space between icon and text
  },
});
