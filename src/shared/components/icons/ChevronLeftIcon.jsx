/**
 * Chevron Left 아이콘 컴포넌트 (왼쪽 화살표)
 * @param {string} color - 아이콘 색상 (기본값: "black")
 * @param {number} rotate - 회전 각도 (0, 90, 180, 270 등)
 * @param {number} size - 아이콘 크기 (기본값: 24)
 * @param {string} className - 추가 CSS 클래스
 *
 * @example
 * <ChevronLeftIcon rotate={180} /> // 오른쪽 화살표
 * <ChevronLeftIcon rotate={90} />  // 위쪽 화살표
 * <ChevronLeftIcon rotate={-90} /> // 아래쪽 화살표
 */
const ChevronLeftIcon = ({
  color = "black",
  size = 24,
  rotate = 0,
  className,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ transform: `rotate(${rotate}deg)` }}
  >
    <path
      d="M9.27415 12.0006L16.2842 4.99053C16.4795 4.79527 16.4795 4.47868 16.2842 4.28342L15.7185 3.71774C15.5232 3.52247 15.2067 3.52247 15.0114 3.71774L7.08212 11.647C6.88685 11.8423 6.88685 12.1589 7.08212 12.3541L15.0114 20.2834C15.2067 20.4787 15.5232 20.4787 15.7185 20.2834L16.2842 19.7177C16.4795 19.5225 16.4795 19.2059 16.2842 19.0106L9.27415 12.0006Z"
      fill={color}
      stroke={color}
      strokeWidth="1"
    />
  </svg>
);

export default ChevronLeftIcon;
