import SelectPageComponent from "../components/SelectPageComponent";
import { storyData } from "../utils/data2";

function Main2() {
  return (
    <SelectPageComponent
      backgroundImage={"./img/cafe.png"}
      characterImage={"./img/character.png"}
      storyData={storyData}
      url={"/main3"}
      scene={2}
    ></SelectPageComponent>
  );
}

export default Main2;
