import { View, Text, StyleSheet, TouchableOpacity, Image, Modal, TextInput, Linking } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";

export default function Landing() {
  const router = useRouter();
  const [showExistingDogModal, setShowExistingDogModal] = useState(false);
  const [spaceName, setSpaceName] = useState("");
  const [nickname, setNickname] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleGetNewDog = () => {
    // Navigate to adoption/creation flow
    router.push("/creation-1" as any);
  };

  const handleExistingDog = () => {
    setShowExistingDogModal(true);
  };

  const handleEnterSpace = async () => {
    if (!spaceName.trim() || !nickname.trim()) {
      setErrorMessage("Please fill in all fields");
      return;
    }

    // TODO: Implement API call to check if space exists
    // For now, just navigate to home
    setErrorMessage("");
    setShowExistingDogModal(false);
    router.push("/home" as any);
  };

  const openTerms = () => {
    Linking.openURL("https://app.termly.io/policy-viewer/policy.html?policyUUID=2badbde0-9daf-4e2e-8c74-48d7089d328e");
  };

  const openPrivacy = () => {
    Linking.openURL("https://app.termly.io/policy-viewer/policy.html?policyUUID=ec72c4d2-7093-45f3-b091-0caac8fa419d");
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image 
          source={require("@/assets/general/logo_transparent_bg.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.primaryButton}
          onPress={handleGetNewDog}
        >
          <Text style={styles.buttonText}>Get a new dog</Text>
        </TouchableOpacity>

        <Text style={styles.orText}>or</Text>

        <TouchableOpacity 
          style={styles.primaryButton}
          onPress={handleExistingDog}
        >
          <Text style={styles.buttonText}>Take care of an existing dog</Text>
        </TouchableOpacity>

        <Text style={styles.subText}>By entering an existing space</Text>
      </View>

      <View style={styles.termsContainer}>
        <Text style={styles.termsText}>
          By continuing you confirm that you are over 13 and agree to our{" "}
          <Text style={styles.link} onPress={openTerms}>Terms of Use</Text>
          {" "}and{" "}
          <Text style={styles.link} onPress={openPrivacy}>Privacy Policies</Text>
        </Text>
      </View>

      {/* Existing Dog Modal */}
      <Modal
        visible={showExistingDogModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowExistingDogModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => {
                setShowExistingDogModal(false);
                setErrorMessage("");
                setSpaceName("");
                setNickname("");
              }}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>

            <Text style={styles.modalTitle}>Take care of an existing dog</Text>

            <Text style={styles.inputLabel}>What's the name of the space the dog is in?</Text>
            <TextInput
              style={styles.input}
              placeholder="Space name"
              value={spaceName}
              onChangeText={setSpaceName}
              autoCapitalize="none"
            />

            {errorMessage ? (
              <Text style={styles.errorText}>{errorMessage}</Text>
            ) : null}

            <Text style={styles.inputLabel}>What's your nickname?</Text>
            <TextInput
              style={styles.input}
              placeholder="Your nickname"
              value={nickname}
              onChangeText={setNickname}
            />

            <TouchableOpacity 
              style={styles.submitButton}
              onPress={handleEnterSpace}
            >
              <Text style={styles.buttonText}>Enter space</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  logoContainer: {
    marginBottom: 60,
    alignItems: "center",
  },
  logo: {
    width: 120,
    height: 120,
  },
  buttonContainer: {
    width: "100%",
    maxWidth: 300,
    alignItems: "center",
  },
  primaryButton: {
    backgroundColor: "#967ADA",
    padding: 16,
    borderRadius: 24,
    alignItems: "center",
    width: "100%",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  orText: {
    fontSize: 16,
    marginVertical: 20,
    color: "#666",
  },
  subText: {
    fontSize: 14,
    marginTop: 8,
    color: "#666",
  },
  termsContainer: {
    position: "absolute",
    bottom: 40,
    paddingHorizontal: 20,
    width: "100%",
  },
  termsText: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
    lineHeight: 18,
  },
  link: {
    color: "#967ADA",
    textDecorationLine: "underline",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#C8B9F2",
    borderRadius: 20,
    padding: 30,
    width: "85%",
    maxWidth: 400,
  },
  closeButton: {
    position: "absolute",
    top: 20,
    right: 20,
    width: 40,
    height: 40,
    backgroundColor: "#FF9ABD",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
    color: "#333",
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    marginTop: 12,
    color: "#333",
  },
  input: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  errorText: {
    color: "#D32F2F",
    fontSize: 14,
    marginTop: 8,
    fontWeight: "600",
  },
  submitButton: {
    backgroundColor: "#FF6499",
    padding: 16,
    borderRadius: 24,
    alignItems: "center",
    marginTop: 24,
  },
});
