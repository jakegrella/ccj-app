import { DarkTheme, NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Home, SelectedJob, SelectedLocation } from "./screens";

const Dark = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    text: "#FFFFFF",
    primary: "#0171e3",
    background: "#000000",
    card: "#000000",
    border: "#000000",
    notification: "#000000",
  },
};

export default function App() {
  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer theme={Dark}>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{ headerTitle: "" }}
      >
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Selected Location" component={SelectedLocation} />
        <Stack.Screen name="Selected Job" component={SelectedJob} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
