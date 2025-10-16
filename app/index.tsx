import { useRouter } from "expo-router";
import { Image, Linking, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Landing() {
  const router = useRouter();

  const handleGetNewDog = () => {
    // Navigate to adoption/creation flow
    router.push("/creation-1" as any);
  };

  const handleExistingDog = () => {
    router.push("/creation-2" as any);
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
});