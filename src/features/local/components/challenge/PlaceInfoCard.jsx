import MapIcon from "@/shared/components/icons/MapIcon";
import PlaceRecommendCarousel from "@/features/local/components/bookmark/PlaceRecommendCarousel";
import {
  PlaceCard,
  PlaceCardContent,
  DetailLabel,
  OpeningHours,
  DetailValue,
  DescriptionContainer,
  ShortDescriptionContainer,
  ShortDescription,
  CertificationButtonContainer,
  CertificationButton,
  MapIconContainer,
  CertificationText
} from "@/features/local/styles/Challenge.styles";

export default function PlaceInfoCard({
  placeInfo,
  onMapClick,
  onCertification,
  isVerifying
}) {
  const imageSlides = placeInfo.images?.map((url) => ({ imageUrl: url })) || [];

  return (
    <PlaceCard>
      <PlaceCardContent>
        {imageSlides.length > 0 && (
          <PlaceRecommendCarousel
            places={imageSlides}
            slidesPerView="auto"
            spaceBetween={16}
            direction="horizontal"
            padding={0}
            borderRadius={0}
            imageWidth={100}
          />
        )}

        <DescriptionContainer>
          <div style={{ display: 'flex', gap: '10px' }}>
            <DetailLabel>{placeInfo.placeName}</DetailLabel>
            <DetailValue>{placeInfo.category}</DetailValue>
          </div>
          {placeInfo.openingHours && (
            <OpeningHours>{placeInfo.openingHours}</OpeningHours>
          )}

          <ShortDescriptionContainer>
            <ShortDescription>{placeInfo.shortDescription}</ShortDescription>
            <MapIconContainer onClick={onMapClick}>
              <MapIcon />
            </MapIconContainer>
          </ShortDescriptionContainer>
        </DescriptionContainer>
      </PlaceCardContent>

      <CertificationButtonContainer>
        <CertificationText>장소 반경 50m 이내에서 버튼을 눌러주세요.</CertificationText>
        <CertificationButton onClick={onCertification} disabled={isVerifying}>
          {isVerifying ? '인증 중...' : '인증하기'}
        </CertificationButton>
      </CertificationButtonContainer>
    </PlaceCard>
  );
}

