import React from "react";
import "../Spinner.css"; // Include the custom styles

const Spinner = () => {
  return (
    <div className="spinner-container">
      <div className="spinner-line"></div>
      <div className="spinner-line"></div>
      <div className="spinner-line"></div>
      <div className="spinner-line"></div>
    </div>
  );
};

export default Spinner;