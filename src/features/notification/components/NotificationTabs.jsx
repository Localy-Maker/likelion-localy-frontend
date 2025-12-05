import { TabsContainer, TabButton, TabLabel } from "../styles/Tabs.styles";

/**
 * @component NotificationTabs
 * @description 알림 탭 전환 컴포넌트 (전체/공지사항)
 * @param {string} activeTab - 현재 활성화된 탭 ('all' | 'announcement')
 * @param {function} onTabChange - 탭 변경 핸들러
 */
const NotificationTabs = ({ activeTab, onTabChange }) => {
  return (
    <TabsContainer>
      <TabButton
        $isActive={activeTab === "all"}
        onClick={() => onTabChange("all")}
      >
        <TabLabel $isActive={activeTab === "all"}>전체</TabLabel>
      </TabButton>
      <TabButton
        $isActive={activeTab === "announcement"}
        onClick={() => onTabChange("announcement")}
      >
        <TabLabel $isActive={activeTab === "announcement"}>공지사항</TabLabel>
      </TabButton>
    </TabsContainer>
  );
};

export default NotificationTabs;
