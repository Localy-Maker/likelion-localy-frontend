import { BrowserRouter, Routes, Route } from "react-router";
import { GlobalStyle } from "@/styles/global-style";
import GlobalLayout from "@/shared/components/global-layout";
import { LanguageProvider } from "@/contexts/LanguageContext";
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
import TestPage from "@/pages/test-page";

function App() {
  return (
    <>
      <GlobalStyle />
      <LanguageProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<GlobalLayout />}>
              <Route path="/test" element={<TestPage />} />
              <Route path="/" element={<LoginPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/find-password" element={<FindPasswordPage />} />
              <Route path="/onboarding" element={<OnboardingPage />} />
              <Route path="/welcome" element={<WelcomePage />} />
              <Route path="/main" element={<DashboardPage />} />
              <Route path="/mypage" element={<MyPage />} />
              <Route path="/mypage/edit" element={<EditMyInfoPage />} />
              <Route path="/premium" element={<PremiumPlanPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </LanguageProvider>
    </>
  );
}

export default App;
