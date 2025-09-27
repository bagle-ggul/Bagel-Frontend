import { useState } from "react";
import styled from "styled-components";
import axios from "../utils/axios";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Wrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  display: grid;
  grid-template-columns: repeat(3, 1fr);

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    grid-template-rows: repeat(3, 1fr);
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    display: block;
  }
`;

const BackButton = styled(Link)`
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 110;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 0.8rem 1.2rem;
  border-radius: 10px;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  }

  @media (max-width: 768px) {
    top: 15px;
    left: 15px;
    padding: 0.6rem 1rem;
    font-size: 0.8rem;
  }

  @media (max-width: 480px) {
    top: 10px;
    left: 10px;
    padding: 0.5rem 0.8rem;
    font-size: 0.75rem;
  }
`;

const MainWrapper = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  position: fixed;
  top: 25%;
  left: 5%;
  text-align: center;
  color: white;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.5);
  padding: 3rem 2.5rem;
  border-radius: 20px;
  width: 50rem;
  max-width: 90vw;
  max-height: 85vh;
  overflow-y: auto;
  z-index: 100;

  @media (max-width: 768px) {
    gap: 1.2rem;
    padding: 2rem 1.5rem;
  }

  @media (max-width: 480px) {
    gap: 1rem;
    padding: 1.5rem 1rem;
  }

  .title {
    font-size: 3.5rem;
    font-weight: 700;
    margin: 0 0 1rem 0;
    text-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);

    @media (max-width: 768px) {
      font-size: 2.5rem;
    }

    @media (max-width: 480px) {
      font-size: 2rem;
    }
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 100%;
  }

  .genderDiv {
    display: flex;
    justify-content: space-around;
    width: 100%;
    padding: 1rem;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 12px;

    label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        color: rgba(200, 182, 226, 1);
      }

      input[type="radio"] {
        width: auto;
        height: auto;
        margin: 0;
        accent-color: rgba(200, 182, 226, 1);
      }

      @media (max-width: 480px) {
        font-size: 0.9rem;
      }
    }
  }
`;

const InputWrapper = styled(motion.div)`
  width: 100%;
`;

const GlassInput = styled.input`
  width: 100%;
  padding: 1rem 1.5rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  color: white;
  font-size: 1rem;
  box-sizing: border-box;
  transition: all 0.3s ease;

  &::placeholder {
    color: rgba(255, 255, 255, 0.7);
  }

  &:focus {
    outline: none;
    border-color: rgba(200, 182, 226, 0.5);
    box-shadow: 0 0 20px rgba(200, 182, 226, 0.2);
    background: rgba(255, 255, 255, 0.15);
  }

  @media (max-width: 768px) {
    padding: 0.9rem 1.2rem;
    font-size: 0.95rem;
  }

  @media (max-width: 480px) {
    padding: 0.8rem 1rem;
    font-size: 0.9rem;
  }
`;

const GlassSelect = styled.select`
  width: 100%;
  padding: 1rem 1.5rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  color: white;
  font-size: 1rem;
  box-sizing: border-box;
  transition: all 0.3s ease;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: rgba(200, 182, 226, 0.5);
    box-shadow: 0 0 20px rgba(200, 182, 226, 0.2);
    background: rgba(255, 255, 255, 0.15);
  }

  option {
    background: rgba(0, 0, 0, 0.9);
    color: white;
  }

  @media (max-width: 768px) {
    padding: 0.9rem 1.2rem;
    font-size: 0.95rem;
  }

  @media (max-width: 480px) {
    padding: 0.8rem 1rem;
    font-size: 0.9rem;
  }
`;

const SubmitButton = styled(motion.button)`
  width: 100%;
  padding: 1.2rem 2rem;
  background: rgba(200, 182, 226, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(200, 182, 226, 0.3);
  border-radius: 12px;
  color: white;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 0.5rem;

  &:hover {
    background: rgba(200, 182, 226, 0.9);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(200, 182, 226, 0.4);
  }

  &:active {
    transform: scale(0.98);
  }

  @media (max-width: 768px) {
    padding: 1rem 1.5rem;
    font-size: 1rem;
  }

  @media (max-width: 480px) {
    padding: 0.9rem 1.2rem;
    font-size: 0.95rem;
  }
`;

const DatePickerWrapper = styled.div`
  width: 100%;

  .react-datepicker-wrapper {
    width: 100%;
  }

  .datePickerInput {
    width: 100%;
    padding: 1rem 1.5rem;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 12px;
    color: white;
    font-size: 1rem;
    box-sizing: border-box;
    transition: all 0.3s ease;

    &::placeholder {
      color: rgba(255, 255, 255, 0.7);
    }

    &:focus {
      outline: none;
      border-color: rgba(200, 182, 226, 0.5);
      box-shadow: 0 0 20px rgba(200, 182, 226, 0.2);
      background: rgba(255, 255, 255, 0.15);
    }

    @media (max-width: 768px) {
      padding: 0.9rem 1.2rem;
      font-size: 0.95rem;
    }

    @media (max-width: 480px) {
      padding: 0.8rem 1rem;
      font-size: 0.9rem;
    }
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
    <div>
      <Wrapper>
        <img src="/img/image1.png" alt="" />
        <img src="/img/image2.png" alt="" />
        <img src="/img/image3.png" alt="" />
      </Wrapper>

      <BackButton to="/">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="m15 18-6-6 6-6"/>
        </svg>
        홈으로
      </BackButton>

      <MainWrapper
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="title">회원가입</div>
        <form onSubmit={handleSubmit}>
          <InputWrapper whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <GlassInput
              type="email"
              placeholder="이메일을 입력해주세요"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </InputWrapper>

          <InputWrapper whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <GlassInput
              type="password"
              placeholder="비밀번호를 입력해주세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </InputWrapper>

          <InputWrapper whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <GlassInput
              type="text"
              placeholder="이름을 입력해주세요"
              value={characterName}
              onChange={(e) => setCharacterName(e.target.value)}
              required
            />
          </InputWrapper>

          <InputWrapper whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <GlassSelect
              value={mbti}
              onChange={(e) => setMbti(e.target.value)}
              required
            >
              <option value="" disabled>
                MBTI를 선택해주세요
              </option>
              {[
                "INTJ", "INTP", "ENTJ", "ENTP",
                "INFJ", "INFP", "ENFJ", "ENFP",
                "ISTJ", "ISFJ", "ESTJ", "ESFJ",
                "ISTP", "ISFP", "ESTP", "ESFP",
              ].map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </GlassSelect>
          </InputWrapper>

          <InputWrapper whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <DatePickerWrapper>
              <DatePicker
                selected={birthDate}
                onChange={(date) => setBirthDate(date)}
                dateFormat="yyyy-MM-dd"
                placeholderText="생일을 선택해주세요"
                className="datePickerInput"
                required
              />
            </DatePickerWrapper>
          </InputWrapper>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <div className="genderDiv">
              <label>
                <input
                  type="radio"
                  value="남성"
                  checked={gender === "남성"}
                  onChange={(e) => setGender(e.target.value)}
                  required
                />
                남성
              </label>
              <label>
                <input
                  type="radio"
                  value="여성"
                  checked={gender === "여성"}
                  onChange={(e) => setGender(e.target.value)}
                  required
                />
                여성
              </label>
            </div>
          </motion.div>

          <SubmitButton
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            회원가입
          </SubmitButton>
        </form>
      </MainWrapper>
    </div>
  );
}

export default Signup;
