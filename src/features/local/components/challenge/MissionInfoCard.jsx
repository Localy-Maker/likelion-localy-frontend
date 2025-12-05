import { formatExpiresAt } from "@/features/local/hooks/useMissions";
import {
  MissionCard,
  MissionCardContent,
  MissionCardTitle,
  MissionCardTime,
  MissionPoint,
  PointValue,
  PointUnit
} from "@/features/local/styles/Challenge.styles";

export default function MissionInfoCard({ missionData }) {
  return (
    <MissionCard>
      <MissionCardContent>
        <MissionCardTitle>{missionData.missionTitle}</MissionCardTitle>
        <MissionCardTime>{formatExpiresAt(missionData.expiresAt)}</MissionCardTime>
      </MissionCardContent>
      <MissionPoint>
        <PointValue>{missionData.points}</PointValue>
        <PointUnit>P</PointUnit>
      </MissionPoint>
    </MissionCard>
  );
}

