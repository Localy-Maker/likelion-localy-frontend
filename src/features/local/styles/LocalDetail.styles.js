import styled from "styled-components";
import { colors } from "@/styles/colors";
import { font } from "@/styles/font";

export const DetailContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;

  & > *:last-child {
    border-bottom: none;
  }
`;

export const InfoSection = styled.div`
  display: flex;
  align-items: center;
  border-bottom: 1px solid ${colors.gray[200]};
  padding: 16px;
  gap: 40px;
`;

export const Category = styled.div`
  ${font.regular14}
  color: ${colors.gray[600]};
`;

export const DetailLabel = styled.div`
  ${font.medium14}
  color: ${colors.gray[900]};
  min-width: 80px;
  flex-shrink: 0;
`;

export const DetailValue = styled.div`
  ${font.regular14}
  color: ${colors.gray[600]};
`;

export const DescriptionContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export const ShortDescription = styled.div`
  ${font.regular14}
  color: ${colors.gray[700]};
  line-height: 1.6;
`;

export const LongDescriptionContainer = styled.div`
  padding: 0px 16px;
`;

export const Description = styled.div`
  ${font.regular14}
  color: ${colors.gray[600]};
  line-height: 1.6;
  border: 1px solid ${colors.gray[200]};
  border-radius: 8px;
  padding: 16px;
`;

