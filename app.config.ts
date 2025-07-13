import "dotenv/config";
import { ConfigContext, ExpoConfig } from "expo/config";
import { version } from "./package.json";

// Project constants
const EAS_PROJECT_ID = "eb3293d4-5dbd-46f1-97b1-ffa47ba78d94";
const PROJECT_SLUG = "taskmarketplace";
const OWNER = "brown_wangeci";

// Base constants
const APP_NAME = "Task Marketplace";
const BUNDLE_IDENTIFIER = "com.brown_wangeci.taskmarketplace";
const PACKAGE_NAME = "com.brown_wangeci.taskmarketplace";
const ICON = "./assets/images/icon.png";
const ADAPTIVE_ICON = "./assets/images/icon.png";
const SCHEME = "taskmarketplace";
const BACKGROUND_COLOR = "#000101";

// Strictly typed environment config
type AppEnv = "development" | "preview" | "production";
const APP_ENVS = ["development", "preview", "production"] as const;

export default ({ config }: ConfigContext): ExpoConfig => {
  const appEnv = (process.env.APP_ENV ?? "development") as AppEnv;


  if (!APP_ENVS.includes(appEnv)) {
    throw new Error(
      `❌ Invalid APP_ENV: "${process.env.APP_ENV}". Must be one of ${APP_ENVS.join(", ")}.`
    );
  }

  console.log("⚙️ Building app for environment:", appEnv);

  const {
    name,
    bundleIdentifier,
    icon,
    adaptiveIcon,
    packageName,
    scheme,
  } = getDynamicAppConfig(appEnv);

  // Create base config
  const expoConfig: ExpoConfig = {
    ...config,
    name,
    slug: PROJECT_SLUG,
    scheme,
    version,
    owner: OWNER,
    platforms: ["android", "ios"],
    orientation: "portrait",
    icon,
    userInterfaceStyle: "automatic",
    backgroundColor: BACKGROUND_COLOR,
    updates: {
      url: `https://u.expo.dev/${EAS_PROJECT_ID}`,
    },
    runtimeVersion: {
      policy: "appVersion",
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier,
    },
    android: {
      package: packageName,
      adaptiveIcon: {
        foregroundImage: adaptiveIcon,
        backgroundColor: BACKGROUND_COLOR,
      },
      permissions: [
        "ACCESS_FINE_LOCATION",
        "ACCESS_COARSE_LOCATION",
        "READ_EXTERNAL_STORAGE",
      ],
      config: {
        googleMaps: {
          apiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY,
        },
      },
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png",
    },
    plugins: [
      "expo-router",
      "expo-secure-store",
      "expo-web-browser",
      [
        "expo-maps",
        {
          requestLocationPermission: true,
          locationPermission: `Allow ${APP_NAME} to use your location`,
        },
      ],
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: BACKGROUND_COLOR,
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      router: {},
      eas: {
        projectId: EAS_PROJECT_ID,
      },
      EXPO_PUBLIC_API_URL: process.env.EXPO_PUBLIC_API_URL,
      EXPO_PUBLIC_SERVICE_FEE: process.env.EXPO_PUBLIC_SERVICE_FEE,
      EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID:
        process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
      EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID:
        process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
      EXPO_PUBLIC_GOOGLE_MAPS_API_KEY:
        process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY,
      EXPO_PUBLIC_GOOGLE_PLACES_API_KEY:
        process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY,
    },
  };

  // Add CLI config with safe cast
  return {
    ...expoConfig,
    cli: {
      appVersionSource: "remote",
    },
  } as any;
};




// Dynamically configure the app based on the environment.
export const getDynamicAppConfig = (
    environment: "development" | "preview" | "production"
  ) => {
    if (environment === "production") {
      return {
        name: APP_NAME,
        bundleIdentifier: BUNDLE_IDENTIFIER,
        packageName: PACKAGE_NAME,
        icon: ICON,
        adaptiveIcon: ADAPTIVE_ICON,
        scheme: SCHEME,
      };
    }

    if (environment === "preview") {
      return {
        name: `${APP_NAME} Preview`,
        bundleIdentifier: `${BUNDLE_IDENTIFIER}.preview`,
        packageName: `${PACKAGE_NAME}.preview`,
        icon: "./assets/images/icon-preview.png",
        adaptiveIcon: "./assets/images/icon-preview.png",
        scheme: `${SCHEME}-prev`,
      };
    }

    return {
      name: `${APP_NAME} Development`,
      bundleIdentifier: `${BUNDLE_IDENTIFIER}.dev`,
      packageName: `${PACKAGE_NAME}.dev`,
      icon: "./assets/images/icon-dev.png",
      adaptiveIcon: "./assets/images/icon-dev.png",
      scheme: `${SCHEME}-dev`,
    };
  };