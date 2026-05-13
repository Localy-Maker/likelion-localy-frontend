import {
  ItemGridWrapper,
  ItemCard,
  ItemImage,
  PriceBadge,
  TakeOffCard,
} from "@/features/character/styles/CharacterShop.styles";
import { isItemOwned } from "@/assets/character";

/**
 * 카테고리별 아이템 4열 그리드.
 * 첫 칸은 "벗기" (장착 해제). 그 다음부터 실제 아이템.
 * 미보유 아이템은 흐리게 표시되고 가격 뱃지가 노출된다.
 */
export default function ItemGrid({
  items,
  selectedId,
  ownedItems,
  onPick,
  onTakeOff,
}) {
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
      {items.map((item) => {
        const owned = isItemOwned(item.id, ownedItems);
        return (
          <ItemCard
            key={item.id}
            type="button"
            $selected={selectedId === item.id}
            onClick={() => onPick(item.id)}
          >
            <ItemImage $locked={!owned}>
              <img src={item.src} alt={item.id} />
            </ItemImage>
            {!owned ? <PriceBadge>{item.price}P</PriceBadge> : null}
          </ItemCard>
        );
      })}
    </ItemGridWrapper>
  );
}
