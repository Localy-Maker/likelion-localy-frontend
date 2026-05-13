import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import styled from "styled-components";
import Header from "@/shared/components/Header/Header";
import BottomNavigation from "@/shared/components/bottom/BottomNavigation";
import CharacterPreview from "@/features/character/components/CharacterPreview";
import CategoryTabs from "@/features/character/components/CategoryTabs";
import ItemGrid from "@/features/character/components/ItemGrid";
import PurchaseSheet from "@/features/character/components/PurchaseSheet";
import {
  Page,
  BodySelectorRow,
  BodyChip,
  ActionBar,
  ResetButton,
  SaveButton,
} from "@/features/character/styles/CharacterShop.styles";
import { useCharacterShopStore } from "@/shared/stores/characterShopStore";
import { useUserStore } from "@/shared/stores/userStore";
import {
  EMOTIONS,
  filterItemsByEmotion,
  getItemById,
  isItemOwned,
} from "@/assets/character";
import { colors } from "@/styles/colors";
import { font } from "@/styles/font";

const EMOTION_LABEL = {
  happiness: "행복",
  anger: "분노",
  sadness: "슬픔",
  depression: "우울",
  anxiety: "불안",
  neutral: "중립",
};

const PointsBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 4px;
  padding: 8px 16px;
  ${font.medium14}
  color: ${colors.gray[900]};
  background: ${colors.gray[100]};
`;

const PointsValue = styled.span`
  ${font.semibold16}
  color: ${colors.blue[50]};
`;

export default function CharacterShopPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("body");
  const [purchaseItem, setPurchaseItem] = useState(null);
  const [purchasing, setPurchasing] = useState(false);

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

  // 페이지 진입 시 userStore (persist 된 값) 으로 store 동기화
  useEffect(() => {
    hydrateFromServer({
      characterId: equippedCharacter ?? "happiness",
      equip: equippedItems,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const itemsForTab = useMemo(() => {
    if (tab === "body") return [];
    return filterItemsByEmotion(tab, draftCharacterId);
  }, [tab, draftCharacterId]);

  const dirty = isDirty();

  const handleItemPick = (id) => {
    if (isItemOwned(id, ownedItems)) {
      tryOnItem(tab, id);
      return;
    }
    // 미보유 → 구매 시트 오픈
    setPurchaseItem(getItemById(id));
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

  const handleSave = () => {
    commitDraft();
    // TODO: 백엔드 캐릭터 API 추가 시 PUT /api/users/me/character 호출로 교체.
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
      <Header
        text="MY LOCALY"
        onLeftClick={handleBack}
        rightIcon={null}
      />
      <Page>
        <PointsBar>
          보유 포인트 <PointsValue>{points}</PointsValue> P
        </PointsBar>
        <CharacterPreview
          characterId={draftCharacterId}
          equip={draftEquip}
        />
        <CategoryTabs active={tab} onChange={setTab} />

        {tab === "body" ? (
          <BodySelectorRow>
            {EMOTIONS.map((emo) => (
              <BodyChip
                key={emo}
                $active={draftCharacterId === emo}
                onClick={() => selectCharacter(emo)}
                type="button"
              >
                {EMOTION_LABEL[emo] ?? emo}
              </BodyChip>
            ))}
          </BodySelectorRow>
        ) : (
          <ItemGrid
            items={itemsForTab}
            selectedId={draftEquip?.[tab]}
            ownedItems={ownedItems}
            onPick={handleItemPick}
            onTakeOff={() => takeOff(tab)}
          />
        )}

        <ActionBar>
          <ResetButton onClick={resetDraft} disabled={!dirty} type="button">
            되돌리기
          </ResetButton>
          <SaveButton onClick={handleSave} disabled={!dirty} type="button">
            저장하기
          </SaveButton>
        </ActionBar>
      </Page>

      <PurchaseSheet
        item={purchaseItem}
        balance={points}
        loading={purchasing}
        onConfirm={handlePurchaseConfirm}
        onClose={() => setPurchaseItem(null)}
      />

      <BottomNavigation />
    </>
  );
}
