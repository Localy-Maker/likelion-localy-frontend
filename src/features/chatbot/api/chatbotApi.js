// 챗봇 REST API는 백엔드에서 제거됨.
// 오늘의 챗봇 대화 내역은 GET /api/chat/chatMessages/today (chatApi.getTodayChatMessages) 로 통합되었다.
// 실시간 메시지 송수신은 STOMP WebSocket (`/send`)을 사용한다 — features/chat/utils/webSocketClient.js 참조.

export {};
