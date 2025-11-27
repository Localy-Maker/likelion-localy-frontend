import React from "react";
import ProgressBar from "@ramonak/react-progress-bar";
import styled from "styled-components";
import { colors } from "@/styles/colors";
import { font } from "@/styles/font";
import Emotions from "@/shared/components/icons/Emotions";

const CardContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 10px;
  background-color: ${colors.blue[10]};
  padding: 25px 18px 30px 18px;
  border-radius: 8px;
`;

//감정에 따른 텍스트 색상변경 필요
const Mood = styled.div`
  display: flex;
  flex-direction: column;
  color: ${colors.blue[50]};
  gap: 10px;
  ${font.medium14}
`;

//미션 완료 혹은 미완료일 경우에 따른 텍스트 변경이 필요
const MissionTitle = styled.div`
  ${font.semibold16}
  color: ${colors.gray[900]};
`;

//미션 완료 혹은 미완료일 경우에 따른 텍스트 변경이 필요
const MissionDescription = styled.div`
  ${font.regular12}
  color: ${colors.gray[600]};
`;

const ProgressContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 15px;
`;

const ProgressBarWrapper = styled.div`
  flex: 1;
`;

const ProgressStatus = styled.div`
  ${font.regular14}
  display: flex;
  align-items: center;
  white-space: nowrap;
`;

const ProgressValue = styled.p`
  ${font.regular14}
  color: ${colors.blue[50]};
  margin: 0;
`;

const EmotionsContainer = styled.div`
  position: absolute;
  right: 18px;
`;

export default function HomeCard() {
  return (
    <CardContainer>
      <Mood>우울하신가요?</Mood>
      <MissionTitle>로컬리 미션 완료하기</MissionTitle>
      <MissionDescription>
        당신의 감정에 딱 맞는 장소 미션 4가지를 완료해보세요!
      </MissionDescription>
      <ProgressContainer>
        <ProgressBarWrapper>
          <ProgressBar
            completed={25}
            bgColor={colors.blue[50]}
            height="10px"
            borderRadius="10px"
            isLabelVisible={false}
          />
        </ProgressBarWrapper>
        <ProgressStatus>
          <ProgressValue>25</ProgressValue>
          /100
        </ProgressStatus>
      </ProgressContainer>
      <EmotionsContainer>
        <Emotions name="happy" size={48} />
      </EmotionsContainer>
    </CardContainer>
  );
}
