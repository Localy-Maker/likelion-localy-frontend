import { useState, useRef, useEffect, useCallback } from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell } from "recharts";
import * as S from "../styles/DashboardPage.styles";
import { useNavigate } from "react-router";
import SidebarModal from "../../onboarding/components/SidebarModal";
import Header from "@/shared/components/Header/Header";
import BellIcon from "@/shared/components/icons/BellIcon";
import { getDailyFeedback, getWeekFeedback, getMonthFeedback } from "../api/dashboardApi";
import { renderEmotionCharacter } from "@/shared/utils/emotionCharacters";
import BottomNavigation from "@/shared/components/bottom/BottomNavigation";

export default function DashboardPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("Daily");

  // 현재 년/월 상태 관리
  const [currentYear, setCurrentYear] = useState(2025);
  const [currentMonth, setCurrentMonth] = useState(11); // 1-12
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [selectedMode, setSelectedMode] = useState("year"); // "year" or "month"
  const dateFieldRef = useRef(null);

  // Daily 피드백 데이터 상태
  const [dailyFeedbackData, setDailyFeedbackData] = useState(null);

  // Week 피드백 데이터 상태
  const [weekFeedbackData, setWeekFeedbackData] = useState(null);

  // Month 피드백 데이터 상태
  const [monthFeedbackData, setMonthFeedbackData] = useState(null);

  // 년도 옵션 생성 (현재 년도 기준 ±5년)
  const yearOptions = [];
  for (let i = currentYear - 5; i <= currentYear + 5; i++) {
    yearOptions.push({
      id: `year-${i}`,
      value: i,
      label: `${i}년`
    });
  }

  // 월 옵션 생성
  const monthOptions = [
    { id: "month-1", value: 1, label: "1월" },
    { id: "month-2", value: 2, label: "2월" },
    { id: "month-3", value: 3, label: "3월" },
    { id: "month-4", value: 4, label: "4월" },
    { id: "month-5", value: 5, label: "5월" },
    { id: "month-6", value: 6, label: "6월" },
    { id: "month-7", value: 7, label: "7월" },
    { id: "month-8", value: 8, label: "8월" },
    { id: "month-9", value: 9, label: "9월" },
    { id: "month-10", value: 10, label: "10월" },
    { id: "month-11", value: 11, label: "11월" },
    { id: "month-12", value: 12, label: "12월" },
  ];

  // API 응답을 차트 데이터 형식으로 변환
  const convertDailyDataToChartFormat = (apiData) => {
    if (!apiData || !apiData.scores) {
      return [];
    }

    return apiData.scores.map((score) => {
      // window: "00-03" -> time: 3 (끝 시간 추출)
      const endTime = parseInt(score.window.split('-')[1]);
      // avgScore를 0-100 범위로 변환 (0~1 값이면 100 곱하기)
      const value = score.avgScore <= 1 ? score.avgScore * 100 : score.avgScore;

      return {
        time: endTime,
        value: Math.round(value),
        emotion: score.emotion
      };
    });
  };

  // Daily 피드백 데이터 가져오기
  const fetchDailyFeedback = useCallback(async (date = null) => {
    if (selectedPeriod !== "Daily") return;

    try {
      const data = await getDailyFeedback(date);
      setDailyFeedbackData(data);
    } catch (error) {
      console.error("Daily 피드백 데이터 가져오기 실패:", error);
      // 에러 발생 시 빈 데이터로 설정
      setDailyFeedbackData(null);
    }
  }, [selectedPeriod]);

  // Daily 피드백 데이터를 차트 형식으로 변환
  const dailyChartData = dailyFeedbackData
    ? convertDailyDataToChartFormat(dailyFeedbackData)
    : []; // 데이터가 없으면 빈 배열

  // API 응답을 Week 차트 데이터 형식으로 변환
  const convertWeekDataToChartFormat = (apiData) => {
    if (!apiData || !apiData.emotions) {
      return [];
    }

    return apiData.emotions.map((emotion) => ({
      day: emotion.day,
      value: emotion.score
    }));
  };

  // Week 피드백 데이터 가져오기
  const fetchWeekFeedback = useCallback(async (date = null) => {
    if (selectedPeriod !== "Week") return;

    try {
      const data = await getWeekFeedback(date);
      setWeekFeedbackData(data);
    } catch (error) {
      console.error("Week 피드백 데이터 가져오기 실패:", error);
      // 에러 발생 시 빈 데이터로 설정
      setWeekFeedbackData(null);
    }
  }, [selectedPeriod]);

  // Week 피드백 데이터를 차트 형식으로 변환
  const weekChartData = weekFeedbackData
    ? convertWeekDataToChartFormat(weekFeedbackData)
    : []; // 데이터가 없으면 빈 배열

  // API 응답을 Month 캘린더 데이터 형식으로 변환
  const convertMonthDataToCalendarFormat = (apiData) => {
    if (!apiData || !apiData.days) {
      return {};
    }

    // days 배열을 { day: emotion } 형식의 객체로 변환
    const calendarMap = {};
    apiData.days.forEach((item) => {
      calendarMap[item.day] = item.emotion;
    });

    return calendarMap;
  };

  // Month 피드백 데이터 가져오기
  const fetchMonthFeedback = useCallback(async (year, month) => {
    if (selectedPeriod !== "Month") return;

    try {
      // yearMonth 형식: "202511" (YYYYMM)
      const yearMonth = `${year}${String(month).padStart(2, '0')}`;
      const data = await getMonthFeedback(yearMonth);
      setMonthFeedbackData(data);
    } catch (error) {
      console.error("Month 피드백 데이터 가져오기 실패:", error);
      // 에러 발생 시 빈 데이터로 설정
      setMonthFeedbackData(null);
    }
  }, [selectedPeriod]);

  // selectedPeriod 변경 시 해당 API 호출
  useEffect(() => {
    if (selectedPeriod === "Daily") {
      fetchDailyFeedback();
    } else if (selectedPeriod === "Week") {
      fetchWeekFeedback();
    } else if (selectedPeriod === "Month") {
      fetchMonthFeedback(currentYear, currentMonth);
    }
  }, [selectedPeriod, currentYear, currentMonth, fetchDailyFeedback, fetchWeekFeedback, fetchMonthFeedback]);

  // Month 피드백 데이터를 캘린더 형식으로 변환
  const monthCalendarDataMap = monthFeedbackData
    ? convertMonthDataToCalendarFormat(monthFeedbackData)
    : {}; // 데이터가 없으면 빈 객체
  // 년/월 변경 함수 (현재 사용되지 않음, 추후 필요시 사용)
  // const handlePrevMonth = () => {
  //   if (currentMonth === 1) {
  //     setCurrentYear(currentYear - 1);
  //     setCurrentMonth(12);
  //   } else {
  //     setCurrentMonth(currentMonth - 1);
  //   }
  // };

  // const handleNextMonth = () => {
  //   if (currentMonth === 12) {
  //     setCurrentYear(currentYear + 1);
  //     setCurrentMonth(1);
  //   } else {
  //     setCurrentMonth(currentMonth + 1);
  //   }
  // };

  // 년도/월 통합 옵션 생성
  const getDateOptions = () => {
    if (selectedMode === "year") {
      const yearOptions = [];
      for (let i = currentYear - 5; i <= currentYear + 5; i++) {
        yearOptions.push({
          id: `year-${i}`,
          value: i,
          label: `${i}년`
        });
      }
      return yearOptions;
    } else {
      return monthOptions;
    }
  };

  const handleDateSelect = (option) => {
    if (selectedMode === "year") {
      setCurrentYear(option.value);
      setSelectedMode("month");
      // 모달은 닫지 않고 월 선택 모드로 전환
    } else {
      setCurrentMonth(option.value);
      setIsDateModalOpen(false);
      setSelectedMode("year"); // 다음 열 때는 년도부터
    }
  };

  const handleDateFieldClick = () => {
    setSelectedMode("year");
    setIsDateModalOpen(true);
  };

  // 해당 월의 첫 번째 날의 요일 계산 (0=일요일, 1=월요일, ...)
  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month - 1, 1).getDay();
  };

  // 해당 월의 총 일수 계산
  const getDaysInMonth = (year, month) => {
    return new Date(year, month, 0).getDate();
  };

  // 캘린더 렌더링을 위한 데이터 생성
  const generateCalendarData = () => {
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const calendarDays = [];

    // 첫 주의 빈 칸 추가 (요일이 월요일부터 시작하므로 일요일이면 6칸, 월요일이면 0칸)
    // 한국 캘린더는 월요일부터 시작하므로 일요일(0)이면 6칸, 월요일(1)이면 0칸, ... 토요일(6)이면 5칸
    const startOffset = firstDay === 0 ? 6 : firstDay - 1;
    for (let i = 0; i < startOffset; i++) {
      calendarDays.push(null); // 빈 칸
    }

    // 실제 날짜 추가
    for (let day = 1; day <= daysInMonth; day++) {
      calendarDays.push({
        day,
        value: monthCalendarDataMap[day] || null, // 데이터가 없으면 null
      });
    }

    return calendarDays;
  };

  // 감정 구간에 따른 캐릭터와 감정 단어 결정 함수
  const getEmotionByValue = (value) => {
    if (value === null || value === undefined) {
      return null;
    }
    if (value >= 0 && value <= 16) {
      return { character: "depression", emotion: "무기력함", message: "더 이상 무기력하지 않도록, Localy가 도와드릴게요." };
    } else if (value >= 17 && value <= 33) {
      // 분노와 슬픔 중 가까운 것 선택
      const midPoint = 25; // 17~33의 중간값
      if (value <= midPoint) {
        return { character: "anger", emotion: "분노함", message: "분노를 가라앉히도록, Localy가 도와드릴게요." };
      } else {
        return { character: "sadness", emotion: "슬픔", message: "슬픔을 이겨내도록, Localy가 도와드릴게요." };
      }
    } else if (value >= 34 && value <= 50) {
      // 불안과 중립 중 가까운 것 선택
      const midPoint = 42; // 34~50의 중간값
      if (value <= midPoint) {
        return { character: "anxiety", emotion: "불안함", message: "불안을 해소하도록, Localy가 도와드릴게요." };
      } else {
        return { character: "neutral", emotion: "중립", message: "균형잡힌 하루를 보내도록, Localy가 도와드릴게요." };
      }
    } else if (value >= 51 && value <= 66) {
      return { character: "happiness", emotion: "행복함", message: "행복한 하루를 계속하도록, Localy가 도와드릴게요." };
    } else if (value >= 67 && value <= 83) {
      return { character: "happiness", emotion: "행복함", message: "행복한 하루를 계속하도록, Localy가 도와드릴게요." };
    } else if (value >= 84 && value <= 100) {
      return { character: "happiness", emotion: "행복함", message: "행복한 하루를 계속하도록, Localy가 도와드릴게요." };
    }
    return { character: "neutral", emotion: "중립", message: "균형잡힌 하루를 보내도록, Localy가 도와드릴게요." };
  };

  // 캘린더 데이터를 기반으로 감정별 횟수 계산
  const calculateEmotionCounts = () => {
    const counts = {
      happiness: 0,
      sadness: 0,
      anger: 0,
      depression: 0,
      neutral: 0,
      anxiety: 0,
    };

    const calendarData = generateCalendarData();
    calendarData.forEach((entry) => {
      if (entry !== null) {
        const emotion = getEmotionByValue(entry.value);
        if (emotion && counts[emotion.character] !== undefined) {
          counts[emotion.character]++;
        }
      }
    });

    // CSS 스펙 순서대로 반환: 행복, 슬픔, 분노, 우울, 중립, 불안
    return [
      { emotion: "happiness", count: counts.happiness },
      { emotion: "sadness", count: counts.sadness },
      { emotion: "anger", count: counts.anger },
      { emotion: "depression", count: counts.depression },
      { emotion: "neutral", count: counts.neutral },
      { emotion: "anxiety", count: counts.anxiety },
    ];
  };

  const monthEmotionCounts = calculateEmotionCounts();

  // 오늘 가장 많이 느낀 감정 계산 (Daily 데이터의 평균값 사용)
  const todayAverageValue = dailyChartData.length > 0 
    ? dailyChartData.reduce((sum, item) => sum + item.value, 0) / dailyChartData.length 
    : null;
  const todayEmotion = getEmotionByValue(todayAverageValue);

  // Badge를 포함한 알림 아이콘 래퍼
  const NotificationIconWithBadge = () => (
    <div style={{ position: 'relative', display: 'inline-block', width: '24px', height: '24px' }}>
      <BellIcon color="black" size={20} />
      <S.Badge style={{ left: '12px', top: '-2px' }}>5</S.Badge>
    </div>
  );

  const navigate = useNavigate();
  const handleleftClick = () => {
    navigate(-1);
  };

  return (
    <><Header
      text="Localy"
      rightIcon={<NotificationIconWithBadge />}
      onRightClick={() => {
        // 알림 클릭 핸들러 (필요시 추가)

      }}
      onLeftClick={handleleftClick}
    />
      <S.Container>
        {/* 헤더 */}
        <div style={{ position: 'absolute', width: '375px', height: '56px', left: '0px', top: '44px' }}>

        </div>

        {/* 필터 Pills */}
        <S.PillsContainer>
          <S.Pill
            $isActive={selectedPeriod === "Daily"}
            onClick={() => setSelectedPeriod("Daily")}
          >
            Daily
          </S.Pill>
          <S.Pill
            $isActive={selectedPeriod === "Week"}
            onClick={() => setSelectedPeriod("Week")}
          >
            Week
          </S.Pill>
          <S.Pill
            $isActive={selectedPeriod === "Month"}
            onClick={() => setSelectedPeriod("Month")}
          >
            Month
          </S.Pill>
        </S.PillsContainer>

        {/* 차트 섹션 */}
        {selectedPeriod === "Month" ? (
          <S.MonthChartSection>
            <S.MonthChartTitle>월별 감정 캘린더</S.MonthChartTitle>
            {/* 년도/월 선택 필드 - 하나로 통합 */}
            <S.MonthDateHeader ref={dateFieldRef} onClick={handleDateFieldClick} style={{ cursor: 'pointer' }}>
              {currentYear}년 {currentMonth}월
              <S.MonthChevronIcon>
                <svg width="4" height="7" viewBox="0 0 4 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 4L0 6L2 8" stroke="#0D0D0D" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </S.MonthChevronIcon>
            </S.MonthDateHeader>

            {/* 그리드 라인 */}
            <S.MonthCalendarGridLine $top={111} />
            <S.MonthCalendarGridLine $top={147} />
            <S.MonthCalendarGridLine $top={183} />
            <S.MonthCalendarGridLine $top={219} />
            <S.MonthCalendarGridLine $top={255} />
            <S.MonthCalendarGridLine $top={291} $isLast={true} />

            {/* Y축 라벨 (날짜) - 동적으로 생성 */}
            {generateCalendarData().map((entry, index) => {
              // 빈 칸이면 날짜 레이블도 표시하지 않음
              if (entry === null) {
                return null;
              }

              // index를 기반으로 위치 계산
              const row = Math.floor(index / 7);
              const col = index % 7;

              // CSS 스펙에 따른 정확한 위치 계산
              // X축 라벨 기준: 월(28), 화(74), 수(120), 목(166), 금(212), 토(258), 일(304)
              // 첫 번째 열(월요일): left: 28px, 이후 46px 간격
              const left = 28 + (col * 46);
              // 첫 번째 그리드 라인: top: 111px, 이후 36px 간격
              const top = 111 + (row * 36);

              return (
                <S.MonthCalendarYAxis key={`date-label-${entry.day}`} $left={left} $top={top}>
                  {entry.day}
                </S.MonthCalendarYAxis>
              );
            })}

            {/* X축 라벨 (요일) */}
            <S.MonthCalendarDayLabel $left={28}>월</S.MonthCalendarDayLabel>
            <S.MonthCalendarDayLabel $left={74}>화</S.MonthCalendarDayLabel>
            <S.MonthCalendarDayLabel $left={120}>수</S.MonthCalendarDayLabel>
            <S.MonthCalendarDayLabel $left={166}>목</S.MonthCalendarDayLabel>
            <S.MonthCalendarDayLabel $left={212}>금</S.MonthCalendarDayLabel>
            <S.MonthCalendarDayLabel $left={258}>토</S.MonthCalendarDayLabel>
            <S.MonthCalendarDayLabel $left={304}>일</S.MonthCalendarDayLabel>

            {/* 캘린더 캐릭터들 */}
            {generateCalendarData().map((entry, index) => {
              // 빈 칸이면 렌더링하지 않음
              if (entry === null) {
                return null;
              }

              const emotion = getEmotionByValue(entry.value);
              
              // emotion이 null이면 렌더링하지 않음
              if (!emotion) {
                return null;
              }

              // generateCalendarData()가 이미 올바른 순서로 배열을 반환하므로
              // index를 그대로 사용하여 위치 계산
              // index는 빈 칸(null)을 포함한 전체 배열의 위치
              const row = Math.floor(index / 7);
              const col = index % 7;

              // CSS 스펙에 따른 정확한 위치 계산
              // X축 라벨 기준: 월(28), 화(74), 수(120), 목(166), 금(212), 토(258), 일(304)
              // 첫 번째 열(월요일): left: 28px, 이후 46px 간격
              // 캐릭터를 날짜 숫자와 같은 left 위치에 배치
              const left = 28 + (col * 46);
              // 첫 번째 그리드 라인: top: 111px, 이후 36px 간격
              // 날짜 레이블이 111px에서 시작하고 높이가 22px이므로, 캐릭터는 그 바로 아래에 배치
              // 날짜 레이블 끝(133px) + 여유공간(2px) = 135px부터 시작
              const top = 135 + (row * 36);

              // 캐릭터별 크기 조정 (작은 크기로)
              const getCharacterSize = (char) => {
                switch (char) {
                  case "happiness": return { width: 14.13, height: 12.06 };
                  case "sadness": return { width: 9.32, height: 14.02 };
                  case "anxiety": return { width: 16.17, height: 9.51 };
                  case "anger": return { width: 15.06, height: 13.4 };
                  case "depression": return { width: 12.76, height: 11.32 };
                  case "neutral": return { width: 12.44, height: 11.03 };
                  default: return { width: 14.13, height: 12.06 };
                }
              };
              const size = getCharacterSize(emotion.character);

              // 작은 캐릭터 렌더링 함수
              const renderSmallCharacter = (character, width, height) => {
                switch (character) {
                  case "depression":
                    return (
                      <svg width={width} height={height} viewBox="0 0 21 19" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
                        <path d="M1.89052 14.2145C1.68248 10.9243 1.81979 9.47108 2.44132 7.61845C3.564 4.27204 4.52435 3.95376 4.99141 3.4503C5.76809 2.61308 6.80867 2.35807 8.93592 1.99295C12.0721 1.45466 12.8773 2.18123 13.5389 2.4933C14.1832 2.79722 14.8516 4.04738 16.2065 6.197C16.8717 7.2523 17.111 8.07302 17.3544 9.28592C17.3898 9.87468 17.4241 10.2949 17.4761 11.0694C17.4938 11.7065 17.4938 12.8393 17.4938 14.0064" stroke="#E0D0FF" strokeWidth="3.6" strokeLinecap="round" />
                        <path d="M1.89042 14.8387C2.23578 15.4607 2.72052 16.0848 3.42943 16.3636C4.83587 16.9167 5.63105 15.985 6.2401 15.6547C6.75848 15.3736 6.95212 14.9094 7.10763 14.7528C7.43525 14.423 7.91952 15.6334 8.63207 16.1374C9.17899 16.5242 10.4473 16.399 11.423 16.0885C12.1312 15.8631 12.3613 15.0841 12.638 14.6488C12.9422 14.1701 13.6074 15.3567 14.1801 15.7561C15.1473 16.4308 17.0048 15.7083 17.5785 15.3426C17.7049 15.262 17.8037 15.1528 17.8911 15.0311C18.9736 13.5233 18.0492 9.91842 17.9795 9.22408C17.9104 8.53551 17.6331 8.01066 17.4599 7.42086C17.2363 6.65964 16.9403 6.13827 16.5762 5.58279C16.2277 5.0511 15.7961 4.57794 15.4148 4.12597C15.0337 3.67409 14.4791 3.39834 13.8727 2.99889C13.3342 2.6442 12.5402 2.56408 11.7413 2.47774C11.0564 2.40373 10.4223 2.56304 9.97292 2.85638C8.93337 3.53498 8.58527 4.25963 7.96062 4.76414C7.2079 5.37208 6.2635 6.44409 5.36111 7.22478C4.4238 8.03567 3.7649 9.45865 3.22711 11.1916C2.98489 11.9722 2.93064 12.8914 3.06795 13.7579C3.15629 14.3154 4.3807 14.2145 5.38555 14.163C6.28059 14.1172 6.67335 13.0058 7.14144 12.2589C7.98881 10.9069 8.16294 9.47321 8.46044 8.28892C8.68949 7.37713 9.06585 6.24749 9.37791 4.94826C9.49951 4.44202 9.48401 4.23259 9.26089 4.58991C8.49386 5.81823 7.61682 7.58417 6.78517 8.83139C6.08359 9.88353 5.84533 10.6403 5.6014 11.213C5.45616 11.5539 5.25449 11.9583 5.15046 12.1164C4.53242 13.0558 5.76835 9.47529 6.4653 8.52974C6.56886 8.38923 6.742 8.35602 6.84706 8.3893C7.45234 8.58107 7.50552 10.7683 7.86908 12.7452C7.98797 13.3917 8.12965 13.2804 8.42299 12.7639C9.23181 11.3399 9.82936 10.1598 10.0717 10.0365C10.5103 9.81346 10.3162 11.6067 10.4707 12.1325C10.5408 12.3712 10.9341 10.8047 11.0932 11.1651C11.2524 11.5256 11.2524 13.4136 11.2352 13.2705C10.9523 10.9126 11.1827 8.35705 11.269 8.06163C11.31 7.9215 11.5634 9.00615 11.7366 10.0126C11.7628 10.1649 11.9795 8.33625 12.1699 6.11487C12.189 5.89095 12.4309 7.75165 12.5001 9.84873C12.5297 10.7465 12.6047 8.5859 12.6218 5.3243C12.6269 4.36248 12.6733 4.80887 12.6052 6.51483C12.5371 8.22079 12.3654 11.1729 12.4315 12.2303C12.5127 13.53 13.7115 10.0609 14.1962 9.20899C14.4399 8.78065 14.8911 11.7014 15.2031 13.786C15.4586 15.4922 15.5173 10.579 15.5173 9.86746C15.5173 8.98501 15.9334 12.6511 15.9334 12.6043C15.9334 9.60765 15.7253 8.15006 15.639 7.45571C15.6174 7.28192 15.6213 7.10984 15.5698 7.07291C15.1767 6.79098 14.0006 8.44963 12.7992 9.71974C11.7156 10.8652 11.2233 12.0571 10.6126 13.1535C10.3673 13.5941 10.1435 14.0044 10.0395 14.059C9.90188 14.1313 10.0041 13.3927 9.90114 13.2476C9.71405 12.984 9.31134 13.762 9.20731 13.9363C8.93964 14.3846 8.99927 12.933 8.8266 12.6906C8.74081 12.5702 8.58527 12.5169 8.46304 12.533C8.34081 12.5491 8.23783 12.6521 8.30493 12.688C8.37202 12.7239 8.61231 12.6896 8.78759 12.6032C8.96287 12.5169 9.06585 12.3796 9.48401 12.2381" stroke="#E0D0FF" strokeWidth="3.6" strokeLinecap="round" />
                        <path d="M6.28431 6.99438C6.07556 7.33707 5.92684 7.66453 5.79201 7.97137C5.68413 8.21688 5.59805 8.45651 5.52301 8.69572C5.44581 8.94184 5.41886 9.21803 5.33644 9.45724C5.25232 9.70136 5.15009 9.93476 5.07506 10.174C5.00221 10.4062 5.00047 10.6515 4.94806 10.8907C4.89349 11.1398 4.89565 11.4426 4.82129 12.0074C4.58504 13.8021 4.85086 14.0559 4.90282 14.2952C5.00003 14.5344 5.08917 14.7135 5.19354 14.8327C5.23879 14.8927 5.26835 14.9519 5.3884 15.0128" stroke="#E0D0FF" strokeWidth="3.6" strokeLinecap="round" />
                        <path d="M7.64989 10.5891C8.13044 10.8808 8.5928 10.9259 8.99522 10.8478C9.09368 10.8141 9.19964 10.7696 9.28954 10.7356C9.37944 10.7016 9.45008 10.6794 9.62989 10.5217" stroke="#0D0D0D" strokeWidth="0.9" strokeLinecap="round" />
                        <path d="M12.2885 10.4175C12.7691 10.7092 13.2314 10.7543 13.6339 10.6762C13.7323 10.6425 13.8383 10.598 13.9282 10.564C14.0181 10.53 14.0887 10.5077 14.2685 10.3501" stroke="#0D0D0D" strokeWidth="0.9" strokeLinecap="round" />
                        <path d="M9.49296 13.6356C9.63877 13.5812 9.96834 13.4343 10.3078 13.3242C10.5983 13.23 10.9037 13.2142 12.2479 13.2136C12.6094 13.2681 12.775 13.3237 12.9488 13.3603C13.0319 13.3787 13.1045 13.3968 13.3444 13.4706" stroke="#0D0D0D" strokeWidth="0.9" strokeLinecap="round" />
                      </svg>
                    );
                  case "anger":
                    return (
                      <svg width={width} height={height} viewBox="0 0 23 21" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
                        <path d="M5.29393 18.1285C3.92214 15.5335 1.43631 9.54392 1.54224 6.81562C1.56224 6.30072 2.08288 6.33287 2.44876 6.58517C4.1881 7.78455 4.12747 9.74926 5.03508 11.4596C5.73388 12.7765 6.09342 13.8996 6.20373 15.61C6.22984 16.0148 6.31185 16.3024 6.34899 15.8743C6.62586 12.6821 6.60456 11.2172 6.78586 8.82198C7.14942 4.01901 7.32978 2.69807 7.98509 1.67577C8.12764 1.45338 8.49186 1.52723 8.67644 1.70744C11.197 4.16829 8.86321 11.4924 8.71686 13.6418C8.55381 16.0364 8.27999 16.8878 8.17077 17.1805C7.49401 18.9942 10.0952 12.0909 10.6435 10.4537C11.3831 8.24533 12.8606 6.48578 14.0271 5.60767C14.3189 5.38801 14.6081 5.10089 14.8288 5.09652C15.0494 5.09215 15.1936 5.38049 15.2678 5.74529C15.6033 7.3929 14.2543 9.30801 13.3794 10.552C12.5066 11.7931 11.4888 12.9516 10.3224 14.3736C9.2907 15.6313 8.64477 16.4509 8.64259 16.6716C8.61663 19.2974 14.0184 12.8205 15.5562 11.6158C16.7217 10.7027 17.6685 10.1206 18.1425 10.0824C18.2973 10.0699 18.1119 10.5487 17.8935 10.8425C17.0238 12.0123 15.1324 12.5889 13.0561 14.118C11.4452 15.3044 9.88988 16.8092 9.29681 17.6906C7.94747 19.696 13.6558 16.3111 15.554 15.5466C17.6776 14.6913 19.997 14.4151 20.8336 14.5593C21.1904 14.6207 21.3098 14.9918 21.312 15.3566C21.3169 16.1664 20.589 16.8878 19.8255 17.4328C18.7452 18.204 17.2425 18.4169 15.8205 18.7467C14.5448 18.856 8.91127 19.0023 5.87935 18.2771C5.66091 18.1285 5.37257 18.1285 5.07549 18.1285" stroke="#FF6868" strokeWidth="3.078" strokeLinecap="round" />
                        <path d="M18.2934 16.3914L13.8951 17.271" stroke="#FF6868" strokeWidth="2.3085" strokeLinecap="round" />
                        <path d="M1.20564 7.53052C1.20564 7.66949 1.23076 7.94783 1.24999 8.46146C1.26078 8.74973 1.30691 9.00175 1.33243 9.4579C1.35053 9.78162 1.42114 10.1059 1.50357 10.3409C1.57558 10.5461 1.61152 10.7784 1.66235 10.9946C1.71383 11.2137 1.8019 11.4386 1.87805 11.6798C1.95236 11.9152 2.00522 12.1239 2.07471 12.3273C2.14302 12.5272 2.18265 12.7332 2.26508 12.9365C2.34586 13.1357 2.38598 13.3424 2.42386 13.5457C2.46287 13.7551 2.56341 13.9767 2.62052 14.193C2.67656 14.4052 2.75378 14.5989 2.83622 14.8022C2.91699 15.0014 2.98224 15.2081 3.03935 15.4114C3.12197 15.6147 3.17261 15.7796 3.22325 15.8999C3.24877 15.9574 3.2739 16.0076 3.29979 16.0594" stroke="#FF6868" strokeWidth="2.3085" strokeLinecap="round" />
                        <path d="M1.49436 6.97705C1.47954 7.39579 1.44943 8.37614 1.50155 9.03525C1.52252 9.30048 1.6588 9.52182 1.6889 9.80645C1.72183 10.1178 1.80886 10.4051 1.89086 10.7349C1.96076 11.016 2.00296 11.3486 2.07821 11.6858C2.1433 11.9774 2.1683 12.2176 2.25029 12.4575C2.34605 12.7377 2.42259 13.1009 2.4974 13.3709C2.5874 13.6958 2.70654 14.0435 2.7672 14.4191C2.81033 14.6862 2.91681 14.9133 2.96938 15.1532C3.02814 15.4214 3.14146 15.7813 3.21626 16.0965C3.2891 16.4034 3.44068 16.6502 3.55323 16.9054C3.6556 17.1376 3.75518 17.3844 3.88256 17.6243C4.01713 17.8778 4.21885 18.1032 4.41407 18.373C4.5697 18.5881 4.80293 18.7179 5.04285 18.8751C5.26457 19.0205 5.55144 19.0773 5.82147 19.1227C6.14075 19.1763 6.40509 19.2274 6.67512 19.3172C6.97532 19.4171 7.3477 19.3774 8.33097 19.4147C9.0433 19.4417 10.393 19.4224 11.1177 19.4149C12.1414 19.4045 12.6502 19.3478 13.2783 19.3251C13.5946 19.2727 13.8929 19.2426 14.3346 19.2054C14.477 19.1977 14.6549 19.1977 14.973 19.1528" stroke="#FF6868" strokeWidth="2.3085" strokeLinecap="round" />
                        <path d="M1.51045 9.62451C1.47238 10.0399 1.52264 10.8543 1.61802 11.1022C1.69743 11.3086 1.76404 11.5146 1.84647 11.7179C1.92725 11.9171 1.99249 12.1238 2.0496 12.3271C2.06433 12.3795 2.09377 12.4284 2.10671 12.3915C2.21994 12.0684 2.05646 11.8466 1.99934 11.6117C1.94331 11.3812 1.86608 11.1361 1.81525 10.8504C1.76039 10.542 1.72672 10.1842 1.66923 10.0559C1.52905 9.74307 1.73891 10.5505 1.73891 10.5827C1.73891 10.8425 1.68827 10.1454 1.65666 10.0944C1.42831 9.72569 1.61173 11.2861 1.65628 11.4957C1.70532 11.7265 1.72596 11.9334 1.77679 12.1367C1.82762 12.3401 1.85313 12.5677 1.91634 12.7966C1.98812 13.0565 2.03056 13.2912 2.113 13.5075C2.18715 13.702 2.208 13.9133 2.24017 14.1483C2.27094 14.3729 2.3603 14.6238 2.43036 14.878C2.49821 15.1241 2.56362 15.3221 2.67766 15.5255C2.7839 15.7149 2.85528 15.9313 2.95066 16.1663C3.03545 16.3751 3.15988 16.5786 3.29315 16.8135C3.41257 17.0241 3.56577 17.251 3.71826 17.442C3.88794 17.6545 4.11101 17.8602 4.36497 18.0259C4.78456 18.2995 5.20149 18.4824 5.7791 18.6353C6.0092 18.6962 6.55736 18.6865 7.31792 18.6739C7.8285 18.6655 8.08419 18.5852 8.20451 18.522C8.31226 18.4337 8.40174 18.3316 8.47142 18.2303C8.5034 18.1793 8.52853 18.1291 8.55442 18.0773" stroke="#FF6868" strokeWidth="2.3085" strokeLinecap="round" />
                        <path d="M7.48147 13.1545L7.49933 13.3074" stroke="#0D0D0D" strokeWidth="1.125" strokeLinecap="round" />
                        <path d="M10.5594 12.6929L10.5773 12.8457" stroke="#0D0D0D" strokeWidth="1.125" strokeLinecap="round" />
                        <path d="M5.48064 11.1538L7.50448 11.5386" stroke="#0D0D0D" strokeWidth="0.9" strokeLinecap="round" />
                        <path d="M10.2518 14.8595C9.38773 14.8139 8.56652 14.9042 8.15454 15.0187C7.72769 15.1374 7.42503 15.6935 7.27151 16.0142C7.09298 16.3872 7.19463 16.7898 7.29318 16.9645C7.42933 17.2059 8.31376 17.1406 8.85166 17.0649C9.16979 17.0201 9.41419 16.9736 9.89163 16.8824C10.9772 16.6749 11.3906 16.6853 11.6123 16.4951C11.9373 16.2162 11.5612 15.2582 11.3399 14.9665C11.2866 14.9357 11.2263 14.9206 11.105 14.9129C10.9836 14.9051 10.8029 14.9051 10.4799 14.8595" stroke="#0D0D0D" strokeWidth="0.9" strokeLinecap="round" />
                        <path d="M9.94373 11.2009L11.1931 10.5381" stroke="#0D0D0D" strokeWidth="0.9" strokeLinecap="round" />
                      </svg>
                    );
                  case "sadness":
                    return (
                      <svg width={width} height={height} viewBox="0 0 19 25" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
                        <path d="M8.16696 2.87451C7.90412 3.84827 6.85595 5.94621 6.20202 7.09493C5.91243 7.60364 5.68743 8.04415 5.26587 8.70401C4.90213 9.27335 4.606 10.074 4.28894 10.802C3.98021 11.5108 3.86658 12.2654 3.60256 12.9003C3.41946 13.3406 3.23324 14.0846 2.98228 14.9448C2.82188 15.4946 2.86274 16.8238 2.95457 17.7691C3.01756 18.4175 3.41533 18.917 3.86381 19.734C4.16451 20.2818 4.86409 20.6587 5.46022 21.0027C5.97224 21.2981 6.55511 21.3997 7.90927 21.5311C9.87172 21.7216 10.4074 21.4789 10.9358 21.4001C11.4435 21.3244 11.8593 21.1891 12.387 20.9916C13.0683 20.7365 13.3904 20.2138 13.7732 19.8049C14.1975 19.3516 14.2882 18.7365 14.4734 18.3138C14.6461 17.9198 14.7109 17.3653 14.7509 16.8887C14.7935 16.381 14.9485 15.8073 14.9623 12.7958C14.9673 11.712 14.7125 11.2948 14.4485 10.6749C14.2339 10.1711 13.9478 9.52775 13.6307 8.90668C13.3452 8.34749 13.05 7.89057 12.7599 7.4021C12.4951 6.95643 12.0747 6.46713 11.7046 5.95056C11.328 5.42498 10.9663 5.04053 10.5962 4.67043C10.1208 4.19502 9.69964 3.87836 9.35566 3.5225C9.19367 3.35492 9.0386 3.19197 8.85453 3.07322C8.75946 3.01189 8.61821 3.03285 8.53786 3.09816C8.13999 3.42155 8.3253 5.2622 8.25959 6.38203C8.19922 7.41076 8.00863 8.83424 7.91679 9.53527C7.81984 10.2753 7.69195 10.8419 7.36341 12.7891C7.20805 13.7098 7.0602 14.8225 6.83497 16.1438C6.78963 16.4097 6.76886 16.5673 7.17341 16.0341C7.57795 15.5009 8.41396 14.2731 9.07976 13.1833C9.74556 12.0936 10.2158 11.1792 10.5234 10.7996C10.8309 10.42 10.9616 10.6028 11.055 10.8407C11.2542 11.3481 11.2806 12.3936 11.2941 13.7501C11.316 15.956 10.5159 17.1761 10.4763 17.2565C10.1253 17.9689 11.1452 15.3624 11.8459 14.9349C11.973 14.8573 12.0968 14.908 12.216 14.9864C12.5026 15.1749 12.6526 15.4875 12.7318 15.8026C12.7835 16.0085 12.7587 16.3267 12.7195 16.5273C12.6615 16.8246 11.4239 16.8872 10.3334 17.1235C9.71692 17.2571 9.33072 17.9401 9.11697 18.3636C9.14231 18.4436 9.2468 18.4958 9.35289 18.562C9.45897 18.6281 9.56347 18.7064 9.67114 18.7872" stroke="#C8E1FF" strokeWidth="5.7475" strokeLinecap="round" />
                        <path d="M13.6746 10.218C13.7843 10.7679 13.9601 11.1632 14.1805 11.4838C14.393 11.7927 14.555 12.1771 14.7754 12.541C14.9978 12.908 15.0838 13.3008 15.1836 13.6864C15.2523 13.9519 15.2166 14.205 15.2497 14.8715C15.3901 17.7051 15.019 18.0597 14.9198 18.4127C14.8144 18.7879 14.5788 19.1172 14.4023 19.4702C14.2297 19.8154 13.9839 20.1087 13.7308 20.385C13.389 20.5727 13.1247 20.6831 12.9052 20.7161C12.773 20.7274 12.5985 20.7274 12.4187 20.7274" stroke="#C8E1FF" strokeWidth="5.7475" strokeLinecap="round" />
                        <path d="M12.3526 7.83838C12.5945 8.05782 12.8576 8.54032 13.1448 9.02646C13.3859 9.43465 13.4974 9.79748 13.7287 10.0956C13.9616 10.3957 14.0261 10.7889 14.1369 11.1419C14.2496 11.5014 14.4888 11.8465 14.7202 12.1446C14.9592 12.4526 15.0401 12.8379 15.1723 13.1909C15.3046 13.5443 15.3045 13.9616 15.316 15.9164C15.3204 16.657 15.0414 17.0456 14.821 17.421C14.636 17.7361 14.3157 18.1032 13.9951 18.435C13.8305 18.4799 13.6097 18.5235 13.346 18.6005C13.2132 18.6339 13.0823 18.6557 12.9475 18.6782" stroke="#C8E1FF" strokeWidth="5.7475" strokeLinecap="round" />
                        <path d="M10.5292 8.38184L10.8142 8.47545" stroke="#0D0D0D" strokeWidth="1.25" strokeLinecap="round" />
                        <path d="M7.04643 8.97534L7.33145 8.88173" stroke="#0D0D0D" strokeWidth="1.25" strokeLinecap="round" />
                        <path d="M7.36467 12.4374C7.59384 12.3749 8.0244 12.2073 8.59685 11.9865C9.05472 11.8698 9.51905 11.7647 10.0855 11.6386C10.3915 11.5854 10.7353 11.5542 11.0895 11.522" stroke="#0D0D0D" strokeLinecap="round" />
                      </svg>
                    );
                  case "anxiety":
                    return (
                      <svg width={width} height={height} viewBox="0 0 25 17" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
                        <path d="M6.51287 4.97408C5.92107 4.94594 4.55499 5.05765 3.9001 5.45587C3.36039 5.78405 2.59541 6.56186 2.07994 7.13234C1.64368 7.61515 1.71028 8.29632 1.68043 9.81461C1.66583 10.5578 1.99168 10.9978 2.26242 11.4531C2.53738 11.9156 3.09853 12.2769 4.05061 12.7608C5.0324 13.2598 6.56745 12.8482 7.17757 12.6214C8.39706 12.168 8.9261 11.8829 9.32561 11.5273C9.82274 11.0849 9.98008 10.2354 10.2214 9.08809C10.5147 7.69345 10.2368 6.65225 10.166 6.42543C9.95046 5.73473 9.01649 5.20261 8.47629 5.11648C7.92378 5.0284 7.48157 4.9178 5.68146 4.93101C5.16349 4.93482 4.86624 5.28533 4.48336 5.58293C3.71287 6.18182 3.78413 8.17353 4.12351 9.90074C4.2291 10.4381 4.57887 10.7147 4.86198 10.8852C5.54581 11.2972 6.33891 10.3207 6.97931 9.79458C7.50946 9.35903 7.70584 8.69967 7.84782 8.31679C7.97471 7.97462 7.96252 7.39414 7.75147 7.20525C6.85615 6.40398 6.51458 9.51744 6.16026 9.6931C4.95682 10.2897 5.54672 7.50244 5.50409 7.80004C5.48959 7.95694 5.48959 8.12578 5.51773 8.26904C5.54587 8.4123 5.60215 8.52486 5.66014 8.64083" stroke="#AFECB2" strokeWidth="3.36" strokeLinecap="round" />
                        <path d="M15.3677 4.39948C14.3256 4.39948 11.4826 4.51204 10.467 4.78193C9.76454 4.9686 9.71235 6.24138 9.58359 7.23737C9.46418 8.16098 9.65351 9.02981 9.82363 9.49839C10.0415 10.0984 10.6759 10.5085 11.1023 10.7374C11.5965 11.0028 12.0966 11.1361 12.9459 11.2068C14.3498 11.3238 15.6482 10.8837 16.2588 10.2454C17.0047 9.46563 16.8736 8.55399 16.9167 7.95452C16.9698 7.21453 16.8753 6.25161 16.6617 5.6095C16.5023 5.13049 16.0243 4.68599 15.4696 4.34362C14.764 3.90811 14.0357 3.94582 13.267 3.87377C12.025 3.75735 10.1404 3.9714 9.74092 4.31292C9.35837 4.63994 9.17172 5.19251 8.83148 5.98812C8.53743 6.67569 8.48953 7.38063 8.48868 8.77143C8.48816 9.61682 8.82892 10.1674 9.07067 10.6227C9.33355 11.1179 9.73793 11.4755 10.2351 11.7888C10.6505 12.0507 11.2711 12.0451 13.6528 12.0319C14.657 12.0263 15.1374 11.5641 15.6218 11.2367C16.0406 10.9535 16.6144 10.5136 17.0719 9.9303C17.5204 9.35839 17.5831 8.41244 17.6278 7.50086C17.6638 6.76936 16.6792 6.33518 15.9117 6.00645C15.0701 5.64598 13.6699 5.76385 12.4061 5.84827C11.636 5.89971 11.3325 6.44433 11.0916 6.88306C10.4591 8.03516 10.5924 8.91555 10.6909 9.38498C11.0812 11.2454 14.7699 6.47588 14.8415 6.34711C15.4888 5.1836 13.5488 9.45703 13.6046 9.69921C14.2011 9.34703 14.5704 8.83539 14.8398 8.63585C14.9686 8.60515 15.0812 8.71771 15.2824 8.83368" stroke="#AFECB2" strokeWidth="3.36" strokeLinecap="round" />
                        <path d="M20.3201 3.46883C18.3051 3.38355 17.339 3.43984 16.7548 3.62445C16.5149 3.70027 16.2287 3.89348 15.9447 4.21966C15.5258 4.70084 15.6301 6.66487 15.729 7.94311C15.7985 8.84061 16.198 9.49253 16.4815 10.0046C16.7351 10.4625 17.3049 10.6028 18.0847 10.8441C18.8544 11.0823 19.5791 10.8032 19.9198 10.6331C20.4094 10.3886 20.8011 9.83874 21.1716 9.26954C21.5606 8.67186 21.5702 7.87746 21.557 6.09098C21.554 5.68544 21.4304 5.51879 21.2321 5.34739C20.2504 4.49872 18.792 4.37955 18.1047 4.25078C17.6552 4.16656 15.845 4.15101 14.6089 4.51854C13.7622 4.77031 13.9536 6.27772 13.9387 7.76958C13.9301 8.62671 14.3783 9.06616 14.8886 9.74749C15.5481 10.6279 15.8842 10.9712 16.3387 11.1711C16.9446 11.4377 18.572 11.5698 19.8622 11.2871C20.8824 11.0636 21.4253 10.4919 22.0094 10.0933C22.5834 9.70152 22.8766 9.12756 23.1192 8.45987C23.5025 7.40493 23.1068 5.63135 22.9359 5.14786C22.6808 4.42655 21.971 4.03845 21.36 3.76813C20.8222 3.5302 19.5902 3.63937 18.4189 4.06361C18.0016 4.21477 17.8199 4.77351 17.6494 5.29836C17.5121 5.72085 17.6195 6.11059 17.6903 6.42269C17.7233 6.56846 17.7892 6.67851 17.9026 6.69429C18.1903 6.7343 18.4432 6.39796 18.5993 6.11443C18.8783 5.60746 17.281 9.31687 17.0235 10.5427C16.9758 10.7694 16.9945 10.9132 17.0789 10.8309C18.3225 9.61867 19.4384 7.96102 19.5377 7.84676C19.9399 7.38419 19.8085 9.29469 19.8648 9.39489C19.9764 9.59358 20.234 8.95616 20.3619 8.68669C20.4054 8.55793 20.4054 8.44537 20.3632 8.31704C20.321 8.1887 20.2365 8.048 19.979 7.64722" stroke="#AFECB2" strokeWidth="3.36" strokeLinecap="round" />
                        <path d="M8.42996 3.47688C8.55184 3.23099 9.15592 2.6615 9.44013 2.47522C9.72929 2.2857 10.0607 2.1644 10.38 2.03161C10.8343 1.84273 11.1603 1.79184 11.647 1.72957C13.134 1.53932 14.0343 1.95044 14.3366 2.04837C14.8668 2.22011 15.5427 2.73069 15.8269 2.94385C16.1029 3.15085 16.3942 3.35127 16.7934 3.76801C16.9094 3.93672 16.9983 4.07936 17.0957 4.22093C17.1404 4.29225 17.1755 4.3625 17.265 4.48811" stroke="#AFECB2" strokeWidth="3.36" strokeLinecap="round" />
                        <path d="M9.42996 13.3557C9.55397 13.5324 9.73014 13.7804 10.0143 13.9319C10.2943 14.081 10.6349 14.136 10.9191 14.1982C11.198 14.2593 11.4865 14.2956 11.7707 14.3225C12.0774 14.3515 13.4802 14.4202 14.3254 14.3672C14.6225 14.3486 14.8928 14.137 15.2211 13.942C15.5144 13.7112 15.7975 13.4632 16.0288 13.1971C16.0823 13.1258 16.135 13.0555 16.2425 12.9299" stroke="#AFECB2" strokeWidth="3.36" strokeLinecap="round" />
                        <path d="M10.3799 6.76782V6.91184" stroke="#0D0D0D" strokeWidth="1.25" strokeLinecap="round" />
                        <path d="M13.98 6.67993V6.77594" stroke="#0D0D0D" strokeWidth="1.25" strokeLinecap="round" />
                        <path d="M9.17996 10.4481C9.22124 10.3036 9.32507 10.1363 9.4708 9.98524C9.56165 9.89108 9.65906 9.88517 9.7474 9.89549C9.9657 9.92099 10.1794 10.1035 10.3625 10.2027C10.5252 10.2909 10.6698 10.4268 10.8628 10.4378C11.1185 10.4523 11.3784 10.1047 11.6336 9.9277C11.8664 9.76624 12.1703 9.69753 12.415 9.71301C12.6839 9.73002 12.8276 9.94709 13.0465 10.0672C13.1385 10.1176 13.379 10.1354 13.6967 10.1199C13.9569 10.1072 14.0785 9.90643 14.4113 9.69331C14.8936 9.38435 15.2037 9.41607 15.4026 9.45235C15.4858 9.48863 15.5696 9.53053 15.6477 9.57729C15.6844 9.6034 15.7154 9.63436 15.8411 9.7288" stroke="#0D0D0D" strokeLinecap="round" />
                      </svg>
                    );
                  case "neutral":
                    return (
                      <svg width={width} height={height} viewBox="0 0 24 18" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
                        <path d="M3.45488 5.1749C2.83252 5.53053 2.423 5.89156 2.26606 6.29435C1.91844 7.18652 2.01886 7.95534 1.99528 10.2845C1.98194 11.6032 2.4203 12.4008 2.82443 13.2542C3.26348 14.1814 4.07995 14.602 4.93335 15.1193C5.70624 15.5878 6.50476 15.6797 12.3674 15.7949C14.1434 15.8298 15.0347 15.5935 16.3374 15.3018C17.3674 15.0712 18.09 14.9199 19.167 14.4276C20.2092 13.9511 20.337 12.6352 20.7862 11.309C21.1051 10.3677 21.1021 7.22251 20.9681 5.31231C20.9103 4.48879 20.0271 3.83047 19.0855 3.20137C18.0986 2.54201 17.0203 2.34595 15.8079 2.12233C15.0055 1.97432 10.635 1.94182 7.79193 2.09808C6.88133 2.14813 6.19762 2.52377 5.03102 3.10707C4.21519 3.51499 3.72701 4.31813 3.32152 5.03749C2.93586 5.72167 2.82713 6.47352 2.84801 10.0104C2.85667 11.478 3.81052 12.0425 4.46253 12.582C4.87885 12.9265 5.38396 13.0771 6.94257 13.2785C10.8767 13.7868 14.0917 13.5284 15.0111 13.3041C15.6193 13.1687 16.0706 13.034 16.563 12.8548C16.8331 12.7645 17.1443 12.6756 17.5996 12.584" stroke="#D9D9D9" strokeWidth="3.99" strokeLinecap="round" />
                        <path d="M8.55797 2.05591C7.93997 2.17976 7.48669 2.26149 6.98077 2.32404C6.60082 2.37101 6.28908 2.57111 5.85562 2.73645C5.50019 2.87202 5.09272 3.00458 4.71994 3.11852C4.37077 3.22524 3.89635 3.68326 3.54308 4.04675C3.23183 4.36701 2.96502 4.75826 2.7585 5.04775C2.53431 5.36202 2.57243 5.74904 2.43836 6.07971C2.03678 7.0702 2.44734 8.96907 2.5715 9.28952C2.70904 9.64452 3.06534 10.0626 3.78644 10.702C4.26154 11.1232 5.20851 11.22 6.08535 11.1392C6.71917 11.0808 6.59685 10.1078 6.59715 9.11397C6.59741 8.30376 6.51572 6.87357 6.44327 6.42276C6.28377 5.43028 6.18443 8.12257 6.15347 8.65666C6.13319 9.00641 6.14294 9.51771 6.51077 8.98393C6.8786 8.45015 7.61425 6.85623 8.09539 5.91251C8.57654 4.9688 8.78089 4.72358 8.98833 5.41465C9.19578 6.10571 9.40013 7.7405 9.5054 8.72571C9.61067 9.71091 9.61067 9.997 9.61067 10.0116C9.61067 10.0261 9.61067 9.76045 9.75371 8.7449C9.89675 7.72935 10.1828 5.97196 10.6776 6.12925C11.1724 6.28653 11.8672 8.41176 12.2455 9.54744C12.6239 10.6831 12.6647 10.7649 12.7062 10.7457C12.7477 10.7265 12.7886 10.6039 13.0344 9.50873C13.2803 8.41361 13.7298 6.3497 14.3701 6.19581C15.0104 6.04193 15.8278 7.86063 16.4021 8.43993C16.9765 9.01922 17.283 8.30401 17.4716 7.89469C17.7021 7.39427 17.8868 7.09464 18.0824 6.80514C18.1461 6.71093 18.2577 6.84261 18.3407 7.00763C18.9526 8.22466 18.8992 10.0001 18.8583 10.4026C18.8398 10.5854 17.5889 10.846 15.4476 11.3921C14.3769 11.6652 13.3063 11.7953 12.4319 11.8795C10.9084 12.0262 9.94382 11.9024 9.4797 11.7789C9.29745 11.7303 9.24037 11.6553 9.17813 11.5216C9.02628 11.1952 8.95056 10.646 8.88864 9.64992C8.71337 6.83071 8.97038 6.29025 9.18649 5.95803C9.63408 5.26998 10.5389 4.53347 10.6829 4.43037C10.8414 4.31681 11.7495 4.34708 13.0487 4.36752C14.2981 4.38717 14.9138 4.5118 16.478 4.69726C17.0748 4.76802 17.3499 5.17067 17.6592 5.55274C17.7827 5.70693 17.9666 5.95215 18.1023 6.08869C18.2379 6.22523 18.3196 6.24566 18.4038 6.26672" stroke="#D9D9D9" strokeWidth="3.99" strokeLinecap="round" />
                        <path d="M7.77397 9.72778V9.90781" stroke="#0D0D0D" strokeWidth="1.25" strokeLinecap="round" />
                        <path d="M10.524 9.72778V9.8478" stroke="#0D0D0D" strokeWidth="1.25" strokeLinecap="round" />
                        <path d="M7.72112 12.4793C8.23958 12.5393 8.95728 12.4601 9.62907 12.4094C9.91861 12.3797 10.3387 12.3593 10.9468 12.3494C11.2778 12.3395 11.654 12.3197 12.0417 12.2993" stroke="#0D0D0D" strokeLinecap="round" />
                      </svg>
                    );
                  case "happiness":
                    return (
                      <svg width={width} height={height} viewBox="0 0 25 22" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
                        <path d="M8.00683 6.81467C6.42866 5.91381 5.2298 5.16198 3.60987 5.12022C3.25014 5.11094 3.0443 5.4555 2.8919 5.71966C2.58895 6.24477 2.58823 7.40845 2.73725 8.79922C2.93374 10.6332 5.88907 10.9508 7.58802 11.4408C7.90187 11.5313 7.93006 11.9262 7.67042 12.3405C6.36916 14.4168 5.07627 15.9089 4.65859 17.4215C4.57742 17.7155 4.62021 18.0221 4.76922 18.2501C4.91823 18.4782 5.21626 18.6272 5.6678 18.7039C6.11935 18.7807 6.71539 18.7807 7.1342 18.5199C10.673 16.3165 8.15584 8.25059 8.83203 6.85756C9.43549 5.61439 10.6348 4.56142 12.2525 3.46981C13.6379 2.53492 15.5206 2.52493 17.0333 2.78683C17.3515 2.84192 17.6339 3.04873 17.8246 3.27451C18.2036 3.72298 18.1667 4.40338 18.0177 5.00394C17.5794 6.7702 15.2406 7.93901 12.3823 9.33091C11.5103 9.75556 10.8697 10.0477 10.3808 10.7228C9.87312 11.424 10.0388 12.4545 10.1506 13.2436C10.3338 14.5373 12.5088 15.9856 14.0982 17.347C14.6368 17.8083 15.3039 17.9521 15.9789 18.0278C18.1336 18.2692 20.3431 16.4507 21.2124 15.1751C21.9311 14.1204 21.1785 12.8383 20.841 12.2378C20.0406 10.8137 18.4737 9.90325 16.8933 8.88839C16.1905 8.43706 15.4619 8.16929 14.5611 8.31831C13.5689 8.48243 12.9761 9.29592 12.6375 10.0071C12.422 10.4595 12.5223 11.2398 12.7458 11.8472C13.5015 13.9005 15.6019 14.0349 17.4442 14.8274C17.9085 15.0271 18.3834 14.9425 18.651 14.7935C18.9185 14.6445 18.993 14.3465 19.0314 14.0067C19.0698 13.6669 19.0698 13.2944 18.8835 12.9907C18.3247 12.4635 17.6429 12.1587 17.0051 12.0086C16.6653 11.933 16.2928 11.8585 15.9089 11.7817" stroke="#FFF06C" strokeWidth="5.28" strokeLinecap="round" />
                        <path d="M8.74672 10.0789C8.74672 10.0214 8.80418 9.84818 8.94871 9.60179C9.1507 9.44159 9.38403 9.35366 9.61561 9.31013C9.73228 9.29533 9.8472 9.29533 10.1397 9.46945" stroke="#0D0D0D" strokeLinecap="round" />
                        <path d="M12.9967 8.90183C12.9967 8.84437 13.0255 8.69985 13.1264 8.49699C13.1987 8.40905 13.3136 8.35159 13.5309 8.32199C13.7481 8.29239 14.0641 8.29239 14.4768 8.37945" stroke="#0D0D0D" strokeLinecap="round" />
                        <path d="M11.9967 11.4025C11.9967 11.5174 11.9967 12.2374 12.1691 13.2386C12.2339 13.6147 12.6863 13.579 12.907 13.5359C13.2338 13.4721 13.3601 13.2029 13.4616 12.9713C13.5589 12.749 13.5639 12.3915 13.5208 12.0001C13.1877 11.5487 12.8682 11.2292 12.6371 11.0986C12.4921 11.0542 12.291 11.0542 12.0838 11.0542" stroke="#0D0D0D" strokeLinecap="round" />
                      </svg>
                    );
                  default:
                    return null;
                }
              };

              return (
                <S.MonthCalendarCharacter
                  key={`month-char-${index}`}
                  style={{
                    position: 'absolute',
                    left: `${left}px`,
                    top: `${top}px`,
                    width: `${size.width}px`,
                    height: `${size.height}px`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {renderSmallCharacter(emotion.character, size.width, size.height)}
                </S.MonthCalendarCharacter>
              );
            })}
          </S.MonthChartSection>
        ) : (
          <S.ChartSection>
            <S.ChartTitle>
              {selectedPeriod === "Week" ? "이번주 감정 로그" : "오늘의 감정 트래커"}
            </S.ChartTitle>

            {/* 차트 영역 */}
            <S.ChartArea>
              {/* Daily 뷰 - 그리드 라인 */}
              {selectedPeriod === "Daily" && (
                <>
                  <S.GridLine $top={60} />
                  <S.GridLine $top={96} />
                  <S.GridLine $top={132} />
                  <S.GridLine $top={168} />
                  <S.GridLine $top={204} />
                  <S.GridLine $top={240} />

                  {/* X축 라벨 */}
                  <S.XAxisLabel $left={42}>3</S.XAxisLabel>
                  <S.XAxisLabel $left={80.86}>6</S.XAxisLabel>
                  <S.XAxisLabel $left={119.71}>9</S.XAxisLabel>
                  <S.XAxisLabel $left={158.57}>12</S.XAxisLabel>
                  <S.XAxisLabel $left={197.43}>15</S.XAxisLabel>
                  <S.XAxisLabel $left={236.29}>18</S.XAxisLabel>
                  <S.XAxisLabel $left={275.14}>21</S.XAxisLabel>
                  <S.XAxisLabel $left={314}>24</S.XAxisLabel>
                </>
              )}

              {/* Daily 뷰 - 감정 캐릭터들 */}
              {selectedPeriod === "Daily" && (
                <>
                  <S.EmotionCharacter $left={16} $top={52}>
                    {/* 행복 */}
                    <svg width="25" height="22" viewBox="0 0 25 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8.00683 6.81467C6.42866 5.91381 5.2298 5.16198 3.60987 5.12022C3.25014 5.11094 3.0443 5.4555 2.8919 5.71966C2.58895 6.24477 2.58823 7.40845 2.73725 8.79922C2.93374 10.6332 5.88907 10.9508 7.58802 11.4408C7.90187 11.5313 7.93006 11.9262 7.67042 12.3405C6.36916 14.4168 5.07627 15.9089 4.65859 17.4215C4.57742 17.7155 4.62021 18.0221 4.76922 18.2501C4.91823 18.4782 5.21626 18.6272 5.6678 18.7039C6.11935 18.7807 6.71539 18.7807 7.1342 18.5199C10.673 16.3165 8.15584 8.25059 8.83203 6.85756C9.43549 5.61439 10.6348 4.56142 12.2525 3.46981C13.6379 2.53492 15.5206 2.52493 17.0333 2.78683C17.3515 2.84192 17.6339 3.04873 17.8246 3.27451C18.2036 3.72298 18.1667 4.40338 18.0177 5.00394C17.5794 6.7702 15.2406 7.93901 12.3823 9.33091C11.5103 9.75556 10.8697 10.0477 10.3808 10.7228C9.87312 11.424 10.0388 12.4545 10.1506 13.2436C10.3338 14.5373 12.5088 15.9856 14.0982 17.347C14.6368 17.8083 15.3039 17.9521 15.9789 18.0278C18.1336 18.2692 20.3431 16.4507 21.2124 15.1751C21.9311 14.1204 21.1785 12.8383 20.841 12.2378C20.0406 10.8137 18.4737 9.90325 16.8933 8.88839C16.1905 8.43706 15.4619 8.16929 14.5611 8.31831C13.5689 8.48243 12.9761 9.29592 12.6375 10.0071C12.422 10.4595 12.5223 11.2398 12.7458 11.8472C13.5015 13.9005 15.6019 14.0349 17.4442 14.8274C17.9085 15.0271 18.3834 14.9425 18.651 14.7935C18.9185 14.6445 18.993 14.3465 19.0314 14.0067C19.0698 13.6669 19.0698 13.2944 18.8835 12.9907C18.3247 12.4635 17.6429 12.1587 17.0051 12.0086C16.6653 11.933 16.2928 11.8585 15.9089 11.7817" stroke="#FFF06C" strokeWidth="5.28" strokeLinecap="round" />
                      <path d="M8.74672 10.0789C8.74672 10.0214 8.80418 9.84818 8.94871 9.60179C9.1507 9.44159 9.38403 9.35366 9.61561 9.31013C9.73228 9.29533 9.8472 9.29533 10.1397 9.46945" stroke="#0D0D0D" strokeLinecap="round" />
                      <path d="M12.9967 8.90183C12.9967 8.84437 13.0255 8.69985 13.1264 8.49699C13.1987 8.40905 13.3136 8.35159 13.5309 8.32199C13.7481 8.29239 14.0641 8.29239 14.4768 8.37945" stroke="#0D0D0D" strokeLinecap="round" />
                      <path d="M11.9967 11.4025C11.9967 11.5174 11.9967 12.2374 12.1691 13.2386C12.2339 13.6147 12.6863 13.579 12.907 13.5359C13.2338 13.4721 13.3601 13.2029 13.4616 12.9713C13.5589 12.749 13.5639 12.3915 13.5208 12.0001C13.1877 11.5487 12.8682 11.2292 12.6371 11.0986C12.4921 11.0542 12.291 11.0542 12.0838 11.0542" stroke="#0D0D0D" strokeLinecap="round" />
                    </svg>
                  </S.EmotionCharacter>

                  <S.EmotionCharacter $left={16} $top={89}>
                    {/* 중립 */}
                    <svg width="24" height="18" viewBox="0 0 24 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3.45488 5.1749C2.83252 5.53053 2.423 5.89156 2.26606 6.29435C1.91844 7.18652 2.01886 7.95534 1.99528 10.2845C1.98194 11.6032 2.4203 12.4008 2.82443 13.2542C3.26348 14.1814 4.07995 14.602 4.93335 15.1193C5.70624 15.5878 6.50476 15.6797 12.3674 15.7949C14.1434 15.8298 15.0347 15.5935 16.3374 15.3018C17.3674 15.0712 18.09 14.9199 19.167 14.4276C20.2092 13.9511 20.337 12.6352 20.7862 11.309C21.1051 10.3677 21.1021 7.22251 20.9681 5.31231C20.9103 4.48879 20.0271 3.83047 19.0855 3.20137C18.0986 2.54201 17.0203 2.34595 15.8079 2.12233C15.0055 1.97432 10.635 1.94182 7.79193 2.09808C6.88133 2.14813 6.19762 2.52377 5.03102 3.10707C4.21519 3.51499 3.72701 4.31813 3.32152 5.03749C2.93586 5.72167 2.82713 6.47352 2.84801 10.0104C2.85667 11.478 3.81052 12.0425 4.46253 12.582C4.87885 12.9265 5.38396 13.0771 6.94257 13.2785C10.8767 13.7868 14.0917 13.5284 15.0111 13.3041C15.6193 13.1687 16.0706 13.034 16.563 12.8548C16.8331 12.7645 17.1443 12.6756 17.5996 12.584" stroke="#D9D9D9" strokeWidth="3.99" strokeLinecap="round" />
                      <path d="M8.55797 2.05591C7.93997 2.17976 7.48669 2.26149 6.98077 2.32404C6.60082 2.37101 6.28908 2.57111 5.85562 2.73645C5.50019 2.87202 5.09272 3.00458 4.71994 3.11852C4.37077 3.22524 3.89635 3.68326 3.54308 4.04675C3.23183 4.36701 2.96502 4.75826 2.7585 5.04775C2.53431 5.36202 2.57243 5.74904 2.43836 6.07971C2.03678 7.0702 2.44734 8.96907 2.5715 9.28952C2.70904 9.64452 3.06534 10.0626 3.78644 10.702C4.26154 11.1232 5.20851 11.22 6.08535 11.1392C6.71917 11.0808 6.59685 10.1078 6.59715 9.11397C6.59741 8.30376 6.51572 6.87357 6.44327 6.42276C6.28377 5.43028 6.18443 8.12257 6.15347 8.65666C6.13319 9.00641 6.14294 9.51771 6.51077 8.98393C6.8786 8.45015 7.61425 6.85623 8.09539 5.91251C8.57654 4.9688 8.78089 4.72358 8.98833 5.41465C9.19578 6.10571 9.40013 7.7405 9.5054 8.72571C9.61067 9.71091 9.61067 9.997 9.61067 10.0116C9.61067 10.0261 9.61067 9.76045 9.75371 8.7449C9.89675 7.72935 10.1828 5.97196 10.6776 6.12925C11.1724 6.28653 11.8672 8.41176 12.2455 9.54744C12.6239 10.6831 12.6647 10.7649 12.7062 10.7457C12.7477 10.7265 12.7886 10.6039 13.0344 9.50873C13.2803 8.41361 13.7298 6.3497 14.3701 6.19581C15.0104 6.04193 15.8278 7.86063 16.4021 8.43993C16.9765 9.01922 17.283 8.30401 17.4716 7.89469C17.7021 7.39427 17.8868 7.09464 18.0824 6.80514C18.1461 6.71093 18.2577 6.84261 18.3407 7.00763C18.9526 8.22466 18.8992 10.0001 18.8583 10.4026C18.8398 10.5854 17.5889 10.846 15.4476 11.3921C14.3769 11.6652 13.3063 11.7953 12.4319 11.8795C10.9084 12.0262 9.94382 11.9024 9.4797 11.7789C9.29745 11.7303 9.24037 11.6553 9.17813 11.5216C9.02628 11.1952 8.95056 10.646 8.88864 9.64992C8.71337 6.83071 8.97038 6.29025 9.18649 5.95803C9.63408 5.26998 10.5389 4.53347 10.6829 4.43037C10.8414 4.31681 11.7495 4.34708 13.0487 4.36752C14.2981 4.38717 14.9138 4.5118 16.478 4.69726C17.0748 4.76802 17.3499 5.17067 17.6592 5.55274C17.7827 5.70693 17.9666 5.95215 18.1023 6.08869C18.2379 6.22523 18.3196 6.24566 18.4038 6.26672" stroke="#D9D9D9" strokeWidth="3.99" strokeLinecap="round" />
                      <path d="M7.77397 9.72778V9.90781" stroke="#0D0D0D" strokeWidth="1.25" strokeLinecap="round" />
                      <path d="M10.524 9.72778V9.8478" stroke="#0D0D0D" strokeWidth="1.25" strokeLinecap="round" />
                      <path d="M7.72112 12.4793C8.23958 12.5393 8.95728 12.4601 9.62907 12.4094C9.91861 12.3797 10.3387 12.3593 10.9468 12.3494C11.2778 12.3395 11.654 12.3197 12.0417 12.2993" stroke="#0D0D0D" strokeLinecap="round" />
                    </svg>
                  </S.EmotionCharacter>

                  <S.EmotionCharacter $left={16} $top={124}>
                    {/* 불안 */}
                    <svg width="25" height="17" viewBox="0 0 25 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6.51287 4.97408C5.92107 4.94594 4.55499 5.05765 3.9001 5.45587C3.36039 5.78405 2.59541 6.56186 2.07994 7.13234C1.64368 7.61515 1.71028 8.29632 1.68043 9.81461C1.66583 10.5578 1.99168 10.9978 2.26242 11.4531C2.53738 11.9156 3.09853 12.2769 4.05061 12.7608C5.0324 13.2598 6.56745 12.8482 7.17757 12.6214C8.39706 12.168 8.9261 11.8829 9.32561 11.5273C9.82274 11.0849 9.98008 10.2354 10.2214 9.08809C10.5147 7.69345 10.2368 6.65225 10.166 6.42543C9.95046 5.73473 9.01649 5.20261 8.47629 5.11648C7.92378 5.0284 7.48157 4.9178 5.68146 4.93101C5.16349 4.93482 4.86624 5.28533 4.48336 5.58293C3.71287 6.18182 3.78413 8.17353 4.12351 9.90074C4.2291 10.4381 4.57887 10.7147 4.86198 10.8852C5.54581 11.2972 6.33891 10.3207 6.97931 9.79458C7.50946 9.35903 7.70584 8.69967 7.84782 8.31679C7.97471 7.97462 7.96252 7.39414 7.75147 7.20525C6.85615 6.40398 6.51458 9.51744 6.16026 9.6931C4.95682 10.2897 5.54672 7.50244 5.50409 7.80004C5.48959 7.95694 5.48959 8.12578 5.51773 8.26904C5.54587 8.4123 5.60215 8.52486 5.66014 8.64083" stroke="#AFECB2" strokeWidth="3.36" strokeLinecap="round" />
                      <path d="M15.3677 4.39948C14.3256 4.39948 11.4826 4.51204 10.467 4.78193C9.76454 4.9686 9.71235 6.24138 9.58359 7.23737C9.46418 8.16098 9.65351 9.02981 9.82363 9.49839C10.0415 10.0984 10.6759 10.5085 11.1023 10.7374C11.5965 11.0028 12.0966 11.1361 12.9459 11.2068C14.3498 11.3238 15.6482 10.8837 16.2588 10.2454C17.0047 9.46563 16.8736 8.55399 16.9167 7.95452C16.9698 7.21453 16.8753 6.25161 16.6617 5.6095C16.5023 5.13049 16.0243 4.68599 15.4696 4.34362C14.764 3.90811 14.0357 3.94582 13.267 3.87377C12.025 3.75735 10.1404 3.9714 9.74092 4.31292C9.35837 4.63994 9.17172 5.19251 8.83148 5.98812C8.53743 6.67569 8.48953 7.38063 8.48868 8.77143C8.48816 9.61682 8.82892 10.1674 9.07067 10.6227C9.33355 11.1179 9.73793 11.4755 10.2351 11.7888C10.6505 12.0507 11.2711 12.0451 13.6528 12.0319C14.657 12.0263 15.1374 11.5641 15.6218 11.2367C16.0406 10.9535 16.6144 10.5136 17.0719 9.9303C17.5204 9.35839 17.5831 8.41244 17.6278 7.50086C17.6638 6.76936 16.6792 6.33518 15.9117 6.00645C15.0701 5.64598 13.6699 5.76385 12.4061 5.84827C11.636 5.89971 11.3325 6.44433 11.0916 6.88306C10.4591 8.03516 10.5924 8.91555 10.6909 9.38498C11.0812 11.2454 14.7699 6.47588 14.8415 6.34711C15.4888 5.1836 13.5488 9.45703 13.6046 9.69921C14.2011 9.34703 14.5704 8.83539 14.8398 8.63585C14.9686 8.60515 15.0812 8.71771 15.2824 8.83368" stroke="#AFECB2" strokeWidth="3.36" strokeLinecap="round" />
                      <path d="M20.3201 3.46883C18.3051 3.38355 17.339 3.43984 16.7548 3.62445C16.5149 3.70027 16.2287 3.89348 15.9447 4.21966C15.5258 4.70084 15.6301 6.66487 15.729 7.94311C15.7985 8.84061 16.198 9.49253 16.4815 10.0046C16.7351 10.4625 17.3049 10.6028 18.0847 10.8441C18.8544 11.0823 19.5791 10.8032 19.9198 10.6331C20.4094 10.3886 20.8011 9.83874 21.1716 9.26954C21.5606 8.67186 21.5702 7.87746 21.557 6.09098C21.554 5.68544 21.4304 5.51879 21.2321 5.34739C20.2504 4.49872 18.792 4.37955 18.1047 4.25078C17.6552 4.16656 15.845 4.15101 14.6089 4.51854C13.7622 4.77031 13.9536 6.27772 13.9387 7.76958C13.9301 8.62671 14.3783 9.06616 14.8886 9.74749C15.5481 10.6279 15.8842 10.9712 16.3387 11.1711C16.9446 11.4377 18.572 11.5698 19.8622 11.2871C20.8824 11.0636 21.4253 10.4919 22.0094 10.0933C22.5834 9.70152 22.8766 9.12756 23.1192 8.45987C23.5025 7.40493 23.1068 5.63135 22.9359 5.14786C22.6808 4.42655 21.971 4.03845 21.36 3.76813C20.8222 3.5302 19.5902 3.63937 18.4189 4.06361C18.0016 4.21477 17.8199 4.77351 17.6494 5.29836C17.5121 5.72085 17.6195 6.11059 17.6903 6.42269C17.7233 6.56846 17.7892 6.67851 17.9026 6.69429C18.1903 6.7343 18.4432 6.39796 18.5993 6.11443C18.8783 5.60746 17.281 9.31687 17.0235 10.5427C16.9758 10.7694 16.9945 10.9132 17.0789 10.8309C18.3225 9.61867 19.4384 7.96102 19.5377 7.84676C19.9399 7.38419 19.8085 9.29469 19.8648 9.39489C19.9764 9.59358 20.234 8.95616 20.3619 8.68669C20.4054 8.55793 20.4054 8.44537 20.3632 8.31704C20.321 8.1887 20.2365 8.048 19.979 7.64722" stroke="#AFECB2" strokeWidth="3.36" strokeLinecap="round" />
                      <path d="M8.42996 3.47688C8.55184 3.23099 9.15592 2.6615 9.44013 2.47522C9.72929 2.2857 10.0607 2.1644 10.38 2.03161C10.8343 1.84273 11.1603 1.79184 11.647 1.72957C13.134 1.53932 14.0343 1.95044 14.3366 2.04837C14.8668 2.22011 15.5427 2.73069 15.8269 2.94385C16.1029 3.15085 16.3942 3.35127 16.7934 3.76801C16.9094 3.93672 16.9983 4.07936 17.0957 4.22093C17.1404 4.29225 17.1755 4.3625 17.265 4.48811" stroke="#AFECB2" strokeWidth="3.36" strokeLinecap="round" />
                      <path d="M9.42996 13.3557C9.55397 13.5324 9.73014 13.7804 10.0143 13.9319C10.2943 14.081 10.6349 14.136 10.9191 14.1982C11.198 14.2593 11.4865 14.2956 11.7707 14.3225C12.0774 14.3515 13.4802 14.4202 14.3254 14.3672C14.6225 14.3486 14.8928 14.137 15.2211 13.942C15.5144 13.7112 15.7975 13.4632 16.0288 13.1971C16.0823 13.1258 16.135 13.0555 16.2425 12.9299" stroke="#AFECB2" strokeWidth="3.36" strokeLinecap="round" />
                      <path d="M10.3799 6.76782V6.91184" stroke="#0D0D0D" strokeWidth="1.25" strokeLinecap="round" />
                      <path d="M13.98 6.67993V6.77594" stroke="#0D0D0D" strokeWidth="1.25" strokeLinecap="round" />
                      <path d="M9.17996 10.4481C9.22124 10.3036 9.32507 10.1363 9.4708 9.98524C9.56165 9.89108 9.65906 9.88517 9.7474 9.89549C9.9657 9.92099 10.1794 10.1035 10.3625 10.2027C10.5252 10.2909 10.6698 10.4268 10.8628 10.4378C11.1185 10.4523 11.3784 10.1047 11.6336 9.9277C11.8664 9.76624 12.1703 9.69753 12.415 9.71301C12.6839 9.73002 12.8276 9.94709 13.0465 10.0672C13.1385 10.1176 13.379 10.1354 13.6967 10.1199C13.9569 10.1072 14.0785 9.90643 14.4113 9.69331C14.8936 9.38435 15.2037 9.41607 15.4026 9.45235C15.4858 9.48863 15.5696 9.53053 15.6477 9.57729C15.6844 9.6034 15.7154 9.63436 15.8411 9.7288" stroke="#0D0D0D" strokeLinecap="round" />
                    </svg>
                  </S.EmotionCharacter>

                  <S.EmotionCharacter $left={16} $top={158}>
                    {/* 우울 */}
                    <svg width="21" height="19" viewBox="0 0 21 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1.89052 14.2145C1.68248 10.9243 1.81979 9.47108 2.44132 7.61845C3.564 4.27204 4.52435 3.95376 4.99141 3.4503C5.76809 2.61308 6.80867 2.35807 8.93592 1.99295C12.0721 1.45466 12.8773 2.18123 13.5389 2.4933C14.1832 2.79722 14.8516 4.04738 16.2065 6.197C16.8717 7.2523 17.111 8.07302 17.3544 9.28592C17.3898 9.87468 17.4241 10.2949 17.4761 11.0694C17.4938 11.7065 17.4938 12.8393 17.4938 14.0064" stroke="#E0D0FF" strokeWidth="3.6" strokeLinecap="round" />
                      <path d="M1.89042 14.8387C2.23578 15.4607 2.72052 16.0848 3.42943 16.3636C4.83587 16.9167 5.63105 15.985 6.2401 15.6547C6.75848 15.3736 6.95212 14.9094 7.10763 14.7528C7.43525 14.423 7.91952 15.6334 8.63207 16.1374C9.17899 16.5242 10.4473 16.399 11.423 16.0885C12.1312 15.8631 12.3613 15.0841 12.638 14.6488C12.9422 14.1701 13.6074 15.3567 14.1801 15.7561C15.1473 16.4308 17.0048 15.7083 17.5785 15.3426C17.7049 15.262 17.8037 15.1528 17.8911 15.0311C18.9736 13.5233 18.0492 9.91842 17.9795 9.22408C17.9104 8.53551 17.6331 8.01066 17.4599 7.42086C17.2363 6.65964 16.9403 6.13827 16.5762 5.58279C16.2277 5.0511 15.7961 4.57794 15.4148 4.12597C15.0337 3.67409 14.4791 3.39834 13.8727 2.99889C13.3342 2.6442 12.5402 2.56408 11.7413 2.47774C11.0564 2.40373 10.4223 2.56304 9.97292 2.85638C8.93337 3.53498 8.58527 4.25963 7.96062 4.76414C7.2079 5.37208 6.2635 6.44409 5.36111 7.22478C4.4238 8.03567 3.7649 9.45865 3.22711 11.1916C2.98489 11.9722 2.93064 12.8914 3.06795 13.7579C3.15629 14.3154 4.3807 14.2145 5.38555 14.163C6.28059 14.1172 6.67335 13.0058 7.14144 12.2589C7.98881 10.9069 8.16294 9.47321 8.46044 8.28892C8.68949 7.37713 9.06585 6.24749 9.37791 4.94826C9.49951 4.44202 9.48401 4.23259 9.26089 4.58991C8.49386 5.81823 7.61682 7.58417 6.78517 8.83139C6.08359 9.88353 5.84533 10.6403 5.6014 11.213C5.45616 11.5539 5.25449 11.9583 5.15046 12.1164C4.53242 13.0558 5.76835 9.47529 6.4653 8.52974C6.56886 8.38923 6.742 8.35602 6.84706 8.3893C7.45234 8.58107 7.50552 10.7683 7.86908 12.7452C7.98797 13.3917 8.12965 13.2804 8.42299 12.7639C9.23181 11.3399 9.82936 10.1598 10.0717 10.0365C10.5103 9.81346 10.3162 11.6067 10.4707 12.1325C10.5408 12.3712 10.9341 10.8047 11.0932 11.1651C11.2524 11.5256 11.2524 13.4136 11.2352 13.2705C10.9523 10.9126 11.1827 8.35705 11.269 8.06163C11.31 7.9215 11.5634 9.00615 11.7366 10.0126C11.7628 10.1649 11.9795 8.33625 12.1699 6.11487C12.189 5.89095 12.4309 7.75165 12.5001 9.84873C12.5297 10.7465 12.6047 8.5859 12.6218 5.3243C12.6269 4.36248 12.6733 4.80887 12.6052 6.51483C12.5371 8.22079 12.3654 11.1729 12.4315 12.2303C12.5127 13.53 13.7115 10.0609 14.1962 9.20899C14.4399 8.78065 14.8911 11.7014 15.2031 13.786C15.4586 15.4922 15.5173 10.579 15.5173 9.86746C15.5173 8.98501 15.9334 12.6511 15.9334 12.6043C15.9334 9.60765 15.7253 8.15006 15.639 7.45571C15.6174 7.28192 15.6213 7.10984 15.5698 7.07291C15.1767 6.79098 14.0006 8.44963 12.7992 9.71974C11.7156 10.8652 11.2233 12.0571 10.6126 13.1535C10.3673 13.5941 10.1435 14.0044 10.0395 14.059C9.90188 14.1313 10.0041 13.3927 9.90114 13.2476C9.71405 12.984 9.31134 13.762 9.20731 13.9363C8.93964 14.3846 8.99927 12.933 8.8266 12.6906C8.74081 12.5702 8.58527 12.5169 8.46304 12.533C8.34081 12.5491 8.23783 12.6521 8.30493 12.688C8.37202 12.7239 8.61231 12.6896 8.78759 12.6032C8.96287 12.5169 9.06585 12.3796 9.48401 12.2381" stroke="#E0D0FF" strokeWidth="3.6" strokeLinecap="round" />
                      <path d="M6.28431 6.99438C6.07556 7.33707 5.92684 7.66453 5.79201 7.97137C5.68413 8.21688 5.59805 8.45651 5.52301 8.69572C5.44581 8.94184 5.41886 9.21803 5.33644 9.45724C5.25232 9.70136 5.15009 9.93476 5.07506 10.174C5.00221 10.4062 5.00047 10.6515 4.94806 10.8907C4.89349 11.1398 4.89565 11.4426 4.82129 12.0074C4.58504 13.8021 4.85086 14.0559 4.90282 14.2952C5.00003 14.5344 5.08917 14.7135 5.19354 14.8327C5.23879 14.8927 5.26835 14.9519 5.3884 15.0128" stroke="#E0D0FF" strokeWidth="3.6" strokeLinecap="round" />
                      <path d="M7.64989 10.5891C8.13044 10.8808 8.5928 10.9259 8.99522 10.8478C9.09368 10.8141 9.19964 10.7696 9.28954 10.7356C9.37944 10.7016 9.45008 10.6794 9.62989 10.5217" stroke="#0D0D0D" strokeWidth="0.9" strokeLinecap="round" />
                      <path d="M12.2885 10.4175C12.7691 10.7092 13.2314 10.7543 13.6339 10.6762C13.7323 10.6425 13.8383 10.598 13.9282 10.564C14.0181 10.53 14.0887 10.5077 14.2685 10.3501" stroke="#0D0D0D" strokeWidth="0.9" strokeLinecap="round" />
                      <path d="M9.49296 13.6356C9.63877 13.5812 9.96834 13.4343 10.3078 13.3242C10.5983 13.23 10.9037 13.2142 12.2479 13.2136C12.6094 13.2681 12.775 13.3237 12.9488 13.3603C13.0319 13.3787 13.1045 13.3968 13.3444 13.4706" stroke="#0D0D0D" strokeWidth="0.9" strokeLinecap="round" />
                    </svg>
                  </S.EmotionCharacter>

                  <S.EmotionCharacter $left={14} $top={194}>
                    {/* 슬픔 */}
                    <svg width="19" height="25" viewBox="0 0 19 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8.16696 2.87451C7.90412 3.84827 6.85595 5.94621 6.20202 7.09493C5.91243 7.60364 5.68743 8.04415 5.26587 8.70401C4.90213 9.27335 4.606 10.074 4.28894 10.802C3.98021 11.5108 3.86658 12.2654 3.60256 12.9003C3.41946 13.3406 3.23324 14.0846 2.98228 14.9448C2.82188 15.4946 2.86274 16.8238 2.95457 17.7691C3.01756 18.4175 3.41533 18.917 3.86381 19.734C4.16451 20.2818 4.86409 20.6587 5.46022 21.0027C5.97224 21.2981 6.55511 21.3997 7.90927 21.5311C9.87172 21.7216 10.4074 21.4789 10.9358 21.4001C11.4435 21.3244 11.8593 21.1891 12.387 20.9916C13.0683 20.7365 13.3904 20.2138 13.7732 19.8049C14.1975 19.3516 14.2882 18.7365 14.4734 18.3138C14.6461 17.9198 14.7109 17.3653 14.7509 16.8887C14.7935 16.381 14.9485 15.8073 14.9623 12.7958C14.9673 11.712 14.7125 11.2948 14.4485 10.6749C14.2339 10.1711 13.9478 9.52775 13.6307 8.90668C13.3452 8.34749 13.05 7.89057 12.7599 7.4021C12.4951 6.95643 12.0747 6.46713 11.7046 5.95056C11.328 5.42498 10.9663 5.04053 10.5962 4.67043C10.1208 4.19502 9.69964 3.87836 9.35566 3.5225C9.19367 3.35492 9.0386 3.19197 8.85453 3.07322C8.75946 3.01189 8.61821 3.03285 8.53786 3.09816C8.13999 3.42155 8.3253 5.2622 8.25959 6.38203C8.19922 7.41076 8.00863 8.83424 7.91679 9.53527C7.81984 10.2753 7.69195 10.8419 7.36341 12.7891C7.20805 13.7098 7.0602 14.8225 6.83497 16.1438C6.78963 16.4097 6.76886 16.5673 7.17341 16.0341C7.57795 15.5009 8.41396 14.2731 9.07976 13.1833C9.74556 12.0936 10.2158 11.1792 10.5234 10.7996C10.8309 10.42 10.9616 10.6028 11.055 10.8407C11.2542 11.3481 11.2806 12.3936 11.2941 13.7501C11.316 15.956 10.5159 17.1761 10.4763 17.2565C10.1253 17.9689 11.1452 15.3624 11.8459 14.9349C11.973 14.8573 12.0968 14.908 12.216 14.9864C12.5026 15.1749 12.6526 15.4875 12.7318 15.8026C12.7835 16.0085 12.7587 16.3267 12.7195 16.5273C12.6615 16.8246 11.4239 16.8872 10.3334 17.1235C9.71692 17.2571 9.33072 17.9401 9.11697 18.3636C9.14231 18.4436 9.2468 18.4958 9.35289 18.562C9.45897 18.6281 9.56347 18.7064 9.67114 18.7872" stroke="#C8E1FF" strokeWidth="5.7475" strokeLinecap="round" />
                      <path d="M13.6746 10.218C13.7843 10.7679 13.9601 11.1632 14.1805 11.4838C14.393 11.7927 14.555 12.1771 14.7754 12.541C14.9978 12.908 15.0838 13.3008 15.1836 13.6864C15.2523 13.9519 15.2166 14.205 15.2497 14.8715C15.3901 17.7051 15.019 18.0597 14.9198 18.4127C14.8144 18.7879 14.5788 19.1172 14.4023 19.4702C14.2297 19.8154 13.9839 20.1087 13.7308 20.385C13.389 20.5727 13.1247 20.6831 12.9052 20.7161C12.773 20.7274 12.5985 20.7274 12.4187 20.7274" stroke="#C8E1FF" strokeWidth="5.7475" strokeLinecap="round" />
                      <path d="M12.3526 7.83838C12.5945 8.05782 12.8576 8.54032 13.1448 9.02646C13.3859 9.43465 13.4974 9.79748 13.7287 10.0956C13.9616 10.3957 14.0261 10.7889 14.1369 11.1419C14.2496 11.5014 14.4888 11.8465 14.7202 12.1446C14.9592 12.4526 15.0401 12.8379 15.1723 13.1909C15.3046 13.5443 15.3045 13.9616 15.316 15.9164C15.3204 16.657 15.0414 17.0456 14.821 17.421C14.636 17.7361 14.3157 18.1032 13.9951 18.435C13.8305 18.4799 13.6097 18.5235 13.346 18.6005C13.2132 18.6339 13.0823 18.6557 12.9475 18.6782" stroke="#C8E1FF" strokeWidth="5.7475" strokeLinecap="round" />
                      <path d="M10.5292 8.38184L10.8142 8.47545" stroke="#0D0D0D" strokeWidth="1.25" strokeLinecap="round" />
                      <path d="M7.04643 8.97534L7.33145 8.88173" stroke="#0D0D0D" strokeWidth="1.25" strokeLinecap="round" />
                      <path d="M7.36467 12.4374C7.59384 12.3749 8.0244 12.2073 8.59685 11.9865C9.05472 11.8698 9.51905 11.7647 10.0855 11.6386C10.3915 11.5854 10.7353 11.5542 11.0895 11.522" stroke="#0D0D0D" strokeLinecap="round" />
                    </svg>
                  </S.EmotionCharacter>

                  <S.EmotionCharacter $left={14} $top={229}>
                    {/* 분노 */}
                    <svg width="23" height="21" viewBox="0 0 23 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5.29393 18.1285C3.92214 15.5335 1.43631 9.54392 1.54224 6.81562C1.56224 6.30072 2.08288 6.33287 2.44876 6.58517C4.1881 7.78455 4.12747 9.74926 5.03508 11.4596C5.73388 12.7765 6.09342 13.8996 6.20373 15.61C6.22984 16.0148 6.31185 16.3024 6.34899 15.8743C6.62586 12.6821 6.60456 11.2172 6.78586 8.82198C7.14942 4.01901 7.32978 2.69807 7.98509 1.67577C8.12764 1.45338 8.49186 1.52723 8.67644 1.70744C11.197 4.16829 8.86321 11.4924 8.71686 13.6418C8.55381 16.0364 8.27999 16.8878 8.17077 17.1805C7.49401 18.9942 10.0952 12.0909 10.6435 10.4537C11.3831 8.24533 12.8606 6.48578 14.0271 5.60767C14.3189 5.38801 14.6081 5.10089 14.8288 5.09652C15.0494 5.09215 15.1936 5.38049 15.2678 5.74529C15.6033 7.3929 14.2543 9.30801 13.3794 10.552C12.5066 11.7931 11.4888 12.9516 10.3224 14.3736C9.2907 15.6313 8.64477 16.4509 8.64259 16.6716C8.61663 19.2974 14.0184 12.8205 15.5562 11.6158C16.7217 10.7027 17.6685 10.1206 18.1425 10.0824C18.2973 10.0699 18.1119 10.5487 17.8935 10.8425C17.0238 12.0123 15.1324 12.5889 13.0561 14.118C11.4452 15.3044 9.88988 16.8092 9.29681 17.6906C7.94747 19.696 13.6558 16.3111 15.554 15.5466C17.6776 14.6913 19.997 14.4151 20.8336 14.5593C21.1904 14.6207 21.3098 14.9918 21.312 15.3566C21.3169 16.1664 20.589 16.8878 19.8255 17.4328C18.7452 18.204 17.2425 18.4169 15.8205 18.7467C14.5448 18.856 8.91127 19.0023 5.87935 18.2771C5.66091 18.1285 5.37257 18.1285 5.07549 18.1285" stroke="#FF6868" strokeWidth="3.078" strokeLinecap="round" />
                      <path d="M18.2934 16.3914L13.8951 17.271" stroke="#FF6868" strokeWidth="2.3085" strokeLinecap="round" />
                      <path d="M1.20564 7.53052C1.20564 7.66949 1.23076 7.94783 1.24999 8.46146C1.26078 8.74973 1.30691 9.00175 1.33243 9.4579C1.35053 9.78162 1.42114 10.1059 1.50357 10.3409C1.57558 10.5461 1.61152 10.7784 1.66235 10.9946C1.71383 11.2137 1.8019 11.4386 1.87805 11.6798C1.95236 11.9152 2.00522 12.1239 2.07471 12.3273C2.14302 12.5272 2.18265 12.7332 2.26508 12.9365C2.34586 13.1357 2.38598 13.3424 2.42386 13.5457C2.46287 13.7551 2.56341 13.9767 2.62052 14.193C2.67656 14.4052 2.75378 14.5989 2.83622 14.8022C2.91699 15.0014 2.98224 15.2081 3.03935 15.4114C3.12197 15.6147 3.17261 15.7796 3.22325 15.8999C3.24877 15.9574 3.2739 16.0076 3.29979 16.0594" stroke="#FF6868" strokeWidth="2.3085" strokeLinecap="round" />
                      <path d="M1.49436 6.97705C1.47954 7.39579 1.44943 8.37614 1.50155 9.03525C1.52252 9.30048 1.6588 9.52182 1.6889 9.80645C1.72183 10.1178 1.80886 10.4051 1.89086 10.7349C1.96076 11.016 2.00296 11.3486 2.07821 11.6858C2.1433 11.9774 2.1683 12.2176 2.25029 12.4575C2.34605 12.7377 2.42259 13.1009 2.4974 13.3709C2.5874 13.6958 2.70654 14.0435 2.7672 14.4191C2.81033 14.6862 2.91681 14.9133 2.96938 15.1532C3.02814 15.4214 3.14146 15.7813 3.21626 16.0965C3.2891 16.4034 3.44068 16.6502 3.55323 16.9054C3.6556 17.1376 3.75518 17.3844 3.88256 17.6243C4.01713 17.8778 4.21885 18.1032 4.41407 18.373C4.5697 18.5881 4.80293 18.7179 5.04285 18.8751C5.26457 19.0205 5.55144 19.0773 5.82147 19.1227C6.14075 19.1763 6.40509 19.2274 6.67512 19.3172C6.97532 19.4171 7.3477 19.3774 8.33097 19.4147C9.0433 19.4417 10.393 19.4224 11.1177 19.4149C12.1414 19.4045 12.6502 19.3478 13.2783 19.3251C13.5946 19.2727 13.8929 19.2426 14.3346 19.2054C14.477 19.1977 14.6549 19.1977 14.973 19.1528" stroke="#FF6868" strokeWidth="2.3085" strokeLinecap="round" />
                      <path d="M1.51045 9.62451C1.47238 10.0399 1.52264 10.8543 1.61802 11.1022C1.69743 11.3086 1.76404 11.5146 1.84647 11.7179C1.92725 11.9171 1.99249 12.1238 2.0496 12.3271C2.06433 12.3795 2.09377 12.4284 2.10671 12.3915C2.21994 12.0684 2.05646 11.8466 1.99934 11.6117C1.94331 11.3812 1.86608 11.1361 1.81525 10.8504C1.76039 10.542 1.72672 10.1842 1.66923 10.0559C1.52905 9.74307 1.73891 10.5505 1.73891 10.5827C1.73891 10.8425 1.68827 10.1454 1.65666 10.0944C1.42831 9.72569 1.61173 11.2861 1.65628 11.4957C1.70532 11.7265 1.72596 11.9334 1.77679 12.1367C1.82762 12.3401 1.85313 12.5677 1.91634 12.7966C1.98812 13.0565 2.03056 13.2912 2.113 13.5075C2.18715 13.702 2.208 13.9133 2.24017 14.1483C2.27094 14.3729 2.3603 14.6238 2.43036 14.878C2.49821 15.1241 2.56362 15.3221 2.67766 15.5255C2.7839 15.7149 2.85528 15.9313 2.95066 16.1663C3.03545 16.3751 3.15988 16.5786 3.29315 16.8135C3.41257 17.0241 3.56577 17.251 3.71826 17.442C3.88794 17.6545 4.11101 17.8602 4.36497 18.0259C4.78456 18.2995 5.20149 18.4824 5.7791 18.6353C6.0092 18.6962 6.55736 18.6865 7.31792 18.6739C7.8285 18.6655 8.08419 18.5852 8.20451 18.522C8.31226 18.4337 8.40174 18.3316 8.47142 18.2303C8.5034 18.1793 8.52853 18.1291 8.55442 18.0773" stroke="#FF6868" strokeWidth="2.3085" strokeLinecap="round" />
                      <path d="M7.48147 13.1545L7.49933 13.3074" stroke="#0D0D0D" strokeWidth="1.125" strokeLinecap="round" />
                      <path d="M10.5594 12.6929L10.5773 12.8457" stroke="#0D0D0D" strokeWidth="1.125" strokeLinecap="round" />
                      <path d="M5.48064 11.1538L7.50448 11.5386" stroke="#0D0D0D" strokeWidth="0.9" strokeLinecap="round" />
                      <path d="M10.2518 14.8595C9.38773 14.8139 8.56652 14.9042 8.15454 15.0187C7.72769 15.1374 7.42503 15.6935 7.27151 16.0142C7.09298 16.3872 7.19463 16.7898 7.29318 16.9645C7.42933 17.2059 8.31376 17.1406 8.85166 17.0649C9.16979 17.0201 9.41419 16.9736 9.89163 16.8824C10.9772 16.6749 11.3906 16.6853 11.6123 16.4951C11.9373 16.2162 11.5612 15.2582 11.3399 14.9665C11.2866 14.9357 11.2263 14.9206 11.105 14.9129C10.9836 14.9051 10.8029 14.9051 10.4799 14.8595" stroke="#0D0D0D" strokeWidth="0.9" strokeLinecap="round" />
                      <path d="M9.94373 11.2009L11.1931 10.5381" stroke="#0D0D0D" strokeWidth="0.9" strokeLinecap="round" />
                    </svg>
                  </S.EmotionCharacter>
                </>
              )}

              {/* Daily 차트 - Line Chart */}
              {selectedPeriod === "Daily" && dailyChartData.length > 0 && (
                <S.ChartLine>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={dailyChartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="0" stroke="transparent" horizontal={false} vertical={false} />
                      <XAxis
                        dataKey="time"
                        hide={true}
                        type="category"
                        scale="point"
                        padding={{ left: 0, right: 0 }}
                      />
                      <YAxis hide={true} domain={[0, 100]} />
                      <Line
                        type="linear"
                        dataKey="value"
                        stroke="#5482FF"
                        strokeWidth={4.24}
                        dot={false}
                        activeDot={false}
                        isAnimationActive={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </S.ChartLine>
              )}

              {/* Week 차트 - Bar Chart */}
              {selectedPeriod === "Week" && weekChartData.length > 0 && (
                <>
                  {/* Y축 라벨 */}
                  <S.YAxisLabel $top={60}>100</S.YAxisLabel>
                  <S.YAxisLabel $top={96}>80</S.YAxisLabel>
                  <S.YAxisLabel $top={132}>60</S.YAxisLabel>
                  <S.YAxisLabel $top={168}>40</S.YAxisLabel>
                  <S.YAxisLabel $top={204}>20</S.YAxisLabel>

                  {/* X축 요일 라벨 */}
                  <S.WeekXAxisLabel $left={41}>월</S.WeekXAxisLabel>
                  <S.WeekXAxisLabel $left={86}>화</S.WeekXAxisLabel>
                  <S.WeekXAxisLabel $left={131}>수</S.WeekXAxisLabel>
                  <S.WeekXAxisLabel $left={176}>목</S.WeekXAxisLabel>
                  <S.WeekXAxisLabel $left={221}>금</S.WeekXAxisLabel>
                  <S.WeekXAxisLabel $left={266}>토</S.WeekXAxisLabel>
                  <S.WeekXAxisLabel $left={311}>일</S.WeekXAxisLabel>

                  {/* Week 그리드 라인 */}
                  <S.WeekGridLine $top={60} $left={29} $width={298} />
                  <S.WeekGridLine $top={96} $left={29} $width={298} />
                  <S.WeekGridLine $top={132} $left={29} $width={298} />
                  <S.WeekGridLine $top={168} $left={29} $width={298} />
                  <S.WeekGridLine $top={204} $left={29} $width={298} />
                  <S.WeekGridLine $top={240} $left={16} $width={311} />

                  {/* Bar Chart */}
                  <S.WeekChartContainer>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={weekChartData} margin={{ top: 0, right: 8, left: 8, bottom: 0 }} barCategoryGap="0%" barGap={0}>
                        <CartesianGrid strokeDasharray="0" stroke="transparent" horizontal={false} vertical={false} />
                        <XAxis
                          dataKey="day"
                          hide={true}
                          type="category"
                          scale="point"
                          padding={{ left: 0, right: 0 }}
                          interval={0}
                        />
                        <YAxis hide={true} domain={[0, 100]} />
                        <Bar
                          dataKey="value"
                          fill="#5482FF"
                          radius={[0, 0, 0, 0]}
                          barSize={16}
                        >
                          {weekChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill="#5482FF" />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </S.WeekChartContainer>

                  {/* 막대 위 퍼센트 표시 */}
                  {weekChartData.map((entry, index) => {
                    // 값이 0 이하이거나 null/undefined이면 표시하지 않음
                    if (!entry || entry.value == null || entry.value <= 0) return null;
                    const barHeight = (entry.value / 100) * 180; // 180px is the chart height (240 - 60)
                    const barTop = 240 - barHeight;
                    // 요일 라벨 위치에 맞춰 퍼센트 라벨 위치 계산 (막대 중심에 맞춤)
                    // 막대가 오른쪽으로 이동했으므로 퍼센트 라벨도 약간 오른쪽으로 이동
                    const dayLabelPositions = [41, 86, 131, 176, 221, 266, 311];
                    const barCenter = dayLabelPositions[index] + 3; // 막대 중심 위치 (오른쪽으로 이동)
                    const percentText = `${entry.value}%`;
                    const textWidth = percentText.length * 4.5; // 대략적인 텍스트 너비 (글자당 4.5px)
                    const barLeft = barCenter - (textWidth / 2); // 텍스트 중앙 정렬
                    return (
                      <S.PercentLabel key={`percent-${index}`} $left={barLeft} $top={barTop - 10}>
                        {percentText}
                      </S.PercentLabel>
                    );
                  })}
                </>
              )}
            </S.ChartArea>
          </S.ChartSection>
        )}

        {/* 리스트 섹션 - Daily와 Month 뷰에서 표시 */}
        {selectedPeriod === "Daily" && (
          <S.ListSection>
            <S.ListHeader>
              <S.ListTitle>오늘 가장 많이 느낀 감정은</S.ListTitle>
              <S.ChevronIcon>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 4L10 8L6 12" stroke="#838383" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </S.ChevronIcon>
            </S.ListHeader>

            <S.EmotionInfo>
              <S.EmotionCharacterLarge>
                {todayEmotion && renderEmotionCharacter(todayEmotion.character)}
              </S.EmotionCharacterLarge>

              {todayEmotion && (
                <S.EmotionTextContainer>
                  <S.EmotionName>"{todayEmotion.emotion}"</S.EmotionName>
                  <S.EmotionDescription>
                    {todayEmotion.message}
                  </S.EmotionDescription>
                </S.EmotionTextContainer>
              )}
            </S.EmotionInfo>
          </S.ListSection>
        )}

        {/* Month 뷰 - 이번 달 감정 별 횟수 */}
        {selectedPeriod === "Month" && (
          <S.MonthListSection>
            <S.MonthListTitle>이번 달 감정 별 횟수</S.MonthListTitle>
            <S.MonthEmotionList>
              {monthEmotionCounts.filter(item => item && item.emotion).map((item, index) => (
                <S.MonthEmotionItem key={`month-emotion-${index}`}>
                  <S.MonthEmotionCharacter $width={index === 1 ? "19.91" : "32"} $height={index === 1 ? "45.96" : "48"}>
                    {renderEmotionCharacter(item.emotion)}
                  </S.MonthEmotionCharacter>
                  <S.MonthEmotionCount>{item.count}회</S.MonthEmotionCount>
                </S.MonthEmotionItem>
              ))}
            </S.MonthEmotionList>
          </S.MonthListSection>
        )}

        {/* 년도/월 선택 모달 - Container 레벨로 이동 */}
        <SidebarModal
          isOpen={isDateModalOpen}
          onClose={() => {
            setIsDateModalOpen(false);
            setSelectedMode("year"); // 닫을 때 년도 모드로 리셋
          }}
          options={getDateOptions()}
          selectedValue={selectedMode === "year" ? currentYear : currentMonth}
          onSelect={handleDateSelect}
          triggerRef={dateFieldRef}
        autoClose={selectedMode === "month"} // 월 선택 시에만 자동 닫기
      />
      {selectedPeriod === "Month" ? (
        <S.MonthChartSection>
          <S.MonthChartTitle>월별 감정 캘린더</S.MonthChartTitle>
          {/* 년도/월 선택 필드 - 하나로 통합 */}
          <S.MonthDateHeader ref={dateFieldRef} onClick={handleDateFieldClick} style={{ cursor: 'pointer' }}>
            {currentYear}년 {currentMonth}월
            <S.MonthChevronIcon>
              <svg width="4" height="7" viewBox="0 0 4 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 4L0 6L2 8" stroke="#0D0D0D" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </S.MonthChevronIcon>
          </S.MonthDateHeader>
          
          {/* 그리드 라인 */}
          <S.MonthCalendarGridLine $top={111} />
          <S.MonthCalendarGridLine $top={147} />
          <S.MonthCalendarGridLine $top={183} />
          <S.MonthCalendarGridLine $top={219} />
          <S.MonthCalendarGridLine $top={255} />
          <S.MonthCalendarGridLine $top={291} $isLast={true} />
          
          {/* Y축 라벨 (날짜) - 동적으로 생성 */}
          {generateCalendarData().map((entry, index) => {
            // 빈 칸이면 날짜 레이블도 표시하지 않음
            if (entry === null) {
              return null;
            }
            
            // index를 기반으로 위치 계산
            const row = Math.floor(index / 7);
            const col = index % 7;
            
            // CSS 스펙에 따른 정확한 위치 계산
            // X축 라벨 기준: 월(28), 화(74), 수(120), 목(166), 금(212), 토(258), 일(304)
            // 첫 번째 열(월요일): left: 28px, 이후 46px 간격
            const left = 28 + (col * 46);
            // 첫 번째 그리드 라인: top: 111px, 이후 36px 간격
            const top = 111 + (row * 36);
            
            return (
              <S.MonthCalendarYAxis key={`date-label-${entry.day}`} $left={left} $top={top}>
                {entry.day}
              </S.MonthCalendarYAxis>
            );
          })}
          
          {/* X축 라벨 (요일) */}
          <S.MonthCalendarDayLabel $left={28}>월</S.MonthCalendarDayLabel>
          <S.MonthCalendarDayLabel $left={74}>화</S.MonthCalendarDayLabel>
          <S.MonthCalendarDayLabel $left={120}>수</S.MonthCalendarDayLabel>
          <S.MonthCalendarDayLabel $left={166}>목</S.MonthCalendarDayLabel>
          <S.MonthCalendarDayLabel $left={212}>금</S.MonthCalendarDayLabel>
          <S.MonthCalendarDayLabel $left={258}>토</S.MonthCalendarDayLabel>
          <S.MonthCalendarDayLabel $left={304}>일</S.MonthCalendarDayLabel>
          
          {/* 캘린더 캐릭터들 */}
          {generateCalendarData().map((entry, index) => {
            // 빈 칸이면 렌더링하지 않음
            if (entry === null) {
              return null;
            }
            
            const emotion = getEmotionByValue(entry.value);
            
            // emotion이 null이면 렌더링하지 않음
            if (!emotion) {
              return null;
            }
            
            // generateCalendarData()가 이미 올바른 순서로 배열을 반환하므로
            // index를 그대로 사용하여 위치 계산
            // index는 빈 칸(null)을 포함한 전체 배열의 위치
            const row = Math.floor(index / 7);
            const col = index % 7;
            
            // CSS 스펙에 따른 정확한 위치 계산
            // X축 라벨 기준: 월(28), 화(74), 수(120), 목(166), 금(212), 토(258), 일(304)
            // 첫 번째 열(월요일): left: 28px, 이후 46px 간격
            // 캐릭터를 날짜 숫자와 같은 left 위치에 배치
            const left = 28 + (col * 46);
            // 첫 번째 그리드 라인: top: 111px, 이후 36px 간격
            // 날짜 레이블이 111px에서 시작하고 높이가 22px이므로, 캐릭터는 그 바로 아래에 배치
            // 날짜 레이블 끝(133px) + 여유공간(2px) = 135px부터 시작
            const top = 135 + (row * 36);
            
            // 캐릭터별 크기 조정 (작은 크기로)
            const getCharacterSize = (char) => {
              switch (char) {
                case "happiness": return { width: 14.13, height: 12.06 };
                case "sadness": return { width: 9.32, height: 14.02 };
                case "anxiety": return { width: 16.17, height: 9.51 };
                case "anger": return { width: 15.06, height: 13.4 };
                case "depression": return { width: 12.76, height: 11.32 };
                case "neutral": return { width: 12.44, height: 11.03 };
                default: return { width: 14.13, height: 12.06 };
              }
            };
            const size = getCharacterSize(emotion.character);
            
            // 작은 캐릭터 렌더링 함수
            const renderSmallCharacter = (character, width, height) => {
              switch (character) {
                case "depression":
                  return (
                    <svg width={width} height={height} viewBox="0 0 21 19" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
                      <path d="M1.89052 14.2145C1.68248 10.9243 1.81979 9.47108 2.44132 7.61845C3.564 4.27204 4.52435 3.95376 4.99141 3.4503C5.76809 2.61308 6.80867 2.35807 8.93592 1.99295C12.0721 1.45466 12.8773 2.18123 13.5389 2.4933C14.1832 2.79722 14.8516 4.04738 16.2065 6.197C16.8717 7.2523 17.111 8.07302 17.3544 9.28592C17.3898 9.87468 17.4241 10.2949 17.4761 11.0694C17.4938 11.7065 17.4938 12.8393 17.4938 14.0064" stroke="#E0D0FF" strokeWidth="3.6" strokeLinecap="round"/>
                      <path d="M1.89042 14.8387C2.23578 15.4607 2.72052 16.0848 3.42943 16.3636C4.83587 16.9167 5.63105 15.985 6.2401 15.6547C6.75848 15.3736 6.95212 14.9094 7.10763 14.7528C7.43525 14.423 7.91952 15.6334 8.63207 16.1374C9.17899 16.5242 10.4473 16.399 11.423 16.0885C12.1312 15.8631 12.3613 15.0841 12.638 14.6488C12.9422 14.1701 13.6074 15.3567 14.1801 15.7561C15.1473 16.4308 17.0048 15.7083 17.5785 15.3426C17.7049 15.262 17.8037 15.1528 17.8911 15.0311C18.9736 13.5233 18.0492 9.91842 17.9795 9.22408C17.9104 8.53551 17.6331 8.01066 17.4599 7.42086C17.2363 6.65964 16.9403 6.13827 16.5762 5.58279C16.2277 5.0511 15.7961 4.57794 15.4148 4.12597C15.0337 3.67409 14.4791 3.39834 13.8727 2.99889C13.3342 2.6442 12.5402 2.56408 11.7413 2.47774C11.0564 2.40373 10.4223 2.56304 9.97292 2.85638C8.93337 3.53498 8.58527 4.25963 7.96062 4.76414C7.2079 5.37208 6.2635 6.44409 5.36111 7.22478C4.4238 8.03567 3.7649 9.45865 3.22711 11.1916C2.98489 11.9722 2.93064 12.8914 3.06795 13.7579C3.15629 14.3154 4.3807 14.2145 5.38555 14.163C6.28059 14.1172 6.67335 13.0058 7.14144 12.2589C7.98881 10.9069 8.16294 9.47321 8.46044 8.28892C8.68949 7.37713 9.06585 6.24749 9.37791 4.94826C9.49951 4.44202 9.48401 4.23259 9.26089 4.58991C8.49386 5.81823 7.61682 7.58417 6.78517 8.83139C6.08359 9.88353 5.84533 10.6403 5.6014 11.213C5.45616 11.5539 5.25449 11.9583 5.15046 12.1164C4.53242 13.0558 5.76835 9.47529 6.4653 8.52974C6.56886 8.38923 6.742 8.35602 6.84706 8.3893C7.45234 8.58107 7.50552 10.7683 7.86908 12.7452C7.98797 13.3917 8.12965 13.2804 8.42299 12.7639C9.23181 11.3399 9.82936 10.1598 10.0717 10.0365C10.5103 9.81346 10.3162 11.6067 10.4707 12.1325C10.5408 12.3712 10.9341 10.8047 11.0932 11.1651C11.2524 11.5256 11.2524 13.4136 11.2352 13.2705C10.9523 10.9126 11.1827 8.35705 11.269 8.06163C11.31 7.9215 11.5634 9.00615 11.7366 10.0126C11.7628 10.1649 11.9795 8.33625 12.1699 6.11487C12.189 5.89095 12.4309 7.75165 12.5001 9.84873C12.5297 10.7465 12.6047 8.5859 12.6218 5.3243C12.6269 4.36248 12.6733 4.80887 12.6052 6.51483C12.5371 8.22079 12.3654 11.1729 12.4315 12.2303C12.5127 13.53 13.7115 10.0609 14.1962 9.20899C14.4399 8.78065 14.8911 11.7014 15.2031 13.786C15.4586 15.4922 15.5173 10.579 15.5173 9.86746C15.5173 8.98501 15.9334 12.6511 15.9334 12.6043C15.9334 9.60765 15.7253 8.15006 15.639 7.45571C15.6174 7.28192 15.6213 7.10984 15.5698 7.07291C15.1767 6.79098 14.0006 8.44963 12.7992 9.71974C11.7156 10.8652 11.2233 12.0571 10.6126 13.1535C10.3673 13.5941 10.1435 14.0044 10.0395 14.059C9.90188 14.1313 10.0041 13.3927 9.90114 13.2476C9.71405 12.984 9.31134 13.762 9.20731 13.9363C8.93964 14.3846 8.99927 12.933 8.8266 12.6906C8.74081 12.5702 8.58527 12.5169 8.46304 12.533C8.34081 12.5491 8.23783 12.6521 8.30493 12.688C8.37202 12.7239 8.61231 12.6896 8.78759 12.6032C8.96287 12.5169 9.06585 12.3796 9.48401 12.2381" stroke="#E0D0FF" strokeWidth="3.6" strokeLinecap="round"/>
                      <path d="M6.28431 6.99438C6.07556 7.33707 5.92684 7.66453 5.79201 7.97137C5.68413 8.21688 5.59805 8.45651 5.52301 8.69572C5.44581 8.94184 5.41886 9.21803 5.33644 9.45724C5.25232 9.70136 5.15009 9.93476 5.07506 10.174C5.00221 10.4062 5.00047 10.6515 4.94806 10.8907C4.89349 11.1398 4.89565 11.4426 4.82129 12.0074C4.58504 13.8021 4.85086 14.0559 4.90282 14.2952C5.00003 14.5344 5.08917 14.7135 5.19354 14.8327C5.23879 14.8927 5.26835 14.9519 5.3884 15.0128" stroke="#E0D0FF" strokeWidth="3.6" strokeLinecap="round"/>
                      <path d="M7.64989 10.5891C8.13044 10.8808 8.5928 10.9259 8.99522 10.8478C9.09368 10.8141 9.19964 10.7696 9.28954 10.7356C9.37944 10.7016 9.45008 10.6794 9.62989 10.5217" stroke="#0D0D0D" strokeWidth="0.9" strokeLinecap="round"/>
                      <path d="M12.2885 10.4175C12.7691 10.7092 13.2314 10.7543 13.6339 10.6762C13.7323 10.6425 13.8383 10.598 13.9282 10.564C14.0181 10.53 14.0887 10.5077 14.2685 10.3501" stroke="#0D0D0D" strokeWidth="0.9" strokeLinecap="round"/>
                      <path d="M9.49296 13.6356C9.63877 13.5812 9.96834 13.4343 10.3078 13.3242C10.5983 13.23 10.9037 13.2142 12.2479 13.2136C12.6094 13.2681 12.775 13.3237 12.9488 13.3603C13.0319 13.3787 13.1045 13.3968 13.3444 13.4706" stroke="#0D0D0D" strokeWidth="0.9" strokeLinecap="round"/>
                    </svg>
                  );
                case "anger":
                  return (
                    <svg width={width} height={height} viewBox="0 0 23 21" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
                      <path d="M5.29393 18.1285C3.92214 15.5335 1.43631 9.54392 1.54224 6.81562C1.56224 6.30072 2.08288 6.33287 2.44876 6.58517C4.1881 7.78455 4.12747 9.74926 5.03508 11.4596C5.73388 12.7765 6.09342 13.8996 6.20373 15.61C6.22984 16.0148 6.31185 16.3024 6.34899 15.8743C6.62586 12.6821 6.60456 11.2172 6.78586 8.82198C7.14942 4.01901 7.32978 2.69807 7.98509 1.67577C8.12764 1.45338 8.49186 1.52723 8.67644 1.70744C11.197 4.16829 8.86321 11.4924 8.71686 13.6418C8.55381 16.0364 8.27999 16.8878 8.17077 17.1805C7.49401 18.9942 10.0952 12.0909 10.6435 10.4537C11.3831 8.24533 12.8606 6.48578 14.0271 5.60767C14.3189 5.38801 14.6081 5.10089 14.8288 5.09652C15.0494 5.09215 15.1936 5.38049 15.2678 5.74529C15.6033 7.3929 14.2543 9.30801 13.3794 10.552C12.5066 11.7931 11.4888 12.9516 10.3224 14.3736C9.2907 15.6313 8.64477 16.4509 8.64259 16.6716C8.61663 19.2974 14.0184 12.8205 15.5562 11.6158C16.7217 10.7027 17.6685 10.1206 18.1425 10.0824C18.2973 10.0699 18.1119 10.5487 17.8935 10.8425C17.0238 12.0123 15.1324 12.5889 13.0561 14.118C11.4452 15.3044 9.88988 16.8092 9.29681 17.6906C7.94747 19.696 13.6558 16.3111 15.554 15.5466C17.6776 14.6913 19.997 14.4151 20.8336 14.5593C21.1904 14.6207 21.3098 14.9918 21.312 15.3566C21.3169 16.1664 20.589 16.8878 19.8255 17.4328C18.7452 18.204 17.2425 18.4169 15.8205 18.7467C14.5448 18.856 8.91127 19.0023 5.87935 18.2771C5.66091 18.1285 5.37257 18.1285 5.07549 18.1285" stroke="#FF6868" strokeWidth="3.078" strokeLinecap="round"/>
                      <path d="M18.2934 16.3914L13.8951 17.271" stroke="#FF6868" strokeWidth="2.3085" strokeLinecap="round"/>
                      <path d="M1.20564 7.53052C1.20564 7.66949 1.23076 7.94783 1.24999 8.46146C1.26078 8.74973 1.30691 9.00175 1.33243 9.4579C1.35053 9.78162 1.42114 10.1059 1.50357 10.3409C1.57558 10.5461 1.61152 10.7784 1.66235 10.9946C1.71383 11.2137 1.8019 11.4386 1.87805 11.6798C1.95236 11.9152 2.00522 12.1239 2.07471 12.3273C2.14302 12.5272 2.18265 12.7332 2.26508 12.9365C2.34586 13.1357 2.38598 13.3424 2.42386 13.5457C2.46287 13.7551 2.56341 13.9767 2.62052 14.193C2.67656 14.4052 2.75378 14.5989 2.83622 14.8022C2.91699 15.0014 2.98224 15.2081 3.03935 15.4114C3.12197 15.6147 3.17261 15.7796 3.22325 15.8999C3.24877 15.9574 3.2739 16.0076 3.29979 16.0594" stroke="#FF6868" strokeWidth="2.3085" strokeLinecap="round"/>
                      <path d="M1.49436 6.97705C1.47954 7.39579 1.44943 8.37614 1.50155 9.03525C1.52252 9.30048 1.6588 9.52182 1.6889 9.80645C1.72183 10.1178 1.80886 10.4051 1.89086 10.7349C1.96076 11.016 2.00296 11.3486 2.07821 11.6858C2.1433 11.9774 2.1683 12.2176 2.25029 12.4575C2.34605 12.7377 2.42259 13.1009 2.4974 13.3709C2.5874 13.6958 2.70654 14.0435 2.7672 14.4191C2.81033 14.6862 2.91681 14.9133 2.96938 15.1532C3.02814 15.4214 3.14146 15.7813 3.21626 16.0965C3.2891 16.4034 3.44068 16.6502 3.55323 16.9054C3.6556 17.1376 3.75518 17.3844 3.88256 17.6243C4.01713 17.8778 4.21885 18.1032 4.41407 18.373C4.5697 18.5881 4.80293 18.7179 5.04285 18.8751C5.26457 19.0205 5.55144 19.0773 5.82147 19.1227C6.14075 19.1763 6.40509 19.2274 6.67512 19.3172C6.97532 19.4171 7.3477 19.3774 8.33097 19.4147C9.0433 19.4417 10.393 19.4224 11.1177 19.4149C12.1414 19.4045 12.6502 19.3478 13.2783 19.3251C13.5946 19.2727 13.8929 19.2426 14.3346 19.2054C14.477 19.1977 14.6549 19.1977 14.973 19.1528" stroke="#FF6868" strokeWidth="2.3085" strokeLinecap="round"/>
                      <path d="M1.51045 9.62451C1.47238 10.0399 1.52264 10.8543 1.61802 11.1022C1.69743 11.3086 1.76404 11.5146 1.84647 11.7179C1.92725 11.9171 1.99249 12.1238 2.0496 12.3271C2.06433 12.3795 2.09377 12.4284 2.10671 12.3915C2.21994 12.0684 2.05646 11.8466 1.99934 11.6117C1.94331 11.3812 1.86608 11.1361 1.81525 10.8504C1.76039 10.542 1.72672 10.1842 1.66923 10.0559C1.52905 9.74307 1.73891 10.5505 1.73891 10.5827C1.73891 10.8425 1.68827 10.1454 1.65666 10.0944C1.42831 9.72569 1.61173 11.2861 1.65628 11.4957C1.70532 11.7265 1.72596 11.9334 1.77679 12.1367C1.82762 12.3401 1.85313 12.5677 1.91634 12.7966C1.98812 13.0565 2.03056 13.2912 2.113 13.5075C2.18715 13.702 2.208 13.9133 2.24017 14.1483C2.27094 14.3729 2.3603 14.6238 2.43036 14.878C2.49821 15.1241 2.56362 15.3221 2.67766 15.5255C2.7839 15.7149 2.85528 15.9313 2.95066 16.1663C3.03545 16.3751 3.15988 16.5786 3.29315 16.8135C3.41257 17.0241 3.56577 17.251 3.71826 17.442C3.88794 17.6545 4.11101 17.8602 4.36497 18.0259C4.78456 18.2995 5.20149 18.4824 5.7791 18.6353C6.0092 18.6962 6.55736 18.6865 7.31792 18.6739C7.8285 18.6655 8.08419 18.5852 8.20451 18.522C8.31226 18.4337 8.40174 18.3316 8.47142 18.2303C8.5034 18.1793 8.52853 18.1291 8.55442 18.0773" stroke="#FF6868" strokeWidth="2.3085" strokeLinecap="round"/>
                      <path d="M7.48147 13.1545L7.49933 13.3074" stroke="#0D0D0D" strokeWidth="1.125" strokeLinecap="round"/>
                      <path d="M10.5594 12.6929L10.5773 12.8457" stroke="#0D0D0D" strokeWidth="1.125" strokeLinecap="round"/>
                      <path d="M5.48064 11.1538L7.50448 11.5386" stroke="#0D0D0D" strokeWidth="0.9" strokeLinecap="round"/>
                      <path d="M10.2518 14.8595C9.38773 14.8139 8.56652 14.9042 8.15454 15.0187C7.72769 15.1374 7.42503 15.6935 7.27151 16.0142C7.09298 16.3872 7.19463 16.7898 7.29318 16.9645C7.42933 17.2059 8.31376 17.1406 8.85166 17.0649C9.16979 17.0201 9.41419 16.9736 9.89163 16.8824C10.9772 16.6749 11.3906 16.6853 11.6123 16.4951C11.9373 16.2162 11.5612 15.2582 11.3399 14.9665C11.2866 14.9357 11.2263 14.9206 11.105 14.9129C10.9836 14.9051 10.8029 14.9051 10.4799 14.8595" stroke="#0D0D0D" strokeWidth="0.9" strokeLinecap="round"/>
                      <path d="M9.94373 11.2009L11.1931 10.5381" stroke="#0D0D0D" strokeWidth="0.9" strokeLinecap="round"/>
                    </svg>
                  );
                case "sadness":
                  return (
                    <svg width={width} height={height} viewBox="0 0 19 25" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
                      <path d="M8.16696 2.87451C7.90412 3.84827 6.85595 5.94621 6.20202 7.09493C5.91243 7.60364 5.68743 8.04415 5.26587 8.70401C4.90213 9.27335 4.606 10.074 4.28894 10.802C3.98021 11.5108 3.86658 12.2654 3.60256 12.9003C3.41946 13.3406 3.23324 14.0846 2.98228 14.9448C2.82188 15.4946 2.86274 16.8238 2.95457 17.7691C3.01756 18.4175 3.41533 18.917 3.86381 19.734C4.16451 20.2818 4.86409 20.6587 5.46022 21.0027C5.97224 21.2981 6.55511 21.3997 7.90927 21.5311C9.87172 21.7216 10.4074 21.4789 10.9358 21.4001C11.4435 21.3244 11.8593 21.1891 12.387 20.9916C13.0683 20.7365 13.3904 20.2138 13.7732 19.8049C14.1975 19.3516 14.2882 18.7365 14.4734 18.3138C14.6461 17.9198 14.7109 17.3653 14.7509 16.8887C14.7935 16.381 14.9485 15.8073 14.9623 12.7958C14.9673 11.712 14.7125 11.2948 14.4485 10.6749C14.2339 10.1711 13.9478 9.52775 13.6307 8.90668C13.3452 8.34749 13.05 7.89057 12.7599 7.4021C12.4951 6.95643 12.0747 6.46713 11.7046 5.95056C11.328 5.42498 10.9663 5.04053 10.5962 4.67043C10.1208 4.19502 9.69964 3.87836 9.35566 3.5225C9.19367 3.35492 9.0386 3.19197 8.85453 3.07322C8.75946 3.01189 8.61821 3.03285 8.53786 3.09816C8.13999 3.42155 8.3253 5.2622 8.25959 6.38203C8.19922 7.41076 8.00863 8.83424 7.91679 9.53527C7.81984 10.2753 7.69195 10.8419 7.36341 12.7891C7.20805 13.7098 7.0602 14.8225 6.83497 16.1438C6.78963 16.4097 6.76886 16.5673 7.17341 16.0341C7.57795 15.5009 8.41396 14.2731 9.07976 13.1833C9.74556 12.0936 10.2158 11.1792 10.5234 10.7996C10.8309 10.42 10.9616 10.6028 11.055 10.8407C11.2542 11.3481 11.2806 12.3936 11.2941 13.7501C11.316 15.956 10.5159 17.1761 10.4763 17.2565C10.1253 17.9689 11.1452 15.3624 11.8459 14.9349C11.973 14.8573 12.0968 14.908 12.216 14.9864C12.5026 15.1749 12.6526 15.4875 12.7318 15.8026C12.7835 16.0085 12.7587 16.3267 12.7195 16.5273C12.6615 16.8246 11.4239 16.8872 10.3334 17.1235C9.71692 17.2571 9.33072 17.9401 9.11697 18.3636C9.14231 18.4436 9.2468 18.4958 9.35289 18.562C9.45897 18.6281 9.56347 18.7064 9.67114 18.7872" stroke="#C8E1FF" strokeWidth="5.7475" strokeLinecap="round"/>
                      <path d="M13.6746 10.218C13.7843 10.7679 13.9601 11.1632 14.1805 11.4838C14.393 11.7927 14.555 12.1771 14.7754 12.541C14.9978 12.908 15.0838 13.3008 15.1836 13.6864C15.2523 13.9519 15.2166 14.205 15.2497 14.8715C15.3901 17.7051 15.019 18.0597 14.9198 18.4127C14.8144 18.7879 14.5788 19.1172 14.4023 19.4702C14.2297 19.8154 13.9839 20.1087 13.7308 20.385C13.389 20.5727 13.1247 20.6831 12.9052 20.7161C12.773 20.7274 12.5985 20.7274 12.4187 20.7274" stroke="#C8E1FF" strokeWidth="5.7475" strokeLinecap="round"/>
                      <path d="M12.3526 7.83838C12.5945 8.05782 12.8576 8.54032 13.1448 9.02646C13.3859 9.43465 13.4974 9.79748 13.7287 10.0956C13.9616 10.3957 14.0261 10.7889 14.1369 11.1419C14.2496 11.5014 14.4888 11.8465 14.7202 12.1446C14.9592 12.4526 15.0401 12.8379 15.1723 13.1909C15.3046 13.5443 15.3045 13.9616 15.316 15.9164C15.3204 16.657 15.0414 17.0456 14.821 17.421C14.636 17.7361 14.3157 18.1032 13.9951 18.435C13.8305 18.4799 13.6097 18.5235 13.346 18.6005C13.2132 18.6339 13.0823 18.6557 12.9475 18.6782" stroke="#C8E1FF" strokeWidth="5.7475" strokeLinecap="round"/>
                      <path d="M10.5292 8.38184L10.8142 8.47545" stroke="#0D0D0D" strokeWidth="1.25" strokeLinecap="round"/>
                      <path d="M7.04643 8.97534L7.33145 8.88173" stroke="#0D0D0D" strokeWidth="1.25" strokeLinecap="round"/>
                      <path d="M7.36467 12.4374C7.59384 12.3749 8.0244 12.2073 8.59685 11.9865C9.05472 11.8698 9.51905 11.7647 10.0855 11.6386C10.3915 11.5854 10.7353 11.5542 11.0895 11.522" stroke="#0D0D0D" strokeLinecap="round"/>
                    </svg>
                  );
                case "anxiety":
                  return (
                    <svg width={width} height={height} viewBox="0 0 25 17" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
                      <path d="M6.51287 4.97408C5.92107 4.94594 4.55499 5.05765 3.9001 5.45587C3.36039 5.78405 2.59541 6.56186 2.07994 7.13234C1.64368 7.61515 1.71028 8.29632 1.68043 9.81461C1.66583 10.5578 1.99168 10.9978 2.26242 11.4531C2.53738 11.9156 3.09853 12.2769 4.05061 12.7608C5.0324 13.2598 6.56745 12.8482 7.17757 12.6214C8.39706 12.168 8.9261 11.8829 9.32561 11.5273C9.82274 11.0849 9.98008 10.2354 10.2214 9.08809C10.5147 7.69345 10.2368 6.65225 10.166 6.42543C9.95046 5.73473 9.01649 5.20261 8.47629 5.11648C7.92378 5.0284 7.48157 4.9178 5.68146 4.93101C5.16349 4.93482 4.86624 5.28533 4.48336 5.58293C3.71287 6.18182 3.78413 8.17353 4.12351 9.90074C4.2291 10.4381 4.57887 10.7147 4.86198 10.8852C5.54581 11.2972 6.33891 10.3207 6.97931 9.79458C7.50946 9.35903 7.70584 8.69967 7.84782 8.31679C7.97471 7.97462 7.96252 7.39414 7.75147 7.20525C6.85615 6.40398 6.51458 9.51744 6.16026 9.6931C4.95682 10.2897 5.54672 7.50244 5.50409 7.80004C5.48959 7.95694 5.48959 8.12578 5.51773 8.26904C5.54587 8.4123 5.60215 8.52486 5.66014 8.64083" stroke="#AFECB2" strokeWidth="3.36" strokeLinecap="round"/>
                      <path d="M15.3677 4.39948C14.3256 4.39948 11.4826 4.51204 10.467 4.78193C9.76454 4.9686 9.71235 6.24138 9.58359 7.23737C9.46418 8.16098 9.65351 9.02981 9.82363 9.49839C10.0415 10.0984 10.6759 10.5085 11.1023 10.7374C11.5965 11.0028 12.0966 11.1361 12.9459 11.2068C14.3498 11.3238 15.6482 10.8837 16.2588 10.2454C17.0047 9.46563 16.8736 8.55399 16.9167 7.95452C16.9698 7.21453 16.8753 6.25161 16.6617 5.6095C16.5023 5.13049 16.0243 4.68599 15.4696 4.34362C14.764 3.90811 14.0357 3.94582 13.267 3.87377C12.025 3.75735 10.1404 3.9714 9.74092 4.31292C9.35837 4.63994 9.17172 5.19251 8.83148 5.98812C8.53743 6.67569 8.48953 7.38063 8.48868 8.77143C8.48816 9.61682 8.82892 10.1674 9.07067 10.6227C9.33355 11.1179 9.73793 11.4755 10.2351 11.7888C10.6505 12.0507 11.2711 12.0451 13.6528 12.0319C14.657 12.0263 15.1374 11.5641 15.6218 11.2367C16.0406 10.9535 16.6144 10.5136 17.0719 9.9303C17.5204 9.35839 17.5831 8.41244 17.6278 7.50086C17.6638 6.76936 16.6792 6.33518 15.9117 6.00645C15.0701 5.64598 13.6699 5.76385 12.4061 5.84827C11.636 5.89971 11.3325 6.44433 11.0916 6.88306C10.4591 8.03516 10.5924 8.91555 10.6909 9.38498C11.0812 11.2454 14.7699 6.47588 14.8415 6.34711C15.4888 5.1836 13.5488 9.45703 13.6046 9.69921C14.2011 9.34703 14.5704 8.83539 14.8398 8.63585C14.9686 8.60515 15.0812 8.71771 15.2824 8.83368" stroke="#AFECB2" strokeWidth="3.36" strokeLinecap="round"/>
                      <path d="M20.3201 3.46883C18.3051 3.38355 17.339 3.43984 16.7548 3.62445C16.5149 3.70027 16.2287 3.89348 15.9447 4.21966C15.5258 4.70084 15.6301 6.66487 15.729 7.94311C15.7985 8.84061 16.198 9.49253 16.4815 10.0046C16.7351 10.4625 17.3049 10.6028 18.0847 10.8441C18.8544 11.0823 19.5791 10.8032 19.9198 10.6331C20.4094 10.3886 20.8011 9.83874 21.1716 9.26954C21.5606 8.67186 21.5702 7.87746 21.557 6.09098C21.554 5.68544 21.4304 5.51879 21.2321 5.34739C20.2504 4.49872 18.792 4.37955 18.1047 4.25078C17.6552 4.16656 15.845 4.15101 14.6089 4.51854C13.7622 4.77031 13.9536 6.27772 13.9387 7.76958C13.9301 8.62671 14.3783 9.06616 14.8886 9.74749C15.5481 10.6279 15.8842 10.9712 16.3387 11.1711C16.9446 11.4377 18.572 11.5698 19.8622 11.2871C20.8824 11.0636 21.4253 10.4919 22.0094 10.0933C22.5834 9.70152 22.8766 9.12756 23.1192 8.45987C23.5025 7.40493 23.1068 5.63135 22.9359 5.14786C22.6808 4.42655 21.971 4.03845 21.36 3.76813C20.8222 3.5302 19.5902 3.63937 18.4189 4.06361C18.0016 4.21477 17.8199 4.77351 17.6494 5.29836C17.5121 5.72085 17.6195 6.11059 17.6903 6.42269C17.7233 6.56846 17.7892 6.67851 17.9026 6.69429C18.1903 6.7343 18.4432 6.39796 18.5993 6.11443C18.8783 5.60746 17.281 9.31687 17.0235 10.5427C16.9758 10.7694 16.9945 10.9132 17.0789 10.8309C18.3225 9.61867 19.4384 7.96102 19.5377 7.84676C19.9399 7.38419 19.8085 9.29469 19.8648 9.39489C19.9764 9.59358 20.234 8.95616 20.3619 8.68669C20.4054 8.55793 20.4054 8.44537 20.3632 8.31704C20.321 8.1887 20.2365 8.048 19.979 7.64722" stroke="#AFECB2" strokeWidth="3.36" strokeLinecap="round"/>
                      <path d="M8.42996 3.47688C8.55184 3.23099 9.15592 2.6615 9.44013 2.47522C9.72929 2.2857 10.0607 2.1644 10.38 2.03161C10.8343 1.84273 11.1603 1.79184 11.647 1.72957C13.134 1.53932 14.0343 1.95044 14.3366 2.04837C14.8668 2.22011 15.5427 2.73069 15.8269 2.94385C16.1029 3.15085 16.3942 3.35127 16.7934 3.76801C16.9094 3.93672 16.9983 4.07936 17.0957 4.22093C17.1404 4.29225 17.1755 4.3625 17.265 4.48811" stroke="#AFECB2" strokeWidth="3.36" strokeLinecap="round"/>
                      <path d="M9.42996 13.3557C9.55397 13.5324 9.73014 13.7804 10.0143 13.9319C10.2943 14.081 10.6349 14.136 10.9191 14.1982C11.198 14.2593 11.4865 14.2956 11.7707 14.3225C12.0774 14.3515 13.4802 14.4202 14.3254 14.3672C14.6225 14.3486 14.8928 14.137 15.2211 13.942C15.5144 13.7112 15.7975 13.4632 16.0288 13.1971C16.0823 13.1258 16.135 13.0555 16.2425 12.9299" stroke="#AFECB2" strokeWidth="3.36" strokeLinecap="round"/>
                      <path d="M10.3799 6.76782V6.91184" stroke="#0D0D0D" strokeWidth="1.25" strokeLinecap="round"/>
                      <path d="M13.98 6.67993V6.77594" stroke="#0D0D0D" strokeWidth="1.25" strokeLinecap="round"/>
                      <path d="M9.17996 10.4481C9.22124 10.3036 9.32507 10.1363 9.4708 9.98524C9.56165 9.89108 9.65906 9.88517 9.7474 9.89549C9.9657 9.92099 10.1794 10.1035 10.3625 10.2027C10.5252 10.2909 10.6698 10.4268 10.8628 10.4378C11.1185 10.4523 11.3784 10.1047 11.6336 9.9277C11.8664 9.76624 12.1703 9.69753 12.415 9.71301C12.6839 9.73002 12.8276 9.94709 13.0465 10.0672C13.1385 10.1176 13.379 10.1354 13.6967 10.1199C13.9569 10.1072 14.0785 9.90643 14.4113 9.69331C14.8936 9.38435 15.2037 9.41607 15.4026 9.45235C15.4858 9.48863 15.5696 9.53053 15.6477 9.57729C15.6844 9.6034 15.7154 9.63436 15.8411 9.7288" stroke="#0D0D0D" strokeLinecap="round"/>
                    </svg>
                  );
                case "neutral":
                  return (
                    <svg width={width} height={height} viewBox="0 0 24 18" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
                      <path d="M3.45488 5.1749C2.83252 5.53053 2.423 5.89156 2.26606 6.29435C1.91844 7.18652 2.01886 7.95534 1.99528 10.2845C1.98194 11.6032 2.4203 12.4008 2.82443 13.2542C3.26348 14.1814 4.07995 14.602 4.93335 15.1193C5.70624 15.5878 6.50476 15.6797 12.3674 15.7949C14.1434 15.8298 15.0347 15.5935 16.3374 15.3018C17.3674 15.0712 18.09 14.9199 19.167 14.4276C20.2092 13.9511 20.337 12.6352 20.7862 11.309C21.1051 10.3677 21.1021 7.22251 20.9681 5.31231C20.9103 4.48879 20.0271 3.83047 19.0855 3.20137C18.0986 2.54201 17.0203 2.34595 15.8079 2.12233C15.0055 1.97432 10.635 1.94182 7.79193 2.09808C6.88133 2.14813 6.19762 2.52377 5.03102 3.10707C4.21519 3.51499 3.72701 4.31813 3.32152 5.03749C2.93586 5.72167 2.82713 6.47352 2.84801 10.0104C2.85667 11.478 3.81052 12.0425 4.46253 12.582C4.87885 12.9265 5.38396 13.0771 6.94257 13.2785C10.8767 13.7868 14.0917 13.5284 15.0111 13.3041C15.6193 13.1687 16.0706 13.034 16.563 12.8548C16.8331 12.7645 17.1443 12.6756 17.5996 12.584" stroke="#D9D9D9" strokeWidth="3.99" strokeLinecap="round"/>
                      <path d="M8.55797 2.05591C7.93997 2.17976 7.48669 2.26149 6.98077 2.32404C6.60082 2.37101 6.28908 2.57111 5.85562 2.73645C5.50019 2.87202 5.09272 3.00458 4.71994 3.11852C4.37077 3.22524 3.89635 3.68326 3.54308 4.04675C3.23183 4.36701 2.96502 4.75826 2.7585 5.04775C2.53431 5.36202 2.57243 5.74904 2.43836 6.07971C2.03678 7.0702 2.44734 8.96907 2.5715 9.28952C2.70904 9.64452 3.06534 10.0626 3.78644 10.702C4.26154 11.1232 5.20851 11.22 6.08535 11.1392C6.71917 11.0808 6.59685 10.1078 6.59715 9.11397C6.59741 8.30376 6.51572 6.87357 6.44327 6.42276C6.28377 5.43028 6.18443 8.12257 6.15347 8.65666C6.13319 9.00641 6.14294 9.51771 6.51077 8.98393C6.8786 8.45015 7.61425 6.85623 8.09539 5.91251C8.57654 4.9688 8.78089 4.72358 8.98833 5.41465C9.19578 6.10571 9.40013 7.7405 9.5054 8.72571C9.61067 9.71091 9.61067 9.997 9.61067 10.0116C9.61067 10.0261 9.61067 9.76045 9.75371 8.7449C9.89675 7.72935 10.1828 5.97196 10.6776 6.12925C11.1724 6.28653 11.8672 8.41176 12.2455 9.54744C12.6239 10.6831 12.6647 10.7649 12.7062 10.7457C12.7477 10.7265 12.7886 10.6039 13.0344 9.50873C13.2803 8.41361 13.7298 6.3497 14.3701 6.19581C15.0104 6.04193 15.8278 7.86063 16.4021 8.43993C16.9765 9.01922 17.283 8.30401 17.4716 7.89469C17.7021 7.39427 17.8868 7.09464 18.0824 6.80514C18.1461 6.71093 18.2577 6.84261 18.3407 7.00763C18.9526 8.22466 18.8992 10.0001 18.8583 10.4026C18.8398 10.5854 17.5889 10.846 15.4476 11.3921C14.3769 11.6652 13.3063 11.7953 12.4319 11.8795C10.9084 12.0262 9.94382 11.9024 9.4797 11.7789C9.29745 11.7303 9.24037 11.6553 9.17813 11.5216C9.02628 11.1952 8.95056 10.646 8.88864 9.64992C8.71337 6.83071 8.97038 6.29025 9.18649 5.95803C9.63408 5.26998 10.5389 4.53347 10.6829 4.43037C10.8414 4.31681 11.7495 4.34708 13.0487 4.36752C14.2981 4.38717 14.9138 4.5118 16.478 4.69726C17.0748 4.76802 17.3499 5.17067 17.6592 5.55274C17.7827 5.70693 17.9666 5.95215 18.1023 6.08869C18.2379 6.22523 18.3196 6.24566 18.4038 6.26672" stroke="#D9D9D9" strokeWidth="3.99" strokeLinecap="round"/>
                      <path d="M7.77397 9.72778V9.90781" stroke="#0D0D0D" strokeWidth="1.25" strokeLinecap="round"/>
                      <path d="M10.524 9.72778V9.8478" stroke="#0D0D0D" strokeWidth="1.25" strokeLinecap="round"/>
                      <path d="M7.72112 12.4793C8.23958 12.5393 8.95728 12.4601 9.62907 12.4094C9.91861 12.3797 10.3387 12.3593 10.9468 12.3494C11.2778 12.3395 11.654 12.3197 12.0417 12.2993" stroke="#0D0D0D" strokeLinecap="round"/>
                    </svg>
                  );
                case "happiness":
                  return (
                    <svg width={width} height={height} viewBox="0 0 25 22" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
                      <path d="M8.00683 6.81467C6.42866 5.91381 5.2298 5.16198 3.60987 5.12022C3.25014 5.11094 3.0443 5.4555 2.8919 5.71966C2.58895 6.24477 2.58823 7.40845 2.73725 8.79922C2.93374 10.6332 5.88907 10.9508 7.58802 11.4408C7.90187 11.5313 7.93006 11.9262 7.67042 12.3405C6.36916 14.4168 5.07627 15.9089 4.65859 17.4215C4.57742 17.7155 4.62021 18.0221 4.76922 18.2501C4.91823 18.4782 5.21626 18.6272 5.6678 18.7039C6.11935 18.7807 6.71539 18.7807 7.1342 18.5199C10.673 16.3165 8.15584 8.25059 8.83203 6.85756C9.43549 5.61439 10.6348 4.56142 12.2525 3.46981C13.6379 2.53492 15.5206 2.52493 17.0333 2.78683C17.3515 2.84192 17.6339 3.04873 17.8246 3.27451C18.2036 3.72298 18.1667 4.40338 18.0177 5.00394C17.5794 6.7702 15.2406 7.93901 12.3823 9.33091C11.5103 9.75556 10.8697 10.0477 10.3808 10.7228C9.87312 11.424 10.0388 12.4545 10.1506 13.2436C10.3338 14.5373 12.5088 15.9856 14.0982 17.347C14.6368 17.8083 15.3039 17.9521 15.9789 18.0278C18.1336 18.2692 20.3431 16.4507 21.2124 15.1751C21.9311 14.1204 21.1785 12.8383 20.841 12.2378C20.0406 10.8137 18.4737 9.90325 16.8933 8.88839C16.1905 8.43706 15.4619 8.16929 14.5611 8.31831C13.5689 8.48243 12.9761 9.29592 12.6375 10.0071C12.422 10.4595 12.5223 11.2398 12.7458 11.8472C13.5015 13.9005 15.6019 14.0349 17.4442 14.8274C17.9085 15.0271 18.3834 14.9425 18.651 14.7935C18.9185 14.6445 18.993 14.3465 19.0314 14.0067C19.0698 13.6669 19.0698 13.2944 18.8835 12.9907C18.3247 12.4635 17.6429 12.1587 17.0051 12.0086C16.6653 11.933 16.2928 11.8585 15.9089 11.7817" stroke="#FFF06C" strokeWidth="5.28" strokeLinecap="round"/>
                      <path d="M8.74672 10.0789C8.74672 10.0214 8.80418 9.84818 8.94871 9.60179C9.1507 9.44159 9.38403 9.35366 9.61561 9.31013C9.73228 9.29533 9.8472 9.29533 10.1397 9.46945" stroke="#0D0D0D" strokeLinecap="round"/>
                      <path d="M12.9967 8.90183C12.9967 8.84437 13.0255 8.69985 13.1264 8.49699C13.1987 8.40905 13.3136 8.35159 13.5309 8.32199C13.7481 8.29239 14.0641 8.29239 14.4768 8.37945" stroke="#0D0D0D" strokeLinecap="round"/>
                      <path d="M11.9967 11.4025C11.9967 11.5174 11.9967 12.2374 12.1691 13.2386C12.2339 13.6147 12.6863 13.579 12.907 13.5359C13.2338 13.4721 13.3601 13.2029 13.4616 12.9713C13.5589 12.749 13.5639 12.3915 13.5208 12.0001C13.1877 11.5487 12.8682 11.2292 12.6371 11.0986C12.4921 11.0542 12.291 11.0542 12.0838 11.0542" stroke="#0D0D0D" strokeLinecap="round"/>
                    </svg>
                  );
                default:
                  return null;
              }
            };
            
            return (
              <S.MonthCalendarCharacter
                key={`month-char-${index}`}
                style={{
                  position: 'absolute',
                  left: `${left}px`,
                  top: `${top}px`,
                  width: `${size.width}px`,
                  height: `${size.height}px`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {renderSmallCharacter(emotion.character, size.width, size.height)}
              </S.MonthCalendarCharacter>
            );
          })}
        </S.MonthChartSection>
      ) : (
        <S.ChartSection>
          <S.ChartTitle>
            {selectedPeriod === "Week" ? "이번주 감정 로그" : "오늘의 감정 트래커"}
          </S.ChartTitle>

        {/* 차트 영역 */}
        <S.ChartArea>
          {/* Daily 뷰 - 그리드 라인 */}
          {selectedPeriod === "Daily" && (
            <>
              <S.GridLine $top={60} />
              <S.GridLine $top={96} />
              <S.GridLine $top={132} />
              <S.GridLine $top={168} />
              <S.GridLine $top={204} />
              <S.GridLine $top={240} />

              {/* X축 라벨 */}
              <S.XAxisLabel $left={42}>3</S.XAxisLabel>
              <S.XAxisLabel $left={80.86}>6</S.XAxisLabel>
              <S.XAxisLabel $left={119.71}>9</S.XAxisLabel>
              <S.XAxisLabel $left={158.57}>12</S.XAxisLabel>
              <S.XAxisLabel $left={197.43}>15</S.XAxisLabel>
              <S.XAxisLabel $left={236.29}>18</S.XAxisLabel>
              <S.XAxisLabel $left={275.14}>21</S.XAxisLabel>
              <S.XAxisLabel $left={314}>24</S.XAxisLabel>
            </>
          )}

          {/* Daily 뷰 - 감정 캐릭터들 */}
          {selectedPeriod === "Daily" && (
            <>
          <S.EmotionCharacter $left={16} $top={52}>
            {/* 행복 */}
            <svg width="25" height="22" viewBox="0 0 25 22" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8.00683 6.81467C6.42866 5.91381 5.2298 5.16198 3.60987 5.12022C3.25014 5.11094 3.0443 5.4555 2.8919 5.71966C2.58895 6.24477 2.58823 7.40845 2.73725 8.79922C2.93374 10.6332 5.88907 10.9508 7.58802 11.4408C7.90187 11.5313 7.93006 11.9262 7.67042 12.3405C6.36916 14.4168 5.07627 15.9089 4.65859 17.4215C4.57742 17.7155 4.62021 18.0221 4.76922 18.2501C4.91823 18.4782 5.21626 18.6272 5.6678 18.7039C6.11935 18.7807 6.71539 18.7807 7.1342 18.5199C10.673 16.3165 8.15584 8.25059 8.83203 6.85756C9.43549 5.61439 10.6348 4.56142 12.2525 3.46981C13.6379 2.53492 15.5206 2.52493 17.0333 2.78683C17.3515 2.84192 17.6339 3.04873 17.8246 3.27451C18.2036 3.72298 18.1667 4.40338 18.0177 5.00394C17.5794 6.7702 15.2406 7.93901 12.3823 9.33091C11.5103 9.75556 10.8697 10.0477 10.3808 10.7228C9.87312 11.424 10.0388 12.4545 10.1506 13.2436C10.3338 14.5373 12.5088 15.9856 14.0982 17.347C14.6368 17.8083 15.3039 17.9521 15.9789 18.0278C18.1336 18.2692 20.3431 16.4507 21.2124 15.1751C21.9311 14.1204 21.1785 12.8383 20.841 12.2378C20.0406 10.8137 18.4737 9.90325 16.8933 8.88839C16.1905 8.43706 15.4619 8.16929 14.5611 8.31831C13.5689 8.48243 12.9761 9.29592 12.6375 10.0071C12.422 10.4595 12.5223 11.2398 12.7458 11.8472C13.5015 13.9005 15.6019 14.0349 17.4442 14.8274C17.9085 15.0271 18.3834 14.9425 18.651 14.7935C18.9185 14.6445 18.993 14.3465 19.0314 14.0067C19.0698 13.6669 19.0698 13.2944 18.8835 12.9907C18.3247 12.4635 17.6429 12.1587 17.0051 12.0086C16.6653 11.933 16.2928 11.8585 15.9089 11.7817" stroke="#FFF06C" strokeWidth="5.28" strokeLinecap="round"/>
              <path d="M8.74672 10.0789C8.74672 10.0214 8.80418 9.84818 8.94871 9.60179C9.1507 9.44159 9.38403 9.35366 9.61561 9.31013C9.73228 9.29533 9.8472 9.29533 10.1397 9.46945" stroke="#0D0D0D" strokeLinecap="round"/>
              <path d="M12.9967 8.90183C12.9967 8.84437 13.0255 8.69985 13.1264 8.49699C13.1987 8.40905 13.3136 8.35159 13.5309 8.32199C13.7481 8.29239 14.0641 8.29239 14.4768 8.37945" stroke="#0D0D0D" strokeLinecap="round"/>
              <path d="M11.9967 11.4025C11.9967 11.5174 11.9967 12.2374 12.1691 13.2386C12.2339 13.6147 12.6863 13.579 12.907 13.5359C13.2338 13.4721 13.3601 13.2029 13.4616 12.9713C13.5589 12.749 13.5639 12.3915 13.5208 12.0001C13.1877 11.5487 12.8682 11.2292 12.6371 11.0986C12.4921 11.0542 12.291 11.0542 12.0838 11.0542" stroke="#0D0D0D" strokeLinecap="round"/>
            </svg>
          </S.EmotionCharacter>

          <S.EmotionCharacter $left={16} $top={89}>
            {/* 중립 */}
            <svg width="24" height="18" viewBox="0 0 24 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3.45488 5.1749C2.83252 5.53053 2.423 5.89156 2.26606 6.29435C1.91844 7.18652 2.01886 7.95534 1.99528 10.2845C1.98194 11.6032 2.4203 12.4008 2.82443 13.2542C3.26348 14.1814 4.07995 14.602 4.93335 15.1193C5.70624 15.5878 6.50476 15.6797 12.3674 15.7949C14.1434 15.8298 15.0347 15.5935 16.3374 15.3018C17.3674 15.0712 18.09 14.9199 19.167 14.4276C20.2092 13.9511 20.337 12.6352 20.7862 11.309C21.1051 10.3677 21.1021 7.22251 20.9681 5.31231C20.9103 4.48879 20.0271 3.83047 19.0855 3.20137C18.0986 2.54201 17.0203 2.34595 15.8079 2.12233C15.0055 1.97432 10.635 1.94182 7.79193 2.09808C6.88133 2.14813 6.19762 2.52377 5.03102 3.10707C4.21519 3.51499 3.72701 4.31813 3.32152 5.03749C2.93586 5.72167 2.82713 6.47352 2.84801 10.0104C2.85667 11.478 3.81052 12.0425 4.46253 12.582C4.87885 12.9265 5.38396 13.0771 6.94257 13.2785C10.8767 13.7868 14.0917 13.5284 15.0111 13.3041C15.6193 13.1687 16.0706 13.034 16.563 12.8548C16.8331 12.7645 17.1443 12.6756 17.5996 12.584" stroke="#D9D9D9" strokeWidth="3.99" strokeLinecap="round"/>
              <path d="M8.55797 2.05591C7.93997 2.17976 7.48669 2.26149 6.98077 2.32404C6.60082 2.37101 6.28908 2.57111 5.85562 2.73645C5.50019 2.87202 5.09272 3.00458 4.71994 3.11852C4.37077 3.22524 3.89635 3.68326 3.54308 4.04675C3.23183 4.36701 2.96502 4.75826 2.7585 5.04775C2.53431 5.36202 2.57243 5.74904 2.43836 6.07971C2.03678 7.0702 2.44734 8.96907 2.5715 9.28952C2.70904 9.64452 3.06534 10.0626 3.78644 10.702C4.26154 11.1232 5.20851 11.22 6.08535 11.1392C6.71917 11.0808 6.59685 10.1078 6.59715 9.11397C6.59741 8.30376 6.51572 6.87357 6.44327 6.42276C6.28377 5.43028 6.18443 8.12257 6.15347 8.65666C6.13319 9.00641 6.14294 9.51771 6.51077 8.98393C6.8786 8.45015 7.61425 6.85623 8.09539 5.91251C8.57654 4.9688 8.78089 4.72358 8.98833 5.41465C9.19578 6.10571 9.40013 7.7405 9.5054 8.72571C9.61067 9.71091 9.61067 9.997 9.61067 10.0116C9.61067 10.0261 9.61067 9.76045 9.75371 8.7449C9.89675 7.72935 10.1828 5.97196 10.6776 6.12925C11.1724 6.28653 11.8672 8.41176 12.2455 9.54744C12.6239 10.6831 12.6647 10.7649 12.7062 10.7457C12.7477 10.7265 12.7886 10.6039 13.0344 9.50873C13.2803 8.41361 13.7298 6.3497 14.3701 6.19581C15.0104 6.04193 15.8278 7.86063 16.4021 8.43993C16.9765 9.01922 17.283 8.30401 17.4716 7.89469C17.7021 7.39427 17.8868 7.09464 18.0824 6.80514C18.1461 6.71093 18.2577 6.84261 18.3407 7.00763C18.9526 8.22466 18.8992 10.0001 18.8583 10.4026C18.8398 10.5854 17.5889 10.846 15.4476 11.3921C14.3769 11.6652 13.3063 11.7953 12.4319 11.8795C10.9084 12.0262 9.94382 11.9024 9.4797 11.7789C9.29745 11.7303 9.24037 11.6553 9.17813 11.5216C9.02628 11.1952 8.95056 10.646 8.88864 9.64992C8.71337 6.83071 8.97038 6.29025 9.18649 5.95803C9.63408 5.26998 10.5389 4.53347 10.6829 4.43037C10.8414 4.31681 11.7495 4.34708 13.0487 4.36752C14.2981 4.38717 14.9138 4.5118 16.478 4.69726C17.0748 4.76802 17.3499 5.17067 17.6592 5.55274C17.7827 5.70693 17.9666 5.95215 18.1023 6.08869C18.2379 6.22523 18.3196 6.24566 18.4038 6.26672" stroke="#D9D9D9" strokeWidth="3.99" strokeLinecap="round"/>
              <path d="M7.77397 9.72778V9.90781" stroke="#0D0D0D" strokeWidth="1.25" strokeLinecap="round"/>
              <path d="M10.524 9.72778V9.8478" stroke="#0D0D0D" strokeWidth="1.25" strokeLinecap="round"/>
              <path d="M7.72112 12.4793C8.23958 12.5393 8.95728 12.4601 9.62907 12.4094C9.91861 12.3797 10.3387 12.3593 10.9468 12.3494C11.2778 12.3395 11.654 12.3197 12.0417 12.2993" stroke="#0D0D0D" strokeLinecap="round"/>
            </svg>
          </S.EmotionCharacter>

          <S.EmotionCharacter $left={16} $top={124}>
            {/* 불안 */}
            <svg width="25" height="17" viewBox="0 0 25 17" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6.51287 4.97408C5.92107 4.94594 4.55499 5.05765 3.9001 5.45587C3.36039 5.78405 2.59541 6.56186 2.07994 7.13234C1.64368 7.61515 1.71028 8.29632 1.68043 9.81461C1.66583 10.5578 1.99168 10.9978 2.26242 11.4531C2.53738 11.9156 3.09853 12.2769 4.05061 12.7608C5.0324 13.2598 6.56745 12.8482 7.17757 12.6214C8.39706 12.168 8.9261 11.8829 9.32561 11.5273C9.82274 11.0849 9.98008 10.2354 10.2214 9.08809C10.5147 7.69345 10.2368 6.65225 10.166 6.42543C9.95046 5.73473 9.01649 5.20261 8.47629 5.11648C7.92378 5.0284 7.48157 4.9178 5.68146 4.93101C5.16349 4.93482 4.86624 5.28533 4.48336 5.58293C3.71287 6.18182 3.78413 8.17353 4.12351 9.90074C4.2291 10.4381 4.57887 10.7147 4.86198 10.8852C5.54581 11.2972 6.33891 10.3207 6.97931 9.79458C7.50946 9.35903 7.70584 8.69967 7.84782 8.31679C7.97471 7.97462 7.96252 7.39414 7.75147 7.20525C6.85615 6.40398 6.51458 9.51744 6.16026 9.6931C4.95682 10.2897 5.54672 7.50244 5.50409 7.80004C5.48959 7.95694 5.48959 8.12578 5.51773 8.26904C5.54587 8.4123 5.60215 8.52486 5.66014 8.64083" stroke="#AFECB2" strokeWidth="3.36" strokeLinecap="round"/>
              <path d="M15.3677 4.39948C14.3256 4.39948 11.4826 4.51204 10.467 4.78193C9.76454 4.9686 9.71235 6.24138 9.58359 7.23737C9.46418 8.16098 9.65351 9.02981 9.82363 9.49839C10.0415 10.0984 10.6759 10.5085 11.1023 10.7374C11.5965 11.0028 12.0966 11.1361 12.9459 11.2068C14.3498 11.3238 15.6482 10.8837 16.2588 10.2454C17.0047 9.46563 16.8736 8.55399 16.9167 7.95452C16.9698 7.21453 16.8753 6.25161 16.6617 5.6095C16.5023 5.13049 16.0243 4.68599 15.4696 4.34362C14.764 3.90811 14.0357 3.94582 13.267 3.87377C12.025 3.75735 10.1404 3.9714 9.74092 4.31292C9.35837 4.63994 9.17172 5.19251 8.83148 5.98812C8.53743 6.67569 8.48953 7.38063 8.48868 8.77143C8.48816 9.61682 8.82892 10.1674 9.07067 10.6227C9.33355 11.1179 9.73793 11.4755 10.2351 11.7888C10.6505 12.0507 11.2711 12.0451 13.6528 12.0319C14.657 12.0263 15.1374 11.5641 15.6218 11.2367C16.0406 10.9535 16.6144 10.5136 17.0719 9.9303C17.5204 9.35839 17.5831 8.41244 17.6278 7.50086C17.6638 6.76936 16.6792 6.33518 15.9117 6.00645C15.0701 5.64598 13.6699 5.76385 12.4061 5.84827C11.636 5.89971 11.3325 6.44433 11.0916 6.88306C10.4591 8.03516 10.5924 8.91555 10.6909 9.38498C11.0812 11.2454 14.7699 6.47588 14.8415 6.34711C15.4888 5.1836 13.5488 9.45703 13.6046 9.69921C14.2011 9.34703 14.5704 8.83539 14.8398 8.63585C14.9686 8.60515 15.0812 8.71771 15.2824 8.83368" stroke="#AFECB2" strokeWidth="3.36" strokeLinecap="round"/>
              <path d="M20.3201 3.46883C18.3051 3.38355 17.339 3.43984 16.7548 3.62445C16.5149 3.70027 16.2287 3.89348 15.9447 4.21966C15.5258 4.70084 15.6301 6.66487 15.729 7.94311C15.7985 8.84061 16.198 9.49253 16.4815 10.0046C16.7351 10.4625 17.3049 10.6028 18.0847 10.8441C18.8544 11.0823 19.5791 10.8032 19.9198 10.6331C20.4094 10.3886 20.8011 9.83874 21.1716 9.26954C21.5606 8.67186 21.5702 7.87746 21.557 6.09098C21.554 5.68544 21.4304 5.51879 21.2321 5.34739C20.2504 4.49872 18.792 4.37955 18.1047 4.25078C17.6552 4.16656 15.845 4.15101 14.6089 4.51854C13.7622 4.77031 13.9536 6.27772 13.9387 7.76958C13.9301 8.62671 14.3783 9.06616 14.8886 9.74749C15.5481 10.6279 15.8842 10.9712 16.3387 11.1711C16.9446 11.4377 18.572 11.5698 19.8622 11.2871C20.8824 11.0636 21.4253 10.4919 22.0094 10.0933C22.5834 9.70152 22.8766 9.12756 23.1192 8.45987C23.5025 7.40493 23.1068 5.63135 22.9359 5.14786C22.6808 4.42655 21.971 4.03845 21.36 3.76813C20.8222 3.5302 19.5902 3.63937 18.4189 4.06361C18.0016 4.21477 17.8199 4.77351 17.6494 5.29836C17.5121 5.72085 17.6195 6.11059 17.6903 6.42269C17.7233 6.56846 17.7892 6.67851 17.9026 6.69429C18.1903 6.7343 18.4432 6.39796 18.5993 6.11443C18.8783 5.60746 17.281 9.31687 17.0235 10.5427C16.9758 10.7694 16.9945 10.9132 17.0789 10.8309C18.3225 9.61867 19.4384 7.96102 19.5377 7.84676C19.9399 7.38419 19.8085 9.29469 19.8648 9.39489C19.9764 9.59358 20.234 8.95616 20.3619 8.68669C20.4054 8.55793 20.4054 8.44537 20.3632 8.31704C20.321 8.1887 20.2365 8.048 19.979 7.64722" stroke="#AFECB2" strokeWidth="3.36" strokeLinecap="round"/>
              <path d="M8.42996 3.47688C8.55184 3.23099 9.15592 2.6615 9.44013 2.47522C9.72929 2.2857 10.0607 2.1644 10.38 2.03161C10.8343 1.84273 11.1603 1.79184 11.647 1.72957C13.134 1.53932 14.0343 1.95044 14.3366 2.04837C14.8668 2.22011 15.5427 2.73069 15.8269 2.94385C16.1029 3.15085 16.3942 3.35127 16.7934 3.76801C16.9094 3.93672 16.9983 4.07936 17.0957 4.22093C17.1404 4.29225 17.1755 4.3625 17.265 4.48811" stroke="#AFECB2" strokeWidth="3.36" strokeLinecap="round"/>
              <path d="M9.42996 13.3557C9.55397 13.5324 9.73014 13.7804 10.0143 13.9319C10.2943 14.081 10.6349 14.136 10.9191 14.1982C11.198 14.2593 11.4865 14.2956 11.7707 14.3225C12.0774 14.3515 13.4802 14.4202 14.3254 14.3672C14.6225 14.3486 14.8928 14.137 15.2211 13.942C15.5144 13.7112 15.7975 13.4632 16.0288 13.1971C16.0823 13.1258 16.135 13.0555 16.2425 12.9299" stroke="#AFECB2" strokeWidth="3.36" strokeLinecap="round"/>
              <path d="M10.3799 6.76782V6.91184" stroke="#0D0D0D" strokeWidth="1.25" strokeLinecap="round"/>
              <path d="M13.98 6.67993V6.77594" stroke="#0D0D0D" strokeWidth="1.25" strokeLinecap="round"/>
              <path d="M9.17996 10.4481C9.22124 10.3036 9.32507 10.1363 9.4708 9.98524C9.56165 9.89108 9.65906 9.88517 9.7474 9.89549C9.9657 9.92099 10.1794 10.1035 10.3625 10.2027C10.5252 10.2909 10.6698 10.4268 10.8628 10.4378C11.1185 10.4523 11.3784 10.1047 11.6336 9.9277C11.8664 9.76624 12.1703 9.69753 12.415 9.71301C12.6839 9.73002 12.8276 9.94709 13.0465 10.0672C13.1385 10.1176 13.379 10.1354 13.6967 10.1199C13.9569 10.1072 14.0785 9.90643 14.4113 9.69331C14.8936 9.38435 15.2037 9.41607 15.4026 9.45235C15.4858 9.48863 15.5696 9.53053 15.6477 9.57729C15.6844 9.6034 15.7154 9.63436 15.8411 9.7288" stroke="#0D0D0D" strokeLinecap="round"/>
            </svg>
          </S.EmotionCharacter>

          <S.EmotionCharacter $left={16} $top={158}>
            {/* 우울 */}
            <svg width="21" height="19" viewBox="0 0 21 19" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1.89052 14.2145C1.68248 10.9243 1.81979 9.47108 2.44132 7.61845C3.564 4.27204 4.52435 3.95376 4.99141 3.4503C5.76809 2.61308 6.80867 2.35807 8.93592 1.99295C12.0721 1.45466 12.8773 2.18123 13.5389 2.4933C14.1832 2.79722 14.8516 4.04738 16.2065 6.197C16.8717 7.2523 17.111 8.07302 17.3544 9.28592C17.3898 9.87468 17.4241 10.2949 17.4761 11.0694C17.4938 11.7065 17.4938 12.8393 17.4938 14.0064" stroke="#E0D0FF" strokeWidth="3.6" strokeLinecap="round"/>
              <path d="M1.89042 14.8387C2.23578 15.4607 2.72052 16.0848 3.42943 16.3636C4.83587 16.9167 5.63105 15.985 6.2401 15.6547C6.75848 15.3736 6.95212 14.9094 7.10763 14.7528C7.43525 14.423 7.91952 15.6334 8.63207 16.1374C9.17899 16.5242 10.4473 16.399 11.423 16.0885C12.1312 15.8631 12.3613 15.0841 12.638 14.6488C12.9422 14.1701 13.6074 15.3567 14.1801 15.7561C15.1473 16.4308 17.0048 15.7083 17.5785 15.3426C17.7049 15.262 17.8037 15.1528 17.8911 15.0311C18.9736 13.5233 18.0492 9.91842 17.9795 9.22408C17.9104 8.53551 17.6331 8.01066 17.4599 7.42086C17.2363 6.65964 16.9403 6.13827 16.5762 5.58279C16.2277 5.0511 15.7961 4.57794 15.4148 4.12597C15.0337 3.67409 14.4791 3.39834 13.8727 2.99889C13.3342 2.6442 12.5402 2.56408 11.7413 2.47774C11.0564 2.40373 10.4223 2.56304 9.97292 2.85638C8.93337 3.53498 8.58527 4.25963 7.96062 4.76414C7.2079 5.37208 6.2635 6.44409 5.36111 7.22478C4.4238 8.03567 3.7649 9.45865 3.22711 11.1916C2.98489 11.9722 2.93064 12.8914 3.06795 13.7579C3.15629 14.3154 4.3807 14.2145 5.38555 14.163C6.28059 14.1172 6.67335 13.0058 7.14144 12.2589C7.98881 10.9069 8.16294 9.47321 8.46044 8.28892C8.68949 7.37713 9.06585 6.24749 9.37791 4.94826C9.49951 4.44202 9.48401 4.23259 9.26089 4.58991C8.49386 5.81823 7.61682 7.58417 6.78517 8.83139C6.08359 9.88353 5.84533 10.6403 5.6014 11.213C5.45616 11.5539 5.25449 11.9583 5.15046 12.1164C4.53242 13.0558 5.76835 9.47529 6.4653 8.52974C6.56886 8.38923 6.742 8.35602 6.84706 8.3893C7.45234 8.58107 7.50552 10.7683 7.86908 12.7452C7.98797 13.3917 8.12965 13.2804 8.42299 12.7639C9.23181 11.3399 9.82936 10.1598 10.0717 10.0365C10.5103 9.81346 10.3162 11.6067 10.4707 12.1325C10.5408 12.3712 10.9341 10.8047 11.0932 11.1651C11.2524 11.5256 11.2524 13.4136 11.2352 13.2705C10.9523 10.9126 11.1827 8.35705 11.269 8.06163C11.31 7.9215 11.5634 9.00615 11.7366 10.0126C11.7628 10.1649 11.9795 8.33625 12.1699 6.11487C12.189 5.89095 12.4309 7.75165 12.5001 9.84873C12.5297 10.7465 12.6047 8.5859 12.6218 5.3243C12.6269 4.36248 12.6733 4.80887 12.6052 6.51483C12.5371 8.22079 12.3654 11.1729 12.4315 12.2303C12.5127 13.53 13.7115 10.0609 14.1962 9.20899C14.4399 8.78065 14.8911 11.7014 15.2031 13.786C15.4586 15.4922 15.5173 10.579 15.5173 9.86746C15.5173 8.98501 15.9334 12.6511 15.9334 12.6043C15.9334 9.60765 15.7253 8.15006 15.639 7.45571C15.6174 7.28192 15.6213 7.10984 15.5698 7.07291C15.1767 6.79098 14.0006 8.44963 12.7992 9.71974C11.7156 10.8652 11.2233 12.0571 10.6126 13.1535C10.3673 13.5941 10.1435 14.0044 10.0395 14.059C9.90188 14.1313 10.0041 13.3927 9.90114 13.2476C9.71405 12.984 9.31134 13.762 9.20731 13.9363C8.93964 14.3846 8.99927 12.933 8.8266 12.6906C8.74081 12.5702 8.58527 12.5169 8.46304 12.533C8.34081 12.5491 8.23783 12.6521 8.30493 12.688C8.37202 12.7239 8.61231 12.6896 8.78759 12.6032C8.96287 12.5169 9.06585 12.3796 9.48401 12.2381" stroke="#E0D0FF" strokeWidth="3.6" strokeLinecap="round"/>
              <path d="M6.28431 6.99438C6.07556 7.33707 5.92684 7.66453 5.79201 7.97137C5.68413 8.21688 5.59805 8.45651 5.52301 8.69572C5.44581 8.94184 5.41886 9.21803 5.33644 9.45724C5.25232 9.70136 5.15009 9.93476 5.07506 10.174C5.00221 10.4062 5.00047 10.6515 4.94806 10.8907C4.89349 11.1398 4.89565 11.4426 4.82129 12.0074C4.58504 13.8021 4.85086 14.0559 4.90282 14.2952C5.00003 14.5344 5.08917 14.7135 5.19354 14.8327C5.23879 14.8927 5.26835 14.9519 5.3884 15.0128" stroke="#E0D0FF" strokeWidth="3.6" strokeLinecap="round"/>
              <path d="M7.64989 10.5891C8.13044 10.8808 8.5928 10.9259 8.99522 10.8478C9.09368 10.8141 9.19964 10.7696 9.28954 10.7356C9.37944 10.7016 9.45008 10.6794 9.62989 10.5217" stroke="#0D0D0D" strokeWidth="0.9" strokeLinecap="round"/>
              <path d="M12.2885 10.4175C12.7691 10.7092 13.2314 10.7543 13.6339 10.6762C13.7323 10.6425 13.8383 10.598 13.9282 10.564C14.0181 10.53 14.0887 10.5077 14.2685 10.3501" stroke="#0D0D0D" strokeWidth="0.9" strokeLinecap="round"/>
              <path d="M9.49296 13.6356C9.63877 13.5812 9.96834 13.4343 10.3078 13.3242C10.5983 13.23 10.9037 13.2142 12.2479 13.2136C12.6094 13.2681 12.775 13.3237 12.9488 13.3603C13.0319 13.3787 13.1045 13.3968 13.3444 13.4706" stroke="#0D0D0D" strokeWidth="0.9" strokeLinecap="round"/>
            </svg>
          </S.EmotionCharacter>

          <S.EmotionCharacter $left={14} $top={194}>
            {/* 슬픔 */}
            <svg width="19" height="25" viewBox="0 0 19 25" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8.16696 2.87451C7.90412 3.84827 6.85595 5.94621 6.20202 7.09493C5.91243 7.60364 5.68743 8.04415 5.26587 8.70401C4.90213 9.27335 4.606 10.074 4.28894 10.802C3.98021 11.5108 3.86658 12.2654 3.60256 12.9003C3.41946 13.3406 3.23324 14.0846 2.98228 14.9448C2.82188 15.4946 2.86274 16.8238 2.95457 17.7691C3.01756 18.4175 3.41533 18.917 3.86381 19.734C4.16451 20.2818 4.86409 20.6587 5.46022 21.0027C5.97224 21.2981 6.55511 21.3997 7.90927 21.5311C9.87172 21.7216 10.4074 21.4789 10.9358 21.4001C11.4435 21.3244 11.8593 21.1891 12.387 20.9916C13.0683 20.7365 13.3904 20.2138 13.7732 19.8049C14.1975 19.3516 14.2882 18.7365 14.4734 18.3138C14.6461 17.9198 14.7109 17.3653 14.7509 16.8887C14.7935 16.381 14.9485 15.8073 14.9623 12.7958C14.9673 11.712 14.7125 11.2948 14.4485 10.6749C14.2339 10.1711 13.9478 9.52775 13.6307 8.90668C13.3452 8.34749 13.05 7.89057 12.7599 7.4021C12.4951 6.95643 12.0747 6.46713 11.7046 5.95056C11.328 5.42498 10.9663 5.04053 10.5962 4.67043C10.1208 4.19502 9.69964 3.87836 9.35566 3.5225C9.19367 3.35492 9.0386 3.19197 8.85453 3.07322C8.75946 3.01189 8.61821 3.03285 8.53786 3.09816C8.13999 3.42155 8.3253 5.2622 8.25959 6.38203C8.19922 7.41076 8.00863 8.83424 7.91679 9.53527C7.81984 10.2753 7.69195 10.8419 7.36341 12.7891C7.20805 13.7098 7.0602 14.8225 6.83497 16.1438C6.78963 16.4097 6.76886 16.5673 7.17341 16.0341C7.57795 15.5009 8.41396 14.2731 9.07976 13.1833C9.74556 12.0936 10.2158 11.1792 10.5234 10.7996C10.8309 10.42 10.9616 10.6028 11.055 10.8407C11.2542 11.3481 11.2806 12.3936 11.2941 13.7501C11.316 15.956 10.5159 17.1761 10.4763 17.2565C10.1253 17.9689 11.1452 15.3624 11.8459 14.9349C11.973 14.8573 12.0968 14.908 12.216 14.9864C12.5026 15.1749 12.6526 15.4875 12.7318 15.8026C12.7835 16.0085 12.7587 16.3267 12.7195 16.5273C12.6615 16.8246 11.4239 16.8872 10.3334 17.1235C9.71692 17.2571 9.33072 17.9401 9.11697 18.3636C9.14231 18.4436 9.2468 18.4958 9.35289 18.562C9.45897 18.6281 9.56347 18.7064 9.67114 18.7872" stroke="#C8E1FF" strokeWidth="5.7475" strokeLinecap="round"/>
              <path d="M13.6746 10.218C13.7843 10.7679 13.9601 11.1632 14.1805 11.4838C14.393 11.7927 14.555 12.1771 14.7754 12.541C14.9978 12.908 15.0838 13.3008 15.1836 13.6864C15.2523 13.9519 15.2166 14.205 15.2497 14.8715C15.3901 17.7051 15.019 18.0597 14.9198 18.4127C14.8144 18.7879 14.5788 19.1172 14.4023 19.4702C14.2297 19.8154 13.9839 20.1087 13.7308 20.385C13.389 20.5727 13.1247 20.6831 12.9052 20.7161C12.773 20.7274 12.5985 20.7274 12.4187 20.7274" stroke="#C8E1FF" strokeWidth="5.7475" strokeLinecap="round"/>
              <path d="M12.3526 7.83838C12.5945 8.05782 12.8576 8.54032 13.1448 9.02646C13.3859 9.43465 13.4974 9.79748 13.7287 10.0956C13.9616 10.3957 14.0261 10.7889 14.1369 11.1419C14.2496 11.5014 14.4888 11.8465 14.7202 12.1446C14.9592 12.4526 15.0401 12.8379 15.1723 13.1909C15.3046 13.5443 15.3045 13.9616 15.316 15.9164C15.3204 16.657 15.0414 17.0456 14.821 17.421C14.636 17.7361 14.3157 18.1032 13.9951 18.435C13.8305 18.4799 13.6097 18.5235 13.346 18.6005C13.2132 18.6339 13.0823 18.6557 12.9475 18.6782" stroke="#C8E1FF" strokeWidth="5.7475" strokeLinecap="round"/>
              <path d="M10.5292 8.38184L10.8142 8.47545" stroke="#0D0D0D" strokeWidth="1.25" strokeLinecap="round"/>
              <path d="M7.04643 8.97534L7.33145 8.88173" stroke="#0D0D0D" strokeWidth="1.25" strokeLinecap="round"/>
              <path d="M7.36467 12.4374C7.59384 12.3749 8.0244 12.2073 8.59685 11.9865C9.05472 11.8698 9.51905 11.7647 10.0855 11.6386C10.3915 11.5854 10.7353 11.5542 11.0895 11.522" stroke="#0D0D0D" strokeLinecap="round"/>
            </svg>
          </S.EmotionCharacter>

          <S.EmotionCharacter $left={14} $top={229}>
            {/* 분노 */}
            <svg width="23" height="21" viewBox="0 0 23 21" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5.29393 18.1285C3.92214 15.5335 1.43631 9.54392 1.54224 6.81562C1.56224 6.30072 2.08288 6.33287 2.44876 6.58517C4.1881 7.78455 4.12747 9.74926 5.03508 11.4596C5.73388 12.7765 6.09342 13.8996 6.20373 15.61C6.22984 16.0148 6.31185 16.3024 6.34899 15.8743C6.62586 12.6821 6.60456 11.2172 6.78586 8.82198C7.14942 4.01901 7.32978 2.69807 7.98509 1.67577C8.12764 1.45338 8.49186 1.52723 8.67644 1.70744C11.197 4.16829 8.86321 11.4924 8.71686 13.6418C8.55381 16.0364 8.27999 16.8878 8.17077 17.1805C7.49401 18.9942 10.0952 12.0909 10.6435 10.4537C11.3831 8.24533 12.8606 6.48578 14.0271 5.60767C14.3189 5.38801 14.6081 5.10089 14.8288 5.09652C15.0494 5.09215 15.1936 5.38049 15.2678 5.74529C15.6033 7.3929 14.2543 9.30801 13.3794 10.552C12.5066 11.7931 11.4888 12.9516 10.3224 14.3736C9.2907 15.6313 8.64477 16.4509 8.64259 16.6716C8.61663 19.2974 14.0184 12.8205 15.5562 11.6158C16.7217 10.7027 17.6685 10.1206 18.1425 10.0824C18.2973 10.0699 18.1119 10.5487 17.8935 10.8425C17.0238 12.0123 15.1324 12.5889 13.0561 14.118C11.4452 15.3044 9.88988 16.8092 9.29681 17.6906C7.94747 19.696 13.6558 16.3111 15.554 15.5466C17.6776 14.6913 19.997 14.4151 20.8336 14.5593C21.1904 14.6207 21.3098 14.9918 21.312 15.3566C21.3169 16.1664 20.589 16.8878 19.8255 17.4328C18.7452 18.204 17.2425 18.4169 15.8205 18.7467C14.5448 18.856 8.91127 19.0023 5.87935 18.2771C5.66091 18.1285 5.37257 18.1285 5.07549 18.1285" stroke="#FF6868" strokeWidth="3.078" strokeLinecap="round"/>
              <path d="M18.2934 16.3914L13.8951 17.271" stroke="#FF6868" strokeWidth="2.3085" strokeLinecap="round"/>
              <path d="M1.20564 7.53052C1.20564 7.66949 1.23076 7.94783 1.24999 8.46146C1.26078 8.74973 1.30691 9.00175 1.33243 9.4579C1.35053 9.78162 1.42114 10.1059 1.50357 10.3409C1.57558 10.5461 1.61152 10.7784 1.66235 10.9946C1.71383 11.2137 1.8019 11.4386 1.87805 11.6798C1.95236 11.9152 2.00522 12.1239 2.07471 12.3273C2.14302 12.5272 2.18265 12.7332 2.26508 12.9365C2.34586 13.1357 2.38598 13.3424 2.42386 13.5457C2.46287 13.7551 2.56341 13.9767 2.62052 14.193C2.67656 14.4052 2.75378 14.5989 2.83622 14.8022C2.91699 15.0014 2.98224 15.2081 3.03935 15.4114C3.12197 15.6147 3.17261 15.7796 3.22325 15.8999C3.24877 15.9574 3.2739 16.0076 3.29979 16.0594" stroke="#FF6868" strokeWidth="2.3085" strokeLinecap="round"/>
              <path d="M1.49436 6.97705C1.47954 7.39579 1.44943 8.37614 1.50155 9.03525C1.52252 9.30048 1.6588 9.52182 1.6889 9.80645C1.72183 10.1178 1.80886 10.4051 1.89086 10.7349C1.96076 11.016 2.00296 11.3486 2.07821 11.6858C2.1433 11.9774 2.1683 12.2176 2.25029 12.4575C2.34605 12.7377 2.42259 13.1009 2.4974 13.3709C2.5874 13.6958 2.70654 14.0435 2.7672 14.4191C2.81033 14.6862 2.91681 14.9133 2.96938 15.1532C3.02814 15.4214 3.14146 15.7813 3.21626 16.0965C3.2891 16.4034 3.44068 16.6502 3.55323 16.9054C3.6556 17.1376 3.75518 17.3844 3.88256 17.6243C4.01713 17.8778 4.21885 18.1032 4.41407 18.373C4.5697 18.5881 4.80293 18.7179 5.04285 18.8751C5.26457 19.0205 5.55144 19.0773 5.82147 19.1227C6.14075 19.1763 6.40509 19.2274 6.67512 19.3172C6.97532 19.4171 7.3477 19.3774 8.33097 19.4147C9.0433 19.4417 10.393 19.4224 11.1177 19.4149C12.1414 19.4045 12.6502 19.3478 13.2783 19.3251C13.5946 19.2727 13.8929 19.2426 14.3346 19.2054C14.477 19.1977 14.6549 19.1977 14.973 19.1528" stroke="#FF6868" strokeWidth="2.3085" strokeLinecap="round"/>
              <path d="M1.51045 9.62451C1.47238 10.0399 1.52264 10.8543 1.61802 11.1022C1.69743 11.3086 1.76404 11.5146 1.84647 11.7179C1.92725 11.9171 1.99249 12.1238 2.0496 12.3271C2.06433 12.3795 2.09377 12.4284 2.10671 12.3915C2.21994 12.0684 2.05646 11.8466 1.99934 11.6117C1.94331 11.3812 1.86608 11.1361 1.81525 10.8504C1.76039 10.542 1.72672 10.1842 1.66923 10.0559C1.52905 9.74307 1.73891 10.5505 1.73891 10.5827C1.73891 10.8425 1.68827 10.1454 1.65666 10.0944C1.42831 9.72569 1.61173 11.2861 1.65628 11.4957C1.70532 11.7265 1.72596 11.9334 1.77679 12.1367C1.82762 12.3401 1.85313 12.5677 1.91634 12.7966C1.98812 13.0565 2.03056 13.2912 2.113 13.5075C2.18715 13.702 2.208 13.9133 2.24017 14.1483C2.27094 14.3729 2.3603 14.6238 2.43036 14.878C2.49821 15.1241 2.56362 15.3221 2.67766 15.5255C2.7839 15.7149 2.85528 15.9313 2.95066 16.1663C3.03545 16.3751 3.15988 16.5786 3.29315 16.8135C3.41257 17.0241 3.56577 17.251 3.71826 17.442C3.88794 17.6545 4.11101 17.8602 4.36497 18.0259C4.78456 18.2995 5.20149 18.4824 5.7791 18.6353C6.0092 18.6962 6.55736 18.6865 7.31792 18.6739C7.8285 18.6655 8.08419 18.5852 8.20451 18.522C8.31226 18.4337 8.40174 18.3316 8.47142 18.2303C8.5034 18.1793 8.52853 18.1291 8.55442 18.0773" stroke="#FF6868" strokeWidth="2.3085" strokeLinecap="round"/>
              <path d="M7.48147 13.1545L7.49933 13.3074" stroke="#0D0D0D" strokeWidth="1.125" strokeLinecap="round"/>
              <path d="M10.5594 12.6929L10.5773 12.8457" stroke="#0D0D0D" strokeWidth="1.125" strokeLinecap="round"/>
              <path d="M5.48064 11.1538L7.50448 11.5386" stroke="#0D0D0D" strokeWidth="0.9" strokeLinecap="round"/>
              <path d="M10.2518 14.8595C9.38773 14.8139 8.56652 14.9042 8.15454 15.0187C7.72769 15.1374 7.42503 15.6935 7.27151 16.0142C7.09298 16.3872 7.19463 16.7898 7.29318 16.9645C7.42933 17.2059 8.31376 17.1406 8.85166 17.0649C9.16979 17.0201 9.41419 16.9736 9.89163 16.8824C10.9772 16.6749 11.3906 16.6853 11.6123 16.4951C11.9373 16.2162 11.5612 15.2582 11.3399 14.9665C11.2866 14.9357 11.2263 14.9206 11.105 14.9129C10.9836 14.9051 10.8029 14.9051 10.4799 14.8595" stroke="#0D0D0D" strokeWidth="0.9" strokeLinecap="round"/>
              <path d="M9.94373 11.2009L11.1931 10.5381" stroke="#0D0D0D" strokeWidth="0.9" strokeLinecap="round"/>
            </svg>
          </S.EmotionCharacter>
            </>
          )}

          {/* Daily 차트 - Line Chart */}
          {selectedPeriod === "Daily" && dailyChartData.length > 0 && (
            <S.ChartLine>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dailyChartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="0" stroke="transparent" horizontal={false} vertical={false} />
                  <XAxis 
                    dataKey="time" 
                    hide={true}
                    type="category"
                    scale="point"
                    padding={{ left: 0, right: 0 }}
                  />
                  <YAxis hide={true} domain={[0, 100]} />
                  <Line 
                    type="linear" 
                    dataKey="value" 
                    stroke="#5482FF" 
                    strokeWidth={4.24}
                    dot={false}
                    activeDot={false}
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </S.ChartLine>
          )}

          {/* Week 차트 - Bar Chart */}
          {selectedPeriod === "Week" && weekChartData.length > 0 && (
            <>
              {/* Y축 라벨 */}
              <S.YAxisLabel $top={60}>100</S.YAxisLabel>
              <S.YAxisLabel $top={96}>80</S.YAxisLabel>
              <S.YAxisLabel $top={132}>60</S.YAxisLabel>
              <S.YAxisLabel $top={168}>40</S.YAxisLabel>
              <S.YAxisLabel $top={204}>20</S.YAxisLabel>

              {/* X축 요일 라벨 */}
              <S.WeekXAxisLabel $left={41}>월</S.WeekXAxisLabel>
              <S.WeekXAxisLabel $left={86}>화</S.WeekXAxisLabel>
              <S.WeekXAxisLabel $left={131}>수</S.WeekXAxisLabel>
              <S.WeekXAxisLabel $left={176}>목</S.WeekXAxisLabel>
              <S.WeekXAxisLabel $left={221}>금</S.WeekXAxisLabel>
              <S.WeekXAxisLabel $left={266}>토</S.WeekXAxisLabel>
              <S.WeekXAxisLabel $left={311}>일</S.WeekXAxisLabel>

              {/* Week 그리드 라인 */}
              <S.WeekGridLine $top={60} $left={29} $width={298} />
              <S.WeekGridLine $top={96} $left={29} $width={298} />
              <S.WeekGridLine $top={132} $left={29} $width={298} />
              <S.WeekGridLine $top={168} $left={29} $width={298} />
              <S.WeekGridLine $top={204} $left={29} $width={298} />
              <S.WeekGridLine $top={240} $left={16} $width={311} />

              {/* Bar Chart */}
              <S.WeekChartContainer>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weekChartData} margin={{ top: 0, right: 8, left: 8, bottom: 0 }} barCategoryGap="0%" barGap={0}>
                    <CartesianGrid strokeDasharray="0" stroke="transparent" horizontal={false} vertical={false} />
                    <XAxis 
                      dataKey="day" 
                      hide={true}
                      type="category"
                      scale="point"
                      padding={{ left: 0, right: 0 }}
                      interval={0}
                    />
                    <YAxis hide={true} domain={[0, 100]} />
                    <Bar 
                      dataKey="value" 
                      fill="#5482FF"
                      radius={[0, 0, 0, 0]}
                      barSize={16}
                    >
                      {weekChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill="#5482FF" />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </S.WeekChartContainer>

              {/* 막대 위 퍼센트 표시 */}
              {weekChartData.map((entry, index) => {
                // 값이 0 이하이거나 null/undefined이면 표시하지 않음
                if (!entry || entry.value == null || entry.value <= 0) return null;
                const barHeight = (entry.value / 100) * 180; // 180px is the chart height (240 - 60)
                const barTop = 240 - barHeight;
                // 요일 라벨 위치에 맞춰 퍼센트 라벨 위치 계산 (막대 중심에 맞춤)
                // 막대가 오른쪽으로 이동했으므로 퍼센트 라벨도 약간 오른쪽으로 이동
                const dayLabelPositions = [41, 86, 131, 176, 221, 266, 311];
                const barCenter = dayLabelPositions[index] + 3; // 막대 중심 위치 (오른쪽으로 이동)
                const percentText = `${entry.value}%`;
                const textWidth = percentText.length * 4.5; // 대략적인 텍스트 너비 (글자당 4.5px)
                const barLeft = barCenter - (textWidth / 2); // 텍스트 중앙 정렬
                return (
                  <S.PercentLabel key={`percent-${index}`} $left={barLeft} $top={barTop - 10}>
                    {percentText}
                  </S.PercentLabel>
                );
              })}
            </>
          )}
        </S.ChartArea>
      </S.ChartSection>
      )}

      {/* 리스트 섹션 - Daily와 Month 뷰에서 표시 */}
      {selectedPeriod === "Daily" && (
        <S.ListSection>
          <S.ListHeader>
            <S.ListTitle>오늘 가장 많이 느낀 감정은</S.ListTitle>
            <S.ChevronIcon>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 4L10 8L6 12" stroke="#838383" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </S.ChevronIcon>
          </S.ListHeader>
          
          <S.EmotionInfo>
            <S.EmotionCharacterLarge>
              {todayEmotion && renderEmotionCharacter(todayEmotion.character)}
            </S.EmotionCharacterLarge>
            
            {todayEmotion && (
              <S.EmotionTextContainer>
                <S.EmotionName>"{todayEmotion.emotion}"</S.EmotionName>
                <S.EmotionDescription>
                  {todayEmotion.message}
                </S.EmotionDescription>
              </S.EmotionTextContainer>
            )}
          </S.EmotionInfo>
        </S.ListSection>
      )}

      {/* Month 뷰 - 이번 달 감정 별 횟수 */}
      {selectedPeriod === "Month" && (
        <S.MonthListSection>
          <S.MonthListTitle>이번 달 감정 별 횟수</S.MonthListTitle>
          <S.MonthEmotionList>
            {monthEmotionCounts.filter(item => item && item.emotion).map((item, index) => (
              <S.MonthEmotionItem key={`month-emotion-${index}`}>
                <S.MonthEmotionCharacter $width={index === 1 ? "19.91" : "32"} $height={index === 1 ? "45.96" : "48"}>
                  {renderEmotionCharacter(item.emotion)}
                </S.MonthEmotionCharacter>
                <S.MonthEmotionCount>{item.count}회</S.MonthEmotionCount>
              </S.MonthEmotionItem>
            ))}
          </S.MonthEmotionList>
        </S.MonthListSection>
      )}

      {/* 년도/월 선택 모달 - Container 레벨로 이동 */}
      <SidebarModal
        isOpen={isDateModalOpen}
        onClose={() => {
          setIsDateModalOpen(false);
          setSelectedMode("year"); // 닫을 때 년도 모드로 리셋
        }}
        options={getDateOptions()}
        selectedValue={selectedMode === "year" ? currentYear : currentMonth}
        onSelect={handleDateSelect}
        triggerRef={dateFieldRef}
        autoClose={selectedMode === "month"} // 월 선택 시에만 자동 닫기
      />

    </S.Container>
    <BottomNavigation />
    </>
  );
}
