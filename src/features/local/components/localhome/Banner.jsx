// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import { Autoplay, Pagination, Scrollbar } from "swiper/modules";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import { colors } from "@/styles/colors";

export default function Banner() {
  return (
    <Swiper
      modules={[Autoplay, Pagination, Scrollbar]}
      style={{
        width: "100%",
        height: "136px",
        borderRadius: "8px",
        backgroundColor: colors.gray[100],
      }}
      slidesPerView={1}
      loop={true}
      autoplay={{ delay: 10000, disableOnInteraction: false }}
      pagination={{ clickable: true }}
    >
      <SwiperSlide>
        <img
          src="/images/banner/banner1.png"
          alt="banner1"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </SwiperSlide>
      <SwiperSlide>
        <img
          src="/images/banner/banner2.png"
          alt="banner2"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </SwiperSlide>
      <SwiperSlide>
        <img
          src="/images/banner/banner3.png"
          alt="banner3"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </SwiperSlide>
    </Swiper>
  );
}
