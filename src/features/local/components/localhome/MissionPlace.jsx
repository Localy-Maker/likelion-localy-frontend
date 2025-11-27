import React from "react";
import PlaceCarousel from "@/features/local/components/localhome/PlaceCarousel";

const sampleItems = [
  { name: "장소 이름" },
  { name: "장소 이름" },
  { name: "장소 이름" },
  { name: "장소 이름" },
  { name: "장소 이름" },
  { name: "장소 이름" },
];

// 기존 사용처 호환: 원형(동그란) 버전 유지
export default function HomeCard() {
  return (
    <PlaceCarousel
      title="미션 장소 바로보기"
      items={sampleItems}
      variant="circle"
      itemSize={76}
      slidesPerView={4}
      loop={true}
      pagination={true}
    />
  );
}

// 네모난 버전도 재사용 가능하게 제공
export function MissionPlaceSquare() {
  return (
    <PlaceCarousel
      title="미션 장소 바로보기"
      items={sampleItems}
      variant="square"
      itemSize={76}
      slidesPerView={4}
      loop={true}
      pagination={true}
    />
  );
}
