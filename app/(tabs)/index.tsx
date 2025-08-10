import React from "react";
import { View, Text, Image } from "react-native";
import StartStopButton from "@/components/StartStopButton";
import { useSocket } from "@/hooks/useSocket";

export default function App() {
  const soundData = useSocket();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
      <StartStopButton
        onSoundDetected={(gifUrl: string, label: string) => {
          console.log("Sound detected callback:", label, gifUrl);
        }}
      />

      {soundData ? (
        <>
          <Text style={{ fontSize: 18, marginTop: 20 }}>Detected Sound: {soundData.label}</Text>
          <Image
            source={{ uri: soundData.gif }}
            style={{ width: 200, height: 200, marginTop: 10 }}
            resizeMode="contain"
          />
        </>
      ) : (
        <Text style={{ marginTop: 20 }}>No sound detected yet</Text>
      )}
    </View>
  );
}
