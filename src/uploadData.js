const { database } = require("./firebase");
const { ref, set } = require("firebase/database");
const dummyData = require("./data/dummy_data.json");


const uploadDataToFirebase = () => {  
    const placesRef = ref(database, "places/"); // Store data under "places"

    set(placesRef, dummyData)
        .then(() => console.log("Data uploaded successfully!"))
        .catch((error) => console.error("Error uploading data:", error));
};

uploadDataToFirebase();
