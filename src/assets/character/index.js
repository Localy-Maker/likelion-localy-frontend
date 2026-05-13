// Character shop asset manifest.
//
// Folder layout (created by _staging/reorganize.sh):
//   hats/{emotion}/NN.svg
//   accessories/{emotion}/NN.svg
//   backgrounds/{emotion}/NN.{svg|png}
//   etc/{emotion}/NN.svg
//   shadows/NN.svg
// emotion ∈ happiness | anger | sadness | depression | anxiety | neutral | default

const hatModules = import.meta.glob("./hats/*/*.{svg,png}", {
  eager: true,
  import: "default",
});
const accessoryModules = import.meta.glob("./accessories/*/*.{svg,png}", {
  eager: true,
  import: "default",
});
const backgroundModules = import.meta.glob("./backgrounds/*/*.{svg,png}", {
  eager: true,
  import: "default",
});
const etcModules = import.meta.glob("./etc/*/*.{svg,png}", {
  eager: true,
  import: "default",
});
const shadowModules = import.meta.glob("./shadows/*.svg", {
  eager: true,
  import: "default",
});

// 카테고리별 기본 가격 (P). 백엔드 가격 정책 도입 시 서버 값으로 교체 예정.
const CATEGORY_PRICE = {
  hat: 20,
  accessory: 20,
  background: 30,
  etc: 10,
};

function toItems(modules, category) {
  return Object.entries(modules)
    .map(([path, src]) => {
      // path like "./hats/anger/03.svg"
      const segments = path.split("/");
      const emotion = segments[2];
      const file = segments[3];
      const num = file.split(".")[0];
      return {
        id: `${category}-${emotion}-${num}`,
        category,
        emotion,
        src,
        price: emotion === "default" ? 0 : CATEGORY_PRICE[category] ?? 10,
      };
    })
    .sort((a, b) => a.id.localeCompare(b.id));
}

export const SHOP_ITEMS = {
  hat: toItems(hatModules, "hat"),
  accessory: toItems(accessoryModules, "accessory"),
  background: toItems(backgroundModules, "background"),
  etc: toItems(etcModules, "etc"),
};

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
  const category = id.split("-")[0];
  const bucket = SHOP_ITEMS[category];
  if (!bucket) return null;
  return bucket.find((item) => item.id === id) ?? null;
}

export function filterItemsByEmotion(category, emotion) {
  const items = SHOP_ITEMS[category] ?? [];
  if (!emotion) return items;
  return items.filter(
    (item) => item.emotion === emotion || item.emotion === "default",
  );
}

/**
 * 아이템 보유 여부. default 카테고리는 항상 보유로 간주한다.
 */
export function isItemOwned(itemId, ownedItems) {
  if (!itemId) return true;
  const item = getItemById(itemId);
  if (!item) return false;
  if (item.emotion === "default" || item.price === 0) return true;
  return Array.isArray(ownedItems) && ownedItems.includes(itemId);
}
