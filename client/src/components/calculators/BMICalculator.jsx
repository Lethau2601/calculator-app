import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaHeartbeat, FaBurn, FaUndo } from "react-icons/fa";
import "./BMICalculator.css";

const getBMICategory = (bmi) => {
  if (bmi < 18.5) return "Underweight";
  if (bmi < 25) return "Normal weight";
  if (bmi < 30) return "Overweight";
  return "Obese";
};

const BMICalculator = () => {
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("male");
  const [bmi, setBmi] = useState(null);
  const [category, setCategory] = useState("");
  const [activity, setActivity] = useState("walking");
  const [calories, setCalories] = useState(null);
  const [bmr, setBmr] = useState(null);
  const [idealWeight, setIdealWeight] = useState(null);

  const calcBmi = () => {
    const w = Number(weight);
    const h = Number(height) / 100;
    if (!w || !h) return;

    const value = w / (h * h);
    setBmi(value);
    setCategory(getBMICategory(value));

    // Calculate BMR using Mifflin-St Jeor Equation
    const a = Number(age) || 25;
    const heightCm = Number(height) || 170;
    let bmrValue;
    if (gender === "male") {
      bmrValue = 10 * w + 6.25 * heightCm - 5 * a + 5;
    } else {
      bmrValue = 10 * w + 6.25 * heightCm - 5 * a - 161;
    }
    setBmr(bmrValue.toFixed(0));

    // Calculate ideal weight range (using BMI 18.5-25)
    const minWeight = (18.5 * h * h).toFixed(1);
    const maxWeight = (25 * h * h).toFixed(1);
    setIdealWeight({ min: minWeight, max: maxWeight });
  };

  const estimateCalories = () => {
    const w = Number(weight) || 70;
    const met = {
      walking: 3.5,
      running: 9.8,
      cycling: 7.5,
      swimming: 8.0,
      yoga: 2.5,
      hiit: 10.0
    }[activity] || 3.5;
    const kcal = met * w;
    setCalories(kcal.toFixed(0));
  };

  const resetAll = () => {
    setWeight("");
    setHeight("");
    setAge("");
    setBmi(null);
    setCategory("");
    setCalories(null);
    setBmr(null);
    setIdealWeight(null);
  };

  return (
    <div className="bmi-container">
      <Link to="/" className="back-btn">
        ⬅ Back
      </Link>

      <h2 className="bmi-title">
        <FaHeartbeat /> BMI & Health Metrics Calculator
      </h2>

      <div className="bmi-card">
        {/* Weight */}
        <div className="input-group">
          <label className="input-label">Weight (kg)</label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="input-field"
            placeholder="Enter your weight"
          />
        </div>

        {/* Height */}
        <div className="input-group">
          <label className="input-label">Height (cm)</label>
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            className="input-field"
            placeholder="Enter your height"
          />
        </div>

        {/* Age */}
        <div className="input-group">
          <label className="input-label">Age (years)</label>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="input-field"
            placeholder="Enter your age"
          />
        </div>

        {/* Gender */}
        <div className="input-group">
          <label className="input-label">Gender</label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="input-field"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        {/* BMI Actions */}
        <div className="button-group">
          <button onClick={calcBmi} className="btn btn-primary">
            Calculate BMI
          </button>

          <button onClick={resetAll} className="btn btn-secondary">
            <FaUndo /> Reset
          </button>
        </div>

        {/* BMI Result */}
        {bmi && (
          <div className="results-section">
            <div className="result-card result-card-green">
              <div className="result-title">
                <strong>BMI:</strong> {bmi.toFixed(2)}
              </div>
              <div className="result-category">
                <strong>Category:</strong> {category}
              </div>
              <div className="result-description">
                {bmi < 18.5 && "You may be underweight. Consider consulting a healthcare provider."}
                {bmi >= 18.5 && bmi < 25 && "You're in a healthy weight range. Keep up the good work!"}
                {bmi >= 25 && bmi < 30 && "You may be overweight. Consider healthy diet and exercise."}
                {bmi >= 30 && "You may be in the obese range. Consult with a healthcare provider."}
              </div>
            </div>

            {idealWeight && (
              <div className="result-card result-card-green">
                <div className="result-subtitle">
                  <strong>Ideal Weight Range:</strong>
                </div>
                <div className="result-value">
                  {idealWeight.min} kg - {idealWeight.max} kg
                </div>
              </div>
            )}

            {bmr && (
              <div className="result-card result-card-green">
                <div className="result-subtitle">
                  <strong>Basal Metabolic Rate (BMR):</strong>
                </div>
                <div className="result-value">
                  {bmr} calories/day
                </div>
                <div className="result-description">
                  This is the number of calories your body needs at rest. Your actual daily needs 
                  depend on your activity level.
                </div>
              </div>
            )}
          </div>
        )}

        <hr className="divider" />

        {/* Activity Selection */}
        <div className="input-group">
          <label className="input-label">Activity for calorie estimate</label>
          <select
            value={activity}
            onChange={(e) => setActivity(e.target.value)}
            className="input-field"
          >
            <option value="walking">Walking (moderate) - 3.5 MET</option>
            <option value="running">Running (moderate) - 9.8 MET</option>
            <option value="cycling">Cycling (moderate) - 7.5 MET</option>
            <option value="swimming">Swimming (moderate) - 8.0 MET</option>
            <option value="yoga">Yoga - 2.5 MET</option>
            <option value="hiit">HIIT Training - 10.0 MET</option>
          </select>
        </div>

        {/* Burn Buttons */}
        <div className="button-group">
          <button onClick={estimateCalories} className="btn btn-success">
            <FaBurn /> Estimate kcal/hour
          </button>

          <button onClick={() => setCalories(null)} className="btn btn-secondary">
            Clear
          </button>
        </div>

        {/* Calories Result */}
        {calories && (
          <div className="result-card result-card-orange">
            <div className="result-subtitle">
              <strong>Estimated calories burned per hour:</strong>
            </div>
            <div className="result-value-large">
              {calories} kcal
            </div>
            <div className="result-description">
              This is an estimate based on your weight and activity. Actual calories burned may vary 
              based on intensity, duration, and individual metabolism.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BMICalculator;