import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const LOCAL_KEY = "healthResults";

const HealthForm = () => {
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [height, setHeight] = useState(""); // cm
  const [weight, setWeight] = useState(""); // kg
  const [smoking, setSmoking] = useState("");
  const [drinking, setDrinking] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [showCard, setShowCard] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState([]); // 이력 리스트
  const resultCardRef = useRef(null);

  // 이력 불러오기 (최초 1회)
  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_KEY);
    if (stored) {
      try {
        setResults(JSON.parse(stored));
      } catch {
        setResults([]);
      }
    }
  }, []);

  // 이력 저장 함수
  const saveResults = (arr) => {
    setResults(arr);
    localStorage.setItem(LOCAL_KEY, JSON.stringify(arr));
  };

  useEffect(() => {
    if (result) {
      setShowCard(true);
    } else {
      setShowCard(false);
    }
  }, [result]);

  // 결과 카드가 나타날 때 스크롤 이동
  useEffect(() => {
    if (showCard && resultCardRef.current) {
      resultCardRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [showCard]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResult("");
    setError("");
    setShowCard(false);
    setIsLoading(true);
    // BMI 계산: kg / (m^2) (주석처리됨)
    // const h = parseFloat(height) / 100;
    // const w = parseFloat(weight);
    // const bmi = h && w ? (w / (h * h)).toFixed(1) : "";
    const message = `나이: ${age}, 성별: ${gender}, 키: ${height}cm, 몸무게: ${weight}kg, 흡연: ${smoking}, 음주: ${drinking}`;
    try {
      const response = await axios.post("/api/advice", { message });
      const resultText =
        response.data.result ||
        response.data.message ||
        response.data.response ||
        "응답이 없습니다.";
      setResult(resultText);
      // 새 이력 추가 (최신순)
      const newHistory = [
        {
          id: Date.now(),
          date: new Date().toLocaleString(),
          input: message,
          result: resultText,
        },
        ...results,
      ];
      saveResults(newHistory);
    } catch (error) {
      setError("서버 요청 중 오류 발생: " + (error.response?.data?.message || error.message));
    } finally {
      setIsLoading(false);
    }
  };

  // 이력 삭제
  const handleDeleteHistory = (id) => {
    const filtered = results.filter((item) => item.id !== id);
    saveResults(filtered);
  };

  return (
    <div style={{
      width: "100vw",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      background: "linear-gradient(135deg, #e0e7ff 0%, #f8fafc 100%)"
    }}>
      <div style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "center",
        width: "100%",
        maxWidth: 1200,
        gap: 40,
        marginTop: 40,
        marginBottom: 40
      }}>
        {/* 입력 폼 및 결과 카드 */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 480, minWidth: 400 }}>
          <form
            onSubmit={handleSubmit}
            style={{
              background: "#fff",
              boxShadow: "0 2px 16px rgba(0,0,0,0.10)",
              borderRadius: 16,
              padding: 32,
              minWidth: 400,
              maxWidth: 440,
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: 20,
              alignItems: "stretch",
            }}
          >
            <h2 style={{ textAlign: "center", color: "#2d7be5", marginBottom: 8 }}>건강 정보 입력</h2>
            <label style={{ fontWeight: 500, color: "#333", marginBottom: 4 }}>
              나이
              <input
                type="number"
                value={age}
                onChange={e => setAge(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  marginTop: 6,
                  border: "1px solid #d1d5db",
                  borderRadius: 8,
                  fontSize: 16,
                  outline: "none",
                  transition: "border 0.2s",
                  marginBottom: 2
                }}
              />
            </label>
            <label style={{ fontWeight: 500, color: "#333", marginBottom: 4 }}>
              성별
              <select
                value={gender}
                onChange={e => setGender(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  marginTop: 6,
                  border: "1px solid #d1d5db",
                  borderRadius: 8,
                  fontSize: 16,
                  outline: "none",
                  background: "#f9fafb",
                  marginBottom: 2
                }}
              >
                <option value="">선택</option>
                <option value="male">남성</option>
                <option value="female">여성</option>
              </select>
            </label>
            <label style={{ fontWeight: 500, color: "#333", marginBottom: 4 }}>
              키 (cm)
              <input
                type="number"
                value={height}
                onChange={e => setHeight(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  marginTop: 6,
                  border: "1px solid #d1d5db",
                  borderRadius: 8,
                  fontSize: 16,
                  outline: "none",
                  marginBottom: 2
                }}
              />
            </label>
            <label style={{ fontWeight: 500, color: "#333", marginBottom: 4 }}>
              몸무게 (kg)
              <input
                type="number"
                value={weight}
                onChange={e => setWeight(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  marginTop: 6,
                  border: "1px solid #d1d5db",
                  borderRadius: 8,
                  fontSize: 16,
                  outline: "none",
                  marginBottom: 2
                }}
              />
            </label>
            <label style={{ fontWeight: 500, color: "#333", marginBottom: 4 }}>
              흡연
              <select
                value={smoking}
                onChange={e => setSmoking(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  marginTop: 6,
                  border: "1px solid #d1d5db",
                  borderRadius: 8,
                  fontSize: 16,
                  outline: "none",
                  background: "#f9fafb",
                  marginBottom: 2
                }}
              >
                <option value="">선택</option>
                <option value="yes">예</option>
                <option value="no">아니오</option>
              </select>
            </label>
            <label style={{ fontWeight: 500, color: "#333", marginBottom: 4 }}>
              음주
              <select
                value={drinking}
                onChange={e => setDrinking(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  marginTop: 6,
                  border: "1px solid #d1d5db",
                  borderRadius: 8,
                  fontSize: 16,
                  outline: "none",
                  background: "#f9fafb",
                  marginBottom: 2
                }}
              >
                <option value="">선택</option>
                <option value="yes">예</option>
                <option value="no">아니오</option>
              </select>
            </label>
            <button
              type="submit"
              style={{
                marginTop: 10,
                padding: "12px 0",
                background: "#2d7be5",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                fontWeight: 600,
                fontSize: 18,
                cursor: "pointer",
                boxShadow: "0 1px 4px rgba(45,123,229,0.08)",
                transition: "background 0.2s"
              }}
              onMouseOver={e => (e.target.style.background = "#1e5bb8")}
              onMouseOut={e => (e.target.style.background = "#2d7be5")}
            >
              건강 분석 요청
            </button>
          </form>
          {isLoading && (
            <div style={{
              marginTop: 28,
              minWidth: 400,
              maxWidth: 500,
              display: "flex",
              flexDirection: "column",
              alignItems: "center"
            }}>
              <span style={{ color: "#2d7be5", fontWeight: 500, fontSize: 17, marginBottom: 12 }}>
                데이터 생성 중... 잠시만 기다려주세요
              </span>
              <div style={{
                width: "100%",
                height: 8,
                background: "#e5e7eb",
                borderRadius: 8,
                overflow: "hidden",
                position: "relative"
              }}>
                <div style={{
                  width: "40%",
                  height: "100%",
                  background: "linear-gradient(90deg, #2d7be5 40%, #60a5fa 100%)",
                  borderRadius: 8,
                  position: "absolute",
                  left: 0,
                  top: 0,
                  animation: "progressBarIndeterminate 1.2s infinite linear"
                }} />
                <style>{`
                  @keyframes progressBarIndeterminate {
                    0% { left: -40%; width: 40%; }
                    50% { left: 30%; width: 60%; }
                    100% { left: 100%; width: 40%; }
                  }
                `}</style>
              </div>
            </div>
          )}
          {showCard && result && (
            <div ref={resultCardRef} style={{
              marginTop: 32,
              background: "#fff",
              boxShadow: "0 2px 12px rgba(0,0,0,0.10)",
              borderRadius: 16,
              padding: 28,
              fontSize: 16,
              whiteSpace: "pre-line",
              minWidth: 400,
              maxWidth: 500,
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              position: "relative"
            }}>
              <button
                onClick={() => { setShowCard(false); setResult(""); }}
                style={{
                  position: "absolute",
                  top: 14,
                  right: 14,
                  background: "#f3f4f6",
                  border: "none",
                  borderRadius: "50%",
                  width: 28,
                  height: 28,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 18,
                  color: "#888",
                  cursor: "pointer",
                  transition: "background 0.2s"
                }}
                aria-label="닫기"
                title="닫기"
                onMouseOver={e => (e.target.style.background = "#e5e7eb")}
                onMouseOut={e => (e.target.style.background = "#f3f4f6")}
              >
                ×
              </button>
              <strong style={{ fontSize: 20, marginBottom: 10, color: "#2d7be5" }}>건강 분석 결과</strong>
              <span>{result}</span>
            </div>
          )}
          {error && (
            <div style={{ color: "red", marginTop: 16 }}>{error}</div>
          )}
        </div>
        {/* 분석 결과 이력 리스트 - 가로 스크롤 */}
        {results.length > 0 && (
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            width: "100%",
            maxWidth: 600
          }}>
            <h3 style={{ color: "#2d7be5", marginBottom: 16, fontWeight: 600 }}>분석 결과 이력</h3>
            <div style={{
              display: "flex",
              flexDirection: "row",
              gap: 18,
              overflowX: "auto",
              width: 520,
              maxWidth: "60vw",
              paddingBottom: 8
            }}>
              {results.map((item) => (
                <div key={item.id} style={{
                  background: "#fff",
                  boxShadow: "0 1px 6px rgba(0,0,0,0.08)",
                  borderRadius: 12,
                  padding: 18,
                  minWidth: 260,
                  maxWidth: 320,
                  position: "relative",
                  flex: "0 0 auto"
                }}>
                  <button
                    onClick={() => handleDeleteHistory(item.id)}
                    style={{
                      position: "absolute",
                      top: 10,
                      right: 10,
                      background: "#f3f4f6",
                      border: "none",
                      borderRadius: "50%",
                      width: 24,
                      height: 24,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 15,
                      color: "#888",
                      cursor: "pointer",
                      transition: "background 0.2s"
                    }}
                    aria-label="이력 삭제"
                    title="이력 삭제"
                    onMouseOver={e => (e.target.style.background = "#e5e7eb")}
                    onMouseOut={e => (e.target.style.background = "#f3f4f6")}
                  >
                    ×
                  </button>
                  <div style={{ fontSize: 13, color: "#888", marginBottom: 6 }}>{item.date}</div>
                  <div style={{ fontSize: 14, color: "#555", marginBottom: 8 }}><b>입력값:</b> {item.input}</div>
                  <div style={{ fontSize: 15, whiteSpace: "pre-line" }}><b>분석 결과:</b> {item.result}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HealthForm; 