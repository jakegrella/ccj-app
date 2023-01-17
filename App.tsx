import { DarkTheme, NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Home, SelectedJob, SelectedLocation } from "./screens";
import { colors } from "./utils";

const Dark = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    text: colors.white,
    primary: colors.primary,
    background: colors.black,
    card: colors.black,
    border: colors.black,
    notification: colors.black,
  },
};

export default function App() {
  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer theme={Dark}>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{ headerTitle: "", headerShadowVisible: false }}
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
