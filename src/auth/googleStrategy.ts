import { config } from "dotenv";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

config();

export const base64Decode = (str: string) => {
  const b = Buffer.from(str, "base64");
  return b.toString();
};

const gapiCredentialsEncoded = JSON.parse(
  process.env.GAPI_CREDENTIALS_ENCODED
    ? base64Decode(process.env.GAPI_CREDENTIALS_ENCODED)
    : "{}",
);
console.log("🚀 ~ gapiCredentialsEncoded:", gapiCredentialsEncoded);

if (!gapiCredentialsEncoded.web) {
  throw new Error(
    "GAPI credentials are not properly set in environment variables.",
  );
}

const GOOGLE_CLIENT_ID = gapiCredentialsEncoded.web.client_id!;
const GOOGLE_CLIENT_SECRET = gapiCredentialsEncoded.web.client_secret!;
const CALLBACK_URL =
  process.env.GOOGLE_CALLBACK_URL ||
  "http://localhost:7712/auth/google/callback";
const ALLOWED_DOMAINS = (process.env.ALLOWED_DOMAINS || "rockyhub.io")
  .split(",")
  .map((domain) => domain.trim());

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: CALLBACK_URL,
    },
    (accessToken, refreshToken, profile, done) => {
      const email = profile.emails?.[0]?.value;

      // Check if email exists and has allowed domain
      if (!email) {
        console.log("❌ Authentication failed: No email found in profile");
        return done(null, false, {
          message: "No email found in profile",
        });
      }

      const emailDomain = email.split("@")[1];
      if (!ALLOWED_DOMAINS.includes(emailDomain)) {
        console.log(
          `❌ Authentication failed: Email ${email} is not from allowed domains: ${ALLOWED_DOMAINS.join(", ")}`,
        );
        return done(null, false, {
          message: `Only emails from ${ALLOWED_DOMAINS.join(", ")} are allowed`,
        });
      }

      const user = {
        id: profile.id,
        email: email,
        displayName: profile.displayName,
      };
      console.log("✅ Authentication successful:", user);
      return done(null, user);
    },
  ),
);

passport.serializeUser((user: any, done) => {
  console.log("🚀 ~ serializeUser:", user);
  done(null, user);
});

passport.deserializeUser((user: any, done) => {
  console.log("🚀 ~ deserializeUser:", user);
  done(null, user);
});

export default passport;
