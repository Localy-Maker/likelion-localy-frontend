import styled from "styled-components";

export const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0px;
  gap: 8px;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  margin-bottom: 16px;

  &::-webkit-scrollbar {
    display: none;
  }
`;

export const ActionButton = styled.button`
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 5px 10px;
  gap: 4px;

  height: 28px;
  background: transparent;

  border: 1px solid #e0e0e0;
  border-radius: 6px;

  cursor: pointer;
  flex-shrink: 0;

  &:hover {
    background: #e0e0e0;
  }

  &:active {
    background: #e0e0e0;
  }
`;

export const IconWrapper = styled.div`
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ButtonLabel = styled.span`
  font-family: "Inter";
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 17px;
  color: #0d0d0d;
  white-space: nowrap;
`;
