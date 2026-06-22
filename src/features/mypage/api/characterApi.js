import apiClient from "@/shared/api/client";

/**
 * GET /api/characters
 */
export async function getCharacters() {
  const response = await apiClient.get("/api/characters");
  return response.data?.data;
}

/**
 * PATCH /api/characters/current
 */
export async function changeCurrentCharacter(characterCode) {
  const response = await apiClient.patch("/api/characters/current", {
    characterCode,
  });
  return response.data?.data;
}
