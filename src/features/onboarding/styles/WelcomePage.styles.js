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
  margin: 4px auto 0;
  
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
  margin: 20px auto 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
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

