import styled from "styled-components";
import { colors } from "@/styles/colors";
import { font } from "@/styles/font";

export const Container = styled.div`
  padding: 40px 20px;
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const LoadingMessage = styled.div`
  ${font.regular16}
  color: ${colors.gray[600]};
  text-align: center;
  padding: 40px 20px;
`;

export const ErrorMessage = styled.div`
  ${font.regular16}
  color: ${colors.error};
  text-align: center;
  padding: 40px 20px;
`;

