import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import styled from "styled-components";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  addMonths,
  isSameMonth,
  isToday,
} from "date-fns";
import { colors } from "@/styles/colors";
import { font } from "@/styles/font";
import { useMonthlyArchive } from "@/features/local/hooks/useMonthlyArchive";

const Wrapper = styled.section`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-top: 8px;
`;

const TitleRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Title = styled.h2`
  ${font.semibold16}
  color: ${colors.gray[900]};
  margin: 0;
`;

const MonthNav = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
`;

const NavButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px 6px;
  ${font.regular12}
  color: ${colors.gray[900]};

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`;

const MonthLabel = styled.span`
  ${font.regular12}
  color: ${colors.gray[900]};
  min-width: 80px;
  text-align: center;
`;

const WeekHeader = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0;
  margin-top: 4px;
`;

const WeekHeaderCell = styled.div`
  text-align: center;
  ${font.regular10}
  color: ${colors.gray[600]};
  padding: 4px 0;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  border-top: 1px solid ${colors.gray[300]};
`;

const Cell = styled.button`
  position: relative;
  aspect-ratio: 51 / 68;
  background: ${(p) => p.$bg};
  border: none;
  border-bottom: 1px solid ${colors.gray[300]};
  cursor: ${(p) => (p.$inMonth ? "pointer" : "default")};
  opacity: ${(p) => (p.$inMonth ? 1 : 0.35)};
  padding: 6px;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  transition: filter 0.15s;

  &:hover {
    filter: ${(p) => (p.$inMonth ? "brightness(0.95)" : "none")};
  }
`;

const DayLabel = styled.span`
  ${font.regular10}
  color: ${(p) => (p.$today ? colors.blue[50] : colors.gray[900])};
  font-weight: ${(p) => (p.$today ? 700 : 400)};
`;

const WEEK_LABELS = ["월", "화", "수", "목", "금", "토", "일"];

function intensityBg(level) {
  // 0..4 단계
  switch (level) {
    case 4:
      return colors.blue[40];
    case 3:
      return colors.blue[30];
    case 2:
      return colors.blue[20];
    case 1:
      return colors.blue[10];
    default:
      return colors.gray[100];
  }
}

export default function MissionCalendar() {
  const navigate = useNavigate();
  const [viewMonth, setViewMonth] = useState(() => startOfMonth(new Date()));
  const year = viewMonth.getFullYear();
  const month = viewMonth.getMonth() + 1;

  const { data, isLoading, isError } = useMonthlyArchive(year, month);

  // archives 배열을 date key → entry 맵으로 만든다.
  const archiveByDate = useMemo(() => {
    const map = new Map();
    for (const a of data?.archives ?? []) {
      // a.date 는 백엔드에서 YYYY-MM-DD 문자열로 내려옴.
      map.set(a.date, a);
    }
    return map;
  }, [data]);

  // 한 달의 캘린더 그리드를 만들기 위해 월요일 시작/일요일 끝으로 패딩한 모든 날짜를 생성.
  const cells = useMemo(() => {
    const start = startOfWeek(startOfMonth(viewMonth), { weekStartsOn: 1 });
    const end = endOfWeek(endOfMonth(viewMonth), { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end });
  }, [viewMonth]);

  const handlePrev = () => setViewMonth((m) => addMonths(m, -1));
  const handleNext = () => setViewMonth((m) => addMonths(m, 1));

  const handleCellClick = (date, inMonth) => {
    if (!inMonth) return;
    navigate(`/local/mission/calendar/${format(date, "yyyy-MM-dd")}`);
  };

  return (
    <Wrapper>
      <TitleRow>
        <Title>미션 캘린더</Title>
        <MonthNav>
          <NavButton onClick={handlePrev} aria-label="이전 달">
            &lt;
          </NavButton>
          <MonthLabel>{format(viewMonth, "yyyy년 M월")}</MonthLabel>
          <NavButton onClick={handleNext} aria-label="다음 달">
            &gt;
          </NavButton>
        </MonthNav>
      </TitleRow>

      <WeekHeader>
        {WEEK_LABELS.map((label) => (
          <WeekHeaderCell key={label}>{label}</WeekHeaderCell>
        ))}
      </WeekHeader>

      <Grid>
        {cells.map((date) => {
          const inMonth = isSameMonth(date, viewMonth);
          const key = format(date, "yyyy-MM-dd");
          const archive = archiveByDate.get(key);
          // TODO: 백엔드가 일별 미션 카운트를 노출하면 4단계로 세분화. 현재는 hasPhoto 만 사용.
          let level = 0;
          if (inMonth) {
            if (archive?.hasPhoto) level = 3;
            else if (archive) level = 1;
          }
          return (
            <Cell
              key={key}
              $bg={intensityBg(level)}
              $inMonth={inMonth}
              onClick={() => handleCellClick(date, inMonth)}
              type="button"
              disabled={isLoading || isError}
            >
              <DayLabel $today={isToday(date)}>{date.getDate()}</DayLabel>
            </Cell>
          );
        })}
      </Grid>
    </Wrapper>
  );
}
