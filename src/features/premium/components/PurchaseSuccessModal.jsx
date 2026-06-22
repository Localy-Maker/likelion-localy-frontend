import * as S from "../styles/PremiumModals.styles";

export default function PurchaseSuccessModal({ isOpen, days, onClose }) {
  if (!isOpen) return null;

  return (
    <S.DimmedOverlay onClick={onClose}>
      <S.SuccessModal onClick={(event) => event.stopPropagation()}>
        <S.SuccessTitle>구매 성공!</S.SuccessTitle>
        <S.SuccessMessage>
          오늘부터 {days}일간 프리미엄 플랜이 적용됩니다.
        </S.SuccessMessage>
      </S.SuccessModal>
    </S.DimmedOverlay>
  );
}
