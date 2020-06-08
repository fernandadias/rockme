/*
useState: Armazenar uma informação
useEffect: Disparar uma ação
*/

import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ScrollView,
  Image,
  Alert,
  ImageBackground,
} from "react-native";
import { Feather as Icon } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import Constants from "expo-constants";
import MapView, { Marker } from "react-native-maps";
import { SvgUri } from "react-native-svg";
import api from "../../services/api";
import * as Location from "expo-location";

interface Item {
  id: number;
  title: string;
  image_url: string;
}

interface Point {
  id: number;
  image: string;
  image_url: string;
  name: string;
  lat: number;
  long: number;
}

interface Params {
  uf: string;
  city: string;
}

const Profiles = () => {
  const [moods, setMoods] = useState<Item[]>([]);
  const [selectedMoods, setSelectedMoods] = useState<number[]>([]);
  const [profiles, setProfiles] = useState<Point[]>([]);

  const navigation = useNavigation();
  const route = useRoute();

  const routeParams = route.params as Params;

  const [initialPosition, setInitialPosition] = useState<[number, number]>([
    0,
    0,
  ]);

  useEffect(() => {
    async function loadPosition() {
      const { status } = await Location.requestPermissionsAsync();

      if (status !== "granted") {
        Alert.alert("Vixe, onde cê ta filhote?");
        return;
      }

      const location = await Location.getCurrentPositionAsync();

      const { latitude, longitude } = location.coords;

      setInitialPosition([latitude, longitude]);
    }

    loadPosition();
  }, []);

  useEffect(() => {
    api.get("moods").then((response) => {
      setMoods(response.data);
    });
  }, []);

  useEffect(() => {
    api
      .get("profiles", {
        params: {
          uf: routeParams.uf,
          moods: selectedMoods,
        },
      })
      .then((response) => {
        setProfiles(response.data);
      });
  }, [selectedMoods]);

  function handleNavigateBack() {
    navigation.goBack();
  }

  function handleNavigateToDetail(id: number) {
    navigation.navigate("Detail", { profile_id: id });
  }

  function handleSelectMood(id: number) {
    const alreadySelected = selectedMoods.findIndex((mood) => mood === id);
    if (alreadySelected >= 0) {
      const filteredMoods = selectedMoods.filter((item) => item !== id);
      setSelectedMoods(filteredMoods);
    } else {
      setSelectedMoods([...selectedMoods, id]);
    }
  }

  return (
    <>
      <ImageBackground
        source={require("../../assets/splash.png")}
        imageStyle={{
          resizeMode: "cover",
        }}
        style={styles.container}
      >
        <View style={styles.container}>
          <TouchableOpacity onPress={handleNavigateBack}>
            <Icon name="arrow-left" size={20} color="#34cb79" />
          </TouchableOpacity>
          <Text style={styles.title}>Veja quem está por perto :)</Text>

          <View style={styles.mapContainer}>
            {initialPosition[0] !== 0 && (
              <MapView
                style={styles.map}
                initialRegion={{
                  latitude: initialPosition[0],
                  longitude: initialPosition[1],
                  latitudeDelta: 0.014,
                  longitudeDelta: 0.014,
                }}
              >
                {profiles.map((profile) => (
                  <Marker
                    key={String(profile.id)}
                    style={styles.mapMarker}
                    onPress={() => handleNavigateToDetail(profile.id)}
                    coordinate={{
                      latitude: profile.lat,
                      longitude: profile.long,
                    }}
                  >
                    <View style={styles.mapMarkerContainer}>
                      <Image
                        style={styles.mapMarkerImage}
                        source={{ uri: profile.image_url }}
                      />
                    </View>
                  </Marker>
                ))}
              </MapView>
            )}
          </View>
        </View>
        <View style={styles.itemsContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator
            contentContainerStyle={{ paddingHorizontal: 20 }}
          >
            {moods.map((mood) => (
              <TouchableOpacity
                activeOpacity={0.6}
                key={String(mood.id)}
                style={[
                  styles.mood,
                  selectedMoods.includes(mood.id) ? styles.selectedMood : {},
                ]}
                onPress={() => handleSelectMood(mood.id)}
              >
                <SvgUri width={42} height={42} uri={mood.image_url} />
                <Text
                  style={[
                    styles.moodTitle,
                    selectedMoods.includes(mood.id)
                      ? styles.selectedMoodTitle
                      : {},
                  ]}
                >
                  {mood.title}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </ImageBackground>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: Constants.statusBarHeight,
  },

  title: {
    fontSize: 20,
    fontFamily: "Montserrat_700Bold",
    marginTop: 24,
    marginBottom: 24,
    color: "#FFFFFF",
  },

  mapContainer: {
    flex: 1,
    width: "100%",
    borderRadius: 10,
    overflow: "hidden",
    marginTop: 16,
    borderColor: "#4AB955",
    borderStyle: "solid",
    borderWidth: 2,
  },

  map: {
    width: "100%",
    height: "100%",
  },

  mapMarker: {
    width: 90,
    height: 80,
  },

  mapMarkerContainer: {
    width: 70,
    height: 70,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: "#FF3D9A",
    backgroundColor: "transparent",
    flexDirection: "column",
    overflow: "hidden",
    alignItems: "center",
  },

  mapMarkerImage: {
    width: 50,
    height: 50,
    marginTop: 8,
    borderRadius: 100,
    resizeMode: "cover",
  },

  itemsContainer: {
    flexDirection: "row",
    marginTop: 16,
    marginBottom: 32,
  },

  mood: {
    backgroundColor: "#252527",
    borderWidth: 2,
    borderColor: "#252527",
    height: 120,
    width: 120,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
    marginRight: 8,
    alignItems: "center",
    justifyContent: "space-between",

    textAlign: "center",
  },

  selectedMood: {
    borderColor: "#FF3D9A",
    backgroundColor: "#FF3D9A",
    borderWidth: 2,
  },

  moodTitle: {
    fontFamily: "Roboto_400Regular",
    textAlign: "center",
    fontSize: 13,
    color: "#4AB955",
  },

  selectedMoodTitle: {
    color: "#FFFFFF",
  },
});

export default Profiles;
