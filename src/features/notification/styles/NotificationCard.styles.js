import styled from "styled-components";

export const CardContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 343px;
  min-height: 128px;
  margin: 0 auto 16px;
  background: #ffffff;
  box-shadow: 0px 2px 24px 2px rgba(0, 0, 0, 0.08);
  border-radius: 8px;
  padding: 16px;
`;

export const CardContent = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
  padding: 0px;
  gap: 20px;
  width: 100%;
  min-height: 96px;
`;

export const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0px;
  gap: 8px;
  width: 277px;
  min-height: 96px;
  flex: none;
  order: 0;
  flex-grow: 0;
`;

export const HeaderSection = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0px;
  gap: 8px;
  width: 100%;
  flex: none;
  order: 0;
  flex-grow: 0;
`;

export const TitleRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0px 4px;
  gap: 8px;
  height: 28px;
  flex: none;
  order: 0;
  flex-grow: 0;
`;

export const IconAndName = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0px;
  gap: 7px;
  height: 28px;
  flex: none;
  order: 0;
  flex-grow: 0;
`;

export const EmojiIcon = styled.img`
  width: 16.31px;
  height: 13.92px;
  flex: none;
  order: 0;
  flex-grow: 0;
`;

export const SenderName = styled.span`
  height: 28px;
  font-family: "Inter";
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 28px;
  letter-spacing: -0.26px;
  color: #0d0d0d;
  flex: none;
  order: 0;
  flex-grow: 0;
`;

export const DateRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0px;
  gap: 8px;
  height: 12px;
  flex: none;
  order: 1;
  flex-grow: 0;
`;

export const Dot = styled.span`
  width: 6px;
  height: 12px;
  font-family: "Inter";
  font-style: normal;
  font-weight: 500;
  font-size: 10px;
  line-height: 12px;
  display: flex;
  align-items: center;
  text-align: center;
  color: #838383;
  flex: none;
  order: 0;
  flex-grow: 0;
`;

export const DateText = styled.span`
  height: 12px;
  font-family: "Inter";
  font-style: normal;
  font-weight: 500;
  font-size: 10px;
  line-height: 12px;
  display: flex;
  align-items: center;
  text-align: center;
  color: #838383;
  flex: none;
  order: 1;
  flex-grow: 0;
`;

export const TitleText = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding: 0px;
  gap: 10px;
  width: 100%;
  min-height: 24px;
  font-family: "Inter";
  font-style: normal;
  font-weight: 500;
  font-size: 10px;
  line-height: 12px;
  color: #3d3d3d;
  white-space: pre-line;
  flex: none;
  order: 1;
  align-self: stretch;
  flex-grow: 0;
`;

export const DescriptionText = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding: 0px 4px 0px 0px;
  width: 100%;
  min-height: 36px;
  font-family: "Inter";
  font-style: normal;
  font-weight: 500;
  font-size: 10px;
  line-height: 12px;
  color: #a6a6a6;
  flex: none;
  order: 1;
  flex-grow: 0;
`;

export const RedDot = styled.div`
  position: absolute;
  width: 8px;
  height: 8px;
  right: 16px;
  top: 20px;
  background: #ee938e;
  border-radius: 50%;
  display: ${({ $isNew }) => ($isNew ? "block" : "none")};
`;
