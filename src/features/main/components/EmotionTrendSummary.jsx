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
 * @param {Object} emotionData - 감정 트렌드 데이터
 * @param {string} emotionData.mostEmotion - 가장 많이 느낀 감정
 * @param {number} emotionData.happyPer - 행복지수 변화 퍼센트
 */
const EmotionTrendSummary = ({ onViewMore, emotionData }) => {
  const renderContent = () => {
    if (!emotionData) {
      return "감정 트렌드 데이터를 불러오는 중...";
    }

    const { mostEmotion, happyPer } = emotionData;

    return (
      <>
        이번주 가장 많이 느낀 감정은
        <br />
        '{mostEmotion}'이에요.
        <br />
        지난주 대비 행복지수가 {happyPer}% 올랐어요.
      </>
    );
  };

  return (
    <SummaryContainer>
      <SummaryHeader>
        <SummaryTitle>주간 감정 트렌드 요약</SummaryTitle>
        <ChevronButton onClick={onViewMore} aria-label="더보기">
          <ChevronLeftIcon color="#181818" size={14} rotate={180} />
        </ChevronButton>
      </SummaryHeader>
      <TrendContent>{renderContent()}</TrendContent>
    </SummaryContainer>
  );
};

export default EmotionTrendSummary;
