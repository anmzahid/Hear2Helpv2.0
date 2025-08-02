import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import socket from '@/utils/api';
import StartStopButton from '@/components/StartStopButton';
import GifDisplay from '@/components/GifDisplay';

export default function HomeScreen() {
  const [gifUrl, setGifUrl] = useState('');

  useEffect(() => {
    socket.on("sound_detected", (data) => {
      // data = { label: "dog_bark", gif: "https://..." }
      setGifUrl(data.gif);
    });

    return () => {
      socket.off("sound_detected");
    };
  }, []);

  return (
    <View style={styles.container}>
      <StartStopButton onSoundDetected={setGifUrl} />
      <GifDisplay gifUrl={gifUrl} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, alignItems: 'center', justifyContent: 'center', gap: 20,
  },
});
