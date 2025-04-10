import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/home.css"; // Make sure this is in the same folder

// Import background images
import bg1 from '../assets/img1.jpg';
import bg2 from '../assets/img 2.jpg';
import bg3 from '../assets/img 3.jpg';
import bg4 from '../assets/img 4.jpg';
import bg5 from '../assets/img 5.jpg';
import bg6 from '../assets/img 6.jpg';

const HomePage = () => {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const backgroundImages = [bg1, bg2, bg3, bg4, bg5, bg6];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="home-container">
      <div 
        className="hero-section"
        style={{
          '--bg-image': `url(${backgroundImages[currentImageIndex]})`
        }}
      >
        <div className="overlay"></div>
        <h1 className="title">Plan Your Perfect Journey</h1>
        <p className="subtitle">Discover amazing destinations and create unforgettable memories</p>
      </div>

      <div className="content-container">
        <div className="buttons-wrapper">
          <div className="button-container">
            <div className="button-box boat">
              <button className="button" onClick={() => navigate('/preference')}>
                ⛵
                <span>Get Started</span>
              </button>
            </div>
            <div className="button-box login">
              <button className="button" onClick={() => navigate('/profile')}>
                👤
                <span>Profile</span>
              </button>
            </div>
            <div className="button-box duck">
              <button className="button" onClick={() => navigate('/lookaround')}>
                🐤
                <span>Lookover</span>
              </button>
            </div>
          </div>
          
          <div className="map-button-container">
            <button className="square-map-button" onClick={() => navigate('/map')}>
              🗺️
              <span>Map View</span>
            </button>
          </div>
        </div>

        <div className="info-container">
          <div className="info-box">
            <h2>📌 Smart Travel Planning</h2>
            <p>Plan your trip with AI-driven optimization that considers real-time data, budget constraints, and preferences.</p>
          </div>
          <div className="info-box">
            <h2>🎯 Intelligent Destination Selection</h2>
            <p>Uses the Dynamic Knapsack Problem (DKP) to choose the best places within your budget.</p>
          </div>
          <div className="info-box">
            <h2>🛤️ Optimized Travel Routes</h2>
            <p>Implements the Traveling Salesman Problem (TSP) to arrange destinations in the best sequence.</p>
          </div>
          <div className="info-box">
            <h2>📊 Real-Time Data Integration</h2>
            <p>Fetches live travel costs, ratings, and reviews from various travel APIs.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
