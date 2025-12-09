import React from "react";
import { useNavigate } from "react-router";
import styled from "styled-components";
import { colors } from "@/styles/colors";
import { font } from "@/styles/font";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css/pagination";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 8px ${(props) => props.$padding || 0}px;
  gap: 10px;
`;

const Title = styled.div`
  ${font.bold16}
  color: ${colors.gray[900]};
`;

const PlaceDisplay = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  cursor: pointer;
`;

const PlaceImage = styled.div`
  width: ${(props) => props.$width || 148}px;
  height: ${(props) => props.$height || 148}px;

  background-color: ${colors.gray[200]};
  background-image: ${(props) => props.$imageUrl ? `url(${props.$imageUrl})` : 'none'};
  background-size: cover;
  background-position: center;
  cursor: pointer;
  border-radius: ${(props) => props.$borderRadius ?? 8}px;
`;

const PlaceContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const PlaceName = styled.div`
  ${font.bold14}
  color: ${colors.gray[900]};
`;

const PlaceCategory = styled.div`
  ${font.regular12}
  color: ${colors.gray[600]};
`;

const PlaceLocation = styled.div`
  ${font.medium12}
  color: ${colors.gray[900]};
`;

/**
 * 장소 추천 캐러셀 컴포넌트
 * 단일 책임: 장소 목록 스와이퍼 UI 표시 및 클릭 네비게이션
 */
export default function PlaceRecommendCarousel({
    title,
    borderRadius = 8,
    places = [],
    imageWidth = 148,
    imageHeight = 148,
    slidesPerView = "auto",
    spaceBetween = 24,
    loop = true,
    autoplay = false,
    pagination = false,
    direction = "vertical",
    containerHeight,
    padding = 0,
}) {
    console.log(imageWidth, imageHeight, borderRadius);

    const navigate = useNavigate();

    const autoplayConfig = autoplay
        ? {
            delay: 3000,
            disableOnInteraction: false,
        }
        : false;

    const handlePlaceClick = (placeId) => {
        if (placeId) {
            navigate(`/local/detail/${placeId}`);
        }
    };

    return (
        <Container $padding={padding}>
            {title && <Title>{title}</Title>}
            <Swiper
                modules={[Autoplay, Pagination]}
                style={{
                    width: "100%",
                    height: containerHeight || "auto",
                }}
                direction={direction}
                slidesPerView={slidesPerView}
                spaceBetween={spaceBetween}
                loop={loop}
                autoplay={autoplayConfig}
                pagination={pagination ? { clickable: true } : false}
            >
                {places.map((place, idx) => (
                    <SwiperSlide
                        key={idx}
                        style={
                            slidesPerView === "auto" && direction === "horizontal"
                                ? { width: imageWidth }
                                : undefined
                        }
                    >
                        <PlaceDisplay onClick={() => handlePlaceClick(place.placeId)}>
                            <PlaceImage
                                $width={imageWidth}
                                $height={imageHeight}
                                $imageUrl={place.thumbnailImage || place.imageUrl}
                                $borderRadius={borderRadius}
                            />
                            <PlaceContent>
                                {place.category && <PlaceCategory>{place.category}</PlaceCategory>}
                                {place.placeName && <PlaceName>{place.placeName}</PlaceName>}
                                {place.address && <PlaceLocation>{place.address}</PlaceLocation>}
                            </PlaceContent>
                        </PlaceDisplay>
                    </SwiperSlide>
                ))}
            </Swiper>
        </Container>
    );
}

