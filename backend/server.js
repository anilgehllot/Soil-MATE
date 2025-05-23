// // server.js
// const express = require('express');
// const axios = require('axios');
// const dotenv = require('dotenv');
// const cors = require('cors');

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 5001; // Changed port to avoid conflict with React default

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Environment Variables Validation (Basic)
// const { GEMINI_API_KEY, THINGSPEAK_CHANNEL_ID, THINGSPEAK_API_KEY } = process.env;

// if (!GEMINI_API_KEY) {
//     console.error("ERROR: GEMINI_API_KEY is not defined in .env file");
//     process.exit(1);
// }
// // Note: ThingSpeak keys are only essential if auto-fetch is used.
// // Add more robust validation as needed.

// // Helper function to format the prompt
// const formatGeminiPrompt = (data) => {
//     return `You are an intelligent Indian farming assistant helping local farmers.

// Here is the real-time soil and environmental data:

// 🌡️ Temperature: ${data.temperature || 'N/A'} °C
// 💧 Humidity: ${data.humidity || 'N/A'} %
// 🌱 Soil Moisture: ${data.soilMoisture || 'N/A'} %
// ⚗️ Soil pH Level: ${data.ph || 'N/A'}
// 🌾 Nitrogen (N): ${data.nitrogen || 'N/A'} ppm (or kg/ha)
// 🧪 Phosphorus (P): ${data.phosphorus || 'N/A'} ppm (or kg/ha)
// 🔋 Potassium (K): ${data.potassium || 'N/A'} ppm (or kg/ha)

// Based on this data, please provide the following in a friendly Hinglish tone with emojis, ensuring each section starts exactly as written below:

// ✅ Top 1 suitable crops to grow in this condition
// give me crop name juts one crop name 
// 🌿 crop name which is best sutiable 
// give me crop name 
// 🐛 Possible plant diseases or pest risks

// 💡 Useful farming tips and precautions

// Your response should be short, friendly, and easy for Indian farmers to understand. Each section should be clearly distinct IN ENGLISH .`;
// };

// // API Route: /api/predict
// app.post('/api/predict', async (req, res) => {
//     try {
//         let soilData = req.body.manualData;
//         const fetchFromThingSpeak = req.body.fetchFromThingSpeak || false;

//         if (fetchFromThingSpeak) {
//             if (!THINGSPEAK_CHANNEL_ID || !THINGSPEAK_API_KEY) {
//                 return res.status(400).json({ error: 'ThingSpeak Channel ID or API Key not configured on the server.' });
//             }
//             console.log('Fetching data from ThingSpeak...');
//             // ThingSpeak API URL to get the latest feed
//             const thingSpeakURL = `https://api.thingspeak.com/channels/${THINGSPEAK_CHANNEL_ID}/feeds.json?api_key=${THINGSPEAK_API_KEY}&results=1`;
            
//             const response = await axios.get(thingSpeakURL);
            
//             if (response.data && response.data.feeds && response.data.feeds.length > 0) {
//                 const latestFeed = response.data.feeds[0];
//                 // IMPORTANT: Adjust field numbers (field1, field2, etc.) based on your ThingSpeak channel setup
//                 soilData = {
//                     temperature: latestFeed.field1 || null, // Example: field1 is temperature
//                     humidity: latestFeed.field2 || null,    // Example: field2 is humidity
//                     soilMoisture: latestFeed.field3 || null,// Example: field3 is soil moisture
//                     ph: latestFeed.field4 || null,          // Example: field4 is pH
//                     nitrogen: latestFeed.field5 || null,    // Example: field5 is Nitrogen
//                     phosphorus: latestFeed.field6 || null,  // Example: field6 is Phosphorus
//                     potassium: latestFeed.field7 || null,   // Example: field7 is Potassium
//                     // Add more fields as needed
//                 };
//                 console.log('Data fetched from ThingSpeak:', soilData);
//             } else {
//                 console.error('No data received from ThingSpeak or empty feed.');
//                 return res.status(500).json({ error: 'Failed to fetch valid data from ThingSpeak. The feed might be empty or the channel misconfigured.' });
//             }
//         } else if (!soilData) {
//              return res.status(400).json({ error: 'No manual data provided and not requested to fetch from ThingSpeak.' });
//         }


