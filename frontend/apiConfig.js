let baseUrl;
let socketUrl;

if (import.meta.env.PROD) {
  baseUrl = import.meta.env.VITE_API_URL || "https://swift-chatapp.onrender.com";
  socketUrl = import.meta.env.VITE_SOCKET_URL || "wss://swift-chatapp.onrender.com";
} else {
  baseUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
  socketUrl = import.meta.env.VITE_SOCKET_URL || "ws://localhost:8000";
}

export { baseUrl, socketUrl };
