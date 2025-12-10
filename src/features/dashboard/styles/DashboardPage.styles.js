import styled from "styled-components";

export const Container = styled.div`
  position: relative;
  width: 100%;
  max-width: 375px;
  min-height: calc(100vh - 120px); /* 헤더와 푸터 공간 제외 */
  background: #FFFFFF;
  margin: 0 auto;
  padding-bottom: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const Header = styled.header`
  position: absolute;
  width: 375px;
  height: 56px;
  left: 0px;
  top: 44px;
  background: #FFFFFF;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
`;

export const LogoWrapper = styled.div`
  position: relative;
  width: 74px;
  height: 34px;
  margin: 20px auto 16px; /* 상단 여백과 하단 여백 고정 */
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Fredoka One';
  font-style: normal;
  font-weight: 400;
  font-size: 24px;
  line-height: 140%;
  letter-spacing: -0.02em;
  color: #5482FF;
`;

export const NotificationButton = styled.button`
  position: absolute;
  width: 28px;
  height: 25.45px;
  right: 19px;
  top: 16px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const BellIcon = styled.div`
  position: absolute;
  width: 20.36px;
  height: 20.36px;
  left: 0px;
  top: 5.09px;
  
  svg {
    width: 100%;
    height: 100%;
  }
`;

export const Badge = styled.div`
  position: absolute;
  width: 16.12px;
  height: 13.58px;
  left: 11.88px;
  top: 0px;
  background: #E7746F;
  border: 2px solid #FFFFFF;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Inter';
  font-style: normal;
  font-weight: 600;
  font-size: 10px;
  line-height: 120%;
  color: #FFFFFF;
`;

export const ChartSection = styled.div`
  box-sizing: border-box;
  position: relative;
  width: 100%;
  max-width: 343px;
  min-height: 282px;
  margin: 0 auto 20px; /* 상단 여백 제거, 하단 여백 추가 */
  background: #FFFFFF;
  border: 1px solid #E0E0E0;
  border-radius: 8px;
  z-index: 1;
  overflow: hidden;
`;

export const ChartTitle = styled.div`
  position: absolute;
  width: 108px;
  height: 28px;
  left: 16px;
  top: 16px;
  font-family: 'Inter';
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 28px;
  letter-spacing: -0.26px;
  color: #0D0D0D;
  white-space: nowrap;
`;

export const PillsContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 223px;
  height: 29px;
  margin: 0 auto 16px; /* 상단 여백 제거, 하단 여백 추가 */
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding: 0px;
  gap: 12px;
  z-index: 10;
`;

export const Pill = styled.button`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 6px 14px;
  gap: 10px;
  height: 29px;
  background: ${props => props.$isActive ? "#0D0D0D" : "#F3F3F3"};
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-family: 'Inter';
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 17px;
  color: ${props => props.$isActive ? "#FFFFFF" : "#0D0D0D"};
  white-space: nowrap;
  
  &:hover {
    opacity: 0.8;
  }
`;

export const ChartArea = styled.div`
  position: relative;
  width: 100%;
  min-height: 282px;
  height: 282px;
  overflow: hidden;
  padding-top: 44px;
  padding-left: 16px;
  padding-right: 16px;
  padding-bottom: 30px;
`;

export const GridLine = styled.div`
  position: absolute;
  width: ${props => props.$left ? `calc(100% - ${props.$left}px - 16px)` : '311px'};
  height: 0px;
  left: ${props => props.$left || 42}px;
  top: ${props => props.$top}px;
  border: ${props => props.$top === 240 ? "1px solid #E0E0E0" : "1px solid rgba(230, 230, 230, 0.5)"};
  z-index: 0;
`;

export const XAxisLabel = styled.div`
  position: absolute;
  height: 22px;
  left: ${props => props.$left}px;
  top: 244px;
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-size: 10px;
  line-height: 22px;
  letter-spacing: -0.43px;
  color: #838383;
  display: flex;
  align-items: center;
  z-index: 3;
`;

export const EmotionCharacter = styled.div`
  position: absolute;
  left: ${props => props.$left}px;
  top: ${props => props.$top}px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  pointer-events: none;
  transform: translateY(-50%);
  
  svg {
    width: 100%;
    height: 100%;
  }
