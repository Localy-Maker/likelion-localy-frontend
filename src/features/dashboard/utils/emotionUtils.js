// 감정 구간 정의
export const EMOTION_RANGES = {
  VERY_NEGATIVE: { min: 0, max: 16, character: 'depression', emotions: ['우울'] },
  NEGATIVE: { min: 17, max: 33, character: 'anger', emotions: ['분노', '슬픔'] },
  NEUTRAL: { min: 34, max: 50, character: 'anxiety', emotions: ['불안', '중립'] },
  SLIGHTLY_POSITIVE: { min: 51, max: 66, character: 'happiness', emotions: ['행복'] },
  POSITIVE: { min: 67, max: 83, character: 'happiness', emotions: ['행복'] },
  VERY_POSITIVE: { min: 84, max: 100, character: 'happiness', emotions: ['행복'] },
};

// 감정 단어 매핑 (가장 가까운 감정 단어)
export const EMOTION_WORDS = {
  depression: ['무기력함', '우울함', '절망', '슬픔', '비관'],
  anger: ['분노', '짜증', '화남', '불만', '답답함'],
  sadness: ['슬픔', '우울함', '비애', '그리움', '외로움'],
  anxiety: ['불안', '걱정', '두려움', '초조', '불편함'],
  neutral: ['중립', '평온', '무감정', '차분', '평범'],
  happiness: ['행복', '기쁨', '즐거움', '만족', '뿌듯함'],
};

/**
 * 감정 값에 따라 구간을 반환
 * @param {number} value - 0~100 사이의 감정 값
 * @returns {object} 감정 구간 정보
 */
export function getEmotionRange(value) {
  if (value >= 0 && value <= 16) return EMOTION_RANGES.VERY_NEGATIVE;
  if (value >= 17 && value <= 33) return EMOTION_RANGES.NEGATIVE;
  if (value >= 34 && value <= 50) return EMOTION_RANGES.NEUTRAL;
  if (value >= 51 && value <= 66) return EMOTION_RANGES.SLIGHTLY_POSITIVE;
  if (value >= 67 && value <= 83) return EMOTION_RANGES.POSITIVE;
  if (value >= 84 && value <= 100) return EMOTION_RANGES.VERY_POSITIVE;
  return EMOTION_RANGES.NEUTRAL; // 기본값
}

/**
 * 감정 값에 따라 가장 가까운 감정 단어를 반환
 * @param {number} value - 0~100 사이의 감정 값
 * @param {string} character - 캐릭터 타입 (depression, anger, sadness, anxiety, neutral, happiness)
 * @returns {string} 감정 단어
 */
export function getClosestEmotionWord(value, character) {
  const words = EMOTION_WORDS[character] || EMOTION_WORDS.neutral;
  
  // 값에 따라 단어 선택 (간단한 로직)
  if (character === 'depression') {
    if (value <= 8) return '무기력함';
    if (value <= 12) return '우울함';
    return '절망';
  }
  
  if (character === 'anger') {
    if (value <= 25) return '분노';
    return '짜증';
  }
  
  if (character === 'sadness') {
    if (value <= 25) return '슬픔';
    return '우울함';
  }
  
  if (character === 'anxiety') {
    if (value <= 42) return '불안';
    return '걱정';
  }
  
  if (character === 'neutral') {
    return '중립';
  }
  
  if (character === 'happiness') {
    if (value >= 84) return '행복';
    if (value >= 67) return '기쁨';
    return '즐거움';
  }
  
  return words[0];
}

/**
 * 감정 값에 따라 캐릭터 타입을 반환
 * @param {number} value - 0~100 사이의 감정 값
 * @returns {string} 캐릭터 타입
 */
export function getEmotionCharacter(value) {
  const range = getEmotionRange(value);
  return range.character;
}

/**
 * 부정적 구간에서 분노와 슬픔 중 선택
 * @param {number} value - 17~33 사이의 값
 * @returns {string} 'anger' 또는 'sadness'
 */
export function getNegativeEmotionCharacter(value) {
  // 17~25: 슬픔, 26~33: 분노
  if (value <= 25) return 'sadness';
  return 'anger';
}







