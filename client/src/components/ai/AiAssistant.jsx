import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaRobot,
  FaLightbulb,
  FaHistory,
  FaCalculator,
  FaExchangeAlt,
  FaGraduationCap,
  FaBook,
  FaPaperPlane,
} from "react-icons/fa";

import "./AiAssistant.css";

// ✅ Use environment variable OR fallback to Render backend URL
const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://calculator-app-1-b2sf.onrender.com";

const AiAssistant = ({ userId }) => {
  const [question, setQuestion] = useState("");
  const [conversationType, setConversationType] = useState("general");
  const [answer, setAnswer] = useState("");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔥 LOAD HISTORY WHEN USER ID IS AVAILABLE
  useEffect(() => {
    if (!userId) return;

    axios
      .get(`${API_URL}/api/ai/${userId}`)
      .then((res) => {
        if (res.data.success) {
          setHistory(res.data.data);
        }
      })
      .catch((err) => console.error("History load error:", err));
  }, [userId]);

  // 🔥 SEND QUESTION TO BACKEND
  const handleAsk = async () => {
    if (!question.trim()) return;

    setLoading(true);
    setAnswer("");

    try {
      const res = await axios.post(`${API_URL}/api/ai/ask`, {
        userId,
        question,
        conversationType,
      });

      if (res.data.success) {
        setAnswer(res.data.answer);

        // Update local history instantly
        setHistory((prev) => [
          {
            question,
            answer: res.data.answer,
            conversation_type: conversationType,
            created_at: new Date(),
          },
          ...prev,
        ]);
      }
    } catch (error) {
      console.error("AI Error:", error);
      setAnswer("Error: Could not get response.");
    }

    setLoading(false);
  };

  return (
    <div className="ai-container">
      <h2 className="ai-title">
        <FaRobot /> AI Assistant
      </h2>

      {/* TYPE SELECTOR */}
      <div className="ai-type-selector">
        <button
          className={conversationType === "general" ? "active" : ""}
          onClick={() => setConversationType("general")}
        >
          <FaLightbulb /> General
        </button>

        <button
          className={conversationType === "math" ? "active" : ""}
          onClick={() => setConversationType("math")}
        >
          <FaCalculator /> Math
        </button>

        <button
          className={conversationType === "conversion" ? "active" : ""}
          onClick={() => setConversationType("conversion")}
        >
          <FaExchangeAlt /> Conversion
        </button>

        <button
          className={conversationType === "education" ? "active" : ""}
          onClick={() => setConversationType("education")}
        >
          <FaGraduationCap /> Education
        </button>

        <button
          className={conversationType === "books" ? "active" : ""}
          onClick={() => setConversationType("books")}
        >
          <FaBook /> Books
        </button>
      </div>

      {/* INPUT BOX */}
      <div className="ai-input-box">
        <textarea
          className="ai-textarea"
          placeholder="Ask something..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />

        <button
          className="ai-send-btn"
          onClick={handleAsk}
          disabled={loading}
        >
          {loading ? "Thinking..." : <FaPaperPlane />}
        </button>
      </div>

      {/* ANSWER */}
      {answer && (
        <div className="ai-answer-box">
          <strong>Answer:</strong>
          <p>{answer}</p>
        </div>
      )}

      {/* HISTORY */}
      <h3 className="ai-history-title">
        <FaHistory /> Recent Questions
      </h3>

      <div className="ai-history-list">
        {history.length === 0 && <p>No history yet.</p>}

        {history.map((item, index) => (
          <div key={index} className="ai-history-item">
            <p>
              <strong>Q:</strong> {item.question}
            </p>
            <p>
              <strong>A:</strong> {item.answer}
            </p>
            <span className="ai-type-tag">{item.conversation_type}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AiAssistant;
