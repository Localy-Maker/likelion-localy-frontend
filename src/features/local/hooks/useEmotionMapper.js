/**
 * 감정 키워드 매핑 유틸리티
 * 단일 책임: 감정 키워드를 아이콘 이름과 텍스트로 변환
 */

// 한글 키워드 -> 영문 아이콘 이름 매핑
const emotionKeywordToIcon = {
  '불안': 'anxiety',
  '우울': 'depressed',
  '외로움': 'depressed',
  '행복': 'happy',
  '분노': 'mad',
  '중립': 'normal',
  '슬픔': 'sad',
};

// 영문 아이콘 이름 -> 한글 텍스트 매핑
const emotionIconToText = {
  'anxiety': '불안',
  'depressed': '우울',
  'happy': '행복',
  'mad': '분노',
  'normal': '중립',
  'sad': '슬픔',
};

// 감정별 메시지 매핑
const emotionMessages = {
  'anxiety': '불안하신가요?',
  'depressed': '우울하신가요?',
  'happy': '행복하신가요?',
  'mad': '화나셨나요?',
  'normal': '평온하신가요?',
  'sad': '슬프신가요?',
};

/**
 * 감정 키워드를 아이콘 이름으로 변환
 * @param {string} keyword - 한글 감정 키워드 (예: "외로움", "우울")
 * @returns {string} 영문 아이콘 이름 (예: "depressed")
 */
export function getEmotionIcon(keyword) {
  return emotionKeywordToIcon[keyword] || 'normal';
}

/**
 * 아이콘 이름을 한글 텍스트로 변환
 * @param {string} iconName - 영문 아이콘 이름
 * @returns {string} 한글 텍스트
 */
export function getEmotionText(iconName) {
  return emotionIconToText[iconName] || '중립';
}

/**
 * 감정에 따른 메시지 가져오기
 * @param {string} keyword - 한글 감정 키워드 또는 영문 아이콘 이름
 * @returns {string} 감정별 메시지
 */
export function getEmotionMessage(keyword) {
  const iconName = emotionKeywordToIcon[keyword] || keyword;
  return emotionMessages[iconName] || '평온하신가요?';
}

/**
 * 감정 정보를 모두 가져오기
 * @param {string} keyword - 한글 감정 키워드
 * @returns {Object} { iconName, text, message }
 */
export function getEmotionData(keyword) {
  const iconName = getEmotionIcon(keyword);
  const text = getEmotionText(iconName);
  const message = getEmotionMessage(keyword);
  
  return {
    iconName,
    text,
    message,
  };
}

