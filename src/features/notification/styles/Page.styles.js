import styled from "styled-components";

export const PageWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 375px;
  min-height: 812px;
  margin: 0 auto;
  background: #ffffff;
  display: flex;
  flex-direction: column;
`;

export const ScrollableContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 0 16px;
  padding-bottom: 24px;
`;
