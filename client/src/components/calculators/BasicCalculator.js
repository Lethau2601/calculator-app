import React, { useState } from "react";
import { Link } from "react-router-dom";

// ✅ Correct lucide-react icons
import {
  ArrowLeft,
  Plus,
  Minus,
  Divide,
  X,
  Percent,
  FunctionSquare,
  Database,
  History,
  Calculator as CalcIcon
} from "lucide-react";

import Display from "../Display";
import Button from "../Button";
import "./BasicCalculator.css";

const BasicCalculator = () => {
  const [displayValue, setDisplayValue] = useState("0");
  const [firstOperand, setFirstOperand] = useState(null);
  const [operator, setOperator] = useState(null);
  const [waitingForSecondOperand, setWaitingForSecondOperand] = useState(false);
  const [memory, setMemory] = useState(0);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  const handleDigit = (digit) => {
    if (waitingForSecondOperand) {
      setDisplayValue(digit);
      setWaitingForSecondOperand(false);
    } else {
      setDisplayValue(displayValue === "0" ? digit : displayValue + digit);
    }
  };

  const handleDecimal = () => {
    if (!displayValue.includes(".")) {
      setDisplayValue(displayValue + ".");
    }
  };

  const calculate = (first, second, op) => {
    switch (op) {
      case "+":
        return first + second;
      case "−":
        return first - second;
      case "×":
        return first * second;
      case "÷":
        return second !== 0 ? first / second : "Error";
      default:
        return second;
    }
  };

  const handleOperator = (nextOperator) => {
    const inputValue = parseFloat(displayValue);

    if (firstOperand === null) {
      setFirstOperand(inputValue);
    } else if (operator) {
      const result = calculate(firstOperand, inputValue, operator);
      setDisplayValue(String(result));
      setFirstOperand(result);
    }

    setWaitingForSecondOperand(true);
    setOperator(nextOperator);
  };

  const handleEquals = () => {
    if (operator && firstOperand !== null) {
      const inputValue = parseFloat(displayValue);
      const result = calculate(firstOperand, inputValue, operator);
      const expression = `${firstOperand} ${operator} ${inputValue}`;
      
      // Add to history
      if (result !== "Error") {
        setHistory((prev) => [...prev, { expression, result: String(result) }]);
      }
      
      setDisplayValue(String(result));
      setFirstOperand(null);
      setOperator(null);
      setWaitingForSecondOperand(false);
    }
  };

  const handleClear = () => {
    setDisplayValue("0");
    setFirstOperand(null);
    setOperator(null);
    setWaitingForSecondOperand(false);
  };

  const handleSign = () => {
    setDisplayValue(String(-parseFloat(displayValue)));
  };

  const handlePercent = () => {
    setDisplayValue(String(parseFloat(displayValue) / 100));
  };

  const handleSquareRoot = () => {
    const value = parseFloat(displayValue);
    setDisplayValue(value >= 0 ? String(Math.sqrt(value)) : "Error");
  };

  const handleMemory = (memOp) => {
    const value = parseFloat(displayValue);
    switch (memOp) {
      case "M+":
        setMemory(memory + value);
        break;
      case "M-":
        setMemory(memory - value);
        break;
      case "MR":
        setDisplayValue(String(memory));
        break;
      case "MC":
        setMemory(0);
        break;
      default:
        break;
    }
  };

  const clearHistory = () => setHistory([]);

  const loadHistoryItem = (item) => {
    setDisplayValue(item.result);
    setShowHistory(false);
  };

  const handleButtonClick = (label) => {
    if (/^\d+$/.test(label)) {
      handleDigit(label);
    } else if (label === ".") {
      handleDecimal();
    } else if (["+", "−", "×", "÷"].includes(label)) {
      handleOperator(label);
    } else if (label === "=") {
      handleEquals();
    } else if (label === "C") {
      handleClear();
    } else if (label === "±") {
      handleSign();
    } else if (label === "%") {
      handlePercent();
    } else if (label === "√") {
      handleSquareRoot();
    } else if (["M+", "M-", "MR", "MC"].includes(label)) {
      handleMemory(label);
    }
  };

  const buttons = [
    ["MC", "MR", "M+", "M-"],
    ["C", "±", "%", "√"],
    ["7", "8", "9", "÷"],
    ["4", "5", "6", "×"],
    ["1", "2", "3", "−"],
    ["0", ".", "=", "+"],
  ];

  return (
    <div className="calculator">
      
      {/* Header Section */}
      <div className="calc-header">
        {/* 🔙 Icon Back Button */}
        <Link to="/" className="back-btn">
          <ArrowLeft /> Back to Home
        </Link>

        <h2 className="calc-title">
          <CalcIcon size={24} style={{ display: 'inline', marginRight: '8px' }} />
          Basic Calculator
        </h2>
        <p className="calc-subtitle">Simple arithmetic operations</p>
      </div>

      {/* Info Banner */}
      <div className="info-banner">
        <h3> Quick Tips</h3>
        <ul>
          <li><strong>Memory:</strong> M+ adds to memory, MR recalls it</li>
          <li><strong>%</strong> converts to percentage (50 → 0.5)</li>
          <li><strong>√</strong> calculates square root</li>
          <li><strong>±</strong> changes positive/negative sign</li>
          <li>Click history items to reload calculations</li>
        </ul>
      </div>

      {/* Memory Indicator */}
      <div className={`memory-indicator ${memory === 0 ? 'empty' : ''}`}>
        <Database size={16} />
        {memory === 0 ? 'Memory: Empty' : `Memory: ${memory}`}
      </div>

      <Display value={displayValue} />

      {/* History Button */}
      <button 
        className="history-btn" 
        onClick={() => setShowHistory(!showHistory)}
        title="View your calculation history"
      >
        <History /> {showHistory ? "Hide" : "Show"} History ({history.length})
      </button>

      {/* History Panel */}
      {showHistory && (
        <div className="history-panel">
          <div className="history-header">
            <h3>
              <History size={18} />
              Calculation History
            </h3>
            <button 
              onClick={clearHistory} 
              className="clear-history-btn"
              title="Clear all history"
            >
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
                  title="Click to load this result"
                >
                  <div className="history-expression">{item.expression}</div>
                  <div className="history-result">= {item.result}</div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Button Section Label */}
      <div className="button-section-label">Calculator Buttons</div>

      <div className="buttons">
        {buttons.map((row, rowIndex) => (
          <div key={rowIndex} className="button-row">
            {row.map((label) => (
              <Button
                key={label}
                label={
                  label === "+" ? <Plus />
                  : label === "−" ? <Minus />
                  : label === "×" ? <X />
                  : label === "÷" ? <Divide />
                  : label === "%" ? <Percent />
                  : label === "√" ? <FunctionSquare />
                  : label === "±" ? "±"
                  : ["MC","MR","M+","M-"].includes(label) ? <><Database size={18} /> {label}</>
                  : label
                }
                onClick={() => handleButtonClick(label)}
                className={
                  ["+", "−", "×", "÷"].includes(label)
                    ? "operator"
                    : ["C", "±", "%", "√", "MC", "MR", "M+", "M-"].includes(label)
                    ? "function"
                    : label === "="
                    ? "equals"
                    : ""
                }
                title={
                  label === "MC" ? "Memory Clear - Clear stored memory"
                  : label === "MR" ? "Memory Recall - Show stored memory"
                  : label === "M+" ? "Memory Plus - Add to memory"
                  : label === "M-" ? "Memory Minus - Subtract from memory"
                  : label === "C" ? "Clear - Reset calculator"
                  : label === "±" ? "Plus/Minus - Change sign"
                  : label === "%" ? "Percent - Convert to percentage"
                  : label === "√" ? "Square Root - Calculate √x"
                  : label === "÷" ? "Divide"
                  : label === "×" ? "Multiply"
                  : label === "−" ? "Subtract"
                  : label === "+" ? "Add"
                  : label === "=" ? "Equals - Calculate result"
                  : label === "." ? "Decimal point"
                  : ""
                }
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BasicCalculator;