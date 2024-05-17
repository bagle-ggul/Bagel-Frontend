import SelectPageComponent from "../components/SelectPageComponent";
import { storyData } from "../utils/data3";

function Main2() {
  return (
    <SelectPageComponent
      backgroundImage={"./img/image1.png"}
      characterImage={"./img/character.png"}
      storyData={storyData}
      url={"/main4"}
      scene={3}
    ></SelectPageComponent>
  );
}

export default Main2;
