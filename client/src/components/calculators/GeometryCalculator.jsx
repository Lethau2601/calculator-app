import React, { useState } from "react";
import { Link } from "react-router-dom";

import { GiTriangleTarget, GiCube, GiCircle } from "react-icons/gi";
import { FaRuler, FaVideo, FaPlay, FaBook } from "react-icons/fa";

import "./GeometryCalculator.css";

const GeometryCalculator = () => {
  const [inputs, setInputs] = useState({});
  const [result, setResult] = useState(null);
  const [activeTab, setActiveTab] = useState("calculator"); // calculator, resources

  // Video Resources
  const videoResources = [
    {
      id: 1,
      title: "Geometry Area Basics",
      description: "Learn the fundamentals of calculating area for different shapes including squares, circles, and triangles",
      filename: "geometry-area-basics.mp4",
      duration: "~15 mins",
      topics: ["Square Area", "Circle Area", "Triangle Area"]
    },
    {
      id: 2,
      title: "Geometry Shapes Tutorial",
      description: "Complete guide to understanding geometric shapes and their properties with step-by-step examples",
      filename: "geometry-shapes-tutorial.mp4",
      duration: "~20 mins",
      topics: ["Shape Properties", "Formula Applications", "Practice Problems"]
    }
  ];

  const update = (key, val) => {
    setInputs({ ...inputs, [key]: val });
  };

  const clear = (shape) => {
    const newInputs = { ...inputs };
    if (shape === "square") delete newInputs.side;
    if (shape === "circle") delete newInputs.radius;
    if (shape === "triangle") {
      delete newInputs.base;
      delete newInputs.height;
    }
    setInputs(newInputs);
  };

  const calcSquare = () => {
    const side = parseFloat(inputs.side);
    if (!side || side <= 0) {
      return setResult({
        type: "error",
        message: "⚠️ Please enter a valid positive number for the side length. Example: 5"
      });
    }
    const area = side ** 2;
    setResult({
      type: "success",
      shape: "Square",
      formula: "Area = side²",
      steps: [
        `Given: side length = ${side} units`,
        `Formula: Area = side × side = side²`,
        `Substitute: Area = ${side} × ${side}`,
        `Calculate: Area = ${area.toFixed(2)} square units`
      ],
      answer: `${area.toFixed(2)} square units`
    });
  };

  const calcCircle = () => {
    const radius = parseFloat(inputs.radius);
    if (!radius || radius <= 0) {
      return setResult({
        type: "error",
        message: "⚠️ Please enter a valid positive number for the radius. Example: 3"
      });
    }
    const area = Math.PI * radius ** 2;
    setResult({
      type: "success",
      shape: "Circle",
      formula: "Area = πr²",
      steps: [
        `Given: radius (r) = ${radius} units`,
        `Formula: Area = π × r²`,
        `π (pi) ≈ 3.14159...`,
        `Substitute: Area = π × ${radius}²`,
        `Calculate: Area = π × ${(radius ** 2).toFixed(2)}`,
        `Final: Area = ${area.toFixed(2)} square units`
      ],
      answer: `${area.toFixed(2)} square units`
    });
  };

  const calcTriangle = () => {
    const base = parseFloat(inputs.base);
    const height = parseFloat(inputs.height);
    
    if (!base || base <= 0) {
      return setResult({
        type: "error",
        message: "⚠️ Please enter a valid positive number for the base. Example: 6"
      });
    }
    if (!height || height <= 0) {
      return setResult({
        type: "error",
        message: "⚠️ Please enter a valid positive number for the height. Example: 4"
      });
    }
    
    const area = 0.5 * base * height;
    setResult({
      type: "success",
      shape: "Triangle",
      formula: "Area = ½ × base × height",
      steps: [
        `Given: base = ${base} units, height = ${height} units`,
        `Formula: Area = ½ × base × height`,
        `Remember: ½ = 0.5`,
        `Substitute: Area = 0.5 × ${base} × ${height}`,
        `Calculate: Area = ${area.toFixed(2)} square units`
      ],
      answer: `${area.toFixed(2)} square units`
    });
  };

  const fillExample = (shape) => {
    if (shape === "square") {
      setInputs({ ...inputs, side: "5" });
    } else if (shape === "circle") {
      setInputs({ ...inputs, radius: "3" });
    } else if (shape === "triangle") {
      setInputs({ ...inputs, base: "6", height: "4" });
    }
  };

  return (
    <div className="geo-container">
      <Link to="/" className="back-btn">⬅ Back</Link>

      <h2>
        <FaRuler size={30} /> Geometry Tools
      </h2>

      <p className="subtitle">Learn area calculations with step-by-step explanations</p>

      {/* Tab Navigation */}
      <div className="geo-tab-nav">
        <button 
          className={activeTab === "calculator" ? "geo-tab-active" : ""}
          onClick={() => setActiveTab("calculator")}
        >
          <FaRuler /> Calculator
        </button>
        <button 
          className={activeTab === "resources" ? "geo-tab-active" : ""}
          onClick={() => setActiveTab("resources")}
        >
          <FaVideo /> Video Resources
        </button>
      </div>

      {/* CALCULATOR TAB */}
      {activeTab === "calculator" && (
        <>
          {/* Info Banner */}
          <div className="info-banner">
            <ul>
              <li>Enter measurements in any unit (cm, m, inches, etc.)</li>
              <li>Click 'Calculate' to see step-by-step solution</li>
              <li>Try 'Use Example' if you need sample values</li>
              <li>All steps are shown so you can learn the process</li>
            </ul>
          </div>

          {/* Square Card */}
          <div className="shape-card">
            <div className="shape-header">
              <GiCube size={30} />
              <p>Square</p>
            </div>
            
            <div className="formula-display">
              Area = side²
            </div>

            <p className="hint-text">
              A square has 4 equal sides. Area = side × side
            </p>

            <div className="input-group">
              <label className="input-label">Side Length:</label>
              <input
                type="number"
                placeholder="Enter side length"
                value={inputs.side || ""}
                onChange={e => update("side", e.target.value)}
              />
            </div>

            <span className="example-link" onClick={() => fillExample("square")}>
              📝 Use Example (side = 5)
            </span>

            <div className="button-group">
              <button onClick={calcSquare}>Calculate</button>
              <button className="clear-btn" onClick={() => clear("square")}>Clear</button>
            </div>
          </div>

          {/* Circle Card */}
          <div className="shape-card">
            <div className="shape-header">
              <GiCircle size={30} />
              <p>Circle</p>
            </div>
            
            <div className="formula-display">
              Area = πr²
            </div>

            <p className="hint-text">
              π (pi) ≈ 3.14159. Radius is distance from center to edge
            </p>

            <div className="input-group">
              <label className="input-label">Radius:</label>
              <input
                type="number"
                placeholder="Enter radius"
                value={inputs.radius || ""}
                onChange={e => update("radius", e.target.value)}
              />
            </div>

            <span className="example-link" onClick={() => fillExample("circle")}>
              📝 Use Example (radius = 3)
            </span>

            <div className="button-group">
              <button onClick={calcCircle}>Calculate</button>
              <button className="clear-btn" onClick={() => clear("circle")}>Clear</button>
            </div>
          </div>

          {/* Triangle Card */}
          <div className="shape-card">
            <div className="shape-header">
              <GiTriangleTarget size={30} />
              <p>Triangle</p>
            </div>
            
            <div className="formula-display">
              Area = ½ × base × height
            </div>

            <p className="hint-text">
              Height must be perpendicular (90°) to the base
            </p>

            <div className="input-group">
              <label className="input-label">Base:</label>
              <input
                type="number"
                placeholder="Enter base length"
                value={inputs.base || ""}
                onChange={e => update("base", e.target.value)}
              />
            </div>

            <div className="input-group">
              <label className="input-label">Height:</label>
              <input
                type="number"
                placeholder="Enter height"
                value={inputs.height || ""}
                onChange={e => update("height", e.target.value)}
              />
            </div>

            <span className="example-link" onClick={() => fillExample("triangle")}>
              📝 Use Example (base = 6, height = 4)
            </span>

            <div className="button-group">
              <button onClick={calcTriangle}>Calculate</button>
              <button className="clear-btn" onClick={() => clear("triangle")}>Clear</button>
            </div>
          </div>

          {/* Result Display */}
          {result && (
            <div className="result-box">
              {result.type === "error" ? (
                <div className="error-message">
                  {result.message}
                </div>
              ) : (
                <>
                  <div className="result-title">
                    {result.shape} Area Calculation
                  </div>

                  <div className="result-steps">
                    <p style={{ color: "#00ff9d", fontWeight: "bold", fontSize: "15px" }}>
                      Step-by-Step Solution:
                    </p>
                    {result.steps.map((step, i) => (
                      <p key={i}>
                        <span className="step-number">Step {i + 1}:</span>
                        {step}
                      </p>
                    ))}
                  </div>

                  <div className="final-answer">
                    📐 Final Answer: {result.answer}
                  </div>
                </>
              )}
            </div>
          )}
        </>
      )}

      {/* RESOURCES TAB */}
      {activeTab === "resources" && (
        <div className="geo-resources-section">
          <h3>📺 Video Learning Resources</h3>
          <p className="geo-resources-intro">
            Watch these comprehensive video tutorials to master geometry area calculations!
          </p>

          <div className="geo-video-grid">
            {videoResources.map((video) => (
              <div key={video.id} className="geo-video-card">
                <div className="geo-video-icon">
                  <FaPlay />
                </div>
                <div className="geo-video-content">
                  <h4>{video.title}</h4>
                  <p>{video.description}</p>
                  
                  <div className="geo-video-topics">
                    <strong>Topics Covered:</strong>
                    <ul>
                      {video.topics.map((topic, idx) => (
                        <li key={idx}>{topic}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <span className="geo-duration">{video.duration}</span>
                </div>
                
                <video controls className="geo-video-player">
                  <source src={`/videos/${video.filename}`} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            ))}
          </div>

          <div className="geo-resources-tip">
            <FaBook />
            <div>
              <strong>Study Tip:</strong>
              <p>Watch the videos first, then practice with the calculator to reinforce what you've learned. Try solving the example problems shown in the videos using the calculator tab!</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GeometryCalculator;