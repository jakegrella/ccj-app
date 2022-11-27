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

  return (
    <NavigationContainer theme={MyDarkTheme}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            switch (route.name) {
              case "search":
                iconName = focused ? "search" : "search-outline";
                break;
              case "saved":
                iconName = focused ? "heart" : "heart-outline";
                break;
              case "more":
                iconName = focused
                  ? "ellipsis-horizontal"
                  : "ellipsis-horizontal-outline";
              default:
                break;
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          headerShown: false,
        })}
      >
        <Tab.Screen name="search" component={SearchScreen} />
        {/* <Tab.Screen name="saved" component={SavedScreen} /> */}
        {/* <Tab.Screen name="more" component={MoreScreen} /> */}
      </Tab.Navigator>
    </NavigationContainer>
  );
}
