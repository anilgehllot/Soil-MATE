// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import './App.css'; // Import the CSS file

// // Import icons from lucide-react
// import { Leaf, Thermometer, Droplets, Sprout, TestTube, Atom, AlertTriangle, Server, CloudCog, LeafIcon, Send, CheckCircle, AlertCircle, Info, Zap, Clock } from 'lucide-react';

// // Base URL for your backend API
// const API_BASE_URL = 'http://localhost:5001/api'; // Ensure this matches your backend

// // --- InputField Component ---
// const InputField = ({ id, label, value, onChange, type = "number", placeholder, Icon, unit }) => (
//   <div className="input-field-container">
//     <label htmlFor={id} className="input-label">
//       {Icon && <Icon size={18} className="input-icon" />} {label} {unit && `(${unit})`}
//     </label>
//     <input
//       type={type}
//       id={id}
//       name={id}
//       value={value}
//       onChange={onChange}
//       placeholder={placeholder}
//       className="input-element"
//       step={type === "number" ? "any" : undefined}
//       // For text inputs that might represent numbers (like pH), allow decimals
//       pattern={type === "number" ? "[0-9]*[.]?[0-9]*" : undefined}
//     />
//   </div>
// );

// // --- DataInputForm Component ---
// const DataInputForm = ({ onSubmit, isLoading, setError }) => {
//   const [formData, setFormData] = useState({
//     temperature: '',
//     humidity: '',
//     soilMoisture: '',
//     ph: '',
//     nitrogen: '',
//     phosphorus: '',
//     potassium: '',
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     // Allow empty string or valid numbers (including decimals for relevant fields)
//     if (value === "" || /^-?\d*\.?\d*$/.test(value) || ['nitrogen', 'phosphorus', 'potassium'].includes(name)) {
//         // For NPK, allow alphanumeric for units like "120 kg/ha"
//          if (['nitrogen', 'phosphorus', 'potassium'].includes(name) && !/^-?\d*\.?\d*\s*(ppm|kg\/ha)?$/i.test(value) && value !== "") {
//             // If it's NPK and not empty and not matching pattern, don't update (or show specific validation)
//             // This is a simple check; more robust validation could be added
//          }
//          setFormData(prev => ({ ...prev, [name]: value }));
//     } else if (name === "ph" && /^\d{1,2}(\.\d{1,2})?$/.test(value)) {
//          setFormData(prev => ({ ...prev, [name]: value }));
//     }

//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const filledValues = Object.values(formData).filter(v => v && v.toString().trim() !== '');
//     if (filledValues.length === 0) {
//       if (setError) {
//         setError("Please fill in at least one soil parameter for manual entry, or use the ThingSpeak fetch option.");
//       } else {
//         console.warn("Please fill in at least one soil parameter for manual entry.");
//       }
//       return;
//     }
//     // Convert to numbers where appropriate, or keep as string if units are included (e.g., "100 ppm")
//     const processedFormData = {};
//     for (const key in formData) {
//         const value = formData[key];
//         if (value && value.toString().trim() !== '') {
//             // If it's a NPK value that might have units, keep as string
//             if (['nitrogen', 'phosphorus', 'potassium'].includes(key) && isNaN(parseFloat(value))) {
//                 processedFormData[key] = value.trim();
//             } else if (value.toString().trim() === '') {
//                  processedFormData[key] = ''; // Keep empty strings as is
//             }
//             else {
//                 // Otherwise, try to parse as float
//                 const num = parseFloat(value);
//                 processedFormData[key] = isNaN(num) ? value.trim() : num;
//             }
//         } else {
//             processedFormData[key] = ''; // Send empty string for not filled optional values
//         }
//     }
//     if (setError) setError(null);
//     onSubmit(processedFormData); // Submit the processed data
//   };