//         if (!soilData || Object.keys(soilData).length === 0) {
//             return res.status(400).json({ error: 'No soil data available to make a prediction.' });
//         }
        
//         const prompt = formatGeminiPrompt(soilData);
//         console.log('Formatted Prompt for Gemini:', prompt);

//         // Call Gemini API
//         // Using gemini-2.0-flash as per guidelines
//         const geminiApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;
        
//         const geminiPayload = {
//             contents: [{ parts: [{ text: prompt }] }],
//             // Optional: Add generationConfig if needed for more control
//             // generationConfig: {
//             //   temperature: 0.7,
//             //   topK: 1,
//             //   topP: 1,
//             //   maxOutputTokens: 2048,
//             // }
//         };

//         console.log('Calling Gemini API...');
//         const geminiResponse = await axios.post(geminiApiUrl, geminiPayload, {
//             headers: { 'Content-Type': 'application/json' }
//         });

//         if (geminiResponse.data && geminiResponse.data.candidates && geminiResponse.data.candidates.length > 0 &&
//             geminiResponse.data.candidates[0].content && geminiResponse.data.candidates[0].content.parts &&
//             geminiResponse.data.candidates[0].content.parts.length > 0) {
            
//             const predictionText = geminiResponse.data.candidates[0].content.parts[0].text;
//             console.log('Received response from Gemini API.');
//             res.json({ prediction: predictionText, timestamp: new Date().toISOString(), inputData: soilData });
//         } else {
//             console.error('Unexpected response structure from Gemini API:', geminiResponse.data);
//             throw new Error('Failed to get a valid response from Gemini API. The response structure was not as expected.');
//         }

//     } catch (error) {
//         console.error('Error in /api/predict:', error.message);
//         if (error.response) {
//             // Axios error with response from external API
//             console.error('Error Data:', error.response.data);
//             console.error('Error Status:', error.response.status);
//             res.status(error.response.status || 500).json({ 
//                 error: 'Error communicating with external services.', 
//                 details: error.response.data 
//             });
//         } else if (error.request) {
//             // Axios error where request was made but no response received
//             console.error('Error Request:', error.request);
//             res.status(500).json({ error: 'No response received from external service.' });
//         } else {
//             // Other errors
//             res.status(500).json({ error: 'Internal Server Error', details: error.message });
//         }
//     }
// });

// // Optional: Basic route for checking if server is up
// app.get('/', (req, res) => {
//     res.send('Smart Farming Advisor Backend is running!');
// });


// app.listen(PORT, () => {
//     console.log(`Server running on http://localhost:${PORT}`);
// });


//23 

// SoilMate Backend (Node.js + Express)
// File: server.js
// Ensure you have a .env file in your backend's root directory (backend/) with:
// GEMINI_API_KEY=AIzaSyCFR4Sh1cfWdDUXdyT7BgXgeSUVPMWTUko (Replace with your actual key if different)
// PORT=5001

const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config(); // Loads .env file contents into process.env

const app = express();
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Middleware to parse JSON bodies

const PORT = process.env.PORT || 5001;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
    console.error("FATAL ERROR: GEMINI_API_KEY is not defined in .env file.");
    process.exit(1); // Exit if API key is not set
}

