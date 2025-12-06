import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

/**
 * Alarm WebSocket Service
 * Manages WebSocket connections for alarm notifications
 */
class AlarmWebSocketService {
  constructor() {
    this.client = null;
    this.connected = false;
    this.subscriptions = {};
    this.onUnreadCountChange = null;
    this.onReceiveNotice = null;
  }

  /**
   * Connect to WebSocket server
   */
  connect() {
    if (this.connected) {
      console.log("Already connected to alarm WebSocket");
      return;
    }

    const token = localStorage.getItem("accessToken");
    const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
    const wsUrl = `${baseUrl}/ws`;

    console.log("Connecting to WebSocket:", wsUrl);
    console.log("Token:", token ? "exists" : "missing");

    this.client = new Client({
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      debug: (str) => {
        if (import.meta.env.DEV) {
          console.log("STOMP Debug:", str);
        }
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      webSocketFactory: () => {
        // SockJS 옵션 추가
        return new SockJS(wsUrl, null, {
          transports: ['websocket', 'xhr-streaming', 'xhr-polling'],
          timeout: 10000,
        });
      },
      onConnect: (frame) => {
        console.log("✅ Connected to alarm WebSocket", frame);
        this.connected = true;
        this.setupSubscriptions();
      },
      onDisconnect: () => {
        console.log("⚠️ Disconnected from alarm WebSocket");
        this.connected = false;
      },
      onStompError: (frame) => {
        console.error("❌ STOMP error:", {
          command: frame.command,
          headers: frame.headers,
          body: frame.body,
        });
      },
      onWebSocketError: (error) => {
        console.error("❌ WebSocket error:", error);
      },
    });

    this.client.activate();
  }

  /**
   * Setup WebSocket subscriptions
   */
  setupSubscriptions() {
    const userId = localStorage.getItem("userId");

    // Subscribe to receive notices
    this.subscriptions.receiveNotice = this.client.subscribe(
      "/topic/alarm/receiveNotice",
      (message) => {
        const notice = JSON.parse(message.body);
        console.log("Received notice:", notice);
        if (this.onReceiveNotice) {
          this.onReceiveNotice(notice);
        }
      }
    );

    // Subscribe to unread count updates
    if (userId) {
      this.subscriptions.unreadCount = this.client.subscribe(
        `/topic/alarm/unreadCount/${userId}`,
        (message) => {
          const count = parseInt(message.body, 10);
          console.log("Unread count:", count);
          if (this.onUnreadCountChange) {
            this.onUnreadCountChange(count);
          }
        }
      );
    }
  }

  /**
   * Read alarms (send/subscribe method)
   * @returns {Promise} Promise that resolves with alarm data
   */
  readAlarms() {
    return new Promise((resolve, reject) => {
      if (!this.connected) {
        reject(new Error("WebSocket not connected"));
        return;
      }

      const token = localStorage.getItem("accessToken");

      const subscription = this.client.subscribe(
        "/api/alarm/readAlarm",
        (message) => {
          const response = JSON.parse(message.body);
          console.log("Read alarms response:", response);
          subscription.unsubscribe();
          resolve(response);
        },
        (error) => {
          console.error("Error reading alarms:", error);
          subscription.unsubscribe();
          reject(error);
        }
      );

      // Send read request with Authorization header
      this.client.publish({
        destination: "/api/alarm/readAlarm",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({}),
      });
    });
  }

  /**
   * Set callback for unread count changes
   * @param {Function} callback - Callback function that receives count
   */
  setOnUnreadCountChange(callback) {
    this.onUnreadCountChange = callback;
  }

  /**
   * Set callback for receiving notices
   * @param {Function} callback - Callback function that receives notice data
   */
  setOnReceiveNotice(callback) {
    this.onReceiveNotice = callback;
  }

  /**
   * Disconnect from WebSocket
   */
  disconnect() {
    if (this.client && this.connected) {
      Object.values(this.subscriptions).forEach((subscription) => {
        if (subscription) {
          subscription.unsubscribe();
        }
      });
      this.subscriptions = {};
      this.client.deactivate();
      this.connected = false;
    }
  }

  /**
   * Check if connected
   * @returns {boolean}
   */
  isConnected() {
    return this.connected;
  }
}

// Create singleton instance
const alarmWebSocketService = new AlarmWebSocketService();

export default alarmWebSocketService;
