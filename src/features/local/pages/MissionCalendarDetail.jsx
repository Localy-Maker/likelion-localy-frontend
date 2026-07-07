import { useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import styled from "styled-components";
import { format, parseISO } from "date-fns";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Header from "@/shared/components/Header/Header";
import BottomNavigation from "@/shared/components/bottom/BottomNavigation";
import LoadingPage from "@/features/loading/pages/LoadingPage";
import CheckmarkCircleIcon from "@/shared/components/icons/CheckmarkCircleIcon";
import PhotoSourceActionSheet from "@/features/local/components/mission/PhotoSourceActionSheet";
import { useArchiveDetail } from "@/features/local/hooks/useArchiveDetail";
import {
  setArchiveThumbnail,
  uploadArchivePhoto,
} from "@/features/local/api/archiveApi";
import { colors } from "@/styles/colors";
import { font } from "@/styles/font";

const Container = styled.main`
  padding: 20px 24px 180px;
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const DateHeading = styled.h1`
  ${font.semibold20}
  color: ${colors.blue[50]};
  margin: 0;
`;

const Subtitle = styled.p`
  ${font.medium14}
  color: ${colors.gray[900]};
  margin: 0 0 12px;
`;

const PhotoGrid = styled.section`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
`;

const PhotoCard = styled.button`
  position: relative;
  aspect-ratio: 3 / 4;
  background: ${colors.blue[10]};
  border-radius: 8px;
  overflow: hidden;
  border: none;
  padding: 0;
  cursor: pointer;
  display: block;
`;

const PhotoImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const CheckBadge = styled.span`
  position: absolute;
  top: 9px;
  right: 8px;
  display: inline-flex;
  pointer-events: none;
`;

const EmptyState = styled.div`
  ${font.regular14}
  color: ${colors.gray[600]};
  text-align: center;
  padding: 40px 0;
`;

const AddButtonWrapper = styled.div`
  position: fixed;
  bottom: 80px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  padding: 12px 24px 0;
  background: linear-gradient(
    to top,
    ${colors.gray[100]} 60%,
    rgba(255, 255, 255, 0)
  );
  pointer-events: none;
`;

const AddButton = styled.button`
  pointer-events: auto;
  width: 100%;
  max-width: 752px;
  height: 40px;
  background: ${colors.blue[50]};
  color: ${colors.gray[100]};
  border: none;
  border-radius: 8px;
  ${font.medium14}
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const HiddenFileInput = styled.input`
  display: none;
`;

function formatKoreanDate(dateStr) {
  try {
    return format(parseISO(dateStr), "M월 d일");
  } catch {
    return dateStr;
  }
}

function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export default function MissionCalendarDetailPage() {
  const { date } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useArchiveDetail(date);

  const [sheetOpen, setSheetOpen] = useState(false);
  const albumInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const count = data?.completedMissionCount ?? 0;
  const photos = data?.photos ?? [];

  const invalidateArchive = () => {
    queryClient.invalidateQueries({ queryKey: ["mission-archive-detail", date] });
    queryClient.invalidateQueries({ queryKey: ["mission-archive-monthly"] });
  };

  const uploadMutation = useMutation({
    mutationFn: (payload) => uploadArchivePhoto(payload),
    onSuccess: invalidateArchive,
  });

  const thumbnailMutation = useMutation({
    mutationFn: (archiveId) => setArchiveThumbnail(archiveId),
    onSuccess: invalidateArchive,
  });

  const handleAddClick = () => setSheetOpen(true);
  const handleCloseSheet = () => setSheetOpen(false);

  const triggerAlbum = () => {
    setSheetOpen(false);
    albumInputRef.current?.click();
  };
  const triggerCamera = () => {
    setSheetOpen(false);
    cameraInputRef.current?.click();
  };

  const handleFile = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    // TODO: 백엔드가 이미지 파일을 직접 받지 않고 imageUrl 만 받으므로
    //  실 서비스에서는 별도 스토리지(S3 등)에 먼저 업로드해서 URL 을 받아야 한다.
    //  임시로 dataURL 을 imageUrl 자리에 그대로 전송한다.
    const imageUrl = await readFileAsDataURL(file);

    uploadMutation.mutate({
      imageUrl,
      targetDate: date,
      photoStoredDate: date,
    });
  };

  const handlePhotoClick = (photo) => {
    if (!photo?.archiveId || photo.isThumbnail) return;
    thumbnailMutation.mutate(photo.archiveId);
  };

  if (isLoading) return <LoadingPage />;

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
            {photos.map((photo, idx) => {
              const key = photo?.archiveId ?? photo?.imageUrl ?? idx;
              const url = photo?.imageUrl;
              const isThumbnail = !!photo?.isThumbnail;
              return (
                <PhotoCard
                  key={key}
                  type="button"
                  onClick={() => handlePhotoClick(photo)}
                  aria-label={
                    isThumbnail ? "대표 사진" : "이 사진을 대표로 지정"
                  }
                >
                  {url ? <PhotoImg src={url} alt={`미션 사진 ${idx + 1}`} /> : null}
                  <CheckBadge>
                    <CheckmarkCircleIcon filled={isThumbnail} />
                  </CheckBadge>
                </PhotoCard>
              );
            })}
          </PhotoGrid>
        )}
      </Container>

      <AddButtonWrapper>
        <AddButton
          type="button"
          onClick={handleAddClick}
          disabled={uploadMutation.isPending}
        >
          {uploadMutation.isPending ? "업로드 중..." : "미션 사진 추가하기"}
        </AddButton>
      </AddButtonWrapper>

      <PhotoSourceActionSheet
        open={sheetOpen}
        onPickAlbum={triggerAlbum}
        onPickCamera={triggerCamera}
        onClose={handleCloseSheet}
      />

      <HiddenFileInput
        ref={albumInputRef}
        type="file"
        accept="image/*"
        onChange={handleFile}
      />
      <HiddenFileInput
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFile}
      />

      <BottomNavigation />
    </>
  );
}
