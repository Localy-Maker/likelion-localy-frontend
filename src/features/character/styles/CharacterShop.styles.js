import styled from "styled-components";
import { colors } from "@/styles/colors";
import { font } from "@/styles/font";

export const Page = styled.main`
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding-bottom: 96px;
  background: ${colors.gray[100]};
`;

export const PreviewSection = styled.section`
  position: relative;
  width: 100%;
  aspect-ratio: 1.05;
  background: ${colors.blue[10]};
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

export const PreviewLayer = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;

  img {
    max-width: 70%;
    max-height: 70%;
    object-fit: contain;
  }
`;

export const PreviewBackgroundLayer = styled(PreviewLayer)`
  img {
    max-width: 100%;
    max-height: 100%;
  }
`;

export const TabRow = styled.div`
  display: flex;
  gap: 0;
  background: ${colors.gray[100]};
  border-bottom: 1px solid ${colors.gray[300]};
`;

export const TabButton = styled.button`
  flex: 1;
  padding: 14px 8px;
  ${font.medium14}
  color: ${(p) => (p.$active ? colors.blue[50] : colors.gray[600])};
  background: none;
  border: none;
  border-bottom: 2px solid
    ${(p) => (p.$active ? colors.blue[50] : "transparent")};
  cursor: pointer;
  transition: color 0.15s;
`;

export const BodySelectorRow = styled.div`
  display: flex;
  gap: 8px;
  padding: 12px 16px;
  overflow-x: auto;

  &::-webkit-scrollbar {
    display: none;
  }
`;

export const BodyChip = styled.button`
  flex: 0 0 auto;
  padding: 6px 12px;
  border-radius: 16px;
  ${font.medium12}
  background: ${(p) => (p.$active ? colors.blue[50] : colors.gray[200])};
  color: ${(p) => (p.$active ? colors.gray[100] : colors.gray[900])};
  border: none;
  cursor: pointer;
`;

export const ItemGridWrapper = styled.section`
  padding: 16px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
`;

export const ItemCard = styled.button`
  position: relative;
  aspect-ratio: 1;
  border-radius: 12px;
  background: ${colors.gray[200]};
  border: 2px solid
    ${(p) => (p.$selected ? colors.blue[50] : "transparent")};
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: border-color 0.15s;

  img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }
`;

export const TakeOffCard = styled(ItemCard)`
  background: ${colors.gray[100]};
  border: 2px dashed ${colors.gray[400]};
  ${font.regular12}
  color: ${colors.gray[600]};
`;

export const ItemImage = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: ${(p) => (p.$locked ? 0.55 : 1)};

  img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }
`;

export const PriceBadge = styled.span`
  position: absolute;
  bottom: 4px;
  right: 4px;
  padding: 2px 6px;
  border-radius: 8px;
  background: rgba(13, 13, 13, 0.6);
  color: ${colors.gray[100]};
  font-size: 10px;
  font-weight: 500;
  pointer-events: none;
`;

export const ActionBar = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 12px 16px;
  background: ${colors.gray[100]};
  border-top: 1px solid ${colors.gray[200]};
  display: flex;
  gap: 8px;
  justify-content: center;
`;

export const ResetButton = styled.button`
  flex: 0 0 30%;
  padding: 12px;
  border-radius: 8px;
  background: ${colors.gray[200]};
  color: ${colors.gray[900]};
  border: none;
  ${font.medium14}
  cursor: pointer;

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

export const SaveButton = styled.button`
  flex: 1;
  padding: 12px;
  border-radius: 8px;
  background: ${(p) => (p.disabled ? colors.gray[300] : colors.blue[50])};
  color: ${colors.gray[100]};
  border: none;
  ${font.medium14}
  cursor: ${(p) => (p.disabled ? "not-allowed" : "pointer")};
`;
