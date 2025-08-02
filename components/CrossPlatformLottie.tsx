import React from 'react';
import { Platform, StyleProp, ViewStyle } from 'react-native';

type CrossPlatformLottieProps = {
  source: any; // JSON or require(...)
  autoPlay?: boolean;
  loop?: boolean;
  style?: StyleProp<ViewStyle>;
  onAnimationFinish?: () => void;
};

let LottieNative: React.ComponentType<any> | null = null;
let LottieWeb: React.ComponentType<any> | null = null;

if (Platform.OS === 'web') {
  // @ts-ignore
  LottieWeb = require('@lottiefiles/dotlottie-react').default;
} else {
  // @ts-ignore
  LottieNative = require('lottie-react-native').default;
}

export default function CrossPlatformLottie(props: CrossPlatformLottieProps) {
  if (Platform.OS === 'web') {
    if (!LottieWeb) return null;

    // Map props for web: 'animationData' instead of 'source', and 'autoplay' instead of 'autoPlay'
    return (
      <LottieWeb
        animationData={props.source}
        autoplay={props.autoPlay ?? true}
        loop={props.loop ?? false}
        style={props.style}
        onComplete={props.onAnimationFinish}
      />
    );
  } else {
    if (!LottieNative) return null;

    // Native uses 'source' and 'autoPlay'
    return (
      <LottieNative
        source={props.source}
        autoPlay={props.autoPlay ?? true}
        loop={props.loop ?? false}
        style={props.style}
        onAnimationFinish={props.onAnimationFinish}
      />
    );
  }
}
