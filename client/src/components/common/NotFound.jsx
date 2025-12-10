import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => (
  <div style={{ textAlign: "center", marginTop: 120 }}>
    <h1>404 – Page Not Found</h1>
    <p>The page you are looking for does not exist.</p>
    <Link
      to="/"
      style={{
        display: "inline-block",
        padding: "10px 20px",
        background: "#00ff88",
        color: "#000",
        borderRadius: "8px",
        marginTop: 20,
      }}
    >
      Go Home
    </Link>
  </div>
);

export default NotFound;
