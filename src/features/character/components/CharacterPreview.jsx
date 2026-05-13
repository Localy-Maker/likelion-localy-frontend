import { useMemo } from "react";
import styled from "styled-components";
import { renderEmotionCharacter } from "@/shared/utils/emotionCharacters";
import { getItemById } from "@/assets/character";

const PreviewBox = styled.div`
  position: relative;
  width: 220px;
  height: 200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: visible;
`;

const BackgroundLayer = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    border-radius: 16px;
  }
`;

const BodyLayer = styled.div`
  position: relative;
  z-index: 1;
  transform: scale(5);
  transform-origin: center;
`;

const HatLayer = styled.div`
  position: absolute;
  top: 16px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 3;

  img {
    width: 90px;
    height: auto;
    object-fit: contain;
  }
`;

const AccessoryLayer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;

  img {
    width: 70px;
    height: auto;
    object-fit: contain;
  }
`;

const EtcLayer = styled.div`
  position: absolute;
  bottom: 16px;
  right: 16px;
  z-index: 4;

  img {
    width: 50px;
    height: auto;
    object-fit: contain;
  }
`;

/**
 * 캐릭터 미리보기 — 본체(감정) + 배경 + 모자 + 악세서리 + 기타 를 카테고리별 위치에 자동으로 합성.
 *
 * @param {object} props
 * @param {string|null} props.characterId - 감정 키 (happiness, anger, ...)
 * @param {{background, hat, accessory, etc}} [props.equip] - 카테고리별 장착 아이템 id
 */
export default function CharacterPreview({ characterId, equip }) {
  const emotion = characterId ?? "happiness";
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

  return (
    <PreviewBox>
      {background ? (
        <BackgroundLayer>
          <img src={background.src} alt="" />
        </BackgroundLayer>
      ) : null}

      <BodyLayer>{renderEmotionCharacter(emotion)}</BodyLayer>

      {accessory ? (
        <AccessoryLayer>
          <img src={accessory.src} alt="" />
        </AccessoryLayer>
      ) : null}

      {hat ? (
        <HatLayer>
          <img src={hat.src} alt="" />
        </HatLayer>
      ) : null}

      {etc ? (
        <EtcLayer>
          <img src={etc.src} alt="" />
        </EtcLayer>
      ) : null}
    </PreviewBox>
  );
}
