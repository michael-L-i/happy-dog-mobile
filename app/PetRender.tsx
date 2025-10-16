// PetRender.tsx
import React, { useEffect, useState } from "react";
import { Image, StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming
} from "react-native-reanimated";
import Svg, { Ellipse } from "react-native-svg";
import Heart from "./Hearts";
import images from "./PetImages";

type Props = {
  breed: number;
  goodies_on: { [slot: string]: number };
  animation: string; // e.g. "happy", "eating"
  shadow_color: string;
  foodImage?: any; // optional custom food image
};

const scalingFactor = 1;

// Define positions relative to 250x300 box
const goodiePositions: { [slot: string]: { top: number; left: number; size: number; zIndex: number } } = {
  slot1: { top: 39*scalingFactor, left: 10*scalingFactor, size: 150*scalingFactor, zIndex: 12 }, // glasses / mask
  slot2: { top: 0, left: 0, size: 150*scalingFactor, zIndex: 11 }, // hat
  slot3: { top: 150*scalingFactor, left: -62.5*scalingFactor, size: 150*scalingFactor, zIndex: 13 }, // decor
  slot4: { top: 125*scalingFactor, left: 18.75*scalingFactor, size: 150*scalingFactor, zIndex: 9 }, // collar
  slot5: { top: 106*scalingFactor, left: 42*scalingFactor, size: 150*scalingFactor, zIndex: 8 }, // shoes / misc
};  

// Map of food keys to images
const foodImages: Record<string, any> = {
  // pizza: require("../images/food-pizza.png"),
  // bone: require("../images/food-bone.png"),
  // fish: require("../images/food-fish.png"),
  default: require("../images/food-default.png"),
};

