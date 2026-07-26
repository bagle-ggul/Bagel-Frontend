import React, { useEffect, useRef } from "react";
import { useSetRecoilState } from "recoil";

import { characterNameAtom } from "../atom/atom";
import BagelSelectPageComponent from "../components/GameUI/BagelSelectPageComponent";
import axios from "../utils/axios";
import { storyData } from "../utils/data";
import { logger } from "../utils/logger";

function Main1() {
  const setCharacterName = useSetRecoilState(characterNameAtom);
  const audioRef = useRef(null);

  useEffect(() => {
    // 토큰은 axios 인터셉터가 자동으로 붙인다
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/my-page");
        setCharacterName(response.data.characterName);
      } catch (error) {
        logger.error("캐릭터 정보 조회 실패:", error);
      }
    };

    fetchData();
  }, [setCharacterName]);

  useEffect(() => {
    if (audioRef.current) {
      // 브라우저 자동재생 정책상 실패할 수 있으나 게임 진행에는 영향이 없다
      audioRef.current.play().catch((error) => {
        logger.warn("배경음 재생 실패:", error);
      });
    }
  }, []);

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
