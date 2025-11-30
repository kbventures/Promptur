import { Tabs } from "expo-router";
import { Text, StyleSheet } from "react-native";

import Ionicons from "@expo/vector-icons/Ionicons";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#ffd33d",
        headerTitleAlign: "center",
        headerStyle: {
          backgroundColor: "#fff",
        },
        headerShadowVisible: false,
        headerTintColor: "#000",
        tabBarStyle: {
          backgroundColor: "#fff",
        },
        tabBarShowLabel: false,
        headerTitle: () => <Text style={styles.title}>Promptur</Text>,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "home-sharp" : "home-outline"}
              color={color}
              size={24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="record"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name="play-skip-forward-outline"
              size={24}
              color={"#3b1f77"}
            />
          ),
          headerShown: false,
          tabBarStyle: { display: "none" },
        }}
      />
      <Tabs.Screen
        name="facebook"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name="logo-facebook" size={24} color={"#3b1f77"} />
          ),
          headerShown: false,
          tabBarStyle: { display: "none" },
        }}
      />
    </Tabs>
  );
}
const styles = StyleSheet.create({
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#E97463",
  },
});
