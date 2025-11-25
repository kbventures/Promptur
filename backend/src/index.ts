import { Hono, Env } from "hono";

// 1. Define the Bindings Interface
// This interface strongly types the environment variables (known as "bindings" in Cloudflare).
interface Bindings {
  IG_APP_ID: string;
  IG_APP_SECRET: string;
  // You can add other bindings here, e.g., DATABASE, KV namespaces, etc.
}

// 2. Pass the Bindings type to Hono
// The environment variables will now be available under c.env.
const app = new Hono<{ Bindings: Bindings }>();

app.get("/", (c) => {
  return c.text("It works, the app id is " + c.env.IG_APP_ID);
});

app.post("/auth/instagram/callback", async (c) => {
  // 3. Access environment variables directly from the context (c.env)
  const IG_APP_ID = c.env.IG_APP_ID;
  const IG_APP_SECRET = c.env.IG_APP_SECRET;

  const { code, redirectUri } = await c.req.json();

  // 1. Exchange Code for Short-Lived Token
  // Note: Instagram strictly requires form-data for this call
  const form = new FormData();
  form.append("client_id", IG_APP_ID);
  form.append("client_secret", IG_APP_SECRET);
  form.append("grant_type", "authorization_code");
  form.append("redirect_uri", redirectUri); // Must match EXACTLY what Expo sent
  form.append("code", code);

  const tokenRes = await fetch("https://api.instagram.com/oauth/access_token", {
    method: "POST",
    body: form,
  });

  type InstagramTokenSuccessResponse = {
    access_token: string;
    user_id: string;
    permissions?: any;
  };
  type InstagramTokenErrorResponse = {
    error_type: string;
    error_message: string;
  };

  const tokenData = (await tokenRes.json()) as
    | InstagramTokenSuccessResponse
    | InstagramTokenErrorResponse;

  if ("error_type" in tokenData && tokenData.error_type) {
    // Log the error for debugging purposes in Cloudflare Workers console
    console.error("Instagram Token Error:", tokenData);
    return c.json({ error: tokenData.error_message }, 400);
  }

  // We've already returned on error above, so assert the success shape here.
  const { access_token, user_id } = tokenData as InstagramTokenSuccessResponse;

  return c.json({
    success: true,
    accessToken: access_token,
    userId: user_id,
  });
});

export default app;
