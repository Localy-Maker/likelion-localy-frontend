import { useEffect, useMemo, useRef, useState } from "react";
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
import {
  useCharacters,
  useChangeCharacter,
  useEquipItem,
  useOwnedItems,
  usePurchaseItem,
  useShopItems,
  useShopState,
} from "@/features/character/hooks/useShop";
import { API_TO_CATEGORY, getWornPreview } from "@/features/character/api/shopApi";
import { SLOTS } from "@/features/character/utils/equipped";

export default function CharacterShopPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("hat");
  const [purchaseTarget, setPurchaseTarget] = useState(null);
  const [characterSheetOpen, setCharacterSheetOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  // 방식 B: 서버가 합성한 미리보기 이미지 1장 (단일 아이템 트라이온).
  const [previewSrc, setPreviewSrc] = useState(null);

  // 서버 데이터
  const { data: shopState } = useShopState();
  const { data: charactersData } = useCharacters();
  const { data: categoryItems, isLoading: itemsLoading } = useShopItems(tab, {
    enabled: tab !== "owned",
  });
  const { data: ownedData, isLoading: ownedLoading } = useOwnedItems({
    enabled: tab === "owned",
  });

  // 뮤테이션
  const purchaseMutation = usePurchaseItem();
  const equipMutation = useEquipItem();
  const changeCharacterMutation = useChangeCharacter();

  // 드래프트 스토어
  const draftCharacterImageUrl = useCharacterShopStore(
    (s) => s.draftCharacterImageUrl,
  );
  const draftEquipped = useCharacterShopStore((s) => s.draftEquipped);
  const draftCharacterCode = useCharacterShopStore((s) => s.draftCharacterCode);
  const hydrateFromServer = useCharacterShopStore((s) => s.hydrateFromServer);
  const selectCharacter = useCharacterShopStore((s) => s.selectCharacter);
  const tryOnItem = useCharacterShopStore((s) => s.tryOnItem);
  const takeOff = useCharacterShopStore((s) => s.takeOff);
  const resetDraft = useCharacterShopStore((s) => s.resetDraft);
  const commitDraft = useCharacterShopStore((s) => s.commitDraft);
  const applyPurchase = useCharacterShopStore((s) => s.applyPurchase);
  const isDirty = useCharacterShopStore((s) => s.isDirty);

  const points = shopState?.currentPoint ?? 0;
  const characters = charactersData?.characters ?? [];

  // 서버 상태로 스토어 최초 1회 동기화. 이후 변경은 구매/저장 시 스토어를 직접 갱신한다
  // (매 refetch 마다 hydrate 하면 미저장 드래프트가 날아가므로).
  const hydratedRef = useRef(false);
  useEffect(() => {
    if (hydratedRef.current) return;
    const cur = shopState?.currentCharacter;
    if (!cur) return;
    hydrateFromServer({
      characterCode: cur.code,
      characterImageUrl: cur.imageUrl,
      equipped: cur.equipped,
    });
    // 방식 B: 저장된 최종 합성 이미지로 미리보기 초기화.
    setPreviewSrc(cur.imageUrl ?? null);
    hydratedRef.current = true;
  }, [shopState, hydrateFromServer]);

  const dirty = isDirty();

  const itemsForTab = tab === "owned" ? ownedData?.items : categoryItems?.items;
  const listLoading = tab === "owned" ? ownedLoading : itemsLoading;

  // 드래프트에서 장착 중인 itemId 목록 (그리드 선택 표시용)
  const selectedIds = useMemo(
    () =>
      SLOTS.map((slot) => draftEquipped?.[slot]?.itemId).filter(
        (id) => id != null,
      ),
    [draftEquipped],
  );

  /**
   * 아이템 클릭 처리.
   * - 드래프트에 이미 장착된 아이템 재클릭 → 해제
   * - 미보유 → 구매 시트
   * - 보유 → 해당 카테고리 슬롯에 장착(미리보기)
   */
  const handleItemPick = async (item) => {
    const category = API_TO_CATEGORY[item.category] ?? tab;
    // 트라이온 중인 아이템 재클릭 → 해제(본체 단독으로 복귀)
    if (draftEquipped?.[category]?.itemId === item.itemId) {
      SLOTS.forEach((s) => takeOff(s));
      const { imageUrl } = await getWornPreview(null, draftCharacterCode);
      setPreviewSrc(imageUrl);
      return;
    }
    if (!item.isOwned) {
      setPurchaseTarget(item);
      return;
    }
    // 단일 아이템: 다른 슬롯은 모두 해제하고 이 아이템 하나만 트라이온.
    SLOTS.forEach((s) => {
      if (s !== category) takeOff(s);
    });
    tryOnItem(category, item);
    // 방식 B: 서버가 합성한 (캐릭터+아이템) 이미지를 받아 미리보기 갱신.
    const { imageUrl } = await getWornPreview(item.itemId, draftCharacterCode);
    setPreviewSrc(imageUrl);
  };

  const handlePurchaseConfirm = async () => {
    if (!purchaseTarget || purchaseMutation.isPending) return;
    if (points < purchaseTarget.price) return;
    try {
      const result = await purchaseMutation.mutateAsync(purchaseTarget.itemId);
      const category = API_TO_CATEGORY[purchaseTarget.category] ?? tab;
      // 단일 아이템: 구매 즉시 착용되므로 다른 슬롯은 해제.
      SLOTS.forEach((s) => {
        if (s !== category) takeOff(s);
      });
      applyPurchase(category, purchaseTarget);
      // 방식 B: 구매 응답의 합성 이미지로 미리보기 갱신.
      if (result?.wornImageUrl) setPreviewSrc(result.wornImageUrl);
      setPurchaseTarget(null);
    } catch (err) {
      window.alert(err.message || "구매에 실패했어요.");
    }
  };

  const handleCharacterChange = async (code, imageUrl) => {
    selectCharacter(code, imageUrl);
    setCharacterSheetOpen(false);
    // 방식 B: 새 캐릭터 기준으로 현재 트라이온 아이템까지 합성해 미리보기 갱신.
    const triedItemId =
      SLOTS.map((s) => draftEquipped?.[s]?.itemId).find((id) => id != null) ??
      null;
    const { imageUrl: worn } = await getWornPreview(triedItemId, code);
    setPreviewSrc(worn);
  };

  const handleSave = async () => {
    if (saving) return;
    const {
      isCharacterDirty,
      getEquipChanges,
      draftCharacterCode: code,
    } = useCharacterShopStore.getState();
    setSaving(true);
    try {
      if (isCharacterDirty()) {
        await changeCharacterMutation.mutateAsync(code);
      }
      for (const change of getEquipChanges()) {
        await equipMutation.mutateAsync({
          category: change.category,
          itemId: change.itemId,
        });
      }
      commitDraft();
    } catch (err) {
      window.alert(err.message || "저장에 실패했어요.");
    } finally {
      setSaving(false);
    }
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
          <CharacterPreview
            src={previewSrc}
            characterImageUrl={draftCharacterImageUrl}
            equipped={draftEquipped}
          />
        </PreviewArea>

        <CategoryTabs active={tab} onChange={setTab} />

        <ItemGrid
          items={itemsForTab}
          selectedIds={selectedIds}
          onPick={handleItemPick}
          loading={listLoading}
          hidePriceWhenOwned={tab === "owned"}
        />
      </Page>

      {dirty ? (
        <FloatingSaveButton type="button" onClick={handleSave} disabled={saving}>
          {saving ? "저장 중…" : "저장하기"}
        </FloatingSaveButton>
      ) : null}

      <PurchaseSheet
        item={purchaseTarget}
        balance={points}
        loading={purchaseMutation.isPending}
        onConfirm={handlePurchaseConfirm}
        onClose={() => setPurchaseTarget(null)}
      />

      <CharacterSelectSheet
        open={characterSheetOpen}
        characters={characters}
        onSelect={handleCharacterChange}
        onClose={() => setCharacterSheetOpen(false)}
      />
    </>
  );
}
