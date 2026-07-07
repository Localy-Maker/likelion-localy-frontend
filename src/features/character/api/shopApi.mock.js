/**
 * 상점 API dev 목(mock) — 방식 B(서버 합성) / 단일 아이템 트라이온 모델.
 *
 * 백엔드가 죽었거나(502) imageUrl 이 placeholder 인 동안, 서버 없이 상점 플로우를 실제
 * 로컬 에셋으로 테스트하기 위한 목. `VITE_USE_MOCK=true` 일 때만 shopApi.js 가 동적 import.
 *
 * 방식 B: "캐릭터 + 착용 아이템 → 합성 이미지 1장" 을 서버(=이 목)가 만들어 내려준다.
 *   - manifest 의 감정별 합성본(srcByEmotion) = 백엔드가 미리 합성해둔 (캐릭터,아이템) 이미지.
 *   - 단일 아이템 트라이온: 한 번에 아이템 하나만 착용. 새 아이템을 고르면 이전 것을 대체.
 *
 * 상태(포인트/보유/착용/현재 캐릭터)는 모듈 수준에서 유지되어 세션 동안 실제처럼 반영된다.
 */
import {
  SHOP_ITEMS,
  EMOTIONS,
  getBodyCharacterSrc,
} from "@/assets/character";

const CATEGORY_TO_API = {
  hat: "HAT",
  accessory: "ACCESSORY",
  background: "BACKGROUND",
  etc: "ETC",
};

const CATEGORY_LABEL = {
  hat: "모자",
  accessory: "액세서리",
  background: "배경",
  etc: "소품",
};

const EMOTION_NAME = {
  happiness: "행복이",
  anger: "버럭이",
  sadness: "슬픔이",
  depression: "우울이",
  anxiety: "불안이",
  neutral: "무야",
};

// ---------------------------------------------------------------------------
// 카탈로그: manifest 의 모든 아이템에 숫자 itemId 부여 + 감정별 합성본(srcByEmotion) 보관.
// ---------------------------------------------------------------------------
let idSeq = 1;
const CATALOG = new Map(); // itemId -> record
const BY_CATEGORY = {}; // categoryKey -> itemId[]

for (const [categoryKey, items] of Object.entries(SHOP_ITEMS)) {
  BY_CATEGORY[categoryKey] = [];
  items.forEach((it) => {
    const itemId = idSeq++;
    CATALOG.set(itemId, {
      itemId,
      categoryKey,
      category: CATEGORY_TO_API[categoryKey] ?? categoryKey.toUpperCase(),
      name: `${CATEGORY_LABEL[categoryKey] ?? categoryKey} ${it.slot}`,
      price: it.price,
      thumbSrc: it.gridSrc, // 그리드 썸네일(본체 없는 카탈로그 아트)
      srcByEmotion: it.srcByEmotion ?? {}, // 감정별 (캐릭터+아이템) 합성본
    });
    BY_CATEGORY[categoryKey].push(itemId);
  });
}

// ---------------------------------------------------------------------------
// 목 세션 상태 (단일 아이템)
// ---------------------------------------------------------------------------
const state = {
  currentPoint: 500,
  currentCharacterCode: EMOTIONS[0] ?? "happiness",
  ownedItemIds: new Set(),
  equippedItemId: null, // 단일 착용 아이템 (null = 미착용)
};

// 시드: 모자 첫 아이템 보유 + 착용해 최초 미리보기가 비지 않게 한다.
const seedHat = BY_CATEGORY.hat?.[0];
if (seedHat) {
  state.ownedItemIds.add(seedHat);
  state.equippedItemId = seedHat;
}

const delay = (ms = 180) => new Promise((r) => setTimeout(r, ms));

/**
 * 방식 B 핵심: 캐릭터 + 주어진 아이템 → 합성 이미지 URL.
 * itemId 가 null 이면 아이템 없는 본체 단독 이미지.
 * @param {number|null} itemId
 * @param {string} [characterCode] 미지정 시 현재 캐릭터 사용
 */
function compositeFor(itemId, characterCode) {
  const emotion = characterCode ?? state.currentCharacterCode;
  if (itemId == null) return getBodyCharacterSrc(emotion);
  const item = CATALOG.get(itemId);
  if (!item) return getBodyCharacterSrc(emotion);
  // 해당 감정 합성본 우선, 없으면 본체로 폴백.
  return item.srcByEmotion?.[emotion] ?? getBodyCharacterSrc(emotion);
}

