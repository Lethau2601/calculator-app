import React, { useRef, useEffect, useState } from 'react';

/*
  GraphingStub:
  - simple canvas plotter
  - supports y = a*x + b and y = sin(x) with scale & pan basic controls
  - this is a scaffold you can replace with a full plotting library later
*/

const GraphingStub = () => {
  const canvasRef = useRef(null);
  const [mode, setMode] = useState('linear'); // 'linear' or 'sin'
  const [a, setA] = useState('1');
  const [b, setB] = useState('0');
  const [scale, setScale] = useState(20);

  useEffect(() => {
    draw();
    // eslint-disable-next-line
  }, [mode, a, b, scale]);

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    // axes
    ctx.strokeStyle = '#444';
    ctx.beginPath();
    ctx.moveTo(0, h/2); ctx.lineTo(w, h/2);
    ctx.moveTo(w/2, 0); ctx.lineTo(w/2, h);
    ctx.stroke();

    // plot
    ctx.strokeStyle = '#00ff88';
    ctx.beginPath();
    for (let px = 0; px < w; px++) {
      const x = (px - w/2) / scale; // in graph units
      let y;
      if (mode === 'linear') {
        y = Number(a) * x + Number(b);
      } else {
        y = Math.sin(x);
      }
      const py = h/2 - y * scale;
      if (px === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.stroke();
  };

  return (
    <div style={{ color: '#fff', padding: 16 }}>
      <h2>Graphing (Stub)</h2>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <label>Mode:
          <select value={mode} onChange={(e) => setMode(e.target.value)} style={{ marginLeft: 6 }}>
            <option value="linear">y = a * x + b</option>
            <option value="sin">y = sin(x)</option>
          </select>
        </label>

        {mode === 'linear' && (
          <>
            <label>a <input value={a} onChange={(e) => setA(e.target.value)} style={{ width: 60 }} /></label>
            <label>b <input value={b} onChange={(e) => setB(e.target.value)} style={{ width: 60 }} /></label>
          </>
        )}

        <label>Scale <input type="range" min="5" max="80" value={scale} onChange={(e) => setScale(Number(e.target.value))} /></label>
      </div>

      <canvas ref={canvasRef} width={720} height={360} style={{ display: 'block', marginTop: 12, background: '#000', borderRadius: 8 }} />
    </div>
  );
};

export default GraphingStub;
