import * as S from "../styles/PremiumModals.styles";

export default function PurchaseConfirmSheet({
  isOpen,
  plan,
  isSubmitting,
  onClose,
  onConfirm,
}) {
  if (!isOpen || !plan) return null;

  const benefitItems = [
    "심층 심리 분석 리포트",
    "미션 참여 기회 확대",
    "AI 챗봇 이용 확대",
    `${plan.points}P 차감`,
  ];

  return (
    <S.DimmedOverlay onClick={onClose}>
      <S.BottomSheet onClick={(event) => event.stopPropagation()}>
        <S.SheetTitle>{plan.days}일권 프리미엄 플랜을 구매할까요?</S.SheetTitle>

        <S.BenefitList>
          {benefitItems.map((item) => (
            <S.BenefitItem key={item}>
              <S.CheckIcon aria-hidden="true">✓</S.CheckIcon>
              <span>{item}</span>
            </S.BenefitItem>
          ))}
        </S.BenefitList>

        <S.PointNote>{plan.points}P가 차감됩니다</S.PointNote>

        <S.PrimaryButton type="button" onClick={onConfirm} disabled={isSubmitting}>
          {isSubmitting ? "구매 중..." : "구매하기"}
        </S.PrimaryButton>
      </S.BottomSheet>
    </S.DimmedOverlay>
  );
}
