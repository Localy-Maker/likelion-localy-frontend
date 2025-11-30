import styled from "styled-components";

export const Container = styled.div`
  position: relative;
  width: 375px;
  min-height: 100vh;
  max-height: 100vh;
  height: 100vh;
  background: #FFFFFF;
  margin: 0 auto;
  overflow: hidden;
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

export const Title = styled.h1`
  width: 90px;
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
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
`;

export const HeaderSpacer = styled.div`
  width: 24px;
  height: 24px;
  flex: none;
`;

export const Character = styled.div`
  position: absolute;
  width: 49px;
  height: 65px;
  left: calc(50% - 49px/2 + 3.5px);
  top: 285px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    width: 100%;
    height: 100%;
  }
`;

export const ExclamationText = styled.div`
  position: absolute;
  width: 40px;
  height: 39px;
  left: calc(50% - 40px/2 + 3.5px);
  top: 373px;
  font-family: 'Inter';
  font-style: normal;
  font-weight: 700;
  font-size: 32px;
  line-height: 39px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: #E0E0E0;
`;

export const DescriptionText = styled.div`
  position: absolute;
  width: 330px;
  height: 68px;
  left: calc(50% - 330px/2);
  top: 451px;
  font-family: 'Inter';
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 17px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: #E0E0E0;
  white-space: pre-line;
`;

