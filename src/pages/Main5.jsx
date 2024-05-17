import SelectPageComponent from "../components/SelectPageComponent";
import { storyData } from "../utils/data5";

function Main5() {
  return (
    <SelectPageComponent
      backgroundImage={"./img/image1.png"}
      characterImage={"./img/character.png"}
      storyData={storyData}
      url={"/happy"}
      scene={5}
    ></SelectPageComponent>
  );
}

export default Main5;
