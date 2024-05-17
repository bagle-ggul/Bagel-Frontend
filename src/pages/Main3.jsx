import React, { useEffect, useRef } from "react";
import SelectPageComponent from "../components/SelectPageComponent";
import { storyData } from "../utils/data3";

function Main3() {
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
        backgroundImage={"./img/cave.png"}
        characterImage={"./img/character.png"}
        storyData={storyData}
        url={"/main5"}
        scene={3}
      />
      <audio ref={audioRef} src="./audio/34.mp3" loop />
    </>
  );
}

export default Main3;
