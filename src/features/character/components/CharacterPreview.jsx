import styled from "styled-components";
import { renderEmotionCharacter } from "@/shared/utils/emotionCharacters";

const PreviewBox = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
`;

const Scale = styled.div`
  transform: scale(5);
  transform-origin: center;
`;

/**
 * 캐릭터 미리보기 — Figma 명세에 따라 작은 공간(약 95×80 본체 SVG)으로 렌더.
 * 아이템 SVG 를 별도로 레이어링하지 않고 본체 감정 캐릭터만 렌더한다.
 * 아이템 적용 상태는 상점 그리드의 selected 표시로 확인한다.
 */
export default function CharacterPreview({ characterId }) {
  const emotion = characterId ?? "happiness";
  return (
    <PreviewBox>
      <Scale>{renderEmotionCharacter(emotion)}</Scale>
    </PreviewBox>
  );
}
