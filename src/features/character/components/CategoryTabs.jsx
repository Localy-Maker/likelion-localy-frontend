import {
  TabRow,
  TabButton,
} from "@/features/character/styles/CharacterShop.styles";

// "body" 는 감정 본체 탭 — store 의 ITEM_CATEGORIES 와 별개로 UI 에서만 다룬다.
const TAB_DEFS = [
  { key: "body", label: "본체" },
  { key: "hat", label: "모자" },
  { key: "accessory", label: "악세사리" },
  { key: "background", label: "배경" },
  { key: "etc", label: "기타" },
];

export default function CategoryTabs({ active, onChange }) {
  return (
    <TabRow>
      {TAB_DEFS.map((tab) => (
        <TabButton
          key={tab.key}
          $active={active === tab.key}
          onClick={() => onChange(tab.key)}
          type="button"
        >
          {tab.label}
        </TabButton>
      ))}
    </TabRow>
  );
}
