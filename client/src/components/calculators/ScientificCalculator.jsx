import React, { useState } from "react";
import Display from "../Display";
import { Link } from "react-router-dom";
import "./ScientificCalculator.css";

const ScientificCalculator = () => {
  const [value, setValue] = useState("");
  const [mode, setMode] = useState("DEG");
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  const insert = (digit) => setValue((prev) => prev + digit);

  const cleanResult = (num) => {
    // Round to 10 decimal places to eliminate floating point errors
    const rounded = Math.round(num * 1e10) / 1e10;
    // If very close to zero, return 0
    if (Math.abs(rounded) < 1e-10) return 0;
    return rounded;
  };

  const safeEval = (expression) => {
    try {
      const replaced = expression
        .replace(/√/g, "Math.sqrt")
        .replace(/\^/g, "**")
        .replace(/sin\(/g, "sinW(")
        .replace(/cos\(/g, "cosW(")
        .replace(/tan\(/g, "tanW(");

      // eslint-disable-next-line no-new-func
      const result = Function(
        `"use strict";
            return ((sinW, cosW, tanW) => (${replaced}))(
                (x)=>${mode === "DEG" ? "Math.sin((x*Math.PI)/180)" : "Math.sin(x)"},
                (x)=>${mode === "DEG" ? "Math.cos((x*Math.PI)/180)" : "Math.cos(x)"},
                (x)=>${mode === "DEG" ? "Math.tan((x*Math.PI)/180)" : "Math.tan(x)"}
            )`
      )();

      return cleanResult(result);
    } catch {
      return "Error";
    }
  };

  const calculate = () => {
    const result = String(safeEval(value));
    if (result !== "Error" && value) {
      setHistory((prev) => [...prev, { expression: value, result, mode }]);
    }
    setValue(result);
  };

  const clear = () => setValue("");
  
  const clearHistory = () => setHistory([]);
  
  const loadHistoryItem = (item) => {
    setValue(item.expression);
    setShowHistory(false);
  };

  return (
    <div className="sci-container">
      <Link to="/" className="back-btn">⬅ Back to Home</Link>

      <h2 className="sci-title">🔬 Scientific Calculator</h2>
      <p className="sci-subtitle">Advanced mathematical operations made easy</p>

      {/* Info Banner */}
      <div className="info-banner">
        <h3> Quick Guide</h3>
        <ul>
          <li>Use trigonometric functions: sin, cos, tan</li>
          <li>Calculate powers with ^ symbol (e.g., 2^3 = 8)</li>
          <li>Find square roots with √ symbol</li>
          <li>Switch between DEG (degrees) and RAD (radians)</li>
          <li>View past calculations in history</li>
        </ul>
      </div>

      {/* Mode Toggle Section */}
      <div className="mode-section">
        <div className="mode-label">📐 Angle Measurement Mode</div>
        <div className="toggle-wrapper">
          <span>RAD</span>
          <label className="switch">
            <input
              type="checkbox"
              checked={mode === "DEG"}
              onChange={() => setMode(mode === "DEG" ? "RAD" : "DEG")}
            />
            <span className="slider round"></span>
          </label>
          <span>DEG</span>
        </div>
        <div className="mode-hint">
          {mode === "DEG" 
            ? "Degrees: 360° = full circle (most common)" 
            : "Radians: 2π = full circle (for advanced math)"}
        </div>
      </div>

      <Display value={value || "0"} />

      {/* History Button */}
      <button 
        className="history-btn" 
        onClick={() => setShowHistory(!showHistory)}
      >
        📜 {showHistory ? "Hide" : "Show"} History ({history.length})
      </button>

      {/* History Panel */}
      {showHistory && (
        <div className="history-panel">
          <div className="history-header">
            <h3>📚 Calculation History</h3>
            <button onClick={clearHistory} className="clear-history-btn">
              Clear All
            </button>
          </div>
          <div className="history-list">
            {history.length === 0 ? (
              <p className="no-history">No calculations yet. Start computing!</p>
            ) : (
              history.map((item, index) => (
                <div 
                  key={index} 
                  className="history-item"
                  onClick={() => loadHistoryItem(item)}
                  title="Click to reload this calculation"
                >
                  <div className="history-expression">{item.expression}</div>
                  <div className="history-result">= {item.result}</div>
                  <div className="history-mode">{item.mode}</div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      <div className="button-section">
        <div className="section-label">🔢 Functions & Operations</div>
        <div className="sci-grid">

          {/* FUNCTION ROW */}
          <button 
            className="function-btn" 
            onClick={() => insert("sin(")}
            title="Sine function - calculates sine of angle"
          >
            sin(
          </button>
          <button 
            className="function-btn" 
            onClick={() => insert("cos(")}
            title="Cosine function - calculates cosine of angle"
          >
            cos(
          </button>
          <button 
            className="function-btn" 
            onClick={() => insert("tan(")}
            title="Tangent function - calculates tangent of angle"
          >
            tan(
          </button>
          <button 
            className="function-btn" 
            onClick={() => insert("√(")}
            title="Square root - √(9) = 3"
          >
            √(
          </button>

          {/* SECOND ROW */}
          <button 
            className="operator-btn"
            onClick={() => insert("^")}
            title="Power/Exponent - 2^3 = 8"
          >
            ^
          </button>
          <button 
            className="operator-btn"
            onClick={() => insert("%")}
            title="Modulo/Remainder - 10%3 = 1"
          >
            %
          </button>
          <button 
            onClick={() => insert(Math.PI.toFixed(6))}
            title="Pi constant ≈ 3.14159"
          >
            π
          </button>
          <button 
            className="operator-btn"
            onClick={() => insert("/")}
            title="Division"
          >
            /
          </button>

          {/* NUMBER PAD */}
          <button onClick={() => insert("7")}>7</button>
          <button onClick={() => insert("8")}>8</button>
          <button onClick={() => insert("9")}>9</button>
          <button 
            className="operator-btn"
            onClick={() => insert("*")}
            title="Multiplication"
          >
            *
          </button>

          <button onClick={() => insert("4")}>4</button>
          <button onClick={() => insert("5")}>5</button>
          <button onClick={() => insert("6")}>6</button>
          <button 
            className="operator-btn"
            onClick={() => insert("-")}
            title="Subtraction"
          >
            -
          </button>

          <button onClick={() => insert("1")}>1</button>
          <button onClick={() => insert("2")}>2</button>
          <button onClick={() => insert("3")}>3</button>
          <button 
            className="operator-btn"
            onClick={() => insert("+")}
            title="Addition"
          >
            +
          </button>

          {/* LAST ROW */}
          <button onClick={() => insert("0")}>0</button>
          <button 
            onClick={() => insert(".")}
            title="Decimal point"
          >
            .
          </button>
          <button 
            onClick={() => insert("(")}
            title="Opening parenthesis"
          >
            (
          </button>
          <button 
            onClick={() => insert(")")}
            title="Closing parenthesis"
          >
            )
          </button>

          {/* FINAL ACTIONS */}
          <button 
            className="equals" 
            onClick={calculate}
            title="Calculate result"
          >
            =
          </button>
          <button 
            className="clear" 
            onClick={clear}
            title="Clear display"
          >
            C
          </button>

        </div>
      </div>
    </div>
  );
};

export default ScientificCalculator;