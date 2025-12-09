import styled from "styled-components";
import { colors } from "@/styles/colors";
import { font } from "@/styles/font";

const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
`;

const ModalContainer = styled.div`
    background-color: #ffffff;
    border-radius: 16px;
    padding: 32px 12px;
    max-width: 320px;
    width: 90%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    text-align: center;
`;

const Title = styled.h2`
    ${font.semibold16}
    color: ${colors.blue[50]};
    margin: 0;
`;

const Message = styled.p`
    ${font.semibold14}
    color: ${colors.blue[50]};
    margin: 0;
    line-height: 1.5;
`;

const Description = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
    ${font.regular10}
    color: ${colors.gray[900]};
    line-height: 1.6;
`;

const DescriptionText = styled.p`
    ${font.regular8}
    color: ${colors.gray[900]};
    margin: 0;
`;


/**
 * 위치 오류 모달 컴포넌트
 * @param {boolean} isOpen - 모달 열림/닫힘 상태
 * @param {function} onClose - 모달 닫기 콜백 함수
 * @param {string} placeName - 장소 이름 (선택)
 */
export default function LocationError({ isOpen, onClose, placeName, }) {
    if (!isOpen) return null;

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <ModalOverlay onClick={handleOverlayClick}>
            <ModalContainer>
                <Title>잠시만요!</Title>
                <Message>
                    🥲 Localy가 당신의 위치를 정확하게 찾을 수 없어요.
                </Message>
                <Description>
                    {placeName && (
                        <DescriptionText>
                            [{placeName}] 반경 50m 이내라면 다시 한번 확인해 주세요.
                        </DescriptionText>
                    )}
                    <DescriptionText>
                        *GPS의/위치 서비스가 꺼져 있는지 확인해 보세요.
                    </DescriptionText>
                </Description>
            </ModalContainer>
        </ModalOverlay>
    );
}

