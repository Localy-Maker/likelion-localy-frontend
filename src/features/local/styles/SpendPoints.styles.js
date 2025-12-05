import styled from "styled-components";
import { colors } from "@/styles/colors";
import { font } from "@/styles/font";

export const Container = styled.div`
  padding: 40px 20px;
  max-width: 800px;
  margin: 100px auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
`;

export const EmotionItem = styled.div`
  display: flex;
  align-items: center;
  margin-top: 100px;
  gap: 10px;
`;

export const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const ContentTitle = styled.div`
  ${font.bold32}
  color: ${colors.gray[300]};
`;

export const ContentDescription = styled.div`
  ${font.medium14}
  color: ${colors.gray[300]};
`;

