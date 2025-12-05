import { useContext } from "react";
import { LanguageContext } from "./LanguageContext";

/**
 * 언어 컨텍스트 사용 훅
 */
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

