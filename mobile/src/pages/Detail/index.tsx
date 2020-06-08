import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
  SafeAreaView,
  Linking,
  ImageBackground,
} from "react-native";
import Constants from "expo-constants";
import { Feather as Icon, FontAwesome } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { RectButton } from "react-native-gesture-handler";
import api from "../../services/api";

interface Params {
  profile_id: number;
}

interface Data {
  profile: {
    image: string;
    image_url: string;
    name: string;
    nickname: string;
    whatsapp: string;
    gender: string;
    orientation: string;
    city: string;
    uf: string;
    spotify_uri: string;
  };
  moods: {
    title: string;
  }[];
}

const Detail = () => {
  const [data, setData] = useState<Data>({} as Data);

  const navigation = useNavigation();
  const route = useRoute();

  const routeParams = route.params as Params;

  useEffect(() => {
    api.get(`profiles/${routeParams.profile_id}`).then((response) => {
      setData(response.data);
      console.log(data.moods);
    });
  }, []);

  //console.log(route.params);

  function handleNavigateBack() {
    navigation.goBack();
  }

  function handleWhatsapp() {
    Linking.openURL(
      `whatsapp://send?phone=+${data.profile.whatsapp}$text=Whats vindo do app`
    );
  }

  if (!data.profile) {
    return null;
  }

  return (
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

        <Image
          style={styles.profileImage}
          source={{ uri: data.profile.image_url }}
        />

        <View style={styles.spotifyContainer}>
          <Image
            style={styles.spotifyImage}
            source={require("../../assets/spotify.png")}
          />
          <Text style={styles.spotifySpan}>MINHA MÚSICA</Text>
          <Text style={styles.spotifyMusic}>Starboy</Text>
        </View>

        <View style={styles.cityContainer}>
          <Text style={styles.citySpan}>TÔ SEMPRE EM</Text>
          <Text style={styles.cityName}>{data.profile.city}</Text>
        </View>

        <Text style={styles.profileNameTitle}>OLAR, ME CHAME DE</Text>
        <Text style={styles.profileNickname}>{data.profile.nickname}</Text>
      </View>
      <View style={styles.infos}>
        <View style={styles.profileInfos}>
          <Text style={styles.profileName}>{data.profile.name}</Text>
          <Text style={styles.addressContent}>
            {data.profile.city}, {data.profile.uf}
          </Text>
          <Text style={styles.profileTags}>{data.profile.gender}</Text>
          <Text style={styles.profileTags}>{data.profile.orientation}</Text>
        </View>
        <View style={styles.moodInfos}>
          {data.moods.map((mood) => (
            <Text key={mood.title} style={styles.profileMood}>
              {mood.title}
            </Text>
          ))}
        </View>
      </View>
      <View style={styles.footer}>
        <RectButton style={styles.button} onPress={handleWhatsapp}>
          <FontAwesome name="whatsapp" size={20} color="#FFF" />
          <Text style={styles.buttonText}>Whatsapp</Text>
        </RectButton>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: Constants.statusBarHeight,
  },

  spotifyContainer: {
    position: "absolute",
    right: 0,
    top: "30%",
    backgroundColor: "#252527",
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
  },

  spotifyImage: {
    width: "100%",
  },

  spotifySpan: {
    fontSize: 12,
    color: "#E5E5E5",
    marginLeft: 8,
    marginTop: 8,
    marginRight: 8,
  },

  spotifyMusic: {
    fontSize: 16,
    color: "#E5E5E5",
    fontFamily: "Montserrat_700Bold",
    marginLeft: 8,
    marginBottom: 8,
    marginRight: 8,
  },

  cityContainer: {
    position: "absolute",
    right: 0,
    top: "75%",
    backgroundColor: "#252527",
    borderRadius: 4,
  },

  citySpan: {
    fontSize: 12,
    color: "#E5E5E5",
    marginLeft: 8,
    marginTop: 8,
    marginRight: 8,
  },

  cityName: {
    fontSize: 16,
    color: "#E5E5E5",
    fontFamily: "Montserrat_700Bold",
    marginLeft: 8,
    marginBottom: 8,
    marginRight: 8,
  },

  profileImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    borderRadius: 4,
    marginTop: 32,
  },

  profileNickname: {
    color: "#FFFFFF",
    fontSize: 56,
    marginLeft: 20,
    fontFamily: "Montserrat_700Bold",
    marginTop: -10,
  },

  profileName: {
    color: "#FFFFFF",
    fontSize: 28,
    fontFamily: "Montserrat_700Bold",
    marginTop: 12,
  },

  profileNameTitle: {
    color: "#4AB955",
    marginTop: -100,
    marginLeft: 20,
    fontFamily: "Montserrat_700Bold",
    fontSize: 12,
  },

  profileItems: {
    fontFamily: "Roboto_400Regular",
    fontSize: 16,
    lineHeight: 24,
    marginTop: 8,
    color: "#6C6C80",
  },

  profileTags: {
    backgroundColor: "#4AB955",
    color: "#FFF",
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginTop: 10,
    flexGrow: 0,
    flexBasis: "auto",
    width: 120,
    borderRadius: 4,
  },

  infos: {
    marginTop: 62,
    marginLeft: 10,
    marginRight: 10,
    display: "flex",
    flexDirection: "row",
  },

  profileInfos: {
    flex: 1,
  },
  moodInfos: {
    marginTop: 12,
    display: "flex",
    flexDirection: "column",
  },

  addressTitle: {
    color: "#322153",
    fontFamily: "Roboto_500Medium",
    fontSize: 16,
  },

  addressContent: {
    fontFamily: "Roboto_400Regular",
    lineHeight: 24,
    marginTop: 8,
    color: "#A3AEB4",
    fontSize: 22,
  },

  profileMood: {
    backgroundColor: "#252527",
    color: "#FFFFFF",
    fontSize: 16,
    textAlign: "center",
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 30,
    paddingRight: 30,
    marginBottom: 10,
    borderRadius: 4,
  },

  footer: {
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingVertical: 20,
    paddingHorizontal: 14,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  button: {
    width: "100%",
    backgroundColor: "#FF3D9A",
    borderRadius: 4,
    height: 50,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    marginLeft: 8,
    color: "#FFF",
    fontSize: 16,
    fontFamily: "Roboto_500Medium",
  },
});

export default Detail;
