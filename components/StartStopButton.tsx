import React, { useState, useRef } from "react";
import { View, Button, Alert, Image, Text } from "react-native";
import { Audio } from "expo-av";

type StartStopButtonProps = {
  onSoundDetected?: (gifUrl: string, label: string) => void;
};

const SERVER_URL = "http://192.168.0.114:8000/classify-sound";

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
      console.log("Requesting permissions...");
      const permission = await Audio.requestPermissionsAsync();
      if (!permission.granted) {
        Alert.alert("Permission to access microphone is required!");
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      console.log("Starting recording...");
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      recordingRef.current = recording;
      console.log("Recording started...");
    } catch (err) {
      console.error("Failed to start recording:", err);
    }
  };

  const stopRecording = async () => {
    console.log("Stopping recording...");
    if (!recordingRef.current) return;

    try {
      await recordingRef.current.stopAndUnloadAsync();
      const uri = recordingRef.current.getURI();
      console.log("Recording stopped, file saved at:", uri);

      if (uri) {
        await sendAudioToAPI(uri);
      }
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

      const response = await fetch(SERVER_URL, {
        method: "POST",
        body: formData,
      });

      const rawText = await response.text();

      if (!response.ok) {
        console.error("API error, status:", response.status);
        return;
      }

      let data;
      try {
        data = JSON.parse(rawText);
      } catch (parseErr) {
        console.error("Failed to parse JSON:", parseErr);
        return;
      }

      if (data.label) {
        setDetectedLabel(data.label);

        // Map label to local gif or use unknown gif if not matched
        const gif = gifMap[data.label] || gifMap["unknown"];
        setDetectedGif(gif);
      } else {
        setDetectedLabel(null);
        setDetectedGif(null);
      }
    } catch (err) {
      console.error("Error sending audio:", err);
    }
  };

  const loopRecording = async () => {
    while (isLoopingRef.current) {
      await startRecording();
      await new Promise((resolve) => setTimeout(resolve, 3000)); // record 3 seconds
      await stopRecording();
    }
  };

  const handleStartStop = async () => {
    if (isRecording) {
      isLoopingRef.current = false;
      setIsRecording(false);
      console.log("Stopped continuous recording.");
    } else {
      isLoopingRef.current = true;
      setIsRecording(true);
      loopRecording();
      console.log("Started continuous recording.");
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
