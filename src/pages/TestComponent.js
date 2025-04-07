import React, { useEffect } from "react";
import { database } from "../firebase";
import { ref, set } from "firebase/database";

function TestComponent() {
  useEffect(() => {
    if (!database) {
      console.error("❌ Firebase Database is NOT initialized correctly!");
      return;
    }

    console.log("🔥 Firebase Database Object:", database); // Debugging

    const testRef = ref(database, "testData/");
    set(testRef, {
      message: "Hello, Firebase!",
      timestamp: Date.now(),
    })
      .then(() => console.log("✅ Data written successfully!"))
      .catch((error) => console.error("❌ Error writing to database:", error));
  }, []);

  return <h1>Testing Firebase...</h1>;
}

export default TestComponent;
