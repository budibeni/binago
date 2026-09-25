type MessageHandler = (data: any) => void;

class WebSocketClient {
  private ws: WebSocket | null = null;
  private url: string;
  private handlers: Map<string, Set<MessageHandler>> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private baseReconnectDelay = 1000;

  constructor(url: string) {
    this.url = url;
  }

  private getToken(): string | null {
    if (typeof window !== 'undefined') {
      const match = document.cookie.match(new RegExp('(^| )access_token=([^;]+)'));
      if (match) return match[2];
      return localStorage.getItem('access_token');
    }
    return null;
  }

  connect() {
    if (this.ws && (this.ws.readyState === WebSocket.CONNECTING || this.ws.readyState === WebSocket.OPEN)) {
      return;
    }

    const token = this.getToken();
    const wsUrl = new URL(this.url);
    if (token) {
      wsUrl.searchParams.set('token', token);
    }

    try {
      this.ws = new WebSocket(wsUrl.toString());

      this.ws.onopen = () => {
        if (process.env.NODE_ENV !== "production") console.log('[WebSocket] Connected');
        this.reconnectAttempts = 0;
      };

      this.ws.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          if (payload.type && this.handlers.has(payload.type)) {
            this.handlers.get(payload.type)!.forEach(handler => handler(payload.data));
          }
        } catch (err) {
          console.error('[WebSocket] Failed to parse message', err);
        }
      };

      this.ws.onclose = () => {
        if (process.env.NODE_ENV !== "production") console.log('[WebSocket] Disconnected');
        this.handleReconnect();
      };

      this.ws.onerror = (err) => {
        console.error('[WebSocket] Error', err);
      };
    } catch (err) {
      console.error('[WebSocket] Connection failed', err);
      this.handleReconnect();
    }
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = this.baseReconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
      if (process.env.NODE_ENV !== "production") console.log(`[WebSocket] Reconnecting in ${delay}ms...`);
      setTimeout(() => this.connect(), delay);
    } else {
      console.error('[WebSocket] Max reconnect attempts reached');
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  on(type: string, handler: MessageHandler) {
    if (!this.handlers.has(type)) {
      this.handlers.set(type, new Set());
    }
    this.handlers.get(type)!.add(handler);
  }

  off(type: string, handler: MessageHandler) {
    if (this.handlers.has(type)) {
      this.handlers.get(type)!.delete(handler);
    }
  }

  send(type: string, data: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type, data }));
    } else {
      console.warn('[WebSocket] Cannot send message, not connected');
    }
  }
}

export const wsClient = new WebSocketClient(
  process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8080/ws/v1/adatrack'
);
