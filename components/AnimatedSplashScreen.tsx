import React, { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { View, Image, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  interpolate,
  runOnJS,
} from 'react-native-reanimated';
import * as SplashScreen from 'expo-splash-screen';

const { width, height } = Dimensions.get('window');

export default function AnimatedSplashScreen({ onFinish }: { onFinish: () => void }) {
  const opacity = useSharedValue(1);
  const scale = useSharedValue(1);
  const ripple = useSharedValue(0);

  useEffect(() => {
    const runAnimation = async () => {
      await SplashScreen.preventAutoHideAsync();

      // Start ripple soundwave effect
      ripple.value = withTiming(1, { duration: 1500, easing: Easing.out(Easing.exp) }, () => {
        // Morph into visual icons
        scale.value = withTiming(1.5, { duration: 1000 });
        opacity.value = withTiming(0, { duration: 800 }, (finished) => {
          if (finished) {
            runOnJS(onFinish)();
          }
        });
      });

      if (Platform.OS === 'web') {
        // On Web, force a 2.5s wait to simulate splash loading
        setTimeout(() => {
        onFinish();
    }, 2500);
  }

    };

    runAnimation();
  }, []);

  const logoStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  const rippleStyle = useAnimatedStyle(() => {
    const rippleScale = interpolate(ripple.value, [0, 1], [0.8, 3]);
    const rippleOpacity = interpolate(ripple.value, [0, 1], [0.5, 0]);
    return {
      transform: [{ scale: rippleScale }],
      opacity: rippleOpacity,
    };
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.rippleCircle, rippleStyle]} />
      <Animated.Image
        source={require('@/assets/images/Hear2Help_icon_transparent.png')}
        style={[styles.logo, logoStyle]}
        resizeMode="contain"
      />
      {/* <Animated.Text style={[styles.text, logoStyle]}>Hear2Help</Animated.Text> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: '#003366', alignItems: 'center', justifyContent: 'center',
  },
  logo: {
    width: width * 0.4,
    height: width * 0.4,
  },
  rippleCircle: {
    position: 'absolute',
    width: width * 0.6,
    height: width * 0.6,
    borderRadius: width * 0.3,
    backgroundColor: '#00D4FF',
  },
  text: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 20,
  },
});



// // AnimatedSplashScreen.tsx
// import React, { useState, useEffect } from 'react';
// import { Dimensions, StyleSheet, Platform } from 'react-native';
// import Animated, { FadeOut } from 'react-native-reanimated';
// import * as SplashScreen from 'expo-splash-screen';
// import CrossPlatformLottie from './CrossPlatformLottie'; // Adjust the import path as needed

// const { width } = Dimensions.get('window');

// export default function AnimatedSplashScreen({ onFinish }: { onFinish: () => void }) {
//   const [animationFinished, setAnimationFinished] = useState(false);

//   useEffect(() => {
//     async function prepare() {
//       if (Platform.OS !== 'web') {
//         await SplashScreen.preventAutoHideAsync();
//       }
//     }
//     prepare();
//   }, []);

//   const handleAnimationFinish = () => {
//     setAnimationFinished(true);
//     onFinish();
//   };

//   return (
//     !animationFinished && (
//       <Animated.View style={styles.container} exiting={FadeOut.duration(500)}>
//         <CrossPlatformLottie
//           source={require('@/assets/animations/hear2help_lottie.json')}
//           autoPlay={true}
//           loop={false}
//           onAnimationFinish={handleAnimationFinish}
//           style={styles.lottie}
//         />
//       </Animated.View>
//     )
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#003366',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   lottie: {
//     width: width * 0.6,
//     height: width * 0.6,
//   },
// });