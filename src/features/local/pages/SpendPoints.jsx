import { useNavigate } from "react-router";
import Header from "@/shared/components/Header/Header";
import BottomNavigation from "@/shared/components/bottom/BottomNavigation";
import EmotionIcon from "@/shared/components/icons/Emotions";
import {
    Container,
    EmotionItem,
    ContentContainer,
    ContentTitle,
    ContentDescription
} from "@/features/local/styles/SpendPoints.styles";

export default function SpendPointsPage() {
    const navigate = useNavigate();
    const handleLeftClick = () => {
        navigate(-1);
    };
    return (
        <>
            <Header text="포인트 사용" onLeftClick={handleLeftClick} rightIcon={null} />
            <Container>
                <EmotionItem>
                    <EmotionIcon name="sad" width={60} height={80} />
                </EmotionItem>
                <ContentTitle>앗!</ContentTitle>
                <ContentDescription>Localy가 포인트 사용처를 열심히 알아보는 중이에요.</ContentDescription>

                <ContentContainer>
                    <ContentDescription>곧, 지역사랑상품권을 비롯하여</ContentDescription>
                    <ContentDescription>다양한 혜택으로 찾아올게요!</ContentDescription>
                </ContentContainer>

            </Container>
            <BottomNavigation />
        </>
    );
}
