import styled from "styled-components";
import { colors } from "@/styles/colors";
import { font } from "@/styles/font";

export const Container = styled.div`
  position: relative;
  width: 100%;
  max-width: 800px;
  min-height: 100vh;
  background: ${colors.gray[100]};
  margin: 0 auto;
  padding-bottom: 120px;
  display: flex;
  flex-direction: column;
`;

export const TopRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 24px 24px 12px;
`;

export const LocalyLogo = styled.span`
  font-family: 'Fredoka One', sans-serif;
  font-size: 24px;
  line-height: 1.4;
  color: ${colors.blue[50]};
  letter-spacing: -0.02em;
`;

export const PlanSubtitle = styled.span`
  ${font.semibold16}
  color: ${colors.blue[50]};
`;

export const PremiumChip = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 5px 12px;
  border-radius: 8px;
  background: #1976D2;
  color: #FFFFFF;
  ${font.medium12}
  letter-spacing: -0.43px;
  margin: 0 24px;
  width: fit-content;
`;

export const SectionsWrapper = styled.section`
  padding: 16px 24px 8px;
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

export const SectionTitle = styled.h2`
  ${font.semibold14}
  color: ${colors.gray[900]};
  margin: 0 0 4px;
  letter-spacing: -0.26px;
`;

export const SectionLine = styled.p`
  ${font.regular12}
  color: ${colors.gray[800]};
  margin: 0;
  letter-spacing: 0.06px;
  line-height: 1.5;
`;

export const Spacer = styled.div`
  height: 8px;
  background: ${colors.gray[200]};
  margin: 16px 0 12px;
`;

export const PlanCards = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 0 24px;
`;

export const PlanCard = styled.button`
  position: relative;
  width: 100%;
  min-height: 98px;
  padding: 14px 20px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  background: ${(p) => (p.$selected ? colors.blue[50] : colors.gray[200])};
  color: ${(p) => (p.$selected ? colors.gray[100] : colors.gray[800])};
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  transition: background 0.15s;
`;

export const PlanTitle = styled.div`
  ${font.semibold14}
  letter-spacing: -0.26px;
`;

export const PlanHint = styled.div`
  ${font.bold10 ?? "font-size: 10px; font-weight: 700;"}
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.06px;
`;

export const PlanDescription = styled.div`
  ${font.regular12}
  letter-spacing: 0.06px;
`;

export const SubscribeButton = styled.button`
  position: fixed;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%);
  width: calc(100% - 48px);
  max-width: 327px;
  height: 53px;
  border: none;
  border-radius: 8px;
  cursor: ${(p) => (p.disabled ? "not-allowed" : "pointer")};
  background: ${(p) => (p.disabled ? colors.gray[300] : "#1A1A1A")};
  color: ${(p) => (p.disabled ? colors.gray[900] : colors.gray[100])};
  ${font.semibold14}
  letter-spacing: -0.26px;
`;

export const ModalBackdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1100;
  padding: 20px;
`;

export const ModalCard = styled.div`
  width: 100%;
  max-width: 320px;
  background: ${colors.gray[100]};
  border-radius: 12px;
  padding: 24px 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const ModalTitle = styled.div`
  ${font.semibold14}
  color: ${colors.gray[900]};
  text-align: left;
`;

export const BenefitList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const BenefitItem = styled.li`
  ${font.regular12}
  color: ${colors.gray[800]};
  display: flex;
  align-items: flex-start;
  gap: 6px;
  letter-spacing: 0.06px;

  &::before {
    content: "";
    flex: 0 0 14px;
    width: 14px;
    height: 14px;
    margin-top: 2px;
    border-radius: 50%;
    background: ${colors.blue[50]};
    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 14 14'><path d='M3 7l3 3 5-6' stroke='white' stroke-width='2' fill='none' stroke-linecap='round' stroke-linejoin='round'/></svg>");
    background-size: contain;
    background-repeat: no-repeat;
  }
`;

export const ModalNote = styled.div`
  ${font.regular12}
  color: ${colors.gray[600]};
  text-align: center;
`;

export const ModalConfirmButton = styled.button`
  background: ${colors.blue[50]};
  color: ${colors.gray[100]};
  border: none;
  border-radius: 8px;
  padding: 12px;
  ${font.semibold14}
  cursor: pointer;

  &:disabled {
    background: ${colors.gray[300]};
    cursor: not-allowed;
  }
`;
