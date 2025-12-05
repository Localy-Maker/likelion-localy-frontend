import {
  ButtonsContainer,
  ActionButton,
  IconWrapper,
  ButtonLabel,
} from "../styles/QuickActionButtons.styles";
import BookmarkIcon from "@/shared/components/icons/BookmarkIcon";
import OrderIcon from "@/shared/components/icons/OrderIcon";
import HistoryIcon from "@/shared/components/icons/HistoryIcon";
import ProfileIcon from "@/shared/components/icons/ProfileIcon";

/**
 * @component QuickActionButtons
 * @description 빠른 액션 버튼 4개 (북마크, 미션, 감정 로그, 프로필)
 */
const QuickActionButtons = ({
  onBookmarkClick,
  onMissionClick,
  onEmotionLogClick,
  onProfileClick,
}) => {
  const buttons = [
    {
      id: "bookmark",
      label: "북마크",
      icon: <BookmarkIcon stroke="#000" color="#fff" size={24} />,
      onClick: onBookmarkClick,
    },
    {
      id: "mission",
      label: "미션 확인하기",
      icon: <OrderIcon />,
      onClick: onMissionClick,
    },
    {
      id: "emotion-log",
      label: "감정로그",
      icon: <HistoryIcon />,
      onClick: onEmotionLogClick,
    },
    {
      id: "profile",
      label: "회원 정보 확인",
      icon: <ProfileIcon />,
      onClick: onProfileClick,
    },
  ];

  return (
    <ButtonsContainer>
      {buttons.map((button) => (
        <ActionButton key={button.id} onClick={button.onClick}>
          <IconWrapper>{button.icon}</IconWrapper>
          <ButtonLabel>{button.label}</ButtonLabel>
        </ActionButton>
      ))}
    </ButtonsContainer>
  );
};

export default QuickActionButtons;
