import * as S from "../styles/LogoutModal.styles";

export default function LogoutModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "로그아웃",
  message = "로그아웃을 계속 하시겠습니까?",
  confirmText = "확인",
  cancelText = "닫기"
}) {
  if (!isOpen) return null;

  return (
    <S.Overlay onClick={onClose}>
      <S.Modal onClick={(e) => e.stopPropagation()}>
        <S.Content>
          <S.Title>{title}</S.Title>
          <S.Message>{message}</S.Message>
        </S.Content>
        
        <S.ButtonContainer>
          <S.CancelButton onClick={onClose}>
            {cancelText}
          </S.CancelButton>
          <S.ConfirmButton onClick={onConfirm}>
            {confirmText}
          </S.ConfirmButton>
        </S.ButtonContainer>
      </S.Modal>
    </S.Overlay>
  );
}

