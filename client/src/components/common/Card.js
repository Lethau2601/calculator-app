import React from 'react';
import './Card.css';

const Card = ({ title, description, image, onClick }) => (
  <div
    className="card"
    onClick={onClick}
    role="button"
    tabIndex={0}
    aria-label={`Select ${title} calculator`}
  >
    <img
      src={image}
      alt={`${title} icon`}
      className="card-image"
      onError={(e) => (e.target.style.display = 'none')}
    />
    <h3>{title}</h3>
    <p>{description}</p>
  </div>
);

export default Card;
