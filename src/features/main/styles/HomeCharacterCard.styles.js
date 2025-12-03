import styled from "styled-components";

export const CardWrapper = styled.div`
  width: 100%;
  height: 115px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  gap: 22.25px;
  align-items: center;
  position: relative;
  box-sizing: border-box;
  background-color: #f7f9ff;
  padding: 17px;
  margin-bottom: 16px;
  &:hover {
    opacity: 0.9;
  }

  &:active {
    opacity: 0.8;
  }
`;

export const CharacterImage = styled.img`
  width: 70px;
  height: auto;
  object-fit: contain;
`;

export const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const TextHeader = styled.div`
  family-font: "Inter";
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 22px;
  letter-spacing: -0.43px;
  color: #0d0d0d;
  white-space: nowrap;
  overflow: hidden;
`;

export const TextBody = styled.div`
  family-font: "Inter";
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 22px;
  letter-spacing: -0.43px;
  color: #0d0d0d;
  white-space: nowrap;
  overflow: hidden;
`;
