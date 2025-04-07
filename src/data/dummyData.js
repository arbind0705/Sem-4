// Dummy data for the travel planning app
export const countries = [
    {
        id: 1,
        name: "Japan",
        region: "Asia",
        popularCities: ["Tokyo", "Kyoto", "Osaka"],
        currency: "JPY",
        language: "Japanese"
    },
    {
        id: 2,
        name: "France",
        region: "Europe",
        popularCities: ["Paris", "Lyon", "Nice"],
        currency: "EUR",
        language: "French"
    },
    {
        id: 3,
        name: "India",
        region: "Asia",
        popularCities: ["Delhi", "Mumbai", "Bangalore"],
        currency: "INR",
        language: "Hindi"
    }
];

export const places = {
    "Japan": [
        {
            id: 1,
            name: "Tokyo Tower",
            city: "Tokyo",
            type: "Tourist Attraction",
            cost: 900,
            rating: 4.5,
            visitDuration: 3
        },
        {
            id: 2,
            name: "Senso-ji Temple",
            city: "Tokyo",
            type: "Cultural",
            cost: 0,
            rating: 4.7,
            visitDuration: 2
        },
        {
            id: 3,
            name: "Kyoto Imperial Palace",
            city: "Kyoto",
            type: "Historical",
            cost: 0,
            rating: 4.6,
            visitDuration: 4
        }
    ],
    "France": [
        {
            id: 4,
            name: "Eiffel Tower",
            city: "Paris",
            type: "Tourist Attraction",
            cost: 1500,
            rating: 4.8,
            visitDuration: 3
        },
        {
            id: 5,
            name: "Louvre Museum",
            city: "Paris",
            type: "Museum",
            cost: 1200,
            rating: 4.9,
            visitDuration: 5
        },
        {
            id: 6,
            name: "Nice Beach",
            city: "Nice",
            type: "Nature",
            cost: 0,
            rating: 4.5,
            visitDuration: 4
        }
    ],
    "India": [
        {
            id: 7,
            name: "Taj Mahal",
            city: "Agra",
            type: "Historical",
            cost: 1100,
            rating: 4.9,
            visitDuration: 4
        },
        {
            id: 8,
            name: "Gateway of India",
            city: "Mumbai",
            type: "Monument",
            cost: 0,
            rating: 4.4,
            visitDuration: 2
        },
        {
            id: 9,
            name: "Bangalore Palace",
            city: "Bangalore",
            type: "Historical",
            cost: 500,
            rating: 4.2,
            visitDuration: 3
        }
    ]
};

export const travelTypes = {
    "Domestic": {
        maxDistance: 1000,
        visaRequired: false,
        averageCost: 50000
    },
    "International": {
        maxDistance: 10000,
        visaRequired: true,
        averageCost: 200000
    },
    "Inter-Country": {
        maxDistance: 5000,
        visaRequired: true,
        averageCost: 150000
    }
}; 