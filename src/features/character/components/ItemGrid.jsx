import {
  ItemGridWrapper,
  ItemSlot,
  ItemCard,
  ItemImage,
  ItemPrice,
  EmptyMessage,
} from "@/features/character/styles/CharacterShop.styles";

/**
 * 아이템 3열 그리드 (서버 데이터 기반).
 * 카드 클릭 시 onPick(item) 호출 — 장착/해제/구매 분기는 부모에서 처리.
 *
 * @param {object} props
 * @param {Array} props.items - 서버 아이템 목록 ({ itemId, name, price, imageUrl, isOwned })
 * @param {Array<number>} props.selectedIds - 현재(드래프트) 장착된 itemId 목록
 * @param {function} props.onPick - 아이템 클릭 시 호출
 * @param {boolean} [props.loading=false] - 로딩 상태
 * @param {boolean} [props.hidePriceWhenOwned=true] - 보유 아이템은 가격 숨김
 */
export default function ItemGrid({
  items,
  selectedIds = [],
  onPick,
  loading = false,
  hidePriceWhenOwned = true,
}) {
  if (loading) {
    return (
      <ItemGridWrapper>
        <EmptyMessage>불러오는 중…</EmptyMessage>
      </ItemGridWrapper>
    );
  }

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
        const owned = item.isOwned;
        const showPrice = !(owned && hidePriceWhenOwned);
        return (
          <ItemSlot key={item.itemId}>
            <ItemCard
              type="button"
              $selected={selectedIds.includes(item.itemId)}
              onClick={() => onPick(item)}
            >
              <ItemImage $locked={!owned}>
                <img src={item.imageUrl} alt={item.name ?? ""} />
              </ItemImage>
            </ItemCard>
            {showPrice ? <ItemPrice>{item.price} P</ItemPrice> : null}
          </ItemSlot>
        );
      })}
    </ItemGridWrapper>
  );
}
