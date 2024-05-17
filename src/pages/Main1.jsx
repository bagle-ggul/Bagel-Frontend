import SelectPageComponent from "../components/SelectPageComponent";
import { storyData } from "../utils/data";

function Main1() {
  return (
    <SelectPageComponent
      backgroundImage={"./img/house.png"}
      characterImage={"./img/character.png"}
      storyData={storyData}
    ></SelectPageComponent>
  );
}

export default Main1;
