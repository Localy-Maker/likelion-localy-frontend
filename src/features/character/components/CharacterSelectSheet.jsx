import styled from "styled-components";
import { colors } from "@/styles/colors";
import { font } from "@/styles/font";
import { renderEmotionCharacter } from "@/shared/utils/emotionCharacters";

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

  div {
    transform: scale(1.6);
    transform-origin: center;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const OptionLabel = styled.span`
  ${font.medium12}
  color: ${colors.gray[900]};
`;

const EMOTION_OPTIONS = [
  { id: "happiness", label: "행복" },
  { id: "anger", label: "분노" },
  { id: "sadness", label: "슬픔" },
  { id: "depression", label: "우울" },
  { id: "anxiety", label: "불안" },
  { id: "neutral", label: "중립" },
];

/**
 * 본체(감정) 캐릭터를 고르는 바텀 시트.
 * 선택 시 상위 onSelect 호출 — 부모는 장착 아이템을 초기화해야 한다 (사용자 명세).
 */
export default function CharacterSelectSheet({ open, activeId, onSelect, onClose }) {
  if (!open) return null;
  return (
    <Backdrop role="dialog" aria-modal="true" onClick={onClose}>
      <Sheet onClick={(e) => e.stopPropagation()}>
        <Title>캐릭터 선택</Title>
        <Note>다른 캐릭터를 선택하면 장착한 아이템이 초기화돼요.</Note>
        <Grid>
          {EMOTION_OPTIONS.map((opt) => (
            <Option
              key={opt.id}
              type="button"
              $active={activeId === opt.id}
              onClick={() => onSelect(opt.id)}
            >
              <div>{renderEmotionCharacter(opt.id)}</div>
              <OptionLabel>{opt.label}</OptionLabel>
            </Option>
          ))}
        </Grid>
      </Sheet>
    </Backdrop>
  );
}
