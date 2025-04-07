const express = require("express");
const axios = require("axios");
const app = express();
const port = 3000;

// Middleware to parse JSON requests
app.use(express.json());

const RAPIDAPI_KEY = "d8666244d8msh21a57fa6ccc2136p11f34djsn499a61dd9aae";
const RAPIDAPI_HOST = "skyscanner80.p.rapidapi.com";

// Fetch Place ID (Auto-Complete API)
app.get("/place-id", async (req, res) => {
    const { query } = req.query;
    if (!query) return res.status(400).json({ error: "Query parameter is required" });
    
    try {
        const response = await axios.get(`https://${RAPIDAPI_HOST}/api/v1/flights/auto-complete`, {
            params: { query, market: "IN", locale: "en-US" },
            headers: { "x-rapidapi-key": RAPIDAPI_KEY, "x-rapidapi-host": RAPIDAPI_HOST }
        });
        
        const placeId = response.data.data.length > 0 ? response.data.data[0].id : null;
        res.json({ placeId });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch place ID" });
    }
});

// Fetch Country List (Static or API-based)
app.get("/countries", async (req, res) => {
    // For simplicity, let's return a static list of countries
    const countries = [
        { id: "IN", name: "India" },
        { id: "US", name: "United States" },
        { id: "GB", name: "United Kingdom" },
        { id: "CA", name: "Canada" },
        { id: "AU", name: "Australia" },
        // Add more countries as needed
    ];
    
    res.json(countries);
});

// Fetch Places List (Static or API-based)
app.get("/places", async (req, res) => {
    // Simulate fetching places (can be expanded based on your needs)
    const places = [
        { id: "delhi", name: "Delhi" },
        { id: "nyc", name: "New York City" },
        { id: "london", name: "London" },
        { id: "sydney", name: "Sydney" },
        // Add more places as needed
    ];
    
    res.json(places);
});

// Fetch Flight Data
app.get("/flights", async (req, res) => {
    const { from, to, departDate = "2025-04-10" } = req.query;
    if (!from || !to) return res.status(400).json({ error: "From and To locations are required" });
    
    try {
        const fromId = await getPlaceId(from);
        const toId = await getPlaceId(to);
        if (!fromId || !toId) return res.status(400).json({ error: "Invalid place names" });
        
        const response = await axios.get(`https://${RAPIDAPI_HOST}/api/v1/flights/search-one-way`, {
            params: { fromId, toId, departDate, adults: "1", cabinClass: "economy", currency: "USD", market: "IN", locale: "en-US" },
            headers: { "x-rapidapi-key": RAPIDAPI_KEY, "x-rapidapi-host": RAPIDAPI_HOST }
        });
        
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch flight details" });
    }
});

// Fetch Hotel Data
app.get("/hotels", async (req, res) => {
    const { entityId } = req.query;
    if (!entityId) return res.status(400).json({ error: "Entity ID is required" });
    
    try {
        const response = await axios.get(`https://${RAPIDAPI_HOST}/api/v1/hotels/search`, {
            params: { entityId, rooms: "1", adults: "1", resultsPerPage: "15", page: "1", priceType: "PRICE_PER_NIGHT", currency: "USD", market: "US", locale: "en-US" },
            headers: { "x-rapidapi-key": RAPIDAPI_KEY, "x-rapidapi-host": RAPIDAPI_HOST }
        });
        
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch hotel details" });
    }
});

// Helper function to get Place ID
async function getPlaceId(query) {
    try {
        const response = await axios.get(`https://${RAPIDAPI_HOST}/api/v1/flights/auto-complete`, {
            params: { query, market: "IN", locale: "en-US" },
            headers: { "x-rapidapi-key": RAPIDAPI_KEY, "x-rapidapi-host": RAPIDAPI_HOST }
        });
        return response.data.data.length > 0 ? response.data.data[0].id : null;
    } catch {
        return null;
    }
}

app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
