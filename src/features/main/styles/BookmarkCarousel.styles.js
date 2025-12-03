import styled from "styled-components";

export const CarouselContainer = styled.div`
  width: 100%;
  position: relative;
`;

export const CarouselHeader = styled.div`
  display: flex;
  justify-content: start;
  gap: 8px;
  align-items: center;
  margin-bottom: 12px;
  padding: 8px 0;
`;

export const CarouselTitle = styled.h2`
  font-family: "Inter";
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 140%;
  letter-spacing: -0.02em;
  color: #0d0d0d;
  margin: 0;
`;

export const ChevronButton = styled.button`
  width: 20px;
  height: 20px;
  padding: 0;
  border: none;
  background: #e0e0e0;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    opacity: 0.7;
  }
`;

export const CarouselScroll = styled.div`
  /* Figma: Carousel Auto layout */
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12px;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  padding-bottom: 8px;

  &::-webkit-scrollbar {
    display: none; /* 모바일 스타일 */
  }
`;

export const LocationCard = styled.div`
  /* Figma: Card */
  flex-shrink: 0;
  width: 148px;
  height: 218px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 12px;

  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
`;

export const CardImage = styled.div`
  /* Figma: Img */
  width: 148px;
  height: 148px; /* 수정됨: 80 -> 148 (정사각형) */
  background: #e0e0e0;
  border-radius: 8px;

  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

/* 카드 하단 정보 영역 */
export const CardInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
  width: 148px;
  height: 58px;
`;

export const CardCategory = styled.span`
  font-family: "Inter";
  font-weight: 400;
  font-size: 12px;
  line-height: 140%;
  color: #838383; /* Gray Scale/G600 */
`;

export const CardTitle = styled.div`
  font-family: "Inter";
  font-weight: 700;
  font-size: 14px;
  line-height: 140%;
  color: #0d0d0d; /* Gray Scale/G1000 */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
  text-align: left; /* 중앙 정렬 해제 */
  padding: 0;
`;

export const CardLocation = styled.span`
  font-family: "Inter";
  font-weight: 500;
  font-size: 12px;
  line-height: 140%;
  color: #0d0d0d;
`;
