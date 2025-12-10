import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { FaRoute, FaMapMarkerAlt, FaClock, FaCar, FaPlane, FaArrowLeft, FaHistory } from "react-icons/fa";
import './DistanceCalculator.css';

/*
  Enhanced South African Distance Calculator:
  - All major SA cities with accurate coordinates
  - Multiple distance calculation methods
  - Travel time estimates
  - Distance history
  - Route information
*/

const southAfricanCities = {
  // Gauteng
  'Johannesburg': { lat: -26.2041, lon: 28.0473, province: 'Gauteng', population: '5.6M' },
  'Pretoria': { lat: -25.7479, lon: 28.2293, province: 'Gauteng', population: '2.5M' },
  'Ekurhuleni': { lat: -26.1590, lon: 28.2530, province: 'Gauteng', population: '3.2M' },
  'Soweto': { lat: -26.2678, lon: 27.8585, province: 'Gauteng', population: '1.3M' },
  'Midrand': { lat: -25.9950, lon: 28.1289, province: 'Gauteng', population: '93K' },
  
  // Western Cape
  'Cape Town': { lat: -33.9249, lon: 18.4241, province: 'Western Cape', population: '4.6M' },
  'Stellenbosch': { lat: -33.9321, lon: 18.8602, province: 'Western Cape', population: '155K' },
  'Paarl': { lat: -33.7342, lon: 18.9645, province: 'Western Cape', population: '112K' },
  'George': { lat: -33.9630, lon: 22.4617, province: 'Western Cape', population: '157K' },
  'Mossel Bay': { lat: -34.1820, lon: 22.1286, province: 'Western Cape', population: '89K' },
  
  // KwaZulu-Natal
  'Durban': { lat: -29.8587, lon: 31.0218, province: 'KwaZulu-Natal', population: '3.9M' },
  'Pietermaritzburg': { lat: -29.6047, lon: 30.3794, province: 'KwaZulu-Natal', population: '751K' },
  'Richards Bay': { lat: -28.7830, lon: 32.0380, province: 'KwaZulu-Natal', population: '57K' },
  'Newcastle': { lat: -27.7574, lon: 29.9316, province: 'KwaZulu-Natal', population: '363K' },
  
  // Eastern Cape
  'Port Elizabeth': { lat: -33.9608, lon: 25.6022, province: 'Eastern Cape', population: '1.2M' },
  'East London': { lat: -33.0153, lon: 27.9116, province: 'Eastern Cape', population: '478K' },
  'Mthatha': { lat: -31.5886, lon: 28.7848, province: 'Eastern Cape', population: '143K' },
  
  // Free State
  'Bloemfontein': { lat: -29.0852, lon: 26.1596, province: 'Free State', population: '521K' },
  'Welkom': { lat: -27.9770, lon: 26.7310, province: 'Free State', population: '431K' },
  
  // North West
  'Rustenburg': { lat: -25.6671, lon: 27.2419, province: 'North West', population: '395K' },
  'Mahikeng': { lat: -25.8653, lon: 25.6433, province: 'North West', population: '91K' },
  'Klerksdorp': { lat: -26.8523, lon: 26.6670, province: 'North West', population: '178K' },
  
  // Limpopo
  'Polokwane': { lat: -23.9045, lon: 29.4689, province: 'Limpopo', population: '628K' },
  'Sekhukhune': { lat: -23.3333, lon: 29.9500, province: 'Limpopo', population: '13,528K' },
  'Tzaneen': { lat: -23.8338, lon: 30.1638, province: 'Limpopo', population: '30K' },
  
  // Mpumalanga
  'Nelspruit': { lat: -25.4753, lon: 30.9703, province: 'Mpumalanga', population: '110K' },
  'Witbank': { lat: -25.8740, lon: 29.2320, province: 'Mpumalanga', population: '155K' },
  
  // Northern Cape
  'Kimberley': { lat: -28.7282, lon: 24.7499, province: 'Northern Cape', population: '225K' },
  'Upington': { lat: -28.4478, lon: 21.2561, province: 'Northern Cape', population: '75K' },
};

const toRad = deg => (deg * Math.PI) / 180;

const haversine = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) ** 2;

  return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

// Calculate estimated travel time
const estimateTravelTime = (distanceKm, mode) => {
  // Average speeds in km/h
  const speeds = {
    car: 100,      // Highway driving
    plane: 800,    // Commercial flight
    bus: 80,       // Long distance bus
    train: 90      // Passenger train
  };
  
  const hours = distanceKm / speeds[mode];
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  
  return `${h}h ${m}m`;
};

