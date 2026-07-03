import styled from "styled-components";
import { colors } from "@/styles/colors";
import { font } from "@/styles/font";
import { resolveAssetUrl } from "@/features/character/utils/assetUrl";

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
  padding: 20px 16px 28px;
  display: flex;
  flex-direction: column;
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
  margin: 0;
  text-align: center;
`;

const Note = styled.p`
  ${font.regular12}
  color: ${colors.gray[600]};
  margin: 0;
  text-align: center;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
`;

const Option = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 16px 8px;
  background: ${(p) => (p.$active ? colors.blue[20] : colors.gray[200])};
  border: 2px solid ${(p) => (p.$active ? colors.blue[50] : "transparent")};
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.15s;

  img {
    width: 44px;
    height: 44px;
    object-fit: contain;
  }
`;

const OptionLabel = styled.span`
  ${font.medium12}
  color: ${colors.gray[900]};
`;

/**
 * 본체(감정) 캐릭터를 고르는 바텀 시트(서버 캐릭터 목록 기준).
 * 서버 캐릭터 shape: { code, name, imageUrl, isCurrent }.
 * 선택 시 onSelect(code) 호출 — 부모가 PATCH /api/characters/current 를 수행한다.
 * (착용 상태는 서버가 유지하므로 프론트에서 초기화하지 않는다.)
 *
 * @param {object} props
 * @param {boolean} props.open
 * @param {Array} props.characters - 서버 캐릭터 목록
 * @param {function} props.onSelect - 캐릭터 code 전달
 * @param {function} props.onClose
 */
export default function CharacterSelectSheet({ open, characters = [], onSelect, onClose }) {
  if (!open) return null;
  return (
    <Backdrop role="dialog" aria-modal="true" onClick={onClose}>
      <Sheet onClick={(e) => e.stopPropagation()}>
        <Title>캐릭터 선택</Title>
        <Note>캐릭터를 바꿔도 착용한 아이템은 유지돼요.</Note>
        <Grid>
          {characters.map((c) => (
            <Option
              key={c.code}
              type="button"
              $active={c.isCurrent}
              onClick={() => onSelect(c.code)}
            >
              <img src={resolveAssetUrl(c.imageUrl)} alt={c.name} />
              <OptionLabel>{c.name}</OptionLabel>
            </Option>
          ))}
        </Grid>
      </Sheet>
    </Backdrop>
  );
}
