import Ionicons from "@expo/vector-icons/Ionicons";

export function getTabBarIcon(route, focused, color, size) {
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
