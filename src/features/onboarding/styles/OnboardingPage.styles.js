import styled from "styled-components";
import { font } from "@/styles/font";

export const Container = styled.div`
  position: relative;
  width: 100%;
  min-height: 100vh;
  background: #FFFFFF;
  display: flex;
  flex-direction: column;
  padding: 0 24px;
`;

export const Header = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 13px 22px;
  width: 100%;
  max-width: 327px; /* 비밀번호 찾기 페이지와 동일한 최대 너비 */
  height: 56px;
  background: #FFFFFF;
  border-bottom: 1px solid #F3F3F3;
  margin-left: auto;
  margin-right: auto;
  position: relative;
`;

export const Title = styled.h1`
  font-weight: 600;
  font-size: 16px;
  line-height: 22px;
  letter-spacing: -0.43px;
  color: #0D0D0D;
  text-align: center;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  margin: 0;
`;

export const BackButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  flex: none;
  
  svg {
    width: 24px;
    height: 24px;
    color: #0D0D0D;
  }
`;

export const HeaderSpacer = styled.div`
  width: 24px;
  height: 24px;
  flex: none;
`;

export const StepIndicator = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 15px;
  width: 100%;
  height: 4px;
  margin-top: 62px; /* top: 118px - header: 56px */
  margin-bottom: 0;
`;

export const StepBar = styled.div`
  width: 100px;
  height: 4px;
  border-radius: 16px;
  background: ${(props) => (props.$isActive ? "#5482FF" : "#E0E0E0")};
  flex: none;
`;

export const Section = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  width: 100%;
  max-width: 350px;
  margin-top: ${(props) => (props.$isFirst ? "40px" : "20px")};
  margin-left: auto;
  margin-right: auto;
`;

export const SectionContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
  width: 100%;
`;

export const SectionTitle = styled.h2`
  font-weight: 600;
  font-size: 16px;
  line-height: 22px;
  letter-spacing: -0.43px;
  color: #0D0D0D;
  width: 100%;
  margin: 0;
`;

export const SectionDescription = styled.p`
  font-weight: 400;
  font-size: 12px;
  line-height: 22px;
  letter-spacing: -0.43px;
  color: #3D3D3D;
  width: 100%;
  margin: 0;
`;

export const FieldWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  width: 100%;
`;

export const Field = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 8px 16px;
  gap: 8px;
  width: 100%;
  height: 40px;
  background: #FFFFFF;
  border: 1px solid #E0E0E0;
  border-radius: 8px;
  cursor: pointer;
  position: relative;
  
  &:hover {
    border-color: #5482FF;
  }
`;

export const FieldIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: none;
  font-size: 16px;
  color: #3D3D3D;
  
  svg {
    display: block;
  }
`;

export const FieldLabel = styled.span`
  ${font.regular14}
  color: #838383;
  width: 262px;
  height: 17px;
  display: flex;
  align-items: center;
  text-align: left;
`;

export const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 350px;
  margin-left: auto;
  margin-right: auto;
  flex: 1;
`;

export const SubmitButton = styled.button`
  width: 100%;
  max-width: 327px;
  height: 40px;
  margin-top: auto;
  margin-bottom: 34px; /* Home indicator space */
  margin-left: auto;
  margin-right: auto;
  background: ${(props) => (props.$isEnabled ? "#5482FF" : "#F3F3F3")};
  border: none;
  border-radius: 8px;
  ${font.regular14}
  font-weight: 500;
  color: ${(props) => (props.$isEnabled ? "white" : "#838383")};
  cursor: ${(props) => (props.$isEnabled ? "pointer" : "not-allowed")};
  transition: all 0.2s ease;
  
  &:hover {
    background: ${(props) => (props.$isEnabled ? "#4A75E6" : "#E0E0E0")};
  }
  
  &:active {
    background: ${(props) => (props.$isEnabled ? "#3D68CC" : "#D0D0D0")};
  }
  
  &:disabled {
    cursor: not-allowed;
  }
`;

export const HomeIndicator = styled.div`
  position: absolute;
  width: 134px;
  height: 5px;
  left: 50%;
  transform: translateX(-50%);
  bottom: 8px;
  background: #0D0D0D;
  border-radius: 100px;
