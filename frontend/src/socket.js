import { io } from "socket.io-client";

// Change to your backend URL if deployed
const SOCKET_URL = "https://global-connection-1.onrender.com";

const socket = io(SOCKET_URL, {
  transports: ["websocket"], // Ensures stable connection
});

export default socket;
