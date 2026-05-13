import styled from "styled-components";
import { useNavigate } from "react-router";
import { colors } from "@/styles/colors";
import { font } from "@/styles/font";

const Wrapper = styled.div`
  position: relative;
`;

const BlurredContent = styled.div`
  filter: blur(6px);
  pointer-events: none;
  user-select: none;
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  text-align: center;
  padding: 16px;
`;

const PromptText = styled.p`
  ${font.semibold16}
  color: ${colors.blue[70]};
  margin: 0;
  white-space: pre-line;
`;

const PromptLink = styled.button`
  ${font.medium12}
  color: ${colors.blue[70]};
  background: none;
  border: none;
  cursor: pointer;
  text-decoration: underline;
  padding: 4px 8px;
  letter-spacing: -0.43px;

  &:hover {
    opacity: 0.85;
  }
`;

/**
 * 비프리미엄 사용자에게 차트 영역을 블러 처리하고 프리미엄 유도 CTA 를 오버레이.
 * @param {boolean} active - true 면 게이트 활성 (블러+오버레이), false 면 children 그대로
 */
export default function PremiumGate({ active, children }) {
  const navigate = useNavigate();
  if (!active) return children;
  return (
    <Wrapper>
      <BlurredContent aria-hidden="true">{children}</BlurredContent>
      <Overlay>
        <PromptText>{"프리미엄 플랜으로\n더 많은 정보를 볼 수 있어요"}</PromptText>
        <PromptLink type="button" onClick={() => navigate("/premium")}>
          프리미엄 플랜 보기
        </PromptLink>
      </Overlay>
    </Wrapper>
  );
}
