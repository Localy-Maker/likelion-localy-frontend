import styled from "styled-components";
import { equippedToLayers } from "@/features/character/utils/equipped";

/**
 * 캐릭터 미리보기.
 *
 * - 방식 B(서버 합성): `src` 가 주어지면 서버가 합성한 최종 이미지 1장을 그대로 그린다.
 * - 방식 A(레이어 합성, 폴백): `src` 가 없으면 배경 → 본체 → hat → accessory → etc 순으로 겹쳐 그린다.
 *
 * @param {object} props
 * @param {string|null} [props.src] - 서버가 합성한 최종 이미지(방식 B). 있으면 이걸 우선 사용.
 * @param {string|null} props.characterImageUrl - 캐릭터 본체 이미지 URL(방식 A 폴백용)
 * @param {object} props.equipped - 정규화된 장착 맵(방식 A 폴백용)
 * @param {number} [props.size=220]
 */
const Box = styled.div`
  position: relative;
  width: ${(p) => p.$size}px;
  height: ${(p) => p.$size}px;
  margin: 0 auto;
`;

const Layer = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
`;

export default function CharacterPreview({
  src,
  characterImageUrl,
  equipped,
  size = 220,
}) {
  // 방식 B: 서버 합성 이미지 1장.
  if (src) {
    return (
      <Box $size={size}>
        <Layer src={src} alt="" />
      </Box>
    );
  }

  // 방식 A 폴백: 레이어 합성.
  const layers = equippedToLayers(characterImageUrl, equipped);
  return (
    <Box $size={size}>
      {layers.map((layer) => (
        <Layer key={layer.key} src={layer.imageUrl} alt="" />
      ))}
    </Box>
  );
}
