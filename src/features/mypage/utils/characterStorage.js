const CHARACTER_STORAGE_KEY = "localy_profile_character";

const BE_TO_FE_CHARACTER = {
  happy: "happiness",
  sadness: "sadness",
  anger: "anger",
  depressed: "depression",
  neutral: "neutral",
  anxiety: "anxiety",
};

const FE_TO_BE_CHARACTER = Object.fromEntries(
  Object.entries(BE_TO_FE_CHARACTER).map(([be, fe]) => [fe, be]),
);

export const PROFILE_CHARACTERS = [
  { id: "happiness", label: "행복" },
  { id: "sadness", label: "슬픔" },
  { id: "anger", label: "분노" },
  { id: "depression", label: "우울" },
  { id: "neutral", label: "중립" },
  { id: "anxiety", label: "불안" },
];

export function toFeCharacterCode(beCode) {
  return BE_TO_FE_CHARACTER[beCode] || beCode;
}

export function toBeCharacterCode(feCode) {
  return FE_TO_BE_CHARACTER[feCode] || feCode;
}

export function getProfileCharacter() {
  return localStorage.getItem(CHARACTER_STORAGE_KEY) || "happiness";
}

export function setProfileCharacter(characterId) {
  localStorage.setItem(CHARACTER_STORAGE_KEY, characterId);
  window.dispatchEvent(new Event("profile-character-changed"));
}
