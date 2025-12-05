import { useState } from "react";
import { useNavigate } from "react-router";
import styled from "styled-components";
import { colors } from "@/styles/colors";
import { font } from "@/styles/font";
import NewIcon from "@/shared/components/icons/NewIcon";

const MissionSummaryContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

const MissionSummaryHeader = styled.div`
    display: flex;
    justify-content: flex-start;
    gap: 29px;
    align-items: center;
`;

const MissionSummaryTab = styled.button`
    ${font.semibold16}
    color: ${colors.gray[900]};
    border: none;
    background: none;
    border-bottom: 2px solid ${props => props.$isActive ? colors.blue[50] : 'transparent'};
    padding-bottom: 11px;
    cursor: pointer;
    font-weight: ${props => props.$isActive ? '600' : '400'};
    transition: all 0.2s;

    &:hover {
        opacity: 0.8;
    }
`;

const MissionCardCarousel = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

const MissionCard = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
    opacity: ${props => props.$isCompleted ? 0.5 : 1};
    transition: opacity 0.3s;
    border-bottom: 1px solid ${colors.gray[200]};
    padding: 16px 6px;
    cursor: pointer;

    &:hover {
        background-color: ${colors.gray[50]};
    }
`;

const MissionCardContent = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
`;

const MissionCardTitle = styled.div`
    ${font.semibold16}
    color: ${colors.gray[900]};
`;

const MissionCardTime = styled.div`
    ${font.medium14}
    color: ${colors.gray[500]};
`;

const MissionPoint = styled.div`
    width: 80px;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 40px;
    border: 1px solid ${props => props.$isCompleted ? colors.gray[500] : colors.blue[50]};
    gap: 2px;
`;

const PointValue = styled.div`
    ${font.semibold16}
    color: ${colors.gray[900]};
`;

const PointUnit = styled.div`
    ${font.semibold14}
    color: ${colors.gray[900]};
`;

const EmptyMessage = styled.div`
    ${font.medium14}
    color: ${colors.gray[500]};
    text-align: center;
    padding: 40px 0;
`;

export default function MissionSummary({ availableMissions = [], completedMissions = [] }) {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("available"); // "available" 또는 "completed"

    const isCompleted = activeTab === "completed";
    const currentMissions = isCompleted ? completedMissions : availableMissions;

    const handleMissionClick = (missionId) => {
        navigate(`/local/challenge/${missionId}`);
    };

    return (
        <MissionSummaryContainer>
            <MissionSummaryHeader>
                <MissionSummaryTab
                    $isActive={activeTab === "available"}
                    onClick={() => setActiveTab("available")}
                >
                    참여 가능
                </MissionSummaryTab>
                <MissionSummaryTab
                    $isActive={activeTab === "completed"}
                    onClick={() => setActiveTab("completed")}
                >
                    참여 완료
                </MissionSummaryTab>
            </MissionSummaryHeader>

            <MissionCardCarousel>
                {currentMissions.length > 0 ? (
                    currentMissions.map((mission) => (
                        <MissionCard
                            key={mission.id}
                            $isCompleted={isCompleted}
                            onClick={() => handleMissionClick(mission.id)}
                        >
                            <MissionCardContent>
                                {mission.isNew && <NewIcon />}

                                <MissionCardTitle>
                                    {mission.title}
                                </MissionCardTitle>
                                <MissionCardTime>
                                    {mission.deadline}
                                </MissionCardTime>
                            </MissionCardContent>

                            <MissionPoint $isCompleted={isCompleted}>
                                <PointValue>{mission.point}</PointValue>
                                <PointUnit>P</PointUnit>
                            </MissionPoint>
                        </MissionCard>
                    ))
                ) : (
                    <EmptyMessage>
                        {isCompleted ? "완료된 미션이 없습니다." : "참여 가능한 미션이 없습니다."}
                    </EmptyMessage>
                )}
            </MissionCardCarousel>
        </MissionSummaryContainer>
    );
}

