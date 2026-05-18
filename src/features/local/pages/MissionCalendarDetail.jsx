import { useNavigate, useParams } from "react-router";
import styled from "styled-components";
import { format, parseISO } from "date-fns";
import Header from "@/shared/components/Header/Header";
import BottomNavigation from "@/shared/components/bottom/BottomNavigation";
import LoadingPage from "@/features/loading/pages/LoadingPage";
import { useArchiveDetail } from "@/features/local/hooks/useArchiveDetail";
import { colors } from "@/styles/colors";
import { font } from "@/styles/font";

const Container = styled.main`
  padding: 20px 24px 120px;
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const DateHeading = styled.h1`
  ${font.semibold20}
  color: ${colors.blue[50]};
  margin: 0;
`;

const Subtitle = styled.p`
  ${font.medium14}
  color: ${colors.gray[900]};
  margin: 0;
`;

const PhotoGrid = styled.section`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-top: 12px;
`;

const PhotoCard = styled.div`
  aspect-ratio: 1;
  background: ${colors.gray[200]};
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PhotoImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const EmptyState = styled.div`
  ${font.regular14}
  color: ${colors.gray[600]};
  text-align: center;
  padding: 40px 0;
`;

const DoneButtonWrapper = styled.div`
  position: fixed;
  bottom: 80px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  padding: 0 24px;
`;

const DoneButton = styled.button`
  width: 100%;
  max-width: 752px;
  padding: 12px 16px;
  background: ${colors.blue[50]};
  color: ${colors.gray[100]};
  border: none;
  border-radius: 8px;
  ${font.medium14}
  cursor: pointer;

  &:hover {
    opacity: 0.92;
  }
`;

function formatKoreanDate(dateStr) {
  try {
    return format(parseISO(dateStr), "M월 d일");
  } catch {
    return dateStr;
  }
}

export default function MissionCalendarDetailPage() {
  const { date } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, isError } = useArchiveDetail(date);

  if (isLoading) return <LoadingPage />;

  const count = data?.completedMissionCount ?? 0;
  const photos = data?.photos ?? [];

  return (
    <>
      <Header
        text={format(parseISO(date), "yyyy.MM.dd")}
        onLeftClick={() => navigate(-1)}
        rightIcon={null}
      />
      <Container>
        <DateHeading>{formatKoreanDate(date)}</DateHeading>
        <Subtitle>{count}개의 미션 참여 완료!</Subtitle>

        {isError ? (
          <EmptyState>미션 기록을 불러오지 못했어요.</EmptyState>
        ) : photos.length === 0 ? (
          <EmptyState>이 날 완료한 미션 사진이 없어요.</EmptyState>
        ) : (
          <PhotoGrid>
            {photos.map((url, idx) => (
              <PhotoCard key={url ?? idx}>
                {url ? <PhotoImg src={url} alt={`미션 사진 ${idx + 1}`} /> : null}
              </PhotoCard>
            ))}
          </PhotoGrid>
        )}
      </Container>

      <DoneButtonWrapper>
        <DoneButton onClick={() => navigate("/local/mission")}>완료</DoneButton>
      </DoneButtonWrapper>

      <BottomNavigation />
    </>
  );
}
