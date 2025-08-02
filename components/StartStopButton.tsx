import { Button } from 'react-native';
import { Audio } from 'expo-av';
import { useState } from 'react';
import socket from '@/utils/api';

interface StartStopButtonProps {
  onSoundDetected: (sound: any) => void;
}

export default function StartStopButton({ onSoundDetected }: StartStopButtonProps) {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);

  const startRecording = async () => {
    try {
      const { granted } = await Audio.requestPermissionsAsync();
      if (!granted) return;

      await Audio.setAudioModeAsync({ allowsRecordingIOS: true });
      const rec = new Audio.Recording();
      await rec.prepareToRecordAsync(Audio.RecordingOptionsPresets.HighQuality);
      await rec.startAsync();
      setRecording(rec);

      // Send audio periodically to backend (optional enhancement)
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  };

  const stopRecording = async () => {
    try {
      if (!recording) return;
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();

      // send the recorded file to backend (REST or WebSocket)
      const fileBlob = await fetch(uri!).then(res => res.blob());
      socket.emit("audio", fileBlob);

      recording.setOnRecordingStatusUpdate(null);
      setRecording(null);
    } catch (err) {
      console.error("Failed to stop recording", err);
    }
  };

  return (
    <Button
      title={recording ? "Stop Listening" : "Start Listening"}
      onPress={recording ? stopRecording : startRecording}
    />
  );
}
