import styled from "styled-components";

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  z-index: 1100;
`;

export const Sheet = styled.div`
  width: 100%;
  max-width: 375px;
  min-height: 340px;
  background: #ffffff;
  border-radius: 16px 16px 0 0;
  padding: 34px 24px 32px;
  box-sizing: border-box;
`;

export const Title = styled.h2`
  margin: 0 0 24px;
  font-family: "Inter", sans-serif;
  font-weight: 600;
  font-size: 16px;
  line-height: 22px;
  text-align: center;
  color: #0d0d0d;
`;

export const CharacterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  width: 100%;
  max-width: 280px;
  margin: 0 auto 32px;
`;

export const CharacterButton = styled.button`
  width: 72px;
  height: 72px;
  justify-self: center;
  border: 2px solid ${({ $selected }) => ($selected ? "#5482ff" : "transparent")};
  border-radius: 50%;
  background: ${({ $selected }) => ($selected ? "#f7f9ff" : "#ffffff")};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0;

  svg {
    width: 36px;
    height: 32px;
  }
`;

export const ConfirmButton = styled.button`
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
`;
