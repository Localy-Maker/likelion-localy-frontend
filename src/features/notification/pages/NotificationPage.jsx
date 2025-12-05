import { useState } from "react";
import { useNavigate } from "react-router";
import Header from "@/shared/components/Header/Header";
import Footer from "@/shared/components/Footer/Footer";
import ChevronLeftIcon from "@/shared/components/icons/ChevronLeftIcon";
import NotificationTabs from "../components/NotificationTabs";
import NotificationCard from "../components/NotificationCard";
import { PageWrapper, ScrollableContent } from "../styles/Page.styles";

// Mock data for notifications
const mockNotifications = [
  {
    id: 1,
    type: "announcement",
    isNew: true,
    sender: "Localy",
    date: "11월 24일",
    title: "[v1.5 업데이트]\n안정성과 새로운 기능으로 더욱 강력해졌습니다.",
    description:
      "사용자 피드백을 반영하여 로컬 가이드 검색 엔진의 속도를 개선했습니다. 이제 AI의 감정 분석 리포트를 통해 주간 감정 변화를 한눈에 확인하실 수 있습니다.",
  },
  {
    id: 2,
    type: "announcement",
    isNew: false,
    sender: "Localy",
    date: "11월 24일",
    title: "[v1.5 업데이트]\n안정성과 새로운 기능으로 더욱 강력해졌습니다.",
    description:
      "사용자 피드백을 반영하여 로컬 가이드 검색 엔진의 속도를 개선했습니다. 이제 AI의 감정 분석 리포트를 통해 주간 감정 변화를 한눈에 확인하실 수 있습니다.",
  },
];

/**
 * @component NotificationPage
 * @description 알림 페이지
 */
export default function NotificationPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");

  const handleBack = () => {
    navigate(-1);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Filter notifications based on active tab
  const filteredNotifications =
    activeTab === "all"
      ? mockNotifications
      : mockNotifications.filter((notif) => notif.type === "announcement");

  return (
    <PageWrapper>
      <Header
        leftIcon={<ChevronLeftIcon color="#0D0D0D" size={16} />}
        rightIcon={null}
        text="알림"
        onLeftClick={handleBack}
        onRightClick={null}
        showBorder={false}
      />
      <ScrollableContent>
        <NotificationTabs activeTab={activeTab} onTabChange={handleTabChange} />
        {filteredNotifications.map((notification) => (
          <NotificationCard key={notification.id} notification={notification} />
        ))}
      </ScrollableContent>
      <Footer />
    </PageWrapper>
  );
}
