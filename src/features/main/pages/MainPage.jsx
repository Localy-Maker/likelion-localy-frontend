import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import Header from "@/shared/components/Header/Header";
import BottomNavigation from "@/shared/components/bottom/BottomNavigation";
import BellIcon from "@/shared/components/icons/BellIcon";
import HomeCharacterCard from "../components/HomeCharacterCard";
import QuickActionButtons from "../components/QuickActionButtons";
import EmotionTrendSummary from "../components/EmotionTrendSummary";
import BookmarkCarousel from "../components/BookmarkCarousel";
import { PageWrapper, ScrollableContent } from "../styles/MainPage.styles";
import { getRecentBookmarks, getHomeData } from "../api/homeApi";
import { getProfile } from "@/features/mypage/api/mypageApi";
import notificationWebSocketClient from "@/features/notification/utils/notificationWebSocketClient";
import { getCurrentUserId } from "@/shared/utils/jwtUtils";

/**
 * @component MainPage
 * @description 메인 페이지 - 홈 화면
 */
export default function MainPage() {
  const navigate = useNavigate();
  const [bookmarks, setBookmarks] = useState([]);
  const [emotionData, setEmotionData] = useState(null);
  const [nickname, setNickname] = useState("멋사");
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch profile
        const profileResponse = await getProfile();
        if (profileResponse.success && profileResponse.data?.nickname) {
          setNickname(profileResponse.data.nickname);
        }

        // Fetch home data (emotion summary)
        const homeDataResponse = await getHomeData();
        if (homeDataResponse.success) {
          setEmotionData(homeDataResponse.data);
        }

        // Fetch bookmarks
        const bookmarkResponse = await getRecentBookmarks();
        if (bookmarkResponse.success) {
          setBookmarks(bookmarkResponse.data);
        }
      } catch (error) {
        console.error("Failed to fetch home data:", error);
      }
    };

    fetchData();
  }, []);

  // WebSocket connection for unread notification count
  useEffect(() => {
    const userId = getCurrentUserId();

    if (!userId) {
      console.warn("User ID not found, cannot connect to notification WebSocket");
      return;
    }

    // 콜백 함수 정의
    const handleUnreadCount = (unreadCount) => {
      // Dev 환경에서만 로깅
      if (import.meta.env.DEV) {
        console.log("🔔 Unread notification count updated:", unreadCount);
        console.log("🔔 Setting unreadCount state to:", unreadCount);
      }
      setUnreadCount(unreadCount);
    };

    const handleError = (error) => {
      console.error("Notification WebSocket error:", error);
    };

    // WebSocket 연결 (이미 연결되어 있으면 콜백만 업데이트)
    notificationWebSocketClient.connect(userId, handleUnreadCount, handleError);

    // 페이지가 다시 보여질 때 콜백 업데이트
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        if (import.meta.env.DEV) {
          console.log("🔄 Page became visible, updating callback");
        }
        // WebSocket이 연결되어 있으면 콜백만 업데이트, 아니면 재연결
        if (notificationWebSocketClient.isConnected()) {
          notificationWebSocketClient.updateCallback(handleUnreadCount, handleError);
        } else {
          notificationWebSocketClient.connect(userId, handleUnreadCount, handleError);
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Cleanup: 이벤트 리스너만 제거 (WebSocket은 유지)
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // Navigation handlers
  const handleNotificationClick = () => navigate("/notifications");
  const handleChatClick = () => navigate("/chat");
  const handleBookmarkClick = () => navigate("/local/bookmark");
  const handleMissionClick = () => navigate("/local/mission");
  const handleEmotionLogClick = () => navigate("/dashboard");
  const handleProfileClick = () => navigate("/mypage");
  const handleViewTrend = () => navigate("/dashboard");
  const handleViewBookmarks = () => navigate("/local/bookmark");

  // Dev 환경에서만 unreadCount 변경 로깅
  useEffect(() => {
    if (import.meta.env.DEV) {
      console.log("📊 MainPage unreadCount state changed:", unreadCount);
    }
  }, [unreadCount]);

  return (
    <PageWrapper>
      <Header
        leftIcon={null}
        rightIcon={<BellIcon color="#000" size={24} unreadCount={unreadCount} />}
        text="Localy"
        onLeftClick={null}
        onRightClick={handleNotificationClick}
        showBorder={false}
      />
      <ScrollableContent>
        <HomeCharacterCard onClick={handleChatClick} nickname={nickname} />
        <QuickActionButtons
          onBookmarkClick={handleBookmarkClick}
          onMissionClick={handleMissionClick}
          onEmotionLogClick={handleEmotionLogClick}
          onProfileClick={handleProfileClick}
        />
        <EmotionTrendSummary
          onViewMore={handleViewTrend}
          emotionData={emotionData}
        />
        <BookmarkCarousel
          onViewAll={handleViewBookmarks}
          bookmarks={bookmarks}
        />
      </ScrollableContent>

      <BottomNavigation />
    </PageWrapper>
  );
}









