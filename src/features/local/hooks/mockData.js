/**
 * 홈 페이지 목업 데이터
 * 단일 책임: 개발 및 테스트용 목업 데이터 제공
 */
export const mockHomeData = {
  success: true,
  message: "장소추천 홈 조회 성공",
  data: {
    missionBanner: {
      emotionKeyword: "외로움",
      totalMissions: 4,
      completedMissions: 1,
      progressPercent: 25
    },
    missionPlaces: [
      {
        placeId: 123,
        placeName: "북촌 한옥마을",
        category: "문화",
        address: "서울특별시 종로구 계동길 37",
        thumbnailImage: "https://images.unsplash.com/photo-1545921664-0a4781f0ba4a?w=400",
        distance: 1.2
      },
      {
        placeId: 124,
        placeName: "서울숲",
        category: "공원",
        address: "서울특별시 성동구 뚝섬로",
        thumbnailImage: "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=400",
        distance: 2.5
      },
      {
        placeId: 125,
        placeName: "한강공원",
        category: "공원",
        address: "서울특별시 영등포구 여의동로",
        thumbnailImage: "https://images.unsplash.com/photo-1584647142296-f08be4c72f78?w=400",
        distance: 3.1
      }
    ],
    recommendedPlaces: [
      {
        placeId: 456,
        placeName: "파이키 카페",
        category: "카페",
        address: "서울특별시 강남구 테헤란로",
        thumbnailImage: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400",
        distance: 0.8
      },
      {
        placeId: 457,
        placeName: "블루보틀 청담점",
        category: "카페",
        address: "서울특별시 강남구 청담동",
        thumbnailImage: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400",
        distance: 1.5
      },
      {
        placeId: 458,
        placeName: "성수동 카페거리",
        category: "카페",
        address: "서울특별시 성동구 성수동",
        thumbnailImage: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400",
        distance: 2.0
      }
    ],
    recentBookmarks: [
      {
        placeId: 789,
        placeName: "경복궁",
        category: "관광지",
        address: "서울특별시 종로구 사직로 161",
        thumbnailImage: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=400",
        bookmarkedAt: "2025-11-25T14:30:00"
      },
      {
        placeId: 790,
        placeName: "남산타워",
        category: "관광지",
        address: "서울특별시 용산구 남산공원길",
        thumbnailImage: "https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?w=400",
        bookmarkedAt: "2025-11-24T10:15:00"
      },
      {
        placeId: 791,
        placeName: "익선동 한옥마을",
        category: "문화",
        address: "서울특별시 종로구 익선동",
        thumbnailImage: "https://images.unsplash.com/photo-1570284613060-766c33850e00?w=400",
        bookmarkedAt: "2025-11-23T16:45:00"
      }
    ]
  }
};

/**
 * 목업 위치 데이터
 */
export const mockLocation = {
  latitude: 37.5665,
  longitude: 126.9780
};

