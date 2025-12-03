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
  
  /* 각 캐릭터별 위치 조정 - 2줄 배치 */
  &:nth-child(1) {
    /* 행복 - 왼쪽 위 */
    left: 0px;
    top: 0px;
    animation: float1 ${props => props.$duration || 2.5}s ease-in-out infinite;
    animation-delay: ${props => props.$delay || 0}s;
  }
  
  &:nth-child(2) {
    /* 슬픔 - 중앙 위 */
    left: 100px;
    top: 0px;
    animation: float2 ${props => props.$duration || 2.8}s ease-in-out infinite;
    animation-delay: ${props => props.$delay || 0.3}s;
  }
  
  &:nth-child(3) {
    /* 분노 - 오른쪽 위 */
    left: 200px;
    top: 0px;
    animation: float3 ${props => props.$duration || 2.2}s ease-in-out infinite;
    animation-delay: ${props => props.$delay || 0.6}s;
  }
  
  &:nth-child(4) {
    /* 우울 - 왼쪽 아래 */
    left: 20px;
    top: 60px;
    animation: float4 ${props => props.$duration || 2.6}s ease-in-out infinite;
    animation-delay: ${props => props.$delay || 0.2}s;
  }
  
  &:nth-child(5) {
    /* 중립 - 중앙 아래 */
    left: 120px;
    top: 65px;
    animation: float5 ${props => props.$duration || 2.4}s ease-in-out infinite;
    animation-delay: ${props => props.$delay || 0.4}s;
  }
  
  &:nth-child(6) {
    /* 불안 - 오른쪽 아래 */
    left: 220px;
    top: 65px;
    animation: float6 ${props => props.$duration || 2.7}s ease-in-out infinite;
    animation-delay: ${props => props.$delay || 0.5}s;
  }
  
  @keyframes float1 {
    0%, 100% {
      transform: translateY(0px) rotate(0deg);
    }
    25% {
      transform: translateY(-8px) rotate(2deg);
    }
    50% {
      transform: translateY(-12px) rotate(0deg);
    }
    75% {
      transform: translateY(-8px) rotate(-2deg);
    }
  }
  
  @keyframes float2 {
    0%, 100% {
      transform: translateY(0px) rotate(0deg);
    }
    30% {
      transform: translateY(-10px) rotate(-2deg);
    }
    60% {
      transform: translateY(-14px) rotate(0deg);
    }
    80% {
      transform: translateY(-8px) rotate(2deg);
    }
  }
  
  @keyframes float3 {
    0%, 100% {
      transform: translateY(0px) rotate(0deg);
    }
    20% {
      transform: translateY(-6px) rotate(3deg);
    }
    50% {
      transform: translateY(-10px) rotate(0deg);
    }
    70% {
      transform: translateY(-8px) rotate(-3deg);
    }
  }
  
  @keyframes float4 {
    0%, 100% {
      transform: translateY(0px) rotate(0deg);
    }
    25% {
      transform: translateY(-9px) rotate(-1deg);
    }
    50% {
      transform: translateY(-13px) rotate(0deg);
    }
    75% {
      transform: translateY(-7px) rotate(1deg);
    }
  }
  
  @keyframes float5 {
    0%, 100% {
      transform: translateY(0px) rotate(0deg);
    }
    28% {
      transform: translateY(-7px) rotate(2deg);
    }
    55% {
      transform: translateY(-11px) rotate(0deg);
    }
    78% {
      transform: translateY(-9px) rotate(-2deg);
    }
  }
  
  @keyframes float6 {
    0%, 100% {
      transform: translateY(0px) rotate(0deg);
    }
    22% {
      transform: translateY(-8px) rotate(-2deg);
    }
    48% {
      transform: translateY(-12px) rotate(0deg);
    }
    72% {
      transform: translateY(-6px) rotate(2deg);
    }
  }
`;

