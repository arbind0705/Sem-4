import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "../styles/map.css"; // Import CSS
import destinationsData from "../data/destinations_new.json";

// Fix for default marker icons in react-leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom Icons for Different Places
const icons = {
  tourist: new L.Icon({ iconUrl: "/tourist.png", iconSize: [30, 30] }),
  hotel: new L.Icon({ iconUrl: "/hotel.png", iconSize: [30, 30] }),
  airport: new L.Icon({ iconUrl: "/airport.png", iconSize: [30, 30] }),
};

// Component to handle map center changes
function ChangeView({ center, zoom }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

const MapPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [places, setPlaces] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [mapCenter, setMapCenter] = useState([20.5937, 78.9629]); // Default to India
  const [mapZoom, setMapZoom] = useState(5);

  // Extract all places from destinations data
  useEffect(() => {
    const allPlaces = [];
    
    // Process the nested structure of destinations
    Object.keys(destinationsData.destinations).forEach(region => {
      const countries = destinationsData.destinations[region];
      
      Object.keys(countries).forEach(countryCode => {
        const country = countries[countryCode];
        
        Object.keys(country.cities).forEach(cityCode => {
          const city = country.cities[cityCode];
          
          city.places.forEach(place => {
            if (place.location && place.location.lat && place.location.lng) {
              allPlaces.push({
                id: place.id,
                name: place.name,
                country: country.name,
                city: city.name,
                category: place.category,
                rating: place.rating,
                description: place.description,
                coords: [place.location.lat, place.location.lng],
                address: place.location.address
              });
            }
          });
        });
      });
    });
    
    setPlaces(allPlaces);
  }, []);

  // Filter places based on search input
  const filteredPlaces = places.filter((place) =>
    place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    place.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
    place.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle place selection
  const handlePlaceSelect = (place) => {
    setSelectedPlace(place);
    setMapCenter(place.coords);
    setMapZoom(14);
  };

  return (
    <div className="map-page">
      {/* Sidebar for Search */}
      <div className="sidebar">
        <h2>Find Places</h2>
        <input
          type="text"
          placeholder="Search places, cities, or countries..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <ul>
          {filteredPlaces.map((place) => (
            <li 
              key={place.id} 
              onClick={() => handlePlaceSelect(place)}
              className={selectedPlace && selectedPlace.id === place.id ? 'selected' : ''}
            >
              <strong>{place.name}</strong>
              <div>{place.city}, {place.country}</div>
              <div>Rating: {place.rating} ⭐</div>
            </li>
          ))}
        </ul>
      </div>

      {/* Map Section */}
      <div className="map-container">
        <MapContainer 
          center={mapCenter} 
          zoom={mapZoom} 
          scrollWheelZoom={true}
          style={{ height: "100%", width: "100%" }}
        >
          <ChangeView center={mapCenter} zoom={mapZoom} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {filteredPlaces.map((place) => (
            <Marker 
              key={place.id} 
              position={place.coords}
              icon={DefaultIcon}
              eventHandlers={{
                click: () => handlePlaceSelect(place)
              }}
            >
              <Popup>
                <div>
                  <h3>{place.name}</h3>
                  <p><strong>{place.city}, {place.country}</strong></p>
                  <p>Rating: {place.rating} ⭐</p>
                  <p>{place.description}</p>
                  <p>Address: {place.address}</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Route Box */}
      <div className="route-box">
        <h3>Place Information</h3>
        {selectedPlace ? (
          <div>
            <p><strong>{selectedPlace.name}</strong> in {selectedPlace.city}, {selectedPlace.country}</p>
            <p>Rating: {selectedPlace.rating} ⭐</p>
            <p>{selectedPlace.description}</p>
          </div>
        ) : (
          <p>Select a place to see more information.</p>
        )}
      </div>
    </div>
  );
};

export default MapPage;
