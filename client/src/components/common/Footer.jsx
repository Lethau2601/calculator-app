// components/common/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";
import { 
  FaCalculator, 
  FaGithub, 
  FaLinkedin, 
  FaTwitter, 
  FaEnvelope,
  FaHeart,
  FaRocket,
  FaBrain,
  FaShieldAlt
} from "react-icons/fa";
import "./Footer.css";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        
        {/* Top Section */}
        <div className="footer-top">
          
          {/* Brand Column */}
          <div className="footer-column brand-column">
            <div className="footer-logo">
              <FaCalculator className="footer-logo-icon" />
              <span>SmartCalc</span>
            </div>
            <p className="footer-tagline">
              Empowering students with interactive learning tools that build confidence and inspire success.
            </p>
            <div className="footer-cta">
              <Link to="/ai" className="cta-button">
                <FaBrain /> Try AI Tutor
              </Link>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="footer-column">
            <h3 className="footer-heading">Quick Links</h3>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/tools">All Tools</Link></li>
              <li><Link to="/basic">Basic Calculator</Link></li>
              <li><Link to="/scientific">Scientific</Link></li>
              <li><Link to="/geometry">Geometry</Link></li>
              <li><Link to="/ai">AI Tutor</Link></li>
            </ul>
          </div>

          {/* Features Column */}
          <div className="footer-column">
            <h3 className="footer-heading">Why SmartCalc?</h3>
            <ul className="footer-features">
              <li>
                <FaRocket className="feature-icon" />
                <span>Engaging learning tools</span>
              </li>
              <li>
                <FaBrain className="feature-icon" />
                <span>AI-assisted study coach</span>
              </li>
              <li>
                <FaShieldAlt className="feature-icon" />
                <span>Simple, scalable & secure</span>
              </li>
              <li>
                <FaHeart className="feature-icon" />
                <span>Built for real students</span>
              </li>
            </ul>
          </div>

          {/* Connect Column */}
          <div className="footer-column">
            <h3 className="footer-heading">Connect With Us</h3>
            <div className="social-links">
              <a 
                href="https://github.com/Lethau2601" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-link github"
                title="GitHub"
              >
                <FaGithub />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-link linkedin"
                title="LinkedIn"
              >
                <FaLinkedin />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-link twitter"
                title="Twitter"
              >
                <FaTwitter />
              </a>
              <a 
                href="mailto:contact@smartcalc.com" 
                className="social-link email"
                title="Email"
              >
                <FaEnvelope />
              </a>
            </div>
            <p className="contact-text">
              Have questions? Reach out to us anytime!
            </p>
          </div>

        </div>

        {/* Divider */}
        <div className="footer-divider"></div>

        {/* Bottom Section */}
        <div className="footer-bottom">
          <p className="copyright">
            © {currentYear} SmartCalc • Made with <FaHeart className="heart-icon" /> by{" "}
            <a 
              href="https://github.com/Lethau2601" 
              target="_blank" 
              rel="noopener noreferrer"
              className="author-link"
            >
              Lethau2601
            </a>
          </p>
          <p className="tagline">
            Smart Learning for Smart Futures
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;