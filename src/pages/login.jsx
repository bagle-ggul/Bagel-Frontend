import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import { motion } from "framer-motion";

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
  color: white;
  font-size: 3rem;
  background: rgba(0, 0, 0, 0.5);
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
    border-radius: 12px;
    margin-bottom: 15px;
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
  transition: all 0.5s ease-in-out;
  &:hover {
    background-color: skyblue;
    color: white;
  }
`;

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const userData = {
      email,
      password,
    };

    try {
      const response = await axios.post(
        "https://api.she-is-newyork-bagel.co.kr/api/login",
        userData
      );
      const { refreshToken } = response.data;
      localStorage.setItem("refreshToken", refreshToken);
      console.log(response.data);
      console.log(refreshToken);
      navigate("/");

    } catch (error) {
      console.error(error);
      alert("잘못된 계정입니다");
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
          <div className="title">로그인</div>
          <form onSubmit={handleSubmit}>
            <motion.div whileHover={{ scale: 1.1 }}>
              <input
                type="text"
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

export default Login;
