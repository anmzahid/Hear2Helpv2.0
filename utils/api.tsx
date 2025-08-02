import { io } from "socket.io-client";

const socket = io("http://<YOUR_BACKEND_IP>:8000");

export default socket;
