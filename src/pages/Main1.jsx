import React, { useEffect } from "react";
import axios from "axios";
import { useSetRecoilState } from "recoil";
import SelectPageComponent from "../components/SelectPageComponent";
import { storyData } from "../utils/data";
import { characterNameAtom } from "../atom/atom";

function Main1() {
  const refreshToken = localStorage.getItem("refreshToken");
  const setCharacterName = useSetRecoilState(characterNameAtom);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://api.she-is-newyork-bagel.co.kr/api/my-page",
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

  return (
    <SelectPageComponent
      backgroundImage={"./img/house.png"}
      characterImage={"./img/character.png"}
      storyData={storyData}
      url={"/main2"}
      scene={1}
    />
  );
}

export default Main1;
