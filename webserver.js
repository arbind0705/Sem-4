import express from 'express';
import cors from 'cors';
import { countries, places, travelTypes } from './src/data/dummyData.js';

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// Get countries list
app.get('/countries', (req, res) => {
    res.json({
        success: true,
        data: countries
    });
});

// Get places for a specific country
app.get('/places', (req, res) => {
    const { country } = req.query;
    const countryPlaces = places[country] || [];
    res.json({
        success: true,
        data: countryPlaces
    });
});

// Get travel type details
app.get('/travel-type/:type', (req, res) => {
    const { type } = req.params;
    const typeDetails = travelTypes[type];
    
    if (!typeDetails) {
        return res.status(404).json({
            success: false,
            error: 'Travel type not found'
        });
    }

    res.json({
        success: true,
        data: typeDetails
    });
});

// Process travel preferences
app.post('/process-preferences', (req, res) => {
    const preferences = req.body;
    
    // Here we'll later add the C++ integration
    // For now, return a mock optimization
    const result = {
        ...preferences,
        optimizedCost: Math.floor(preferences.budget * 0.9),
        suggestedDays: Math.min(preferences.days, 7),
        recommendedPlaces: places[preferences.country]
            .sort((a, b) => b.rating - a.rating)
            .slice(0, 3)
    };

    res.json({
        success: true,
        data: result
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Backend server running on http://localhost:${port}`);
});
