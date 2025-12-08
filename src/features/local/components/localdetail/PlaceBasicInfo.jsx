import InfoRow from "./InfoRow";
import {
  InfoSection,
  DetailLabel,
  Category
} from "@/features/local/styles/LocalDetail.styles";

export default function PlaceBasicInfo({ placeData }) {
  return (
    <>
      {/* 카테고리 */}
      <InfoSection>
        <DetailLabel>카테고리</DetailLabel>
        <Category>{placeData.category}</Category>
      </InfoSection>

      {/* 주소 */}
      <InfoRow label="위치" value={placeData.address} />

      {/* 영업시간 */}
      <InfoRow label="영업시간" value={placeData.openingHours} />

      {/* 전화번호 */}
      <InfoRow label="전화번호" value={placeData.phoneNumber} />

    </>
  );
}

