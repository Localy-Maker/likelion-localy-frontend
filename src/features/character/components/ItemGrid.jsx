import {
  ItemGridWrapper,
  ItemSlot,
  ItemCard,
  ItemImage,
  ItemPrice,
  EmptyMessage,
} from "@/features/character/styles/CharacterShop.styles";
import { isItemOwned } from "@/assets/character";

/**
 * 카테고리별 아이템 3열 그리드.
 * 각 카드 아래에 가격 텍스트를 표시한다. 카드 클릭 시 onPick(id) 호출 — 동일 id 재클릭 시 해제는 부모에서 처리.
 *
 * @param {object} props
 * @param {Array} props.items - 표시할 아이템 목록
 * @param {string|null} props.selectedId - 현재 장착된 아이템 id
 * @param {Array} props.ownedItems - 보유 아이템 id 배열
 * @param {function} props.onPick - 아이템 클릭 시 호출
 * @param {boolean} [props.hidePriceWhenOwned=true] - 보유 아이템 탭에서는 가격을 숨김
 */
export default function ItemGrid({
  items,
  selectedId,
  ownedItems,
  onPick,
  hidePriceWhenOwned = true,
}) {
  if (!items?.length) {
    return (
      <ItemGridWrapper>
        <EmptyMessage>아이템이 없어요</EmptyMessage>
      </ItemGridWrapper>
    );
  }

  return (
    <ItemGridWrapper>
      {items.map((item) => {
        const owned = isItemOwned(item.id, ownedItems);
        const showPrice = !(owned && hidePriceWhenOwned);
        return (
          <ItemSlot key={item.id}>
            <ItemCard
              type="button"
              $selected={selectedId === item.id}
              onClick={() => onPick(item.id)}
            >
              <ItemImage $locked={!owned}>
                <img src={item.src} alt={item.id} />
              </ItemImage>
            </ItemCard>
            {showPrice ? <ItemPrice>{item.price} P</ItemPrice> : null}
          </ItemSlot>
        );
      })}
    </ItemGridWrapper>
  );
}
