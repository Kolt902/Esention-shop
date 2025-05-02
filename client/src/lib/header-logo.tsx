import React from 'react';

const EsentionLogo: React.FC = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="120" height="30" viewBox="0 0 800 240">
      <style>
        {`
        .main-text {
          font-family: 'Arial', sans-serif;
          font-weight: 900;
          font-size: 100px;
          letter-spacing: 4px;
          fill: #000;
          text-transform: uppercase;
        }
        .accent {
          font-family: 'Arial', sans-serif;
          font-weight: 900;
          font-size: 100px;
          fill: #000;
          letter-spacing: 4px;
        }
        `}
      </style>
      <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="main-text">
        E<tspan className="accent">S</tspan>ENTION
      </text>
    </svg>
  );
};

export default EsentionLogo;