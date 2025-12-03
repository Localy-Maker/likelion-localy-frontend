import styled from "styled-components";

export const Container = styled.div`
  position: relative;
  width: 375px;
  height: 812px;
  background: #FFFFFF;
  margin: 0 auto;
`;

export const Header = styled.header`
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 13px 22px;
  position: absolute;
  width: 375px;
  height: 56px;
  left: calc(50% - 375px/2);
  top: 0px;
  background: #FFFFFF;
  border-bottom: 1px solid #F3F3F3;
`;

export const BackButton = styled.button`
  position: absolute;
  left: 22px;
  width: 24px;
  height: 24px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: none;
  flex-grow: 0;
  
  svg {
    width: 24px;
    height: 24px;
    color: #0D0D0D;
  }
`;

export const HeaderTitle = styled.h1`
  width: 76px;
  height: 22px;
  font-family: 'Inter';
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 22px;
  letter-spacing: -0.43px;
  color: #0D0D0D;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  flex: none;
  flex-grow: 0;
`;

export const HeaderSpacer = styled.div`
  display: none;
`;

export const ProfileCard = styled.div`
  box-sizing: border-box;
  position: absolute;
  width: 343px;
  height: 267px;
  left: calc(50% - 343px/2);
  top: 124px;
  background: #FFFFFF;
  border: 1px solid #E0E0E0;
  border-radius: 8px;
`;

export const ProfileIcon = styled.div`
  position: absolute;
  width: 113px;
  height: 115px;
  left: calc(50% - 113px/2);
  top: 12px;
  font-family: 'SF Pro';
  font-style: normal;
  font-weight: 400;
  font-size: 96px;
  line-height: 115px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: #E0E0E0;
`;

export const ProfileName = styled.div`
  position: absolute;
  width: 44px;
  height: 22px;
  left: calc(50% - 44px/2);
  top: 137px;
  font-family: 'Inter';
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 22px;
  text-align: center;
  letter-spacing: -0.43px;
  color: #0D0D0D;
`;

export const ProfileEmail = styled.div`
  position: absolute;
  width: 194px;
  height: 22px;
  left: calc(50% - 194px/2);
  top: 163px;
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 22px;
  text-align: center;
  letter-spacing: -0.43px;
  color: #838383;
`;

export const ActionButtons = styled.div`
  position: absolute;
  width: 300px;
  height: 48px;
  left: calc(50% - 300px/2);
  top: 197px;
  background: #E0E0E0;
  border-radius: 8px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 0px;
  gap: 24px;
`;

export const ActionButton = styled.button`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0px;
  gap: 8px;
  background: none;
  border: none;
  cursor: pointer;
  font-family: 'Inter';
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 15px;
  color: #606060;
  flex: none;
  
  &:hover {
    color: #0D0D0D;
  }
`;

export const BottomActions = styled.div`
  position: absolute;
  width: 328px;
  height: 48px;
  left: calc(50% - 328px/2);
  top: 407px;
  background: #F3F3F3;
  border-radius: 16px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 0px;
  gap: 24px;
`;

export const BottomActionButton = styled.button`
  display: flex;
  align-items: center;
  padding: 0;
  background: none;
  border: none;
  cursor: pointer;
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 22px;
  letter-spacing: -0.43px;
  color: #838383;
  flex: none;
  
  &:hover {
    color: #0D0D0D;
  }
`;

export const Divider = styled.span`
  width: 4px;
  height: 22px;
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 22px;
  letter-spacing: -0.43px;
  color: #838383;
  display: flex;
  align-items: center;
  transform: matrix(-1, 0, 0, 1, 0, 0);
  flex: none;
`;

export const TabBar = styled.div`
  position: absolute;
  width: 375px;
  height: 64px;
  left: 0px;
  bottom: 0px;
  background: #FFFFFF;
  box-shadow: 0px -0.5px 0px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
`;

export const TabBarContent = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 4px 0px 0px;
  gap: 52px;
  position: absolute;
  height: 44px;
  left: 0%;
  right: 0%;
  top: 0px;
`;

export const TabIcon = styled.button`
  width: 24px;
  height: 24px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'SF Pro';
  font-style: normal;
  font-weight: 400;
  font-size: 20px;
  line-height: 24px;
  color: ${props => props.$isActive ? '#5482FF' : '#0D0D0D'};
  flex: none;
`;



