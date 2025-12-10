import styled from "styled-components";
import { colors } from "@/styles/colors";
import { font } from "@/styles/font";

export const Container = styled.div`
  min-height: 100vh;
  padding: 0 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: white;
  position: relative;
`;

export const Header = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 13px 22px;
  width: 100%;
  max-width: 327px;
  height: 56px;
  background: #FFFFFF;
  border-bottom: 1px solid #F3F3F3;
  margin-bottom: 16px;
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

export const Title = styled.h1`
  font-weight: 600;
  font-size: 16px;
  line-height: 22px;
  letter-spacing: -0.43px;
  color: #0D0D0D;
  text-align: center;
  flex: none;
  width: 90px;
  height: 22px;
`;

export const HeaderSpacer = styled.div`
  width: 24px;
  height: 24px;
  flex: none;
`;

export const SectionTitle = styled.h2`
  font-weight: 600;
  font-size: 13px;
  line-height: 18px;
  letter-spacing: -0.08px;
  color: #0D0D0D;
  margin-bottom: 20px;
  width: 100%;
  max-width: 327px;
  margin-left: auto;
  margin-right: auto;
`;

export const Form = styled.form`
  width: 100%;
  max-width: 327px;
  display: flex;
  flex-direction: column;
  gap: 0;
  margin-left: auto;
  margin-right: auto;
`;

export const InputRow = styled.div`
  display: flex;
  gap: 8px;
  align-items: flex-start;
  margin-bottom: 6px;
`;

export const InputWrapper = styled.div`
  position: relative;
  width: 100%;
  flex: 1;
  margin-bottom: ${(props) => (props.$hasMessage ? "28px" : "6px")}; /* 안내문구가 있을 때만 여백 증가 */
  margin-top: 0;
  min-height: 39px; /* Input 높이만큼 최소 높이 설정 */
  
  /* 비밀번호 입력 필드 (Form 내에서 2번째 InputWrapper) 위에만 여백 */
  &:nth-of-type(2) {
    margin-top: 2px;
  }
  
  &:nth-of-type(3) {
    margin-top: 30px;
  }
  
  /* 비밀번호 확인 입력 필드 (Form 내에서 4번째 InputWrapper) 위에만 여백 */
  &:nth-of-type(4) {
    margin-top: 2px;
  }
  &:nth-of-type(5) {
    margin-top: 30px;
  }
`;

export const Input = styled.input`
  width: 100%;
  height: 39px;
  padding: 0 16px;
  border: 1px solid ${(props) => (props.$hasError ? "#C53929" : "#E0E0E0")};
  border-radius: 8px;
  ${font.regular14}
  color: #838383;
  background: white;
  
  &::placeholder {
    color: #838383;
  }
  
  &:focus {
    outline: none;
    border-color: ${(props) => (props.$hasError ? "#C53929" : colors.blue[100])};
  }
`;

export const ErrorMessage = styled.p`
  font-size: 10px;
  font-weight: 400;
  line-height: 22px;
  letter-spacing: -0.43px;
  color: #C53929;
  margin-top: 4px;
  margin-bottom: 0;
  display: flex;
  align-items: center;
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
`;

export const VerifyButton = styled.button`
  height: 39px;
  padding: 0 16px;
  background: ${(props) => (props.$isEnabled ? "#5482FF" : "#F3F3F3")};
  border: none;
  border-radius: 8px;
  ${font.regular14}
  color: ${(props) => (props.$isEnabled ? "white" : "#838383")};
  cursor: ${(props) => (props.$isEnabled ? "pointer" : "not-allowed")};
  white-space: nowrap;
  min-width: 94px;
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

export const PasswordToggle = styled.button`
  position: absolute;
  right: 16px;
  top: 0;
  height: 39px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  
  svg {
    width: 20px;
    height: 20px;
    color: #A6A6A6;
  }
`;

export const PasswordHint = styled.p`
  ${font.regular12}
  color: ${(props) => (props.$hasError ? "#C53929" : "#3D3D3D")};
  margin-top: 6px;
  margin-bottom: 0;
  font-size: 10px;
  line-height: 22px;
  letter-spacing: -0.43px;
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
`;

export const TimerText = styled.span`
  position: absolute;
  right: 16px;
  top: 0;
  height: 39px;
  display: flex;
  align-items: center;
  ${font.regular14}
  color: #C53929;
`;

export const CheckIcon = styled.span`
  position: absolute;
  right: 16px;
  top: 0;
  height: 39px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    width: 20px;
    height: 20px;
  }
`;

export const SubmitButton = styled.button`
  width: 100%;
  max-width: 327px;
  height: 40px;
  margin-top: auto; /* Container의 flex 레이아웃에서 하단으로 배치 */
  margin-bottom: 34px; /* Home indicator space - 온보딩 페이지와 동일 */
  margin-left: auto;
  margin-right: auto;
  background: ${(props) => (props.$isEnabled ? "#5482FF" : "#F3F3F3")};
  border: none;
  border-radius: 8px;
  ${font.regular14}
  font-weight: 500; /* 온보딩 페이지와 동일 */
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

