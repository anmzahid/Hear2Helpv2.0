import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { SOCKET_URL } from "@env";

export function useSocket() {
  const [soundData, setSoundData] = useState<{ label: string; gif: string } | null>(null);

  useEffect(() => {
    const socket = io(SOCKET_URL, {
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
    });

    socket.on("connect", () => console.log("Socket connected"));

    socket.on("sound_detected", (data) => {
      console.log("Received sound_detected:", data);
      setSoundData(data);
    });

    socket.on("disconnect", () => console.log("Socket disconnected"));

    return () => {
      socket.disconnect();
    };
  }, []);

  return soundData;
}
