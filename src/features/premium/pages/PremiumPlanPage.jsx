import { useState } from "react";
import { useNavigate } from "react-router";
import * as S from "../styles/PremiumPlanPage.styles";
import Header from "@/shared/components/Header/Header";
import BottomNavigation from "@/shared/components/bottom/BottomNavigation";
import { purchasePremium } from "@/features/mypage/api/mypageApi";
import { useUserStore } from "@/shared/stores/userStore";

const PLANS = [
  {
    id: "WEEK",
    days: 7,
    price: 50,
    title: "7일권 50P",
    description: "7일간 프리미엄 플랜 혜택 즐기기",
    note: "(구독한 날부터 7일간)",
  },
  {
    id: "MONTH",
    days: 30,
    price: 200,
    title: "30일권 200P",
    description: "30일 (한 달)간 프리미엄 플랜 혜택 즐기기",
    note: "(구독한 날부터 30일간 / 7일 46P)",
  },
];

export default function PremiumPlanPage() {
  const navigate = useNavigate();
  const setPremium = useUserStore((s) => s.setPremium);

  const [selectedPlan, setSelectedPlan] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [purchasing, setPurchasing] = useState(false);

  const plan = PLANS.find((p) => p.id === selectedPlan) ?? null;

  const handlePurchaseClick = () => {
    if (!plan) return;
    setConfirmOpen(true);
  };

  const handleConfirm = async () => {
    if (!plan || purchasing) return;
    setPurchasing(true);
    try {
      await purchasePremium(plan.id);
      const expires = new Date();
      expires.setDate(expires.getDate() + plan.days);
      setPremium({ isPremium: true, premiumExpiresAt: expires.toISOString() });
      setConfirmOpen(false);
      setSuccessOpen(true);
    } catch (err) {
      const msg = err?.response?.data?.message || "구매에 실패했습니다.";
      alert(msg);
    } finally {
      setPurchasing(false);
    }
  };

  return (
    <>
      <Header text="프리미엄 플랜" onLeftClick={() => navigate(-1)} rightIcon={null} />
      <S.Container>
        <S.PremiumChip>Premium</S.PremiumChip>
        <S.TopRow>
          <S.LocalyLogo>Localy</S.LocalyLogo>
          <S.PlanSubtitle>프리미엄 플랜</S.PlanSubtitle>
        </S.TopRow>

        <S.SectionsWrapper>
          <div>
            <S.SectionTitle>심층 심리 분석 리포트</S.SectionTitle>
            <S.SectionLine>업데이트되는 모든 심리 분석 리포트 잠금해제</S.SectionLine>
          </div>
          <div>
            <S.SectionTitle>미션</S.SectionTitle>
            <S.SectionLine>· 프리미엄 미션 잠금 해제 (보상이 더 큰 미션)</S.SectionLine>
            <S.SectionLine>· 미션 개수 제한 증가 (2개 → 3개)</S.SectionLine>
          </div>
          <div>
            <S.SectionTitle>ai 챗봇</S.SectionTitle>
            <S.SectionLine>지난 대화 저장 범위 확대 (1개 → 5개)</S.SectionLine>
          </div>
        </S.SectionsWrapper>

        <S.Spacer />

        <S.PlanCards>
          {PLANS.map((p) => (
            <S.PlanCard
              key={p.id}
              type="button"
              $selected={selectedPlan === p.id}
              onClick={() => setSelectedPlan(p.id)}
            >
              <S.PlanTitle>{p.title}</S.PlanTitle>
              <S.PlanHint>{p.note}</S.PlanHint>
              <S.PlanDescription>{p.description}</S.PlanDescription>
            </S.PlanCard>
          ))}
        </S.PlanCards>

        <S.SubscribeButton
          type="button"
          onClick={handlePurchaseClick}
          disabled={!plan}
        >
          프리미엄 구독하기
        </S.SubscribeButton>
      </S.Container>

      {confirmOpen && plan ? (
        <S.ModalBackdrop role="dialog" aria-modal="true">
          <S.ModalCard>
            <S.ModalTitle>{plan.days}일권 프리미엄 플랜을 구매할까요?</S.ModalTitle>
            <S.BenefitList>
              <S.BenefitItem>업데이트되는 모든 심리 분석 리포트 잠금해제</S.BenefitItem>
              <S.BenefitItem>프리미엄 미션 잠금 해제 (보상이 더 큰 미션)</S.BenefitItem>
              <S.BenefitItem>미션 개수 제한 증가 (2개 → 3개)</S.BenefitItem>
              <S.BenefitItem>지난 대화 저장 범위 확대 (1개 → 5개)</S.BenefitItem>
            </S.BenefitList>
            <S.ModalNote>위 혜택이 {plan.days}일간 지속됩니다.</S.ModalNote>
            <S.ModalConfirmButton
              type="button"
              onClick={handleConfirm}
              disabled={purchasing}
            >
              {plan.price} P
            </S.ModalConfirmButton>
          </S.ModalCard>
        </S.ModalBackdrop>
      ) : null}

      {successOpen && plan ? (
        <S.ModalBackdrop role="dialog" aria-modal="true">
          <S.ModalCard>
            <S.ModalTitle>구매 성공!</S.ModalTitle>
            <S.ModalNote>오늘부터 {plan.days}일간 프리미엄 플랜이 적용됩니다.</S.ModalNote>
            <S.ModalConfirmButton
              type="button"
              onClick={() => {
                setSuccessOpen(false);
                navigate("/mypage");
              }}
            >
              확인
            </S.ModalConfirmButton>
          </S.ModalCard>
        </S.ModalBackdrop>
      ) : null}

      <BottomNavigation />
    </>
  );
}
