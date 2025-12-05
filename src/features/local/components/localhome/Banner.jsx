import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css/pagination";

import AD1 from "@/assets/images/AD1.svg";
import AD2 from "@/assets/images/AD2.svg";
import AD3 from "@/assets/images/AD3.svg";
import AD4 from "@/assets/images/AD4.svg";
import AD5 from "@/assets/images/AD5.svg";

/**
 * 광고 배너 컴포넌트
 * 단일 책임: 광고 이미지 스와이퍼 표시
 */
export default function Banner() {
  const adBanners = [AD1, AD2, AD3, AD4, AD5];

  return (
    <Swiper
      modules={[Autoplay, Pagination]}
      style={{
        width: "100%",
        height: "136px",
        borderRadius: "8px",
      }}
      slidesPerView={1}
      loop={true}
      autoplay={{ delay: 5000, disableOnInteraction: false }}
    >
      {adBanners.map((ad, index) => (
        <SwiperSlide key={index}>
          <img
            src={ad}
            alt={`광고 배너 ${index + 1}`}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              borderRadius: "8px"
            }}
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
