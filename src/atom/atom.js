import { atom } from "recoil";

export const scoreAtom = atom({
  key: "score",
  default: 0,
});

export const characterNameAtom = atom({
  key: "characterName",
  default: "",
});
