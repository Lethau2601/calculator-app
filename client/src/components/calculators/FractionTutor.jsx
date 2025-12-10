import React, { useState } from 'react';
import { Link } from "react-router-dom";

/*
  FractionTutor:
  - add & subtract fractions
  - simplify fractions
  - convert fraction -> decimal
*/

const gcd = (a, b) => (b === 0 ? Math.abs(a) : gcd(b, a % b));

const simplify = (num, den) => {
  if (den === 0) return { num, den, simplified: null };
  const g = gcd(Math.round(num), Math.round(den));
  return { num: num / g, den: den / g };
};

const FractionTutor = () => {
  const [n1, setN1] = useState('1'); 
  const [d1, setD1] = useState('2');

  const [n2, setN2] = useState('1'); 
  const [d2, setD2] = useState('3');

  const [result, setResult] = useState(null);

  const add = () => {
    const N1 = Number(n1), D1 = Number(d1), N2 = Number(n2), D2 = Number(d2);
    if (!D1 || !D2) return setResult({ error: 'Denominator cannot be 0' });

    const num = N1 * D2 + N2 * D1;
    const den = D1 * D2;

    const s = simplify(num, den);
    setResult({ num, den, simplified: s });
  };

  const subtract = () => {
    const N1 = Number(n1), D1 = Number(d1), N2 = Number(n2), D2 = Number(d2);
    if (!D1 || !D2) return setResult({ error: 'Denominator cannot be 0' });

    const num = N1 * D2 - N2 * D1;
    const den = D1 * D2;

    const s = simplify(num, den);
    setResult({ num, den, simplified: s });
  };

  const toDecimal = () => {
    const N = Number(n1), D = Number(d1);
    if (!D) return setResult({ error: 'Denominator cannot be 0' });

    setResult({ decimal: N / D });
  };

  const reset = () => {
    setN1('1'); 
    setD1('2'); 
    setN2('1'); 
    setD2('3'); 
    setResult(null);
  };

  return (
    <div style={{ padding: 16, color: '#fff' }}>

      {/* 🔙 Back Button */}
      <Link to="/" className="back-btn">⬅ Back</Link>

      <h2>Fraction Tutor</h2>

      <div style={{ display: 'grid', gap: 12, maxWidth: 720 }}>
        
        {/* Fraction A */}
        <div>
          <strong>Fraction A</strong>
          <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
            <input 
              value={n1} 
              onChange={(e) => setN1(e.target.value)} 
              style={{ width: 80 }} 
            /> 
            /
            <input 
              value={d1} 
              onChange={(e) => setD1(e.target.value)} 
              style={{ width: 80 }} 
            />
          </div>
        </div>

        {/* Fraction B */}
        <div>
          <strong>Fraction B</strong>
          <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
            <input 
              value={n2} 
              onChange={(e) => setN2(e.target.value)} 
              style={{ width: 80 }} 
            /> 
            /
            <input 
              value={d2} 
              onChange={(e) => setD2(e.target.value)} 
              style={{ width: 80 }} 
            />
          </div>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: 10, flexWrap: "wrap" }}>
          <button onClick={add}>A + B</button>
          <button onClick={subtract}>A − B</button>
          <button onClick={toDecimal}>A → decimal</button>
          <button onClick={reset}>Reset</button>
        </div>

        {/* Errors */}
        {result && result.error && (
          <div style={{ color: '#ff6b6b', marginTop: 6 }}>
            {result.error}
          </div>
        )}

        {/* Results */}
        {result && !result.error && (
          <div>
            {result.num !== undefined && (
              <div>
                <strong>Raw result:</strong> {result.num}/{result.den}
                <div style={{ color: '#bfbfbf', marginTop: 4 }}>
                  Simplified: {result.simplified ? (
                    `${result.simplified.num}/${result.simplified.den}`
                  ) : (
                    '—'
                  )}
                </div>
              </div>
            )}

            {result.decimal !== undefined && (
              <div style={{ marginTop: 6 }}>
                <strong>Decimal:</strong> {result.decimal}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default FractionTutor;
