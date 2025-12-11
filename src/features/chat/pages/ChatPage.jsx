import { useState, useEffect, useRef } from "react";
import Header from "@/shared/components/Header/Header";
import ChevronLeftIcon from "@/shared/components/icons/ChevronLeftIcon";
import MenuIcon from "@/shared/components/icons/MenuIcon";
import MicIcon from "@/shared/components/icons/MicIcon";
import ArrowUpIcon from "@/shared/components/icons/ArrowUpIcon";
import PencilIcon from "@/shared/components/icons/PencilIcon";
import { useNavigate } from "react-router";
import styled from "styled-components";
import { colors } from "@/styles/colors";
import webSocketClient from "@/features/chat/utils/webSocketClient";
import {
  getTodayChatMessages,
  getPastChatMessages,
} from "@/features/chat/api/chatApi";
import { getCurrentUserId } from "@/shared/utils/jwtUtils";

// ============ Styles ============

const PageWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 800px;
  height: 100vh;
  margin: 0 auto;
  overflow: hidden;
`;

const ChatContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  background: ${colors.white};
  display: flex;
  flex-direction: column;
`;

const ChatContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding-bottom: 68px;
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */

  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari */
  }
`;

const Timestamp = styled.div`
  width: 100%;
  height: 18px;
  margin: 24px 0;

  font-family: "Inter", sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 150%;
  text-align: center;

  color: #838383;
`;

const Divider = styled.div`
  width: 100%;
  height: 8px;
  background: #f3f3f3;
  margin: 16px 0;
`;

const ChatMessage = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 10px 20px;
  gap: 10px;
  width: 100%;
`;

const BotMessage = styled.div`
  font-family: "Inter", sans-serif;
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 140%;
  color: #0d0d0d;
  width: 100%;
  max-width: calc(100% - 40px);
  word-wrap: break-word;
  white-space: pre-wrap;

  @media (min-width: 768px) {
    max-width: 36rem;
  }
`;

const UserChatWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  padding: 0px 16px;
  gap: 2px;
  width: 100%;
  margin-top: ${(props) => (props.$isFirstInGroup ? "16px" : "2px")};
  margin-bottom: ${(props) => (props.$isLastInGroup ? "16px" : "0px")};
`;

const MessageBubble = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 8px 16px;
  gap: 8px;

  max-width: 267px;
  background: #5482ff;
  color: #ffffff;

  font-family: "Inter", sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 140%;

  /* 위치에 따른 border-radius */
  border-radius: ${(props) => {
    if (props.$position === "single") return "18px";
    if (props.$position === "first") return "18px 18px 4px 18px";
    if (props.$position === "middle") return "18px 4px 4px 18px";
    if (props.$position === "last") return "18px 4px 18px 18px";
    return "18px";
  }};
`;

const FooterInput = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 68px;
  background: #ffffff;
  padding: 11px 0;
  z-index: 10;
`;

const InputWrapper = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 8px 16px;
  gap: 16px;

  height: 45px;
  margin: 0 16px;

  background: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;

  /* Input focus 시 border 색상 변경 */
  &:focus-within {
    border-color: #5482ff;
  }
`;

const Input = styled.input`
  flex: 1;
  border: none;
  outline: none;

  font-family: "Inter", sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 17px;
  color: #0d0d0d;

  &::placeholder {
    color: ${(props) => (props.$hasValue ? "#0D0D0D" : "#838383")};
  }
`;

const MicButton = styled.button`
  width: 24px;
  height: 24px;
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SendButton = styled.button`
  width: 29px;
  height: 29px;
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// Sidebar styles
const Dimmed = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 100;
  display: ${(props) => (props.$isOpen ? "block" : "none")};
`;

const Sidebar = styled.div`
  position: absolute;
  right: 0;
  top: 73px;
  width: 286px;
  height: calc(100% - 73px - 31px);
  background: #f3f3f3;
  border-radius: 16px;
  z-index: 101;
  padding: 42px 23px;
  overflow-y: auto;

  transform: ${(props) =>
    props.$isOpen ? "translateX(0)" : "translateX(100%)"};
  transition: transform 0.3s ease-in-out;
`;

const SidebarItem = styled.div`
  display: flex;
  align-items: center;
  gap: 9px;
  margin-bottom: ${(props) => props.$marginBottom || "0px"};
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }
`;

const SidebarIconWrapper = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SidebarText = styled.span`
  font-family: "Inter", sans-serif;
  font-style: normal;
  font-weight: ${(props) => (props.$bold ? "500" : "400")};
  font-size: ${(props) => props.$size || "16px"};
  line-height: ${(props) => props.$lineHeight || "19px"};
  color: ${(props) => props.$color || "#0D0D0D"};
