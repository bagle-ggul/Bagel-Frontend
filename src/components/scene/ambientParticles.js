// 종류별 입자 수 (rain 48, dust 24, petals 18, sparkle 20)
export const PARTICLE_COUNT_BY_KIND = {
  rain: 48,
  dust: 24,
  petals: 18,
  sparkle: 20,
};

// 인덱스 > 0~1 의사난수 (새로고침해도 같은 배치, Math.random 미사용)
const pseudoRandom = (index, seed) => {
  const raw = Math.sin((index + 1) * seed) * 10000;
  return raw - Math.floor(raw);
};

/**
 * 입자 배치 계산: 종류, 개수 > { left, delay, duration, size, drift }[]
 */
export const buildParticles = (kind, count) =>
  Array.from({ length: count }, (_, index) => {
    const isRain = kind === "rain";
    const durationSeconds = isRain
      ? 0.8 + pseudoRandom(index, 78.233) * 0.7
      : 6 + pseudoRandom(index, 78.233) * 8;
    const sizePixels = isRain
      ? 1 + pseudoRandom(index, 39.346)
      : 3 + pseudoRandom(index, 39.346) * 6;
    return {
      left: `${(pseudoRandom(index, 12.9898) * 100).toFixed(2)}%`,
      delay: `${(-pseudoRandom(index, 4.1414) * durationSeconds).toFixed(2)}s`, // 음수 지연: 처음부터 흩어진 상태
      duration: `${durationSeconds.toFixed(2)}s`,
      size: `${sizePixels.toFixed(1)}px`,
      drift: `${((pseudoRandom(index, 93.9898) - 0.5) * 80).toFixed(1)}px`,
    };
  });
