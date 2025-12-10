import React, { useState } from 'react';

/*
  QuadraticSolver:
  - solves ax^2 + bx + c = 0
  - shows discriminant, roots, step-by-step explanation
*/

const QuadraticSolver = () => {
  const [a, setA] = useState('');
  const [b, setB] = useState('');
  const [c, setC] = useState('');
  const [result, setResult] = useState(null);

  const solve = () => {
    const A = Number(a);
    const B = Number(b);
    const C = Number(c);
    if (!A) {
      setResult({ error: 'Coefficient a must not be 0.' });
      return;
    }
    const disc = B * B - 4 * A * C;
    if (disc > 0) {
      const r1 = (-B + Math.sqrt(disc)) / (2 * A);
      const r2 = (-B - Math.sqrt(disc)) / (2 * A);
      setResult({
        disc,
        type: 'Two real roots',
        r1,
        r2,
        steps: [
          `discriminant Δ = b² − 4ac = ${B}² − 4×${A}×${C} = ${disc}`,
          `roots: (-b ± √Δ) / (2a)`,
          `r1 = ${r1}`,
          `r2 = ${r2}`
        ]
      });
    } else if (disc === 0) {
      const r = -B / (2 * A);
      setResult({
        disc,
        type: 'One real root (double)',
        r,
        steps: [
          `discriminant Δ = ${disc}`,
          `root: -b / (2a) = ${r}`
        ]
      });
    } else {
      // complex
      const real = -B / (2 * A);
      const imag = Math.sqrt(Math.abs(disc)) / (2 * A);
      setResult({
        disc,
        type: 'Complex roots',
        r1: `${real.toFixed(4)} + ${imag.toFixed(4)}i`,
        r2: `${real.toFixed(4)} - ${imag.toFixed(4)}i`,
        steps: [
          `discriminant Δ = ${disc}`,
          `roots: ${real.toFixed(4)} ± ${imag.toFixed(4)}i`
        ]
      });
    }
  };

  const reset = () => {
    setA(''); setB(''); setC(''); setResult(null);
  };

  return (
    <div style={{ padding: 16, color: '#fff' }}>
      <h2>Quadratic Solver</h2>

      <div style={{ display: 'grid', gap: 8, maxWidth: 560 }}>
        <label>
          a
          <input type="number" value={a} onChange={(e) => setA(e.target.value)} />
        </label>
        <label>
          b
          <input type="number" value={b} onChange={(e) => setB(e.target.value)} />
        </label>
        <label>
          c
          <input type="number" value={c} onChange={(e) => setC(e.target.value)} />
        </label>

        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={solve}>Solve</button>
          <button onClick={reset}>Reset</button>
        </div>

        {result && result.error && <div style={{ color: '#ff6b6b' }}>{result.error}</div>}

        {result && !result.error && (
          <div style={{ marginTop: 8 }}>
            <div><strong>Type:</strong> {result.type}</div>
            <div><strong>Discriminant:</strong> {result.disc}</div>
            {result.r1 !== undefined && <div><strong>Root 1:</strong> {String(result.r1)}</div>}
            {result.r2 !== undefined && <div><strong>Root 2:</strong> {String(result.r2)}</div>}

            <h4>Steps</h4>
            <ol>
              {result.steps.map((s, i) => <li key={i} style={{ color: '#bfbfbf' }}>{s}</li>)}
            </ol>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuadraticSolver;
