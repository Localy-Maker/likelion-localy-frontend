import { BrowserRouter, Routes, Route } from "react-router";
import { GlobalStyle } from "@/styles/global-style";
import GlobalLayout from "@/shared/components/global-layout";
import { LanguageProvider } from "@/contexts/LanguageContext.jsx";
import LoginPage from "@/features/auth/pages/LoginPage";
import SignupPage from "@/features/auth/pages/SignupPage";
import FindPasswordPage from "@/features/auth/pages/FindPasswordPage";
import OnboardingPage from "@/features/onboarding/pages/OnboardingPage";
import WelcomePage from "@/features/onboarding/pages/WelcomePage";
import MainPage from "@/features/main/pages/MainPage";
import MyPage from "@/features/mypage/pages/MyPage";
import EditMyInfoPage from "@/features/mypage/pages/EditMyInfoPage";
import PremiumPlanPage from "@/features/premium/pages/PremiumPlanPage";
import DashboardPage from "@/features/dashboard/pages/DashboardPage";
import LoadingPage from "@/features/loading/pages/LoadingPage";
import ChatPage from "@/features/chat/pages/ChatPage";
import LocalPage from "@/features/local/pages/Local";
import LocalDetailPage from "@/features/local/pages/LocalDetail";
import MissionPage from "@/features/local/pages/Mission";
import ChallengePage from "@/features/local/pages/Challenge";
import SpendPointsPage from "@/features/local/pages/SpendPoints";
import BookmarkPage from "@/features/local/pages/Bookmark";
import NotificationPage from "@/features/notification/pages/NotificationPage";

function App() {
  return (
    <>
      <GlobalStyle />
      <LanguageProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<GlobalLayout />}>
              <Route path="/" element={<LoginPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/find-password" element={<FindPasswordPage />} />
              <Route path="/onboarding" element={<OnboardingPage />} />
              <Route path="/welcome" element={<WelcomePage />} />
              <Route path="/loading" element={<LoadingPage />} />
              <Route path="/main" element={<MainPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/mypage" element={<MyPage />} />
              <Route path="/mypage/edit" element={<EditMyInfoPage />} />
              <Route path="/premium" element={<PremiumPlanPage />} />
              <Route path="/chat" element={<ChatPage />} />
              <Route path="/local" element={<LocalPage />} />
              <Route path="/local/detail/:id" element={<LocalDetailPage />} />
              <Route path="/local/mission" element={<MissionPage />} />
              <Route path="/local/challenge/:id" element={<ChallengePage />} />
              <Route path="/local/spend-points" element={<SpendPointsPage />} />
              <Route path="/local/bookmark" element={<BookmarkPage />} />
              <Route path="/notifications" element={<NotificationPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </LanguageProvider>
    </>
  );
}

export default App;
