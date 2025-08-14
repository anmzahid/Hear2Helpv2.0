import { io } from "socket.io-client";
import { SOCKET_URL } from "@env"

const socket = io(SOCKET_URL, { transports: ["websocket"] });

export default socket;
