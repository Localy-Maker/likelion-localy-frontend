import { getBodyCharacterSrc } from "@/assets/character";

/**
 * 감정 캐릭터 SVG 렌더링 함수
 * 본체 SVG는 src/assets/character/body/{emotion}.svg 에서 로드.
 * 기존 인라인 SVG(33×30) 와 동일한 진입점을 유지하기 위해 함수 시그니처는 그대로 둠.
 */
export const renderEmotionCharacter = (character, options = {}) => {
  if (!character) return null;
  const src = getBodyCharacterSrc(character);
  if (!src) return null;

  const { width = 33, height = "auto", alt = "" } = options;
  return (
    <img
      src={src}
      width={width}
      height={height}
      alt={alt}
      style={{ display: "inline-block", verticalAlign: "middle" }}
    />
  );
};
