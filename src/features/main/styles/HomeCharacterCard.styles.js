import styled from "styled-components";

/* Figma Frame 193: 343×115, radius 8, bg #F7F9FF. 요소는 절대좌표로 배치. */
export const CardWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 115px;
  border-radius: 8px;
  background-color: #f7f9ff;
  margin-bottom: 16px;
  cursor: pointer;
  box-sizing: border-box;
  &:hover {
    opacity: 0.9;
  }

  &:active {
    opacity: 0.8;
  }
`;

/* 캐릭터: Figma Group 123289 (약 47×60, left 34). 세로는 카드 중앙에 가깝다(top 28~). */
export const CharacterSlot = styled.div`
  position: absolute;
  left: 34px;
  top: 50%;
  transform: translateY(-50%);
  width: 60px;
  display: flex;
  justify-content: center;
`;

/* 텍스트: greeting left110/top22, body(Frame 234) left110/top54 → 컬럼 gap 10 으로 재현. */
export const TextContainer = styled.div`
  position: absolute;
  left: 110px;
  top: 22px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const TextHeader = styled.div`
  font-family: "Inter";
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 22px;
  letter-spacing: -0.43px;
  color: #0d0d0d;
  white-space: nowrap;
  overflow: hidden;
`;

export const TextBody = styled.div`
  font-family: "Inter";
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 22px;
  letter-spacing: -0.43px;
  color: #0d0d0d;
  white-space: nowrap;
  overflow: hidden;
`;
