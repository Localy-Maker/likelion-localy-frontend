import { colors } from "@/styles/colors";

/**
 * Bookmark 아이콘 컴포넌트
 * @param {string} color - 아이콘 색상 (기본값: "black")
 * @param {string} stroke - 외각선 색상 (기본값: "black")
 * @param {number} size - 아이콘 크기 (기본값: 24)
 * @param {string} className - 추가 CSS 클래스
 */
const BookmarkIcon = ({
  stroke = "black",
  color = colors.blue[50],
  size = 24,
  className,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M7.5625 20.2266C7.30208 20.2266 7.09896 20.1432 6.95312 19.9766C6.80729 19.8099 6.73438 19.5755 6.73438 19.2734V5.71094C6.73438 4.96615 6.91927 4.40625 7.28906 4.03125C7.65885 3.65625 8.21094 3.46875 8.94531 3.46875H15.0547C15.7891 3.46875 16.3411 3.65625 16.7109 4.03125C17.0807 4.40625 17.2656 4.96615 17.2656 5.71094V19.2734C17.2656 19.5755 17.1927 19.8099 17.0469 19.9766C16.901 20.1432 16.6979 20.2266 16.4375 20.2266C16.2448 20.2266 16.0651 20.1615 15.8984 20.0312C15.737 19.901 15.4792 19.6667 15.125 19.3281L12.0703 16.3203C12.0234 16.2682 11.9766 16.2682 11.9297 16.3203L8.875 19.3281C8.52083 19.6719 8.26042 19.9062 8.09375 20.0312C7.92708 20.1615 7.75 20.2266 7.5625 20.2266Z"
      fill={color}
      stroke={stroke}
      strokeWidth="2"
    />
  </svg>
);

export default BookmarkIcon;
