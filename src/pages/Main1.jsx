import SelectPageComponent from "../components/SelectPageComponent";
import { Data1, Ans1 } from "../utils/data";

function Main1() {
  return (
    <SelectPageComponent
      backgroundImage={"./img/house.png"}
      characterImage={"./img/character.png"}
      buttonSelects={Ans1}
      chatting={Data1}
    ></SelectPageComponent>
  );
}

export default Main1;
