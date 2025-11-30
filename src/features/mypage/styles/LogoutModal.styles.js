import styled from "styled-components";

export const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

export const Modal = styled.div`
  position: relative;
  width: 308px;
  height: 155px;
  background: #FFFFFF;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0px;
  gap: 16px;
  box-sizing: border-box;
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0px;
  gap: 8px;
  width: 280px;
  height: 47px;
  flex: none;
  order: 0;
  flex-grow: 0;
`;

export const Title = styled.div`
  width: 100%;
  height: 22px;
  font-family: 'Inter';
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  letter-spacing: -0.43px;
  color: #5482FF;
  flex: none;
  order: 0;
  flex-grow: 0;
`;

export const Message = styled.div`
  width: 100%;
  height: 17px;
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 17px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: #0D0D0D;
  flex: none;
  order: 1;
  flex-grow: 0;
`;

export const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 0px;
  gap: 10px;
  width: 250px;
  height: 36px;
  flex: none;
  order: 1;
  flex-grow: 0;
`;

export const CancelButton = styled.button`
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 10px;
  gap: 10px;
  width: 120px;
  height: 36px;
  border: 1px solid #C9C9C9;
  border-radius: 8px;
  background: #FFFFFF;
  cursor: pointer;
  font-family: 'Inter';
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 17px;
  color: #838383;
  flex: none;
  order: 0;
  flex-grow: 0;
  
  &:hover {
    background: #F9F9F9;
  }
  
  &:active {
    background: #F3F3F3;
  }
`;

export const ConfirmButton = styled.button`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 10px;
  gap: 10px;
  width: 120px;
  height: 36px;
  background: #5482FF;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-family: 'Inter';
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 17px;
  color: #F7F9FF;
  flex: none;
  order: 1;
  flex-grow: 0;
  
  &:hover {
    background: #4A75E6;
  }
  
  &:active {
    background: #3D68CC;
  }
  
  &:disabled {
    background: #C9C9C9;
    cursor: not-allowed;
  }
`;

