import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Header from "@/shared/components/Header/Header";
import CharacterPreview from "@/features/character/components/CharacterPreview";
import CategoryTabs from "@/features/character/components/CategoryTabs";
import ItemGrid from "@/features/character/components/ItemGrid";
import PurchaseSheet from "@/features/character/components/PurchaseSheet";
import CharacterSelectSheet from "@/features/character/components/CharacterSelectSheet";
import {
  Page,
  TopChipRow,
  CharacterSelectChip,
  PointsChip,
  PreviewArea,
} from "@/features/character/styles/CharacterShop.styles";
import {
  getShopState,
  getItemsByCategory,
  getOwnedItems,
  getCharacters,
  purchaseItem,
  equipItem,
  changeCurrentCharacter,
} from "@/features/character/api/shopApi";
import { resolveAssetUrl } from "@/features/character/utils/assetUrl";
import { useUserStore } from "@/shared/stores/userStore";

// 탭 key ↔ 서버 카테고리(BACKGROUND|HAT|ACCESSORY|ETC) 매핑. "owned" 는 전용 엔드포인트.
const TAB_TO_CATEGORY = {
  background: "BACKGROUND",
  hat: "HAT",
  accessory: "ACCESSORY",
  etc: "ETC",
};

export default function CharacterShopPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState("hat");
  const [purchaseTarget, setPurchaseTarget] = useState(null);
  const [purchasing, setPurchasing] = useState(false);
  const [characterSheetOpen, setCharacterSheetOpen] = useState(false);

  const setPoints = useUserStore((s) => s.setPoints);

  // 상점 상태(포인트 + 현재 캐릭터 + 착용). 502/네트워크 실패 시 undefined → 빈 상태로 렌더.
  const { data: shopState } = useQuery({
    queryKey: ["shop-state"],
    queryFn: getShopState,
    staleTime: 1000 * 30,
    retry: false,
  });

  // 현재 탭의 아이템 목록. owned 탭은 별도 엔드포인트.
  const { data: itemsData, isLoading: itemsLoading } = useQuery({
    queryKey: ["shop-items", tab],
    queryFn: () =>
      tab === "owned"
        ? getOwnedItems()
        : getItemsByCategory(TAB_TO_CATEGORY[tab]),
    staleTime: 1000 * 30,
    retry: false,
  });

  // 캐릭터 목록(선택 시트에서 사용). 시트 열릴 때만 조회.
  const { data: charactersData } = useQuery({
    queryKey: ["shop-characters"],
    queryFn: getCharacters,
    enabled: characterSheetOpen,
    staleTime: 1000 * 60,
    retry: false,
  });

  const points = shopState?.currentPoint ?? 0;
  const currentCharacter = shopState?.currentCharacter ?? null;
  const equipped = currentCharacter?.equipped ?? null;
  const items = itemsData?.items ?? [];

  // 서버 착용 상태 → CharacterPreview 서버 모드 props(절대 URL 로 변환).
  const previewProps = useMemo(
    () => ({
      bodySrc: resolveAssetUrl(currentCharacter?.imageUrl),
      backgroundSrc: resolveAssetUrl(equipped?.background?.imageUrl),
      hatSrc: resolveAssetUrl(equipped?.hat?.imageUrl),
      accessorySrc: resolveAssetUrl(equipped?.accessory?.imageUrl),
      etcSrc: resolveAssetUrl(equipped?.etc?.imageUrl),
    }),
    [currentCharacter, equipped],
  );

  // 상태/아이템/캐릭터를 함께 무효화(변경 후 서버 재조회).
  const refreshAll = () => {
    queryClient.invalidateQueries({ queryKey: ["shop-state"] });
    queryClient.invalidateQueries({ queryKey: ["shop-items"] });
    queryClient.invalidateQueries({ queryKey: ["shop-characters"] });
  };

  /**
   * 아이템 클릭:
   *  - 보유 + 착용중  → 해제(PATCH equip itemId:null)
   *  - 보유 + 미착용  → 착용(PATCH equip)
   *  - 미보유        → 구매 시트 오픈
   */
  const handleItemPick = async (item) => {
    if (!item) return;
    if (!item.isOwned) {
      setPurchaseTarget(item);
      return;
    }
    try {
      // item.category 는 서버가 내려준 값(BACKGROUND|HAT|ACCESSORY|ETC) 그대로 사용.
      await equipItem(item.category, item.isEquipped ? null : item.itemId);
      refreshAll();
    } catch (err) {
      if (import.meta.env.DEV) console.warn("착용 변경 실패:", err?.message);
    }
  };

  const handlePurchaseConfirm = async () => {
    if (!purchaseTarget || purchasing) return;
    if (points < purchaseTarget.price) return;
    setPurchasing(true);
    try {
      // 구매 성공 시 currentPoint 를 즉시 userStore 에 반영(다른 화면 정합성). 서버가 자동 착용.
      const res = await purchaseItem(purchaseTarget.itemId);
      if (typeof res?.currentPoint === "number") setPoints(res.currentPoint);
      setPurchaseTarget(null);
      refreshAll();
    } catch (err) {
      // SHOP002(이미 보유)/SHOP003(포인트 부족) 등 서버 에러. ponytail: 토스트 UI 는 BE 복구 후 추가.
      if (import.meta.env.DEV) console.warn("구매 실패:", err?.message);
      setPurchaseTarget(null);
    } finally {
      setPurchasing(false);
    }
  };

  // 본체 변경: PATCH /api/characters/current. 착용 상태는 서버가 유지.
  const handleCharacterChange = async (code) => {
    try {
      await changeCurrentCharacter(code);
      setCharacterSheetOpen(false);
      refreshAll();
    } catch (err) {
      if (import.meta.env.DEV) console.warn("캐릭터 변경 실패:", err?.message);
    }
  };

  return (
    <>
      <Header text="MY LOCALY" onLeftClick={() => navigate(-1)} rightIcon={null} />
      <Page>
        <TopChipRow>
          <CharacterSelectChip
            type="button"
            onClick={() => setCharacterSheetOpen(true)}
          >
            캐릭터 선택
          </CharacterSelectChip>
          <PointsChip>{points} P</PointsChip>
        </TopChipRow>

        <PreviewArea>
          <CharacterPreview {...previewProps} />
        </PreviewArea>

        <CategoryTabs active={tab} onChange={setTab} />

        <ItemGrid
          items={items}
          loading={itemsLoading}
          onPick={handleItemPick}
          hidePriceWhenOwned={tab === "owned"}
        />
      </Page>

      <PurchaseSheet
        item={purchaseTarget}
        balance={points}
        loading={purchasing}
        onConfirm={handlePurchaseConfirm}
        onClose={() => setPurchaseTarget(null)}
      />

      <CharacterSelectSheet
        open={characterSheetOpen}
        characters={charactersData?.characters ?? []}
        onSelect={handleCharacterChange}
        onClose={() => setCharacterSheetOpen(false)}
      />
    </>
  );
}
