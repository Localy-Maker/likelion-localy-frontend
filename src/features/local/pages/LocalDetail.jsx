import { useParams, useNavigate } from "react-router";
import { useBookmarkToggle } from "@/features/local/hooks/useBookmarkToggle";
import BottomNavigation from "@/shared/components/bottom/BottomNavigation";
import Header from "@/shared/components/Header/Header";
import LoadingPage from "@/features/loading/pages/LoadingPage";
import BookmarkIcon from "@/shared/components/icons/BookmarkIcon";
import { usePlaceDetail } from "@/features/local/hooks/usePlaceDetail";
import { DetailContainer } from "@/features/local/styles/LocalDetail.styles";
import PlaceImages from "@/features/local/components/localdetail/PlaceImages";
import PlaceBasicInfo from "@/features/local/components/localdetail/PlaceBasicInfo";
import PlaceDescription from "@/features/local/components/localdetail/PlaceDescription";

export default function LocalDetailPage() {
    const navigate = useNavigate();
    const { id } = useParams();
    const { data: placeData, loading } = usePlaceDetail(id);
    const { toggleBookmark } = useBookmarkToggle();

    const handleLeftClick = () => navigate(-1);

    if (loading || !placeData) {
        return <LoadingPage />;
    }

    const handleBookmarkToggle = async (id) => {
        try {
            await toggleBookmark(id, true);
        } catch (err) {
            console.error('북마크 처리 실패:', err);
        }
    };

    return (
        <>
            <Header
                text={placeData.placeName}
                rightIcon={<BookmarkIcon />}
                onLeftClick={handleLeftClick}
                onRightClick={() => handleBookmarkToggle(id)}
            />
            <DetailContainer>
                <PlaceImages images={placeData.images} />
                <PlaceBasicInfo placeData={placeData} />
                <PlaceDescription
                    shortDescription={placeData.shortDescription}
                    longDescription={placeData.longDescription}
                />
            </DetailContainer>
            <BottomNavigation />
        </>
    );
}