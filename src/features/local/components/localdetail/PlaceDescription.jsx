import {
  InfoSection,
  DetailLabel,
  ShortDescription,
  DescriptionContainer,
  LongDescriptionContainer,
  Description
} from "@/features/local/styles/LocalDetail.styles";

export default function PlaceDescription({ shortDescription, longDescription }) {
  return (
    <DescriptionContainer>
      <InfoSection style={{ borderBottom: 'none' }}>
        <DetailLabel>장소 소개</DetailLabel>
        <ShortDescription>{shortDescription}</ShortDescription>
      </InfoSection>
      <LongDescriptionContainer>
        {longDescription && <Description>{longDescription}</Description>}
      </LongDescriptionContainer>
    </DescriptionContainer>
  );
}

