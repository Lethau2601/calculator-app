import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft, FaBrain, FaRulerCombined, FaBook, FaCalculator, FaVideo, FaHeadphones, FaPlay } from "react-icons/fa";
import { GiTriangleTarget } from "react-icons/gi";
import "./TrigTutor.css";

const TrigTutor = () => {
  const [opp, setOpp] = useState("");
  const [adj, setAdj] = useState("");
  const [hyp, setHyp] = useState("");
  const [angle, setAngle] = useState("");
  const [explanation, setExplanation] = useState("");
  const [aiAdvice, setAiAdvice] = useState("");
  const [allTrigValues, setAllTrigValues] = useState(null);
  
  const [activeTab, setActiveTab] = useState("solve"); // solve, practice, guide, resources

  // Practice problems
  const [practiceProblems] = useState([
    { opp: 3, hyp: 5, answer: 36.87, type: "sin" },
    { adj: 4, hyp: 5, answer: 36.87, type: "cos" },
    { opp: 7, adj: 7, answer: 45, type: "tan" },
    { opp: 5, hyp: 13, answer: 22.62, type: "sin" }
  ]);
  const [currentProblem, setCurrentProblem] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [practiceResult, setPracticeResult] = useState("");

  // Video Resources
  const videoResources = [
    {
      id: 1,
      title: "Trigonometry Basics",
      description: "Learn the fundamentals of trigonometry and how to apply them",
      filename: "trig-basics.mp4",
      duration: "~10 mins"
    },
    {
      id: 2,
      title: "Trigonometric Functions",
      description: "Deep dive into sine, cosine, and tangent functions",
      filename: "trig-functions.mp4",
      duration: "~8 mins"
    },
    {
      id: 3,
      title: "Solving Trigonometry Problems",
      description: "Step-by-step guide to solving trig problems",
      filename: "trig-solving.mp4",
      duration: "~10 mins"
    },
    {
      id: 4,
      title: "SOH-CAH-TOA Explained",
      description: "Complete guide to the SOHCAHTOA mnemonic and its applications",
      filename: "Trigonometry-SOH-CAH-TOA-Sin-Cos-Tan.mp4",
      duration: "~12 mins"
    }
  ];

  // Audio Resources
  const audioResources = [
    {
      id: 1,
      title: "Introduction to Trigonometry",
      description: "Audio lesson covering the basics and why trigonometry matters",
      filename: "trig-intro.mp3",
      duration: "~15 mins"
    },
    {
      id: 2,
      title: "Trigonometry Lessons",
      description: "Comprehensive audio lessons on various trig concepts",
      filename: "trig-lessons.mp3",
      duration: "~20 mins"
    }
  ];

  const solve = () => {
    let exp = "";
    let aiText = "";
    let trigValues = null;

    const o = parseFloat(opp);
    const a = parseFloat(adj);
    const h = parseFloat(hyp);

    if (opp && hyp && !angle) {
      const ratio = o / h;
      const θ = Math.asin(ratio) * (180 / Math.PI);
      setAngle(θ.toFixed(2));
      
      exp += `✅ SOH Rule Used: Sinθ = Opp/Hyp = ${o}/${h} = ${ratio.toFixed(4)}
θ = sin⁻¹(${ratio.toFixed(4)}) = ${θ.toFixed(2)}°

Step-by-step:
1. Identify: Opposite = ${o}, Hypotenuse = ${h}
2. Apply formula: sin(θ) = ${o}/${h}
3. Calculate ratio: ${ratio.toFixed(4)}
4. Find inverse: θ = sin⁻¹(${ratio.toFixed(4)})
5. Result: θ = ${θ.toFixed(2)}°`;
      
      aiText = "✨ AI detected Opp + Hyp — Sin rule applies! This is the SOH in SOHCAHTOA.";
      
      trigValues = calculateAllTrig(θ);
    } 
    else if (adj && hyp && !angle) {
      const ratio = a / h;
      const θ = Math.acos(ratio) * (180 / Math.PI);
      setAngle(θ.toFixed(2));
      
      exp += `✅ CAH Rule Used: Cosθ = Adj/Hyp = ${a}/${h} = ${ratio.toFixed(4)}
θ = cos⁻¹(${ratio.toFixed(4)}) = ${θ.toFixed(2)}°

Step-by-step:
1. Identify: Adjacent = ${a}, Hypotenuse = ${h}
2. Apply formula: cos(θ) = ${a}/${h}
3. Calculate ratio: ${ratio.toFixed(4)}
4. Find inverse: θ = cos⁻¹(${ratio.toFixed(4)})
5. Result: θ = ${θ.toFixed(2)}°`;
      
      aiText = "✨ AI detected Adj + Hyp — Cos rule applies! This is the CAH in SOHCAHTOA.";
      
      trigValues = calculateAllTrig(θ);
    } 
    else if (opp && adj && !angle) {
      const ratio = o / a;
      const θ = Math.atan(ratio) * (180 / Math.PI);
      setAngle(θ.toFixed(2));
      
      exp += `✅ TOA Rule Used: Tanθ = Opp/Adj = ${o}/${a} = ${ratio.toFixed(4)}
θ = tan⁻¹(${ratio.toFixed(4)}) = ${θ.toFixed(2)}°

Step-by-step:
1. Identify: Opposite = ${o}, Adjacent = ${a}
2. Apply formula: tan(θ) = ${o}/${a}
3. Calculate ratio: ${ratio.toFixed(4)}
4. Find inverse: θ = tan⁻¹(${ratio.toFixed(4)})
5. Result: θ = ${θ.toFixed(2)}°`;
      
      aiText = "✨ AI detected Opp + Adj — Tan rule applies! This is the TOA in SOHCAHTOA.";
      
      trigValues = calculateAllTrig(θ);
    } 
    else if (opp && adj && hyp) {
      exp = "⚠️ You entered all 3 sides — checking with Pythagoras:";
      const calculated = Math.sqrt(o * o + a * a);
      exp += `\n\nhyp² = opp² + adj²`;
      exp += `\n${h}² = ${o}² + ${a}²`;
      exp += `\n${h * h} = ${o * o} + ${a * a}`;
      exp += `\n${h * h} ${h * h === o * o + a * a ? '=' : '≈'} ${o * o + a * a}`;
      exp += `\n\n✓ Calculated hypotenuse: ${calculated.toFixed(2)}`;
      
      aiText = " Tip: Remove one value to solve for angle, or use all 3 to verify Pythagorean theorem!";
    } 
    else {
      exp = "⚠️ Enter any 2 sides to solve for the angle.";
      aiText = " Remember: SOH CAH TOA applies when you know 2 sides and want to find the angle!";
    }

    setExplanation(exp);
    setAiAdvice(aiText);
    setAllTrigValues(trigValues);
  };

  const calculateAllTrig = (angleDeg) => {
    const angleRad = angleDeg * (Math.PI / 180);
    return {
      sin: Math.sin(angleRad).toFixed(4),
      cos: Math.cos(angleRad).toFixed(4),
      tan: Math.tan(angleRad).toFixed(4),
      csc: (1 / Math.sin(angleRad)).toFixed(4),
      sec: (1 / Math.cos(angleRad)).toFixed(4),
      cot: (1 / Math.tan(angleRad)).toFixed(4)
    };
  };

  const checkPractice = () => {
    const problem = practiceProblems[currentProblem];
    const userAns = parseFloat(userAnswer);
    const correct = Math.abs(userAns - problem.answer) < 0.5;

    if (correct) {
      setPracticeResult(`✅ Correct! The angle is ${problem.answer}°`);
    } else {
      setPracticeResult(`❌ Not quite. The correct answer is ${problem.answer}°. Try again!`);
    }
  };

  const nextProblem = () => {
    setCurrentProblem((prev) => (prev + 1) % practiceProblems.length);
    setUserAnswer("");
    setPracticeResult("");
  };

  const clear = () => {
    setOpp("");
    setAdj("");
    setHyp("");
    setAngle("");
    setExplanation("");
    setAiAdvice("");
    setAllTrigValues(null);
  };

  return (
    <div className="trig-container">
      <Link to="/" className="back-btn"><FaArrowLeft /> Back to Home</Link>

      <h2><GiTriangleTarget /> Advanced Trigonometry Tutor</h2>

      {/* Tab Navigation */}
      <div className="tab-nav">
        <button 
          className={activeTab === "solve" ? "tab-active" : ""}
          onClick={() => setActiveTab("solve")}
        >
          <FaCalculator /> Solver
        </button>
        <button 
          className={activeTab === "practice" ? "tab-active" : ""}
          onClick={() => setActiveTab("practice")}
        >
          <GiTriangleTarget /> Practice
        </button>
        <button 
          className={activeTab === "guide" ? "tab-active" : ""}
          onClick={() => setActiveTab("guide")}
        >
          <FaBook /> Guide
        </button>
        <button 
          className={activeTab === "resources" ? "tab-active" : ""}
          onClick={() => setActiveTab("resources")}
        >
          <FaVideo /> Resources
        </button>
      </div>

      {/* SOLVER TAB */}
      {activeTab === "solve" && (
        <>
          <div className="formula-banner">
            <p><FaRulerCombined /> <strong>SOH</strong> → sin(θ) = Opposite / Hypotenuse</p>
            <p><FaRulerCombined /> <strong>CAH</strong> → cos(θ) = Adjacent / Hypotenuse</p>
            <p><FaRulerCombined /> <strong>TOA</strong> → tan(θ) = Opposite / Adjacent</p>
          </div>

          <div className="extra-formula">
            <p><strong>Reciprocal Identities:</strong></p>
            <p>csc(θ) = 1/sin(θ) • sec(θ) = 1/cos(θ) • cot(θ) = 1/tan(θ)</p>
          </div>

          <div className="input-row">
            <input placeholder="Opposite" type="number" value={opp} onChange={e => setOpp(e.target.value)} />
            <input placeholder="Adjacent" type="number" value={adj} onChange={e => setAdj(e.target.value)} />
            <input placeholder="Hypotenuse" type="number" value={hyp} onChange={e => setHyp(e.target.value)} />
          </div>

          <div className="button-row">
            <button onClick={solve} className="calculate-btn">
              <GiTriangleTarget /> Solve Angle
            </button>
            <button onClick={clear} className="clear-btn">
              Clear
            </button>
          </div>

          {angle && (
            <div className="result-box">
              <h3>📐 Angle θ = {angle}°</h3>
              <pre className="explanation">{explanation}</pre>
              
              {allTrigValues && (
                <div className="all-trig-values">
                  <h4>All Trigonometric Values for θ = {angle}°:</h4>
                  <div className="trig-grid">
                    <div className="trig-item">
                      <strong>sin(θ)</strong>
                      <span>{allTrigValues.sin}</span>
                    </div>
                    <div className="trig-item">
                      <strong>cos(θ)</strong>
                      <span>{allTrigValues.cos}</span>
                    </div>
                    <div className="trig-item">
                      <strong>tan(θ)</strong>
                      <span>{allTrigValues.tan}</span>
                    </div>
                    <div className="trig-item">
                      <strong>csc(θ)</strong>
                      <span>{allTrigValues.csc}</span>
                    </div>
                    <div className="trig-item">
                      <strong>sec(θ)</strong>
                      <span>{allTrigValues.sec}</span>
                    </div>
                    <div className="trig-item">
                      <strong>cot(θ)</strong>
                      <span>{allTrigValues.cot}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {aiAdvice && (
            <div className="ai-box">
              <FaBrain />
              <div>
                <strong>AI Tutor Insight:</strong>
                <p>{aiAdvice}</p>
              </div>
            </div>
          )}
        </>
      )}

      {/* PRACTICE TAB */}
      {activeTab === "practice" && (
        <div className="practice-section">
          <h3>Practice Problem #{currentProblem + 1}</h3>
          
          <div className="problem-box">
            <p>Given a right triangle with:</p>
            <ul>
              {practiceProblems[currentProblem].opp && <li>Opposite = {practiceProblems[currentProblem].opp}</li>}
              {practiceProblems[currentProblem].adj && <li>Adjacent = {practiceProblems[currentProblem].adj}</li>}
              {practiceProblems[currentProblem].hyp && <li>Hypotenuse = {practiceProblems[currentProblem].hyp}</li>}
            </ul>
            <p><strong>Find the angle θ (in degrees)</strong></p>
          </div>

          <div className="practice-input">
            <input 
              type="number" 
              placeholder="Your answer (degrees)"
              value={userAnswer}
              onChange={e => setUserAnswer(e.target.value)}
            />
            <button onClick={checkPractice} className="check-btn">Check Answer</button>
          </div>

          {practiceResult && (
            <div className={practiceResult.includes("✅") ? "result-correct" : "result-wrong"}>
              {practiceResult}
            </div>
          )}

          <button onClick={nextProblem} className="next-problem-btn">
            Next Problem →
          </button>
        </div>
      )}

      {/* GUIDE TAB */}
      {activeTab === "guide" && (
        <div className="guide-section">
          <h3> Complete Trigonometry Guide</h3>
          
          <div className="guide-card">
            <h4>🔺 Understanding the Right Triangle</h4>
            <p>In a right triangle, we have three sides:</p>
            <ul>
              <li><strong>Hypotenuse</strong> - The longest side (opposite the right angle)</li>
              <li><strong>Opposite</strong> - The side opposite to the angle you're working with</li>
              <li><strong>Adjacent</strong> - The side next to the angle (not the hypotenuse)</li>
            </ul>
          </div>

          <div className="guide-card">
            <h4>📐 The Six Trigonometric Functions</h4>
            <div className="trig-functions">
              <div className="func-card">
                <strong>Sine (sin)</strong>
                <p>sin(θ) = Opposite / Hypotenuse</p>
                <small>Measures the ratio of vertical to diagonal</small>
              </div>
              <div className="func-card">
                <strong>Cosine (cos)</strong>
                <p>cos(θ) = Adjacent / Hypotenuse</p>
                <small>Measures the ratio of horizontal to diagonal</small>
              </div>
              <div className="func-card">
                <strong>Tangent (tan)</strong>
                <p>tan(θ) = Opposite / Adjacent</p>
                <small>Measures the slope or gradient</small>
              </div>
              <div className="func-card">
                <strong>Cosecant (csc)</strong>
                <p>csc(θ) = 1 / sin(θ) = Hypotenuse / Opposite</p>
                <small>Reciprocal of sine</small>
              </div>
              <div className="func-card">
                <strong>Secant (sec)</strong>
                <p>sec(θ) = 1 / cos(θ) = Hypotenuse / Adjacent</p>
                <small>Reciprocal of cosine</small>
              </div>
              <div className="func-card">
                <strong>Cotangent (cot)</strong>
                <p>cot(θ) = 1 / tan(θ) = Adjacent / Opposite</p>
                <small>Reciprocal of tangent</small>
              </div>
            </div>
          </div>

          <div className="guide-card">
            <h4>🎓 Common Angle Values (Worth Memorizing!)</h4>
            <table className="angles-table">
              <thead>
                <tr>
                  <th>Angle</th>
                  <th>sin(θ)</th>
                  <th>cos(θ)</th>
                  <th>tan(θ)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>0°</td>
                  <td>0</td>
                  <td>1</td>
                  <td>0</td>
                </tr>
                <tr>
                  <td>30°</td>
                  <td>1/2</td>
                  <td>√3/2</td>
                  <td>1/√3</td>
                </tr>
                <tr>
                  <td>45°</td>
                  <td>√2/2</td>
                  <td>√2/2</td>
                  <td>1</td>
                </tr>
                <tr>
                  <td>60°</td>
                  <td>√3/2</td>
                  <td>1/2</td>
                  <td>√3</td>
                </tr>
                <tr>
                  <td>90°</td>
                  <td>1</td>
                  <td>0</td>
                  <td>undefined</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="guide-card">
            <h4> Quick Tips & Tricks</h4>
            <ul>
              <li><strong>SOHCAHTOA</strong> is your best friend - memorize it!</li>
              <li>Always identify which sides you have before choosing a formula</li>
              <li>Remember: sin²(θ) + cos²(θ) = 1 (Pythagorean Identity)</li>
              <li>tan(θ) = sin(θ) / cos(θ)</li>
              <li>When using inverse functions (sin⁻¹, cos⁻¹, tan⁻¹), you're finding the angle</li>
              <li>Complementary angles: sin(θ) = cos(90° - θ)</li>
            </ul>
          </div>
        </div>
      )}

      {/* RESOURCES TAB */}
      {activeTab === "resources" && (
        <div className="resources-section">
          <h3>📺 Learning Resources</h3>
          <p className="resources-intro">Watch videos and listen to audio lessons to master trigonometry!</p>

          {/* Video Section */}
          <div className="media-section">
            <h4><FaVideo /> Video Tutorials</h4>
            <div className="media-grid">
              {videoResources.map((video) => (
                <div key={video.id} className="media-card video-card">
                  <div className="media-icon">
                    <FaPlay />
                  </div>
                  <div className="media-content">
                    <h5>{video.title}</h5>
                    <p>{video.description}</p>
                    <span className="duration">{video.duration}</span>
                  </div>
                  <video controls className="media-player">
                    <source src={`/videos/${video.filename}`} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              ))}
            </div>
          </div>

          {/* Audio Section */}
          <div className="media-section">
            <h4><FaHeadphones /> Audio Lessons</h4>
            <div className="media-grid">
              {audioResources.map((audio) => (
                <div key={audio.id} className="media-card audio-card">
                  <div className="media-icon audio-icon">
                    <FaHeadphones />
                  </div>
                  <div className="media-content">
                    <h5>{audio.title}</h5>
                    <p>{audio.description}</p>
                    <span className="duration">{audio.duration}</span>
                  </div>
                  <audio controls className="audio-player">
                    <source src={`/audio/${audio.filename}`} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                </div>
              ))}
            </div>
          </div>

          <div className="resources-tip">
            <FaBrain />
            <p><strong>Pro Tip:</strong> Watch the videos first to understand the concepts visually, then listen to the audio lessons to reinforce your learning while on the go!</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrigTutor;