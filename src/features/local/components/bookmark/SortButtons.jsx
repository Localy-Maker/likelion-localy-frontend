import { ButtonGroup, SortButton } from "@/features/local/styles/Bookmark.styles";

export default function SortButtons({ sortType, onSortChange }) {
  return (
    <ButtonGroup>
      <SortButton
        $isActive={sortType === 'latest'}
        onClick={() => onSortChange('latest')}
      >
        최신순
      </SortButton>
      <SortButton
        $isActive={sortType === 'popular'}
        onClick={() => onSortChange('popular')}
      >
        인기순
      </SortButton>
    </ButtonGroup>
  );
}

