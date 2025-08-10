import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const SOCKET_SERVER_URL = "http://192.168.0.114:8000"; // your PC's IP and port

export function useSocket() {
  const [soundData, setSoundData] = useState<{ label: string; gif: string } | null>(null);

  useEffect(() => {
    const socket = io(SOCKET_SERVER_URL, {
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      console.log("Socket connected");
    });

    socket.on("sound_detected", (data) => {
      console.log("Received sound_detected:", data);
      setSoundData(data);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return soundData;
}
