import React, { useState } from "react";
import {
  View,
  ImageBackground,
  Image,
  StyleSheet,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { RectButton } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";

const Home = () => {
  const [uf, setUf] = useState("");
  const [city, setCity] = useState("");

  const navigation = useNavigation();

  function handleNavigateToPoints() {
    navigation.navigate("Profiles", {
      uf,
      city,
    });
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ImageBackground
        source={require("../../assets/splash.png")}
        imageStyle={{
          resizeMode: "cover",
        }}
        style={styles.container}
      >
        <View style={styles.main}>
          <Image source={require("../../assets/rockme-logo.png")} />
          <Image
            style={styles.bullets}
            source={require("../../assets/bullets.png")}
          />
          <View>
            <Text style={styles.title}>Let's rock, baby</Text>
            <Text style={styles.description}>
              Encontre o amor da sua vida a uma música de distância.
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <TextInput
            style={styles.input}
            placeholder="Digite a UF"
            value={uf}
            onChangeText={setUf}
            maxLength={2}
            autoCapitalize="characters"
            autoCorrect={false}
          />
          <TextInput
            style={styles.input}
            placeholder="Digite a Cidade"
            value={city}
            onChangeText={setCity}
            autoCorrect={false}
          />
          <RectButton style={styles.button} onPress={handleNavigateToPoints}>
            <Text style={styles.buttonText}>ENCONTRAR</Text>
          </RectButton>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
  },

  main: {
    flex: 1,
    justifyContent: "center",
  },

  bullets: {
    position: "absolute",
    right: 0,
    top: 50,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 48,
    fontFamily: "Montserrat_700Bold",
    maxWidth: 260,
    marginTop: 64,
  },

  description: {
    color: "#A3AEB4",
    fontSize: 22,
    marginTop: 16,
    fontFamily: "Montserrat_400Regular",
    maxWidth: 260,
    lineHeight: 34,
  },

  footer: {},

  select: {},

  input: {
    height: 60,
    backgroundColor: "#252527",
    color: "#A0A0B2",
    borderRadius: 4,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  button: {
    backgroundColor: "#FF3D9A",
    height: 60,
    flexDirection: "row",
    borderRadius: 4,
    overflow: "hidden",
    alignItems: "center",
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    flex: 1,
    justifyContent: "center",
    textAlign: "center",
    color: "#FFF",
    fontFamily: "Roboto_500Medium",
    fontSize: 16,
  },
});

export default Home;
