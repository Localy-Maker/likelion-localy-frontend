import styled from "styled-components";

export const PageWrapper = styled.div`
  width: 100%;
  max-width: 800px; /* Figma Width */
  min-height: 812px; /* Figma Height: 812px */
  margin: 0 auto;
  background: #ffffff; /* Figma Background */
  display: flex;
  flex-direction: column;
  position: relative;
`;

export const ScrollableContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 0 16px; /* 좌우 Padding 유지 */
  display: flex;
  flex-direction: column;
  padding-bottom: 24px;
  padding-top: 4px;
`;
