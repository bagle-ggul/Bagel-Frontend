import SelectPageComponent from "../components/SelectPageComponent";
import { Data1, Ans1 } from "../utils/data";

function Start() {
  return (
    <SelectPageComponent
      //backgroundImage={"./img/Background.png"}
      characterImage={"./img/character.png"}
      buttonSelects={Ans1}
      chatting={"야 꺼져"}
    ></SelectPageComponent>
  );
}

export default Start;
