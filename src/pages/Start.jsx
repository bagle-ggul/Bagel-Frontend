import SelectPageComponent from "../components/SelectPageComponent";

function Start() {
  const ButtonSelects = ["Select 1", "Select 2", "Select 3", "Select 4"];

  return (
    <SelectPageComponent
      //backgroundImage={"./img/Background.png"}
      characterImage={"./img/character.png"}
      buttonSelects={ButtonSelects}
      chatting={"야 꺼져"}
    ></SelectPageComponent>
  );
}

export default Start;
