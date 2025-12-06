import styled from "styled-components";
import { useNavigate, useLocation } from "react-router";
import { colors } from "@/styles/colors";
import Icon from "../icons/BottomIcon";

export const BottomNavigationContainer = styled.div`
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 800px;

  height: 60px;
  background-color: rgb(255, 255, 255);
  border-top: 1px solid ${colors.gray[200]};
  display: flex;
  justify-content: space-around;
  align-items: center;
  z-index: 1000;
`;

const BottomNavigationContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 8px;
  border-radius: 12px;
  color: ${colors.gray[600]};
  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.1);
    color: ${colors.blue[50]};
  }

  &:active {
    transform: scale(0.95);
  }
`;

const NAV_ITEMS = ["home", "message", "folder", "clipboard", "user"];

const Navigate = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const NAV_PATHS = {
    home: "/main",
    message: "/chat",
    folder: "/local",
    clipboard: "/dashboard",
    user: "/mypage",
  };

  const isActive = (item) => {
    const path = NAV_PATHS[item];
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <BottomNavigationContainer>
      {NAV_ITEMS.map((item) => (
        <BottomNavigationContent
          key={item}
          onClick={() => navigate(NAV_PATHS[item])}
        >
          <Icon
            name={item}
            size={24}
            color={isActive(item) ? colors.blue[50] : colors.gray[600]}
            isFilled={isActive(item)}
          />
        </BottomNavigationContent>
      ))}
    </BottomNavigationContainer>
  );
};

export default Navigate;
