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

// Mock data for initial implementation
const mockBookmarks = [
  { id: 1, category: "카테고리", title: "장소 1", location: "위치" },
  { id: 2, category: "카테고리", title: "장소 2", location: "위치" },
  { id: 3, category: "카테고리", title: "장소 3", location: "위치" },
  { id: 4, category: "카테고리", title: "장소 4", location: "위치" },
];

/**
 * @component BookmarkCarousel
 * @description 북마크 장소 모아보기 캐러셀
 * @param {function} onViewAll - 전체보기 버튼 클릭 핸들러 (북마크 페이지로 이동)
 * @param {Array} bookmarks - 북마크 데이터 (optional, defaults to mock data)
 */
const BookmarkCarousel = ({ onViewAll, bookmarks = mockBookmarks }) => {
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
          <LocationCard key={bookmark.id}>
            <CardImage>이미지</CardImage>
            <CardInfo>
              <CardCategory>{bookmark.category}</CardCategory>
              <CardTitle>{bookmark.title}</CardTitle>
              <CardLocation>{bookmark.location}</CardLocation>
            </CardInfo>
          </LocationCard>
        ))}
      </CarouselScroll>
    </CarouselContainer>
  );
};

export default BookmarkCarousel;
