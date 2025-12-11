// components/Dashboard.jsx - With Real Icons
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AiAssistant from "./ai/AiAssistant";

import { 
  FaCalculator, 
  FaBrain, 
  FaWeight, 
  FaMapMarkedAlt, 
  FaRuler,
  FaSuitcase,
  FaShapes,
  FaTools,
  FaChartLine,
  FaBolt,
  FaSave,
  FaGraduationCap,
  FaTachometerAlt
} from 'react-icons/fa';
import { GiTriangleTarget, GiCog } from 'react-icons/gi';
import './Dashboard.css';

const tools = [
  { 
    title: "Basic Arithmetic", 
    desc: "Add, subtract, multiply, divide!", 
    link: "/basic", 
    icon: <FaCalculator />,
    color: '#00ff88'
  },
  { 
    title: "Scientific Calculator", 
    desc: "Trig, logs, exponents, roots.", 
    link: "/scientific", 
    icon: <GiCog />,
    color: '#00ccff'
  },
  { 
    title: "Unit Converter", 
    desc: "Convert lengths, weights, temperatures.", 
    link: "/converter", 
    icon: <FaRuler />,
    color: '#ff9800'
  },
  { 
    title: "Geometry Tools", 
    desc: "Areas, volumes, triangle solver & formulas.", 
    link: "/geometry", 
    icon: <FaShapes />,
    color: '#9c27b0'
  },
  { 
    title: "Trig Tutor", 
    desc: "SOH CAH TOA learning with visuals.", 
    link: "/trig", 
    icon: <GiTriangleTarget />,
    color: '#2196f3'
  },
  { 
    title: "Distance & Time", 
    desc: "Distance calculator + timezone convertor.", 
    link: "/distance", 
    icon: <FaMapMarkedAlt />,
    color: '#f44336'
  },
  { 
    title: "Health Tools", 
    desc: "BMI, calorie estimates & health metrics.", 
    link: "/bmi", 
    icon: <FaWeight />,
    color: '#4caf50'
  },
  { 
    title: "Packing Planner", 
    desc: "Travel weight + packing limits.", 
    link: "/packing", 
    icon: <FaSuitcase />,
    color: '#ff5722'
  },
  { 
    title: "AI Tutor", 
    desc: "Ask math, conversions, step-by-step help.", 
    link: "/ai", 
    icon: <FaBrain />,
    color: '#00ff88'
  },
];

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  
  const welcomeMessage = 'Welcome to SmartCalc!';

  useEffect(() => {
    // Get user from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  useEffect(() => {
    // Typing animation effect
    let currentIndex = 0;
    
    const typingInterval = setInterval(() => {
      if (currentIndex <= welcomeMessage.length) {
        setDisplayedText(welcomeMessage.slice(0, currentIndex));
        currentIndex++;
      } else {
        setIsTyping(false);
        clearInterval(typingInterval);
      }
    }, 100); // Speed of typing (100ms per character)

    return () => clearInterval(typingInterval);
  }, []);

  return (
    <div className="dashboard">
      <div className="dashboard-container">
        
        {/* Welcome Section with Typing Animation */}
        <div className="welcome-section">
          <h1 className="welcome-text">
            {displayedText}
            {isTyping && <span className="cursor">|</span>}
          </h1>
          {user && (
            <p className="user-greeting">
               Hello, <span className="highlight">{user.username}</span>!
            </p>
          )}
          <p className="welcome-subtitle">
            Pick a tool to get started
          </p>
        </div>


        {/* Stats Section with Real Icons */}
        <div className="stats-section">
          <div className="stat-card">
            <div className="stat-icon-wrapper">
              <FaTools className="stat-icon-real" />
            </div>
            <div className="stat-content">
              <h3>Available Tools</h3>
              <p className="stat-number">{tools.length}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon-wrapper">
              <FaChartLine className="stat-icon-real" />
            </div>
            <div className="stat-content">
              <h3>Your Progress</h3>
              <p className="stat-number">Getting Started</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon-wrapper">
              <FaBolt className="stat-icon-real" />
            </div>
            <div className="stat-content">
              <h3>Status</h3>
              <p className="stat-number">Active</p>
            </div>
          </div>
        </div>
     <div className="dashboard-section">
  <AiAssistant userId={user?.id} />
</div>
        {/* Tools Grid */}
        <div className="calculators-grid">
          {tools.map((tool) => (
            <Link 
              to={tool.link} 
              key={tool.title} 
              className="calculator-card"
              style={{ '--card-color': tool.color }}
            >
              <div className="card-icon" style={{ color: tool.color }}>
                {tool.icon}
              </div>
              <h3 className="card-title">{tool.title}</h3>
              <p className="card-description">{tool.desc}</p>
              <div className="card-arrow">→</div>
            </Link>
          ))}
        </div>

        {/* Quick Tips Section - Horizontal Layout */}
        <div className="tips-section-horizontal">
          <h2 className="tips-title">
            <FaGraduationCap />
            Quick Tips
          </h2>
          <div className="tips-horizontal-grid">
            <div className="tip-card-horizontal">
              <div className="tip-icon-wrapper-horizontal">
                <FaSave className="tip-icon-real" />
              </div>
              <p>All your calculations are automatically saved</p>
            </div>
            <div className="tip-card-horizontal">
              <div className="tip-icon-wrapper-horizontal">
                <FaBrain className="tip-icon-real" />
              </div>
              <p>Try the AI Tutor for step-by-step explanations</p>
            </div>
            <div className="tip-card-horizontal">
              <div className="tip-icon-wrapper-horizontal">
                <FaTachometerAlt className="tip-icon-real" />
              </div>
              <p>Track your progress in the Tools section</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;