// Function to construct the prompt for Gemini
const getGeminiPrompt = (data, selectedLanguage) => {
  return `You are an intelligent Indian farming assistant helping local farmers.

Here is the real-time soil and environmental data:

🌡️ Temperature: ${data.temperature || 'N/A'} °C
💧 Humidity: ${data.humidity || 'N/A'} %
⚗️ Soil pH Level: ${data.ph || 'N/A'}
🌱 Soil Moisture: ${data.soilMoisture || 'N/A'} %
🌾 Nitrogen (N): ${data.nitrogen || 'N/A'} kg/ha
🧪 Phosphorus (P): ${data.phosphorus || 'N/A'} kg/ha
🔋 Potassium (K): ${data.potassium || 'N/A'} kg/ha

The user has selected this language for the response: **${selectedLanguage}**

Based on this data, generate a short and helpful farming recommendation in the selected language.

🔷 Output Format:
1. ✅ Show 2 to 3 crop names in large bold text (focus on crop names)
2. 🐛 List any pest/disease risks for these crops
3. 💡 Give 1–2 farming tips (watering, fertilizer, etc.)

Keep response **short, friendly**, and **easy to understand**. Use emojis if needed. Only return the prediction in the selected language.
`;
};

// API endpoint to get recommendations
app.post('/api/recommend', async (req, res) => {
  const {
    temperature,
    humidity,
    ph,
    soilMoisture,
    nitrogen,
    phosphorus,
    potassium,
    selectedLanguage
  } = req.body;

  // Basic validation
  if (!selectedLanguage) {
    return res.status(400).json({ error: 'Selected language is required.' });
  }
  
  // Check if at least one data field is present
  const hasSomeData = [temperature, humidity, ph, soilMoisture, nitrogen, phosphorus, potassium].some(val => val !== undefined && val !== '');
  if (!hasSomeData) {
    return res.status(400).json({ error: 'At least one soil/weather data point is required.' });
  }


  const promptText = getGeminiPrompt({
    temperature, humidity, ph, soilMoisture, nitrogen, phosphorus, potassium
  }, selectedLanguage);

  try {
    console.log('Sending request to Gemini API...');
    const geminiApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;
    
    const geminiPayload = {
      contents: [{
        parts: [{
          text: promptText
        }]
      }]
    };

    const geminiResponse = await axios.post(geminiApiUrl, geminiPayload, {
      headers: { 'Content-Type': 'application/json' }
    });

    if (geminiResponse.data &&
        geminiResponse.data.candidates &&
        geminiResponse.data.candidates.length > 0 &&
        geminiResponse.data.candidates[0].content &&
        geminiResponse.data.candidates[0].content.parts &&
        geminiResponse.data.candidates[0].content.parts.length > 0) {
      
      const recommendationText = geminiResponse.data.candidates[0].content.parts[0].text;
      console.log('Received recommendation from Gemini:', recommendationText);
      res.json({ recommendation: recommendationText });
    } else {
      console.error('Unexpected response structure from Gemini API:', geminiResponse.data);
      res.status(500).json({ error: 'Failed to parse recommendation from Gemini API. Unexpected response structure.' });
    }

  } catch (error) {
    console.error('Error calling Gemini API:', error.response ? error.response.data : error.message);
    if (error.response && error.response.data && error.response.data.error) {
        // Forward Gemini's specific error if available
        res.status(500).json({ error: `Gemini API Error: ${error.response.data.error.message}` });
    } else {
        res.status(500).json({ error: 'Failed to get recommendation from Gemini API.' });
    }
  }
});

app.listen(PORT, () => {
  console.log(`SoilMate backend server running on port ${PORT}`);
  console.log(`GEMINI_API_KEY Loaded: ${GEMINI_API_KEY ? 'Yes' : 'No - Check .env file!'}`);
});

// To run this Node.js backend:
// 1. Save this code as server.js in a new Node.js project directory (e.g., backend/).
// 2. Create a .env file in the root of this backend project (backend/.env) with:
//    GEMINI_API_KEY=AIzaSyCFR4Sh1cfWdDUXdyT7BgXgeSUVPMWTUko (Use your actual key)
//    PORT=5001
// 3. Initialize npm and install dependencies:
//    cd backend
//    npm init -y
//    npm install express axios dotenv cors
// 4. Start the server: node server.js
