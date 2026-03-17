import React from 'react';
import './ClothingCard.css';

/**
 * ClothingCard — displays a single clothing recommendation.
 *
 * @param {Object} props
 * @param {string} props.itemName - Name of the clothing item (e.g. "Wide brim hat").
 * @param {string} props.material - Recommended material (e.g. "UPF 50+ fabric").
 * @param {string} props.coverageLevel - Coverage level ("Full", "Partial", etc.).
 * @param {string} props.description - Longer description of the recommendation.
 * @returns {React.ReactElement} A styled card element.
 */
function ClothingCard({ itemName, material, coverageLevel, description }) {
  return (
    <div className="clothing-card">
      <h3 className="clothing-card__title">{itemName}</h3>

      <div className="clothing-card__details">
        <span className="clothing-card__badge">{coverageLevel}</span>
        <span className="clothing-card__material">{material}</span>
      </div>

      <p className="clothing-card__description">{description}</p>
    </div>
  );
}

export default ClothingCard;
