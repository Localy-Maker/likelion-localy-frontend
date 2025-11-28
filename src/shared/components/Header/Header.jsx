import styled, { css } from "styled-components";
import { colors } from "@/styles/colors";

const HeaderWrapper = styled.header`
  position: relative;
  width: 100%;
  height: 56px;
  box-sizing: border-box;
  background: #ffffff;
  border-bottom: 0.5px solid #e6e6e6;
`;

const IconSlot = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;

  &:hover {
    opacity: 0.7;
  }

  &:active {
    opacity: 0.5;
  }
`;

const LeftSlot = styled(IconSlot)`
  left: 16px;
`;

const RightSlot = styled(IconSlot)`
  right: 16px;
`;

const Title = styled.h1`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  margin: 0;
  ${({ $useInter }) =>
    $useInter
      ? css`
          font-family: "Inter", system-ui, sans-serif;
          font-weight: 700;
          font-style: normal;
          font-size: 15px;
          line-height: 20px;
          letter-spacing: -0.23px;
          color: #000;
        `
      : css`
          font-family: "Fredoka One", system-ui, sans-serif;
          font-style: normal;
          font-weight: 400;
          font-size: 24px;
          line-height: 140%;
          letter-spacing: -0.02em;
          color: ${colors.blue[100]};
        `}
`;

const Chevron = styled.span`
  position: relative;
  display: inline-block;
  width: 12px;
  height: 12px;

  &::before,
  &::after {
    content: "";
    position: absolute;
    width: 14px;
    height: 1.8px;
    background: #000000;
    border-radius: 1px;
    left: 0;
    transform-origin: left center;
  }

  &::before {
    top: 50%;
    transform: translateY(-50%) rotate(45deg);
  }

  &::after {
    top: 50%;
    transform: translateY(-50%) rotate(-45deg);
  }
`;

/**
 * @params {React.ReactNode} leftIcon - 왼쪽 아이콘 컴포넌트
 * @params {React.ReactNode} rightIcon - 오른쪽 아이콘 컴포넌트
 * @params {string} text - 헤더 타이틀 텍스트
 * @params {function} onLeftClick - 왼쪽 버튼 클릭 핸들러
 * @params {function} onRightClick - 오른쪽 버튼 클릭 핸들러
 *
 * @return {JSX.Element}
 */
const Header = ({ leftIcon, rightIcon, text, onLeftClick, onRightClick }) => {
  const useInterFont = Boolean(text !== "Localy");

  return (
    <HeaderWrapper>
      <LeftSlot onClick={onLeftClick} aria-label="왼쪽 버튼">
        {leftIcon}
      </LeftSlot>
      <Title $useInter={useInterFont}>{text}</Title>
      <RightSlot onClick={onRightClick} aria-label="오른쪽 버튼">
        {rightIcon}
      </RightSlot>
    </HeaderWrapper>
  );
};

export default Header;
