import React, { useState } from "react";
import axios from "axios";

const HealthForm = () => {
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [bmi, setBmi] = useState("");
  const [smoking, setSmoking] = useState("");
  const [drinking, setDrinking] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    // message 필드에 입력값을 문자열로 합침
    const message = `나이: ${age}, 성별: ${gender}, BMI: ${bmi}, 흡연: ${smoking}, 음주: ${drinking}`;
    try {
      const response = await axios.post("/advice", { message });
      alert(response.data.result || response.data.message || "응답이 없습니다.");
    } catch (error) {
      alert("서버 요청 중 오류 발생: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: "0 auto", display: "flex", flexDirection: "column", gap: 16 }}>
      <label>
        나이:
        <input type="number" value={age} onChange={e => setAge(e.target.value)} required />
      </label>
      <label>
        성별:
        <select value={gender} onChange={e => setGender(e.target.value)} required>
          <option value="">선택</option>
          <option value="male">남성</option>
          <option value="female">여성</option>
        </select>
      </label>
      <label>
        BMI:
        <input type="number" step="0.1" value={bmi} onChange={e => setBmi(e.target.value)} required />
      </label>
      <label>
        흡연:
        <select value={smoking} onChange={e => setSmoking(e.target.value)} required>
          <option value="">선택</option>
          <option value="yes">예</option>
          <option value="no">아니오</option>
        </select>
      </label>
      <label>
        음주:
        <select value={drinking} onChange={e => setDrinking(e.target.value)} required>
          <option value="">선택</option>
          <option value="yes">예</option>
          <option value="no">아니오</option>
        </select>
      </label>
      <button type="submit">Submit</button>
    </form>
  );
};

export default HealthForm; 