import styled from "styled-components";

export const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 999;
  animation: fadeIn 0.2s ease;
  
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

export const Dropdown = styled.div`
  position: absolute;
  min-width: 130px;
  max-width: 350px;
  padding: 0px;
  isolation: isolate;
  z-index: 1000;
  animation: slideDown 0.3s ease;
  overflow: visible;
  border-radius: 20px;
  
  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  /* Liquid Glass - Large */
  &::before {
    content: "";
    position: absolute;
    left: -26px;
    right: -26px;
    top: -26px;
    bottom: -26px;
    z-index: 0;
    
    /* Shadow */
    box-shadow: 0px 0px 25px rgba(0, 0, 0, 0.15);
    
    /* Fill */
    background: linear-gradient(0deg, rgba(250, 250, 250, 0.7), rgba(250, 250, 250, 0.7)), #262626;
    background-blend-mode: normal, color-dodge;
    border-radius: 20px;
    
    /* Blur */
    filter: blur(20px);
    backdrop-filter: blur(40px);
  }
  
  /* Glass Effect */
  &::after {
    content: "";
    position: absolute;
    left: 0px;
    right: 0px;
    top: 0px;
    bottom: 0px;
    background: rgba(0, 0, 0, 0.001);
    border-radius: 20px;
    z-index: 1;
  }
`;

export const Section = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 12px 16px 11px 0px;
  width: 100%;
  min-width: 130px;
  max-height: 216px;
  position: relative;
  z-index: 2;
  overflow-y: auto;
  overflow-x: hidden;
  background: rgba(250, 250, 250, 0.95);
  border-radius: 20px;
  
  /* 스크롤바 숨기기 */
  &::-webkit-scrollbar {
    width: 0px;
    background: transparent;
  }
  
  -ms-overflow-style: none;
  scrollbar-width: none;
  
  -webkit-overflow-scrolling: touch;
  touch-action: pan-y;
`;

export const SidebarRow = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0px 8px 0px 0px;
  gap: 8px;
  width: 100%;
  min-width: 120px;
  height: 32px;
  border-bottom: 0.5px solid #C9C9C9;
  cursor: pointer;
  background: ${(props) => (props.$isSelected ? "rgba(84, 130, 255, 0.1)" : "transparent")};
  transition: background 0.2s ease;
  
  &:hover {
    background: ${(props) => (props.$isSelected ? "rgba(84, 130, 255, 0.15)" : "rgba(0, 0, 0, 0.05)")};
  }
  
  &:active {
    background: ${(props) => (props.$isSelected ? "rgba(84, 130, 255, 0.2)" : "rgba(0, 0, 0, 0.1)")};
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

export const Leading = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0px;
  gap: 8px;
  width: 100%;
  height: 32px;
  flex: none;
  order: 0;
  flex-grow: 0;
`;

export const Symbol = styled.div`
  width: 34px;
  height: 32px;
  font-family: 'SF Pro';
  font-style: normal;
  font-weight: 590;
  font-size: 8px;
  line-height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-feature-settings: 'ss16' on;
  color: #0D0D0D;
  flex: none;
  order: 0;
  align-self: stretch;
  flex-grow: 0;
`;

export const TitleAndSubtitle = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding: 0px;
  width: auto;
  height: 22px;
  flex: none;
  order: 1;
  flex-grow: 0;
`;

export const Title = styled.div`
  width: auto;
  height: 22px;
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 22px;
  letter-spacing: -0.43px;
  color: #0D0D0D;
  flex: none;
  order: 0;
  flex-grow: 0;
  white-space: nowrap;
`;

