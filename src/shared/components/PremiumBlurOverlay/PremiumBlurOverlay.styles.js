import styled from "styled-components";

export const Overlay = styled.button`
  position: absolute;
  inset: 0;
  border: none;
  padding: 0;
  margin: 0;
  background: rgba(255, 255, 255, 0.72);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  cursor: pointer;
  z-index: 20;
`;

export const Description = styled.p`
  margin: 0;
  max-width: 176px;
  font-family: "Inter", sans-serif;
  font-weight: 500;
  font-size: 14px;
  line-height: 22px;
  text-align: center;
  color: #606060;
  white-space: pre-line;
`;

export const Cta = styled.span`
  font-family: "Inter", sans-serif;
  font-weight: 600;
  font-size: 14px;
  line-height: 22px;
  color: #5482ff;
`;
