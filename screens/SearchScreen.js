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
import { MyStatusBar } from "../components";
import * as Location from "expo-location";

let haveUserLocation;
let mapRegionChangedTimeout;

export function SearchScreen() {
  const [initMap, setInitMap] = useState({
    latitude: 40.741895,
    longitude: -73.989308,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const [mappableJobs, setMappableJobs] = useState([]);
  const [mapMarkers, setMapMarkers] = useState([]);
  const [mapRegion, setMapRegion] = useState(undefined);
  const [selectedJob, setSelectedJob] = useState(undefined);
  const [showSelectedJob, setShowSelectedJob] = useState(false);

  // on page load
  // - request user location
  // - set init map location
  useEffect(() => {
    async function getCurrentLocation() {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        haveUserLocation = false;
        // set region to default Manhattan
        setInitMap({
          latitude: 40.741895,
          longitude: -73.989308,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
        return;
      }

      let { coords } = await Location.getCurrentPositionAsync({});
      haveUserLocation = true;
      setInitMap({
        latitude: coords.latitude,
        longitude: coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
      return;
    }
    getCurrentLocation();
  }, []);

  // when map region updates
  // - fetch + set mappable jobs
  useEffect(() => {
    async function getMappableJobs() {
      if (mapRegion) {
        const latBound = {
          min: mapRegion.latitude - mapRegion.latitudeDelta / 2,
          max: mapRegion.latitude + mapRegion.latitudeDelta / 2,
        };

        const lngBound = {
          min: mapRegion.longitude - mapRegion.longitudeDelta / 2,
          max: mapRegion.longitude + mapRegion.longitudeDelta / 2,
        };

        const body = JSON.stringify({
          latBound,
          lngBound,
        });

        try {
          const response = await fetch(
            `${process.env.API_DEV_URL}/api/jobs/mappable`,
            {
              method: "post",
              headers: {
                Authorization: "Bearer " + process.env.API_SECRET_KEY,
                "Content-Type": "application/json",
              },
              body,
            }
          );

          const data = await response.json();

          setMappableJobs(data);
        } catch (err) {
          console.log("err", err);
        }
      }
    }
    getMappableJobs();
  }, [mapRegion]);

  // when jobs update
  // - set map markers
  useEffect(() => {
    // init markerPositions
    let markerPositions = [];

    // markerPositions = array of marker locations
    if (mappableJobs && mappableJobs.length) {
      mappableJobs.forEach((job) => {
        job.locations.forEach(({ latitude, longitude }) => {
          markerPositions.push({
            position: { latitude, longitude },
            companyLogo: job.company.logo,
            jobId: job.id,
          });
        });
      });
    }
    // set map markers to array of marker locations
    setMapMarkers(markerPositions);
  }, [mappableJobs]);

  function handleRegionChangeComplete(region) {
    clearTimeout(mapRegionChangedTimeout);
    mapRegionChangedTimeout = setTimeout(() => {
      // if (mapRegion) {
      setMapRegion(region);
      // }
    }, 500);
  }

  function handleMarkerPress(e) {
    // console.log("marker press");
    const foundJob = mappableJobs.find(
      (job) => job.id.toString() === e.nativeEvent.id
    );

    if (foundJob) {
      setSelectedJob(foundJob);
      setShowSelectedJob(true);
    } else {
      setShowSelectedJob(false);
      setSelectedJob(undefined);
    }
  }

  function handleMapPress({ nativeEvent }) {
    // console.log("map press", nativeEvent);

    // if (nativeEvent.action && nativeEvent.action === "marker-press") {
    // marker not pressed
    if (!nativeEvent.action) {
      setShowSelectedJob(false);
      setSelectedJob(undefined);
    }
  }

  // TODO combine map press and marker press functions

  return (
    <View style={styles.container}>
      <View style={styles.interactions}>
        {showSelectedJob && selectedJob && (
          <View style={styles.selectedPreview}>
            <View style={styles.selectedPreview_top}>
              <Image
                style={styles.selectedPreview_logo}
                source={{
                  uri: selectedJob.company.logo,
                }}
              />
              <View>
                <Text style={styles.selectedPreview_company}>
                  {selectedJob.company.name}
                </Text>
                <Text style={styles.selectedPreview_title}>
                  {selectedJob.title}
                </Text>
              </View>
            </View>
            <Text style={styles.selectedPreview_description}>
              {selectedJob.company.mission}
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
          latitude: initMap.latitude,
          longitude: initMap.longitude,
          latitudeDelta: initMap.latitudeDelta,
          longitudeDelta: initMap.longitudeDelta,
        }}
        maxZoomLevel={14} // zooming too far in with custom map pins breaks map
        showsUserLocation={haveUserLocation} // will fail silently
        onRegionChangeComplete={handleRegionChangeComplete}
        onPress={handleMapPress}
      >
        {/* <Text> */}
        {mapMarkers &&
          mapMarkers.length &&
          mapMarkers.map((m) => {
            return (
              <Marker
                key={Math.random()}
                coordinate={{
                  latitude: m.position.latitude,
                  longitude: m.position.longitude,
                }}
                onPress={handleMarkerPress}
                identifier={m.jobId.toString()}
              >
                <Image
                  style={styles.tinyLogo}
                  source={{
                    uri: m.companyLogo,
                  }}
                />
              </Marker>
            );
          })}
        {/* </Text> */}
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
