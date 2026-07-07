// Character shop asset manifest.
//
// 폴더 구조 (rename 완료 — default 슬롯 번호 기준으로 emotion 폴더가 정렬됨):
//   {category}/default/NN.svg       — 카탈로그용 (본체 없는 아이템만 그림)
//   {category}/{emotion}/NN.svg     — 미리보기용 (해당 감정 본체 + 아이템 composite)
//   body/{emotion}.svg              — 본체 단독 SVG
// category ∈ hats | accessories | backgrounds | etc
// emotion  ∈ happiness | anger | sadness | depression | anxiety | neutral
//
// 같은 슬롯 번호는 동일 디자인 (예: hats/default/05.svg 와 hats/happiness/05.svg 는
// "딸기 케이크" 아이템의 카탈로그 그림 vs 행복 캐릭터 합성본).

const allModules = import.meta.glob(
  "./{hats,accessories,backgrounds,etc}/*/*.{svg,png}",
  { eager: true, import: "default" },
);
const bodyModules = import.meta.glob("./body/*.svg", {
  eager: true,
  import: "default",
});
const shadowModules = import.meta.glob("./shadows/*.svg", {
  eager: true,
  import: "default",
});

const FOLDER_BY_CATEGORY = {
  hat: "hats",
  accessory: "accessories",
  background: "backgrounds",
  etc: "etc",
};
const CATEGORIES = Object.keys(FOLDER_BY_CATEGORY);

// 카테고리별 기본 가격 (P). 백엔드 가격 정책 도입 시 서버 값으로 교체 예정.
const CATEGORY_PRICE = {
  hat: 20,
  accessory: 20,
  background: 30,
  etc: 10,
};

// moduleMap[category][emotion][slot] = src
const moduleMap = {};
for (const [path, src] of Object.entries(allModules)) {
  // path: "./hats/happiness/01.svg"
  const segs = path.split("/");
  const folder = segs[1];
  const emotion = segs[2];
  const slot = segs[3].split(".")[0];
  const category = CATEGORIES.find((c) => FOLDER_BY_CATEGORY[c] === folder);
  if (!category) continue;
  if (!moduleMap[category]) moduleMap[category] = {};
  if (!moduleMap[category][emotion]) moduleMap[category][emotion] = {};
  moduleMap[category][emotion][slot] = src;
}

// 아이템 목록 = default 폴더 슬롯 기준.
export const SHOP_ITEMS = Object.fromEntries(
  CATEGORIES.map((cat) => {
    const defaults = moduleMap[cat]?.default ?? {};
    const slots = Object.keys(defaults).sort();
    return [
      cat,
      slots.map((slot) => ({
        id: `${cat}-${slot}`,
        category: cat,
        slot,
        gridSrc: defaults[slot],
        srcByEmotion: Object.fromEntries(
          Object.entries(moduleMap[cat] ?? {})
            .filter(([emo]) => emo !== "default")
            .map(([emo, slotMap]) => [emo, slotMap[slot] ?? null]),
        ),
        price: CATEGORY_PRICE[cat] ?? 10,
      })),
    ];
  }),
);

export const BODY_CHARACTERS = Object.fromEntries(
  Object.entries(bodyModules).map(([path, src]) => {
    const emotion = path.split("/").pop().split(".")[0];
    return [emotion, src];
  }),
);

export function getBodyCharacterSrc(emotion) {
  return BODY_CHARACTERS[emotion] ?? BODY_CHARACTERS.happiness ?? null;
}

export const SHADOW_CHARACTERS = Object.entries(shadowModules)
  .map(([path, src]) => ({ id: path.split("/").pop().split(".")[0], src }))
  .sort((a, b) => a.id.localeCompare(b.id));

export const EMOTIONS = [
  "happiness",
  "anger",
  "sadness",
  "depression",
  "anxiety",
  "neutral",
];

export function getItemById(id) {
  if (!id) return null;
  const [category, slot] = id.split("-");
  const bucket = SHOP_ITEMS[category];
  if (!bucket) return null;
  return bucket.find((item) => item.slot === slot) ?? null;
}

/**
 * 주어진 아이템을 특정 감정의 composite SVG 로 그릴 src 반환.
 * 해당 감정에 composite 가 없으면(예: happiness/backgrounds 의 07 슬롯) gridSrc 폴백.
 */
export function getItemSrcForEmotion(itemId, emotion) {
  const item = getItemById(itemId);
  if (!item) return null;
  return item.srcByEmotion?.[emotion] ?? item.gridSrc ?? null;
}

// Legacy 인터페이스 — 카테고리 탭 필터링 시 사용. 새 구조에선 아이템이 감정 비종속이라
// 그냥 카테고리 전체를 반환한다.
export function filterItemsByEmotion(category /*, emotion */) {
  return SHOP_ITEMS[category] ?? [];
}

export function isItemOwned(itemId, ownedItems) {
  if (!itemId) return true;
  return Array.isArray(ownedItems) && ownedItems.includes(itemId);
}
