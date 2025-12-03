import styled from "styled-components";

export const TabsContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0px;
  gap: 7px;
  width: 125px;
  height: 32px;
  margin-bottom: 20px;
`;

export const TabButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 5px 10px;
  gap: 10px;
  height: 32px;
  background: ${({ $isActive }) => ($isActive ? "#C9C9C9" : "#FFFFFF")};
  border: ${({ $isActive }) => ($isActive ? "none" : "1px solid #E0E0E0")};
  border-radius: 6px;
  cursor: pointer;
  flex: none;

  &:hover {
    opacity: 0.8;
  }

  &:active {
    opacity: 0.6;
  }
`;

export const TabLabel = styled.span`
  font-family: "Inter";
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 22px;
  color: ${({ $isActive }) => ($isActive ? "#FFFFFF" : "#0D0D0D")};
  white-space: nowrap;
`;
