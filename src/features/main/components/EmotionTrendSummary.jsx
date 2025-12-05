import {
  SummaryContainer,
  SummaryHeader,
  SummaryTitle,
  ChevronButton,
  TrendContent,
} from "../styles/EmotionTrendSummary.styles";
import ChevronLeftIcon from "@/shared/components/icons/ChevronLeftIcon";

/**
 * @component EmotionTrendSummary
 * @description 주간 감정 트렌드 요약 섹션
 * @param {function} onViewMore - 더보기 클릭 핸들러 (대시보드로 이동)
 */
const EmotionTrendSummary = ({ onViewMore }) => {
  return (
    <SummaryContainer>
      <SummaryHeader>
        <SummaryTitle>주간 감정 트렌드 요약</SummaryTitle>
        <ChevronButton onClick={onViewMore} aria-label="더보기">
          <ChevronLeftIcon color="#181818" size={14} rotate={180} />
        </ChevronButton>
      </SummaryHeader>
      <TrendContent>감정 트렌드 데이터가 표시됩니다</TrendContent>
    </SummaryContainer>
  );
};

export default EmotionTrendSummary;
