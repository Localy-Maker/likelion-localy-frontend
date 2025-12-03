/**
 * New 배지 아이콘 컴포넌트
 * @param {number} width - 아이콘 너비 (기본값: 36)
 * @param {number} height - 아이콘 높이 (기본값: 16)
 * @param {string} className - 추가 CSS 클래스
 */
const NewIcon = ({ width = 36, height = 16, className }) => (
    <svg
        width={width}
        height={height}
        viewBox="0 0 36 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
    >
        <rect width="36" height="16" rx="8" fill="#FFCCCC" />
        <path
            d="M12.7963 4.72727V12H11.4681L8.30407 7.42259H8.2508V12H6.71316V4.72727H8.06259L11.2018 9.30114H11.2657V4.72727H12.7963ZM14.0667 12V4.72727H18.9672V5.99503H15.6043V7.72798H18.7151V8.99574H15.6043V10.7322H18.9814V12H14.0667ZM21.8268 12L19.7458 4.72727H21.4255L22.6294 9.78054H22.6897L24.0178 4.72727H25.4561L26.7806 9.79119H26.8445L28.0484 4.72727H29.7281L27.6471 12H26.1485L24.7636 7.24503H24.7068L23.3254 12H21.8268Z"
            fill="#FF6868"
        />
    </svg>
);

export default NewIcon;