`;

export const QuestionSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0px;
  gap: 20px;
  width: 100%;
  max-width: 331px;
  margin-top: 40px;
  margin-left: auto;
  margin-right: auto;
`;

export const QuestionTitle = styled.h2`
  font-family: 'Inter';
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 22px;
  letter-spacing: -0.43px;
  color: #0D0D0D;
  width: 100%;
  margin: 0;
`;

export const QuestionSubtitle = styled.p`
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 22px;
  letter-spacing: -0.43px;
  color: #3D3D3D;
  width: 100%;
  margin: 0;
`;

export const QuestionLimit = styled.p`
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 22px;
  letter-spacing: -0.43px;
  color: #3D3D3D;
  width: 100%;
  margin: 0;
`;

export const ActivityGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  width: 100%;
  max-width: 264px;
  margin: 40px auto 0;
  padding: 0;
  justify-items: center;
`;

export const ActivityField = styled.div`
  box-sizing: border-box;
  position: relative;
  width: 120px;
  height: 120px;
  background: #FFFFFF;
  border: 1px solid ${(props) => {
    if (props.$isExisting || props.$isSelected) return "#5482FF";
    return props.$isDisabled ? "#E0E0E0" : "#E0E0E0";
  }};
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: ${(props) => (props.$isDisabled ? "not-allowed" : "pointer")};
  transition: all 0.2s ease;
  background: ${(props) => {
    if (props.$isExisting || props.$isSelected) return "rgba(84, 130, 255, 0.1)";
    return props.$isDisabled ? "#F9F9F9" : "#FFFFFF";
  }};
  opacity: ${(props) => (props.$isDisabled ? 0.5 : 1)};
  
  &:hover {
    border-color: ${(props) => (props.$isDisabled ? "#E0E0E0" : "#5482FF")};
    background: ${(props) => {
      if (props.$isDisabled) return "#F9F9F9";
      return props.$isExisting || props.$isSelected ? "rgba(84, 130, 255, 0.15)" : "rgba(84, 130, 255, 0.02)";
    }};
  }
  
  &:active {
    transform: ${(props) => (props.$isDisabled ? "none" : "scale(0.98)")};
  }
`;

export const ActivityIcon = styled.div`
  font-size: 36px;
  line-height: 13px;
  letter-spacing: 0.06px;
  color: #0D0D0D;
  margin-bottom: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ActivityLabel = styled.span`
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 17px;
  color: #0D0D0D;
  text-align: center;
`;

export const ActivityCharacter = styled.div`
  position: absolute;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  z-index: 1;
  
  svg {
    width: 28px;
    height: 28px;
  }
  
  /* 쇼핑: 왼쪽 아래에 선에 겹쳐있게 */
  ${(props) => props.$position === "shopping" && `
    left: -4px;
    bottom: -4px;
  `}
  
  /* 자연: 오른쪽 아래에 선에 겹쳐있게 */
  ${(props) => props.$position === "nature" && `
    right: -4px;
    bottom: -4px;
  `}
  
  /* 언어교환: 왼쪽 위에서 1/3 지점에 겹쳐있게 */
  ${(props) => props.$position === "language" && `
    left: -4px;
    top: calc(33.33% - 14px);
  `}
  
  /* 음식: 오른쪽 아래에 선에 겹쳐있게 */
  ${(props) => props.$position === "food" && `
    right: -4px;
    bottom: -4px;
  `}
  
  /* 문화: 왼쪽 위에서 1/3 지점에 겹쳐있게 */
  ${(props) => props.$position === "culture" && `
    left: -6px;
    top: calc(33.33% - 14px);
  `}
  
  /* 관광: 오른쪽 위 모서리쪽에 겹쳐있게 */
  ${(props) => props.$position === "tourism" && `
    right: -4px;
    top: -4px;
  `}
`;

export const InfoText = styled.p`
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 22px;
  letter-spacing: -0.43px;
  color: #3D3D3D;
  text-align: center;
  width: 100%;
  margin: 20px auto 0;
  max-width: 223px;
`;

