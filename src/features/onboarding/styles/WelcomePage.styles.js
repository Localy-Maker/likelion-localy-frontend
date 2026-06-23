import styled from "styled-components";

export const Container = styled.div`
  position: relative;
  width: 100%;
  min-height: 100vh;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  padding: 0 24px;
`;

export const Logo = styled.div`
  width: 136px;
  height: 62px;
  margin: 143px auto 0;
  
  font-family: 'Fredoka One', 'Pretendard', sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 44px;
  line-height: 140%;
  display: flex;
  align-items: center;
  justify-content: center;
  letter-spacing: -0.02em;
  color: #5482ff;
`;

export const Slogan = styled.div`
  width: 275px;
  height: 22px;
  margin: 12px auto 0; /* 4px → 12px로 증가 */
  
  font-family: 'Quicksand', 'Pretendard', sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 140%;
  display: flex;
  align-items: center;
  justify-content: center;
  letter-spacing: -0.02em;
  color: #0d0d0d;
`;

export const WelcomeSection = styled.div`
  width: 100%;
  max-width: 331px;
  margin: 32px auto 0; /* 20px → 32px로 증가 */
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px; /* 16px → 24px로 증가 */
`;

export const WelcomeTitle = styled.div`
  width: 100%;
  height: 22px;
  font-family: 'Inter', 'Pretendard', sans-serif;
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 22px;
  text-align: center;
  letter-spacing: -0.43px;
  color: #0d0d0d;
`;

export const WelcomeMessage = styled.div`
  width: 220px;
  font-family: 'Inter', 'Pretendard', sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 15px;
  text-align: center;
  color: #3d3d3d;
`;

export const CharactersGroup = styled.div`
  width: 280px;
  height: 120px;
  margin: 32px auto 0; /* WelcomeSection 아래에 배치 */
  display: grid; /* Grid 레이아웃 적용 */
  grid-template-columns: repeat(3, 1fr); /* 3열 */
  grid-template-rows: repeat(2, 1fr); /* 2행 */
  gap: 10px; /* 캐릭터 간 간격 */
  align-items: center; /* 수직 중앙 정렬 */
  justify-items: center; /* 수평 중앙 정렬 */
`;

export const CharacterWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  
  /* 각 캐릭터별 위치 조정 - 2줄 배치 */
  &:nth-child(1) {
    /* 행복 - 왼쪽 위 */
    grid-column: 1;
    grid-row: 1;
  }
  
  &:nth-child(2) {
    /* 슬픔 - 중앙 위 */
    grid-column: 2;
    grid-row: 1;
  }
  
  &:nth-child(3) {
    /* 분노 - 오른쪽 위 */
    grid-column: 3;
    grid-row: 1;
  }
  
  &:nth-child(4) {
    /* 우울 - 왼쪽 아래 */
    grid-column: 1;
    grid-row: 2;
  }
  
  &:nth-child(5) {
    /* 중립 - 중앙 아래 */
    grid-column: 2;
    grid-row: 2;
  }
  
  &:nth-child(6) {
    /* 불안 - 오른쪽 아래 */
    grid-column: 3;
    grid-row: 2;
  }
`;

export const StartButton = styled.button`
  width: 100%;
  max-width: 327px;
  height: 40px;
  margin-top: auto;
  margin-bottom: 34px;
  margin-left: auto;
  margin-right: auto;
  background: #5482ff;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 0px;
  gap: 8px;
  
  font-family: 'Inter', 'Pretendard', sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 17px;
  color: #ffffff;
  
  &:hover {
    background: #4571e6;
  }
  
  &:active {
    background: #3a5fd4;
  }
`;

