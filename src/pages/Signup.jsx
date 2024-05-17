import { useState } from "react";
import styled from "styled-components";
import axios from "axios";

const Wrapper = styled.div`
  display: grid;
  position: relative;
  grid-template-columns: repeat(3, 1fr);
  height: 100vh;
  img {
    width: 100%;
    height: 100vh;
    object-fit: cover;
    object-position: center;
  }
`;

const MainWrapper = styled.div`
  z-index: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: absolute; /* Position it absolutely within the Wrapper */
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%); /* Center the MainWrapper div */
  color: white; /* Add text color for visibility, adjust as needed */
  font-size: 3rem; /* Adjust font size as needed */
  background: rgba(0, 0, 0, 0.5); /* 배경을 반투명하게 설정하여 가독성 향상 */
  h1 {
    font-size: 8rem;
    font-weight: 500;
  }
  form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 15px;
  }
  input {
    width: 400px;
    height: 40px;
    margin-bottom: 10px; /* Add some margin for better spacing */
  }
  .submitBtn {
    width: 300px;
    height: 50px;
  }
`;

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const userData = {
      email,
      password,
      nickname,
      phone,
      address,
    };

    try {
      const response = await axios.post(
        "https://api.she-is-newyork-bagle.co.kr/api/signup",
        userData
      );
      console.log(response.data);
      // Handle success (e.g., display a success message, redirect to another page, etc.)
    } catch (error) {
      console.error(error);
      // Handle error (e.g., display an error message)
    }
  };

  return (
    <div>
      <Wrapper>
        <img src="/img/image1.png" alt="" />
        <img src="/img/image2.png" alt="" />
        <img src="/img/image3.png" alt="" />
        <MainWrapper>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              type="text"
              placeholder="Nickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
            />
            <input
              type="text"
              placeholder="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <input
              type="text"
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />

            <button className="submitBtn" type="submit">
              Submit
            </button>
          </form>
        </MainWrapper>
      </Wrapper>
    </div>
  );
}

export default Signup;
