import { useNavigate } from "react-router";
import BottomNavigation from "@/shared/components/bottom/BottomNavigation";
import Header from "@/shared/components/Header/Header";
import LoadingPage from "@/features/loading/pages/LoadingPage";
import HomeCard from "@/features/local/components/localhome/HomeCard";
import Recommend from "@/features/local/components/localhome/Recommend";
import Banner from "@/features/local/components/localhome/Banner";
import PlaceCarousel from "@/features/local/components/localhome/PlaceCarousel";
import BookmarkIcon from "@/shared/components/icons/BookmarkIcon";
import { useGeolocation } from "@/features/local/hooks/useGeolocation";
import { useHomeData } from "@/features/local/hooks/useHomeData";
import { Container, ErrorMessage } from "@/features/local/styles/Local.styles";

export default function LocalPage() {
  const navigate = useNavigate();

  // 위치 정보 가져오기
  const { latitude, longitude, loading: locationLoading, error: locationError } = useGeolocation();

  // 홈 데이터 가져오기
  const { data, loading: dataLoading, error: dataError } = useHomeData(latitude, longitude);

  const handleRightClick = () => {
    navigate("/local/bookmark");
  };

  const handleLeftClick = () => {
    navigate("/main");
  };

  const handleMissionCardClick = () => {
    navigate("/local/mission");
  };

  if ((locationLoading || dataLoading) && !data) {
    return <LoadingPage />;
  }

  return (
    <>
      <Header text="로컬 적용 가이드" rightIcon={<BookmarkIcon />} onRightClick={handleRightClick} onLeftClick={handleLeftClick} />
      <Container>
        {(locationError || dataError) && (
          <ErrorMessage>{locationError || dataError}</ErrorMessage>
        )}

        {data && (
          <>
            {data.missionBanner && (
              <HomeCard
                emotionKeyword={data.missionBanner.emotionKeyword}
                totalMissions={data.missionBanner.totalMissions}
                completedMissions={data.missionBanner.completedMissions}
                progressPercent={data.missionBanner.progressPercent}
                onClick={handleMissionCardClick}
              />
            )}

            {data.missionPlaces && data.missionPlaces.length > 0 && (
              <PlaceCarousel
                title="미션 장소 바로 보기"
                items={data.missionPlaces}
                variant="circle"
                itemSize={76}
                pagination={false}
                slidesPerView={"auto"}
                spaceBetween={24}
              />
            )}

            {data.recommendedPlaces && data.recommendedPlaces.length > 0 && (
              <Recommend places={data.recommendedPlaces} />
            )}

            <Banner />

            {data.recentBookmarks && data.recentBookmarks.length > 0 && (
              <PlaceCarousel
                title="최근에 북마크 한 장소"
                items={data.recentBookmarks}
                variant="rectangle"
                itemSize={76}
                pagination={false}
                slidesPerView={"auto"}
                spaceBetween={20}
              />
            )}
          </>
        )}
      </Container>
      <BottomNavigation />
    </>
  );
}
