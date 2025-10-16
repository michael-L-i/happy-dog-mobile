// Hearts.tsx
import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import Animated, {
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from "react-native-reanimated";

type HeartProps = {
  id: number;
  startX: number;
  startY: number;
  onComplete: () => void;
};

const Heart: React.FC<HeartProps> = ({ id, startX, startY, onComplete }) => {
  const translateY = useSharedValue(startY);
  const opacity = useSharedValue(1);
  const scale = useSharedValue(0.5);
  const translateX = useSharedValue(startX);
  const rotate = useSharedValue(0);

  useEffect(() => {
    // random drift sideways
    translateX.value = withTiming(startX + (Math.random() * 60 - 30), { duration: 1500 });
    // upward float
    translateY.value = withTiming(startY - 150, { duration: 1500 });
    // fade out
    opacity.value = withTiming(0, { duration: 1500 });
    // pop scale
    scale.value = withSpring(1, { damping: 3, stiffness: 200 }, () => {
      runOnJS(onComplete)();
    });
    // random spin
    rotate.value = Math.random() * 20 - 10;
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
      { rotate: `${rotate.value}deg` },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.Image
      source={require("../images/heart.png")}
      style={[styles.heart, style]}
      resizeMode="contain"
    />
  );
};

const styles = StyleSheet.create({
  heart: {
    position: "absolute",
    width: 40,
    height: 40,
    zIndex: 20,
  },
});

export default Heart;
