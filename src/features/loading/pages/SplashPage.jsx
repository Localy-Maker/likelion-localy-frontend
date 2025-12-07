import * as S from "../styles/SplashPage.styles";
import { renderEmotionCharacter } from "@/shared/utils/emotionCharacters";

/**
 * 스플래시 페이지 컴포넌트
 * 로딩 페이지와 동일한 디자인이지만 캐릭터 움직임이 없음
 */
export default function SplashPage() {
  return (
    <S.Container>
      {/* Localy Logo */}
      <S.Logo>Localy</S.Logo>

      {/* Slogan */}
      <S.Slogan>Your Ally for Every Feeling, Every Place</S.Slogan>

      {/* 감정 캐릭터들 (움직임 없음) */}
      <S.CharactersGroup>
        {/* Component 8 - 행복 (happiness) */}
        <S.CharacterWrapper>
          {renderEmotionCharacter("happiness")}
        </S.CharacterWrapper>

        {/* Component 6 - 슬픔 (sadness) */}
        <S.CharacterWrapper>
          {renderEmotionCharacter("sadness")}
        </S.CharacterWrapper>

        {/* Component 3 - 분노 (anger) */}
        <S.CharacterWrapper>
          {renderEmotionCharacter("anger")}
        </S.CharacterWrapper>

        {/* Component 4 - 우울 (depression) */}
        <S.CharacterWrapper>
          {renderEmotionCharacter("depression")}
        </S.CharacterWrapper>

        {/* Component 5 - 중립 (neutral) */}
        <S.CharacterWrapper>
          {renderEmotionCharacter("neutral")}
        </S.CharacterWrapper>

        {/* Component 7 - 불안 (anxiety) */}
        <S.CharacterWrapper>
          {renderEmotionCharacter("anxiety")}
        </S.CharacterWrapper>
      </S.CharactersGroup>
    </S.Container>
  );
}

