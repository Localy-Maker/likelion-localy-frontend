import { useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import * as S from "../styles/SidebarModal.styles";

/**
 * 드롭다운 모달 컴포넌트
 * @param {boolean} isOpen - 모달 열림/닫힘 상태
 * @param {function} onClose - 모달 닫기 핸들러
 * @param {Array} options - 선택 가능한 옵션 배열 [{id, label, icon?}]
 * @param {string} selectedValue - 현재 선택된 값
 * @param {function} onSelect - 옵션 선택 핸들러
 * @param {React.RefObject} triggerRef - 트리거 요소의 ref (위치 계산용)
 * @param {boolean} autoClose - 선택 시 자동으로 닫을지 여부 (기본값: true)
 */
export default function SidebarModal({ isOpen, onClose, options, selectedValue, onSelect, triggerRef, autoClose = true }) {
  const modalRef = useRef(null);

  useEffect(() => {
    if (isOpen && triggerRef?.current && modalRef?.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const modal = modalRef.current;
      const viewportHeight = window.innerHeight;
      const modalMaxHeight = 400; // 모달 최대 높이
      const spaceBelow = viewportHeight - triggerRect.bottom;
      const spaceAbove = triggerRect.top;
      
      // 모달 너비 설정
      modal.style.width = `${triggerRect.width}px`;
      // position: fixed이므로 getBoundingClientRect()의 left를 그대로 사용
      modal.style.left = `${triggerRect.left}px`;
      
      // 아래쪽 공간이 충분하면 필드 아래에 배치
      if (spaceBelow >= modalMaxHeight || spaceBelow >= spaceAbove) {
        modal.style.top = `${triggerRect.bottom + 4}px`;
        modal.style.bottom = 'auto';
      } else {
        // 아래쪽 공간이 부족하면 필드 위에 배치
        modal.style.bottom = `${viewportHeight - triggerRect.top}px`;
        modal.style.top = 'auto';
      }
    }
  }, [isOpen, triggerRef]);

  const handleSelect = (option) => {
    onSelect(option);
    if (autoClose) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const modalContent = (
    <>
      {/* 배경 오버레이 */}
      <S.Overlay onClick={onClose} />
      
      {/* 드롭다운 모달 */}
      <S.Dropdown ref={modalRef}>
        <S.Section>
          {options.map((option, index) => (
            <S.SidebarRow
              key={option.id || index}
              onClick={() => handleSelect(option)}
              $isSelected={selectedValue === option.value}
            >
              <S.Leading>
                {option.icon && (
                  <S.Symbol>
                    <span style={{ fontSize: '20px' }}>{option.icon}</span>
                  </S.Symbol>
                )}
                <S.TitleAndSubtitle>
                  <S.Title>{option.label}</S.Title>
                </S.TitleAndSubtitle>
              </S.Leading>
            </S.SidebarRow>
          ))}
        </S.Section>
      </S.Dropdown>
    </>
  );

  // Portal을 사용하여 body에 직접 렌더링
  return createPortal(modalContent, document.body);
}

