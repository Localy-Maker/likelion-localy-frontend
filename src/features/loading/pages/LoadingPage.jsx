import * as S from "../styles/LoadingPage.styles";
import { renderEmotionCharacter } from "@/shared/utils/emotionCharacters";

export default function LoadingPage() {
  return (
    <S.Container>
      {/* Localy Logo */}
      <S.Logo>Localy</S.Logo>

      {/* Slogan */}
      <S.Slogan>Your Ally for Every Feeling, Every Place</S.Slogan>

      {/* 감정 캐릭터들 */}
      <S.CharactersGroup>
        {/* Component 8 - 행복 (happiness) */}
        <S.CharacterWrapper $delay={0} $duration={2.5}>
          {renderEmotionCharacter("happiness")}
        </S.CharacterWrapper>

        {/* Component 6 - 슬픔 (sadness) */}
        <S.CharacterWrapper $delay={0.3} $duration={2.8}>
          {renderEmotionCharacter("sadness")}
        </S.CharacterWrapper>

        {/* Component 3 - 분노 (anger) */}
        <S.CharacterWrapper $delay={0.6} $duration={2.2}>
          {renderEmotionCharacter("anger")}
        </S.CharacterWrapper>

        {/* Component 4 - 우울 (depression) */}
        <S.CharacterWrapper $delay={0.2} $duration={2.6}>
          {renderEmotionCharacter("depression")}
        </S.CharacterWrapper>

        {/* Component 5 - 중립 (neutral) */}
        <S.CharacterWrapper $delay={0.4} $duration={2.4}>
          {renderEmotionCharacter("neutral")}
        </S.CharacterWrapper>

        {/* Component 7 - 불안 (anxiety) */}
        <S.CharacterWrapper $delay={0.5} $duration={2.7}>
          {renderEmotionCharacter("anxiety")}
        </S.CharacterWrapper>
      </S.CharactersGroup>
    </S.Container>
  );
}

