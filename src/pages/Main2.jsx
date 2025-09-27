import React, { useEffect, useRef } from "react";
import BagelSelectPageComponent from "../components/GameUI/BagelSelectPageComponent";
import { storyData } from "../utils/data2";

function Main2() {
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