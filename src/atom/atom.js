import { atom } from "recoil";

import { getScore, setScore } from "../game/progress";

/**
 * sessionStorage와 점수를 동기화한다.
 * 이것이 없으면 게임 도중 새로고침 시 점수가 0으로 초기화되어
 * 엉뚱한 엔딩을 보게 된다.
 */
const scorePersistence = ({ setSelf, onSet }) => {
  setSelf(getScore());

  onSet((newValue, _, isReset) => {
    setScore(isReset ? 0 : newValue);
  });
};

export const scoreAtom = atom({
  key: "score",
  default: 0,
  effects: [scorePersistence],
});

export const characterNameAtom = atom({
  key: "characterName",
  default: "",
});
