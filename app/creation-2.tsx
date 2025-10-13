import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";

export default function Creation2() {
  const router = useRouter();
  const [spaceName, setSpaceName] = useState("");
  const [nickname, setNickname] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [recentSpaces, setRecentSpaces] = useState<string[]>([]);

  const handleEnterSpace = async () => {
    if (!spaceName.trim()) {
      setErrorMessage("Please enter a space name");
      return;
    }

    if (!nickname.trim()) {
      setErrorMessage("Please enter your nickname");
      return;
    }

    // TODO: Implement API call to check if space exists and get pets
    // For now, just navigate to home
    try {
      // const response = await getPets(spaceName);
      // const pets = await response.json();

      // if (pets.length > 0) {
      //   await setSessionAndPet(spaceName, nickname, pets[0].name, pets[0].breed);
      //   router.push("/home" as any);
      // } else {
      //   setErrorMessage("The space does not exist");
      // }

      // Temporary: just navigate to home
      setErrorMessage("");
      router.push("/home" as any);
    } catch (err) {
      console.error(err);
      setErrorMessage("Failed to enter space. Please try again.");
    }
  };

  const handleSelectRecentSpace = (space: string) => {
    setSpaceName(space);
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
          <Text style={styles.title}>Take care of an existing dog</Text>
          <Text style={styles.subtitle}>
            Jump back into your shared space and pick up where you left off with your pup.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Space details</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>What's the name of the space the dog is in?</Text>
            <TextInput
              style={styles.input}
              placeholder="Space name"
              value={spaceName}
              onChangeText={(text) => {
                setSpaceName(text);
                setErrorMessage("");
              }}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

          {recentSpaces.length > 0 && (
            <View style={styles.recentSpacesContainer}>
              <Text style={styles.recentSpacesLabel}>Recently visited</Text>
              <View style={styles.recentSpacesList}>
                {recentSpaces.map((space, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => handleSelectRecentSpace(space)}
                    style={styles.recentSpacePill}
                  >
                    <Text style={styles.recentSpaceText}>{space}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>What's your nickname?</Text>
            <TextInput
              style={styles.input}
              placeholder="Your nickname"
              value={nickname}
              onChangeText={(text) => {
                setNickname(text);
                setErrorMessage("");
              }}
              autoCapitalize="words"
              autoCorrect={false}
            />
          </View>

          <TouchableOpacity style={styles.primaryButton} onPress={handleEnterSpace}>
            <Text style={styles.primaryButtonText}>Enter space</Text>
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
    paddingVertical: 90,
    alignItems: "center",
    justifyContent: "flex-start",
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
  headerBadge: {
    backgroundColor: "rgba(255, 255, 255, 0.35)",
    color: "#5A3EB6",
    fontSize: 14,
    fontWeight: "600",
    paddingVertical: 6,
    paddingHorizontal: 18,
    borderRadius: 999,
    marginBottom: 16,
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
    backgroundColor: "rgba(255, 255, 255, 0.98)",
    borderRadius: 36,
    paddingVertical: 32,
    paddingHorizontal: 28,
    shadowColor: "#37267A",
    shadowOpacity: 0.16,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 12 },
    elevation: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#4B3A73",
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  inputGroup: {
    marginTop: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
    color: "#3C2A68",
  },
  input: {
    backgroundColor: "#F8F6FF",
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderRadius: 22,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#E2D8FF",
    color: "#37267A",
  },
  errorText: {
    color: "#D32F2F",
    fontSize: 14,
    marginTop: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  recentSpacesContainer: {
    marginTop: 24,
  },
  recentSpacesLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4B3A73",
    marginBottom: 12,
  },
  recentSpacesList: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  recentSpaceText: {
    fontSize: 14,
    color: "#37267A",
    fontWeight: "500",
  },
  recentSpacePill: {
    backgroundColor: "rgba(150, 122, 218, 0.18)",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 999,
    marginRight: 10,
    marginBottom: 10,
  },
  primaryButton: {
    backgroundColor: "#FF6499",
    paddingVertical: 18,
    borderRadius: 999,
    alignItems: "center",
    marginTop: 36,
    shadowColor: "#FF6499",
    shadowOpacity: 0.35,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
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
