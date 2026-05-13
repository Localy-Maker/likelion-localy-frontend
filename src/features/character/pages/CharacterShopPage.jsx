import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
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
  FloatingSaveButton,
} from "@/features/character/styles/CharacterShop.styles";
import { useCharacterShopStore } from "@/shared/stores/characterShopStore";
import { useUserStore } from "@/shared/stores/userStore";
import {
  filterItemsByEmotion,
  getItemById,
  isItemOwned,
  SHOP_ITEMS,
} from "@/assets/character";

export default function CharacterShopPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("hat");
  const [purchaseItem, setPurchaseItem] = useState(null);
  const [purchasing, setPurchasing] = useState(false);
  const [characterSheetOpen, setCharacterSheetOpen] = useState(false);

  const equippedCharacter = useUserStore((s) => s.equippedCharacter);
  const equippedItems = useUserStore((s) => s.equippedItems);
  const setEquipped = useUserStore((s) => s.setEquipped);
  const points = useUserStore((s) => s.points);
  const setPoints = useUserStore((s) => s.setPoints);
  const ownedItems = useUserStore((s) => s.ownedItems);
  const addOwnedItem = useUserStore((s) => s.addOwnedItem);

  const draftCharacterId = useCharacterShopStore((s) => s.draftCharacterId);
  const draftEquip = useCharacterShopStore((s) => s.draftEquip);
  const hydrateFromServer = useCharacterShopStore((s) => s.hydrateFromServer);
  const selectCharacter = useCharacterShopStore((s) => s.selectCharacter);
  const tryOnItem = useCharacterShopStore((s) => s.tryOnItem);
  const takeOff = useCharacterShopStore((s) => s.takeOff);
  const resetDraft = useCharacterShopStore((s) => s.resetDraft);
  const commitDraft = useCharacterShopStore((s) => s.commitDraft);
  const isDirty = useCharacterShopStore((s) => s.isDirty);

  // 페이지 진입 시 userStore (persist 된 값) 으로 store 동기화. 본체가 비어있으면 기본값 happiness.
  useEffect(() => {
    hydrateFromServer({
      characterId: equippedCharacter ?? "happiness",
      equip: equippedItems,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dirty = isDirty();

  const itemsForTab = useMemo(() => {
    if (tab === "owned") {
      const allCategories = ["background", "hat", "accessory", "etc"];
      return allCategories.flatMap((cat) =>
        (SHOP_ITEMS[cat] ?? []).filter((item) => isItemOwned(item.id, ownedItems)),
      );
    }
    return filterItemsByEmotion(tab, draftCharacterId);
  }, [tab, draftCharacterId, ownedItems]);

  /**
   * 아이템 클릭 처리.
   * - 같은 슬롯에 이미 장착된 아이템을 다시 클릭 → 해제
   * - 미보유 아이템 → 구매 시트 오픈
   * - 보유 아이템 → 해당 카테고리 슬롯에 장착 (기존 장착 아이템은 교체)
   */
  const handleItemPick = (id) => {
    const item = getItemById(id);
    if (!item) return;

    if (draftEquip?.[item.category] === id) {
      takeOff(item.category);
      return;
    }

    if (!isItemOwned(id, ownedItems)) {
      setPurchaseItem(item);
      return;
    }
    tryOnItem(item.category, id);
  };

  const handlePurchaseConfirm = async () => {
    if (!purchaseItem || purchasing) return;
    if (points < purchaseItem.price) return;
    setPurchasing(true);
    try {
      // TODO: 백엔드 캐릭터 API 추가 시 POST /api/users/me/character/items 로 교체.
      setPoints(points - purchaseItem.price);
      addOwnedItem(purchaseItem.id);
      tryOnItem(purchaseItem.category, purchaseItem.id);
      setPurchaseItem(null);
    } finally {
      setPurchasing(false);
    }
  };

  // 본체 변경: 사용자 명세에 따라 장착 아이템을 모두 초기화한다.
  const handleCharacterChange = (newCharId) => {
    selectCharacter(newCharId);
    ["background", "hat", "accessory", "etc"].forEach((cat) => takeOff(cat));
    setCharacterSheetOpen(false);
  };

  const handleSave = () => {
    commitDraft();
    setEquipped({
      characterId: draftCharacterId,
      equip: draftEquip,
    });
  };

  const handleBack = () => {
    if (dirty) {
      const confirmLeave = window.confirm(
        "저장하지 않은 변경 사항이 있어요. 그래도 나갈까요?",
      );
      if (!confirmLeave) return;
      resetDraft();
    }
    navigate(-1);
  };

  return (
    <>
      <Header text="MY LOCALY" onLeftClick={handleBack} rightIcon={null} />
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
          <CharacterPreview characterId={draftCharacterId} equip={draftEquip} />
        </PreviewArea>

        <CategoryTabs active={tab} onChange={setTab} />

        <ItemGrid
          items={itemsForTab}
          selectedId={tab === "owned" ? null : draftEquip?.[tab]}
          ownedItems={ownedItems}
          onPick={handleItemPick}
          hidePriceWhenOwned={tab === "owned"}
        />
      </Page>

      {dirty ? (
        <FloatingSaveButton type="button" onClick={handleSave}>
          저장하기
        </FloatingSaveButton>
      ) : null}

      <PurchaseSheet
        item={purchaseItem}
        balance={points}
        loading={purchasing}
        onConfirm={handlePurchaseConfirm}
        onClose={() => setPurchaseItem(null)}
      />

      <CharacterSelectSheet
        open={characterSheetOpen}
        activeId={draftCharacterId}
        onSelect={handleCharacterChange}
        onClose={() => setCharacterSheetOpen(false)}
      />
    </>
  );
}
