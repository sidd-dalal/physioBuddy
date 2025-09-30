import { useState, useEffect } from "react";
import { SocketManager } from "@/lib/socket";

export function useSocket(sessionId: string) {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [socketManager] = useState(() => new SocketManager(sessionId));

  useEffect(() => {
    if (socketManager) {
      socketManager.onConnectionChange(setIsConnected);
      
      socketManager.connect()
        .then(setSocket)
        .catch(console.error);

      return () => {
        socketManager.disconnect();
      };
    }
  }, [sessionId, socketManager]);

  return {
    socket,
    isConnected,
    send: (data: any) => socketManager.send(data)
  };
}
