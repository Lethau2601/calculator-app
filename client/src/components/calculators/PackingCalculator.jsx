import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaSuitcase, FaPlane, FaWeight, FaTrash, FaPlus, FaExclamationTriangle, FaCheckCircle, FaEdit, FaSave } from 'react-icons/fa';
import './PackingCalculator.css';

const PackingCalculator = () => {
  const [items, setItems] = useState([]);
  const [name, setName] = useState('');
  const [weight, setWeight] = useState('');
  const [category, setCategory] = useState('Clothing');
  const [limit, setLimit] = useState(23);
  const [unit, setUnit] = useState('kg'); // kg or lbs
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editWeight, setEditWeight] = useState('');

  // Airline presets
  const airlinePresets = [
    { name: 'Economy (23 kg)', value: 23 },
    { name: 'Business (32 kg)', value: 32 },
    { name: 'First Class (40 kg)', value: 40 },
    { name: 'Budget Airline (15 kg)', value: 15 },
    { name: 'Custom', value: null }
  ];

  const categories = ['Clothing', 'Electronics', 'Toiletries', 'Shoes', 'Accessories', 'Books', 'Food', 'Other'];

  const addItem = () => {
    const w = Number(weight);
    if (!name || !w || w <= 0) {
      alert('Please enter a valid item name and weight');
      return;
    }
    setItems((prev) => [...prev, { 
      id: Date.now(), 
      name, 
      weight: w,
      category,
      timestamp: new Date().toLocaleTimeString()
    }]);
    setName('');
    setWeight('');
  };

  const removeItem = (id) => {
    setItems((p) => p.filter((it) => it.id !== id));
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setEditName(item.name);
    setEditWeight(item.weight.toString());
  };

  const saveEdit = (id) => {
    const w = Number(editWeight);
    if (!editName || !w || w <= 0) {
      alert('Please enter valid values');
      return;
    }
    setItems((prev) => prev.map((item) => 
      item.id === id ? { ...item, name: editName, weight: w } : item
    ));
    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName('');
    setEditWeight('');
  };

  const clearAll = () => {
    if (window.confirm('Are you sure you want to clear all items?')) {
      setItems([]);
    }
  };

  const total = items.reduce((s, it) => s + it.weight, 0);
  const percentage = limit > 0 ? (total / limit) * 100 : 0;
  const remaining = Math.max(limit - total, 0);
  const overweight = total > limit ? total - limit : 0;

  // Group items by category
  const groupedItems = items.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});

  const categoryStats = Object.entries(groupedItems).map(([cat, items]) => ({
    category: cat,
    count: items.length,
    weight: items.reduce((sum, item) => sum + item.weight, 0)
  }));

  return (
    <div className="packing-container">
      <Link to="/" className="packing-back-btn">
        <FaArrowLeft /> Back to Home
      </Link>

      <div className="packing-header">
        <FaSuitcase className="packing-main-icon" />
        <h2>Smart Packing Weight Calculator</h2>
        <p className="packing-subtitle">Track your luggage weight and avoid airline fees</p>
      </div>

      {/* Quick Info Banner */}
      <div className="packing-info-banner">
        <div className="info-item">
          <FaPlane />
          <span>Compare to airline limits</span>
        </div>
        <div className="info-item">
          <FaWeight />
          <span>Track by category</span>
        </div>
        <div className="info-item">
          <FaCheckCircle />
          <span>Real-time calculations</span>
        </div>
      </div>

      {/* Airline Limit Selector */}
      <div className="airline-selector">
        <h3><FaPlane /> Select Airline Class</h3>
        <div className="preset-buttons">
          {airlinePresets.map((preset, idx) => (
            <button
              key={idx}
              className={`preset-btn ${preset.value === limit ? 'active' : ''}`}
              onClick={() => preset.value && setLimit(preset.value)}
            >
              {preset.name}
            </button>
          ))}
        </div>
        
        <div className="custom-limit-input">
          <label>Custom Limit ({unit}):</label>
          <input
            type="number"
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            min="1"
          />
          <select value={unit} onChange={(e) => setUnit(e.target.value)} className="unit-selector">
            <option value="kg">kg</option>
            <option value="lbs">lbs</option>
          </select>
        </div>
      </div>

      {/* Add Item Form */}
      <div className="add-item-card">
        <h3><FaPlus /> Add New Item</h3>
        
        <div className="form-grid">
          <div className="form-group">
            <label>Item Name</label>
            <input
              type="text"
              placeholder="e.g., Winter Jacket"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addItem()}
            />
          </div>

          <div className="form-group">
            <label>Weight ({unit})</label>
            <input
              type="number"
              placeholder="0.0"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addItem()}
              step="0.1"
            />
          </div>

          <div className="form-group">
            <label>Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        <button className="add-btn" onClick={addItem}>
          <FaPlus /> Add Item
        </button>
      </div>

      {/* Weight Status Card */}
      {items.length > 0 && (
        <div className={`status-card ${total > limit ? 'overweight' : 'safe'}`}>
          <div className="status-header">
            {total > limit ? (
              <>
                <FaExclamationTriangle className="status-icon" />
                <h3>Over Weight Limit!</h3>
              </>
            ) : (
              <>
                <FaCheckCircle className="status-icon" />
                <h3>Within Limit</h3>
              </>
            )}
          </div>

          <div className="weight-display">
            <div className="weight-main">
              <span className="weight-number">{total.toFixed(2)}</span>
              <span className="weight-unit">/ {limit} {unit}</span>
            </div>
          </div>

          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ 
                width: `${Math.min(percentage, 100)}%`,
                backgroundColor: percentage > 100 ? '#ff6b6b' : percentage > 80 ? '#ffd93d' : '#00ff88'
              }}
            />
          </div>

          <div className="weight-stats">
            <div className="stat-item">
              <span className="stat-label">Total Items</span>
              <span className="stat-value">{items.length}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Percentage Used</span>
              <span className="stat-value">{percentage.toFixed(1)}%</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">
                {total > limit ? 'Overweight' : 'Remaining'}
              </span>
              <span className={`stat-value ${total > limit ? 'over' : 'safe'}`}>
                {total > limit ? `+${overweight.toFixed(2)}` : remaining.toFixed(2)} {unit}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Category Breakdown */}
      {categoryStats.length > 0 && (
        <div className="category-breakdown">
          <h3>Weight by Category</h3>
          <div className="category-grid">
            {categoryStats.map((stat) => (
              <div key={stat.category} className="category-stat-card">
                <span className="category-name">{stat.category}</span>
                <span className="category-count">{stat.count} items</span>
                <span className="category-weight">{stat.weight.toFixed(2)} {unit}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Items List */}
      <div className="items-section">
        <div className="items-header">
          <h3><FaSuitcase /> Packed Items ({items.length})</h3>
          {items.length > 0 && (
            <button className="clear-all-btn" onClick={clearAll}>
              <FaTrash /> Clear All
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="empty-state">
            <FaSuitcase className="empty-icon" />
            <p>No items added yet</p>
            <span>Start adding items to track your luggage weight</span>
          </div>
        ) : (
          <div className="items-list">
            {Object.entries(groupedItems).map(([cat, catItems]) => (
              <div key={cat} className="category-group">
                <div className="category-header">{cat}</div>
                {catItems.map((item) => (
                  <div key={item.id} className="item-card">
                    {editingId === item.id ? (
                      <>
                        <div className="item-edit-form">
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="edit-input"
                          />
                          <input
                            type="number"
                            value={editWeight}
                            onChange={(e) => setEditWeight(e.target.value)}
                            className="edit-input weight"
                            step="0.1"
                          />
                        </div>
                        <div className="item-actions">
                          <button className="save-btn" onClick={() => saveEdit(item.id)}>
                            <FaSave /> Save
                          </button>
                          <button className="cancel-btn" onClick={cancelEdit}>
                            Cancel
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="item-info">
                          <span className="item-name">{item.name}</span>
                          <span className="item-time">{item.timestamp}</span>
                        </div>
                        <div className="item-weight">
                          <FaWeight className="weight-icon" />
                          <span>{item.weight.toFixed(2)} {unit}</span>
                        </div>
                        <div className="item-actions">
                          <button className="edit-btn" onClick={() => startEdit(item)}>
                            <FaEdit />
                          </button>
                          <button className="delete-btn" onClick={() => removeItem(item.id)}>
                            <FaTrash />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Travel Tips */}
      <div className="tips-section">
        <h3>💡 Packing Tips</h3>
        <ul>
          <li>Wear your heaviest items (jackets, boots) on the plane to save weight</li>
          <li>Roll clothes instead of folding to save space and reduce wrinkles</li>
          <li>Use packing cubes to organize and compress your items</li>
          <li>Check airline baggage fees before you travel - sometimes checking bags is cheaper than overweight fees</li>
          <li>Weigh your bag at home before heading to the airport to avoid surprises</li>
        </ul>
      </div>
    </div>
  );
};

export default PackingCalculator;