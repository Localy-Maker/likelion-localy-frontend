import styled from "styled-components";

export const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 9999;
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
  position: fixed;
  width: 100%;
  max-width: 350px;
  padding: 0px;
  isolation: isolate;
  z-index: 10000;
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
  
  /* Shadow only - blur removed */
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
    border-radius: 20px;
  }
`;

export const Section = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 11px 16px 20px 0px;
  width: 100%;
  position: relative;
  z-index: 2;
  overflow-y: auto;
  overflow-x: hidden;
  max-height: 400px; /* 고정 높이로 스크롤 활성화 */
  background: rgba(250, 250, 250, 0.95);
  border-radius: 20px;
  
  /* 스크롤바 숨기기 (스크롤 기능은 유지) */
  &::-webkit-scrollbar {
    width: 0px;
    background: transparent;
  }
  
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
  
  /* 스크롤 기능 활성화 */
  -webkit-overflow-scrolling: touch; /* iOS 부드러운 스크롤 */
  touch-action: pan-y; /* 터치 스크롤 활성화 */
`;

export const SidebarRow = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0px 8px 0px 10px;
  gap: 8px;
  width: 100%;
  height: 40px;
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
  height: 44px;
  flex: none;
  order: 0;
  flex-grow: 1;
`;

export const Symbol = styled.div`
  width: 34px;
  height: 44px;
  font-family: 'SF Pro';
  font-style: normal;
  font-weight: 590;
  font-size: 14px;
  line-height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  flex: none;
  order: 0;
  align-self: stretch;
  flex-grow: 0;
  color: #0D0D0D;
  
  svg {
    width: 20px;
    height: 20px;
  }
`;

export const TitleAndSubtitle = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding: 0px;
  flex: none;
  order: 1;
  flex-grow: 0;
`;

export const Title = styled.div`
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 17px;
  color: #0D0D0D;
  flex: none;
  order: 0;
  flex-grow: 0;
  white-space: nowrap;
`;

