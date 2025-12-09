import styled from "styled-components";
import { colors } from "@/styles/colors";
import { font } from "@/styles/font";

export const Container = styled.div`
  padding: 40px 20px 80px;
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
`;

export const PlaceCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  cursor: pointer;
`;

export const PlaceImage = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  background-color: ${colors.gray[200]};
  background-image: ${(props) => props.$imageUrl ? `url(${props.$imageUrl})` : 'none'};
  background-size: cover;
  background-position: center;
  border-radius: 8px;
`;

export const BookmarkIconWrapper = styled.div`
  position: absolute;
  top: 1px;
  right: 1px;
  cursor: pointer;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
`;

export const PlaceContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const PlaceCategory = styled.div`
  ${font.regular12}
  color: ${colors.gray[600]};
`;

export const PlaceName = styled.div`
  ${font.bold14}
  color: ${colors.gray[900]};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const PlaceLocation = styled.div`
  ${font.medium12}
  color: ${colors.gray[900]};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
`;

export const SortButton = styled.button`
  ${font.medium14}
  color: ${(props) => props.$isActive ? colors.white : colors.gray[900]};
  background-color: ${(props) => props.$isActive ? colors.blue[20] : colors.gray[100]};
  border: 1px solid ${(props) => props.$isActive ? colors.blue[20] : colors.gray[300]};
  border-radius: 6px;
  padding: 5px 10px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    opacity: 0.8;
  }
`;

export const LoadingMessage = styled.div`
  ${font.regular14}
  color: ${colors.gray[600]};
  text-align: center;
  padding: 20px;
`;

export const ErrorMessage = styled.div`
  ${font.regular14}
  color: ${colors.error};
  text-align: center;
  padding: 20px;
`;

export const EmptyMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
  gap: 12px;
`;

export const EmptyIcon = styled.div`
  font-size: 48px;
  margin-bottom: 8px;
`;

export const EmptyText = styled.p`
  ${font.medium16}
  color: ${colors.gray[600]};
`;

export const EmptySubText = styled.p`
  ${font.regular14}
  color: ${colors.gray[400]};
`;

