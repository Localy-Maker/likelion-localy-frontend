import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import PurchaseConfirmSheet from "../components/PurchaseConfirmSheet";
import PurchaseSuccessModal from "../components/PurchaseSuccessModal";
import {
  getPremiumPlans,
  mapBePlansToUi,
  subscribePremiumPlan,
} from "../api/premiumApi";
import { PREMIUM_BENEFITS, PREMIUM_PLANS } from "../constants/premiumPlans";
import usePremiumStatus from "@/shared/hooks/usePremiumStatus";
import * as S from "../styles/PremiumPlanPage.styles";

export default function PremiumPlanPage() {
  const navigate = useNavigate();
  const premiumStatus = usePremiumStatus();
  const [plans, setPlans] = useState(PREMIUM_PLANS);
  const [currentPoint, setCurrentPoint] = useState(null);
  const [selectedPlanId, setSelectedPlanId] = useState(PREMIUM_PLANS[0].id);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedPlan = plans.find((plan) => plan.id === selectedPlanId);

  useEffect(() => {
    const loadPlans = async () => {
      try {
        const data = await getPremiumPlans();
        if (data?.plans?.length) {
          setPlans(mapBePlansToUi(data.plans));
          setSelectedPlanId(data.plans[0].code);
        }
        if (typeof data?.currentPoint === "number") {
          setCurrentPoint(data.currentPoint);
        }
      } catch {
        // BE 미연결 시 기본 상수 사용
      }
    };

    loadPlans();
  }, []);

  const handleSubscribeClick = () => {
    if (premiumStatus.isPremium) return;
    setIsConfirmOpen(true);
  };

  const handleConfirmPurchase = async () => {
    if (!selectedPlan || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const result = await subscribePremiumPlan(selectedPlan.planCode);
      if (typeof result?.currentPoint === "number") {
        setCurrentPoint(result.currentPoint);
      }
      setIsConfirmOpen(false);
      setIsSuccessOpen(true);
    } catch (error) {
      const message =
        error.response?.data?.message || "프리미엄 구독에 실패했습니다.";
      alert(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSuccessClose = () => {
    setIsSuccessOpen(false);
    navigate(-1);
  };

  return (
    <>
      <S.Header>
        <S.BackButton type="button" onClick={() => navigate(-1)} aria-label="뒤로가기">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="24" height="24">
            <path
              d="M15 18L9 12L15 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </S.BackButton>
        <S.Title>프리미엄 플랜</S.Title>
      </S.Header>

      <S.Container>
        <S.Badge>Premium</S.Badge>

        <S.BrandRow>
          <S.BrandName>Localy</S.BrandName>
          <S.PlanTitle>프리미엄 플랜</S.PlanTitle>
        </S.BrandRow>

        {currentPoint !== null && (
          <S.PointSummary>보유 포인트 {currentPoint}P</S.PointSummary>
        )}

        {PREMIUM_BENEFITS.map((benefit) => (
          <S.BenefitSection key={benefit.id}>
            <S.BenefitTitle>{benefit.title}</S.BenefitTitle>
            <S.BenefitDescription>{benefit.description}</S.BenefitDescription>
          </S.BenefitSection>
        ))}

        <S.SectionDivider />

        <S.PlanList>
          {plans.map((plan) => (
            <S.PlanCard
              key={plan.id}
              type="button"
              $selected={selectedPlanId === plan.id}
              onClick={() => setSelectedPlanId(plan.id)}
              disabled={premiumStatus.isPremium}
            >
              <S.PlanCardTitle>{plan.title}</S.PlanCardTitle>
              <S.PlanCardSubtitle>{plan.subtitle}</S.PlanCardSubtitle>
            </S.PlanCard>
          ))}
        </S.PlanList>

        {premiumStatus.isPremium && (
          <S.ActiveNotice>
            프리미엄 플랜이 적용 중입니다.
            {premiumStatus.remainingDays != null
              ? ` (남은 ${premiumStatus.remainingDays}일)`
              : ""}
          </S.ActiveNotice>
        )}
      </S.Container>

      {!premiumStatus.isPremium && (
        <S.SubscribeBar>
          <S.SubscribeButton type="button" onClick={handleSubscribeClick}>
            프리미엄 구독하기
          </S.SubscribeButton>
        </S.SubscribeBar>
      )}

      <PurchaseConfirmSheet
        isOpen={isConfirmOpen}
        plan={selectedPlan}
        isSubmitting={isSubmitting}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmPurchase}
      />

      <PurchaseSuccessModal
        isOpen={isSuccessOpen}
        days={selectedPlan?.days}
        onClose={handleSuccessClose}
      />
    </>
  );
}
