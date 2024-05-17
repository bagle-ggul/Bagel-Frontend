import SelectPageComponent from "../components/SelectPageComponent";
import { storyData } from "../utils/data4";

function Main4() {
  return (
    <SelectPageComponent
      backgroundImage={"./img/road.png"}
      characterImage={"./img/character.png"}
      storyData={storyData}
      url={"/main5"}
      scene={4}
    ></SelectPageComponent>
  );
}

export default Main4;
