import {
  ItemGridWrapper,
  ItemCard,
  TakeOffCard,
} from "@/features/character/styles/CharacterShop.styles";

/**
 * 카테고리별 아이템 4열 그리드.
 * 첫 칸은 "벗기" (장착 해제). 그 다음부터 실제 아이템.
 */
export default function ItemGrid({ items, selectedId, onPick, onTakeOff }) {
  return (
    <ItemGridWrapper>
      <TakeOffCard
        type="button"
        $selected={!selectedId}
        onClick={onTakeOff}
        aria-label="장착 해제"
      >
        벗기
      </TakeOffCard>
      {items.map((item) => (
        <ItemCard
          key={item.id}
          type="button"
          $selected={selectedId === item.id}
          onClick={() => onPick(item.id)}
        >
          <img src={item.src} alt={item.id} />
        </ItemCard>
      ))}
    </ItemGridWrapper>
  );
}
