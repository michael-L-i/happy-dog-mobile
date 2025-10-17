import React, { useState, useEffect } from "react";
import { Button, StyleSheet, Text, View, ActivityIndicator, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import PetRender from "./PetRender";
import { ApiService, PetState } from "@/services/api";
import { StorageService } from "@/services/storage";

export default function Home() {
  const router = useRouter();
  const [animation, setAnimation] = useState<"idle" | "happy" | "eating" | "playingToy" | "havingTreat" | "sleeping">("idle");
  const [petState, setPetState] = useState<PetState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPetState();
  }, []);

  // Auto-reset animations after 5 seconds (matching main.js timing)
  useEffect(() => {
    if (animation === "happy" || animation === "eating" || animation === "playingToy" || animation === "havingTreat") {
      const timer = setTimeout(() => {
        setAnimation("idle");
      }, 4000);
      
      return () => clearTimeout(timer);
    }
  }, [animation]);

  const loadPetState = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Get session and pet info from storage
      const session = StorageService.getSession();
      const pet = StorageService.getPet();

      if (!session || !pet) {
        console.log("No session or pet found, redirecting to index...");
        router.replace("/" as any);
        return;
      }

      console.log("Loading pet state for:", { pet: pet.name, space: session.space });

      // Fetch pet state from API
      const state = await ApiService.getState(pet.name, session.space);

      if (!state) {
        setError("Pet not found");
        return;
      }

      console.log("Pet state loaded:", state);
      setPetState(state);

      // Automatically set animation based on energy level
      if (state.state_energy < 5) {
        setAnimation("sleeping");
      } else {
        setAnimation("idle");
      }
    } catch (err) {
      console.error("Error loading pet state:", err);
      setError("Failed to load pet");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLeaveState = () => {
    StorageService.clearSession();
    StorageService.clearPet();
    setPetState(null);
    setAnimation("idle");
    router.replace("/" as any);
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#FF6499" />
        <Text style={styles.loadingText}>Loading your pet...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
        <Button title="Retry" onPress={loadPetState} />
      </View>
    );
  }

  if (!petState) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No pet found</Text>
        <Button title="Go Back" onPress={() => router.replace("/" as any)} />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <TouchableOpacity style={styles.backArrow} onPress={handleLeaveState}>
        <Text style={styles.backArrowText}>←</Text>
      </TouchableOpacity>
      
      <View style={styles.container}>
        <Text style={styles.title}>{petState.pet}</Text>
        <Text style={styles.subtitle}>Space: {petState.space}</Text>

        {/* Stats Display */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>💚 Mood</Text>
            <Text style={styles.statValue}>{petState.state_mood}/100</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>🍖 Stomach</Text>
            <Text style={styles.statValue}>{petState.state_stomach}/100</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>⚡ Energy</Text>
            <Text style={styles.statValue}>{petState.state_energy}/100</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>❤️ Health</Text>
            <Text style={styles.statValue}>{petState.state_health}/100</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>🪙 Coins</Text>
            <Text style={styles.statValue}>{petState.coin || 0}</Text>
          </View>
        </View>

        <View style={styles.petSection}>
          {/* ✅ Render Pet */}
          <View style={styles.petWrapper}>
            <PetRender
              breed={petState.breed}
              goodies_on={{
                slot1: 0, 
                slot2: 0, 
                slot3: 0,   
                slot4: 0,
                slot5: 0,
              }}
              animation={animation}
              shadow_color="#E0E0E0"
            />
          </View>

          {/* ✅ Buttons to change animation */}
          <View style={{ flexDirection: "row", justifyContent: "space-around", marginBottom: 40, flexWrap: "wrap" }}>
            <Button title="Idle" onPress={() => setAnimation("idle")} />
            <Button title="Happy" onPress={() => setAnimation("happy")} />
            <Button title="Eating" onPress={() => setAnimation("eating")} />
            <Button title="Toy" onPress={() => setAnimation("playingToy")} />
            <Button title="Treat" onPress={() => setAnimation("havingTreat")} />
            <Button title="Sleep" onPress={() => setAnimation("sleeping")} />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: "#fff",
  },
  backArrow: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 10,
    padding: 10,
  },
  backArrowText: {
    fontSize: 32,
    color: "#2B1B5A",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2B1B5A",
    marginTop: 20,
  },
  subtitle: {
    fontSize: 16,
    marginTop: 4,
    color: "#666",
    marginBottom: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
  petSection: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 32,
  },
  petWrapper: {
    alignItems: "center",
    justifyContent: "center",
    transform: [{ scale: 0.85 }],
  },
  errorText: {
    fontSize: 18,
    color: "#D32F2F",
    marginBottom: 20,
    textAlign: "center",
  },
  statsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    maxWidth: 500,
    marginBottom: 20,
    backgroundColor: "#F8F6FF",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  statItem: {
    alignItems: "center",
    margin: 8,
    minWidth: 80,
  },
  statLabel: {
    fontSize: 14,
    color: "#4B3A73",
    marginBottom: 4,
    fontWeight: "600",
  },
  statValue: {
    fontSize: 16,
    color: "#2B1B5A",
    fontWeight: "bold",
  },
});
