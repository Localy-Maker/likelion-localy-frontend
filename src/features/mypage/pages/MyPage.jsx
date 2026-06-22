import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { getMyPage, deleteAccount, getPremiumStatus } from "../api/mypageApi";
import { logout } from "@/features/auth/api/authApi";
import LogoutModal from "../components/LogoutModal";
import * as S from "../styles/MyPage.styles";
import Header from "@/shared/components/Header/Header";
import BellIcon from "@/shared/components/icons/BellIcon";
import BottomNavigation from "@/shared/components/bottom/BottomNavigation";
import { PageWrapper, ScrollableContent } from "@/features/main/styles/MainPage.styles";
import notificationWebSocketClient from "@/features/notification/utils/notificationWebSocketClient";
import { getCurrentUserId } from "@/shared/utils/jwtUtils";
import { useUserStore } from "@/shared/stores/userStore";
import CharacterPreview from "@/features/character/components/CharacterPreview";

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
  const isPremium = useUserStore((s) => s.isPremium);
  const setPremium = useUserStore((s) => s.setPremium);
  const equippedCharacter = useUserStore((s) => s.equippedCharacter);
  const equippedItems = useUserStore((s) => s.equippedItems);

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

  // 프리미엄 상태 동기화 — userStore.isPremium 갱신용
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await getPremiumStatus();
        const payload = res?.data ?? res ?? {};
        if (cancelled) return;
        setPremium({
          isPremium: Boolean(payload.isPremium ?? payload.premium),
          premiumExpiresAt: payload.expiresAt ?? payload.premiumExpiresAt ?? null,
        });
      } catch (err) {
        // 백엔드가 미배포된 환경에서는 조용히 무시 (기본값 = basic)
        if (import.meta.env.DEV) {
          console.warn("프리미엄 상태 조회 실패:", err);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [setPremium]);

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
        <S.ProfileIcon type="button" onClick={() => navigate("/character")} aria-label="캐릭터 꾸미기">
          <CharacterPreview
            characterId={equippedCharacter ?? "happiness"}
            equip={equippedItems}
            size={100}
          />
        </S.ProfileIcon>
        <S.PlanBadge $isPremium={isPremium}>{isPremium ? "Premium" : "Basic"}</S.PlanBadge>
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



