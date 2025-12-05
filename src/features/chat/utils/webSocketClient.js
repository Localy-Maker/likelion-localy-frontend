import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

class WebSocketClient {
  constructor() {
    this.stompClient = null;
    this.subscriptions = new Map();
    this.connected = false;
  }

  connect(userId, onMessageReceived, onError) {
    // STOMP 클라이언트 생성
    this.stompClient = new Client({
      // SockJS를 WebSocket factory로 사용
      webSocketFactory: () => new SockJS("http://localhost:8080/ws"),

      // 연결 성공 콜백
      onConnect: () => {
        console.log("STOMP Connected");
        this.connected = true;

        // 채팅 응답 구독
        const subscription = this.stompClient.subscribe(
          `/topic/chat/${userId}/receiveChatResponse`,
          (message) => {
            try {
              const data = JSON.parse(message.body);
              if (onMessageReceived) {
                onMessageReceived(data);
              }
            } catch (error) {
              console.error("Failed to parse message:", error);
            }
          }
        );

        // 구독 정보 저장
        this.subscriptions.set(userId, subscription);
      },

      // 연결 끊김 콜백
      onDisconnect: () => {
        console.log("STOMP Disconnected");
        this.connected = false;
      },

      // 에러 콜백
      onStompError: (frame) => {
        console.error("STOMP Error:", frame);
        this.connected = false;
        if (onError) {
          onError(new Error(frame.headers.message || "STOMP connection error"));
        }
      },

      // 자동 재연결 설정
      reconnectDelay: 3000, // 3초 후 재연결
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,

      // 디버그 로그 (개발 환경에서만)
      debug: (str) => {
        if (import.meta.env.DEV) {
          console.log("STOMP Debug:", str);
        }
      },
    });

    // 연결 시작
    this.stompClient.activate();
  }

  sendMessage(userId, message) {
    if (!this.stompClient || !this.connected) {
      console.warn("STOMP not connected");
      return Promise.reject(new Error("STOMP not connected"));
    }

    return new Promise((resolve, reject) => {
      try {
        const payload = {
          userId: userId,
          sender: "USER",
          message: message,
          timestamp: new Date().toISOString(),
        };

        // STOMP send 메서드 사용
        this.stompClient.publish({
          destination: "/app/chat/sendMessage",
          body: JSON.stringify(payload),
        });

        // 메시지 전송 성공 응답
        resolve({
          success: true,
          message: "요청이 성공적으로 처리되었습니다.",
          data: {
            sender: "USER",
            message: message,
            timestamp: payload.timestamp,
          },
        });
      } catch (error) {
        console.error("Failed to send message:", error);
        reject(error);
      }
    });
  }

  disconnect() {
    if (this.stompClient) {
      // 모든 구독 해제
      this.subscriptions.forEach((subscription) => {
        subscription.unsubscribe();
      });
      this.subscriptions.clear();

      // STOMP 연결 종료
      this.stompClient.deactivate();
      this.stompClient = null;
      this.connected = false;
    }
  }

  isConnected() {
    return this.connected && this.stompClient?.connected;
  }
}

export default new WebSocketClient();
