/**
 * Menu 아이콘 컴포넌트 (햄버거 메뉴)
 * @param {string} color - 아이콘 색상 (기본값: "black")
 * @param {number} size - 아이콘 크기 (기본값: 24)
 * @param {number} rotate - 회전 각도 (0, 90, 180, 270 등)
 * @param {string} className - 추가 CSS 클래스
 */
const MenuIcon = ({ color = "black", size = 24, rotate = 0, className }) => (
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
      fillRule="nonzero"
      clipRule="evenodd"
      d="M3.1 5.99998C3.1 5.50292 3.50294 5.09998 4 5.09998H20C20.4971 5.09998 20.9 5.50292 20.9 5.99998C20.9 6.49703 20.4971 6.89998 20 6.89998H4C3.50294 6.89998 3.1 6.49703 3.1 5.99998Z"
      fill={color}
    />
    <path
      fillRule="nonzero"
      clipRule="evenodd"
      d="M3.09961 12C3.09961 11.5029 3.41653 11.1 3.80747 11.1H16.3917C16.7827 11.1 17.0996 11.5029 17.0996 12C17.0996 12.497 16.7827 12.9 16.3917 12.9H3.80747C3.41653 12.9 3.09961 12.497 3.09961 12Z"
      fill={color}
    />
    <path
      fillRule="nonzero"
      clipRule="evenodd"
      d="M3.1 18C3.1 17.5029 3.50294 17.1 4 17.1H20C20.4971 17.1 20.9 17.5029 20.9 18C20.9 18.497 20.4971 18.9 20 18.9H4C3.50294 18.9 3.1 18.497 3.1 18Z"
      fill={color}
    />
  </svg>
);

export default MenuIcon;
