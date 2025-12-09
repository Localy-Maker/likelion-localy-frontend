import PlaceRecommendCarousel from "@/features/local/components/bookmark/PlaceRecommendCarousel";

export default function PlaceImages({ images }) {
  if (!images || images.length === 0) return null;

  const imageSlides = images.map((url) => ({ imageUrl: url }));

  return (
    <PlaceRecommendCarousel
      places={imageSlides}
      slidesPerView="auto"
      spaceBetween={16}
      direction="horizontal"
      padding={16}
      borderRadius={0}
      imageWidth={100}
    />
  );
}

