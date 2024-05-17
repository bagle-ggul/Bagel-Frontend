import React, { useEffect, useRef } from "react";
import SelectPageComponent from "../components/SelectPageComponent";
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
      <SelectPageComponent
        backgroundImage={"./img/cafe.png"}
        characterImage={"./img/character.png"}
        storyData={storyData}
        url={"/main3"}
        scene={2}
      />
      <audio ref={audioRef} src="./audio/2.mp3" loop />
    </>
  );
}

export default Main2;