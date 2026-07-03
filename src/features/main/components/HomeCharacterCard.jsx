import {
  CardWrapper,
  CharacterSlot,
  TextContainer,
  TextHeader,
  TextBody,
} from "../styles/HomeCharacterCard.styles";
import CharacterPreview from "@/features/character/components/CharacterPreview";
import { useUserStore } from "@/shared/stores/userStore";

/**
 * @component HomeCharacterCard
 * @description 홈 캐릭터 카드 - 사용자가 꾸민 캐릭터(본체+장착 아이템)를 표시, 클릭 시 채팅 페이지로 이동
 * @param {function} onClick - 카드 클릭 핸들러
 * @param {string} nickname - 사용자 닉네임 (기본값: "멋사")
 */
const HomeCharacterCard = ({ onClick, nickname = "멋사" }) => {
  const equippedCharacter = useUserStore((s) => s.equippedCharacter);
  const equippedItems = useUserStore((s) => s.equippedItems);

  return (
    <CardWrapper onClick={onClick}>
      <CharacterSlot>
        <CharacterPreview
          characterId={equippedCharacter ?? "happiness"}
          equip={equippedItems}
          size={60}
        />
      </CharacterSlot>
      <TextContainer>
        <TextHeader>안녕하세요 {nickname}님,</TextHeader>
        <TextBody>
          오늘 기분은 어떠신가요? <br /> Localy에게 당신의 이야기를 들려주세요.
        </TextBody>
      </TextContainer>
    </CardWrapper>
  );
};

export default HomeCharacterCard;
