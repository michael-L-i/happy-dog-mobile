import React, { useState, useEffect, useRef } from "react";
import { Button, StyleSheet, Text, View, ActivityIndicator, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import PetRender from "./PetRender";
import StatHearts from "./StatHearts";
import { ApiService, PetState } from "@/services/api";
import { StorageService } from "@/services/storage";

export default function Home() {
  const router = useRouter();
  const [animation, setAnimation] = useState<"idle" | "happy" | "eating" | "playingToy" | "havingTreat" | "sleeping">("idle");
  const [petState, setPetState] = useState<PetState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cachedActions, setCachedActions] = useState<string[]>([]);
  const [isActionLocked, setIsActionLocked] = useState(false);
  const batchUpdateTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    loadPetState();
    
    // Load cached actions from storage
    const savedActions = StorageService.getCachedActions();
    setCachedActions(savedActions);

    // Set up periodic batch update (every 15 seconds)
    batchUpdateTimerRef.current = setInterval(() => {
      const currentActions = StorageService.getCachedActions();
      if (currentActions.length > 0) {
        performBatchUpdateWithActions(currentActions);
      }
    }, 15000);

    return () => {
      // Cleanup: perform final batch update and clear timer
      if (batchUpdateTimerRef.current) {
        clearInterval(batchUpdateTimerRef.current);
      }
      // Perform final batch update with latest actions from storage
      const finalActions = StorageService.getCachedActions();
      if (finalActions.length > 0) {
        performBatchUpdateWithActions(finalActions);
      }
    };
  }, []);

  // Auto-reset animations after 5 seconds (matching main.js timing)
  useEffect(() => {
    if (animation === "happy" || animation === "eating" || animation === "playingToy" || animation === "havingTreat") {
      const timer = setTimeout(() => {
        setAnimation("idle");
        setIsActionLocked(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [animation]);

  // Update storage whenever cached actions change
  useEffect(() => {
    StorageService.setCachedActions(cachedActions);
  }, [cachedActions]);

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

  const performBatchUpdateWithActions = async (actions: string[]) => {
    if (actions.length === 0) {
      return;
    }

    try {
      const session = StorageService.getSession();
      const pet = StorageService.getPet();

      if (!session || !pet) {
        return;
      }

      console.log("Performing batch update with actions:", actions);

      // Call the API to update actions
      const response = await ApiService.batchActionUpdate(
        pet.name,
        session.space,
        session.user,
        actions
      );

      console.log("Batch update response:", response);

      // Update pet state with response
      if (response) {
        setPetState((prevState) => {
          if (!prevState) return prevState;
          return {
            ...prevState,
            ...response,
          };
        });
      }

      // Clear cached actions after successful update
      setCachedActions([]);
      StorageService.setCachedActions([]);
    } catch (err) {
      console.error("Error performing batch update:", err);
    }
  };

  const performBatchUpdate = async () => {
    await performBatchUpdateWithActions(cachedActions);
  };

  const handleAction = (action: "feed" | "toy" | "treat") => {
    if (isActionLocked || !petState) {
      return;
    }

    setIsActionLocked(true);

    const session = StorageService.getSession();
    if (!session) {
      return;
    }

    // Update local state immediately for instant feedback
    const updatedState = { ...petState };
    const now = new Date().toISOString();

    // Update activity arrays
    if (!updatedState.activity) {
      updatedState.activity = [];
      updatedState.time = [];
      updatedState.by_user = [];
    }
    updatedState.activity.unshift(action);
    updatedState.time!.unshift(now);
    updatedState.by_user!.unshift(session.user);

    // Update coin
    updatedState.coin = (updatedState.coin || 0) + 1;

    // Update stats based on action
    switch (action) {
      case "feed":
        // Feed: +50 stomach, -1 energy
        updatedState.state_stomach = Math.min(updatedState.state_stomach + 50, 100);
        updatedState.state_energy = Math.max(updatedState.state_energy - 1, 0);
        setAnimation("eating");
        break;
      case "treat":
        // Treat: +2 stomach, +5 mood, -1 energy
        updatedState.state_stomach = Math.min(updatedState.state_stomach + 2, 100);
        updatedState.state_mood = Math.min(updatedState.state_mood + 5, 100);
        updatedState.state_energy = Math.max(updatedState.state_energy - 1, 0);
        setAnimation("havingTreat");
        break;
      case "toy":
        // Toy: +20 mood, -5 energy
        updatedState.state_mood = Math.min(updatedState.state_mood + 20, 100);
        updatedState.state_energy = Math.max(updatedState.state_energy - 5, 0);
        setAnimation("playingToy");
        break;
    }

    // Update state
    setPetState(updatedState);

    // Add action to cached actions
    setCachedActions([...cachedActions, action]);

    console.log(`Action ${action} performed. Updated state:`, updatedState);
  };

  const handleLeaveState = () => {
    // Perform final batch update before leaving
    performBatchUpdate();
    
    StorageService.clearSession();
    StorageService.clearPet();
    StorageService.setCachedActions([]);
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

        {/* Stats Display */}
        <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 20}}>
          <StatHearts label="Mood" value={petState.state_mood} />
          <StatHearts label="Stomach" value={petState.state_stomach} />
          <StatHearts label="Energy" value={petState.state_energy} />
          <StatHearts label="Health" value={petState.state_health} />
        </View>

        <View style={styles.petSection}>
          {/* ✅ Render Pet */}
          <TouchableOpacity style={styles.petWrapper} onPress={() => setAnimation("happy")} activeOpacity={1}>
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
          </TouchableOpacity>

          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Coins</Text>
            <Text style={styles.statValue}>{petState.coin || 0}</Text>
          </View>

          {/* ✅ Action Buttons */}
          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity
              style={[styles.actionButton, isActionLocked && styles.actionButtonDisabled]}
              onPress={() => handleAction("feed")}
              disabled={isActionLocked}
              activeOpacity={1}
            >
              <Text style={styles.actionButtonText}>Feed</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, isActionLocked && styles.actionButtonDisabled]}
              onPress={() => handleAction("toy")}
              disabled={isActionLocked}
              activeOpacity={1}
            >
              <Text style={styles.actionButtonText}>Toy</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, isActionLocked && styles.actionButtonDisabled]}
              onPress={() => handleAction("treat")}
              disabled={isActionLocked}
              activeOpacity={1}
            >
              <Text style={styles.actionButtonText}>Treat</Text>
            </TouchableOpacity>
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
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 40,
    flexWrap: "wrap",
    width: '100%',
  },
  actionButton: {
    backgroundColor: "#FF6499",
    borderRadius: 30,
    paddingVertical: 15,
    paddingHorizontal: 25,
    margin: 5,
    minWidth: 100,
    alignItems: 'center',
  },
  actionButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  actionButtonDisabled: {
    backgroundColor: "#DBDBDB",
  },
});
