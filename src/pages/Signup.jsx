import { useState } from "react";
import styled from "styled-components";
import axios from "../utils/axios";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  height: 100vh;
  overflow: hidden;
  img {
    width: 100%;
    height: 100vh;
    object-fit: cover;
    object-position: center center;
  }
`;

const MainWrapper = styled(motion.div)`
  z-index: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: -20%;
  left: 41%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 3rem;
  background: rgba(0, 0, 0, 0.7);
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);

  h1 {
    font-size: 4rem;
    font-weight: 700;
    margin-bottom: 1rem;
  }
  form {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
  }
  input,
  select {
    width: 100%;
    height: 50px;
    border-radius: 12px;
    margin-bottom: 1rem;
    border: none;
    padding: 0 1rem;
    font-size: 1rem;
  }
  .title {
    font-size: 3rem;
    margin-bottom: 1rem;
  }
  .genderDiv {
    display: flex;
    justify-content: space-around;
    width: 100%;
    margin-bottom: 1rem;
    label {
      display: flex;
      align-items: center;
      font-size: 1rem;
    }
  }
`;

const StyledSelectButton = styled(motion.button)`
  height: 50px;
  width: 100%;
  border-radius: 12px;
  font-size: 1.2rem;
  border: none;
  margin-top: 1rem;
  cursor: pointer;
  background-color: #007bff;
  color: white;
  transition: all 0.3s ease-in-out;
  &:hover {
    background-color: #0056b3;
  }
`;

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [characterName, setCharacterName] = useState("");
  const [mbti, setMbti] = useState("");
  const [birthDate, setBirthDate] = useState(new Date());
  const [gender, setGender] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const userData = {
      email,
      password,
      characterName,
      mbti,
      birthDate: birthDate.toISOString().split("T")[0],
      gender,
    };

    try {
      const response = await axios.post(
        "/api/signup",
        userData
      );
      console.log(response.data);
      navigate("/main1");
    } catch (error) {
      console.error(error);
      alert("요청이 실패하였습니다");
    }
  };

  return (
    <Wrapper>
      <img src="/img/image1.png" alt="Background 1" />
      <img src="/img/image2.png" alt="Background 2" />
      <img src="/img/image3.png" alt="Background 3" />
      <MainWrapper
        initial={{ opacity: 0, y: "-100%" }}
        animate={{ opacity: 1, y: "50%" }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <div className="title">회원가입</div>
        <form onSubmit={handleSubmit}>
          <motion.div whileHover={{ scale: 1.05 }}>
            <input
              type="email"
              placeholder="이메일을 입력해주세요"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }}>
            <input
              type="password"
              placeholder="비밀번호를 입력해주세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }}>
            <input
              type="text"
              placeholder="이름을 입력해주세요"
              value={characterName}
              onChange={(e) => setCharacterName(e.target.value)}
            />
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }}>
            <select value={mbti} onChange={(e) => setMbti(e.target.value)}>
              <option value="" disabled>
                MBTI를 선택해주세요
              </option>
              {[
                "INTJ",
                "INTP",
                "ENTJ",
                "ENTP",
                "INFJ",
                "INFP",
                "ENFJ",
                "ENFP",
                "ISTJ",
                "ISFJ",
                "ESTJ",
                "ESFJ",
                "ISTP",
                "ISFP",
                "ESTP",
                "ESFP",
              ].map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }}>
            <DatePicker
              selected={birthDate}
              onChange={(date) => setBirthDate(date)}
              dateFormat="yyyy-MM-dd"
              placeholderText="생일을 선택해주세요"
              className="datePickerInput"
            />
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }}>
            <div className="genderDiv">
              <label>
                <input
                  type="radio"
                  value="남성"
                  checked={gender === "남성"}
                  onChange={(e) => setGender(e.target.value)}
                />
                남성
              </label>
              <label>
                <input
                  type="radio"
                  value="여성"
                  checked={gender === "여성"}
                  onChange={(e) => setGender(e.target.value)}
                />
                여성
              </label>
            </div>
          </motion.div>
          <StyledSelectButton
            className="submitBtn"
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Submit
          </StyledSelectButton>
        </form>
      </MainWrapper>
    </Wrapper>
  );
}

export default Signup;
