import React from "react";
import ProgressBar from "@ramonak/react-progress-bar";
import styled from "styled-components";
import { colors } from "@/styles/colors";
import { font } from "@/styles/font";
import Emotions from "@/shared/components/icons/Emotions";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import { Autoplay, Pagination, Scrollbar } from "swiper/modules";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

const MissionPlaceContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 8px 0px;
  gap: 10px;
`;

const MissionTitle = styled.div`
  ${font.bold16}
  color: ${colors.gray[900]};
`;

const PlaceContainer = styled.div`
  display: flex;
  gap: 24px;
`;

const PlaceDisplay = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const PlaceImage = styled.div`
  width: 148px;
  height: 148px;
  background-color: ${colors.gray[200]};

  border-radius: 8px;
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

export default function HomeCard() {
  return (
    <MissionPlaceContainer>
      <MissionTitle>멋사님에게 추천하는 장소</MissionTitle>
      <PlaceContainer>
        <Swiper
          modules={[Pagination]}
          style={{
            borderRadius: "8px",
          }}
          slidesPerView={"auto"}
          spaceBetween={24}
          gap={24}
        >
          <SwiperSlide style={{ width: 148 }}>
            <PlaceDisplay>
              <PlaceImage />
              <PlaceContent>
                <PlaceCategory>카페</PlaceCategory>
                <PlaceName>장소 이름</PlaceName>
                <PlaceLocation>서울특별시</PlaceLocation>
              </PlaceContent>
            </PlaceDisplay>
          </SwiperSlide>
          <SwiperSlide style={{ width: 148 }}>
            <PlaceDisplay>
              <PlaceImage />
              <PlaceContent>
                <PlaceCategory>카페</PlaceCategory>
                <PlaceName>장소 이름</PlaceName>
                <PlaceLocation>서울특별시</PlaceLocation>
              </PlaceContent>
            </PlaceDisplay>
          </SwiperSlide>
          <SwiperSlide style={{ width: 148 }}>
            <PlaceDisplay>
              <PlaceImage />
              <PlaceContent>
                <PlaceCategory>카페</PlaceCategory>
                <PlaceName>장소 이름</PlaceName>
                <PlaceLocation>서울특별시</PlaceLocation>
              </PlaceContent>
            </PlaceDisplay>
          </SwiperSlide>
        </Swiper>
      </PlaceContainer>
    </MissionPlaceContainer>
  );
}
