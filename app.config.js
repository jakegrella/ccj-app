module.exports = {
  expo: {
    name: "Cloud Computing Jobs",
    description: "Explore companies and engineering jobs",
    slug: "ccj-app",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "dark",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#000000",
    },
    updates: {
      fallbackToCacheTimeout: 0,
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.cloudcomputingjobs.mobile",
      infoPlist: {
        NSLocationWhenInUseUsageDescription:
          "Turning on location services allows us to show companies and jobs in your area.",
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
    },
    web: {
      favicon: "./assets/favicon.png",
    },
    extra: {
      eas: {
        projectId: "95438394-52ce-4c9d-aeb8-328b7b192cba",
      },
      API_URL: "https://cloudcomputingjobs.com",
    },
  },
};
