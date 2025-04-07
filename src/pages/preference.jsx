import React, { useState, useEffect, useRef } from "react";
import "../styles/preference.css";
import vid2 from "../assets/vid 2.mp4";
import DataService from "../services/dataService";

const PreferencePage = () => {
  const [selectedType, setSelectedType] = useState("Domestic");
  const [budget, setBudget] = useState("");
  const [days, setDays] = useState(3);
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [isEditingDays, setIsEditingDays] = useState(false);
  const [countryList, setCountryList] = useState([]);
  const [placeList, setPlaceList] = useState([]);
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [selectedPlaces, setSelectedPlaces] = useState([]);
  const [activities, setActivities] = useState([]);
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [statusMessage, setStatusMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showCountryList, setShowCountryList] = useState(false);
  const [showPlaceList, setShowPlaceList] = useState(false);
  const [showActivityList, setShowActivityList] = useState(false);
  const [response, setResponse] = useState(null);
  const resultsBoxRef = useRef(null);

  // Scroll to results box when it appears
  useEffect(() => {
    if (statusMessage === "Preferences processed successfully!" && resultsBoxRef.current) {
      setTimeout(() => {
        resultsBoxRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [statusMessage]);

  // Fetch countries based on travel type
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await DataService.getCountries();
        setCountryList(response.data);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };

    fetchCountries();
  }, [selectedType]);

  // Fetch places when countries are selected
  useEffect(() => {
    const fetchPlaces = async () => {
      if (selectedCountries.length > 0) {
        try {
          const places = [];
          for (const country of selectedCountries) {
            const response = await DataService.getPlaces(country);
            places.push(...response.data);
          }
          setPlaceList(places);
        } catch (error) {
          console.error("Error fetching places:", error);
        }
      }
    };

    fetchPlaces();
  }, [selectedCountries]);

  // Fetch activities when places are selected
  useEffect(() => {
    const fetchActivities = async () => {
      if (selectedPlaces.length > 0) {
        try {
          const response = await DataService.getActivities(selectedPlaces);
          setActivities(response.data);
        } catch (error) {
          console.error("Error fetching activities:", error);
        }
      }
    };

    fetchActivities();
  }, [selectedPlaces]);

  // Handle country selection
  const handleCountrySelect = (country) => {
    if (selectedType === "Domestic") {
      // For domestic travel, only allow single selection
      setSelectedCountries([country]);
    } else {
      // For international travel, allow multiple selections
      setSelectedCountries(prev => {
        if (prev.find(c => c.id === country.id)) {
          return prev.filter(c => c.id !== country.id);
        }
        return [...prev, country];
      });
    }
    setShowCountryList(false);
  };

  // Handle place selection
  const handlePlaceSelect = (place) => {
    setSelectedPlaces(prev => {
      if (prev.find(p => p.id === place.id)) {
        return prev.filter(p => p.id !== place.id);
      }
      return [...prev, place];
    });
    setShowPlaceList(false);
  };

  // Handle activity selection
  const handleActivitySelect = (activity) => {
    setSelectedActivities(prev => {
      if (prev.includes(activity)) {
        return prev.filter(a => a !== activity);
      }
      return [...prev, activity];
    });
    setShowActivityList(false);
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!budget || !days || selectedCountries.length === 0 || selectedPlaces.length === 0) {
      setStatusMessage("Please fill in all required fields");
      return;
    }

    setIsLoading(true);
    setStatusMessage("Processing preferences...");

    try {
      const preferences = {
        type: selectedType,
        budget: parseFloat(budget),
        days: parseInt(days),
        countries: selectedCountries.map(c => c.name),
        places: selectedPlaces.map(p => p.name),
        activities: selectedActivities
      };

      const result = await DataService.processPreferences(preferences);
      console.log("Raw response:", result);
      setResponse(result);
      setStatusMessage("Preferences processed successfully!");
      
    } catch (error) {
      setStatusMessage("Error processing preferences: " + error.message);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`preference-page ${statusMessage === "Preferences processed successfully!" ? "results-shown" : ""}`}>
      <video className="background-video" autoPlay loop muted>
        <source src={vid2} type="video/mp4" />
      </video>

      <div className="content-box">
        <h1 className="title">Select Your Travel Preferences</h1>

        {/* Travel Type Buttons */}
        <div className="button-group">
          <button
            className={`preference-button ${selectedType === "Domestic" ? "active" : ""}`}
            onClick={() => setSelectedType("Domestic")}
          >
            Domestic
          </button>
          <button
            className={`preference-button ${selectedType === "International" ? "active" : ""}`}
            onClick={() => setSelectedType("International")}
          >
            International
          </button>
          <button
            className={`preference-button ${selectedType === "Inter Countries" ? "active" : ""}`}
            onClick={() => setSelectedType("Inter Countries")}
          >
            Inter Countries
          </button>
        </div>

        {/* Budget & Days Section */}
        <div className="budget-days">
          {/* Budget Input */}
          <div className="input-container">
            <span className="icon">💰</span>
            {isEditingBudget ? (
              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                onBlur={() => setIsEditingBudget(false)}
                autoFocus
                className="full-width-input"
                min="0"
              />
            ) : (
              <button className="preference-button" onClick={() => setIsEditingBudget(true)}>
                {budget ? `₹ ${budget}` : "Enter Budget"}
              </button>
            )}
          </div>

          {/* Days Input */}
          <div className="input-container">
            <span className="icon">🌞🌙</span>
            {isEditingDays ? (
              <input
                type="number"
                min="1"
                max="30"
                value={days}
                onChange={(e) => setDays(e.target.value)}
                onBlur={() => setIsEditingDays(false)}
                autoFocus
                className="full-width-input"
              />
            ) : (
              <button className="preference-button" onClick={() => setIsEditingDays(true)}>
                {days} Days
              </button>
            )}
          </div>
        </div>

        {/* Country Selection */}
        <div className="dropdown" style={{ zIndex: showCountryList ? 1000 : 3 }}>
            <button 
                className="selection-button"
                onClick={() => {
                    setShowCountryList(!showCountryList);
                    setShowPlaceList(false);
                    setShowActivityList(false);
                }}
                disabled={isLoading}
            >
                {selectedCountries.length > 0 
                    ? `${selectedCountries.length} Country${selectedCountries.length > 1 ? 's' : ''} Selected`
                    : "Select Country"}
            </button>
            {showCountryList && countryList.length > 0 && (
                <div className="list-container">
                    <div className="list-header">Select Countries</div>
                    {countryList.map(country => (
                        <div
                            key={country.id}
                            className={`list-item ${selectedCountries.find(c => c.id === country.id) ? 'selected' : ''}`}
                            onClick={() => handleCountrySelect(country)}
                        >
                            {country.name}
                        </div>
                    ))}
                </div>
            )}
        </div>

        {/* Place Selection */}
        <div className="dropdown" style={{ zIndex: showPlaceList ? 1000 : 3 }}>
            <button 
                className="selection-button"
                onClick={() => {
                    setShowPlaceList(!showPlaceList);
                    setShowCountryList(false);
                    setShowActivityList(false);
                }}
                disabled={isLoading || selectedCountries.length === 0}
            >
                {selectedPlaces.length > 0 
                    ? `${selectedPlaces.length} Place${selectedPlaces.length > 1 ? 's' : ''} Selected`
                    : "Select Places"}
            </button>
            {showPlaceList && placeList.length > 0 && (
                <div className="list-container">
                    <div className="list-header">Select Places</div>
                    {placeList.map(place => (
                        <div
                            key={place.id}
                            className={`list-item ${selectedPlaces.find(p => p.id === place.id) ? 'selected' : ''}`}
                            onClick={() => handlePlaceSelect(place)}
                        >
                            {place.name}
                            <div className="place-details">
                                <span>Rating: {place.rating}⭐</span>
                                <span>Cost: {place.cost}</span>
                                <span>Duration: {place.visitDuration}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>

        {/* Activity Selection */}
        <div className="dropdown" style={{ zIndex: showActivityList ? 1000 : 3 }}>
            <button 
                className="selection-button"
                onClick={() => {
                    setShowActivityList(!showActivityList);
                    setShowCountryList(false);
                    setShowPlaceList(false);
                }}
                disabled={isLoading || selectedPlaces.length === 0}
            >
                {selectedActivities.length > 0 
                    ? `${selectedActivities.length} Activity${selectedActivities.length > 1 ? 'ies' : ''} Selected`
                    : "Select Activities"}
            </button>
            {showActivityList && activities.length > 0 && (
                <div className="list-container">
                    <div className="list-header">Select Activities</div>
                    {activities.map(activity => (
                        <div
                            key={activity}
                            className={`list-item ${selectedActivities.includes(activity) ? 'selected' : ''}`}
                            onClick={() => handleActivitySelect(activity)}
                        >
                            {activity}
                        </div>
                    ))}
                </div>
            )}
        </div>

        <button 
          className="submit-btn" 
          onClick={handleSubmit}
          disabled={isLoading || !budget || !days || selectedCountries.length === 0 || selectedPlaces.length === 0}
        >
          {isLoading ? "Processing..." : "Submit"}
        </button>

        <p className={`status-message ${isLoading ? "loading" : ""}`}>
          {statusMessage}
        </p>
      </div>

      {/* Results Section - Separated from the main content box */}
      {statusMessage === "Preferences processed successfully!" && response?.data && (
        <div className="results-box" ref={resultsBoxRef}>
          <h2 className="results-title">Your Optimized Travel Plan</h2>
          <div className="results-content">
            {(response.data.selectedPlaces || []).map((place, index) => (
              <div key={index} className="place-box">
                <h3 className="place-name">{place.name || 'Unnamed Place'}</h3>
                <div className="place-info">
                  <p className="place-country">Country: {place.country || 'Unknown'}</p>
                  <p className="place-rating">Rating: {place.rating || 0}⭐</p>
                  <p className="place-days">Days Needed: {place.daysNeeded || 1}</p>
                  <p className="place-cost">Total Cost: ₹{place.totalCost || 0}</p>
                </div>
                
                <div className="activities-section">
                  <h4>Recommended Activities</h4>
                  <ul className="activities-list">
                    {(place.activities || []).map((activity, actIndex) => (
                      <li key={actIndex}>
                        {activity.name || 'Unnamed Activity'} - ₹{activity.cost || 0}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="hotels-section">
                  <h4>Available Hotels</h4>
                  <div className="hotels-grid">
                    {(place.hotels || []).map((hotel, hotelIndex) => (
                      <div key={hotelIndex} className="hotel-card">
                        <h5>{hotel.name || 'Unnamed Hotel'}</h5>
                        <p>Rating: {hotel.rating || 0}⭐</p>
                        <p>Price: ₹{hotel.pricePerNight || 0}/night</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="remaining-info">
            {response?.data?.remainingBudget > 0 && (
              <p>Remaining Budget: ₹{response.data.remainingBudget}</p>
            )}
            {response?.data?.remainingDays > 0 && (
              <p>Remaining Days: {response.data.remainingDays}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PreferencePage;
