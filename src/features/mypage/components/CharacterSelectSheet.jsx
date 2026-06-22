import { useEffect, useState } from "react";
import { renderEmotionCharacter } from "@/shared/utils/emotionCharacters";
import { PROFILE_CHARACTERS } from "../utils/characterStorage";
import * as S from "../styles/CharacterSelectSheet.styles";

export default function CharacterSelectSheet({
  isOpen,
  userName,
  selectedCharacter,
  isSubmitting = false,
  onClose,
  onConfirm,
}) {
  const [draftCharacter, setDraftCharacter] = useState(selectedCharacter);

  useEffect(() => {
    if (isOpen) {
      setDraftCharacter(selectedCharacter);
    }
  }, [isOpen, selectedCharacter]);

  if (!isOpen) return null;

  return (
    <S.Overlay onClick={onClose}>
      <S.Sheet onClick={(event) => event.stopPropagation()}>
        <S.Title>{userName}님의 LOCALY 캐릭터를 선택해주세요</S.Title>

        <S.CharacterGrid>
          {PROFILE_CHARACTERS.map((character) => (
            <S.CharacterButton
              key={character.id}
              type="button"
              $selected={draftCharacter === character.id}
              onClick={() => setDraftCharacter(character.id)}
              aria-label={`${character.label} 캐릭터 선택`}
            >
              {renderEmotionCharacter(character.id)}
            </S.CharacterButton>
          ))}
        </S.CharacterGrid>

        <S.ConfirmButton
          type="button"
          onClick={() => onConfirm(draftCharacter)}
          disabled={isSubmitting}
        >
          {isSubmitting ? "저장 중..." : "확인"}
        </S.ConfirmButton>
      </S.Sheet>
    </S.Overlay>
  );
}
