import {
  CarouselContainer,
  CarouselHeader,
  CarouselTitle,
  ChevronButton,
  CarouselScroll,
  LocationCard,
  CardImage,
  CardInfo,
  CardCategory,
  CardTitle,
  CardLocation,
} from "../styles/BookmarkCarousel.styles";
import ChevronLeftIcon from "@/shared/components/icons/ChevronLeftIcon";

/**
 * @component BookmarkCarousel
 * @description 북마크 장소 모아보기 캐러셀
 * @param {function} onViewAll - 전체보기 버튼 클릭 핸들러 (북마크 페이지로 이동)
 * @param {Array} bookmarks - 북마크 데이터
 */
const BookmarkCarousel = ({ onViewAll, bookmarks = [] }) => {
  if (!bookmarks || bookmarks.length === 0) {
    return (
      <CarouselContainer>
        <CarouselHeader>
          <CarouselTitle>북마크 장소 모아보기</CarouselTitle>
          <ChevronButton onClick={onViewAll}>
            <ChevronLeftIcon color="#181818" size={14} rotate={180} />
          </ChevronButton>
        </CarouselHeader>
        <CarouselScroll>
          <div style={{ padding: "20px", color: "#A6A6A6", fontSize: "14px" }}>
            북마크한 장소가 없습니다.
          </div>
        </CarouselScroll>
      </CarouselContainer>
    );
  }

  return (
    <CarouselContainer>
      <CarouselHeader>
        <CarouselTitle>북마크 장소 모아보기</CarouselTitle>
        <ChevronButton onClick={onViewAll}>
          <ChevronLeftIcon color="#181818" size={14} rotate={180} />
        </ChevronButton>
      </CarouselHeader>
      <CarouselScroll>
        {bookmarks.map((bookmark) => (
          <LocationCard key={bookmark.bookmarkId}>
            <CardImage
              style={{
                backgroundImage: bookmark.thumbnailImage
                  ? `url(${bookmark.thumbnailImage})`
                  : "none",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {!bookmark.thumbnailImage && "이미지"}
            </CardImage>
            <CardInfo>
              <CardCategory>{bookmark.category}</CardCategory>
              <CardTitle>{bookmark.placeName}</CardTitle>
              <CardLocation>{bookmark.address}</CardLocation>
            </CardInfo>
          </LocationCard>
        ))}
      </CarouselScroll>
    </CarouselContainer>
  );
};

export default BookmarkCarousel;