//   return (
//     <form onSubmit={handleSubmit} className="data-input-form">
//       <h2 className="form-title">Enter Soil & Environment Data Manually</h2>
//       <div className="form-grid">
//         <InputField id="temperature" label="Temperature" value={formData.temperature} onChange={handleChange} placeholder="e.g., 25" Icon={Thermometer} unit="°C" />
//         <InputField id="humidity" label="Humidity" value={formData.humidity} onChange={handleChange} placeholder="e.g., 60" Icon={Droplets} unit="%" />
//         <InputField id="soilMoisture" label="Soil Moisture" value={formData.soilMoisture} onChange={handleChange} placeholder="e.g., 40" Icon={Sprout} unit="%" />
//         <InputField id="ph" label="Soil pH Level" value={formData.ph} onChange={handleChange} placeholder="e.g., 6.5" Icon={TestTube} type="text" />
//         <InputField id="nitrogen" label="Nitrogen (N)" value={formData.nitrogen} onChange={handleChange} placeholder="e.g., 120 or 120 ppm" Icon={Atom} unit="ppm or kg/ha" type="text"/>
//         <InputField id="phosphorus" label="Phosphorus (P)" value={formData.phosphorus} onChange={handleChange} placeholder="e.g., 50 or 50 ppm" Icon={LeafIcon} unit="ppm or kg/ha" type="text"/>
//         <InputField id="potassium" label="Potassium (K)" value={formData.potassium} onChange={handleChange} placeholder="e.g., 150 or 150 ppm" Icon={Atom} unit="ppm or kg/ha" type="text"/>
//       </div>
//       <button
//         type="submit"
//         disabled={isLoading}
//         className="submit-button"
//       >
//         <Send size={20} className="button-icon" />
//         Get Farming Advice
//       </button>
//     </form>
//   );
// };

// // --- SectionCard Component ---
// const SectionCard = ({ title, content, Icon, iconColorClass, bgColorClass, borderColorClass }) => {
//   if (!content || content.trim() === '') return null;

//   // Improved content parsing: split by newline, then map to <p> tags,
//   // handling potential markdown-like list items (*, -) by adding a small indent.
//   const contentLines = content.split('\n').map((line, index) => {
//     const trimmedLine = line.trim();
//     if (trimmedLine.startsWith('* ') || trimmedLine.startsWith('- ')) {
//       return <p key={index} style={{ marginLeft: '15px' }}>• {trimmedLine.substring(2)}</p>;
//     }
//     if (trimmedLine.startsWith('1. ') || trimmedLine.startsWith('2. ') || trimmedLine.startsWith('3. ') || trimmedLine.startsWith('4. ') || trimmedLine.startsWith('5. ')) {
//         return <p key={index} style={{ marginLeft: '10px' }}>{trimmedLine}</p>;
//     }
//     return <p key={index}>{line}</p>;
//   });

//   return (
//     <div className={`section-card ${bgColorClass} ${borderColorClass}`}>
//       <h3 className={`section-title ${iconColorClass}`}>
//         {Icon && <Icon size={24} className="section-icon" />}
//         {title}
//       </h3>
//       <div className="section-content">
//         {contentLines}
//       </div>
//     </div>
//   );
// };

// // --- InputDataDisplay Component ---
// const InputDataDisplay = ({ data }) => {
//     if (!data) return null;

//     const formatTimestamp = (isoString) => {
//         if (!isoString) return 'N/A';
//         try {
//             return new Date(isoString).toLocaleString();
//         } catch (e) {
//             return isoString; // Fallback if parsing fails
//         }
//     };

