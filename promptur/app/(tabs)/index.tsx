import { useState, useEffect } from "react";
import { Button, GestureResponderEvent, Text, View } from "react-native";
import {
  makeRedirectUri,
  useAuthRequest,
  ResponseType,
} from "expo-auth-session";
import { requestTrackingPermissionsAsync } from "expo-tracking-transparency";
import {
  AccessToken,
  GraphRequest,
  GraphRequestManager,
  LoginButton,
  Settings,
} from "react-native-fbsdk-next";

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
  function getFacebookData(event: GestureResponderEvent): void {
    const infoRequest = new GraphRequest("/me", undefined, (err, result) => {
      console.log("result of /me", result);
      console.log("err", err);
    });
    new GraphRequestManager().addRequest(infoRequest).start();
  }
  function getInstagramData(event: GestureResponderEvent): void {
    const infoRequest = new GraphRequest(
      "/accounts?fields=id,name,access_token,instagram_business_account",
      undefined,
      (err, result) => {
        console.log(
          "result of /accounts?fields=id,name,access_token,instagram_business_account",
          result
        );
        console.log("err", err);
      }
    );
    new GraphRequestManager().addRequest(infoRequest).start();
  }

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
      <Button title="getFacebookData" onPress={getFacebookData} />
      <Button title="getInstagramData" onPress={getInstagramData} />
    </View>
  );
}
