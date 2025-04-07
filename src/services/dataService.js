import destinationsData from '../data/destinations_new.json';
import CppService from './cppService';

// Service to handle all data operations
class DataService {
    // Get list of all countries from destinations.json
    async getCountries() {
        return new Promise((resolve, reject) => {
            try {
                console.log("Fetching countries from data...");
                const countries = new Set();
                
                // Get countries from metadata
                const completedCountries = destinationsData.metadata.current_progress.completed_countries;
                const pendingCountries = destinationsData.metadata.current_progress.pending
                    .filter(country => !country.includes("Rest of") && !country.includes("Other") && !country.includes("All"));
                
                // Combine all countries
                [...completedCountries, ...pendingCountries].forEach(country => {
                    countries.add(country);
                });

                const countryList = Array.from(countries).map(name => ({
                    id: name.toLowerCase().replace(/\s+/g, '-'),
                    name: name
                }));
                console.log("Successfully fetched countries:", countryList);
                resolve({ data: countryList });
            } catch (error) {
                console.error("Error in getCountries:", error);
                reject(error);
            }
        });
    }

    // Get places for a specific country
    async getPlaces(country) {
        return new Promise((resolve, reject) => {
            try {
                console.log("Fetching places for country:", country.name);
                const places = [];
                
                // Find the country in destinations
                const regions = destinationsData.destinations;
                for (const region of Object.values(regions)) {
                    const countryData = Object.values(region).find(c => c.name === country.name);
                    if (countryData && countryData.cities) {
                        for (const city of Object.values(countryData.cities)) {
                            if (city.places) {
                                places.push(...city.places.map(place => ({
                                    id: place.id,
                                    name: place.name,
                                    rating: place.rating || 0,
                                    cost: place.price_range || "$$",
                                    visitDuration: place.visit_duration || "1-2 hours",
                                    activities: place.activities || []
                                })));
                            }
                        }
                        break;
                    }
                }
                
                console.log("Successfully fetched places:", places);
                resolve({ data: places });
            } catch (error) {
                console.error("Error in getPlaces:", error);
                reject(error);
            }
        });
    }

    // Get activities for selected places
    async getActivities(places) {
        return new Promise((resolve, reject) => {
            try {
                console.log("Fetching activities for places:", places);
                const activities = new Set();
                
                // Get activities from all selected places
                const regions = destinationsData.destinations;
                for (const region of Object.values(regions)) {
                    for (const country of Object.values(region)) {
                        if (country.cities) {
                            for (const city of Object.values(country.cities)) {
                                if (city.places) {
                                    for (const place of city.places) {
                                        if (places.some(p => p.id === place.id)) {
                                            if (place.activities) {
                                                place.activities.forEach(activity => activities.add(activity));
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                
                const activitiesArray = Array.from(activities);
                console.log("Successfully fetched activities:", activitiesArray);
                resolve({ data: activitiesArray });
            } catch (error) {
                console.error("Error in getActivities:", error);
                reject(error);
            }
        });
    }

    // Process travel preferences
    async processPreferences(preferences) {
        return new Promise((resolve, reject) => {
            try {
                console.log("Processing preferences:", preferences);
                
                // Use CppService to process the travel plan
                CppService.processTravelPlan(preferences)
                    .then(result => {
                        console.log("Successfully processed preferences:", result);
                        resolve(result);
                    })
                    .catch(error => {
                        console.error("Error in processPreferences:", error);
                        reject(error);
                    });
            } catch (error) {
                console.error("Error in processPreferences:", error);
                reject(error);
            }
        });
    }
}

export default new DataService(); 