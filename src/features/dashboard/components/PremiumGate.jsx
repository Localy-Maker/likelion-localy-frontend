import styled from "styled-components";
import { useNavigate } from "react-router";
import { colors } from "@/styles/colors";
import { font } from "@/styles/font";

const Card = styled.div`
  position: relative;
  width: 100%;
  min-height: 280px;
  border: 1px solid ${colors.gray[300]};
  border-radius: 8px;
  background: ${colors.gray[100]};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 32px 24px;
  text-align: center;
`;

const PromptText = styled.p`
  ${font.semibold16}
  color: ${colors.blue[70]};
  margin: 0;
  text-align: center;
  line-height: 1.4;
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
  text-align: center;

  &:hover {
    opacity: 0.85;
  }
`;

/**
 * 비프리미엄 사용자에게 차트 대신 안내 카드를 노출.
 * 블러 처리가 차트의 절대 위치 요소들로 인해 깨지는 문제를 회피하기 위해
 * 차트를 렌더하지 않고 정적 placeholder 카드로 대체한다.
 *
 * @param {boolean} active - true 면 게이트 활성 (placeholder), false 면 children 그대로
 */
export default function PremiumGate({ active, children }) {
  const navigate = useNavigate();
  if (!active) return children;
  return (
    <Card>
      <PromptText>
        프리미엄 플랜으로
        <br />더 많은 정보를 볼 수 있어요
      </PromptText>
      <PromptLink type="button" onClick={() => navigate("/premium")}>
        프리미엄 플랜 보기
      </PromptLink>
    </Card>
  );
}
