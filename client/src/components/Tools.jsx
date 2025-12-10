import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaRobot,
  FaCalculator,
  FaFlask,
  FaExchangeAlt,
  FaMapMarkedAlt,
  FaHeart,
  FaBoxOpen,
  FaDraftingCompass,
  FaSearch,
  FaStar,
  FaClock,
  FaFilter,
  FaArrowLeft
} from "react-icons/fa";
import { GiTriangleTarget } from "react-icons/gi";
import "./Tools.css";

const Tools = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [recentTools, setRecentTools] = useState([]);
  const [favoriteTools, setFavoriteTools] = useState([]);

  const toolsData = [
    {
      id: "basic",
      name: "Basic Calculator",
      description: "Simple arithmetic operations for everyday calculations",
      icon: <FaCalculator />,
      link: "/basic",
      category: "calculators",
      difficulty: "Easy",
      color: "#00ff88"
    },
    {
      id: "scientific",
      name: "Scientific Calculator",
      description: "Advanced math functions including trigonometry and logarithms",
      icon: <FaFlask />,
      link: "/scientific",
      category: "calculators",
      difficulty: "Advanced",
      color: "#00ccff"
    },
    {
      id: "unit",
      name: "Unit Converter",
      description: "Convert between different units of measurement",
      icon: <FaExchangeAlt />,
      link: "/converter",
      category: "converters",
      difficulty: "Easy",
      color: "#ff9800"
    },
    {
      id: "geometry",
      name: "Geometry Tools",
      description: "Calculate areas, volumes, and solve geometric problems",
      icon: <FaDraftingCompass />,
      link: "/geometry",
      category: "calculators",
      difficulty: "Medium",
      color: "#9c27b0"
    },
    {
      id: "trig",
      name: "Trigonometry Tutor",
      description: "Learn and practice SOH CAH TOA with interactive examples",
      icon: <GiTriangleTarget />,
      link: "/trig",
      category: "education",
      difficulty: "Medium",
      color: "#2196f3"
    },
    {
      id: "distance",
      name: "Distance Calculator",
      description: "Calculate distances between South African cities",
      icon: <FaMapMarkedAlt />,
      link: "/distance",
      category: "utilities",
      difficulty: "Easy",
      color: "#f44336"
    },
    {
      id: "bmi",
      name: "BMI Calculator",
      description: "Calculate Body Mass Index and health metrics",
      icon: <FaHeart />,
      link: "/bmi",
      category: "health",
      difficulty: "Easy",
      color: "#4caf50"
    },
    {
      id: "packing",
      name: "Packing Planner",
      description: "Plan your travel packing and weight limits",
      icon: <FaBoxOpen />,
      link: "/packing",
      category: "utilities",
      difficulty: "Easy",
      color: "#ff5722"
    },
    {
      id: "ai",
      name: "AI Math Tutor",
      description: "Get step-by-step help with math problems from AI",
      icon: <FaRobot />,
      link: "/ai",
      category: "education",
      difficulty: "Easy",
      color: "#00ff88"
    }
  ];

  const categories = [
    { id: "all", name: "All Tools", icon: "🔧" },
    { id: "calculators", name: "Calculators", icon: "🧮" },
    { id: "converters", name: "Converters", icon: "🔄" },
    { id: "education", name: "Education", icon: "📚" },
    { id: "health", name: "Health", icon: "❤️" },
    { id: "utilities", name: "Utilities", icon: "⚙️" }
  ];

  useEffect(() => {
    // Load recent tools from localStorage
    const recent = localStorage.getItem('recentTools');
    if (recent) {
      setRecentTools(JSON.parse(recent));
    }

    // Load favorite tools from localStorage
    const favorites = localStorage.getItem('favoriteTools');
    if (favorites) {
      setFavoriteTools(JSON.parse(favorites));
    }
  }, []);

  const trackToolUsage = (toolId) => {
    const recent = JSON.parse(localStorage.getItem('recentTools') || '[]');
    const updated = [toolId, ...recent.filter(id => id !== toolId)].slice(0, 5);
    localStorage.setItem('recentTools', JSON.stringify(updated));
    setRecentTools(updated);
  };

  const toggleFavorite = (e, toolId) => {
    e.preventDefault();
    e.stopPropagation();
    
    const favorites = JSON.parse(localStorage.getItem('favoriteTools') || '[]');
    let updated;
    
    if (favorites.includes(toolId)) {
      updated = favorites.filter(id => id !== toolId);
    } else {
      updated = [...favorites, toolId];
    }
    
    localStorage.setItem('favoriteTools', JSON.stringify(updated));
    setFavoriteTools(updated);
  };

  const filteredTools = toolsData.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tool.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || tool.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const recentToolsData = toolsData.filter(tool => recentTools.includes(tool.id));
  const favoriteToolsData = toolsData.filter(tool => favoriteTools.includes(tool.id));

  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case "Easy": return "#4caf50";
      case "Medium": return "#ff9800";
      case "Advanced": return "#f44336";
      default: return "#888";
    }
  };

  return (
    <div className="tools-container">
      <Link to="/" className="back-btn-tools">
        <FaArrowLeft /> Back to Dashboard
      </Link>

      <div className="tools-header">
        <h1>🛠️ Tools & Utilities</h1>
        <p className="tools-subtitle">Explore our comprehensive collection of calculators and learning tools</p>
      </div>

      {/* Search & Filter Section */}
      <div className="tools-controls">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search tools..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="category-filter">
          <FaFilter className="filter-icon" />
          <select 
            value={selectedCategory} 
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="category-select"
          >
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.icon} {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats Section */}
      <div className="tools-stats">
        <div className="stat-box">
          <span className="stat-number">{toolsData.length}</span>
          <span className="stat-label">Total Tools</span>
        </div>
        <div className="stat-box">
          <span className="stat-number">{favoriteTools.length}</span>
          <span className="stat-label">Favorites</span>
        </div>
        <div className="stat-box">
          <span className="stat-number">{recentTools.length}</span>
          <span className="stat-label">Recently Used</span>
        </div>
      </div>

      {/* Favorites Section */}
      {favoriteToolsData.length > 0 && (
        <div className="tools-section">
          <h2 className="section-title">
            <FaStar /> Your Favorites
          </h2>
          <div className="tools-grid-compact">
            {favoriteToolsData.map((tool) => (
              <Link
                key={tool.id}
                to={tool.link}
                className="tool-card-compact"
                onClick={() => trackToolUsage(tool.id)}
              >
                <div className="tool-icon-compact" style={{ color: tool.color }}>
                  {tool.icon}
                </div>
                <span className="tool-name-compact">{tool.name}</span>
                <button 
                  className="favorite-btn active"
                  onClick={(e) => toggleFavorite(e, tool.id)}
                >
                  <FaStar />
                </button>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Recent Tools Section */}
      {recentToolsData.length > 0 && (
        <div className="tools-section">
          <h2 className="section-title">
            <FaClock /> Recently Used
          </h2>
          <div className="tools-grid-compact">
            {recentToolsData.map((tool) => (
              <Link
                key={tool.id}
                to={tool.link}
                className="tool-card-compact"
                onClick={() => trackToolUsage(tool.id)}
              >
                <div className="tool-icon-compact" style={{ color: tool.color }}>
                  {tool.icon}
                </div>
                <span className="tool-name-compact">{tool.name}</span>
                <button 
                  className={`favorite-btn ${favoriteTools.includes(tool.id) ? 'active' : ''}`}
                  onClick={(e) => toggleFavorite(e, tool.id)}
                >
                  <FaStar />
                </button>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* All Tools Section */}
      <div className="tools-section">
        <h2 className="section-title">
          {selectedCategory === "all" ? "All Tools" : categories.find(c => c.id === selectedCategory)?.name}
          <span className="tools-count">({filteredTools.length})</span>
        </h2>

        {filteredTools.length === 0 ? (
          <div className="no-results">
            <p>No tools found matching your search.</p>
          </div>
        ) : (
          <div className="tools-grid">
            {filteredTools.map((tool) => (
              <Link
                key={tool.id}
                to={tool.link}
                className="tool-card"
                onClick={() => trackToolUsage(tool.id)}
              >
                <button 
                  className={`favorite-btn-card ${favoriteTools.includes(tool.id) ? 'active' : ''}`}
                  onClick={(e) => toggleFavorite(e, tool.id)}
                  title="Add to favorites"
                >
                  <FaStar />
                </button>

                <div className="tool-icon-large" style={{ color: tool.color }}>
                  {tool.icon}
                </div>
                
                <h3 className="tool-name">{tool.name}</h3>
                <p className="tool-description">{tool.description}</p>
                
                <div className="tool-meta">
                  <span className="tool-category">
                    {categories.find(c => c.id === tool.category)?.icon} {tool.category}
                  </span>
                  <span 
                    className="tool-difficulty"
                    style={{ color: getDifficultyColor(tool.difficulty) }}
                  >
                    {tool.difficulty}
                  </span>
                </div>

                <div className="tool-arrow">→</div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Tools;