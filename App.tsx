import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from "@react-navigation/native";
import { StyleSheet, Text, useColorScheme, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { MoreScreen, SavedScreen, SearchScreen } from "./screens";

const MyDarkTheme = {
  ...DarkTheme,
  dark: true,
  colors: {
    ...DarkTheme.colors,
    primary: "#5c7cff",
    background: "#000000",
    card: "#1D1D1F",
    text: "#FFFFFF",
    border: "#1D1D1F",
    notification: "#1D1D1F",
  },
};

// const MyLightTheme = {
//   ...DefaultTheme,
//   dark: false,
//   colors: {
//     ...DefaultTheme.colors,
//     primary: "#C966EC",
//     background: "#FFFFFF",
//     card: "#1D1D1F",
//     text: "#000000",
//     border: "#1D1D1F",
//     notification: "#1D1D1F",
//   },
// };

const Tab = createBottomTabNavigator();

export default function App() {
  // const scheme = useColorScheme();

  function getTabBarIcon(route, focused, color, size) {
    let iconName:
      | "search"
      | "search-outline"
      | "heart"
      | "heart-outline"
      | "ellipsis-horizontal"
      | "ellipsis-horizontal-outline"
      | "help-outline" = "help-outline";

    switch (route.name) {
      case "Search":
        iconName = focused ? "search" : "search-outline";
        break;
      case "Saved":
        iconName = focused ? "heart" : "heart-outline";
        break;
      case "More":
        iconName = focused
          ? "ellipsis-horizontal"
          : "ellipsis-horizontal-outline";
      default:
        break;
    }

    return <Ionicons name={iconName} size={size} color={color} />;
  }

  return (
    <SearchScreen />
    // <NavigationContainer theme={MyDarkTheme}>
    //   <Tab.Navigator
    //     screenOptions={({ route }) => ({
    //       tabBarIcon: ({ focused, color, size }) =>
    //         getTabBarIcon(route, focused, color, size),
    //       headerShown: false,
    //     })}
    //   >
    //     <Tab.Screen name="Search" component={SearchScreen} />
    //     <Tab.Screen name="Saved" component={SavedScreen} />
    //     <Tab.Screen name="More" component={MoreScreen} />
    //   </Tab.Navigator>
    // </NavigationContainer>
  );
}
