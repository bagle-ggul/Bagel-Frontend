import { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { motion } from "framer-motion";

const Wrapper = styled.div`
  display: grid;
  position: relative;
  grid-template-columns: repeat(3, 1fr);
  height: 100vh;
  overflow: hidden;
  img {
    width: 100%;
    height: 100vh;
    object-fit: cover;
    object-position: center;
  }
`;

const MainWrapper = styled(motion.div)`
  z-index: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 20%;
  left: 40%;
  transform: translate(-50%, -50%);
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
    height: 50px;
    border-radius: 12px;
    margin-bottom: 15px; /* Add some margin for better spacing */
  }
  .title {
    font-size: 60px;
    padding: 12px;
  }
`;

const StyledSelectButton = styled(motion.button)`
  height: 20px;
  width: 40%;
  border-radius: 10px;
  font-size: 20px;
  border: 1px solid grey;
  margin: 0.3%;
  cursor: pointer;
  padding: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all;
  transition-duration: 0.5s;
  transition-timing-function: ease-in-out;
  &:hover {
    background-color: skyblue;
    color: white;
  }
`;

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [characterName, setCharacterName] = useState("");
  const [mbti, setMbti] = useState("");
  const [birth, setBirth] = useState("");
  const [gender, setGender] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    const userData = {
      email,
      password,
      characterName,
      mbti,
      birth,
      gender,
    };

    try {
      const response = await axios.post(
        "https://api.she-is-newyork-bagel.co.kr/api/signup",
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
        <MainWrapper
          initial={{ opacity: 0, y: "-100%" }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <div className="title">회원가입</div>
          <form onSubmit={handleSubmit}>
            <motion.div whileHover={{ scale: 1.1 }}>
              <input
                type="email"
                placeholder="이메일을 입력해주세요"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }}>
              <input
                type="password"
                placeholder="비밀번호를 입력해주세요"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }}>
              <input
                type="text"
                placeholder="이름을 입력해주세요"
                value={characterName}
                onChange={(e) => setCharacterName(e.target.value)}
              />
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }}>
              <input
                type="text"
                placeholder="MBTI를 입력해주세요"
                value={mbti}
                onChange={(e) => setMbti(e.target.value)}
              />
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }}>
              <input
                type="text"
                placeholder="생일을 입력해주세요 ex)2000-08-13"
                value={birth}
                onChange={(e) => setBirth(e.target.value)}
              />
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }}>
              <input
                type="text"
                placeholder="성별을 입력해주세요"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              />
            </motion.div>
            <StyledSelectButton
              className="submitBtn"
              type="submit"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              Submit
            </StyledSelectButton>
          </form>
        </MainWrapper>
      </Wrapper>
    </div>
  );
}

export default Signup;
