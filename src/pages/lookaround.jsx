import React, { useState, useEffect } from "react";
import "../styles/lookaround.css";
import destinationsData from "../data/destinations_new.json";

const LookaroundPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [favorites, setFavorites] = useState([]);
  const [destinations, setDestinations] = useState([]);

  // Extract all places from destinations data
  useEffect(() => {
    const allDestinations = [];
    
    // Process the nested structure of destinations
    Object.keys(destinationsData.destinations).forEach(region => {
      const countries = destinationsData.destinations[region];
      
      Object.keys(countries).forEach(countryCode => {
        const country = countries[countryCode];
        
        Object.keys(country.cities).forEach(cityCode => {
          const city = country.cities[cityCode];
          
          city.places.forEach(place => {
            // Get a random image URL based on the place category
            let imageUrl = getImageUrlForCategory(place.category);
            
            allDestinations.push({
              id: place.id,
              name: `${place.name}, ${city.name}`,
              description: place.description,
              image: imageUrl,
              country: country.name,
              best_time_to_go: place.best_time_to_visit || "Year-round",
              rating: place.rating,
              category: place.category,
              isFavorite: false
            });
          });
        });
      });
    });
    
    setDestinations(allDestinations);
  }, []);

  // Function to get a random image URL based on the place category
  const getImageUrlForCategory = (category) => {
    const categoryImages = {
      "Temple": "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80",
      "Shrine": "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80",
      "Park": "https://images.unsplash.com/photo-1519331379826-f10be5486c6f?auto=format&fit=crop&w=800&q=80",
      "Museum": "https://images.unsplash.com/photo-1551009175-15bdf9dcb580?auto=format&fit=crop&w=800&q=80",
      "Beach": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
      "Mountain": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80",
      "Lake": "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80",
      "Waterfall": "https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=800&q=80",
      "Fort": "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80",
      "Palace": "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80",
      "Market": "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=800&q=80",
      "Restaurant": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
      "Shopping": "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=800&q=80",
      "Entertainment": "https://images.unsplash.com/photo-1511795409834-432f7b1728d2?auto=format&fit=crop&w=800&q=80",
      "Nightlife": "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80",
      "default": "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80"
    };
    
    return categoryImages[category] || categoryImages.default;
  };

  const toggleFavorite = (id) => {
    setFavorites(prev => {
      if (prev.includes(id)) {
        return prev.filter(favId => favId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const filteredDestinations = destinations.filter(dest => {
    const matchesSearch = dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         dest.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         dest.country.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === "all" || 
                         (activeFilter === "favorites" && favorites.includes(dest.id));
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="lookaround-container">
      <div className="header">
        <h1>Browse Destinations</h1>
        <p>Discover amazing places around the world and start planning your next adventure</p>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search destinations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button>Search</button>
      </div>

      <div className="filters">
        <button
          className={`filter-button ${activeFilter === "all" ? "active" : ""}`}
          onClick={() => setActiveFilter("all")}
        >
          All Destinations
        </button>
        <button
          className={`filter-button ${activeFilter === "favorites" ? "active" : ""}`}
          onClick={() => setActiveFilter("favorites")}
        >
          Favorites
        </button>
      </div>

      <div className="destinations-grid">
        {filteredDestinations.map((dest) => (
          <div key={dest.id} className="destination-card">
            <img
              src={dest.image}
              alt={dest.name}
              className="destination-image"
            />
            <div className="destination-info">
              <h3>{dest.name}</h3>
              <p>{dest.description}</p>
              <div className="destination-meta">
                <span>Best time to go: {dest.best_time_to_go}</span>
                <span>Rating: {dest.rating} ⭐</span>
                <button
                  className={`favorite-button ${favorites.includes(dest.id) ? "active" : ""}`}
                  onClick={() => toggleFavorite(dest.id)}
                >
                  ❤
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LookaroundPage;