`;

// Typing indicator styles
const TypingIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 10px 16px;
  max-width: 60px;
  background: #f3f3f3;
  border-radius: 12px;
  margin: 10px 20px;
`;

const TypingDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #838383;
  animation: typing 1.4s infinite;
  animation-delay: ${(props) => props.$delay || "0s"};

  @keyframes typing {
    0%,
    60%,
    100% {
      opacity: 0.3;
      transform: scale(0.8);
    }
    30% {
      opacity: 1;
      transform: scale(1);
    }
  }
`;

// ============ Helper Functions ============

const formatTimestamp = (dateInput) => {
  const date =
    dateInput instanceof Date ? dateInput : new Date(dateInput ?? undefined);

  if (isNaN(date?.getTime())) {
    return "(시간 정보 없음)";
  }

  const parts = date
    .toLocaleString("ko-KR", {
      weekday: "short",
      hour: "numeric",
      minute: "2-digit",
    })
    .split(" ")
    .filter(Boolean);

  if (!parts.length) {
    return "(시간 정보 없음)";
  }

  const [weekdayRaw, ...restParts] = parts;
  const weekday = weekdayRaw?.replace(/[()]/g, "");
  const rest = restParts.join(" ").trim();

  if (weekday && rest) {
    return `(${weekday}) ${rest}`;
  }

  return weekday ? `(${weekday})` : rest || "(시간 정보 없음)";
};

// 타임스탬프를 표시할지 여부를 결정하는 함수
const shouldShowTimestamp = (messages, currentIndex) => {
  const currentMsg = messages[currentIndex];
  const prevMsg = messages[currentIndex - 1];

  // 첫 번째 메시지는 항상 타임스탬프 표시
  if (currentIndex === 0) return true;

  // 이전 메시지가 없으면 표시
  if (!prevMsg || !prevMsg.timestampDate || !currentMsg.timestampDate) {
    return true;
  }

  // 30분(1800000ms) 이상 차이나면 타임스탬프 표시
  const timeDiff = Math.abs(
    currentMsg.timestampDate.getTime() - prevMsg.timestampDate.getTime()
  );
  return timeDiff >= 1800000; // 30분 = 30 * 60 * 1000ms
};

const getMessagePosition = (messages, currentIndex, textIndex, totalTexts) => {
  const currentMsg = messages[currentIndex];
  const prevMsg = messages[currentIndex - 1];
  const nextMsg = messages[currentIndex + 1];

  const isSameSenderAsPrev = prevMsg?.type === currentMsg.type;
  const isSameSenderAsNext = nextMsg?.type === currentMsg.type;

  // 단일 텍스트인 경우
  if (totalTexts === 1) {
    if (!isSameSenderAsPrev && !isSameSenderAsNext) return "single";
    if (!isSameSenderAsPrev && isSameSenderAsNext) return "first";
    if (isSameSenderAsPrev && isSameSenderAsNext) return "middle";
    if (isSameSenderAsPrev && !isSameSenderAsNext) return "last";
  }

  // 여러 텍스트인 경우
  if (textIndex === 0) {
    // 첫 번째 텍스트
    if (!isSameSenderAsPrev) return "first";
    return "middle";
  } else if (textIndex === totalTexts - 1) {
    // 마지막 텍스트
    if (!isSameSenderAsNext) return "last";
    return "middle";
  } else {
    // 중간 텍스트
    return "middle";
  }
};

// ============ Component ============

const ChatPage = () => {
  const navigate = useNavigate();
  const chatContentRef = useRef(null); // 스크롤을 위한 ref
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [currentChatId, setCurrentChatId] = useState("today");
  const [userId, setUserId] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [chatHistories, setChatHistories] = useState([]);
  const [messages, setMessages] = useState([]);
  const [todayMessages, setTodayMessages] = useState([]); // 오늘 채팅 메시지 저장
  const [isTyping, setIsTyping] = useState(false);

  // API 데이터 변환 함수
  const transformApiMessage = (apiMessage) => {
    const dateArray = apiMessage.createdAt;
    const date = new Date(
      dateArray[0],
      dateArray[1] - 1,
      dateArray[2],
      dateArray[3],
      dateArray[4],
      dateArray[5]
    );

    const timestampDate = date;
    const timestamp = formatTimestamp(timestampDate);

    if (apiMessage.role === "BOT") {
      return {
        id: apiMessage.id,
        type: "bot",
        text: apiMessage.text,
        timestamp,
        timestampDate,
      };
    } else {
      return {
        id: apiMessage.id,
        type: "user",
        texts: [apiMessage.text],
        timestamp,
        timestampDate,
      };
    }
  };

  // JWT에서 userId 추출
  useEffect(() => {
    const extractedUserId = getCurrentUserId();
    if (extractedUserId) {
      setUserId(extractedUserId);
      console.log("Extracted userId from JWT:", extractedUserId);
    } else {
      console.error("Failed to extract userId from JWT");
    }
  }, []);

  // 오늘 채팅 및 과거 채팅 로드
  useEffect(() => {
    const fetchChatData = async () => {
      try {
        setLoading(true);

        // 오늘 채팅 가져오기
        const todayResponse = await getTodayChatMessages();
        let todayMessagesData = [];

        if (
          todayResponse.success &&
          todayResponse.data &&
          todayResponse.data.length > 0
        ) {
          todayMessagesData = todayResponse.data.map(transformApiMessage);
        } else if (
          todayResponse.success &&
          (!todayResponse.data || todayResponse.data.length === 0)
        ) {
          // 오늘 채팅이 없으면 초기 인사 메시지만 UI에 표시
          const now = new Date();
          todayMessagesData = [
            {
              id: "initial-greeting",
              type: "bot",
              text: "안녕하세요! 오늘 하루는 어떠셨나요?",
              timestamp: formatTimestamp(now),
              timestampDate: now,
            },
          ];
        }

        // 오늘 채팅 메시지 저장
        setTodayMessages(todayMessagesData);
        setMessages(todayMessagesData);

        // 과거 채팅 가져오기 (사이드바용)
        const pastResponse = await getPastChatMessages();
        if (pastResponse.success && pastResponse.data) {
          // 과거 채팅을 날짜별로 그룹화
          const groupedChats = {};
          pastResponse.data.forEach((msg) => {
            const dateArray = msg.createdAt;
            const dateKey = `${dateArray[0]}-${dateArray[1]}-${dateArray[2]}`;

            if (!groupedChats[dateKey]) {
              groupedChats[dateKey] = {
                id: dateKey,
                title: `${dateArray[1]}월 ${dateArray[2]}일 채팅`,
                messages: [],
              };
            }
            groupedChats[dateKey].messages.push(transformApiMessage(msg));
          });

          setChatHistories(Object.values(groupedChats));
        }
      } catch (error) {
        console.error("Failed to fetch chat data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChatData();
  }, []);

  // 스크롤을 맨 아래로 이동하는 함수
  const scrollToBottom = () => {
    if (chatContentRef.current) {
      chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
    }
  };

  // 메시지가 변경되거나 로딩이 완료될 때 스크롤을 맨 아래로 이동
  useEffect(() => {
    if (!loading) {
      scrollToBottom();
    }
  }, [messages, loading]);

  // WebSocket 연결 (userId가 준비된 후에만 연결)
  useEffect(() => {
    if (!userId) {
      console.log("Waiting for userId to be extracted from JWT...");
      return;
    }

    const handleReceivedMessage = (data) => {
      // 타이핑 애니메이션 종료
      setIsTyping(false);

      if (import.meta.env.DEV) {
        console.log("📩 Received bot message data:", data);
      }

      let timestampDate = new Date(data?.timestamp ?? undefined);
      if (isNaN(timestampDate.getTime())) {
        timestampDate = new Date();
        if (import.meta.env.DEV) {
          console.warn("⚠️ Invalid timestamp received, using current time");
        }
      }

      const botMessage = {
        id: Date.now(),
        type: "bot",
        text: data?.text || data?.message || "",
        timestamp: formatTimestamp(timestampDate),
        timestampDate,
      };

      if (import.meta.env.DEV) {
        console.log("💬 Transformed bot message:", botMessage);
        console.log("💬 Final text length:", botMessage.text?.length);
      }

      // messages와 todayMessages 둘 다 업데이트
      setMessages((prev) => [...prev, botMessage]);
      setTodayMessages((prev) => [...prev, botMessage]);
    };

    const handleError = (error) => {
      console.error("WebSocket connection error:", error);
      setIsConnected(false);
    };

    // WebSocket 연결 시작
    console.log("Connecting to Chat WebSocket with userId:", userId);
    setIsConnected(true);
    webSocketClient.connect(userId, handleReceivedMessage, handleError);

    // 컴포넌트 언마운트 시 연결 종료
    return () => {
      console.log("Disconnecting Chat WebSocket");
      webSocketClient.disconnect();
    };
  }, [userId]);

  const onBack = () => {
    navigate(-1);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleBackToToday = () => {
    // 오늘 채팅으로 돌아가기
    setCurrentChatId("today");
    setMessages(todayMessages);
    setSidebarOpen(false);
  };

  const handleSelectChat = (chatId) => {
    setCurrentChatId(chatId);
    const selectedChat = chatHistories.find((chat) => chat.id === chatId);
    if (selectedChat) {
      setMessages(selectedChat.messages);
    }
    setSidebarOpen(false);
  };

  const handleSend = async () => {
    if (inputValue.trim() && userId) {
      const messageText = inputValue.trim();
      const now = new Date();

      // UI에 사용자 메시지 즉시 표시
      const newMessage = {
        id: messages.length + 1,
        type: "user",
        texts: [messageText],
        timestampDate: now, // 비교를 위한 Date 객체 추가
        timestamp: formatTimestamp(now),
      };
      setMessages((prev) => [...prev, newMessage]);
      setTodayMessages((prev) => [...prev, newMessage]);
      setInputValue("");

      // WebSocket으로 메시지 전송
      try {
        if (isConnected) {
          // 타이핑 애니메이션 시작
          setIsTyping(true);

          await webSocketClient.sendMessage(messageText);
          console.log("Message sent successfully");
        } else {
          console.warn("WebSocket not connected, message not sent");
        }
      } catch (error) {
        console.error("Failed to send message:", error);
        // 에러 발생 시 타이핑 애니메이션 종료
        setIsTyping(false);
      }
    } else if (!userId) {
      console.warn("Cannot send message: userId not available");
    }
  };

  return (
    <>
      <PageWrapper>
        <ChatContainer>
          <Header
            leftIcon={<ChevronLeftIcon />}
            onLeftClick={onBack}
            text={"Localy"}
            rightIcon={<MenuIcon rotate={180} />}
            onRightClick={toggleSidebar}
          />

          <ChatContent ref={chatContentRef}>
            {loading ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                <p>채팅을 불러오는 중...</p>
              </div>
            ) : (
              messages.map((message, index) => (
                <div key={message.id}>
                  {shouldShowTimestamp(messages, index) &&
                    message.timestamp && (
                      <Timestamp>{message.timestamp}</Timestamp>
                    )}

                  {message.type === "bot" ? (
                    <>
                      {message.showDivider && index > 0 && <Divider />}
                      <ChatMessage>
                        <BotMessage>
                          {message.text.split("\n").map((line, i) => (
                            <span key={i}>
                              {line}
                              {i < message.text.split("\n").length - 1 && (
                                <br />
                              )}
                            </span>
                          ))}
                        </BotMessage>
                      </ChatMessage>
                    </>
                  ) : (
                    <UserChatWrapper
                      $isFirstInGroup={
                        index === 0 || messages[index - 1]?.type !== "user"
                      }
                      $isLastInGroup={
                        index === messages.length - 1 ||
                        messages[index + 1]?.type !== "user"
                      }
                    >
                      {message.texts.map((text, i) => {
                        const position = getMessagePosition(
                          messages,
                          index,
                          i,
                          message.texts.length
                        );
                        return (
                          <MessageBubble key={i} $position={position}>
                            {text}
                          </MessageBubble>
                        );
                      })}
                    </UserChatWrapper>
                  )}
                </div>
              ))
            )}
            {isTyping && (
              <TypingIndicator>
                <TypingDot $delay="0s" />
                <TypingDot $delay="0.2s" />
                <TypingDot $delay="0.4s" />
              </TypingIndicator>
            )}
          </ChatContent>

          <FooterInput>
            <InputWrapper>
              <Input
                placeholder="당신의 이야기를 들려주세요."
                value={inputValue}
                $hasValue={inputValue.length > 0}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
              />
              <MicButton>
                <MicIcon color="#838383" size={24} />
              </MicButton>
              <SendButton onClick={handleSend} disabled={!inputValue.trim()}>
                <ArrowUpIcon color="#5482FF" size={24} />
              </SendButton>
            </InputWrapper>
          </FooterInput>
        </ChatContainer>

        {/* Sidebar */}
        <Dimmed $isOpen={sidebarOpen} onClick={toggleSidebar} />
        <Sidebar $isOpen={sidebarOpen}>
          <SidebarItem $marginBottom="27px" onClick={handleBackToToday}>
            <SidebarIconWrapper>
              <PencilIcon color="#0D0D0D" size={20} />
            </SidebarIconWrapper>
            <SidebarText>오늘 채팅으로 돌아가기</SidebarText>
          </SidebarItem>

          <SidebarText
            $bold
            $size="14px"
            $lineHeight="20px"
            style={{ display: "block", marginBottom: "10px" }}
          >
            최근
          </SidebarText>

          {chatHistories.map((chat) => (
            <SidebarItem
              key={chat.id}
              $marginBottom="10px"
              onClick={() => handleSelectChat(chat.id)}
            >
              <SidebarText
                $color={currentChatId === chat.id ? "#5482FF" : "#0D0D0D"}
              >
                {chat.title}
              </SidebarText>
            </SidebarItem>
          ))}
        </Sidebar>
      </PageWrapper>
    </>
  );
};

export default ChatPage;
