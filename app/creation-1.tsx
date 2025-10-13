import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";

export default function Creation1() {
  const router = useRouter();
  const [pickedIdx, setPickedIdx] = useState(0);
  const [petName, setPetName] = useState("");
  const [nickname, setNickname] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  
  const maxPetIdx = 12;

  const getPetImage = (idx: number) => {
    const petImages = [
      require("@/assets/general/pet_0.png"),
      require("@/assets/general/pet_1.png"),
      require("@/assets/general/pet_2.png"),
      require("@/assets/general/pet_3.png"),
      require("@/assets/general/pet_4.png"),
      require("@/assets/general/pet_5.png"),
      require("@/assets/general/pet_6.png"),
      require("@/assets/general/pet_7.png"),
      require("@/assets/general/pet_8.png"),
      require("@/assets/general/pet_9.png"),
      require("@/assets/general/pet_10.png"),
      require("@/assets/general/pet_11.png"),
      require("@/assets/general/pet_12.png"),
    ];
    return petImages[idx];
  };

  const handleLeftButton = () => {
    setPickedIdx((prev) => (prev > 0 ? prev - 1 : maxPetIdx));
  };

  const handleRightButton = () => {
    setPickedIdx((prev) => (prev < maxPetIdx ? prev + 1 : 0));
  };

  const handleSubmit = async () => {
    if (!petName.trim()) {
      setErrorMessage("Please give your pet a name");
      return;
    }

    if (!nickname.trim()) {
      setErrorMessage("Please enter your nickname");
      return;
    }

    // TODO: Implement API call to create new pet and space
    try {
      // const response = await createPet({
      //   petName,
      //   nickname,
      //   breed: pickedIdx
      // });
      
      // Temporary: just navigate to home
      setErrorMessage("");
      router.push("/home" as any);
    } catch (err) {
      console.error(err);
      setErrorMessage("Failed to create pet. Please try again.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <View pointerEvents="none" style={styles.decorativeBubbleLarge} />
        <View pointerEvents="none" style={styles.decorativeBubbleSmall} />

        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.title}>Adopt a happy dog</Text>
          <Text style={styles.subtitle}>Pick your favorite pup and give them a cosy new home.</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.petPicker}>
            <TouchableOpacity style={styles.petSelectButton} onPress={handleLeftButton}>
              <Text style={styles.petSelectButtonText}>{"<"}</Text>
            </TouchableOpacity>

            <Image source={getPetImage(pickedIdx)} style={styles.petImage} resizeMode="contain" />

            <TouchableOpacity style={styles.petSelectButton} onPress={handleRightButton}>
              <Text style={styles.petSelectButtonText}>{">"}</Text>
            </TouchableOpacity>
          </View>

          <TextInput
            style={styles.input}
            placeholder="Give your pet a name"
            value={petName}
            onChangeText={(text) => {
              setPetName(text);
              setErrorMessage("");
            }}
            autoCapitalize="words"
            autoCorrect={false}
          />

          <TextInput
            style={[styles.input, styles.inputSpaced]}
            placeholder="What's your nickname?"
            value={nickname}
            onChangeText={(text) => {
              setNickname(text);
              setErrorMessage("");
            }}
            autoCapitalize="words"
            autoCorrect={false}
          />

          {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

          <TouchableOpacity style={styles.primaryButton} onPress={handleSubmit}>
            <Text style={styles.primaryButtonText}>Woof! Let's go</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: "#C8B9F2",
  },
  container: {
    flex: 1,
    minHeight: "100%",
    width: "100%",
    backgroundColor: "#C8B9F2",
    paddingHorizontal: 24,
    paddingVertical: 60,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  backButton: {
    position: "absolute",
    top: 70,
    left: 24,
    width: 52,
    height: 52,
    backgroundColor: "#FF9ABD",
    borderRadius: 26,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#FF9ABD",
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
    zIndex: 2,
  },
  backButtonText: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
  },
  header: {
    width: "100%",
    maxWidth: 420,
    alignItems: "center",
    marginBottom: 32,
    paddingTop: 24,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
    color: "#2B1B5A",
    paddingHorizontal: 24,
  },
  subtitle: {
    fontSize: 16,
    color: "#4B3A73",
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 18,
  },
  card: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: "transparent",
    paddingVertical: 24,
    paddingHorizontal: 12,
    alignItems: "stretch",
  },
  petPicker: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 28,
    alignSelf: "center",
    paddingLeft: 12,
  },
  petSelectButton: {
    width: 52,
    height: 52,
    justifyContent: "center",
    alignItems: "center",
  },
  petSelectButtonText: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#FF6499",
  },
  petImage: {
    width: 220,
    height: 220,
    marginHorizontal: 16,
  },
  input: {
    backgroundColor: "#F8F6FF",
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderRadius: 26,
    fontSize: 18,
    borderWidth: 1,
    borderColor: "#E2D8FF",
    color: "#37267A",
    width: "100%",
  },
  inputSpaced: {
    marginTop: 20,
  },
  errorText: {
    color: "#D32F2F",
    fontSize: 14,
    fontWeight: "600",
    marginTop: 16,
    textAlign: "center",
  },
  primaryButton: {
    backgroundColor: "#FF6499",
    paddingVertical: 18,
    borderRadius: 999,
    alignItems: "center",
    marginTop: 32,
    shadowColor: "#FF6499",
    shadowOpacity: 0.35,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
    width: "100%",
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  decorativeBubbleLarge: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "rgba(255, 255, 255, 0.22)",
    top: -40,
    right: -60,
    zIndex: 0,
  },
  decorativeBubbleSmall: {
    position: "absolute",
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "rgba(255, 154, 189, 0.2)",
    bottom: 40,
    left: -50,
    zIndex: 0,
  },
});