//     const displayItems = [
//         { label: "Temperature", value: data.temperature, unit: "°C", Icon: Thermometer },
//         { label: "Humidity", value: data.humidity, unit: "%", Icon: Droplets },
//         { label: "Soil Moisture", value: data.soilMoisture, unit: "%", Icon: Sprout },
//         { label: "Soil pH", value: data.ph, Icon: TestTube },
//         { label: "Nitrogen (N)", value: data.nitrogen, unit: data.nitrogen && (data.nitrogen.toString().toLowerCase().includes('kg/ha') ? 'kg/ha' : (data.nitrogen.toString().toLowerCase().includes('ppm') ? 'ppm' : (data.nitrogen && data.nitrogen.toString().trim() !== '' && !isNaN(parseFloat(data.nitrogen)) ? 'ppm' : ''))), Icon: Atom },
//         { label: "Phosphorus (P)", value: data.phosphorus, unit: data.phosphorus && (data.phosphorus.toString().toLowerCase().includes('kg/ha') ? 'kg/ha' : (data.phosphorus.toString().toLowerCase().includes('ppm') ? 'ppm' : (data.phosphorus && data.phosphorus.toString().trim() !== '' && !isNaN(parseFloat(data.phosphorus)) ? 'ppm' : ''))), Icon: LeafIcon },
//         { label: "Potassium (K)", value: data.potassium, unit: data.potassium && (data.potassium.toString().toLowerCase().includes('kg/ha') ? 'kg/ha' : (data.potassium.toString().toLowerCase().includes('ppm') ? 'ppm' : (data.potassium && data.potassium.toString().trim() !== '' && !isNaN(parseFloat(data.potassium)) ? 'ppm' : ''))), Icon: Atom },
//     ].filter(item => item.value !== null && item.value !== undefined && item.value.toString().trim() !== '');

//     const sourceText = data.source === 'ThingSpeak' ? 'Fetched from ThingSpeak' : 'Manually Entered';
//     const timestamp = data.source === 'ThingSpeak' ? data.createdAt : data.timestamp; // Use ThingSpeak's createdAt if available

//     if (displayItems.length === 0 && data.source !== 'ThingSpeak') {
//         return (
//             <div className="input-data-display empty">
//                 <h4>Input Data Used:</h4>
//                 <p>No specific input parameters were provided for this advice.</p>
//                 {data.timestamp && <p className="timestamp-info"><Clock size={14} /> Advice generated: {formatTimestamp(data.timestamp)}</p>}
//             </div>
//         );
//     }
//      if (displayItems.length === 0 && data.source === 'ThingSpeak') {
//         return (
//             <div className="input-data-display empty">
//                 <h4>Input Data Used:</h4>
//                 <p>Data fetched from ThingSpeak, but specific field values might be missing or not mapped.</p>
//                 <p className="timestamp-info"><Clock size={14} /> Data fetched at: {formatTimestamp(timestamp)} ({sourceText})</p>
//             </div>
//         );
//     }


//     return (
//         <div className="input-data-display">
//             <h4>Input Data Used for this Advice:</h4>
//             <div className="input-data-grid">
//                 {displayItems.map(item => (
//                     <div key={item.label} className="input-data-item">
//                         {item.Icon && <item.Icon size={16} className="input-data-icon" />}
//                         <span>{item.label}:</span>&nbsp;{item.value}{item.unit && ` ${item.unit}`}
//                     </div>
//                 ))}
//             </div>
//              <p className="timestamp-info">
//                 <Clock size={14} /> {data.source === 'ThingSpeak' ? 'Data as of' : 'Advice generated'}: {formatTimestamp(timestamp)} ({sourceText})
//             </p>
//         </div>
//     );
// };


// // --- PredictionResult Component ---
// const PredictionResult = ({ predictionText, inputData }) => {
//   if (!predictionText) return null;

//   const sections = {
//     crops: "",
//     fertilizer: "",
//     pests: "",
//     tips: ""
//   };

//   const lines = predictionText.split('\n');
//   let currentSectionKey = null;
//   let currentContent = [];

