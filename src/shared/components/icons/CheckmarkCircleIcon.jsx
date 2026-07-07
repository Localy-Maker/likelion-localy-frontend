/**
 * SF Symbols 의 checkmark.circle / checkmark.circle.fill 을 SVG 로 옮긴 아이콘.
 * 미션 사진 그리드에서 썸네일 여부 표시에 사용.
 */
export default function CheckmarkCircleIcon({
  filled = false,
  size = 16,
  color = "#0D0D0D",
}) {
  if (filled) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 16 16"
        aria-hidden="true"
      >
        <circle cx="8" cy="8" r="8" fill={color} />
        <path
          d="M4.6 8.4 L7 10.6 L11.5 5.6"
          stroke="#FFFFFF"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    );
  }
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 16 16"
      aria-hidden="true"
    >
      <circle
        cx="8"
        cy="8"
        r="7.25"
        stroke={color}
        strokeWidth="1.5"
        fill="#FFFFFF"
      />
      <path
        d="M4.6 8.4 L7 10.6 L11.5 5.6"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}
