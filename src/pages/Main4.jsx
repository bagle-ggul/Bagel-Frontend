import React, { useEffect, useRef } from "react";
import BagelSelectPageComponent from "../components/GameUI/BagelSelectPageComponent";
import { storyData } from "../utils/data4";

function Main4() {
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
        backgroundImage={"./img/bg_road_main.png"}
        characterImage={"./img/mc_normal_main.png"}
        storyData={storyData}
        url={"/main5"}
        scene={4}
      />
      <audio ref={audioRef} src="./audio/34.mp3" loop />
    </>
  );
}

export default Main4;
