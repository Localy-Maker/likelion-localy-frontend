import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/shared/components/Header/Header";
import Footer from "@/shared/components/Footer/Footer";
import ChevronLeftIcon from "@/shared/components/icons/ChevronLeftIcon";
import NotificationTabs from "../components/NotificationTabs";
import NotificationCard from "../components/NotificationCard";
import { PageWrapper, ScrollableContent } from "../styles/Page.styles";
import alarmWebSocketService from "@/shared/services/alarmWebSocket";

/**
 * Format date from array format to Korean date string
 * @param {Array} dateArray - [year, month, day, hour, minute, second, nanosecond]
 * @returns {string} - "MM월 DD일"
 */
const formatDate = (dateArray) => {
  if (!dateArray || dateArray.length < 3) return "";
  const [, month, day] = dateArray;
  return `${month}월 ${day}일`;
};

/**
 * @component NotificationPage
 * @description 알림 페이지
 */
export default function NotificationPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Connect to WebSocket and fetch alarms
    // JWT 토큰은 alarmWebSocketService에서 자동으로 헤더에 추가됨
    const initializeAlarms = async () => {
      try {
        // Connect if not already connected
        if (!alarmWebSocketService.isConnected()) {
          alarmWebSocketService.connect();
        }

        // Wait for connection to establish
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Check if connected successfully
        if (!alarmWebSocketService.isConnected()) {
          console.warn("WebSocket connection failed. Skipping alarm fetch.");
          setLoading(false);
          return;
        }

        // Fetch alarms via WebSocket
        const response = await alarmWebSocketService.readAlarms();

        if (response.success && response.data) {
          // Transform API data to component format
          const transformedNotifications = response.data.map((alarm) => ({
            id: alarm.id,
            type: alarm.type.toLowerCase(),
            isNew: !alarm.read,
            sender: "Localy",
            date: formatDate(alarm.createdAt),
            title: alarm.title,
            description: alarm.body,
          }));

          setNotifications(transformedNotifications);
        }
      } catch (error) {
        console.error("Failed to fetch alarms:", error);
        // WebSocket 연결 실패 시에도 페이지는 정상 동작
      } finally {
        setLoading(false);
      }
    };

    initializeAlarms();

    // Setup listener for new notices
    alarmWebSocketService.setOnReceiveNotice((notice) => {
      const newNotification = {
        id: Date.now(), // Use timestamp as temporary ID
        type: "announcement",
        isNew: true,
        sender: "Localy",
        date: formatDate([
          new Date().getFullYear(),
          new Date().getMonth() + 1,
          new Date().getDate(),
        ]),
        title: notice.title,
        description: notice.content,
      };

      setNotifications((prev) => [newNotification, ...prev]);
    });

    // Cleanup on unmount
    return () => {
      alarmWebSocketService.setOnReceiveNotice(null);
    };
  }, []);

  const handleBack = () => {
    navigate(-1);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Filter notifications based on active tab
  const filteredNotifications =
    activeTab === "all"
      ? notifications
      : notifications.filter((notif) => notif.type === "announcement");

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
        {loading ? (
          <div
            style={{ padding: "20px", textAlign: "center", color: "#A6A6A6" }}
          >
            알림을 불러오는 중...
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div
            style={{ padding: "20px", textAlign: "center", color: "#A6A6A6" }}
          >
            알림이 없습니다.
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
            />
          ))
        )}
      </ScrollableContent>
      <Footer />
    </PageWrapper>
  );
}
