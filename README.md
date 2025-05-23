# SoilMate 🌿 Farming Assistant

SoilMate is a MERN stack web application designed as an intelligent farming assistant for Indian farmers. It helps them choose the best crops based on manually entered or live soil and weather data fetched from ThingSpeak, providing recommendations in multiple languages using the Gemini API.

## 🚀 Live Deployment

You can try out SoilMate live here:

- 🌐 **Frontend (React App)**: [https://fanciful-flan-5735d8.netlify.app](https://fanciful-flan-5735d8.netlify.app)
- 🛠️ **Backend (Express API)**: [https://soil-mate.onrender.com](https://soil-mate.onrender.com)

## 🌟 Features

### Frontend (React.js - Vite)
-   **Manual Data Entry:** Allows users to input:
    -   🌡️ Temperature (°C)
    -   💧 Humidity (%)
    -   ⚗️ Soil pH Level
    -   🌱 Soil Moisture (%)
    -   🌾 Nitrogen (N) (kg/ha)
    -   🧪 Phosphorus (P) (kg/ha)
    -   🔋 Potassium (K) (kg/ha)
-   **Real-time Data Fetching:** Integrates with [ThingSpeak](https://thingspeak.com/) to fetch live sensor data using a Channel ID and Read API Key.
-   **Language Selection:** Users can choose the response language for farming recommendations from:
    -   English
    -   Hindi (हिन्दी)
    -   Kannada (ಕನ್ನಡ)
-   **Dynamic Recommendations:** Submits data to the backend and displays crop recommendations, pest/disease risks, and farming tips.
-   **User-Friendly Interface:** Simple and intuitive UI for easy data input and clear display of advice.
-   **Loading & Error States:** Provides feedback to the user during data fetching and submission.

### Backend (Node.js + Express.js)
-   **Data Handling:** Accepts both manually entered data and data fetched via the frontend from ThingSpeak.
-   **Gemini API Integration:** Constructs a detailed prompt with the soil/weather data and selected language, then queries the Gemini API (gemini-2.0-flash model) for farming advice.
-   **Formatted Output:** Returns a structured response including:
    -   ✅ 2–3 recommended crop names (bold, large headline)
    -   🐛 Common pest/disease risks for these crops
    -   💡 Simple farming tips (watering, fertilizer, etc.)
-   **Multi-language Support:** Delivers recommendations in the language selected by the user on the frontend.
-   **Environment Variable Management:** Uses `.env` files for secure configuration of API keys and port numbers.
-   **CORS Enabled:** Allows cross-origin requests from the frontend.

## 🛠️ Tech Stack

-   **Frontend:** React.js (with Vite for tooling), Axios
-   **Backend:** Node.js, Express.js, Axios
-   **API:** Google Gemini API, ThingSpeak API
-   **Environment Management:** `dotenv` (backend), Vite's `import.meta.env` (frontend)

## 📋 Prerequisites

-   Node.js and npm (or yarn) installed.
-   A Google Gemini API Key.
-   A ThingSpeak account with a channel set up (or use the default provided ones).
    -   The application is pre-configured to use:
        -   ThingSpeak Channel ID: `2783628`
        -   ThingSpeak Read API Key: `3Y6EMRRP3MY6Z7PP`
        -   This channel has fields mapped as:
            - Field 1: Temperature
            - Field 2: Humidity
            - Field 3: pH
            - Field 4: Soil Moisture
            - Field 5: Nitrogen
            - Field 6: Phosphorus
            - Field 7: Potassium

## 🚀 Setup and Installation

The project is structured into two main parts: `frontend` and `backend`.

### 1. Backend Setup (Node.js + Express)

   a.  **Clone/Download:**
       Get the backend code into a directory (e.g., `soilmate-backend`).

   b.  **Navigate to Backend Directory:**
       ```bash
       cd soilmate-backend
       ```

   c.  **Install Dependencies:**
       ```bash
       npm install
       ```
       This will install `express`, `axios`, `dotenv`, and `cors`.

   d.  **Create `.env` File:**
       In the `soilmate-backend` root directory, create a `.env` file and add your Gemini API Key and desired port:
       ```env
       GEMINI_API_KEY=YOUR_GEMINI_API_KEY_HERE 
       PORT=5001
       ```
       Replace `YOUR_GEMINI_API_KEY_HERE` with your actual key. The one provided in the initial prompt (`AIzaSyCFR4Sh1cfWdDUXdyT7BgXgeSUVPMWTUko`) can be used for testing if still valid.

   e.  **Start the Backend Server:**
       ```bash
       node server.js
       ```
       The backend server should now be running on `http://localhost:5001` (or the port you specified). You'll see console logs indicating the server status and if the `GEMINI_API_KEY` was loaded.

### 2. Frontend Setup (React.js - Vite)

   a.  **Clone/Download:**
       Get the frontend code into a directory (e.g., `soilmate-frontend`). If you used `create-react-app` or `create-vite` initially, ensure the `App.jsx` and other necessary files are in the `src` folder.

   b.  **Navigate to Frontend Directory:**
       ```bash
       cd soilmate-frontend
       ```

   c.  **Install Dependencies:**
       ```bash
       npm install
       ```
       This will install React, ReactDOM, Axios, and other necessary packages for a Vite project.

   d.  **Create `.env` File:**
       In the `soilmate-frontend` root directory, create a `.env` file. **Note the `VITE_` prefix for Vite projects.**
       ```env
       VITE_THINGSPEAK_CHANNEL_ID=2783628
       VITE_THINGSPEAK_API_KEY=3Y6EMRRP3MY6Z7PP
       VITE_BACKEND_URL=http://localhost:5001
       ```
       - You can change `VITE_THINGSPEAK_CHANNEL_ID` and `VITE_THINGSPEAK_API_KEY` if you use your own ThingSpeak channel.
       - Ensure `VITE_BACKEND_URL` matches where your backend server is running.

   e.  **Start the Frontend Development Server:**
       ```bash
       npm run dev 
       ```
       (or `npm start` if you are using a Create React App based setup, but the provided code is more aligned with Vite's `.jsx` and `import.meta.env`).
       The frontend application should open in your browser, typically at `http://localhost:5173` (for Vite) or `http://localhost:3000`.

## ⚙️ How to Use

1.  Ensure both the backend and frontend servers are running.
2.  Open the frontend application in your browser.
3.  **Option 1: Manual Data Entry**
    -   Fill in the values for temperature, humidity, pH, soil moisture, nitrogen, phosphorus, and potassium.
4.  **Option 2: Fetch from ThingSpeak**
    -   Click the "📡 Fetch from ThingSpeak" button. This will populate the input fields with the latest data from the configured ThingSpeak channel.
5.  **Select Language:**
    -   Choose your preferred language for the recommendation from the dropdown menu.
6.  **Get Advice:**
    -   Click the "💡 Get Farming Advice" button.
7.  The application will send the data to the backend, which then queries the Gemini API. The received farming recommendations will be displayed on the page.

## 📄 API Endpoint (Backend)

-   **POST** `/api/recommend`
    -   **Description:** Receives soil and weather data, queries the Gemini API, and returns farming recommendations.
    -   **Request Body (JSON):**
        ```json
        {
          "temperature": "28.5", // String or Number
          "humidity": "70",    // String or Number
          "ph": "6.8",         // String or Number
          "soilMoisture": "55",// String or Number
          "nitrogen": "120",   // String or Number
          "phosphorus": "60",  // String or Number
          "potassium": "90",   // String or Number
          "selectedLanguage": "English" // "English", "Hindi", or "Kannada"
        }
        ```
        *Note: At least one of the data fields (temperature, humidity, etc.) must be provided.*
    -   **Success Response (JSON):**
        ```json
        {
          "recommendation": "✅ **Recommended Crops: Tomato, Chili**\n\n🐛 **Pest/Disease Risks:**\n* **Tomato:** Early blight, fruit worms.\n* **Chili:** Aphids, thrips, fruit rot.\n\n💡 **Farming Tips:**\n1.  Ensure consistent watering for tomatoes, especially during fruiting.\n2.  Use neem oil spray for pest control on chili plants."
        }
        ```
    -   **Error Response (JSON):**
        ```json
        {
          "error": "Error message describing the issue."
        }
        ```
        (Status codes: 400 for bad request, 500 for server/API errors)

## 💡 Gemini Prompt Structure

The backend uses the following prompt structure (example values) when querying the Gemini API:


You are an intelligent Indian farming assistant helping local farmers.

Here is the real-time soil and environmental data:

🌡️ Temperature: 28.5 °C
💧 Humidity: 70 %
⚗️ Soil pH Level: 6.8
🌱 Soil Moisture: 55 %
🌾 Nitrogen (N): 120 kg/ha
🧪 Phosphorus (P): 60 kg/ha
🔋 Potassium (K): 90 kg/ha

The user has selected this language for the response: English

Based on this data, generate a short and helpful farming recommendation in the selected language.

🔷 Output Format:

✅ Show 2 to 3 crop names in large bold text (focus on crop names)

🐛 List any pest/disease risks for these crops

💡 Give 1–2 farming tips (watering, fertilizer, etc.)

Keep response short, friendly, and easy to understand. Use emojis if needed. Only return the prediction in the selected language.


