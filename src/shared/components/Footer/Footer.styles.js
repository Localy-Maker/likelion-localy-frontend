import styled from "styled-components";
import { colors } from "@/styles/colors";
import { font } from "@/styles/font";

export const FooterWrapper = styled.footer`
  width: 100%;
  height: 60px;
  background: white;
  border-top: 1px solid ${colors.gray[200]};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${colors.gray[400]};
  ${font.regular14}
`;
