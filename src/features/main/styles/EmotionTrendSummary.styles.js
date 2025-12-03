import styled from "styled-components";

export const SummaryContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
`;

export const SummaryHeader = styled.div`
  display: flex;
  justify-content: start;
  gap: 8px;
  align-items: center;
  padding: 8px 0;
`;

export const SummaryTitle = styled.h2`
  font-family: "Inter";
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 140%;
  letter-spacing: -0.02em;
  color: #0d0d0d;
  margin: 0;
`;

export const ChevronButton = styled.button`
  width: 20px;
  height: 20px;
  padding: 0;
  border: none;
  background: #e0e0e0;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    opacity: 0.7;
  }
`;

export const TrendContent = styled.div`
  box-sizing: border-box;
  width: 100%;
  height: 98px;
  background: transparent;

  border: 1px solid #e0e0e0;
  border-radius: 8px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;

  color: #0d0d0d;
  text-align: center;
`;
