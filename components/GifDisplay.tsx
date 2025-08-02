import { Image, Vibration } from 'react-native';
import { useEffect } from 'react';

export default function GifDisplay({ gifUrl }: { gifUrl: string }) {
  useEffect(() => {
    if (gifUrl) Vibration.vibrate();
  }, [gifUrl]);

  return (
    gifUrl ? <Image source={{ uri: gifUrl }} style={{ width: 200, height: 200 }} /> : null
  );
}
