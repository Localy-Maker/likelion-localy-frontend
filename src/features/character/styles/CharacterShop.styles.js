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

export const FloatingSaveButton = styled.button`
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  width: calc(100% - 32px);
  max-width: 343px;
  height: 52px;
  border: none;
  border-radius: 12px;
  background: ${colors.blue[50]};
  color: ${colors.gray[100]};
  ${font.semibold16}
  cursor: pointer;
  box-shadow: 0 6px 20px rgba(84, 130, 255, 0.35);
  z-index: 1000;
  animation: floatIn 0.18s ease-out;

  &:hover {
    opacity: 0.92;
  }

  @keyframes floatIn {
    from { transform: translate(-50%, 100%); opacity: 0; }
    to { transform: translate(-50%, 0); opacity: 1; }
  }
`;

export const TopChipRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px 0;
`;

export const CharacterSelectChip = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 6px 16px;
  background: ${colors.blue[50]};
  color: ${colors.gray[100]};
  border: none;
  border-radius: 8px;
  cursor: pointer;
  ${font.medium14}

  &:hover {
    opacity: 0.92;
  }
`;

export const PointsChip = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 6px 16px;
  background: ${colors.blue[50]};
  color: ${colors.gray[100]};
  border-radius: 8px;
  ${font.medium14}
`;

export const PreviewArea = styled.div`
  width: 100%;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
`;

export const TabsBlock = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  padding: 0 16px;
  border-bottom: 8px solid ${colors.gray[200]};
`;

export const TabButton = styled.button`
  flex: 1;
  padding: 12px 4px;
  background: none;
  border: none;
  cursor: pointer;
  ${font.medium14}
  color: ${(p) => (p.$active ? colors.gray[700] : colors.gray[500])};
  position: relative;

  &::after {
    content: "";
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: ${(p) => (p.$active ? "40px" : "0")};
    height: 4px;
    border-radius: 50px;
    background: ${colors.gray[700]};
    transition: width 0.15s;
  }
`;

export const ItemGridWrapper = styled.section`
  padding: 16px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  column-gap: 16px;
  row-gap: 24px;
`;

export const ItemSlot = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-start;
`;

export const ItemCard = styled.button`
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  border-radius: 16px;
  background: ${colors.gray[200]};
  border: 2px solid
    ${(p) => (p.$selected ? colors.blue[50] : "transparent")};
  cursor: pointer;
  padding: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: border-color 0.15s;

  img {
    max-width: 80%;
    max-height: 80%;
    object-fit: contain;
  }
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

export const ItemPrice = styled.span`
  ${font.medium14}
  color: ${colors.gray[800]};
  padding-left: 4px;
`;

export const EmptyMessage = styled.div`
  grid-column: 1 / -1;
  text-align: center;
  ${font.regular14}
  color: ${colors.gray[600]};
  padding: 40px 16px;
`;
