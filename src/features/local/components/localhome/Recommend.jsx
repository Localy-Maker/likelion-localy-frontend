import React from "react";
import PlaceRecommendCarousel from "@/features/local/components/bookmark/PlaceRecommendCarousel";

export default function Recommend({ places }) {

  console.log(places);
  return (
    <PlaceRecommendCarousel
      title="멋사님에게 추천하는 장소"
      places={places}
      imageWidth={148}
      imageHeight={148}
      slidesPerView="auto"
      spaceBetween={24}
      loop={false}
      direction="horizontal"
    />
  );
}
