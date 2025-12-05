import React from "react";
import { useNavigate } from "react-router";
import styled from "styled-components";
import { colors } from "@/styles/colors";
import { font } from "@/styles/font";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Pagination } from "swiper/modules";
import "swiper/css/pagination";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 8px 0px;
  gap: 10px;
`;

const Title = styled.div`
  ${font.bold16}
  color: ${colors.gray[900]};
`;

const ItemDisplay = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  cursor: pointer;
`;

const ItemImage = styled.div`
  background-image: ${(props) => props.$imageUrl ? `url(${props.$imageUrl})` : 'none'};
  background-size: cover;
  background-position: center;
  width: ${(props) => props.$size}px;
  height: ${(props) => props.$size}px;
  background-color: ${colors.gray[200]};
  border-radius: ${(props) => (props.$variant === "circle" ? "50%" : "8px")};
  cursor: pointer;
  transition: transform 0.2s ease-in-out;

`;

const ItemName = styled.div`
  ${font.medium14}
  color: ${colors.gray[900]};
`;

/**
 * 장소 캐러셀 컴포넌트
 * 단일 책임: 장소 목록 스와이퍼 UI 표시 및 클릭 네비게이션
 */
export default function PlaceCarousel({
  title,
  items = [],
  variant = "circle",
  itemSize = 76,
  slidesPerView = 4,
  spaceBetween = 0,
  loop = true,
  pagination = true,
  slidesOffsetBefore,
  slidesOffsetAfter,
}) {
  const navigate = useNavigate();
  const shouldUseAutoWidth = slidesPerView === "auto";

  const handlePlaceClick = (placeId) => {
    if (placeId) {
      navigate(`/local/detail/${placeId}`);
    }
  };

  return (
    <Container>
      {title ? <Title>{title}</Title> : null}
      <Swiper
        modules={[Pagination]}
        style={{
          width: "100%",
          borderRadius: "8px",
        }}
        slidesPerView={slidesPerView}
        pagination={pagination ? { clickable: true } : false}
        spaceBetween={spaceBetween}
        loop={loop}
        slidesOffsetBefore={slidesOffsetBefore}
        slidesOffsetAfter={slidesOffsetAfter}
      >
        {items.map((item, idx) => (
          <SwiperSlide
            key={idx}
            style={
              shouldUseAutoWidth
                ? {
                  width: itemSize,
                }
                : undefined
            }
          >
            <ItemDisplay onClick={() => handlePlaceClick(item.placeId)}>
              <ItemImage $variant={variant} $size={itemSize} $imageUrl={item.thumbnailImage} />
              {item.placeName ? <ItemName>{item.placeName}</ItemName> : "파이키"}
            </ItemDisplay>
          </SwiperSlide>
        ))}
      </Swiper>
    </Container>
  );
}
