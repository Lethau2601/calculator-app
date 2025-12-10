import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft, FaExchangeAlt, FaHistory, FaRuler, FaWeight, FaThermometerHalf, FaClock, FaTachometerAlt, FaDollarSign } from "react-icons/fa";
import "./UnitConverter.css";

const UnitConverter = () => {
  const [category, setCategory] = useState("length");
  const [fromUnit, setFromUnit] = useState("meters");
  const [toUnit, setToUnit] = useState("kilometers");
  const [inputValue, setInputValue] = useState("");
  const [result, setResult] = useState("");
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  
  // Currency state
  const [currencyAmount, setCurrencyAmount] = useState("");
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");
  const [currencyResult, setCurrencyResult] = useState("");
  const [exchangeRates, setExchangeRates] = useState({});
  const [lastUpdated, setLastUpdated] = useState("");
  const [loading, setLoading] = useState(false);

  const conversions = {
    length: {
      name: "Length",
      icon: <FaRuler />,
      units: {
        meters: { name: "Meters", symbol: "m" },
        kilometers: { name: "Kilometers", symbol: "km" },
        centimeters: { name: "Centimeters", symbol: "cm" },
        millimeters: { name: "Millimeters", symbol: "mm" },
        miles: { name: "Miles", symbol: "mi" },
        yards: { name: "Yards", symbol: "yd" },
        feet: { name: "Feet", symbol: "ft" },
        inches: { name: "Inches", symbol: "in" },
      },
      convert: (value, from, to) => {
        // Convert to meters first
        const toMeters = {
          meters: 1,
          kilometers: 1000,
          centimeters: 0.01,
          millimeters: 0.001,
          miles: 1609.344,
          yards: 0.9144,
          feet: 0.3048,
          inches: 0.0254,
        };
        
        const meters = value * toMeters[from];
        return meters / toMeters[to];
      }
    },
    weight: {
      name: "Weight",
      icon: <FaWeight />,
      units: {
        kilograms: { name: "Kilograms", symbol: "kg" },
        grams: { name: "Grams", symbol: "g" },
        milligrams: { name: "Milligrams", symbol: "mg" },
        pounds: { name: "Pounds", symbol: "lb" },
        ounces: { name: "Ounces", symbol: "oz" },
        tons: { name: "Metric Tons", symbol: "t" },
      },
      convert: (value, from, to) => {
        const toKg = {
          kilograms: 1,
          grams: 0.001,
          milligrams: 0.000001,
          pounds: 0.45359237,
          ounces: 0.028349523125,
          tons: 1000,
        };
        
        const kg = value * toKg[from];
        return kg / toKg[to];
      }
    },
    temperature: {
      name: "Temperature",
      icon: <FaThermometerHalf />,
      units: {
        celsius: { name: "Celsius", symbol: "°C" },
        fahrenheit: { name: "Fahrenheit", symbol: "°F" },
        kelvin: { name: "Kelvin", symbol: "K" },
      },
      convert: (value, from, to) => {
        let celsius;
        
        // Convert to Celsius first
        if (from === "celsius") celsius = value;
        else if (from === "fahrenheit") celsius = (value - 32) * 5/9;
        else celsius = value - 273.15; // kelvin
        
        // Convert from Celsius to target
        if (to === "celsius") return celsius;
        else if (to === "fahrenheit") return celsius * 9/5 + 32;
        else return celsius + 273.15; // kelvin
      }
    },
    time: {
      name: "Time",
      icon: <FaClock />,
      units: {
        seconds: { name: "Seconds", symbol: "s" },
        minutes: { name: "Minutes", symbol: "min" },
        hours: { name: "Hours", symbol: "hr" },
        days: { name: "Days", symbol: "d" },
        weeks: { name: "Weeks", symbol: "wk" },
        months: { name: "Months", symbol: "mo" },
        years: { name: "Years", symbol: "yr" },
      },
      convert: (value, from, to) => {
        const toSeconds = {
          seconds: 1,
          minutes: 60,
          hours: 3600,
          days: 86400,
          weeks: 604800,
          months: 2628000, // Average month
          years: 31536000,
        };
        
        const seconds = value * toSeconds[from];
        return seconds / toSeconds[to];
      }
    },
    speed: {
      name: "Speed",
      icon: <FaTachometerAlt />,
      units: {
        mps: { name: "Meters/Second", symbol: "m/s" },
        kph: { name: "Kilometers/Hour", symbol: "km/h" },
        mph: { name: "Miles/Hour", symbol: "mph" },
        fps: { name: "Feet/Second", symbol: "ft/s" },
        knots: { name: "Knots", symbol: "kn" },
      },
      convert: (value, from, to) => {
        const toMps = {
          mps: 1,
          kph: 0.277778,
          mph: 0.44704,
          fps: 0.3048,
          knots: 0.514444,
        };
        
        const mps = value * toMps[from];
        return mps / toMps[to];
      }
    },
    area: {
      name: "Area",
      icon: <FaRuler />,
      units: {
        sqmeters: { name: "Square Meters", symbol: "m²" },
        sqkilometers: { name: "Square Kilometers", symbol: "km²" },
        sqcentimeters: { name: "Square Centimeters", symbol: "cm²" },
        sqfeet: { name: "Square Feet", symbol: "ft²" },
        sqmiles: { name: "Square Miles", symbol: "mi²" },
        acres: { name: "Acres", symbol: "ac" },
        hectares: { name: "Hectares", symbol: "ha" },
      },
      convert: (value, from, to) => {
        const toSqMeters = {
          sqmeters: 1,
          sqkilometers: 1000000,
          sqcentimeters: 0.0001,
          sqfeet: 0.092903,
          sqmiles: 2589988.11,
          acres: 4046.86,
          hectares: 10000,
        };
        
        const sqm = value * toSqMeters[from];
        return sqm / toSqMeters[to];
      }
    },
  };

  const currencies = {
    USD: { name: "US Dollar", symbol: "$" },
    EUR: { name: "Euro", symbol: "€" },
    GBP: { name: "British Pound", symbol: "£" },
    JPY: { name: "Japanese Yen", symbol: "¥" },
    AUD: { name: "Australian Dollar", symbol: "A$" },
    CAD: { name: "Canadian Dollar", symbol: "C$" },
    CHF: { name: "Swiss Franc", symbol: "CHF" },
    CNY: { name: "Chinese Yuan", symbol: "¥" },
    INR: { name: "Indian Rupee", symbol: "₹" },
    MXN: { name: "Mexican Peso", symbol: "$" },
    BRL: { name: "Brazilian Real", symbol: "R$" },
    ZAR: { name: "South African Rand", symbol: "R" },
    RUB: { name: "Russian Ruble", symbol: "₽" },
    KRW: { name: "South Korean Won", symbol: "₩" },
    SGD: { name: "Singapore Dollar", symbol: "S$" },
    NZD: { name: "New Zealand Dollar", symbol: "NZ$" },
    TRY: { name: "Turkish Lira", symbol: "₺" },
    HKD: { name: "Hong Kong Dollar", symbol: "HK$" },
    NOK: { name: "Norwegian Krone", symbol: "kr" },
    SEK: { name: "Swedish Krona", symbol: "kr" },
  };

  // Fetch exchange rates
  useEffect(() => {
    const fetchRates = async () => {
      setLoading(true);
      try {
        const response = await fetch(`https://api.exchangerate-api.com/v4/latest/USD`);
        const data = await response.json();
        setExchangeRates(data.rates);
        setLastUpdated(new Date(data.time_last_updated * 1000).toLocaleString());
      } catch (error) {
        console.error("Failed to fetch exchange rates:", error);
      }
      setLoading(false);
    };
    
    fetchRates();
  }, []);

  // Convert currency
  useEffect(() => {
    if (currencyAmount && exchangeRates[fromCurrency] && exchangeRates[toCurrency]) {
      const amount = parseFloat(currencyAmount);
      if (!isNaN(amount)) {
        // Convert to USD first, then to target currency
        const inUSD = amount / exchangeRates[fromCurrency];
        const result = inUSD * exchangeRates[toCurrency];
        setCurrencyResult(result.toFixed(2));
      }
    } else {
      setCurrencyResult("");
    }
  }, [currencyAmount, fromCurrency, toCurrency, exchangeRates]);

  useEffect(() => {
    // Set default units when category changes
    const units = Object.keys(conversions[category].units);
    setFromUnit(units[0]);
    setToUnit(units[1]);
    setInputValue("");
    setResult("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  useEffect(() => {
    // Auto-convert when input value changes
    const value = parseFloat(inputValue);
    if (inputValue && !isNaN(value)) {
      const converted = conversions[category].convert(value, fromUnit, toUnit);
      const fromSymbol = conversions[category].units[fromUnit].symbol;
      const toSymbol = conversions[category].units[toUnit].symbol;
      
      setResult(converted.toFixed(6));
      
      // Add to history
      const historyItem = {
        value: value,
        from: fromUnit,
        to: toUnit,
        result: converted.toFixed(6),
        category: category,
        fromSymbol: fromSymbol,
        toSymbol: toSymbol,
        timestamp: new Date().toLocaleString()
      };
      
      setHistory(prev => [historyItem, ...prev].slice(0, 10));
    } else {
      setResult("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputValue, fromUnit, toUnit, category]);

  const swapUnits = () => {
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
  };

  const swapCurrencies = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
  };

  const reset = () => {
    setInputValue("");
    setResult("");
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const loadFromHistory = (item) => {
    setCategory(item.category);
    setFromUnit(item.from);
    setToUnit(item.to);
    setInputValue(item.value.toString());
    setShowHistory(false);
  };

  return (
    <div className="unit-container">
      <Link to="/" className="back-btn">
        <FaArrowLeft /> Back to Home
      </Link>

      <h2 className="title">🔄 Advanced Unit Converter</h2>
      <p className="subtext">Convert between multiple units with precision</p>

      {/* Category Selector */}
      <div className="category-selector">
        {Object.keys(conversions).map((cat) => (
          <button
            key={cat}
            className={`category-btn ${category === cat ? "active" : ""}`}
            onClick={() => setCategory(cat)}
          >
            {conversions[cat].icon}
            <span>{conversions[cat].name}</span>
          </button>
        ))}
      </div>

      {/* Conversion Section */}
      <div className="conversion-card">
        <div className="conversion-row">
          <div className="unit-group">
            <label>From</label>
            <select 
              value={fromUnit} 
              onChange={(e) => setFromUnit(e.target.value)}
              className="unit-select"
            >
              {Object.keys(conversions[category].units).map((unit) => (
                <option key={unit} value={unit}>
                  {conversions[category].units[unit].name} ({conversions[category].units[unit].symbol})
                </option>
              ))}
            </select>
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter value"
              className="value-input"
            />
          </div>

          <button className="swap-btn" onClick={swapUnits} title="Swap units">
            <FaExchangeAlt />
          </button>

          <div className="unit-group">
            <label>To</label>
            <select 
              value={toUnit} 
              onChange={(e) => setToUnit(e.target.value)}
              className="unit-select"
            >
              {Object.keys(conversions[category].units).map((unit) => (
                <option key={unit} value={unit}>
                  {conversions[category].units[unit].name} ({conversions[category].units[unit].symbol})
                </option>
              ))}
            </select>
            <div className="result-display">
              {result || "—"}
            </div>
          </div>
        </div>

        <button className="reset-btn" onClick={reset}>
          Clear
        </button>
      </div>

      {/* Currency Converter Card */}
      <div className="currency-converter-card">
        <div className="currency-header">
          <FaDollarSign className="currency-icon" />
          <div>
            <h3>Currency Converter</h3>
            <p className="currency-subtext">Live exchange rates {lastUpdated && `• Updated: ${lastUpdated}`}</p>
          </div>
        </div>

        {loading ? (
          <div className="loading-state">Loading exchange rates...</div>
        ) : (
          <>
            <div className="conversion-row">
              <div className="unit-group">
                <label>From</label>
                <select 
                  value={fromCurrency} 
                  onChange={(e) => setFromCurrency(e.target.value)}
                  className="unit-select"
                >
                  {Object.keys(currencies).map((code) => (
                    <option key={code} value={code}>
                      {currencies[code].name} ({code})
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  value={currencyAmount}
                  onChange={(e) => setCurrencyAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="value-input"
                />
              </div>

              <button className="swap-btn" onClick={swapCurrencies} title="Swap currencies">
                <FaExchangeAlt />
              </button>

              <div className="unit-group">
                <label>To</label>
                <select 
                  value={toCurrency} 
                  onChange={(e) => setToCurrency(e.target.value)}
                  className="unit-select"
                >
                  {Object.keys(currencies).map((code) => (
                    <option key={code} value={code}>
                      {currencies[code].name} ({code})
                    </option>
                  ))}
                </select>
                <div className="result-display currency-result">
                  {currencyResult ? `${currencies[toCurrency].symbol}${currencyResult}` : "—"}
                </div>
              </div>
            </div>

            {currencyAmount && currencyResult && exchangeRates[fromCurrency] && exchangeRates[toCurrency] && (
              <div className="exchange-rate-info">
                <p>1 {fromCurrency} = {(exchangeRates[toCurrency] / exchangeRates[fromCurrency]).toFixed(4)} {toCurrency}</p>
                <p>1 {toCurrency} = {(exchangeRates[fromCurrency] / exchangeRates[toCurrency]).toFixed(4)} {fromCurrency}</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Formula Display */}
      {inputValue && result && (
        <div className="formula-display">
          <strong>Formula:</strong> {inputValue} {conversions[category].units[fromUnit].symbol} = {result} {conversions[category].units[toUnit].symbol}
        </div>
      )}

      {/* History Section */}
      <button 
        className="history-toggle-btn" 
        onClick={() => setShowHistory(!showHistory)}
      >
        <FaHistory /> {showHistory ? "Hide" : "Show"} History ({history.length})
      </button>

      {showHistory && history.length > 0 && (
        <div className="history-panel">
          <div className="history-header">
            <h3>Conversion History</h3>
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
                <div className="history-conversion">
                  <strong>{conversions[item.category].name}:</strong> {item.value} {item.fromSymbol} → {item.result} {item.toSymbol}
                </div>
                <div className="history-time">{item.timestamp}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Reference */}
      <div className="reference-section">
        <h3> Quick Reference</h3>
        <div className="reference-grid">
          <div className="reference-card">
            <strong>Length</strong>
            <p>1 km = 1000 m</p>
            <p>1 mi = 1.609 km</p>
            <p>1 ft = 0.305 m</p>
          </div>
          <div className="reference-card">
            <strong>Weight</strong>
            <p>1 kg = 1000 g</p>
            <p>1 lb = 0.454 kg</p>
            <p>1 oz = 28.35 g</p>
          </div>
          <div className="reference-card">
            <strong>Temperature</strong>
            <p>0°C = 32°F</p>
            <p>100°C = 212°F</p>
            <p>0 K = -273.15°C</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnitConverter;