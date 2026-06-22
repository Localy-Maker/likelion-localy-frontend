import { useNavigate } from "react-router";
import * as S from "./PremiumBlurOverlay.styles";

export default function PremiumBlurOverlay({
  onClick,
  description = "프리미엄 플랜으로\n더 많은 정보를 볼 수 있어요",
  ctaText = "프리미엄 플랜 보기",
}) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
      return;
    }
    navigate("/premium");
  };

  return (
    <S.Overlay type="button" onClick={handleClick} aria-label={ctaText}>
      <S.Description>{description}</S.Description>
      <S.Cta>{ctaText}</S.Cta>
    </S.Overlay>
  );
}
