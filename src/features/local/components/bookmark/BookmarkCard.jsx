import { colors } from "@/styles/colors";
import BookmarkIcon from "@/shared/components/icons/BookmarkIcon";
import {
  PlaceCard,
  PlaceImage,
  BookmarkIconWrapper,
  PlaceContent,
  PlaceCategory,
  PlaceName,
  PlaceLocation
} from "@/features/local/styles/Bookmark.styles";

export default function BookmarkCard({ place, onPlaceClick, onBookmarkToggle, forwardRef }) {
  const handleBookmarkClick = (e) => {
    e.stopPropagation();
    onBookmarkToggle(place.placeId);
  };

  return (
    <PlaceCard
      ref={forwardRef}
      onClick={() => onPlaceClick(place.placeId)}
    >
      <PlaceImage $imageUrl={place.thumbnailImage}>
        <BookmarkIconWrapper onClick={handleBookmarkClick}>
          <BookmarkIcon color={colors.blue[50]} size={21} />
        </BookmarkIconWrapper>
      </PlaceImage>
      <PlaceContent>
        <PlaceCategory>{place.category}</PlaceCategory>
        <PlaceName>{place.placeName}</PlaceName>
        <PlaceLocation>{place.address}</PlaceLocation>
      </PlaceContent>
    </PlaceCard>
  );
}

