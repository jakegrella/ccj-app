import { useEffect, useState } from "react";
import {
  Button,
  Dimensions,
  Image,
  LayoutRectangle,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import Constants from "expo-constants";
import { MyStatusBar } from "../components";
import * as Location from "expo-location";
import Animated, {
  SlideInDown,
  SlideOutDown,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withDecay,
  withSpring,
  WithSpringConfig,
} from "react-native-reanimated";
import {
  Gesture,
  GestureDetector,
  PanGestureHandler,
  TapGestureHandler,
} from "react-native-gesture-handler";

let haveUserLocation;
let mapRegionChangedTimeout;

export function SearchScreen() {
  const [mappableLocations, setMappableLocations] = useState([]);
  const [mapRegion, setMapRegion] = useState<{
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  }>({
    latitude: 37.8,
    longitude: -122.4,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [selectedLocation, setSelectedLocation] = useState(undefined);

  // on page load, request user location + set map region
  useEffect(() => {
    async function getCurrentLocation() {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        haveUserLocation = false;
        // set region to default SF FiDi
        setMapRegion({
          latitude: 40.741895,
          longitude: -73.989308,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
        return;
      }

      let { coords } = await Location.getCurrentPositionAsync({});
      haveUserLocation = true;
      setMapRegion({
        latitude: coords.latitude,
        longitude: coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
      return;
    }
    getCurrentLocation();
  }, []);

  // when map region updates, fetch + set mappable jobs
  useEffect(() => {
    async function getMappableLocations() {
      if (mapRegion) {
        const bounds = {
          lat_min: (
            mapRegion.latitude -
            mapRegion.latitudeDelta / 2
          ).toString(),
          lat_max: (
            mapRegion.latitude +
            mapRegion.latitudeDelta / 2
          ).toString(),
          lng_min: (
            mapRegion.longitude -
            mapRegion.longitudeDelta / 2
          ).toString(),
          lng_max: (
            mapRegion.longitude +
            mapRegion.longitudeDelta / 2
          ).toString(),
        };

        try {
          const url = `${Constants.expoConfig?.extra?.API_DEV_URL}/api/locations?lat_min=${bounds.lat_min}&lat_max=${bounds.lat_max}&lng_min=${bounds.lng_min}&lng_max=${bounds.lng_max}`;
          setMappableLocations(await (await fetch(url)).json());
        } catch (err: any) {
          console.log("err", err.message);
        }
      }
    }
    getMappableLocations();
  }, [mapRegion]);

  function handleRegionChangeComplete(region) {
    clearTimeout(mapRegionChangedTimeout);
    mapRegionChangedTimeout = setTimeout(() => {
      setMapRegion(region);
    }, 500);
  }

  const [viewLayout, setViewLayout] = useState<LayoutRectangle>({
    height: 100,
    width: 100,
    x: 0,
    y: 0,
  });

  const locationInfoPreviewHeight = height - viewLayout.height - 100 - 79; // TODO get away from pixels
  // height is screen height
  // viewLayout.height is animated.view height
  // 100 is height of preview section of location info
  // 79 is tab navigator height
  console.log("height:", height);
  console.log("viewLayout.height", viewLayout.height);
  console.log("locationInfoPreviewHeight", locationInfoPreviewHeight);

  // location info
  const pressed = useSharedValue(false);

  const startingYPosition = locationInfoPreviewHeight;
  const y = useSharedValue(startingYPosition);

  // drag gesture
  const eventHandler = useAnimatedGestureHandler({
    onStart: (_event, ctx) => {
      pressed.value = true;
      ctx.startY = y.value;
    },
    onActive: (event, ctx) => {
      y.value = ctx.startY + event.translationY;
    },
    onEnd: (event, ctx) => {
      pressed.value = false;
      y.value = ctx.startY + event.translationY;
    },
  });

  const uas = useAnimatedStyle(() => {
    return {
      backgroundColor: pressed.value ? "#121212" : "#000000",
      transform: [{ translateY: y.value }],
    };
  });

  function handleMapPress({ nativeEvent }) {
    if (nativeEvent.action && nativeEvent.action === "marker-press") {
      // marker pressed
      const foundLocation = mappableLocations.find(
        (loc: any) => loc.id === nativeEvent.id
      );

      if (foundLocation) setSelectedLocation(foundLocation); // matching location found
      return;
    }
    setSelectedLocation(undefined); // marker not pressed or no matching location found
    y.value = locationInfoPreviewHeight; // reset location info to display at preview height
    return;
  }

  return (
    <View style={styles.container}>
      {/* search */}
      <View>
        <Text>test</Text>
      </View>
      {/* location info */}
      {/* TODO if tap or swipe UP on preview sized card, overlay a full size ScrollView */}
      {!!selectedLocation && (
        <PanGestureHandler onGestureEvent={eventHandler}>
          <Animated.View
            entering={SlideInDown.duration(200)}
            exiting={SlideOutDown.duration(200)}
            style={[styles.locationInfo, uas]}
            onLayout={(event) => {
              setViewLayout(event.nativeEvent.layout);
              console.log("height", event.nativeEvent.layout.height);
              console.log("y", event.nativeEvent.layout.y);
            }}
          >
            <View style={styles.locationInfo_top}>
              <Image
                style={styles.locationInfo_logo}
                source={{
                  uri: selectedLocation.company.logo,
                }}
              />
              <View>
                <Text style={styles.locationInfo_company}>
                  {selectedLocation.company.name}
                </Text>
                <Text style={styles.locationInfo_company}>
                  {selectedLocation.jobs.length} Open Jobs
                </Text>
              </View>
            </View>
            <Text style={styles.locationInfo_description}>
              {selectedLocation.company.mission}
            </Text>

            {!!selectedLocation.jobs.length && (
              <View style={styles.locationInfo_jobContainer}>
                {selectedLocation.jobs.map((job) => (
                  <View key={job.id} style={styles.locationInfo_job}>
                    <Text style={styles.locationInfo_job_text}>
                      {job.title}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </Animated.View>
        </PanGestureHandler>
      )}

      {/* status bar */}
      {/* <MyStatusBar style={"dark"} /> */}

      {/* map */}
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: mapRegion.latitude,
          longitude: mapRegion.longitude,
          latitudeDelta: mapRegion.latitudeDelta,
          longitudeDelta: mapRegion.longitudeDelta,
        }}
        maxZoomLevel={14} // zooming too far in with custom map pins breaks map
        showsUserLocation={haveUserLocation} // will fail silently
        onRegionChangeComplete={handleRegionChangeComplete}
        onPress={handleMapPress}
      >
        {!!mappableLocations.length &&
          mappableLocations.map(
            (
              loc: any // need types from web app
            ) => (
              <Marker
                key={loc.id}
                identifier={loc.id}
                coordinate={{
                  latitude: loc.latitude,
                  longitude: loc.longitude,
                }}
              >
                <Image
                  style={styles.tinyLogo}
                  source={{
                    uri: loc.company.logo,
                  }}
                />
              </Marker>
            )
          )}
      </MapView>
    </View>
  );
}

let { height, width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height,
    width,
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  text: {
    color: "#ffffff",
  },
  tinyLogo: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderRadius: 12,
    borderColor: "#5c7cff",
  },
  interactions: {
    position: "absolute",
    top: "auto",
    bottom: 0,
    zIndex: 1,
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  locationInfo: {
    padding: 16,
    // height: 400,
    width: "100%",
    zIndex: 3,
    borderTopStartRadius: 20,
    borderTopEndRadius: 20,
  },
  locationInfo_top: {
    display: "flex",
    flexDirection: "row",
    marginBottom: 8,
  },
  locationInfo_logo: {
    width: 48,
    height: 48,
    borderRadius: 10,
    marginRight: 8,
  },
  locationInfo_company: {
    color: "#ffffff",
  },
  locationInfo_title: {
    color: "#ffffff",
  },
  locationInfo_description: {
    color: "#ffffff",
  },
  locationInfo_jobContainer: {
    marginTop: 16,
  },
  locationInfo_job: {
    borderWidth: 2,
    borderRadius: 8,
    borderColor: "#ffffff",
    padding: 8,
    marginVertical: 8,
  },
  locationInfo_job_text: {
    color: "#ffffff",
  },
});