//   lines.forEach(line => {
//     const trimmedLine = line.trim();
//     // More robust section detection
//     if (/^(✅|✔)\s*Top 3 suitable crops/i.test(trimmedLine)) {
//       if (currentSectionKey) sections[currentSectionKey] = currentContent.join('\n').trim();
//       currentSectionKey = "crops";
//       currentContent = [trimmedLine.replace(/^(✅|✔)\s*Top 3 suitable crops[^:]*:\s*/i, '').trim()];
//     } else if (/^🌿\s*Organic or chemical fertilizer recommendations/i.test(trimmedLine)) {
//       if (currentSectionKey) sections[currentSectionKey] = currentContent.join('\n').trim();
//       currentSectionKey = "fertilizer";
//       currentContent = [trimmedLine.replace(/^🌿\s*Organic or chemical fertilizer recommendations[^:]*:\s*/i, '').trim()];
//     } else if (/^(🐛|🐞)\s*Possible plant diseases or pest risks/i.test(trimmedLine)) {
//       if (currentSectionKey) sections[currentSectionKey] = currentContent.join('\n').trim();
//       currentSectionKey = "pests";
//       currentContent = [trimmedLine.replace(/^(🐛|🐞)\s*Possible plant diseases or pest risks[^:]*:\s*/i, '').trim()];
//     } else if (/^(💡|✨)\s*Useful farming tips and precautions/i.test(trimmedLine)) {
//       if (currentSectionKey) sections[currentSectionKey] = currentContent.join('\n').trim();
//       currentSectionKey = "tips";
//       currentContent = [trimmedLine.replace(/^(💡|✨)\s*Useful farming tips and precautions[^:]*:\s*/i, '').trim()];
//     } else if (currentSectionKey) {
//       if (line.trim() !== '' || currentContent.length > 0) {
//          currentContent.push(line); // Keep original line for formatting in SectionCard
//       }
//     }
//   });

//   if (currentSectionKey) sections[currentSectionKey] = currentContent.join('\n').trim();

//   const parsedSections = [
//     { key: 'crops', title: "Suitable Crops", content: sections.crops, Icon: CheckCircle, iconColor: "icon-green", bgColor: "bg-green-light", borderColor: "border-green-std" },
//     { key: 'fertilizer', title: "Fertilizer Recommendations", content: sections.fertilizer, Icon: Sprout, iconColor: "icon-blue", bgColor: "bg-blue-light", borderColor: "border-blue-std" }, // Changed Icon to Sprout for variety
//     { key: 'pests', title: "Disease & Pest Risks", content: sections.pests, Icon: AlertCircle, iconColor: "icon-red", bgColor: "bg-red-light", borderColor: "border-red-std" },
//     { key: 'tips', title: "Farming Tips & Precautions", content: sections.tips, Icon: Zap, iconColor: "icon-yellow", bgColor: "bg-yellow-light", borderColor: "border-yellow-std" },
//   ].filter(section => section.content && section.content.trim() !== "");


//   return (
//     <div className="prediction-result-container">
//       <h2 className="prediction-main-title">Your Farming Advice ✨</h2>
//       <InputDataDisplay data={inputData} /> {/* Display the input data used */}
//       <div className="sections-wrapper">
//         {parsedSections.length > 0 ? (
//           parsedSections.map(section => (
//             <SectionCard
//               key={section.key}
//               title={section.title}
//               content={section.content}
//               Icon={section.Icon}
//               iconColorClass={section.iconColor}
//               bgColorClass={section.bgColor}
//               borderColorClass={section.borderColor}
//             />
//           ))
//         ) : (
//           // Fallback if no sections could be parsed, show the raw prediction
//           <SectionCard title="General Advice" content={predictionText} Icon={Info} iconColorClass="icon-indigo" bgColorClass="bg-indigo-light" borderColorClass="border-indigo-std" />
//         )}
//       </div>
//     </div>
//   );
// };

// // --- Loader Component ---
// const Loader = () => {
//   return (
//     <div className="loader-container">
//       <div className="loader-spinner"></div>
//       <p className="loader-text">
//         🌱 Fetching your farming advice... Please wait.
//       </p>
//     </div>
//   );
// };

// // --- App Component ---
// function App() {
//   const [prediction, setPrediction] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [inputDataSnapshot, setInputDataSnapshot] = useState(null); // To store the data used for prediction

//   // Function to handle API call for prediction
//   const handleGetPrediction = async (data, isAutoFetch = false) => {
//     setIsLoading(true);
//     setError(null);
//     setPrediction(null);
//     setInputDataSnapshot(null); // Clear previous snapshot

//     try {
//       const payload = isAutoFetch ? { fetchFromThingSpeak: true } : { manualData: data };
//       const response = await axios.post(`${API_BASE_URL}/predict`, payload);

