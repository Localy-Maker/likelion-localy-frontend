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
  max-width: 288px;
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
  color: #838383;

  &::placeholder {
    color: #838383;
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

// ============ Helper Functions ============

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
  const [currentChatId, setCurrentChatId] = useState("chat-1");
  const [userId] = useState(1); // 실제로는 로그인한 사용자 ID
  const [isConnected, setIsConnected] = useState(false);

  // 채팅 데이터 (실제로는 API에서 가져올 데이터)
  const [chatHistories] = useState([
    {
      id: "chat-1",
      title: "친구와 다툼",
      messages: [
        {
          id: 1,
          type: "bot",
          text: "오늘 하루는 어떠셨나요?",
          timestamp: "(금) 오후 8:04",
        },
        {
          id: 2,
          type: "user",
          texts: ["오늘은 너무 힘들었어.", "고향 친구와 다퉜거든"],
        },
        {
          id: 3,
          type: "bot",
          text: `오늘 정말 힘들었겠어요.\n\n가까운 사람과 다투면 마음이 크게 흔들리고, 하루 전체가 무거워지죠.\n지금 그 감정 느끼는 건 아주 자연스러운 일이에요.\n\n혹시 괜찮다면,\n• 어떤 상황에서\n• 무엇 때문에\n• 어떤 감정이 들었는지\n조금만 더 얘기해줄 수 있을까요?\n\n당신 편에서 차분히 함께 정리해줄게요.`,
          showDivider: true,
        },
      ],
    },
    {
      id: "chat-2",
      title: "고향 친구를 우연히 만남",
      messages: [
        {
          id: 1,
          type: "bot",
          text: "무슨 일이 있었나요?",
          timestamp: "(목) 오후 3:20",
        },
        {
          id: 2,
          type: "user",
          texts: ["고향 친구를 우연히 만났어"],
        },
        {
          id: 3,
          type: "bot",
          text: "반가운 만남이었겠네요! 어떤 이야기를 나누셨나요?",
        },
      ],
    },
  ]);

  const [messages, setMessages] = useState(
    chatHistories.find((chat) => chat.id === currentChatId)?.messages || []
  );

  // 스크롤을 맨 아래로 이동하는 함수
  const scrollToBottom = () => {
    if (chatContentRef.current) {
      chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
    }
  };

  // 메시지가 변경될 때마다 스크롤을 맨 아래로 이동
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // WebSocket 연결
  useEffect(() => {
    const handleReceivedMessage = (data) => {
      // 봇 메시지를 받았을 때 처리
      const botMessage = {
        id: Date.now(),
        type: "bot",
        text: data.message,
        timestamp: new Date(data.timestamp)
          .toLocaleString("ko-KR", {
            weekday: "short",
            hour: "numeric",
            minute: "2-digit",
          })
          .replace(/^/, "(")
          .replace(/ /, ") "),
      };
      setMessages((prev) => [...prev, botMessage]);
    };

    const handleError = (error) => {
      console.error("WebSocket connection error:", error);
      setIsConnected(false);
    };

    // WebSocket 연결 시작
    console.log("WebSocket connected successfully");
    setIsConnected(true);
    webSocketClient.connect(userId, handleReceivedMessage, handleError);

    // 컴포넌트 언마운트 시 연결 종료
    return () => {
      webSocketClient.disconnect();
    };
  }, [userId]);

  const onBack = () => {
    navigate(-1);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleNewChat = () => {
    const newChatId = `chat-${Date.now()}`;
    setCurrentChatId(newChatId);
    setMessages([
      {
        id: 1,
        type: "bot",
        text: "안녕하세요! 오늘 하루는 어떠셨나요?",
        timestamp: `(${new Date().toLocaleDateString("ko-KR", {
          weekday: "short",
        })}) ${new Date().toLocaleTimeString("ko-KR", {
          hour: "numeric",
          minute: "2-digit",
        })}`,
      },
    ]);
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
    if (inputValue.trim()) {
      const messageText = inputValue.trim();

      // UI에 사용자 메시지 즉시 표시
      const newMessage = {
        id: messages.length + 1,
        type: "user",
        texts: [messageText],
      };
      setMessages((prev) => [...prev, newMessage]);
      setInputValue("");

      // WebSocket으로 메시지 전송
      try {
        if (isConnected) {
          await webSocketClient.sendMessage(userId, messageText);
          console.log("Message sent successfully");
        } else {
          console.warn("WebSocket not connected, message not sent");
        }
      } catch (error) {
        console.error("Failed to send message:", error);
      }
    }
  };

  return (
    <>

      <PageWrapper>

        <ChatContainer>
          <Header
            leftIcon={<ChevronLeftIcon />}
            onLeftClick={onBack}
            text="Localy"
            rightIcon={<MenuIcon />}
            onRightClick={toggleSidebar}
          />

          <ChatContent ref={chatContentRef}>
            {messages.map((message, index) => (
              <div key={message.id}>
                {message.timestamp && <Timestamp>{message.timestamp}</Timestamp>}

                {message.type === "bot" ? (
                  <>
                    {message.showDivider && index > 0 && <Divider />}
                    <ChatMessage>
                      <BotMessage>
                        {message.text.split("\n").map((line, i) => (
                          <span key={i}>
                            {line}
                            {i < message.text.split("\n").length - 1 && <br />}
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
            ))}
          </ChatContent>

          <FooterInput>
            <InputWrapper>
              <Input
                placeholder="당신의 이야기를 들려주세요."
                value={inputValue}
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
          <SidebarItem $marginBottom="27px" onClick={handleNewChat}>
            <SidebarIconWrapper>
              <PencilIcon color="#0D0D0D" size={20} />
            </SidebarIconWrapper>
            <SidebarText>새로운 채팅</SidebarText>
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
