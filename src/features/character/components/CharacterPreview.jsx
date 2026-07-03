import styled from "styled-components";
import { renderEmotionCharacter } from "@/shared/utils/emotionCharacters";
import { getItemById } from "@/assets/character";

/**
 * 모든 위치/크기를 컨테이너 size 의 비율로 계산하여 어떤 크기에서도 동일한 합성으로 렌더되게 함.
 * Figma 명세 + 사용자 제공 이미지 2 기준 비율:
 *   - 캐릭터 본체: 컨테이너 중앙, 본체 SVG(33×30) 를 size/40 배 스케일
 *   - 모자: 본체 머리 위에 약간 걸치도록 top 18% / width 55%
 *   - 악세서리: 얼굴 중앙에 top 45% / width 40%
 *   - 기타: 우하단 (장식) top 60% / right 10% / width 28%
 *   - 배경: 컨테이너 전체
 */

const Box = styled.div`
  position: relative;
  width: ${(p) => p.$size}px;
  height: ${(p) => p.$size}px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: visible;
`;

const Background = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 0;
  border-radius: 16px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const Body = styled.div`
  position: relative;
  z-index: 1;
  transform: scale(${(p) => p.$scale});
  transform-origin: center;
`;

const Hat = styled.div`
  position: absolute;
  top: ${(p) => p.$size * 0.05}px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 3;
  width: ${(p) => p.$size * 0.55}px;
  display: flex;
  justify-content: center;

  img {
    width: 100%;
    height: auto;
    object-fit: contain;
  }
`;

const Accessory = styled.div`
  position: absolute;
  top: ${(p) => p.$size * 0.45}px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
  width: ${(p) => p.$size * 0.4}px;
  display: flex;
  justify-content: center;

  img {
    width: 100%;
    height: auto;
    object-fit: contain;
  }
`;

const Etc = styled.div`
  position: absolute;
  bottom: ${(p) => p.$size * 0.06}px;
  right: ${(p) => p.$size * 0.08}px;
  z-index: 4;
  width: ${(p) => p.$size * 0.28}px;

  img {
    width: 100%;
    height: auto;
    object-fit: contain;
  }
`;

// 서버 본체 이미지를 컨테이너의 약 80% 폭으로 표시(로컬 본체 스케일과 시각적으로 정렬).
const ServerBody = styled.div`
  position: relative;
  z-index: 1;
  width: ${(p) => p.$size * 0.8}px;
  height: ${(p) => p.$size * 0.8}px;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

/**
 * 캐릭터 미리보기 — 본체 + 배경 + 모자 + 악세서리 + 기타를 카테고리별 위치에 자동 합성.
 * 컨테이너 size 의 비율로 모든 위치/크기를 계산하므로 동일 컴포넌트로 큰 미리보기와 작은 아바타를 모두 렌더할 수 있다.
 *
 * 두 가지 모드:
 *  - 로컬 모드(기본): characterId(감정) + equip(로컬 아이템 id) 로 렌더. 홈 카드/마이페이지가 사용.
 *  - 서버 모드(추가): bodySrc(서버 캐릭터 imageUrl)가 있으면 서버가 주는 imageUrl 들을 직접 렌더.
 *    상점이 서버 상태로 미리보기를 그릴 때 사용한다. bodySrc 미제공 시 로컬 모드로 폴백하므로
 *    기존 호출부(홈 카드/마이페이지)는 변경 없이 그대로 동작한다.
 */
export default function CharacterPreview({
  characterId,
  equip,
  size = 220,
  bodySrc = null,
  backgroundSrc = null,
  hatSrc = null,
  accessorySrc = null,
  etcSrc = null,
}) {
  // 서버 모드: 서버가 내려준 imageUrl 을 그대로 합성(위치는 로컬 모드와 동일).
  if (bodySrc) {
    return (
      <Box $size={size}>
        {backgroundSrc ? (
          <Background>
            <img src={backgroundSrc} alt="" />
          </Background>
        ) : null}

        <ServerBody $size={size}>
          <img src={bodySrc} alt="" />
        </ServerBody>

        {accessorySrc ? (
          <Accessory $size={size}>
            <img src={accessorySrc} alt="" />
          </Accessory>
        ) : null}

        {hatSrc ? (
          <Hat $size={size}>
            <img src={hatSrc} alt="" />
          </Hat>
        ) : null}

        {etcSrc ? (
          <Etc $size={size}>
            <img src={etcSrc} alt="" />
          </Etc>
        ) : null}
      </Box>
    );
  }

  // 로컬 모드: 조기 return(서버 모드) 이후이므로 훅 대신 동기 조회로 계산(getItemById 는 경량).
  const emotion = characterId ?? "happiness";
  const background = getItemById(equip?.background);
  const hat = getItemById(equip?.hat);
  const accessory = getItemById(equip?.accessory);
  const etc = getItemById(equip?.etc);

  // 본체 SVG (33×30) 가 컨테이너의 약 80% 를 차지하도록 스케일 산출.
  const scale = (size * 0.8) / 33;

  return (
    <Box $size={size}>
      {background ? (
        <Background>
          <img src={background.src} alt="" />
        </Background>
      ) : null}

      <Body $scale={scale}>{renderEmotionCharacter(emotion)}</Body>

      {accessory ? (
        <Accessory $size={size}>
          <img src={accessory.src} alt="" />
        </Accessory>
      ) : null}

      {hat ? (
        <Hat $size={size}>
          <img src={hat.src} alt="" />
        </Hat>
      ) : null}

      {etc ? (
        <Etc $size={size}>
          <img src={etc.src} alt="" />
        </Etc>
      ) : null}
    </Box>
  );
}
