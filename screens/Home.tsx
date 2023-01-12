import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { getTabBarIcon } from "../utils";
import { Search } from "./Search";

export function Home() {
  const Tab = createBottomTabNavigator();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) =>
          getTabBarIcon(route, focused, color, size),
        headerShown: false,
      })}
    >
      <Tab.Screen name="Search" component={Search} />
    </Tab.Navigator>
  );
}
