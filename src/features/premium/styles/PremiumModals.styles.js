import styled from "styled-components";

export const DimmedOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  z-index: 1100;
`;

export const BottomSheet = styled.div`
  width: 100%;
  max-width: 375px;
  min-height: 302px;
  background: #ffffff;
  border-radius: 16px 16px 0 0;
  padding: 36px 24px 32px;
  box-sizing: border-box;
`;

export const SheetTitle = styled.h2`
  margin: 0 0 24px;
  font-family: "Inter", sans-serif;
  font-weight: 600;
  font-size: 16px;
  line-height: 19px;
  text-align: center;
  color: #0d0d0d;
`;

export const BenefitList = styled.ul`
  list-style: none;
  margin: 0 0 16px;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const BenefitItem = styled.li`
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: "Inter", sans-serif;
  font-size: 14px;
  line-height: 17px;
  color: #0d0d0d;
`;

export const CheckIcon = styled.span`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #5482ff;
  color: #ffffff;
  font-size: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export const PointNote = styled.p`
  margin: 0 0 24px;
  font-family: "Inter", sans-serif;
  font-size: 12px;
  line-height: 15px;
  text-align: center;
  color: #838383;
`;

export const PrimaryButton = styled.button`
  display: block;
  width: 141px;
  height: 36px;
  margin: 0 auto;
  border: none;
  border-radius: 8px;
  background: #5482ff;
  color: #f7f9ff;
  font-family: "Inter", sans-serif;
  font-weight: 500;
  font-size: 14px;
  line-height: 17px;
  cursor: pointer;

  &:disabled {
    background: #c9c9c9;
    cursor: not-allowed;
  }
`;

export const SuccessModal = styled.div`
  width: 317px;
  min-height: 126px;
  margin: auto;
  padding: 20px;
  box-sizing: border-box;
  background: #ffffff;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
`;

export const SuccessTitle = styled.h2`
  margin: 0;
  width: 100%;
  font-family: "Inter", sans-serif;
  font-weight: 600;
  font-size: 16px;
  line-height: 22px;
  text-align: center;
  color: #5482ff;
`;

export const SuccessMessage = styled.p`
  margin: 0;
  width: 100%;
  font-family: "Inter", sans-serif;
  font-weight: 400;
  font-size: 14px;
  line-height: 17px;
  text-align: center;
  color: #0d0d0d;
`;
