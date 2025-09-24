import React, { useEffect, useRef } from "react";
import axios from "../utils/axios";
import { useSetRecoilState } from "recoil";
import SelectPageComponent from "../components/SelectPageComponent";
import { storyData } from "../utils/data";
import { characterNameAtom } from "../atom/atom";

function Main1() {
  const refreshToken = localStorage.getItem("refreshToken");
  const setCharacterName = useSetRecoilState(characterNameAtom);
  const audioRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "/api/my-page",
          {
            headers: {
              Authorization: `Bearer ${refreshToken}`,
            },
          }
        );
        console.log(response.data);
        setCharacterName(response.data.characterName);
      } catch (error) {
        console.error("Error fetching data:", error);
        alert("Error");
      }
    };

    fetchData();
  }, [refreshToken, setCharacterName]);

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
        backgroundImage={"./img/house.png"}
        characterImage={"./img/character.png"}
        storyData={storyData}
        url={"/main2"}
        scene={1}
      />
      <audio ref={audioRef} src="./audio/1.mp3" loop />
    </>
  );
}

export default Main1;
