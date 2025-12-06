import styled, { css } from "styled-components";
import { colors } from "@/styles/colors";
import ChevronLeftIcon from "@/shared/components/icons/ChevronLeftIcon";

const HeaderWrapper = styled.header`
  position: relative;
  width: 100%;
  
  height: 56px;
  box-sizing: border-box;
  background: #ffffff;
  border-bottom: ${({ $showBorder }) =>
    $showBorder ? "0.5px solid #e6e6e6" : "none"};
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
          font-weight: 700;
          font-style: normal;
          font-size: 15px;
          line-height: 20px;
          letter-spacing: -0.23px;
          color: #000;
        `
      : css`
          font-style: normal;
          font-weight: 400;
          font-size: 24px;
          line-height: 140%;
          letter-spacing: -0.02em;
          color: ${colors.blue[100]};
        `}
`;

/**
 * @params {React.ReactNode} leftIcon - 왼쪽 아이콘 컴포넌트
 * @params {React.ReactNode} rightIcon - 오른쪽 아이콘 컴포넌트
 * @params {string} text - 헤더 타이틀 텍스트
 * @params {function} onLeftClick - 왼쪽 버튼 클릭 핸들러
 * @params {function} onRightClick - 오른쪽 버튼 클릭 핸들러
 * @params {boolean} showBorder - 하단 border 표시 여부 (기본값: true)
 *
 * @return {JSX.Element}
 */
const Header = ({
  leftIcon,
  rightIcon,
  text,
  onLeftClick,
  onRightClick,
  showBorder = true,
}) => {
  const useInterFont = Boolean(text !== "Localy");

  return (
    <HeaderWrapper $showBorder={showBorder}>
      {leftIcon !== null && (
        <LeftSlot onClick={onLeftClick} aria-label="왼쪽 버튼">
          {leftIcon || <ChevronLeftIcon />}
        </LeftSlot>
      )}
      <Title $useInter={useInterFont}>{text}</Title>
      {rightIcon !== null && (
        <RightSlot onClick={onRightClick} aria-label="오른쪽 버튼">
          {rightIcon || <ChevronLeftIcon rotate={180} />}
        </RightSlot>
      )}
    </HeaderWrapper>
  );
};

export default Header;
