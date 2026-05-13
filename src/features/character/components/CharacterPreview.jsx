import { useMemo } from "react";
import {
  PreviewSection,
  PreviewLayer,
  PreviewBackgroundLayer,
} from "@/features/character/styles/CharacterShop.styles";
import { renderEmotionCharacter } from "@/shared/utils/emotionCharacters";
import { getItemById, SHADOW_CHARACTERS } from "@/assets/character";

/**
 * 본체(감정 캐릭터) + 배경 + 모자 + 악세사리 + 기타 를 레이어로 합성해 미리보기.
 *
 * @param {object} props
 * @param {string|null} props.characterId - 감정 키 (happiness, anger, ...)
 * @param {{background, hat, accessory, etc}} props.equip - 카테고리별 아이템 id
 */
export default function CharacterPreview({ characterId, equip }) {
  const background = useMemo(
    () => getItemById(equip?.background),
    [equip?.background],
  );
  const hat = useMemo(() => getItemById(equip?.hat), [equip?.hat]);
  const accessory = useMemo(
    () => getItemById(equip?.accessory),
    [equip?.accessory],
  );
  const etc = useMemo(() => getItemById(equip?.etc), [equip?.etc]);

  // 본체는 감정 SVG 또는 shadow 변형. characterId 가 없으면 happiness 기본.
  const emotion = characterId ?? "happiness";
  const shadowIdx = SHADOW_CHARACTERS.length ? 0 : null;

  return (
    <PreviewSection>
      {background ? (
        <PreviewBackgroundLayer>
          <img src={background.src} alt="" />
        </PreviewBackgroundLayer>
      ) : null}

      <PreviewLayer>
        <div style={{ transform: "scale(6)", transformOrigin: "center" }}>
          {renderEmotionCharacter(emotion) || (
            shadowIdx != null ? (
              <img src={SHADOW_CHARACTERS[shadowIdx].src} alt="" />
            ) : null
          )}
        </div>
      </PreviewLayer>

      {accessory ? (
        <PreviewLayer>
          <img src={accessory.src} alt="" />
        </PreviewLayer>
      ) : null}

      {hat ? (
        <PreviewLayer style={{ alignItems: "flex-start", paddingTop: "8%" }}>
          <img src={hat.src} alt="" />
        </PreviewLayer>
      ) : null}

      {etc ? (
        <PreviewLayer>
          <img src={etc.src} alt="" />
        </PreviewLayer>
      ) : null}
    </PreviewSection>
  );
}
