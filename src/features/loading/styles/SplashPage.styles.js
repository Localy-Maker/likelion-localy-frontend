import styled from "styled-components";

export const Container = styled.div`
  position: relative;
  width: 375px;
  height: 100vh;
  max-height: 100vh;
  background: #FFFFFF;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

export const Logo = styled.h1`
  position: absolute;
  width: 136px;
  height: 62px;
  left: calc(50% - 136px/2 - 0.5px);
  top: 25%;
  font-family: 'Fredoka One';
  font-style: normal;
  font-weight: 400;
  font-size: 44px;
  line-height: 140%;
  display: flex;
  align-items: center;
  letter-spacing: -0.02em;
  color: #5482FF;
  margin: 0;
`;

export const Slogan = styled.p`
  position: absolute;
  width: 275px;
  height: 22px;
  left: calc(50% - 275px/2);
  top: calc(25% + 80px);
  font-family: 'Quicksand';
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 140%;
  display: flex;
  align-items: center;
  letter-spacing: -0.02em;
  color: #0D0D0D;
  margin: 0;
`;

export const CharactersGroup = styled.div`
  position: absolute;
  bottom: 15%;
  left: 50%;
  transform: translateX(-50%);
  width: 280px;
  height: 120px;
`;

export const CharacterWrapper = styled.div`
  position: absolute;
  
  /* 각 캐릭터별 위치 조정 - 2줄 배치 (움직임 없음) */
  &:nth-child(1) {
    /* 행복 - 왼쪽 위 */
    left: 0px;
    top: 0px;
  }
  
  &:nth-child(2) {
    /* 슬픔 - 중앙 위 */
    left: 100px;
    top: 0px;
  }
  
  &:nth-child(3) {
    /* 분노 - 오른쪽 위 */
    left: 200px;
    top: 0px;
  }
  
  &:nth-child(4) {
    /* 우울 - 왼쪽 아래 */
    left: 20px;
    top: 60px;
  }
  
  &:nth-child(5) {
    /* 중립 - 중앙 아래 */
    left: 120px;
    top: 65px;
  }
  
  &:nth-child(6) {
    /* 불안 - 오른쪽 아래 */
    left: 220px;
    top: 65px;
  }
`;

