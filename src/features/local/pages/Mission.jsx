import { useNavigate } from "react-router";
import Header from "@/shared/components/Header/Header";
import BottomNavigation from "@/shared/components/bottom/BottomNavigation";
import LoadingPage from "@/features/loading/pages/LoadingPage";
import PointSummary from "@/features/local/components/mission/PointSummary";
import MissionSummary from "@/features/local/components/mission/MissionSummary";
import { useMissions, formatExpiresAt } from "@/features/local/hooks/useMissions";
import { Container, ErrorMessage } from "@/features/local/styles/Mission.styles";

export default function MissionPage() {
    const navigate = useNavigate();

    // 미션 데이터 가져오기
    const { pointInfo, availableMissions, completedMissions, loading, error } = useMissions();

    const handleUsePoints = () => {
        navigate("/local/spend-points");
    };

    const handleLeftClick = () => {
        navigate("/local");
    };

    // 미션 데이터를 MissionSummary 형식에 맞게 변환
    const formattedAvailableMissions = availableMissions.map(mission => ({
        id: mission.missionId,
        title: mission.missionTitle,
        deadline: formatExpiresAt(mission.expiresAt),
        point: mission.points,
        isNew: mission.isNew,
        emotion: mission.emotion
    }));

    const formattedCompletedMissions = completedMissions.map(mission => ({
        id: mission.missionId,
        title: mission.missionTitle,
        deadline: formatExpiresAt(mission.expiresAt),
        point: mission.points,
        isNew: mission.isNew,
        emotion: mission.emotion
    }));

    if (loading && !pointInfo) {
        return <LoadingPage />;
    }

    return (
        <>
            <Header text="Localy 미션" onLeftClick={handleLeftClick} rightIcon={null} />
            <Container>
                {error && <ErrorMessage>{error}</ErrorMessage>}
                {pointInfo && (
                    <PointSummary
                        totalPoints={pointInfo.totalPoints}
                        missionCount={pointInfo.assignedMissions}
                        availablePoints={pointInfo.availablePoints}
                        onUsePoints={handleUsePoints}
                    />
                )}
                <MissionSummary
                    availableMissions={formattedAvailableMissions}
                    completedMissions={formattedCompletedMissions}
                />
            </Container>
            <BottomNavigation />
        </>
    );
}