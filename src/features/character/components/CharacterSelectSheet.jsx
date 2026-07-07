import { useEffect, useState } from "react";
import styled from "styled-components";
import { colors } from "@/styles/colors";
import { font } from "@/styles/font";
import { useUserStore } from "@/shared/stores/userStore";

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  z-index: 1100;
  animation: fadeIn 0.18s ease-out;

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const Sheet = styled.div`
  width: 100%;
  max-width: 800px;
  background: ${colors.gray[100]};
  border-radius: 16px 16px 0 0;
  box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.25);
  padding: 24px 16px 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  animation: slideUp 0.22s ease-out;

  @keyframes slideUp {
    from { transform: translateY(100%); }
    to { transform: translateY(0); }
  }
`;

const Title = styled.h2`
  ${font.semibold16}
  color: ${colors.gray[900]};
  margin: 0 0 6px;
  text-align: center;
  letter-spacing: -0.43px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 100px);
  grid-template-rows: repeat(2, 96px);
  column-gap: 16px;
  row-gap: 12px;
  justify-items: center;
  align-items: center;
  margin: 12px 0 24px;
`;

const Option = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  padding: 0;
  cursor: pointer;
  width: 100%;
  height: 100%;

  img {
    transition: all 0.18s ease;
    width: ${(p) => (p.$active ? "82px" : "60px")};
    height: auto;
    filter: ${(p) =>
      p.$active
        ? "drop-shadow(0px 5.28px 2.64px rgba(0,0,0,0.25))"
        : "none"};
  }
`;

const ConfirmButton = styled.button`
  width: 141px;
  height: 36px;
  border: none;
  border-radius: 8px;
  background: ${(p) => (p.$enabled ? colors.blue[50] : colors.gray[500])};
  color: ${colors.blue[10]};
  ${font.medium14}
  cursor: ${(p) => (p.$enabled ? "pointer" : "default")};
  filter: drop-shadow(0px 4px 2px rgba(0, 0, 0, 0.25));
  transition: background 0.15s;
`;

/**
 * 본체 캐릭터 선택 바텀시트.
 * 서버에서 받은 캐릭터 목록(code, name, imageUrl)을 렌더한다.
 * 사용자가 캐릭터 카드를 탭하면 우선 '스테이지' 상태로만 잡히고,
 * 하단 "선택하기" 버튼을 눌러야 onSelect(code) 가 호출되어 부모(CharacterShopPage)가
 * 드래프트 캐릭터 변경·셀렉트 시트 닫기 등을 수행한다.
 *
 * @param {object} props
 * @param {boolean} props.open
 * @param {Array<{code, name, imageUrl}>} props.characters - 서버 캐릭터 목록
 * @param {function} props.onSelect - (code, imageUrl) 콜백
 * @param {function} props.onClose
 */
export default function CharacterSelectSheet({
  open,
  characters = [],
  onSelect,
  onClose,
}) {
  const nickname = useUserStore((s) => s.nickname) ?? "000";
  const [staged, setStaged] = useState(null);

  // 시트가 열릴 때마다 선택 해제 상태로 시작 — 사용자가 의식적으로 한 번 더 고르도록.
  useEffect(() => {
    if (open) setStaged(null);
  }, [open]);

  if (!open) return null;

  const canConfirm = !!staged;

  const handleConfirm = () => {
    if (!canConfirm) return;
    const picked = characters.find((c) => c.code === staged);
    onSelect?.(staged, picked?.imageUrl ?? null);
  };

  return (
    <Backdrop role="dialog" aria-modal="true" onClick={onClose}>
      <Sheet onClick={(e) => e.stopPropagation()}>
        <Title>{nickname}님의 LOCALY 캐릭터를 선택해주세요</Title>
        <Grid>
          {characters.map((opt) => (
            <Option
              key={opt.code}
              type="button"
              $active={staged === opt.code}
              onClick={() => setStaged(opt.code)}
              aria-label={opt.name}
            >
              <img
                src={opt.imageUrl}
                alt={opt.name}
                width={staged === opt.code ? 82 : 60}
              />
            </Option>
          ))}
        </Grid>
        <ConfirmButton
          type="button"
          $enabled={canConfirm}
          onClick={handleConfirm}
        >
          선택하기
        </ConfirmButton>
      </Sheet>
    </Backdrop>
  );
}
