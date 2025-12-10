import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./TimeZoneConverter.css";

const TimeZoneConverter = () => {
  const [hours, setHours] = useState("");
  const [offset, setOffset] = useState("");
  const [result, setResult] = useState("");

  const convert = () => {
    let base = Number(hours);
    let change = Number(offset);

    if (isNaN(base) || isNaN(change)) {
      setResult("Invalid Input");
      return;
    }

    let finalHour = (base + change + 24) % 24;
    let displayHour = finalHour === 0 ? 12 : finalHour > 12 ? finalHour - 12 : finalHour;
    let ampm = finalHour >= 12 ? "PM" : "AM";

    setResult(`${displayHour}:00 ${ampm}`);
  };

  return (
    <div className="time-container">
      <Link to="/" className="back-btn">⬅ Back</Link>

      <h3>Time Zone Converter</h3>

      <input
        type="number"
        placeholder="Current hour (0-23)"
        onChange={(e) => setHours(e.target.value)}
      />

      <input
        type="number"
        placeholder="Offset (+/- hours)"
        onChange={(e) => setOffset(e.target.value)}
      />

      <button onClick={convert}>Convert</button>

      <div className="result">{result}</div>
    </div>
  );
};

export default TimeZoneConverter;
