import React, { useEffect } from "react";
import { useSetRecoilState } from "recoil";

import { characterNameAtom } from "../atom/atom";
import BagelSelectPageComponent from "../components/GameUI/BagelSelectPageComponent";
import { markStageReached } from "../game/progress";
import { useBackgroundMusic } from "../hooks/useBackgroundMusic";
import axios from "../utils/axios";
import { storyData } from "../utils/data";
import { logger } from "../utils/logger";

function Main1() {
  const setCharacterName = useSetRecoilState(characterNameAtom);
  const audioRef = useBackgroundMusic();

  // 진행도를 기록해야 다음 스테이지의 가드를 통과할 수 있다
  useEffect(() => {
    markStageReached(1);
  }, []);

  useEffect(() => {
    // 토큰은 axios 인터셉터가 자동으로 붙인다
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/my-page");
        setCharacterName(response.data.characterName);
      } catch (error) {
        // 캐릭터 이름은 기본값이 있어 조회에 실패해도 진행에 지장이 없다
        logger.error("캐릭터 정보 조회 실패:", error);
      }
    };

    fetchData();
  }, [setCharacterName]);

  return (
    <>
      <BagelSelectPageComponent
        backgroundImage={"./img/bg_house_main.png"}
        characterImage={"./img/mc_normal_main.png"}
        storyData={storyData}
        url={"/main2"}
        scene={1}
      />
      <audio ref={audioRef} src="./audio/1.mp3" loop />
    </>
  );
}

export default Main1;
