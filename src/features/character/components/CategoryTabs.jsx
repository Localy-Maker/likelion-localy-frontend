import {
  TabsBlock,
  TabButton,
} from "@/features/character/styles/CharacterShop.styles";

const TAB_DEFS = [
  { key: "owned", label: "보유 아이템" },
  { key: "background", label: "배경" },
  { key: "hat", label: "모자" },
  { key: "accessory", label: "악세서리" },
  { key: "etc", label: "기타" },
];

export default function CategoryTabs({ active, onChange }) {
  return (
    <TabsBlock>
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
    </TabsBlock>
  );
}