//       // Store both prediction text and the input data snapshot from backend
//       setPrediction(response.data.prediction);
//       setInputDataSnapshot(response.data.inputData);

//     } catch (err) {
//       console.error("Error fetching prediction:", err);
//       let errorMessage = 'Failed to get prediction. Please try again.';

//       if (err.code === 'ERR_NETWORK') {
//         errorMessage = `Network Error: Could not connect to the server. Please ensure the backend server is running at ${API_BASE_URL} and there are no network blockages (e.g., firewall).`;
//       } else if (err.response) {
//         errorMessage = `Server Error: ${err.response.status} - ${err.response.data.error || 'An issue occurred on the server.'}`;
//         if (err.response.data.details) {
//           errorMessage += ` Details: ${typeof err.response.data.details === 'object' ? JSON.stringify(err.response.data.details) : err.response.data.details}`;
//         }
//       } else if (err.request) {
//         errorMessage = 'No response from server. Please check your network connection and ensure the server is running.';
//       } else {
//         errorMessage = `Error: ${err.message}`;
//       }
//       setError(errorMessage);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="app-container">
//       <header className="app-header">
//         <h1 className="app-title">
//           <Leaf size={48} className="header-icon" />
//           Soil Mate 
//         </h1>
//         <p className="app-subtitle">
//           Get AI-powered advice for your farm! 🧑‍🌾
//         </p>
//       </header>

//       <main className="app-main">
//         <DataInputForm onSubmit={handleGetPrediction} isLoading={isLoading} setError={setError} />

//         <div className="or-divider">
//           <p>OR</p>
//           <button
//             onClick={() => {
//               setError(null); // Clear any form validation errors before fetching
//               handleGetPrediction(null, true); // Pass null for data, true for autoFetch
//             }}
//             disabled={isLoading}
//             className="fetch-button"
//           >
//             <CloudCog size={20} className="button-icon" />
//             Fetch Real-time Data & Advise (ThingSpeak)
//           </button>
//         </div>

//         {isLoading && <Loader />}

//         {error && (
//           <div className="error-message">
//             <AlertTriangle size={24} className="error-icon" />
//             <div>
//               <h3>Oops! Something went wrong.</h3>
//               <p>{error}</p>
//             </div>
//           </div>
//         )}

//         {/* Pass the inputDataSnapshot to PredictionResult */}
//         {prediction && !isLoading && (
//           <PredictionResult predictionText={prediction} inputData={inputDataSnapshot} />
//         )}

//         {!prediction && !isLoading && !error && (
//           <div className="initial-message">
//             <Sprout size={40} className="initial-icon" />
//             <p>Enter your farm's data or fetch from ThingSpeak to get advice.</p>
//             <p className="initial-subtext">Your personalized farming assistant is ready!</p>
//           </div>
//         )}
//       </main>

//       <footer className="app-footer">
//         <p>&copy; {new Date().getFullYear()} Smart Farming Advisor. Powered by AI.</p>
//          <p className="api-info">
//           <Server size={16} className="footer-icon" /> Backend API: {API_BASE_URL}
//         </p>
//       </footer>
//     </div>
//   );
// }

// export default App;

// // Ensure you have a public/index.html with a root div:
// // <div id="root"></div>

// // And your src/index.js should look something like this:
// // import React from 'react';
// // import ReactDOM from 'react-dom/client'; // For React 18+
// // import './index.css'; // Optional global styles
// // import App from './App';

// // const root = ReactDOM.createRoot(document.getElementById('root'));
// // root.render(
// //   <React.StrictMode>
// //     <App />
// //   </React.StrictMode>
// // );


//23 may 

// SoilMate Frontend (React.js)
// File: App.jsx
// Ensure you have a .env file in your React app's root directory (frontend/) with:
// VITE_THINGSPEAK_CHANNEL_ID=2783628
// VITE_THINGSPEAK_API_KEY=3Y6EMRRP3MY6Z7PP
// VITE_BACKEND_URL=http://localhost:5001 (or your backend URL)

