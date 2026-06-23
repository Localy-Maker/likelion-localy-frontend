import { useNavigate } from "react-router";
import * as S from "../styles/WelcomePage.styles";
import { renderEmotionCharacter } from "@/shared/utils/emotionCharacters";

/**
 * @component WelcomePage
 * @description 온보딩 완료 후 표시되는 환영 페이지
 */
export default function WelcomePage() {
  const navigate = useNavigate();

  const handleStart = () => {
    // 메인 페이지로 이동
    navigate("/main");
  };

  return (
    <S.Container>
      {/* Localy 로고 */}
      <S.Logo>Localy</S.Logo>
      
      {/* 슬로건 */}
      <S.Slogan>Your Ally for Every Feeling, Every Place</S.Slogan>
      
      {/* 환영 메시지 */}
      <S.WelcomeSection>
        <S.WelcomeTitle>환영해요!</S.WelcomeTitle>
        <S.WelcomeMessage>
          이제 로컬리와 함께,
          <br />
          낯선 외로움은 잠시 잊고,
          <br />
          당신의 감정을 이해하는 친구를 만나보세요.
          <br />
          <br />
          당신의 이야기를 들을 준비가 되었습니다. 🙂
        </S.WelcomeMessage>
      </S.WelcomeSection>
      
      {/* 감정 캐릭터들 */}
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
      
      {/* 시작하기 버튼 */}
      <S.StartButton onClick={handleStart}>
        시작하기
      </S.StartButton>
    </S.Container>
  );
}

