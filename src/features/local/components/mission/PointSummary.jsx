import styled from "styled-components";
import { colors } from "@/styles/colors";
import { font } from "@/styles/font";

const PointContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
`;

const PointContainerHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
`;

const PointContainerTitle = styled.div`
    ${font.medium14}
    color: ${colors.gray[900]};
`;

const PointUseButton = styled.button`
    ${font.medium12}
    color: ${colors.blue[50]};
    border-radius: 6px;
    padding: 5px 10px;
    cursor: pointer;
    border: none;
    background: none;
    transition: opacity 0.2s;

    &:hover {
        opacity: 0.8;
    }
`;

const PointDisplay = styled.div`
    display: flex;
    gap: 2px;
`;

const PointValue = styled.div`
    ${font.bold32}
    color: ${colors.blue[50]};
`;

const PointUnit = styled.div`
    ${font.semibold20}
    color: ${colors.gray[900]};
    display: flex;
    align-items: flex-end;
    margin-bottom: 4px;
`;

const CardContainer = styled.div`
width: 100%;
    display: flex;
    justify-content: center;
    gap: 10px;
`;

const Card = styled.div`
    width: 100%;
    height: 96px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
    border-radius: 8px;
    background-color: ${props => props.$bgColor || colors.gray[200]};
`;

const CardTitle = styled.div`
    ${font.medium14}
    color: ${colors.gray[900]};
`;

const CardValue = styled.div`
    ${font.bold28}
    color: ${colors.gray[900]};
`;

const CardUnit = styled(PointUnit)`
    ${font.semibold20}
`;

export default function PointSummary({ totalPoints, missionCount, availablePoints, onUsePoints }) {
    return (
        <PointContainer>
            <PointContainerHeader>
                <PointContainerTitle>지금까지 모은 Localy 포인트</PointContainerTitle>
                <PointUseButton onClick={onUsePoints}>포인트 사용</PointUseButton>
            </PointContainerHeader>

            <PointDisplay>
                <PointValue>{totalPoints}</PointValue>
                <PointUnit>P</PointUnit>
            </PointDisplay>

            <CardContainer>
                <Card $bgColor={colors.gray[200]}>
                    <CardTitle>나의 미션</CardTitle>
                    <PointDisplay>
                        <CardValue>{missionCount}</CardValue>
                        <CardUnit>개</CardUnit>
                    </PointDisplay>
                </Card>

                <Card $bgColor={colors.blue[20]}>
                    <CardTitle>사용가능 포인트</CardTitle>
                    <PointDisplay>
                        <CardValue>{availablePoints}</CardValue>
                        <CardUnit>P</CardUnit>
                    </PointDisplay>
                </Card>
            </CardContainer>
        </PointContainer>
    );
}

