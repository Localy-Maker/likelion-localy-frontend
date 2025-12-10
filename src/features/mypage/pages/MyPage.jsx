import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { getMyPage, deleteAccount } from "../api/mypageApi";
import { logout } from "@/features/auth/api/authApi";
import LogoutModal from "../components/LogoutModal";
import * as S from "../styles/MyPage.styles";
import Header from "@/shared/components/Header/Header";
import BellIcon from "@/shared/components/icons/BellIcon";
import BottomNavigation from "@/shared/components/bottom/BottomNavigation";
import { PageWrapper, ScrollableContent } from "@/features/main/styles/MainPage.styles";
import notificationWebSocketClient from "@/features/notification/utils/notificationWebSocketClient";
import { getCurrentUserId } from "@/shared/utils/jwtUtils";

export default function MyPage() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchMyPage = async () => {
      try {
        setIsLoading(true);
        setError("");
        
        const data = await getMyPage();
        const responseData = data?.data || data;
        setUserData(responseData);
      } catch (err) {
        setError(err.response?.data?.message || "마이페이지 정보를 불러오는데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyPage();
  }, []);

  // WebSocket connection for unread notification count
  useEffect(() => {
    const userId = getCurrentUserId();

    if (!userId) {
      console.warn("User ID not found, cannot connect to notification WebSocket");
      return;
    }

    // WebSocket 연결 및 읽지 않은 알림 개수 구독
    notificationWebSocketClient.connect(
      userId,
      (unreadCount) => {
        // Dev 환경에서만 로깅
        if (import.meta.env.DEV) {
          console.log("🔔 Unread notification count updated:", unreadCount);
        }
        setUnreadCount(unreadCount);
      },
      (error) => {
        console.error("Notification WebSocket error:", error);
      }
    );

    // Cleanup: 컴포넌트 언마운트 시 WebSocket 연결 해제
    return () => {
      notificationWebSocketClient.disconnect();
    };
  }, []);

  /**
   * 로그아웃 버튼 클릭 핸들러 (모달 열기)
   */
  const handleLogoutClick = () => {
    setIsLogoutModalOpen(true);
  };

  /**
   * 로그아웃 확인 핸들러
   */
  const handleLogoutConfirm = async () => {
    if (isLoggingOut) return;
    
    setIsLogoutModalOpen(false);
    setIsLoggingOut(true);
    try {
      await logout();
      navigate("/login");
    } catch (err) {
      const errorMessage = err.response?.data?.message || "로그아웃에 실패했습니다.";
      alert(errorMessage);
      navigate("/login");
    } finally {
      setIsLoggingOut(false);
    }
  };

  /**
   * 회원탈퇴 버튼 클릭 핸들러 (모달 열기)
   */
  const handleDeleteAccountClick = () => {
    setIsDeleteModalOpen(true);
  };

  /**
   * 회원탈퇴 확인 핸들러
   */
  const handleDeleteAccountConfirm = async () => {
    if (isDeleting) return;
    
    setIsDeleteModalOpen(false);
    setIsDeleting(true);
    try {
      await deleteAccount();
      localStorage.removeItem("refreshToken");
      navigate("/login");
    } catch (err) {
      const errorMessage = err.response?.data?.message || "회원탈퇴에 실패했습니다.";
      alert(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleNotificationClick = () => navigate("/notifications");

  if (isLoading) {
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
          <div style={{ paddingTop: "100px", textAlign: "center" }}>로딩 중...</div>
        </ScrollableContent>
        <BottomNavigation />
      </PageWrapper>
    );
  }

  if (error) {
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
          <div style={{ paddingTop: "100px", textAlign: "center", color: "#C53929" }}>{error}</div>
        </ScrollableContent>
        <BottomNavigation />
      </PageWrapper>
    );
  }

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
      <S.Container>

      <S.ProfileCard>
        <S.ProfileIcon>
          <svg width="96" height="96" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M47.8125 95.625C41.2188 95.625 35.0312 94.375 29.25 91.875C23.4688 89.4062 18.3906 85.9844 14.0156 81.6094C9.64062 77.2031 6.20312 72.125 3.70312 66.375C1.23438 60.5938 0 54.4062 0 47.8125C0 41.2188 1.23438 35.0312 3.70312 29.25C6.20312 23.4688 9.64062 18.3906 14.0156 14.0156C18.3906 9.64063 23.4688 6.21875 29.25 3.75C35.0312 1.25 41.2188 0 47.8125 0C54.4062 0 60.5938 1.25 66.375 3.75C72.1562 6.21875 77.2344 9.64063 81.6094 14.0156C85.9844 18.3906 89.4062 23.4688 91.875 29.25C94.375 35.0312 95.625 41.2188 95.625 47.8125C95.625 54.4062 94.375 60.5938 91.875 66.375C89.4062 72.125 85.9844 77.2031 81.6094 81.6094C77.2344 85.9844 72.1562 89.4062 66.375 91.875C60.5938 94.375 54.4062 95.625 47.8125 95.625ZM25.7344 72.375H69.8906C70.8594 72.375 71.5781 72.0938 72.0469 71.5312C72.5156 70.9375 72.75 70.2031 72.75 69.3281C72.75 68.0156 72.2344 66.3125 71.2031 64.2188C70.2031 62.0938 68.6719 59.9688 66.6094 57.8438C64.5781 55.7188 62 53.9375 58.875 52.5C55.75 51.0625 52.0625 50.3438 47.8125 50.3438C43.5625 50.3438 39.875 51.0625 36.75 52.5C33.625 53.9375 31.0312 55.7188 28.9688 57.8438C26.9375 59.9688 25.4062 62.0938 24.375 64.2188C23.375 66.3125 22.875 68.0156 22.875 69.3281C22.875 70.2031 23.1094 70.9375 23.5781 71.5312C24.0469 72.0938 24.7656 72.375 25.7344 72.375ZM47.8125 46.3594C50.0938 46.3906 52.1719 45.8125 54.0469 44.625C55.9219 43.4375 57.4219 41.8125 58.5469 39.75C59.6719 37.6875 60.2344 35.375 60.2344 32.8125C60.2344 30.4062 59.6719 28.2031 58.5469 26.2031C57.4219 24.1719 55.9219 22.5625 54.0469 21.375C52.1719 20.1562 50.0938 19.5469 47.8125 19.5469C45.5312 19.5469 43.4531 20.1562 41.5781 21.375C39.7031 22.5625 38.2031 24.1719 37.0781 26.2031C35.9531 28.2031 35.3906 30.4062 35.3906 32.8125C35.3906 35.375 35.9531 37.6875 37.0781 39.75C38.2031 41.7812 39.7031 43.3906 41.5781 44.5781C43.4531 45.7656 45.5312 46.3594 47.8125 46.3594Z" fill="#E0E0E0"/>
          </svg>
        </S.ProfileIcon>
        <S.ProfileName>{userData?.name || userData?.nickname || "사용자"}</S.ProfileName>
        <S.ProfileEmail>{userData?.email || ""}</S.ProfileEmail>
        
        <S.ActionButtons>
          <S.ActionButton type="button" onClick={() => navigate("/mypage/edit")}>
            회원 정보 수정
          </S.ActionButton>
          <S.ActionButton type="button" onClick={() => navigate("/onboarding?step=2&from=mypage")}>
            관심사 변경
          </S.ActionButton>
          <S.ActionButton type="button" onClick={() => navigate("/premium")}>
            프리미엄 플랜
          </S.ActionButton>
        </S.ActionButtons>
      </S.ProfileCard>

      <S.BottomActions>
        <S.BottomActionButton 
          type="button" 
          onClick={handleLogoutClick} 
          disabled={isLoggingOut}
        >
          로그아웃
        </S.BottomActionButton>
        <S.Divider>|</S.Divider>
        <S.BottomActionButton 
          type="button" 
          onClick={handleDeleteAccountClick} 
          disabled={isDeleting}
        >
          회원탈퇴
        </S.BottomActionButton>
      </S.BottomActions>

      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogoutConfirm}
        title="로그아웃"
        message="로그아웃을 계속 하시겠습니까?"
        confirmText="확인"
        cancelText="닫기"
      />

      <LogoutModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteAccountConfirm}
        title="회원탈퇴"
        message="회원탈퇴를 계속 하시겠습니까?"
        confirmText="확인"
        cancelText="닫기"
      />
      </S.Container>
      </ScrollableContent>
      <BottomNavigation />
    </PageWrapper>
  );
}



