import {
  ItemGridWrapper,
  ItemSlot,
  ItemCard,
  ItemImage,
  ItemPrice,
  EmptyMessage,
} from "@/features/character/styles/CharacterShop.styles";
import { resolveAssetUrl } from "@/features/character/utils/assetUrl";

/**
 * 카테고리별 아이템 3열 그리드(서버 아이템 기준).
 * 서버 아이템 shape: { itemId, category, name, price, imageUrl, isOwned, isEquipped }.
 * 카드 클릭 시 onPick(item) 호출 — 착용/해제/구매 분기는 부모에서 처리.
 *
 * @param {object} props
 * @param {Array} props.items - 서버 아이템 목록
 * @param {boolean} [props.loading=false] - 조회 중 여부
 * @param {function} props.onPick - 아이템 클릭 시 호출(item 전달)
 * @param {boolean} [props.hidePriceWhenOwned=true] - 보유 아이템 탭에서는 가격을 숨김
 */
export default function ItemGrid({
  items,
  loading = false,
  onPick,
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
              $selected={item.isEquipped}
              onClick={() => onPick(item)}
            >
              <ItemImage $locked={!owned}>
                <img src={resolveAssetUrl(item.imageUrl)} alt={item.name} />
              </ItemImage>
            </ItemCard>
            {showPrice ? <ItemPrice>{item.price} P</ItemPrice> : null}
          </ItemSlot>
        );
      })}
    </ItemGridWrapper>
  );
}
