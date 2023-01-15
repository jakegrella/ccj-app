import { useEffect, useState } from "react";
import { Dimensions, Image, StyleSheet, Text, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import Constants from "expo-constants";
import { SelectedLocationHeader } from "../components";
import * as Location from "expo-location";
import Animated, { SlideInDown, SlideOutDown } from "react-native-reanimated";
import { StatusBar } from "expo-status-bar";

let haveUserLocation;
let mapRegionChangedTimeout;

export function Search({ navigation }) {
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
  const [selectedLocation, setSelectedLocation] = useState<any>(undefined);
  const [showSelectedLocation, setShowSelectedLocation] = useState(false);

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
          const url = `${Constants.expoConfig?.extra?.API_URL}/api/locations?lat_min=${bounds.lat_min}&lat_max=${bounds.lat_max}&lng_min=${bounds.lng_min}&lng_max=${bounds.lng_max}`;
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

  function handleMapPress({ nativeEvent }) {
    if (nativeEvent.action && nativeEvent.action === "marker-press") {
      // marker pressed
      const foundLocation = mappableLocations.find(
        (loc: any) => loc.id === nativeEvent.id
      );

      if (foundLocation) {
        // matching location found
        setSelectedLocation(foundLocation);
        setShowSelectedLocation(true);
      } else {
        // no matching location found
        setShowSelectedLocation(false);
        setSelectedLocation(undefined);
      }
    } else {
      // marker not pressed
      setShowSelectedLocation(false);
      setSelectedLocation(undefined);
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {!!showSelectedLocation && !!selectedLocation && (
        <Animated.View
          entering={SlideInDown}
          exiting={SlideOutDown}
          style={styles.selectedLocation}
          onTouchEnd={() => {
            navigation.navigate("Selected Location", { selectedLocation });
          }}
        >
          <SelectedLocationHeader selectedLocation={selectedLocation} />
        </Animated.View>
      )}

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
    width: 32,
    height: 32,
    borderWidth: 2,
    borderRadius: 20,
    borderColor: "#5c7cff",
  },
  selectedLocation: {
    position: "absolute",
    bottom: 0,
    zIndex: 1,
    width: "95%",
    margin: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  search: {
    backgroundColor: "#1D1D1F",
    padding: 8,
    display: "flex",
    flexDirection: "row",
    flexWrap: "nowrap",
    borderWidth: 2,
  },
  searchInput: {
    borderWidth: 2,
    flexGrow: 2,
    height: 32,
  },
});
