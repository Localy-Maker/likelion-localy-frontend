import BookmarkCard from "./BookmarkCard";
import { GridContainer } from "@/features/local/styles/Bookmark.styles";

export default function BookmarkList({ 
  bookmarks, 
  onPlaceClick, 
  onBookmarkToggle, 
  lastElementRef 
}) {
  if (!bookmarks || bookmarks.length === 0) {
    return <GridContainer />;
  }

  return (
    <GridContainer>
      {bookmarks.map((place, idx) => {
        const isLastElement = idx === bookmarks.length - 1;
        
        return (
          <BookmarkCard
            key={place.bookmarkId}
            place={place}
            onPlaceClick={onPlaceClick}
            onBookmarkToggle={onBookmarkToggle}
            forwardRef={isLastElement ? lastElementRef : null}
          />
        );
      })}
    </GridContainer>
  );
}

