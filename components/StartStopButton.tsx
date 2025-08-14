import React, { useState, useRef } from "react";
import { View, Button, Alert, Image, Text } from "react-native";
import { Audio } from "expo-av";
import { SOCKET_URL ,API_URL} from "@env"


type StartStopButtonProps = {
  onSoundDetected?: (gifUrl: string, label: string) => void;
};

export default function StartStopButton({ onSoundDetected }: StartStopButtonProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [detectedLabel, setDetectedLabel] = useState<string | null>(null);
  const [detectedGif, setDetectedGif] = useState<any>(null);
  const recordingRef = useRef<Audio.Recording | null>(null);
  const isLoopingRef = useRef(false);

  const gifMap: Record<string, any> = {
    music: require("../assets/gifs/music.gif"),
    applause: require("../assets/gifs/applause.gif"),
    dog_bark: require("../assets/gifs/dog_bark.gif"),
    unknown: require("../assets/gifs/unknown.gif"),
  };

  const startRecording = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (!permission.granted) {
        Alert.alert("Permission to access microphone is required!");
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      recordingRef.current = recording;
    } catch (err) {
      console.error("Failed to start recording:", err);
    }
  };

  const stopRecording = async () => {
    if (!recordingRef.current) return;

    try {
      await recordingRef.current.stopAndUnloadAsync();
      const uri = recordingRef.current.getURI();
      if (uri) await sendAudioToAPI(uri);
    } catch (err) {
      console.error("Failed to stop recording:", err);
    }
  };

  const sendAudioToAPI = async (uri: string) => {
    try {
      const formData = new FormData();
      formData.append("file", {
        uri,
        name: "recording.m4a",
        type: "audio/m4a",
      } as any);

      const response = await fetch(`${API_URL}/classify-sound`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        console.error("API error, status:", response.status);
        return;
      }

      const data = await response.json();

      if (data.label) {
        setDetectedLabel(data.label);
        const gif = gifMap[data.label] || gifMap["unknown"];
        setDetectedGif(gif);
        onSoundDetected?.(gif, data.label);
      }
    } catch (err) {
      console.error("Error sending audio:", err);
    }
  };

  const loopRecording = async () => {
    while (isLoopingRef.current) {
      await startRecording();
      await new Promise((resolve) => setTimeout(resolve, 3000));
      await stopRecording();
    }
  };

  const handleStartStop = async () => {
    if (isRecording) {
      isLoopingRef.current = false;
      setIsRecording(false);
    } else {
      isLoopingRef.current = true;
      setIsRecording(true);
      loopRecording();
    }
  };

  return (
    <View style={{ margin: 20, alignItems: "center" }}>
      <Button
        title={isRecording ? "Stop" : "Start"}
        onPress={handleStartStop}
        color={isRecording ? "red" : "green"}
      />
      <View style={{ marginTop: 20, alignItems: "center" }}>
        {detectedLabel ? (
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>
            Detected Sound: {detectedLabel}
          </Text>
        ) : (
          <Text>No sound detected yet</Text>
        )}
        {detectedGif && (
          <Image
            source={detectedGif}
            style={{ width: 200, height: 200, resizeMode: "contain", marginTop: 10 }}
          />
        )}
      </View>
    </View>
  );
}
