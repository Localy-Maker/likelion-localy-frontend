import { useState } from "react";
import { useNavigate } from "react-router";
import Header from "@/shared/components/Header/Header";
import BottomNavigation from "@/shared/components/bottom/BottomNavigation";
import LoadingPage from "@/features/loading/pages/LoadingPage";
import SortButtons from "@/features/local/components/bookmark/SortButtons";
import BookmarkList from "@/features/local/components/bookmark/BookmarkList";
import { useBookmarks } from "@/features/local/hooks/useBookmarks";
import { useInfiniteScroll } from "@/features/local/hooks/useInfiniteScroll";
import { useBookmarkToggle } from "@/features/local/hooks/useBookmarkToggle";
import { Container, ErrorMessage } from "@/features/local/styles/Bookmark.styles";

export default function BookmarkPage() {
  const navigate = useNavigate();
  const [sortType, setSortType] = useState('latest');

  const { bookmarks, loading, error, hasNext, fetchMore, refresh } = useBookmarks(sortType);
  const { ref: lastElementRef } = useInfiniteScroll(fetchMore, hasNext, false);
  const { toggleBookmark } = useBookmarkToggle();

  const handleLeftClick = () => navigate(-1);
  const handlePlaceClick = (placeId) => navigate(`/local/detail/${placeId}`);
  const handleSortChange = (type) => setSortType(type);

  const handleBookmarkToggle = async (placeId) => {
    try {
      await toggleBookmark(placeId, true);
      refresh();
    } catch (err) {
      console.error('북마크 처리 실패:', err);
    }
  };

  if (loading && bookmarks.length === 0) {
    return <LoadingPage />;
  }

  return (
    <>
      <Header text="북마크" showLeftIcon onLeftClick={handleLeftClick} rightIcon={null} />
      <Container>
        <SortButtons sortType={sortType} onSortChange={handleSortChange} />
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <BookmarkList
          bookmarks={bookmarks}
          onPlaceClick={handlePlaceClick}
          onBookmarkToggle={handleBookmarkToggle}
          lastElementRef={lastElementRef}
        />
      </Container>
      <BottomNavigation />
    </>
  );
}

