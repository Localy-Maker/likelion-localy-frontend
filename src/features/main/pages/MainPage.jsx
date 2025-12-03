import { useNavigate } from "react-router-dom";
import Header from "@/shared/components/Header/Header";
import Footer from "@/shared/components/Footer/Footer";
import BellIcon from "@/shared/components/icons/BellIcon";
import HomeCharacterCard from "../components/HomeCharacterCard";
import QuickActionButtons from "../components/QuickActionButtons";
import EmotionTrendSummary from "../components/EmotionTrendSummary";
import BookmarkCarousel from "../components/BookmarkCarousel";
import { PageWrapper, ScrollableContent } from "../styles/MainPage.styles";

/**
 * @component MainPage
 * @description 메인 페이지 - 홈 화면
 */
export default function MainPage() {
  const navigate = useNavigate();

  // ToDo: 추가될 페이지 네비게이션 매핑
  const handleNotificationClick = () => navigate("/notifications");
  const handleChatClick = () => navigate("/chat");
  const handleBookmarkClick = () => navigate("/bookmarks");
  const handleMissionClick = () => navigate("/mission");
  const handleEmotionLogClick = () => navigate("/dashboard");
  const handleProfileClick = () => navigate("/mypage");
  const handleViewTrend = () => navigate("/dashboard");
  const handleViewBookmarks = () => navigate("/bookmarks");

  return (
    <PageWrapper>
      {/* ToDo: BellIcon에 알람 온 개수만큼 표시 */}
      <Header
        leftIcon={null}
        rightIcon={<BellIcon color="#000" size={24} />}
        text="Localy"
        onLeftClick={null}
        onRightClick={handleNotificationClick}
      />
      <ScrollableContent>
        <HomeCharacterCard onClick={handleChatClick} />
        <QuickActionButtons
          onBookmarkClick={handleBookmarkClick}
          onMissionClick={handleMissionClick}
          onEmotionLogClick={handleEmotionLogClick}
          onProfileClick={handleProfileClick}
        />
        <EmotionTrendSummary onViewMore={handleViewTrend} />
        <BookmarkCarousel onViewAll={handleViewBookmarks} />
      </ScrollableContent>
      <Footer />
    </PageWrapper>
  );
}