const DistanceCalculator = () => {
  const [fromType, setFromType] = useState("city");
  const [toType, setToType] = useState("city");

  const [fromCity, setFromCity] = useState("Johannesburg");
  const [toCity, setToCity] = useState("Cape Town");

  const [fromLat, setFromLat] = useState("");
  const [fromLon, setFromLon] = useState("");
  const [toLat, setToLat] = useState("");
  const [toLon, setToLon] = useState("");

  const [unit, setUnit] = useState("km");
  const [travelMode, setTravelMode] = useState("car");
  const [distance, setDistance] = useState(null);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [filterProvince, setFilterProvince] = useState("All");

  const getCoords = (type, city, lat, lon) => {
    if (type === "city" && southAfricanCities[city]) return southAfricanCities[city];
    const parsedLat = Number(lat);
    const parsedLon = Number(lon);
    if (!Number.isFinite(parsedLat) || !Number.isFinite(parsedLon)) return null;
    return { lat: parsedLat, lon: parsedLon };
  };

  const compute = () => {
    const A = getCoords(fromType, fromCity, fromLat, fromLon);
    const B = getCoords(toType, toCity, toLat, toLon);

    if (!A || !B) {
      setDistance({ error: "Invalid coordinates" });
      return;
    }

    const km = haversine(A.lat, A.lon, B.lat, B.lon);
    const miles = km * 0.621371;
    const nauticalMiles = km * 0.539957;
    
    const result = {
      km,
      miles,
      nauticalMiles,
      travelTime: {
        car: estimateTravelTime(km, 'car'),
        plane: estimateTravelTime(km, 'plane'),
        bus: estimateTravelTime(km, 'bus'),
        train: estimateTravelTime(km, 'train')
      },
      from: fromType === "city" ? fromCity : `${fromLat}, ${fromLon}`,
      to: toType === "city" ? toCity : `${toLat}, ${toLon}`,
      fromProvince: A.province || 'Custom',
      toProvince: B.province || 'Custom'
    };

    setDistance(result);
    
    // Add to history
    setHistory(prev => [{
      ...result,
      timestamp: new Date().toLocaleString()
    }, ...prev].slice(0, 10)); // Keep last 10
  };

  const clearHistory = () => setHistory([]);

  const loadFromHistory = (item) => {
    setFromCity(item.from);
    setToCity(item.to);
    setShowHistory(false);
  };

  // Get unique provinces
  const provinces = ['All', ...new Set(Object.values(southAfricanCities).map(c => c.province))];

  // Filter cities by province
  const filteredCities = filterProvince === 'All' 
    ? Object.keys(southAfricanCities)
    : Object.keys(southAfricanCities).filter(city => 
        southAfricanCities[city].province === filterProvince
      );

  return (
    <div className="distance-container">
      <Link to="/" className="back-btn">
        <FaArrowLeft /> Back to Home
      </Link>

      <h2 className="page-title">
        <FaRoute /> South African Distance Calculator
      </h2>

      <div className="info-banner">
        <p> Calculate distances between major South African cities using the Haversine formula</p>
        <p>🗺️ Covering all 9 provinces with {Object.keys(southAfricanCities).length} cities</p>
      </div>

      <div className="calc-card">
        {/* FROM SECTION */}
        <div className="location-section">
          <h3><FaMapMarkerAlt /> From Location</h3>
          
          <div className="radio-group">
            <label className="radio-label">
              <input
                type="radio"
                checked={fromType === "city"}
                onChange={() => setFromType("city")}
              />
              <span>City</span>
            </label>

            <label className="radio-label">
              <input
                type="radio"
                checked={fromType === "coords"}
                onChange={() => setFromType("coords")}
              />
              <span>Custom Coordinates</span>
            </label>
          </div>

          {fromType === "city" ? (
            <>
              <label className="input-label">Filter by Province:</label>
              <select 
                className="select-input"
                value={filterProvince} 
                onChange={e => setFilterProvince(e.target.value)}
              >
                {provinces.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>

              <label className="input-label">Select City:</label>
              <select 
                className="select-input city-select"
                value={fromCity} 
                onChange={e => setFromCity(e.target.value)}
              >
                {filteredCities.map(c => (
                  <option key={c} value={c}>
                    {c} ({southAfricanCities[c].province})
                  </option>
                ))}
              </select>

              {southAfricanCities[fromCity] && (
                <div className="city-info">
                  <p>Province: {southAfricanCities[fromCity].province}</p>
                  <p> Population: {southAfricanCities[fromCity].population}</p>
                  <p> Coordinates: {southAfricanCities[fromCity].lat.toFixed(4)}°, {southAfricanCities[fromCity].lon.toFixed(4)}°</p>
                </div>
              )}
            </>
          ) : (
            <div className="coord-inputs">
              <input 
                className="coord-input"
                type="number"
                step="0.0001"
                placeholder="Latitude (e.g., -26.2041)" 
                value={fromLat} 
                onChange={e => setFromLat(e.target.value)} 
              />
              <input 
                className="coord-input"
                type="number"
                step="0.0001"
                placeholder="Longitude (e.g., 28.0473)" 
                value={fromLon} 
                onChange={e => setFromLon(e.target.value)} 
              />
            </div>
          )}
        </div>

        {/* TO SECTION */}
        <div className="location-section">
          <h3><FaMapMarkerAlt /> To Location</h3>
          
          <div className="radio-group">
            <label className="radio-label">
              <input
                type="radio"
                checked={toType === "city"}
                onChange={() => setToType("city")}
              />
              <span>City</span>
            </label>

            <label className="radio-label">
              <input
                type="radio"
                checked={toType === "coords"}
                onChange={() => setToType("coords")}
              />
              <span>Custom Coordinates</span>
            </label>
          </div>

          {toType === "city" ? (
            <>
              <label className="input-label">Select City:</label>
              <select 
                className="select-input city-select"
                value={toCity} 
                onChange={e => setToCity(e.target.value)}
              >
                {Object.keys(southAfricanCities).map(c => (
                  <option key={c} value={c}>
                    {c} ({southAfricanCities[c].province})
                  </option>
                ))}
              </select>

              {southAfricanCities[toCity] && (
                <div className="city-info">
                  <p>Province: {southAfricanCities[toCity].province}</p>
                  <p> Population: {southAfricanCities[toCity].population}</p>
                  <p> Coordinates: {southAfricanCities[toCity].lat.toFixed(4)}°, {southAfricanCities[toCity].lon.toFixed(4)}°</p>
                </div>
              )}
            </>
          ) : (
            <div className="coord-inputs">
              <input 
                className="coord-input"
                type="number"
                step="0.0001"
                placeholder="Latitude (e.g., -33.9249)" 
                value={toLat} 
                onChange={e => setToLat(e.target.value)} 
              />
              <input 
                className="coord-input"
                type="number"
                step="0.0001"
                placeholder="Longitude (e.g., 18.4241)" 
                value={toLon} 
                onChange={e => setToLon(e.target.value)} 
              />
            </div>
          )}
        </div>

        {/* OPTIONS & CALCULATE */}
        <div className="options-section">
          <div className="option-group">
            <label className="input-label">Preferred Unit:</label>
            <select 
              className="select-input"
              value={unit} 
              onChange={e => setUnit(e.target.value)}
            >
              <option value="km">Kilometers (km)</option>
              <option value="miles">Miles (mi)</option>
              <option value="nautical">Nautical Miles (NM)</option>
            </select>
          </div>

          <div className="option-group">
            <label className="input-label">Travel Mode:</label>
            <select 
              className="select-input"
              value={travelMode} 
              onChange={e => setTravelMode(e.target.value)}
            >
              <option value="car">🚗 Car</option>
              <option value="plane">✈️ Plane</option>
              <option value="bus">🚌 Bus</option>
              <option value="train">🚂 Train</option>
            </select>
          </div>

          <button onClick={compute} className="compute-btn">
            <FaRoute /> Calculate Distance
          </button>
        </div>

        {/* RESULTS */}
        {distance && !distance.error && (
          <div className="result-section">
            <h3>Distance Results</h3>
            
            <div className="result-grid">
              <div className="result-card primary">
                <div className="result-label">Distance</div>
                <div className="result-value">
                  {unit === "km" && `${distance.km.toFixed(2)} km`}
                  {unit === "miles" && `${distance.miles.toFixed(2)} mi`}
                  {unit === "nautical" && `${distance.nauticalMiles.toFixed(2)} NM`}
                </div>
              </div>

              <div className="result-card">
                <div className="result-label">Route</div>
                <div className="result-value small">
                  {distance.from} → {distance.to}
                </div>
              </div>

              <div className="result-card">
                <div className="result-label">Provinces</div>
                <div className="result-value small">
                  {distance.fromProvince} → {distance.toProvince}
                </div>
              </div>
            </div>

            <div className="travel-times">
              <h4><FaClock /> Estimated Travel Times</h4>
              <div className="time-grid">
                <div className="time-item">
                  <FaCar />
                  <span>Car: {distance.travelTime.car}</span>
                </div>
                <div className="time-item">
                  <FaPlane />
                  <span>Plane: {distance.travelTime.plane}</span>
                </div>
                <div className="time-item">
                  🚌
                  <span>Bus: {distance.travelTime.bus}</span>
                </div>
                <div className="time-item">
                  🚂
                  <span>Train: {distance.travelTime.train}</span>
                </div>
              </div>
            </div>

            <div className="method-info">
              <p><strong>Calculation Method:</strong> Haversine Formula</p>
              <p>Great-circle distance (shortest path on Earth's surface)</p>
              <p><em>Note: Actual travel distances by road may be longer</em></p>
            </div>
          </div>
        )}

        {distance?.error && (
          <div className="error-box">
            ⚠️ {distance.error}
          </div>
        )}
      </div>

      {/* HISTORY SECTION */}
      <button 
        className="history-toggle-btn" 
        onClick={() => setShowHistory(!showHistory)}
      >
        <FaHistory /> {showHistory ? "Hide" : "Show"} History ({history.length})
      </button>

      {showHistory && history.length > 0 && (
        <div className="history-panel">
          <div className="history-header">
            <h3>Calculation History</h3>
            <button onClick={clearHistory} className="clear-history-btn">
              Clear All
            </button>
          </div>
          <div className="history-list">
            {history.map((item, index) => (
              <div 
                key={index} 
                className="history-item"
                onClick={() => loadFromHistory(item)}
              >
                <div className="history-route">
                  {item.from} → {item.to}
                </div>
                <div className="history-distance">
                  {item.km.toFixed(2)} km
                </div>
                <div className="history-time">
                  {item.timestamp}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DistanceCalculator;