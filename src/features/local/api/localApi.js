import apiClient from '@/shared/api/client';

/**
 * 북마크 목록 조회 API
 * @param {Object} params - { sortType, size, lastBookmarkId }
 * @returns {Promise<Object>} { bookmarks, hasNext, lastBookmarkId }
 */
export async function getBookmarks(params) {
    const response = await apiClient.get('/api/bookmarks', { params });
    const result = response.data;

    if (result.success) {
        return result.data;
    }
    throw new Error(result.message || '북마크 조회에 실패했습니다.');
}

/**
 * 북마크 토글 API (추가/해제)
 * @param {number} placeId - 장소 ID
 * @returns {Promise<Object>} { isBookmarked, bookmarkCount }
 */
export async function toggleBookmark(placeId) {
    const response = await apiClient.post(`/api/places/${placeId}/bookmarks`);
    const result = response.data;

    if (result.success) {
        return result.data;
    }
    throw new Error(result.message || '북마크 처리에 실패했습니다.');
}

/**
 * 홈 데이터 조회 API
 * @param {number} latitude - 위도
 * @param {number} longitude - 경도
 * @returns {Promise<Object>} 홈 데이터
 */
export async function getHomeData(latitude, longitude) {
    const response = await apiClient.get('/api/places/home', {
        params: { latitude, longitude },
    });
    const result = response.data;

    if (result.success) {
        return result.data;
    }
    throw new Error(result.message || '데이터 조회에 실패했습니다.');
}

/**
 * 장소 상세 정보 조회 API
 * @param {number|string} placeId - 장소 ID
 * @returns {Promise<Object>} 장소 상세 정보
 */
export async function getPlaceDetail(placeId) {
    const response = await apiClient.get(`/api/places/${placeId}`);
    const result = response.data;

    if (result.success) {
        return result.data;
    }
    throw new Error(result.message || '장소 정보 조회에 실패했습니다.');
}

/**
 * 미션 목록 조회 API
 * @returns {Promise<Object>} { pointInfo, availableMissions, completedMissions }
 */
export async function getMissions() {
    const response = await apiClient.get('/api/missions');
    const result = response.data;

    if (result.success) {
        return result.data;
    }
    throw new Error(result.message || '미션 조회에 실패했습니다.');
}

/**
 * 미션 상세 정보 조회 API
 * @param {number} missionId - 미션 ID
 * @param {number} latitude - 위도 (선택)
 * @param {number} longitude - 경도 (선택)
 * @returns {Promise<Object>} 미션 상세 정보
 */
export async function getMissionDetail(missionId, latitude, longitude) {
    const params = {};
    if (latitude) params.latitude = latitude;
    if (longitude) params.longitude = longitude;

    const response = await apiClient.get(`/api/missions/${missionId}`, { params });
    const result = response.data;

    if (result.success) {
        return result.data;
    }
    throw new Error(result.message || '미션 조회에 실패했습니다.');
}

/**
 * 미션 인증 API
 * @param {number} missionId - 미션 ID
 * @param {number} latitude - 위도
 * @param {number} longitude - 경도
 * @returns {Promise<Object>} { success, missionTitle, earnedPoints, totalPoints }
 */
export async function verifyMission(missionId, latitude, longitude) {
    const response = await apiClient.post(`/api/missions/${missionId}/verify`, {
        latitude,
        longitude,
        verificationMethod: "location"
    });
    const result = response.data;

    if (result.success) {
        return { success: true, ...result.data };
    }
    throw new Error(result.message || '미션 인증에 실패했습니다.');
}

