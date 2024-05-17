import SelectPageComponent from "../components/SelectPageComponent";
import { Data2, Ans2 } from "../utils/data2";

function Main2() {
  return (
    <SelectPageComponent
      backgroundImage={"./img/image1.png"}
      characterImage={"./img/character.png"}
      buttonSelects={Ans2}
      chatting={Data2}
    ></SelectPageComponent>
  );
}

export default Main2;
