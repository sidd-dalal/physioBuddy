export class SocketManager {
  private socket: WebSocket | null = null;
  private sessionId: string;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private connectionChangeCallback?: (connected: boolean) => void;

  constructor(sessionId: string) {
    this.sessionId = sessionId;
  }

  connect(): Promise<WebSocket> {
    return new Promise((resolve, reject) => {
      try {
        const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
        const wsUrl = `${protocol}//${window.location.host}/ws`;
        
        this.socket = new WebSocket(wsUrl);

        this.socket.onopen = () => {
          console.log('WebSocket connected');
          this.reconnectAttempts = 0;
          this.connectionChangeCallback?.(true);
          
          // Join the session
          this.socket!.send(JSON.stringify({
            type: 'join-session',
            sessionId: this.sessionId,
            userName: 'User', // This would be dynamic in a real app
            userType: 'doctor' // This would be determined by user role
          }));
          
          resolve(this.socket!);
        };

        this.socket.onclose = () => {
          console.log('WebSocket disconnected');
          this.connectionChangeCallback?.(false);
          this.attemptReconnect();
        };

        this.socket.onerror = (error) => {
          console.error('WebSocket error:', error);
          reject(error);
        };

      } catch (error) {
        reject(error);
      }
    });
  }

  private attemptReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      return;
    }

    this.reconnectAttempts++;
    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
    
    this.reconnectTimeout = setTimeout(() => {
      console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      this.connect().catch(() => {
        // Connection failed, will trigger another reconnect attempt
      });
    }, delay);
  }

  send(data: any) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(typeof data === 'string' ? data : JSON.stringify(data));
    } else {
      console.warn('WebSocket is not connected');
    }
  }

  onConnectionChange(callback: (connected: boolean) => void) {
    this.connectionChangeCallback = callback;
  }

  getSocket() {
    return this.socket;
  }

  isConnected() {
    return this.socket?.readyState === WebSocket.OPEN;
  }

  disconnect() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }
}
