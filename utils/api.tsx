import { io } from "socket.io-client";

const socket = io("http://192.168.0.114:8000"); // e.g., 
export default socket;
