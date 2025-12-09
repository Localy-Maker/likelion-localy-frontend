import { useParams, useNavigate } from "react-router";
import Header from "@/shared/components/Header/Header";
import BottomNavigation from "@/shared/components/bottom/BottomNavigation";
import LoadingPage from "@/features/loading/pages/LoadingPage";
import LocationError from "@/features/local/components/modal/LocationError";
import MissionSucces from "@/features/local/components/modal/MissionSucces";
import MissionInfoCard from "@/features/local/components/challenge/MissionInfoCard";
import PlaceInfoCard from "@/features/local/components/challenge/PlaceInfoCard";
import { useMissionDetail } from "@/features/local/hooks/useMissionDetail";
import { useMissionVerify } from "@/features/local/hooks/useMissionVerify";
import { useGeolocation } from "@/features/local/hooks/useGeolocation";
import { useChallengeModal } from "@/features/local/hooks/useChallengeModal";
import { Container } from "@/features/local/styles/Challenge.styles";

export default function ChallengePage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const { latitude, longitude } = useGeolocation();
    const { data: missionData, loading } = useMissionDetail(id, latitude, longitude);
    const { verifyMission, isLoading: isVerifying } = useMissionVerify();
    const { successModal, errorModal, verifyResult, showSuccessModal, showErrorModal, closeModal } = useChallengeModal();

    const handleLeftClick = () => navigate(-1);
    const handleOtherMissions = () => navigate("/local/mission");

    const handleMapClick = () => {
        if (missionData?.placeInfo?.kakaoMapUrl) {
            window.open(missionData.placeInfo.kakaoMapUrl, '_blank');
        }
    };

    const handleCertification = async () => {
        if (!latitude || !longitude) {
            showErrorModal();
            return;
        }

        const result = await verifyMission(id, latitude, longitude);
        result.success ? showSuccessModal(result) : showErrorModal(result);
    };

    if (loading || !missionData) {
        return <LoadingPage />;
    }

    return (
        <>
            <Header text="미션 진행" onLeftClick={handleLeftClick} rightIcon={null} />
            <Container>
                <MissionInfoCard missionData={missionData} />
                <PlaceInfoCard
                    placeInfo={missionData.placeInfo}
                    onMapClick={handleMapClick}
                    onCertification={handleCertification}
                    isVerifying={isVerifying}
                    borderRadius={0}
                />
            </Container>
            <BottomNavigation />

            <MissionSucces
                isOpen={successModal}
                onClose={closeModal}
                onOtherMissions={handleOtherMissions}
                missionTitle={verifyResult?.missionTitle}
                earnedPoints={verifyResult?.earnedPoints}
                totalPoints={verifyResult?.totalPoints}
            />

            <LocationError
                isOpen={errorModal}
                onClose={closeModal}
                placeName={missionData?.placeInfo?.placeName}
                errorMessage={verifyResult?.message}
            />



        </>
    );
}

