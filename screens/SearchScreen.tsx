import { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import Constants from "expo-constants";
import { MyStatusBar } from "../components";
import * as Location from "expo-location";

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
      <View style={styles.interactions}>
        {!!showSelectedLocation && !!selectedLocation && (
          <View style={styles.selectedPreview}>
            <View style={styles.selectedPreview_top}>
              <Image
                style={styles.selectedPreview_logo}
                source={{
                  uri: selectedLocation.company.logo,
                }}
              />
              <View>
                <Text style={styles.selectedPreview_company}>
                  {selectedLocation.company.name}
                </Text>
              </View>
            </View>
            <Text style={styles.selectedPreview_description}>
              {selectedLocation.company.mission}
            </Text>
          </View>
        )}

        {/* <View style={styles.search}>
          <TextInput style={styles.searchInput} placeholder="test" />
          <Pressable>
            <Text>Jobs</Text>
          </Pressable>
          <Pressable>
            <Text>Companies</Text>
          </Pressable>
        </View> */}
      </View>

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
      <MyStatusBar style={"dark"} />
    </View>
  );
}

let { height, width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height,
    width,
    // backgroundColor: "#000000",
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
  interactions: {
    position: "absolute",
    bottom: 0,
    zIndex: 1,
    width: "100%",
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
  selectedPreview: {
    width: "95%",
    margin: 8,
    padding: 16,
    // display: "flex",
    // justifyContent: "flex-start",
    // alignItems: "flex-start",
    backgroundColor: "#1D1D1F",
  },
  selectedPreview_top: {
    display: "flex",
    flexDirection: "row",
    marginBottom: 8,
  },
  selectedPreview_logo: {
    width: 48,
    height: 48,
    borderRadius: 10,
    marginRight: 8,
  },
  selectedPreview_company: {
    color: "#ffffff",
  },
  selectedPreview_title: {
    color: "#ffffff",
  },
  selectedPreview_description: {
    color: "#ffffff",
  },
});
