import destinationsData from '../data/destinations_new.json';

class CppService {
    constructor() {
        this.baseUrl = 'http://localhost:5000'; // Default port
    }

    // Set the server URL (call this when the server starts and reports its port)
    setServerUrl(port) {
        this.baseUrl = `http://localhost:${port}`;
        console.log('CppService server URL set to:', this.baseUrl);
    }

    // Convert price range to numeric value
    convertPriceRange(priceRange) {
        switch(priceRange) {
            case 'Free': return 0;
            case '$': return 20;
            case '$$': return 50;
            case '$$$': return 100;
            default: return 0;
        }
    }

    async processTravelPlan(preferences) {
        try {
            console.log('Processing travel plan with preferences:', preferences);
            
            // Validate required fields
            if (!preferences.countries || !Array.isArray(preferences.countries)) {
                throw new Error('Invalid preferences: countries must be an array');
            }

            // Prepare data for C++ backend
            const places = [];
            for (const country of preferences.countries) {
                // Find the country data in the destinations structure
                let countryData = null;
                for (const region of Object.values(destinationsData.destinations)) {
                    for (const countryInfo of Object.values(region)) {
                        if (countryInfo.name === country) {
                            countryData = countryInfo;
                            break;
                        }
                    }
                    if (countryData) break;
                }

                if (!countryData) {
                    console.warn(`No data found for country: ${country}`);
                    continue;
                }

                // Process each city's places
                for (const city of Object.values(countryData.cities)) {
                    for (const place of city.places) {
                        // Calculate priority based on whether it's in preferred places
                        const priority = preferences.places.includes(place.name) ? 1.0 : 0.5;
                        
                        // Convert activities to the required format
                        const activities = place.activities.map(activity => ({
                            name: activity,
                            cost: this.convertPriceRange(place.price_range)
                        }));

                        // Create sample hotels (since they're not in the original data)
                        const hotels = [
                            {
                                name: `${place.name} Luxury Hotel`,
                                rating: 4.5,
                                pricePerNight: 200
                            },
                            {
                                name: `${place.name} Budget Hotel`,
                                rating: 3.5,
                                pricePerNight: 100
                            }
                        ];

                        places.push({
                            name: place.name,
                            country: country,
                            activities: activities,
                            rating: parseFloat(place.rating),
                            priority: priority,
                            hotels: hotels
                        });
                    }
                }
            }

            // Prepare the complete input object for C++ backend
            const inputData = {
                budget: preferences.budget,
                days: preferences.days,
                selectedCountries: preferences.countries,
                preferredPlaces: preferences.places,
                places: places
            };

            console.log('Sending data to C++ backend:', inputData);

            try {
                const response = await fetch(`${this.baseUrl}/process-travel-plan`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(inputData)
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('Server response error:', {
                        status: response.status,
                        statusText: response.statusText,
                        body: errorText
                    });
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const result = await response.json();
                console.log('Received result from C++ backend:', result);
                return { data: result };  // Wrap the result in a data property to match the expected format
            } catch (fetchError) {
                console.error('Fetch error details:', {
                    message: fetchError.message,
                    url: `${this.baseUrl}/process-travel-plan`,
                    type: fetchError.type
                });
                throw new Error(`Failed to connect to server at ${this.baseUrl}. Please make sure the server is running.`);
            }

        } catch (error) {
            console.error('Error in CppService:', error);
            throw error;
        }
    }
}

export default new CppService(); 