import { useState, useRef, useEffect } from "react";
import * as S from "../styles/YearMonthSidebar.styles";

/**
 * 년도/월 선택 드롭다운 컴포넌트
 * @param {boolean} isOpen - 드롭다운 열림/닫힘 상태
 * @param {function} onClose - 드롭다운 닫기 핸들러
 * @param {number} currentYear - 현재 선택된 년도
 * @param {number} currentMonth - 현재 선택된 월
 * @param {function} onSelect - 년도/월 선택 핸들러 (year, month)
 * @param {React.RefObject} triggerRef - 트리거 요소의 ref (위치 계산용)
 */
export default function YearMonthSidebar({ isOpen, onClose, currentYear, currentMonth, onSelect, triggerRef }) {
  const dropdownRef = useRef(null);
  const [selectedMode, setSelectedMode] = useState("year"); // "year" or "month"

  // 드롭다운이 열릴 때마다 년도 선택 모드로 리셋
  useEffect(() => {
    if (isOpen) {
      setSelectedMode("year");
    }
  }, [isOpen]);

  // 년도 목록 생성 (현재 년도 기준 ±5년)
  const years = [];
  for (let i = currentYear - 5; i <= currentYear + 5; i++) {
    years.push(i);
  }

  // 월 목록 생성
  const months = [
    { value: 1, label: "1월" },
    { value: 2, label: "2월" },
    { value: 3, label: "3월" },
    { value: 4, label: "4월" },
    { value: 5, label: "5월" },
    { value: 6, label: "6월" },
    { value: 7, label: "7월" },
    { value: 8, label: "8월" },
    { value: 9, label: "9월" },
    { value: 10, label: "10월" },
    { value: 11, label: "11월" },
    { value: 12, label: "12월" },
  ];

  useEffect(() => {
    if (isOpen && triggerRef?.current && dropdownRef?.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const dropdown = dropdownRef.current;
      const viewportHeight = window.innerHeight;
      const dropdownMaxHeight = 400;
      const spaceBelow = viewportHeight - triggerRect.bottom;
      const spaceAbove = triggerRect.top;
      
      // 드롭다운 너비 설정 (최소 130px)
      const dropdownWidth = Math.max(130, triggerRect.width);
      dropdown.style.width = `${dropdownWidth}px`;
      dropdown.style.left = `${triggerRect.left + window.scrollX}px`;
      
      // 아래쪽 공간이 충분하면 필드 아래에 배치
      if (spaceBelow >= dropdownMaxHeight || spaceBelow >= spaceAbove) {
        dropdown.style.top = `${triggerRect.bottom + window.scrollY + 4}px`;
        dropdown.style.bottom = 'auto';
      } else {
        // 아래쪽 공간이 부족하면 필드 위에 배치
        dropdown.style.bottom = `${viewportHeight - triggerRect.top + window.scrollY}px`;
        dropdown.style.top = 'auto';
      }
    }
  }, [isOpen, triggerRef, selectedMode]);

  const handleMonthSelect = (month) => {
    onSelect(currentYear, month);
    onClose();
    setSelectedMode("year"); // 다음 열 때는 년도부터
  };

  const handleBackToYear = () => {
    setSelectedMode("year");
  };

  if (!isOpen) return null;

  return (
    <>
      {/* 배경 오버레이 */}
      <S.Overlay onClick={onClose} />
      
      {/* 드롭다운 */}
      <S.Dropdown ref={dropdownRef}>
        <S.Section>
          {selectedMode === "year" ? (
            <>
              {/* 년도 섹션 */}
              <S.SidebarRow>
                <S.Leading>
                  <S.Symbol>년</S.Symbol>
                  <S.TitleAndSubtitle>
                    <S.Title>년도</S.Title>
                  </S.TitleAndSubtitle>
                </S.Leading>
              </S.SidebarRow>
              
              {years.map((year) => (
                <S.SidebarRow
                  key={year}
                  onClick={() => {
                    onSelect(year, currentMonth);
                    setSelectedMode("month");
                  }}
                  $isSelected={currentYear === year}
                >
                  <S.Leading>
                    <S.Symbol></S.Symbol>
                    <S.TitleAndSubtitle>
                      <S.Title>{year}년</S.Title>
                    </S.TitleAndSubtitle>
                  </S.Leading>
                </S.SidebarRow>
              ))}
            </>
          ) : (
            <>
              {/* 뒤로가기 버튼 */}
              <S.SidebarRow onClick={handleBackToYear} style={{ cursor: 'pointer' }}>
                <S.Leading>
                  <S.Symbol>←</S.Symbol>
                  <S.TitleAndSubtitle>
                    <S.Title>년도 선택</S.Title>
                  </S.TitleAndSubtitle>
                </S.Leading>
              </S.SidebarRow>
              
              {/* 월 섹션 */}
              <S.SidebarRow>
                <S.Leading>
                  <S.Symbol>월</S.Symbol>
                  <S.TitleAndSubtitle>
                    <S.Title>월</S.Title>
                  </S.TitleAndSubtitle>
                </S.Leading>
              </S.SidebarRow>
              
              {months.map((month) => (
                <S.SidebarRow
                  key={month.value}
                  onClick={() => handleMonthSelect(month.value)}
                  $isSelected={currentMonth === month.value}
                >
                  <S.Leading>
                    <S.Symbol></S.Symbol>
                    <S.TitleAndSubtitle>
                      <S.Title>{month.label}</S.Title>
                    </S.TitleAndSubtitle>
                  </S.Leading>
                </S.SidebarRow>
              ))}
            </>
          )}
        </S.Section>
      </S.Dropdown>
    </>
  );
}

