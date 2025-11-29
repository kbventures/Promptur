import { useState, useEffect } from "react";
import { Button, Text, View } from "react-native";
import {
  makeRedirectUri,
  useAuthRequest,
  ResponseType,
} from "expo-auth-session";
import { requestTrackingPermissionsAsync } from "expo-tracking-transparency";
import { AccessToken, LoginButton, Settings } from "react-native-fbsdk-next";

const clientId = process.env.EXPO_PUBLIC_FB_APP_ID!;

export default function Index() {
  useEffect(() => {
    const requestTracking = async () => {
      const { status } = await requestTrackingPermissionsAsync();
      console.log("Tracking permission status:", status);
      Settings.initializeSDK();
      if (status === "granted") {
        Settings.setAdvertiserTrackingEnabled(true);
      }
    };
    requestTracking();
  }, []);
  return (
    <View style={{ padding: 40 }}>
      {/* <Button
        title="Login with Instagram"
        onPress={handleLogin}
        disabled={!request}
      /> */}
      <LoginButton
        onLogoutFinished={() => console.log("Logout")}
        onLoginFinished={(err, result) => {
          console.log("Login result:", err, result);
          AccessToken.getCurrentAccessToken().then((data) => {
            console.log("Access Token:", data);
          });
        }}
      />
    </View>
  );
}
