import React, { useEffect } from "react";

import BagelSelectPageComponent from "../components/GameUI/BagelSelectPageComponent";
import { markStageReached } from "../game/progress";
import { useBackgroundMusic } from "../hooks/useBackgroundMusic";
import { storyData } from "../utils/data2";

function Main2() {
  const audioRef = useBackgroundMusic();

  // 진행도를 기록해야 다음 스테이지의 가드를 통과할 수 있다
  useEffect(() => {
    markStageReached(2);
  }, []);

  return (
    <>
      <BagelSelectPageComponent
        backgroundImage={"./img/bg_cafe_main.png"}
        characterImage={"./img/mc_normal_main.png"}
        storyData={storyData}
        url={"/main3"}
        scene={2}
      />
      <audio ref={audioRef} src="./audio/2.mp3" loop />
    </>
  );
}

export default Main2;