/** 착용 아이템 하나만 채운 4슬롯 equipped 맵 (기존 스토어 호환용) */
function buildEquipped() {
  const out = { background: null, hat: null, accessory: null, etc: null };
  if (state.equippedItemId != null) {
    const it = CATALOG.get(state.equippedItemId);
    if (it) {
      // 착용 아이템의 슬롯에는 "합성본"을 넣는다(방식 B: 서버가 합성한 최종 이미지).
      out[it.categoryKey] = {
        itemId: it.itemId,
        imageUrl: compositeFor(it.itemId),
      };
    }
  }
  return out;
}

function currentCharacter() {
  const code = state.currentCharacterCode;
  return {
    code,
    name: EMOTION_NAME[code] ?? code,
    // 방식 B: 현재 착용까지 반영된 "최종 합성 이미지" 를 그대로 내려준다.
    imageUrl: compositeFor(state.equippedItemId),
    equippedItemId: state.equippedItemId,
    equipped: buildEquipped(),
  };
}

function toServerItem(itemId) {
  const it = CATALOG.get(itemId);
  return {
    itemId: it.itemId,
    category: it.category,
    name: it.name,
    price: it.price,
    imageUrl: it.thumbSrc, // 그리드 썸네일
    isOwned: state.ownedItemIds.has(itemId),
    isEquipped: state.equippedItemId === itemId,
  };
}

// ---------------------------------------------------------------------------
// shopApi 시그니처와 동일한 목 함수들
// ---------------------------------------------------------------------------

export async function getCharacters() {
  await delay();
  return {
    characters: EMOTIONS.map((code) => ({
      code,
      name: EMOTION_NAME[code] ?? code,
      imageUrl: getBodyCharacterSrc(code), // 선택 시트용 본체 단독
      isCurrent: code === state.currentCharacterCode,
    })),
  };
}

export async function changeCharacter(characterCode) {
  await delay();
  state.currentCharacterCode = characterCode;
  return currentCharacter();
}

export async function getShopState() {
  await delay();
  return {
    currentPoint: state.currentPoint,
    currentCharacter: currentCharacter(),
  };
}

export async function getShopItems(category) {
  await delay();
  const ids = BY_CATEGORY[category] ?? [];
  return { items: ids.map(toServerItem) };
}

export async function getOwnedItems() {
  await delay();
  const ids = [...state.ownedItemIds].sort((a, b) => a - b);
  return { items: ids.map(toServerItem) };
}

/**
 * 방식 B 미리보기: 현재 캐릭터에 itemId 를 입혔을 때의 합성 이미지.
 * 실제 백엔드에선 POST /api/shop/preview 같은 즉석 합성 엔드포인트에 해당.
 * @param {number|null} itemId
 * @returns {Promise<{ imageUrl: string }>}
 */
export async function getWornPreview(itemId, characterCode) {
  await delay(120);
  return {
    imageUrl: compositeFor(itemId == null ? null : Number(itemId), characterCode),
  };
}

export async function purchaseItem(itemId) {
  await delay();
  const it = CATALOG.get(Number(itemId));
  if (!it) throw new Error("존재하지 않는 아이템입니다.");
  if (state.ownedItemIds.has(it.itemId))
    throw new Error("이미 보유한 아이템입니다.");
  if (state.currentPoint < it.price) throw new Error("포인트가 부족합니다.");
  state.currentPoint -= it.price;
  state.ownedItemIds.add(it.itemId);
  state.equippedItemId = it.itemId; // 단일: 구매 즉시 착용(이전 착용 대체)
  return {
    currentPoint: state.currentPoint,
    purchasedItemId: it.itemId,
    autoEquipped: true,
    wornImageUrl: compositeFor(it.itemId),
  };
}

/**
 * 단일 아이템 착용/해제. category 는 무시(단일 모델). itemId=null 이면 해제.
 */
export async function equipItem(_category, itemId) {
  await delay();
  state.equippedItemId = itemId ?? null;
  return {
    equipped: buildEquipped(),
    equippedItemId: state.equippedItemId,
    wornImageUrl: compositeFor(state.equippedItemId),
  };
}
