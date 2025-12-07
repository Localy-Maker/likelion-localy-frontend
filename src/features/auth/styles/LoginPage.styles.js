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
`;

export const LogoWrapper = styled.div`
  margin-top: 60px;
  margin-bottom: 40px;
`;

export const Title = styled.h1`
  ${font.bold24}
  color: #0D0D0D;
  margin-bottom: 20px;
  text-align: center;
`;

export const SignupLink = styled.div`
  margin-bottom: 40px;
  text-align: center;
  ${font.regular14}
  color: #838383;
  
  a {
    color: ${colors.blue[100]};
    text-decoration: underline;
    margin-left: 4px;
  }
`;

export const Form = styled.form`
  width: 100%;
  max-width: 327px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const InputWrapper = styled.div`
  position: relative;
  width: 100%;
`;

export const Input = styled.input`
  width: 100%;
  height: 39px;
  padding: 0 16px;
  border: 1px solid #E0E0E0;
  border-radius: 8px;
  ${font.regular14}
  color: #838383;
  background: white;
  
  &::placeholder {
    color: #838383;
  }
  
  &:focus {
    outline: none;
    border-color: ${colors.blue[100]};
  }
`;

export const PasswordToggle = styled.button`
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    width: 20px;
    height: 20px;
    color: #A6A6A6;
  }
`;

export const LoginButton = styled.button`
  width: 100%;
  height: 40px;
  margin-top: 8px;
  background: ${(props) => (props.$isEnabled ? "#5482FF" : "#F3F3F3")};
  border: none;
  border-radius: 8px;
  ${font.regular14}
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

export const Divider = styled.div`
  display: flex;
  align-items: center;
  margin: 24px 0;
  width: 100%;
  max-width: 327px;
  
  &::before,
  &::after {
    content: "";
    flex: 1;
    height: 1px;
    background: #E0E0E0;
  }
  
  span {
    padding: 0 12px;
    ${font.regular14}
    color: #838383;
  }
`;

export const GoogleButton = styled.button`
  width: 100%;
  max-width: 327px;
  height: 40px;
  background: white;
  border: 1px solid #E0E0E0;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  cursor: pointer;
  
  &:hover {
    background: #F9F9F9;
  }
  
  svg {
    width: 20px;
    height: 20px;
  }
  
  span {
    ${font.regular14}
    color: #0D0D0D;
  }
`;

export const ErrorMessage = styled.div`
  color: #C53929;
  ${font.regular12}
  text-align: center;
  margin-top: 8px;
  white-space: pre-line;
`;

export const FindPasswordLink = styled.div`
  margin-top: 24px;
  text-align: center;
  ${font.regular14}
  color: #838383;
  
  a {
    color: ${colors.blue[100]};
    text-decoration: underline;
    margin-left: 4px;
  }
`;

