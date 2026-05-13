import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import Header from "@/shared/components/Header/Header";
import BottomNavigation from "@/shared/components/bottom/BottomNavigation";
import CharacterPreview from "@/features/character/components/CharacterPreview";
import CategoryTabs from "@/features/character/components/CategoryTabs";
import ItemGrid from "@/features/character/components/ItemGrid";
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
import { EMOTIONS, filterItemsByEmotion } from "@/assets/character";

const EMOTION_LABEL = {
  happiness: "행복",
  anger: "분노",
  sadness: "슬픔",
  depression: "우울",
  anxiety: "불안",
  neutral: "중립",
};

export default function CharacterShopPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("body");

  const equippedCharacter = useUserStore((s) => s.equippedCharacter);
  const equippedItems = useUserStore((s) => s.equippedItems);
  const setEquipped = useUserStore((s) => s.setEquipped);

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
            onPick={(id) => tryOnItem(tab, id)}
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
      <BottomNavigation />
    </>
  );
}
