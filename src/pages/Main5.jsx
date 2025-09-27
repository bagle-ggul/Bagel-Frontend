import React, { useEffect, useRef } from "react";
import BagelSelectPageComponent from "../components/GameUI/BagelSelectPageComponent";
import { storyData } from "../utils/data5";

function Main5() {
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.play().catch((error) => {
        console.error("Error playing audio:", error);
      });
    }
  }, []);

  return (
    <>
      <BagelSelectPageComponent
        backgroundImage={"./img/bg_beach_main.png"}
        characterImage={"./img/mc_normal_main.png"}
        storyData={storyData}
        url={"/happy"}
        scene={5}
      />
      <audio ref={audioRef} src="./audio/5.mp3" loop />
    </>
  );
}

export default Main5;
