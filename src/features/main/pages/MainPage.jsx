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
import { getRecentBookmarks, getWeekEmotionSummary } from "../api/homeApi";

/**
 * @component MainPage
 * @description 메인 페이지 - 홈 화면
 */
export default function MainPage() {
  const navigate = useNavigate();
  const [bookmarks, setBookmarks] = useState([]);
  const [emotionData, setEmotionData] = useState(null);

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch bookmarks
        const bookmarkResponse = await getRecentBookmarks();
        if (bookmarkResponse.success) {
          setBookmarks(bookmarkResponse.data);
        }

        // Fetch emotion summary
        const emotionResponse = await getWeekEmotionSummary();
        if (emotionResponse.success) {
          setEmotionData(emotionResponse.data);
        }
      } catch (error) {
        console.error("Failed to fetch home data:", error);
      }
    };

    fetchData();
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

  return (
    <PageWrapper>
      {/* ToDo: BellIcon에 알람 온 개수만큼 표시 */}
      <Header
        leftIcon={null}
        rightIcon={<BellIcon color="#000" size={24} />}
        text="Localy"
        onLeftClick={null}
        onRightClick={handleNotificationClick}
        showBorder={false}
      />
      <ScrollableContent>
        <HomeCharacterCard onClick={handleChatClick} />
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









