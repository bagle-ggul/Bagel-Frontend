import { ROUTES } from "../constants/routes";
import { storyData as stage1StoryData } from "../utils/data";
import { storyData as stage2StoryData } from "../utils/data2";
import { storyData as stage3StoryData } from "../utils/data3";
import { storyData as stage4StoryData } from "../utils/data4";
import { storyData as stage5StoryData } from "../utils/data5";

/**
 * 스테이지 설정 표: 장소, 스토리 데이터, 배경, 음악, 기본 다음 경로, 분위기 효과
 * StagePage가 stage 번호로 조회 (defaultExit null = 마지막 스테이지)
 */
export const STAGE_CONFIGS = {
  1: {
    stage: 1,
    place: "house",
    storyData: stage1StoryData,
    background: "/img/bg_house_main.webp",
    music: "/audio/1.m4a",
    defaultExit: ROUTES.MAIN2,
    ambient: "dust",
  },
  2: {
    stage: 2,
    place: "cafe",
    storyData: stage2StoryData,
    background: "/img/bg_cafe_main.webp",
    music: "/audio/2.m4a",
    defaultExit: ROUTES.MAIN3,
    ambient: "petals",
  },
  3: {
    stage: 3,
    place: "cave",
    storyData: stage3StoryData,
    background: "/img/bg_cave_main.webp",
    music: "/audio/34.m4a",
    defaultExit: ROUTES.MAIN5,
    ambient: "rain",
  },
  4: {
    stage: 4,
    place: "road",
    storyData: stage4StoryData,
    background: "/img/bg_road_main.webp",
    music: "/audio/34.m4a",
    defaultExit: ROUTES.MAIN5,
    ambient: "rain",
  },
  5: {
    stage: 5,
    place: "beach",
    storyData: stage5StoryData,
    background: "/img/bg_beach_main.webp",
    music: "/audio/5.m4a",
    defaultExit: null,
    ambient: "sparkle",
  },
};

/** 스테이지 > 다음에 갈 수 있는 후보 스테이지 (미리 불러오기용) */
export const NEXT_STAGES = { 1: [2], 2: [3, 4], 3: [5], 4: [5], 5: [] };

/** 스테이지 번호 > 설정 (없으면 null) */
export const getStageConfig = (stage) => STAGE_CONFIGS[stage] ?? null;

/** 장면 하나의 그림: 장면 그림 + 선택지별 그림 */
const collectSceneImages = (plotScene) => [
  plotScene.img,
  ...(plotScene.options ?? []).map((option) => option.img),
];

/**
 * 미리 불러올 그림: 현재 스테이지 장면 그림 전부 + 다음 후보 스테이지의 배경과 첫 장면 그림 (중복 제거)
 */
export const getPreloadImages = (stage) => {
  const current = getStageConfig(stage);
  if (!current) return [];

  const currentImages = [current.background, ...current.storyData.plot.flatMap(collectSceneImages)];
  const nextImages = (NEXT_STAGES[stage] ?? []).flatMap((nextStage) => {
    const next = getStageConfig(nextStage);
    return [next.background, next.storyData.plot[0]?.img];
  });

  return [...new Set([...currentImages, ...nextImages].filter(Boolean))];
};
