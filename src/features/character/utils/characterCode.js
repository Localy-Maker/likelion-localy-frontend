/**
 * 백엔드 캐릭터 code ↔ 프론트 감정 characterId 매핑.
 *
 * 백엔드 시드(Localy_BE ShopDataInitializer): happy / sadness / anger / depressed / anxiety / neutral
 * 프론트 EMOTIONS(src/assets/character/index.js): happiness / anger / sadness / depression / anxiety / neutral
 *
 * 6종 중 4종(sadness/anger/anxiety/neutral)은 문자열이 동일하고,
 * happy↔happiness, depressed↔depression 두 종만 표기가 다르다.
 */
const SERVER_TO_CLIENT = {
  happy: "happiness",
  depressed: "depression",
  sadness: "sadness",
  anger: "anger",
  anxiety: "anxiety",
  neutral: "neutral",
};

const CLIENT_TO_SERVER = Object.fromEntries(
  Object.entries(SERVER_TO_CLIENT).map(([server, client]) => [client, server]),
);

/** 백엔드 캐릭터 code → 프론트 characterId. 미매핑/누락 값은 그대로 반환(방어적). */
export const toClientCharacterId = (code) =>
  code == null ? null : (SERVER_TO_CLIENT[code] ?? code);

/** 프론트 characterId → 백엔드 캐릭터 code. */
export const toServerCharacterCode = (characterId) =>
  characterId == null ? null : (CLIENT_TO_SERVER[characterId] ?? characterId);