`;

export const ChartLine = styled.div`
  position: absolute;
  width: calc(100% - 54px); /* 좌우 padding(16px * 2) + 캐릭터 영역(22px) 제외 */
  max-width: 272px;
  height: 180px;
  min-width: 200px;
  min-height: 180px;
  left: 38px; /* 그래프 선만 오른쪽으로 이동 */
  top: 60px;
  z-index: 1;
  pointer-events: none;
  overflow: visible;
  box-sizing: border-box;
`;

export const ListSection = styled.div`
  box-sizing: border-box;
  position: relative;
  width: 100%;
  max-width: 343px;
  min-height: 170px;
  margin: 0 auto 20px;
  background: #FFFFFF;
  border: 1px solid #E0E0E0;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
`;

export const ListHeader = styled.div`
  position: absolute;
  width: 313px;
  height: 28px;
  left: 16px;
  top: 16px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0px;
  gap: 141px;
`;

export const ListTitle = styled.div`
  width: 152px;
  height: 28px;
  font-family: 'Inter';
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 28px;
  letter-spacing: -0.26px;
  color: #0D0D0D;
  flex: none;
  order: 0;
  flex-grow: 0;
  padding: 0;
  margin: 0;
  text-indent: 0;
  white-space: nowrap;
`;

export const ChevronIcon = styled.div`
  width: 16px;
  height: 16px;
  flex: none;
  order: 1;
  flex-grow: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    width: 100%;
    height: 100%;
  }
`;

export const EmotionInfo = styled.div`
  position: absolute;
  width: 271px;
  height: 86px;
  left: calc(50% - 271px/2);
  top: 64px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0px;
  gap: 16px;
`;

export const EmotionCharacterLarge = styled.div`
  width: 33.23px;
  height: 29.47px;
  flex: none;
  order: 0;
  flex-grow: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    width: 100%;
    height: 100%;
  }
`;

export const EmotionTextContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0px;
  gap: 4px;
  width: 271px;
  height: 41px;
  flex: none;
  order: 1;
  align-self: stretch;
  flex-grow: 0;
`;

export const EmotionName = styled.div`
  width: 271px;
  height: 15px;
  font-family: 'Inter';
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 15px;
  text-align: center;
  color: #0D0D0D;
  flex: none;
  order: 0;
  align-self: stretch;
  flex-grow: 0;
`;

export const EmotionDescription = styled.div`
  width: 271px;
  height: 22px;
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-size: 10px;
  line-height: 22px;
  text-align: center;
  letter-spacing: -0.43px;
  color: #3D3D3D;
  flex: none;
  order: 1;
  align-self: stretch;
  flex-grow: 0;
`;

// Week 뷰 스타일
export const YAxisLabel = styled.div`
  position: absolute;
  width: ${props => props.$width || "17px"};
  height: 22px;
  left: ${props => props.$left || "11px"};
  top: ${props => props.$top}px;
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-size: 10px;
  line-height: 22px;
  letter-spacing: -0.43px;
  color: #838383;
  display: flex;
  align-items: center;
  z-index: 3;
`;

export const WeekXAxisLabel = styled.div`
  position: absolute;
  width: 10px;
  height: 22px;
  left: ${props => props.$left}px;
  top: 244px;
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-size: 10px;
  line-height: 22px;
  letter-spacing: -0.43px;
  color: #838383;
  display: flex;
  align-items: center;
  z-index: 3;
`;

export const WeekGridLine = styled.div`
  position: absolute;
  width: ${props => props.$width}px;
  height: 0px;
  left: ${props => props.$left}px;
  top: ${props => props.$top}px;
  border: ${props => props.$top === 240 ? "1px solid #E0E0E0" : "1px solid rgba(230, 230, 230, 0.5)"};
  z-index: 0;
`;

export const WeekChartContainer = styled.div`
  position: absolute;
  width: 285px;
  height: 180px;
  min-width: 285px;
  min-height: 180px;
  left: 40px;
  top: 60px;
  z-index: 1;
  pointer-events: none;
  overflow: visible;
`;

