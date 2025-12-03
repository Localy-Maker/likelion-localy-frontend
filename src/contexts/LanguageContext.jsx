import { createContext, useContext, useState, useCallback } from "react";
import { translations } from "./translations";

/**
 * 언어 컨텍스트
 * 전역 언어 상태를 관리하고 하드코딩된 번역 기능을 제공합니다.
 */
const LanguageContext = createContext();

/**
 * 언어 컨텍스트 프로바이더
 */
export function LanguageProvider({ children }) {
  // 기본 언어는 한국어, localStorage에서 저장된 언어를 불러옴
  const [language, setLanguage] = useState(() => {
    const savedLanguage = localStorage.getItem("appLanguage");
    return savedLanguage || "ko";
  });

  /**
   * 언어 변경 함수
   */
  const changeLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem("appLanguage", lang);
  };

  /**
   * 번역 함수 (하드코딩된 번역 사용)
   * 컴포넌트에서 즉시 사용 가능
   */
  const t = useCallback(
    (key) => {
      const langTranslations = translations[language] || translations.ko;
      return langTranslations[key] || key;
    },
    [language]
  );

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

/**
 * 언어 컨텍스트 사용 훅
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
