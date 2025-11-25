import * as React from "react";
import { Button, View } from "react-native";
import * as WebBrowser from "expo-web-browser";
import {
  makeRedirectUri,
  useAuthRequest,
  ResponseType,
} from "expo-auth-session";

WebBrowser.maybeCompleteAuthSession();

// 1. Configuration (Get these from Meta App Dashboard > Instagram > API Setup)
const DISCOVERY = {
  authorizationEndpoint: "https://api.instagram.com/oauth/authorize",
  tokenEndpoint: "https://graph.instagram.com/access_token",
};

export default function InstagramLogin() {
  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: process.env.EXPO_PUBLIC_FB_APP_ID!,
      scopes: [
        "instagram_business_basic",
        "instagram_business_content_publish",
      ],
      redirectUri: makeRedirectUri({
        scheme: "promptur", // defined in app.json
      }),
      responseType: ResponseType.Code, // We want an Auth Code, not a token directly
    },
    DISCOVERY
  );

  React.useEffect(() => {
    if (response?.type === "success") {
      const { code } = response.params;
      // 2. Send this code to your Hono backend immediately
      exchangeCodeForToken(code);
    }
  }, [response]);

  const exchangeCodeForToken = async (code: string) => {
    try {
      const res = await fetch(
        "https://your-hono-api.com/auth/instagram/callback",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            code,
            redirectUri: makeRedirectUri({ scheme: "promptur" }),
          }),
        }
      );
      const data = await res.json();
      console.log("Logged in! IG User ID:", data.user_id);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Button
        disabled={!request}
        title="Log in with Instagram"
        onPress={() => promptAsync()}
      />
    </View>
  );
}
