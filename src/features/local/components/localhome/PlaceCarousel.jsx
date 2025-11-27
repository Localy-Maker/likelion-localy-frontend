import React from "react";
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
`;

const ItemImage = styled.div`
  width: ${(props) => props.$size}px;
  height: ${(props) => props.$size}px;
  background-color: ${colors.gray[200]};
  border-radius: ${(props) => (props.$variant === "circle" ? "50%" : "8px")};
`;

const ItemName = styled.div`
  ${font.medium14}
  color: ${colors.gray[900]};
`;

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
  const shouldUseAutoWidth = slidesPerView === "auto";

  return (
    <Container>
      {title ? <Title>{title}</Title> : null}
      <Swiper
        modules={[Pagination]}
        style={{
          width: "100%",
          borderRadius: "8px",
          padding: "0px 0px 0px 10px",
        }}
        slidesPerView={slidesPerView}
        pagination={pagination ? { clickable: true } : false}
        spaceBetween={spaceBetween}
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
            <ItemDisplay>
              <ItemImage $variant={variant} $size={itemSize} />
              {item.name ? <ItemName>{item.name}</ItemName> : null}
            </ItemDisplay>
          </SwiperSlide>
        ))}
      </Swiper>
    </Container>
  );
}
