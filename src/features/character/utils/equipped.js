/**
 * 장착 상태(equipped) 정규화 및 레이어 합성 유틸.
 *
 * 백엔드 equipped 형태: { background, hat, accessory, etc } — 각 슬롯은
 * { itemId, imageUrl } 객체이거나 미착용 시 null.
 */

export const SLOTS = ["background", "hat", "accessory", "etc"];

/**
 * 한 슬롯 값을 { itemId, imageUrl } | null 로 정규화.
 * itemId 가 없거나 0 이면 미착용으로 본다.
 */
function normalizeSlot(slot) {
  if (!slot || !slot.itemId) return null;
  return { itemId: slot.itemId, imageUrl: slot.imageUrl ?? null };
}

/**
 * 서버 equipped 객체를 슬롯별 { itemId, imageUrl } | null 맵으로 정규화.
 * @param {object|undefined} equipped
 * @returns {{ background, hat, accessory, etc }}
 */
export function normalizeEquipped(equipped) {
  const src = equipped ?? {};
  return {
    background: normalizeSlot(src.background),
    hat: normalizeSlot(src.hat),
    accessory: normalizeSlot(src.accessory),
    etc: normalizeSlot(src.etc),
  };
}

/**
 * 미리보기 레이어 순서대로 imageUrl 배열 반환.
 * 백엔드 equipped 선언 순서(background → hat → accessory → etc)를 그대로 따른다.
 * 배경을 맨 뒤에 깔고 그 위에 캐릭터 본체, 이후 스펙 순서대로 착용 아이템을 올린다.
 *   background → 캐릭터 본체 → hat → accessory → etc
 * @param {string|null} characterImageUrl - 캐릭터 본체 이미지
 * @param {object} equipped - 정규화된 장착 맵
 * @returns {Array<{ key: string, imageUrl: string }>}
 */
export function equippedToLayers(characterImageUrl, equipped) {
  const eq = equipped ?? {};
  const ordered = [
    { key: "background", imageUrl: eq.background?.imageUrl },
    { key: "character", imageUrl: characterImageUrl },
    { key: "hat", imageUrl: eq.hat?.imageUrl },
    { key: "accessory", imageUrl: eq.accessory?.imageUrl },
    { key: "etc", imageUrl: eq.etc?.imageUrl },
  ];
  return ordered.filter((layer) => !!layer.imageUrl);
}

/**
 * 두 장착 맵 사이에서 itemId 가 달라진 슬롯들의 변경 목록 반환.
 * @returns {Array<{ category: string, itemId: number|null }>}
 */
export function diffEquipped(draft, saved) {
  const changes = [];
  for (const slot of SLOTS) {
    const draftId = draft?.[slot]?.itemId ?? null;
    const savedId = saved?.[slot]?.itemId ?? null;
    if (draftId !== savedId) changes.push({ category: slot, itemId: draftId });
  }
  return changes;
}
