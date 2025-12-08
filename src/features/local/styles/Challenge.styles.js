import styled from "styled-components";
import { colors } from "@/styles/colors";
import { font } from "@/styles/font";

export const Container = styled.div`
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const MissionCard = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  transition: opacity 0.3s;
  padding: 20px 9px;
  background-color: ${colors.blue[10]};
  border-radius: 8px;
`;

export const MissionCardContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
`;

export const MissionCardTitle = styled.div`
  ${font.semibold16}
  color: ${colors.gray[900]};
`;

export const MissionCardTime = styled.div`
  ${font.medium14}
  color: ${colors.gray[500]};
`;

export const MissionPoint = styled.div`
flex-shrink: 0;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 40px;
  border: 1px solid ${props => props.$isCompleted ? colors.gray[500] : colors.blue[50]};
  gap: 2px;
`;

export const PointValue = styled.div`
  ${font.semibold16}
  color: ${colors.gray[900]};
`;

export const PointUnit = styled.div`
  ${font.semibold14}
  color: ${colors.gray[900]};
`;

export const PlaceCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  box-shadow: 0px 2px 24px 2px #00000014;
  border-radius: 18px;
  padding: 8px 8px 12px 8px;
`;

export const PlaceCardContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 13px;
  border: 1px solid ${colors.gray[200]};
  border-radius: 18px;
`;

export const DetailLabel = styled.div`
  ${font.medium14}
  color: ${colors.gray[900]};
`;

export const OpeningHours = styled.div`
  ${font.regular10}
  color: ${colors.gray[900]};
`;

export const DetailValue = styled.div`
  ${font.regular10}
  color: ${colors.gray[600]};
  display: flex;
  align-items: flex-end;
`;

export const DescriptionContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const ShortDescriptionContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
`;

export const ShortDescription = styled.div`
  ${font.regular14}
  color: ${colors.gray[900]};
  line-height: 1.6;
`;

export const CertificationButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 13px 0px;
`;

export const CertificationButton = styled.button`
  ${font.medium12}
  color: ${colors.gray[100]};
  border-radius: 6px;
  padding: 5px 10px;
  cursor: pointer;
  border: none;
  background: ${colors.gray[300]};
  min-width: 120px;
  min-height: 36px;
`;

export const MapIconContainer = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
`;

export const CertificationText = styled.div`
  ${font.medium12}
  color: ${colors.gray[600]};
`;

export const LoadingMessage = styled.div`
  ${font.regular16}
  color: ${colors.gray[600]};
  text-align: center;
  padding: 40px 20px;
`;

