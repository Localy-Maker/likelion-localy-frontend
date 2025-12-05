import {
  InfoSection,
  DetailLabel,
  DetailValue
} from "@/features/local/styles/LocalDetail.styles";

export default function InfoRow({ label, value, customStyle }) {
  if (!value) return null;

  return (
    <InfoSection style={customStyle}>
      <DetailLabel>{label}</DetailLabel>
      <DetailValue>{value}</DetailValue>
    </InfoSection>
  );
}

