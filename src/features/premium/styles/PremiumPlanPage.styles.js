import styled from "styled-components";

export const Container = styled.div`
  position: relative;
  width: 100%;
  max-width: 375px;
  min-height: 100vh;
  margin: 0 auto;
  background: #ffffff;
  padding: 100px 24px 120px;
  box-sizing: border-box;
`;

export const Header = styled.header`
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 375px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ffffff;
  border-bottom: 1px solid #f3f3f3;
  z-index: 10;
`;

export const BackButton = styled.button`
  position: absolute;
  left: 22px;
  width: 24px;
  height: 24px;
  border: none;
  background: none;
  padding: 0;
  cursor: pointer;
  color: #0d0d0d;
`;

export const Title = styled.h1`
  margin: 0;
  font-family: "Inter", sans-serif;
  font-weight: 600;
  font-size: 16px;
  line-height: 22px;
  color: #0d0d0d;
`;

export const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 24px;
  padding: 0 12px;
  border-radius: 12px;
  background: #eef3ff;
  color: #5482ff;
  font-family: "Inter", sans-serif;
  font-weight: 600;
  font-size: 12px;
  line-height: 22px;
`;

export const BrandRow = styled.div`
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin: 8px 0 24px;
`;

export const BrandName = styled.h2`
  margin: 0;
  font-family: "Fredoka One", "Inter", sans-serif;
  font-weight: 400;
  font-size: 24px;
  line-height: 34px;
  color: #5482ff;
`;

export const PlanTitle = styled.h3`
  margin: 0;
  font-family: "Inter", sans-serif;
  font-weight: 600;
  font-size: 16px;
  line-height: 28px;
  color: #0d0d0d;
`;

export const PointSummary = styled.p`
  margin: 0 0 20px;
  font-family: "Inter", sans-serif;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  color: #5482ff;
`;

export const SectionDivider = styled.div`
  width: 100%;
  height: 8px;
  background: #f3f3f3;
  margin: 24px 0;
`;

export const BenefitSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const BenefitTitle = styled.h4`
  margin: 0;
  font-family: "Inter", sans-serif;
  font-weight: 600;
  font-size: 14px;
  line-height: 28px;
  color: #0d0d0d;
`;

export const BenefitDescription = styled.p`
  margin: 0;
  font-family: "Inter", sans-serif;
  font-weight: 400;
  font-size: 12px;
  line-height: 15px;
  color: #838383;
`;

export const PlanList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 8px;
`;

export const PlanCard = styled.button`
  width: 100%;
  min-height: 98px;
  border: 1px solid ${({ $selected }) => ($selected ? "#5482ff" : "#e0e0e0")};
  border-radius: 12px;
  background: ${({ $selected }) => ($selected ? "#f7f9ff" : "#ffffff")};
  padding: 14px 20px;
  text-align: left;
  cursor: pointer;
`;

export const PlanCardTitle = styled.div`
  font-family: "Inter", sans-serif;
  font-weight: 600;
  font-size: 16px;
  line-height: 28px;
  color: #0d0d0d;
`;

export const PlanCardSubtitle = styled.div`
  margin-top: 4px;
  font-family: "Inter", sans-serif;
  font-weight: 400;
  font-size: 12px;
  line-height: 15px;
  color: #838383;
`;

export const SubscribeBar = styled.div`
  position: fixed;
  left: 50%;
  bottom: 0;
  transform: translateX(-50%);
  width: 100%;
  max-width: 375px;
  padding: 16px 24px 24px;
  box-sizing: border-box;
  background: #ffffff;
  border-top: 1px solid #f3f3f3;
`;

export const SubscribeButton = styled.button`
  width: 100%;
  height: 53px;
  border: none;
  border-radius: 12px;
  background: #5482ff;
  color: #f7f9ff;
  font-family: "Inter", sans-serif;
  font-weight: 600;
  font-size: 16px;
  line-height: 28px;
  cursor: pointer;

  &:disabled {
    background: #c9c9c9;
    cursor: not-allowed;
  }
`;

export const ActiveNotice = styled.div`
  margin-top: 12px;
  padding: 12px 16px;
  border-radius: 8px;
  background: #f7f9ff;
  font-family: "Inter", sans-serif;
  font-size: 13px;
  line-height: 18px;
  color: #5482ff;
  text-align: center;
`;
