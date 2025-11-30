import * as Notifications from "expo-notifications";
import { View, Button, Platform, Text, StyleSheet } from "react-native";
import { useEffect } from "react";

// Set notification handler to control how notifications are presented while the app is foregrounded.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: false,

    shouldSetBadge: false,

    shouldShowBanner: true,

    shouldShowList: true,
  }),
});

export default function Index() {
  // 1. 🔑 Request Notification Permissions (Runs once on component mount)
  useEffect(() => {
    (async () => {
      // Platform check is good practice, though Expo generally handles cross-platform well.
      if (Platform.OS !== "web") {
        const { status: existingStatus } =
          await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        // If permission hasn't been granted yet, request it.
        if (existingStatus !== "granted") {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }

        if (finalStatus !== "granted") {
          console.error("Failed to get push token or permissions denied!");
          alert(
            "Notification permissions were not granted. Please enable them in your device settings."
          );
          return;
        }
        console.log("Notification permissions granted.");
      }
    })();
  }, []);

  // 2. 🗓️ Schedule a ONE-TIME notification (Fires immediately upon press)
  const scheduleOneTimeNotification = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "🔔 One-Time Alert",
        body: "I was scheduled to fire right now!",
        data: { screen: "home" },
      },
      // Setting trigger to null means it fires as soon as possible.
      trigger: null,
    });
    console.log("One-time Notification scheduled!");
  };

  // 3. 🔁 Schedule a REPEATING notification every 5 seconds
  const scheduleRepeatingNotification = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "🔄 Repeating Alert",
        body: "I will appear every 5 seconds until cancelled!",
        data: { type: "repeating" },
      },
      // Trigger object for repeating notification
      trigger: {
        // NOTE: Expo's minimum repeat interval is 60 seconds on production,
        // but 5 seconds works well for local testing/development environments.
        seconds: 5,
        repeats: true,
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      },
    });
    console.log("Repeating Notification scheduled every 5 seconds!");
  };

  // 4. 🛑 Cancel ALL scheduled notifications
  const cancelAllNotifications = async () => {
    // This stops both one-time and repeating notifications that haven't fired yet.
    await Notifications.cancelAllScheduledNotificationsAsync();
    console.log("All scheduled notifications cancelled successfully.");
    alert("All scheduled notifications have been stopped.");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Local Notification Controls</Text>

      <View style={styles.buttonSpacing}>
        <Button
          title="Schedule One-Time Notification"
          onPress={scheduleOneTimeNotification}
          color="#3498db"
        />
      </View>

      <View style={styles.buttonSpacing}>
        <Button
          title="Schedule Repeating (Every 5s)"
          onPress={scheduleRepeatingNotification}
          color="#2ecc71"
        />
      </View>

      <View style={styles.buttonSpacing}>
        <Button
          title="Cancel All Scheduled Notifications"
          onPress={cancelAllNotifications}
          color="#e74c3c"
        />
      </View>
      <Text style={styles.note}>
        Note: You will only see the notification if the app is closed or
        backgrounded, unless you are on Android where the handler is set to show
        alerts while foregrounded.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f8f8f8",
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#333",
  },
  buttonSpacing: {
    marginBottom: 15,
    width: "80%",
  },
  note: {
    marginTop: 40,
    fontSize: 12,
    color: "#666",
    textAlign: "center",
    paddingHorizontal: 10,
  },
});
