// 종류별 입자 수 (rain 48, dust 24, petals 18, sparkle 20)
export const PARTICLE_COUNT_BY_KIND = {
  rain: 48,
  dust: 24,
  petals: 18,
  sparkle: 20,
};

// 의사난수 시드 (항목마다 다른 시드로 상관 제거)
const SEED_LEFT = 12.9898;
const SEED_DELAY = 4.1414;
const SEED_DURATION = 78.233;
const SEED_SIZE = 39.346;
const SEED_DRIFT = 93.9898;
const SEED_BOTTOM = 55.5173;

const RAIN_DURATION_MIN_SECONDS = 0.8; // 비 낙하 시간 하한 (초)
const RAIN_DURATION_RANGE_SECONDS = 0.7; // 비 낙하 시간 변동폭 (초)
const SLOW_DURATION_MIN_SECONDS = 6; // 그 외 효과 주기 하한 (초)
const SLOW_DURATION_RANGE_SECONDS = 8; // 그 외 효과 주기 변동폭 (초)
const RAIN_SIZE_MIN_PIXELS = 1; // 빗줄기 굵기 하한 (px)
const RAIN_SIZE_RANGE_PIXELS = 1; // 빗줄기 굵기 변동폭 (px)
const SOFT_SIZE_MIN_PIXELS = 3; // 그 외 입자 크기 하한 (px)
const SOFT_SIZE_RANGE_PIXELS = 6; // 그 외 입자 크기 변동폭 (px)
const DRIFT_RANGE_PIXELS = 80; // 좌우 흔들림 폭 (px, 중앙 기준 +-절반)
const SPARKLE_BOTTOM_MAX_PERCENT = 33; // 반짝임 위치 상한 (아래 1/3, %)

// 인덱스 > 0~1 의사난수 (새로고침해도 같은 배치, Math.random 미사용)
const pseudoRandom = (index, seed) => {
  const raw = Math.sin((index + 1) * seed) * 10000;
  return raw - Math.floor(raw);
};

/**
 * 입자 배치 계산: 종류, 개수 > { left, delay, duration, size, drift, bottom }[]
 */
export const buildParticles = (kind, count) =>
  Array.from({ length: count }, (_, index) => {
    const isRain = kind === "rain";
    const durationSeconds = isRain
      ? RAIN_DURATION_MIN_SECONDS + pseudoRandom(index, SEED_DURATION) * RAIN_DURATION_RANGE_SECONDS
      : SLOW_DURATION_MIN_SECONDS +
        pseudoRandom(index, SEED_DURATION) * SLOW_DURATION_RANGE_SECONDS;
    const sizePixels = isRain
      ? RAIN_SIZE_MIN_PIXELS + pseudoRandom(index, SEED_SIZE) * RAIN_SIZE_RANGE_PIXELS
      : SOFT_SIZE_MIN_PIXELS + pseudoRandom(index, SEED_SIZE) * SOFT_SIZE_RANGE_PIXELS;
    return {
      left: `${(pseudoRandom(index, SEED_LEFT) * 100).toFixed(2)}%`,
      delay: `${(-pseudoRandom(index, SEED_DELAY) * durationSeconds).toFixed(2)}s`, // 음수 지연: 처음부터 흩어진 상태
      duration: `${durationSeconds.toFixed(2)}s`,
      size: `${sizePixels.toFixed(1)}px`,
      drift: `${((pseudoRandom(index, SEED_DRIFT) - 0.5) * DRIFT_RANGE_PIXELS).toFixed(1)}px`,
      bottom: `${(pseudoRandom(index, SEED_BOTTOM) * SPARKLE_BOTTOM_MAX_PERCENT).toFixed(2)}%`,
    };
  });
