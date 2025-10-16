import React, { useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import PetRender from "./PetRender";

export default function Home() {
  const [animation, setAnimation] = useState<"idle" | "happy" | "eating" | "playingToy" | "havingTreat" | "sleeping">("idle");

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home View</Text>
      <Text style={styles.subtitle}>(Main big one)</Text>
      <View style={{ flex: 1 }}>
        {/* ✅ Render Pet */}
        <PetRender
          breed={7}
          goodies_on={{
            slot1: 421, 
            slot2: 17, 
            slot3: 0,   
            slot4: 347,
            slot5: 371,
          }}
          animation={animation}
          shadow_color="#E0E0E0"
        />

        {/* ✅ Buttons to change animation */}
        <View style={{ flexDirection: "row", justifyContent: "space-around", marginBottom: 40 }}>
          <Button title="Idle" onPress={() => setAnimation("idle")} />
          <Button title="Happy" onPress={() => setAnimation("happy")} />
          <Button title="Eating" onPress={() => setAnimation("eating")} />
          <Button title="Toy" onPress={() => setAnimation("playingToy")} />
          <Button title="Treat" onPress={() => setAnimation("havingTreat")} />
          <Button title="Sleep" onPress={() => setAnimation("sleeping")} />
        </View>
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
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 16,
    marginTop: 8,
    color: "#666",
  },
});