const PetRender: React.FC<Props> = ({ breed, goodies_on, animation, shadow_color, foodImage = "default" }) => {
  
  const breedKey = `breed${breed}`;

  const [bodyFrames, setBodyFrames] = useState([
    images[breedKey].body.normal2,
    images[breedKey].body.normal3,
  ]);

  const [frameIndex, setFrameIndex] = useState(0);

  const [headImage, setHeadImage] = useState(images[breedKey].head[1]);

  // pick the correct food image
  const selectedFood = foodImages[foodImage] || foodImages["default"];

  // Body frame cycling
  useEffect(() => {
    // Update body frames based on animation
    if (animation === "sleeping") {
      setBodyFrames([images[breedKey].body.sleep1, images[breedKey].body.sleep2, images[breedKey].body.sleep3]);
    } else {
      setBodyFrames([images[breedKey].body.normal2, images[breedKey].body.normal3]);
    }
  
    // Reset frame index when animation changes
    setFrameIndex(0);
  
    // Set frame duration based on animation type
    let frameDuration = 100; // default 0.1s
    if (animation === "happy") frameDuration = 70;
    else if (animation === "eating") frameDuration = 150;
    else if (animation === "sleeping") frameDuration = 700;
  
    const interval = setInterval(() => {
      setFrameIndex((prev) => (prev + 1) % bodyFrames.length);
    }, frameDuration);
  
    return () => clearInterval(interval);
  }, [animation, breedKey, bodyFrames.length]);
  
  // Head animation
  const headTranslateX = useSharedValue(0); 
  const headTranslateY = useSharedValue(0);
  const headRotate = useSharedValue(0);

  useEffect(() => {
    if (animation === "happy") {
    //   headTranslateY.value = withRepeat(withTiming(-5, { duration: 600 }), -1, true);
    //   headRotate.value = withRepeat(withTiming(10, { duration: 800 }), -1, true);
        headTranslateY.value = 0;
        headTranslateX.value = 0;
        headRotate.value = withRepeat(
            withSequence(
                withTiming(-15, { duration: 300 }), 
                withTiming(-5, { duration: 300 }), 
            ), -1, true );
        setHeadImage(images[breedKey].head[3]);
    } else if (animation === "eating") {
        headTranslateX.value = -5;
        headTranslateY.value = withRepeat(
            withSequence(
                withTiming(40, { duration: 100 }), // go up
                withTiming(50, { duration: 100 }), // go down
            ), -1, true );
        headRotate.value = 13;
        setHeadImage(images[breedKey].head[2]);           
    } 
    else if (animation === "playingToy") {
        headTranslateX.value = -5;
        headTranslateY.value = 40;
        headRotate.value = withRepeat(
            withSequence(
                withTiming(5, { duration: 100 }), 
                withTiming(20, { duration: 100 }), 
            ), -1, true );
        setHeadImage(images[breedKey].head[5]);
    } 
    else if (animation === "havingTreat") {
        headTranslateX.value = 0;
        headTranslateY.value = 0;
        headRotate.value = withRepeat(
            withSequence(
                withTiming(-15, { duration: 300 }), 
                withTiming(-5, { duration: 300 }), 
            ), -1, true );
        setHeadImage(images[breedKey].head[4]);
    } 
    else if (animation === "sleeping"){
      headTranslateY.value = 80;
      headTranslateX.value = -10;
      headRotate.value = 65;
      setHeadImage(images[breedKey].head[2]);
    }
    
    else {
        headTranslateY.value = 0;
        headTranslateX.value = 0;
        headRotate.value = -15;
        setHeadImage(images[breedKey].head[1]);
    }
  }, [animation]);

  const headStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: headTranslateY.value },
      { translateX: headTranslateX.value },
      { rotate: `${headRotate.value}deg` },
    ],
  }));

  useEffect(() => {
    // Random head "blink" effect
    const blinkInterval = setInterval(() => {
      if (animation === "idle") {
      // 10% chance every interval
      if (Math.random() < 0.3) {
        const original = images[breedKey].head[1]; // main head image
        const randomHead = images[breedKey].head[2];
        
        setHeadImage(randomHead);

        // revert after 0.5s
        setTimeout(() => {
          setHeadImage(original);
        }, 300);
      }
    }
    }, 500); // check every 0.5s

    return () => clearInterval(blinkInterval);
  }, [breedKey, animation]);

  // Function to get animation for goodies
  const getGoodieStyle = (slotKey: string) => {
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const rotate = useSharedValue(0);
    useEffect(() => {
        if (animation === "eating") {
            if (slotKey === "slot1") {
                translateX.value = -2;
                translateY.value = withRepeat(
                    withSequence(
                      withTiming(40, { duration: 100 }), // move up
                      withTiming(45, { duration: 100 })  // move back down
                    ),
                    -1, true
                );
                rotate.value = 28;
            }
            if (slotKey === "slot2") {
                translateX.value = 15;
                translateY.value = withRepeat(
                    withSequence(
                      withTiming(40, { duration: 100 }), // move up
                      withTiming(45, { duration: 100 })  // move back down
                    ),
                    -1, true
                );
                rotate.value = 28;
            }
        }
        else if (animation === "playingToy") {
            if (slotKey === "slot1") {
                translateX.value = -2;
                translateY.value = 40;
                rotate.value = withRepeat(
                    withSequence(
                        withTiming(20, { duration: 100 }), 
                        withTiming(35, { duration: 100 }), 
                    ), -1, true );
            }
            if (slotKey === "slot2") {
                translateX.value = 15;
                translateY.value = 40;
                rotate.value = withRepeat(
                    withSequence(
                        withTiming(20, { duration: 100 }), 
                        withTiming(35, { duration: 100 }), 
                    ), -1, true );
            }
        }
        else if (animation === "havingTreat") {
            if (slotKey === "slot1") {
                translateX.value = 0;
                translateY.value = 0;
                rotate.value = withRepeat(
                    withSequence(
                        withTiming(0, { duration: 300 }), 
                        withTiming(10, { duration: 300 }), 
                    ), -1, true );
            }
            if (slotKey === "slot2") {
                translateX.value = 0;
                translateY.value = 0;
                rotate.value = withRepeat(
                    withSequence(
                        withTiming(0, { duration: 300 }), 
                        withTiming(5, { duration: 300 }), 
                    ), -1, true );
            }
        }
        else if (animation === "happy") {
            if (slotKey === "slot1") {
                translateX.value = 0;
                translateY.value = 0;
                rotate.value = withRepeat(
                    withSequence(
                        withTiming(0, { duration: 300 }), 
                        withTiming(10, { duration: 300 }), 
                    ), -1, true );
            }
            if (slotKey === "slot2") {
                translateX.value = 0;
                translateY.value = 0;
                rotate.value = withRepeat(
                    withSequence(
                        withTiming(0, { duration: 300 }), 
                        withTiming(5, { duration: 300 }), 
                    ), -1, true );
            }
        }
        else { // default positions
            translateX.value = 0;
            translateY.value = 0;
            rotate.value = 0;
        }
    }, [animation]);

    return useAnimatedStyle(() => ({
      transform: [
        { translateY: translateY.value },
        { translateX: translateX.value },
        { rotate: `${rotate.value}deg` },
      ],
    }));
  };

  // Render goodies
  const renderGoodies = () => {
    return Object.keys(goodies_on).map((slotKey) => {
      const goodieId = goodies_on[slotKey];
      if (!goodieId) return null;
      
      const pos = goodiePositions[slotKey] || { top: 0, left: 0, size: 80 };
      const style = getGoodieStyle(slotKey);

      // Conditionally skip rendering
    if (animation === "sleeping") return null;

      return (
        <Animated.Image
          key={slotKey}
          source={{
            uri: `https://storage.googleapis.com/office-pets/goodies/${goodieId}.png`,
          }}
          style={[
            {
              position: "absolute",
              width: pos.size,
              height: pos.size,
              top: pos.top,
              left: pos.left,
              zIndex: pos.zIndex,
            },
            style,
          ]}
          resizeMode="contain"
        />
      );
    });
  };

  const [hearts, setHearts] = useState<{ id: number; startX: number; startY: number; }[]>([]);

  // 💖 Spawn hearts automatically when pet is "happy"
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (animation === "happy") {
      interval = setInterval(() => {
        const id = Date.now() + Math.random();
        setHearts((prev) => [...prev, { 
            id,
            startX: Math.floor(Math.random() * 150 - 50), 
            startY: Math.floor(Math.random() * 120 - 40),
        }]);
      }, 100); // one heart every 0.3s
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [animation]);

  return (
    <View style={styles.container}>
        {/* Ellipse Shadow */}
        <Svg
          height={90}   // total height
          width={250}   // total width
          style={{ position: "absolute", bottom: 15 }}
        >
          <Ellipse
            cx={115}   // center x
            cy={45}    // center y
            rx={100}    // horizontal radius
            ry={45}    // vertical radius
            fill={shadow_color}
          />
        </Svg>

      {/* Body (fixed 250x300) */}
      <Image
        source={bodyFrames[frameIndex]}
        style={styles.body}
        resizeMode="contain"
      />

      {/* Head (on top of body) */}
      <Animated.Image
        source={headImage}
        style={[styles.head, headStyle]}
        resizeMode="contain"
      />

      {/* Goodies */}
      {renderGoodies()}

      {animation === "eating" && (
        <Image
          source={selectedFood}
          style={{
            position: "absolute",
            bottom: -20,
            left: 0,
            width: 150,
            height: 150,
            alignSelf: "center",
            zIndex: 9
          }}
          resizeMode="contain"
        />
      )}

      <View style={styles.heartContainer}>
        {hearts.map((heart) => (
          <Heart
          key={heart.id}
          id={heart.id}
          startX={heart.startX}
          startY={heart.startY}
          onComplete={() => {
            setHearts((prev) => prev.filter((h) => h.id !== heart.id));
          }}
        />
        ))}
      </View>
    </View>
  );
};

export default PetRender;

const styles = StyleSheet.create({
  container: {
    width: 250*scalingFactor,
    height: 300*scalingFactor,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    margin: 10,
  },
  body: {
    width: 250*scalingFactor,
    height: 300*scalingFactor,
    position: "absolute",
  },
  head: {
    width: 200*scalingFactor,
    height: 200*scalingFactor,
    position: "absolute",
    top: 21*scalingFactor,
    left: -12.5*scalingFactor,
    zIndex: 10
  },
  heartContainer: {
    position: "absolute",
    left: 80,
    alignItems: "center",
  },
});
