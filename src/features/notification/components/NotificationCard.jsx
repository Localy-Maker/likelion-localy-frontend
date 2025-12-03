import {
  CardContainer,
  CardContent,
  InfoSection,
  HeaderSection,
  TitleRow,
  IconAndName,
  EmojiIcon,
  SenderName,
  DateRow,
  Dot,
  DateText,
  TitleText,
  DescriptionText,
  RedDot,
} from "../styles/NotificationCard.styles";
import NotificationIcon from "@/shared/components/icons/notifications1.svg";

/**
 * @component NotificationCard
 * @description 개별 알림 카드 컴포넌트
 * @param {Object} notification - 알림 데이터
 * @param {boolean} notification.isNew - 새로운 알림 여부
 * @param {string} notification.sender - 발신자 이름
 * @param {string} notification.date - 날짜
 * @param {string} notification.title - 알림 제목
 * @param {string} notification.description - 알림 내용
 */
const NotificationCard = ({ notification }) => {
  const { isNew, sender, date, title, description } = notification;

  return (
    <CardContainer>
      <RedDot $isNew={isNew} />
      <CardContent>
        <InfoSection>
          <HeaderSection>
            <TitleRow>
              <IconAndName>
                <EmojiIcon src={NotificationIcon} alt="icon" />
                <SenderName>{sender}</SenderName>
              </IconAndName>
            </TitleRow>
            <DateRow>
              <Dot>•</Dot>
              <DateText>{date}</DateText>
            </DateRow>
          </HeaderSection>
          <TitleText>{title}</TitleText>
          <DescriptionText>{description}</DescriptionText>
        </InfoSection>
      </CardContent>
    </CardContainer>
  );
};

export default NotificationCard;
