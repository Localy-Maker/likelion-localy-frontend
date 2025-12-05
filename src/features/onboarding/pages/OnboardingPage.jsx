import { useState, useRef, useMemo, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useLanguage } from "@/contexts/useLanguage";
import * as S from "../styles/OnboardingPage.styles";
import SidebarModal from "../components/SidebarModal";
import { updateNationality, updateInterests } from "../api/onboardingApi";

/**
 * @component OnboardingPage
 * @description 온보딩 페이지 컴포넌트.
 * 총 3단계로 구성되며, 사용자의 언어 및 국적 선택 등의 정보를 수집합니다.
 */
export default function OnboardingPage() {
  const navigate = useNavigate();
  const { t, changeLanguage } = useLanguage();
  const [searchParams] = useSearchParams();
  
  // URL 쿼리 파라미터에서 초기 스텝 가져오기 (기본값: 1)
  const initialStep = parseInt(searchParams.get("step") || "1", 10);
  const isInterestChange = initialStep === 2; // 관심사 변경 모드인지 확인
  
  // 현재 단계 상태 (1, 2, 3)
  const [currentStep, setCurrentStep] = useState(initialStep);
  
  // URL 쿼리 파라미터가 변경되면 스텝 업데이트
  useEffect(() => {
    const step = parseInt(searchParams.get("step") || "1", 10);
    if (step >= 1 && step <= 3) {
      setCurrentStep(step);
    }
  }, [searchParams]);
  
  // 1단계: 표시 언어 및 국적 선택 상태
  const [displayLanguage, setDisplayLanguage] = useState("");
  const [displayLanguageValue, setDisplayLanguageValue] = useState("");
  const [nationality, setNationality] = useState("");
  const [nationalityValue, setNationalityValue] = useState("");
  
  // 2단계: 기분 좋을 때 활동 선택 상태
  const [selectedActivities, setSelectedActivities] = useState([]);
  
  // 3단계: 기분 안 좋을 때 활동 선택 상태
  const [selectedBadMoodActivities, setSelectedBadMoodActivities] = useState([]);
  
  // 모달 상태
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
  const [isNationalityModalOpen, setIsNationalityModalOpen] = useState(false);
  
  // 필드 ref (모달 위치 계산용)
  const languageFieldRef = useRef(null);
  const nationalityFieldRef = useRef(null);
  
  // 언어 옵션 목록
  const languageOptions = [
    { id: "ko", value: "ko", label: "한국어", icon: "🇰🇷" },
    { id: "en", value: "en", label: "English", icon: "🇺🇸" },
    { id: "ja", value: "ja", label: "日本語", icon: "🇯🇵" },
    { id: "zh", value: "zh", label: "中文", icon: "🇨🇳" },
    { id: "es", value: "es", label: "Español", icon: "🇪🇸" },
    { id: "fr", value: "fr", label: "Français", icon: "🇫🇷" },
    { id: "de", value: "de", label: "Deutsch", icon: "🇩🇪" },
    { id: "pt", value: "pt", label: "Português", icon: "🇵🇹" },
    { id: "ru", value: "ru", label: "Русский", icon: "🇷🇺" },
    { id: "ar", value: "ar", label: "العربية", icon: "🇸🇦" },
  ];
  
  // 국적 옵션 목록
  const nationalityOptions = [
    { id: "kr", value: "kr", label: "대한민국", icon: "🇰🇷" },
    { id: "us", value: "us", label: "United States", icon: "🇺🇸" },
    { id: "jp", value: "jp", label: "日本", icon: "🇯🇵" },
    { id: "cn", value: "cn", label: "中国", icon: "🇨🇳" },
    { id: "gb", value: "gb", label: "United Kingdom", icon: "🇬🇧" },
    { id: "ca", value: "ca", label: "Canada", icon: "🇨🇦" },
    { id: "au", value: "au", label: "Australia", icon: "🇦🇺" },
    { id: "de", value: "de", label: "Germany", icon: "🇩🇪" },
    { id: "fr", value: "fr", label: "France", icon: "🇫🇷" },
    { id: "it", value: "it", label: "Italy", icon: "🇮🇹" },
    { id: "es", value: "es", label: "Spain", icon: "🇪🇸" },
    { id: "br", value: "br", label: "Brazil", icon: "🇧🇷" },
    { id: "mx", value: "mx", label: "Mexico", icon: "🇲🇽" },
    { id: "in", value: "in", label: "India", icon: "🇮🇳" },
    { id: "ru", value: "ru", label: "Russia", icon: "🇷🇺" },
  ];

  // 활동 옵션 목록 (기분 좋을 때 - 언어에 따라 동적으로 변경)
  // 언어가 변경될 때마다 재생성되도록 useMemo 사용
  const activityOptions = useMemo(() => [
    { id: "shopping", label: t("shopping"), icon: "🛍️" },
    { id: "food", label: t("food"), icon: "🥑" },
    { id: "culture", label: t("culture"), icon: "🗽" },
    { id: "nature", label: t("nature"), icon: "🌳" },
    { id: "language", label: t("languageExchange"), icon: "🍸" },
    { id: "tourism", label: t("tourism"), icon: "🧳" },
  ], [t]);

  /**
   * 1단계 완료 버튼 활성화 조건
   * 표시 언어와 국적이 모두 선택되었을 때만 활성화
   */
  const isStep1Complete = displayLanguage.trim() !== "" && nationality.trim() !== "";
  
  /**
   * 2단계 완료 버튼 활성화 조건
   * 최소 1개 이상의 활동이 선택되었을 때만 활성화
   */
  const isStep2Complete = selectedActivities.length > 0;
  
  /**
   * 3단계 완료 버튼 활성화 조건
   * 최소 1개 이상의 활동이 선택되었을 때만 활성화
   */
  const isStep3Complete = selectedBadMoodActivities.length > 0;

  /**
   * 기분 좋을 때 활동 선택/해제 핸들러
   * 최대 3개까지만 선택 가능
   */
  const handleActivityToggle = (activityId) => {
    setSelectedActivities((prev) => {
      // 이미 선택된 항목이면 해제
      if (prev.includes(activityId)) {
        return prev.filter((id) => id !== activityId);
      }
      // 최대 3개까지만 선택 가능
      if (prev.length >= 3) {
        return prev;
      }
      // 새 항목 추가
      return [...prev, activityId];
    });
  };

  /**
   * 기분 안 좋을 때 활동 선택/해제 핸들러
   * 최대 3개까지만 선택 가능
   */
  const handleBadMoodActivityToggle = (activityId) => {
    setSelectedBadMoodActivities((prev) => {
      // 이미 선택된 항목이면 해제
      if (prev.includes(activityId)) {
        return prev.filter((id) => id !== activityId);
      }
      // 최대 3개까지만 선택 가능
      if (prev.length >= 3) {
        return prev;
      }
      // 새 항목 추가
      return [...prev, activityId];
    });
  };

  /**
   * 다음 단계로 이동하는 핸들러
   */
  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      // 3단계 완료 시 메인 페이지로 이동 (또는 적절한 페이지로)
      // navigate("/");
      console.log("Onboarding completed!");
    }
  };

  /**
   * 이전 단계로 돌아가는 핸들러
   */
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      // 1단계에서 뒤로가기를 누르면 이전 페이지로 이동
      navigate(-1);
    }
  };

  /**
   * 완료 버튼 클릭 핸들러
   */
  const handleComplete = async () => {
    if (currentStep === 1 && isStep1Complete) {
      // 1단계 완료 시 언어/국적 정보를 서버에 저장
      try {
        await updateNationality(displayLanguageValue, nationalityValue);
        handleNext();
      } catch (error) {
        console.error("Failed to update nationality:", error);
        // 에러가 발생해도 다음 단계로 진행
        handleNext();
      }
    } else if (currentStep === 2 && isStep2Complete) {
      handleNext();
    } else if (currentStep === 3 && isStep3Complete) {
      // 3단계 완료 시 관심사 정보를 서버에 저장
      try {
        await updateInterests(selectedActivities, selectedBadMoodActivities);
        console.log("Onboarding completed!", {
          language: displayLanguageValue,
          nationality: nationalityValue,
          goodMoodActivities: selectedActivities,
          badMoodActivities: selectedBadMoodActivities,
        });
        // 관심사 변경 모드인 경우 마이페이지로 이동, 아니면 환영 페이지로 이동
        if (isInterestChange) {
          navigate("/mypage");
        } else {
          navigate("/welcome");
        }
      } catch (error) {
        console.error("Failed to update interests:", error);
        // 에러가 발생해도 관심사 변경 모드인 경우 마이페이지로 이동
        if (isInterestChange) {
          navigate("/mypage");
        } else {
          navigate("/welcome");
        }
      }
    }
  };

  /**
   * 1단계 렌더링: 표시 언어 및 국적 선택
   */
  const renderStep1 = () => (
    <>
      {/* 표시 언어 섹션 */}
      <S.Section $isFirst={true}>
        <S.SectionContent>
          <S.SectionTitle>{t("displayLanguage")}</S.SectionTitle>
          <S.SectionDescription>
            {t("displayLanguageDesc")}
            {t("displayLanguageDescEn") && (
              <>
                <br />
                <span style={{ color: '#838383' }}>{t("displayLanguageDescEn")}</span>
              </>
            )}
          </S.SectionDescription>
        </S.SectionContent>
        <S.FieldWrapper>
          <S.Field ref={languageFieldRef} onClick={() => setIsLanguageModalOpen(true)}>
            <S.FieldIcon>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="29" height="19">
                <path d="M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v1.99h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z" fill="#3D3D3D"/>
              </svg>
            </S.FieldIcon>
            <S.FieldLabel>
              {displayLanguage || t("displayLanguage")}
            </S.FieldLabel>
          </S.Field>
        </S.FieldWrapper>
      </S.Section>

      {/* 국적 선택 섹션 */}
      <S.Section $isFirst={false}>
        <S.SectionContent>
          <S.SectionTitle>{t("nationality")}</S.SectionTitle>
          <S.SectionDescription>
            {t("nationalityDesc")}
            {t("nationalityDescEn") && (
              <>
                <br />
                <span style={{ color: '#838383' }}>{t("nationalityDescEn")}</span>
              </>
            )}
          </S.SectionDescription>
        </S.SectionContent>
        <S.FieldWrapper>
          <S.Field ref={nationalityFieldRef} onClick={() => setIsNationalityModalOpen(true)}>
            <S.FieldIcon>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="29" height="29">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" fill="#3D3D3D"/>
              </svg>
            </S.FieldIcon>
            <S.FieldLabel>
              {nationality || t("nationality")}
            </S.FieldLabel>
          </S.Field>
        </S.FieldWrapper>
      </S.Section>
    </>
  );
  
  /**
   * 2단계 렌더링: 활동 선택
   */
  const renderStep2 = () => (
    <>
      {/* 질문 섹션 */}
      <S.QuestionSection>
        <S.QuestionTitle>
          {t("question")}
        </S.QuestionTitle>
        <S.QuestionSubtitle>
          {t("questionSubtitle")}
        </S.QuestionSubtitle>
        <S.QuestionLimit>
          {t("questionLimit").split("3").map((part, index, array) => 
            index === array.length - 1 ? (
              <span key={index}>{part}</span>
            ) : (
              <span key={index}>
                {part}
                <span style={{ color: "#5482FF" }}>3</span>
              </span>
            )
          )}
        </S.QuestionLimit>
      </S.QuestionSection>
      
      {/* 활동 선택 그리드 */}
      <S.ActivityGrid>
        {activityOptions.map((activity) => (
          <S.ActivityField
            key={activity.id}
            onClick={() => handleActivityToggle(activity.id)}
            $isSelected={selectedActivities.includes(activity.id)}
            $isDisabled={!selectedActivities.includes(activity.id) && selectedActivities.length >= 3}
          >
            <S.ActivityIcon>{activity.icon}</S.ActivityIcon>
            <S.ActivityLabel>{activity.label}</S.ActivityLabel>
          </S.ActivityField>
        ))}
      </S.ActivityGrid>
      
      {/* 안내 문구 */}
      <S.InfoText>
        {t("questionModify")}
      </S.InfoText>
    </>
  );
  
  /**
   * 3단계 렌더링: 기분 안 좋을 때 활동 선택
   */
  const renderStep3 = () => (
    <>
      {/* 질문 섹션 */}
      <S.QuestionSection>
        <S.QuestionTitle>
          {t("badMoodQuestion")}
        </S.QuestionTitle>
        <S.QuestionSubtitle>
          {t("badMoodSubtitle")}
        </S.QuestionSubtitle>
        <S.QuestionLimit>
          {t("badMoodLimit").split("3").map((part, index, array) => 
            index === array.length - 1 ? (
              <span key={index}>{part}</span>
            ) : (
              <span key={index}>
                {part}
                <span style={{ color: "#5482FF" }}>3</span>
              </span>
            )
          )}
        </S.QuestionLimit>
      </S.QuestionSection>
      
      {/* 활동 선택 그리드 - 기분 좋을 때와 동일한 카테고리 사용 */}
      <S.ActivityGrid>
        {activityOptions.map((activity) => (
          <S.ActivityField
            key={activity.id}
            onClick={() => handleBadMoodActivityToggle(activity.id)}
            $isSelected={selectedBadMoodActivities.includes(activity.id)}
            $isDisabled={!selectedBadMoodActivities.includes(activity.id) && selectedBadMoodActivities.length >= 3}
          >
            <S.ActivityIcon>{activity.icon}</S.ActivityIcon>
            <S.ActivityLabel>{activity.label}</S.ActivityLabel>
          </S.ActivityField>
        ))}
      </S.ActivityGrid>
      
      {/* 안내 문구 */}
      <S.InfoText>
        {t("badMoodModify")}
      </S.InfoText>
    </>
  );

  return (
    <S.Container>
      {/* 헤더: 뒤로가기 버튼 */}
      <S.Header>
        <S.BackButton type="button" onClick={handleBack}>
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M15 18L9 12L15 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </S.BackButton>
        <S.Title>{t("onboarding")}</S.Title>
        <S.HeaderSpacer />
      </S.Header>

      {/* 단계 인디케이터 */}
      <S.StepIndicator>
        <S.StepBar $isActive={currentStep >= 1} />
        <S.StepBar $isActive={currentStep >= 2} />
        <S.StepBar $isActive={currentStep >= 3} />
      </S.StepIndicator>

      {/* 단계별 컨텐츠 */}
      <S.ContentWrapper>
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
      </S.ContentWrapper>

      {/* 완료 버튼 */}
      <S.SubmitButton
        type="button"
        onClick={handleComplete}
        disabled={
          (currentStep === 1 && !isStep1Complete) ||
          (currentStep === 2 && !isStep2Complete) ||
          (currentStep === 3 && !isStep3Complete)
        }
        $isEnabled={
          (currentStep === 1 && isStep1Complete) ||
          (currentStep === 2 && isStep2Complete) ||
          (currentStep === 3 && isStep3Complete)
        }
      >
        {t("complete")}
      </S.SubmitButton>
      
      {/* 언어 선택 모달 */}
      <SidebarModal
        isOpen={isLanguageModalOpen}
        onClose={() => setIsLanguageModalOpen(false)}
        options={languageOptions}
        selectedValue={displayLanguageValue}
        onSelect={(option) => {
          setDisplayLanguage(option.label);
          setDisplayLanguageValue(option.value);
          // 선택한 언어로 서비스 언어 변경
          changeLanguage(option.value);
        }}
        triggerRef={languageFieldRef}
      />
      
      {/* 국적 선택 모달 */}
      <SidebarModal
        isOpen={isNationalityModalOpen}
        onClose={() => setIsNationalityModalOpen(false)}
        options={nationalityOptions}
        selectedValue={nationalityValue}
        onSelect={(option) => {
          setNationality(option.label);
          setNationalityValue(option.value);
        }}
        triggerRef={nationalityFieldRef}
      />
    </S.Container>
  );
}
