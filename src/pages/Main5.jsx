import React, { useEffect } from "react";

import BagelSelectPageComponent from "../components/GameUI/BagelSelectPageComponent";
import { markStageReached } from "../game/progress";
import { useBackgroundMusic } from "../hooks/useBackgroundMusic";
import { storyData } from "../utils/data5";

function Main5() {
  const audioRef = useBackgroundMusic();

  // 진행도를 기록해야 다음 스테이지의 가드를 통과할 수 있다
  useEffect(() => {
    markStageReached(5);
  }, []);

  return (
    <>
      <BagelSelectPageComponent
        backgroundImage={"./img/bg_beach_main.png"}
        characterImage={"./img/mc_normal_main.png"}
        storyData={storyData}
        scene={5}
      />
      <audio ref={audioRef} src="./audio/5.mp3" loop />
    </>
  );
}

export default Main5;
