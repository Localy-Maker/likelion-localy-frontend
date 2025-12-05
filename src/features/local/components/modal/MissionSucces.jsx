import styled from "styled-components";
import { colors } from "@/styles/colors";
import { font } from "@/styles/font";
import EmotionGroupIcon from "@/shared/components/icons/EmotionGroupIcon";

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
    background-color: ${colors.gray[100]};
    border-radius: 16px;
    padding: 24px 12px;
    max-width: 320px;
    width: 90%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    text-align: center;
    position: relative;
    padding-top: 60px;
`;

const IconWrapper = styled.div`
    position: absolute;
    top: -60px;
    left: 50%;
    transform: translateX(-50%);
`;

const Title = styled.h2`
    ${font.regular14}
    color: ${colors.gray[800]};
    margin: 0;
`;

const Message = styled.p`
    ${font.semibold20}
    color: ${colors.blue[50]};
    margin: 0;
    line-height: 1.5;
`;

const PointContainer = styled.div`
    display: flex;
    gap: 8px;
    background-color: ${colors.gray[200]};
    padding: 12px 16px;
    border-radius: 16px;
`;
const PointText = styled.div`
    ${font.regular14}
    color: ${colors.gray[900]};
`;

const PointDisplay = styled.div`
    display: flex;
    gap: 2px;
`;

const PointValue = styled.div`
    ${font.medium12}
    color: ${colors.blue[50]};
    display: flex;
    align-items: flex-end;
`;

const PointUnit = styled.div`
    ${font.medium10}
    color: ${colors.blue[50]};
    display: flex;
    align-items: flex-end;
`;
const ButtonContainer = styled.div`
    display: flex;
    gap: 8px;
`;
const CloseButton = styled.button`
    ${font.medium14}
    color: ${props => props.$isPrimary ? colors.gray[100] : colors.blue[50]};
    background-color: ${props => props.$isPrimary ? colors.blue[50] : colors.blue[20]};
    border: none;
    border-radius: 8px;
    padding: 12px 24px;
    margin-top: 8px;
    cursor: pointer;
    transition: opacity 0.2s;
    min-width: 120px;
    min-height: 36px;
        &:hover {
        opacity: 0.8;
    }
`;

/**
 * 미션 성공 모달 컴포넌트
 * @param {boolean} isOpen - 모달 열림/닫힘 상태
 * @param {function} onClose - 모달 닫기 콜백 함수
 * @param {function} onOtherMissions - 다른 미션 보기 콜백 함수
 * @param {string} missionTitle - 미션 제목
 * @param {number} earnedPoints - 획득한 포인트
 */
export default function MissionSuccess({
    isOpen,
    onClose,
    onOtherMissions,
    missionTitle = "미션",
    earnedPoints = 0
}) {
    if (!isOpen) return null;

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <ModalOverlay onClick={handleOverlayClick}>
            <ModalContainer>
                <IconWrapper>
                    <EmotionGroupIcon width={120} height={103} />
                </IconWrapper>
                <Title>축하해요!</Title>
                <Message><strong>"{missionTitle}"</strong> 완료!</Message>
                <PointContainer>
                    <PointText>획득한 Localy 포인트</PointText>
                    <PointDisplay>
                        <PointValue>{earnedPoints}</PointValue>
                        <PointUnit>P</PointUnit>
                    </PointDisplay>
                </PointContainer>
                <ButtonContainer>
                    <CloseButton onClick={onClose}>닫기</CloseButton>
                    <CloseButton $isPrimary onClick={onOtherMissions}>다른 미션 보기</CloseButton>
                </ButtonContainer>
            </ModalContainer>
        </ModalOverlay>
    );
}

