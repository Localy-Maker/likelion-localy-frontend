import { useEffect } from "react";
import styled from "styled-components";
import { colors } from "@/styles/colors";
import { font } from "@/styles/font";

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1100;
`;

const Sheet = styled.div`
  position: fixed;
  right: 24px;
  bottom: 156px;
  z-index: 1101;
  width: 140px;
  background: ${colors.gray[100]};
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(13, 13, 13, 0.12);
  overflow: hidden;
`;

const Option = styled.button`
  width: 100%;
  padding: 12px 16px;
  background: transparent;
  border: none;
  cursor: pointer;
  ${font.medium14}
  color: ${colors.gray[800]};
  text-align: center;

  & + & {
    border-top: 1px solid ${colors.gray[200]};
  }

  &:hover {
    background: ${colors.blue[10]};
  }
`;

export default function PhotoSourceActionSheet({
  open,
  onPickAlbum,
  onPickCamera,
  onClose,
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <>
      <Backdrop onClick={onClose} />
      <Sheet role="menu">
        <Option role="menuitem" onClick={onPickAlbum}>
          앨범에서 선택
        </Option>
        <Option role="menuitem" onClick={onPickCamera}>
          사진 촬영
        </Option>
      </Sheet>
    </>
  );
}