import React, { useState } from 'react'; // Removed useEffect as it wasn't used
import axios from 'axios';

const App = () => {
  const [formData, setFormData] = useState({
    temperature: '',
    humidity: '',
    ph: '',
    soilMoisture: '',
    nitrogen: '',
    phosphorus: '',
    potassium: '',
  });

  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [recommendation, setRecommendation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Access environment variables using import.meta.env for Vite
  const thingSpeakChannelId = import.meta.env.VITE_THINGSPEAK_CHANNEL_ID || '2783628';
  const thingSpeakApiKey = import.meta.env.VITE_THINGSPEAK_API_KEY || '3Y6EMRRP3MY6Z7PP';
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001';


  const inputStyle = {
    margin: '5px 0 10px 0',
    padding: '8px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    width: 'calc(100% - 18px)', // Adjusted for padding and border
    boxSizing: 'border-box', // Ensures padding and border don't add to width
  };

  const labelStyle = {
    fontWeight: 'bold',
    display: 'block',
    marginBottom: '3px',
  };

  const buttonStyle = {
    padding: '10px 15px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    margin: '10px 5px 0 0',
  };

  const disabledButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#ccc',
    cursor: 'not-allowed',
  };

  const containerStyle = {
    fontFamily: 'Arial, sans-serif',
    maxWidth: '600px',
    margin: '20px auto',
    padding: '20px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    borderRadius: '8px',
  };

  const headingStyle = {
    textAlign: 'center',
    color: '#333',
  };

  const resultBoxStyle = {
    marginTop: '20px',
    padding: '15px',
    border: '1px solid #eee',
    backgroundColor: '#f9f9f9',
    borderRadius: '4px',
    whiteSpace: 'pre-wrap', // To respect newlines from Gemini
  };

  const errorStyle = {
    color: 'red',
    marginTop: '10px',
  };

  const languageSelectStyle = {
    ...inputStyle, // use inputStyle and override width if needed
    width: '100%', // make select full width of its container
    padding: '8px', // Ensure padding is consistent
  };


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLanguageChange = (e) => {
    setSelectedLanguage(e.target.value);
  };

  const fetchThingSpeakData = async () => {
    setLoading(true);
    setError('');
    setRecommendation('');
    try {
      const response = await axios.get(
        `https://api.thingspeak.com/channels/${thingSpeakChannelId}/feeds.json?api_key=${thingSpeakApiKey}&results=1`
      );
      if (response.data && response.data.feeds && response.data.feeds.length > 0) {
        const latestFeed = response.data.feeds[0];
        setFormData({
          temperature: latestFeed.field1 || '',
          humidity: latestFeed.field2 || '',
          ph: latestFeed.field3 || '',
          soilMoisture: latestFeed.field4 || '',
          nitrogen: latestFeed.field5 || '',
          phosphorus: latestFeed.field6 || '',
          potassium: latestFeed.field7 || '',
        });
      } else {
        setError('Could not fetch data from ThingSpeak. Channel might be empty or invalid response.');
      }
    } catch (err) {
      console.error('ThingSpeak fetch error:', err);
      setError(`Failed to fetch data from ThingSpeak: ${err.message}. Please check Channel ID and API Key.`);
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setRecommendation('');

    const isAnyFieldFilled = Object.values(formData).some(value => value !== '');
    if (!isAnyFieldFilled) {
        setError('Please fill in at least one data field or fetch from ThingSpeak.');
        setLoading(false);
        return;
    }

    try {
      const payload = {
        ...formData,
        selectedLanguage,
      };
      const response = await axios.post(`${backendUrl}/api/recommend`, payload);
      setRecommendation(response.data.recommendation);
    } catch (err) {
      console.error('Backend submission error:', err);
      setError(`Failed to get recommendation: ${err.response ? err.response.data.error : err.message}`);
    }
    setLoading(false);
  };

  return (
    <div style={containerStyle}>
      <h1 style={headingStyle}>Soil MATE 🌿 Farming Assistant</h1>
      
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <label style={labelStyle} htmlFor="temperature">🌡️ Temperature (°C)</label>
            <input style={inputStyle} type="number" step="0.1" name="temperature" value={formData.temperature} onChange={handleChange} placeholder="e.g., 25.5" />
          </div>
          <div>
            <label style={labelStyle} htmlFor="humidity">💧 Humidity (%)</label>
            <input style={inputStyle} type="number" step="0.1" name="humidity" value={formData.humidity} onChange={handleChange} placeholder="e.g., 60" />
          </div>
          <div>
            <label style={labelStyle} htmlFor="ph">⚗️ Soil pH Level</label>
            <input style={inputStyle} type="number" step="0.1" name="ph" value={formData.ph} onChange={handleChange} placeholder="e.g., 6.5" />
          </div>
          <div>
            <label style={labelStyle} htmlFor="soilMoisture">🌱 Soil Moisture (%)</label>
            <input style={inputStyle} type="number" step="0.1" name="soilMoisture" value={formData.soilMoisture} onChange={handleChange} placeholder="e.g., 50" />
          </div>
          <div>
            <label style={labelStyle} htmlFor="nitrogen">🌾 Nitrogen (N) (kg/ha)</label>
            <input style={inputStyle} type="number" step="0.1" name="nitrogen" value={formData.nitrogen} onChange={handleChange} placeholder="e.g., 100" />
          </div>
          <div>
            <label style={labelStyle} htmlFor="phosphorus">🧪 Phosphorus (P) (kg/ha)</label>
            <input style={inputStyle} type="number" step="0.1" name="phosphorus" value={formData.phosphorus} onChange={handleChange} placeholder="e.g., 50" />
          </div>
          <div>
            <label style={labelStyle} htmlFor="potassium">🔋 Potassium (K) (kg/ha)</label>
            <input style={inputStyle} type="number" step="0.1" name="potassium" value={formData.potassium} onChange={handleChange} placeholder="e.g., 75" />
          </div>
        </div>

        <div style={{ marginTop: '10px' }}> {/* Added margin for spacing */}
          <label style={labelStyle} htmlFor="language">🌐 Select Language:</label>
          <select 
            style={languageSelectStyle} 
            name="language" 
            value={selectedLanguage} 
            onChange={handleLanguageChange}
          >
            <option value="English">English</option>
            <option value="Hindi">हिन्दी (Hindi)</option>
            <option value="Kannada">ಕನ್ನಡ (Kannada)</option>
          </select>
        </div>

        <button type="button" onClick={fetchThingSpeakData} disabled={loading} style={loading ? disabledButtonStyle : buttonStyle}>
          {loading ? 'Fetching...' : '📡 Fetch from ThingSpeak'}
        </button>
        <button type="submit" disabled={loading} style={loading ? disabledButtonStyle : buttonStyle}>
          {loading ? 'Getting Advice...' : '💡 Get Farming Advice'}
        </button>
      </form>

      {error && <p style={errorStyle}>{error}</p>}

      {recommendation && (
        <div style={resultBoxStyle}>
          <h3 style={{ marginTop: 0, color: '#2E7D32' }}>🌱 Farming Recommendation:</h3>
          <p>{recommendation}</p>
        </div>
      )}
       <footer style={{textAlign: 'center', marginTop: '30px', fontSize: '0.9em', color: '#777'}}>
        <p>ThingSpeak Channel ID used: {thingSpeakChannelId}</p>
        <p>Note: Ensure your backend is running at {backendUrl}</p>
      </footer>
    </div>
  );
};

export default App;

// To run this React app (assuming Vite or similar):
// 1. Save this code as App.jsx in the src/ folder of your React project.
// 2. Create a .env file in the root of your React project (e.g., frontend/.env) with:
//    VITE_THINGSPEAK_CHANNEL_ID=2783628
//    VITE_THINGSPEAK_API_KEY=3Y6EMRRP3MY6Z7PP
//    VITE_BACKEND_URL=http://localhost:5001 
// 3. Install dependencies: npm install axios (if not already)
// 4. IMPORTANT: Restart your development server (e.g., npm run dev or npm start) for .env changes to apply.
