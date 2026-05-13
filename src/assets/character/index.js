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