export const PercentLabel = styled.div`
  position: absolute;
  height: 10px;
  left: ${props => props.$left}px;
  top: ${props => props.$top}px;
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-size: 8px;
  line-height: 10px;
  color: #0D0D0D;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 4;
  white-space: nowrap;
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
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 4px 0px 0px;
  gap: 52px;
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
  flex: none;
  color: ${props => props.$isActive ? "#5482FF" : "#0D0D0D"};
  
  svg {
    width: 100%;
    height: 100%;
  }
  
  &:hover {
    opacity: 0.7;
  }
`;

// Month 뷰 스타일
export const MonthChartSection = styled.div`
  box-sizing: border-box;
  position: relative;
  width: 100%;
  max-width: 351px; /* 343px -> 351px로 증가하여 일요일 날짜가 잘리지 않도록 */
  min-height: 323px;
  margin: 0 auto 20px; /* 상단 여백 제거, 하단 여백 추가 */
  background: #FFFFFF;
  border: 1px solid #E0E0E0;
  border-radius: 8px;
  overflow: visible;
  z-index: 1;
`;

export const MonthChartTitle = styled.div`
  position: absolute;
  width: 96px;
  height: 28px;
  left: 16px;
  top: 16px;
  font-family: 'Inter';
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 28px;
  letter-spacing: -0.26px;
  color: #0D0D0D;
`;

export const MonthDateHeader = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 0px;
  gap: 4px;
  position: absolute;
  width: auto;
  min-width: 74px;
  height: 22px;
  left: 50%;
  transform: translateX(-50%);
  top: 48px;
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 22px;
  letter-spacing: -0.43px;
  color: #0D0D0D;
`;

export const MonthChevronIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 12px;
  height: 12px;
  cursor: pointer;
  
  &:hover {
    opacity: 0.7;
  }
`;

export const MonthCalendarGrid = styled.div`
  position: absolute;
  width: 311px;
  height: 180px;
  left: 16px;
  top: 111px;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-template-rows: repeat(5, 1fr);
  gap: 0;
`;

export const MonthCalendarCell = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0px;
  gap: 4px;
  width: 50px;
  height: 36px;
`;

export const MonthCalendarCharacter = styled.div`
  width: ${props => props.$size || "14.13"}px;
  height: ${props => props.$size || "12.06"}px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const MonthCalendarDayLabel = styled.div`
  position: absolute;
  width: 10px;
  height: 22px;
  left: ${props => props.$left || "28"}px;
  top: 87px;
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-size: 10px;
  line-height: 22px;
  letter-spacing: -0.43px;
  color: #838383;
`;

export const MonthCalendarYAxis = styled.div`
  position: absolute;
  width: 12px;
  height: 22px;
  left: ${props => props.$left || "15"}px;
  top: ${props => props.$top || "147"}px;
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-size: 10px;
  line-height: 22px;
  letter-spacing: -0.43px;
  color: #0D0D0D;
`;

export const MonthCalendarGridLine = styled.div`
  position: absolute;
  width: 311px;
  height: 0px;
  left: 16px;
  top: ${props => props.$top || "111"}px;
  border: ${props => props.$isLast ? "1px solid #E0E0E0" : "1px solid rgba(230, 230, 230, 0.5)"};
`;

export const MonthListSection = styled.div`
  box-sizing: border-box;
  position: relative;
  width: 100%;
  max-width: 343px;
  min-height: 153px;
  margin: 0 auto 20px;
  background: #FFFFFF;
  border: 1px solid #E0E0E0;
  border-radius: 8px;
`;

export const MonthListTitle = styled.div`
  position: absolute;
  width: 114px;
  height: 28px;
  white-space: nowrap;
  left: 16px;
  top: 16px;
  font-family: 'Inter';
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 28px;
  letter-spacing: -0.26px;
  color: #0D0D0D;
`;

export const MonthEmotionList = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0px;
  position: absolute;
  width: 300px;
  height: 74px;
  left: calc(50% - 300px/2 + 0.5px);
  top: 60px;
  gap: 0px;
`;

export const MonthEmotionItem = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0px;
  gap: 4px;
  width: 50px;
  height: 74px;
  flex: none;
`;

export const MonthEmotionCharacter = styled.div`
  width: ${props => props.$width || "32"}px;
  height: ${props => props.$height || "48"}px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const MonthEmotionCount = styled.div`
  width: 50px;
  height: 22px;
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 22px;
  text-align: center;
  letter-spacing: -0.43px;
  color: #0D0D0D;
`;

