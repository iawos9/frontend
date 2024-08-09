import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import GoogleMapComponent from './GoogleMapComponent'; // Use this for map rendering
import AdminPage from './AdminPage'; // Import the new admin page component

function App() {
    const [coordinates, setCoordinates] = useState([]);
    const [currentTestCase, setCurrentTestCase] = useState(0);
    const [testResult, setTestResult] = useState('');
    const [minutesThreshold, setMinutesThreshold] = useState(15); // Add state for minutes threshold

    // Define the test cases with restaurant and customer locations
    const testCases = [
        {
            restaurant: { lat: 24.725398, lng: 46.663781 }, // Al Hamra, Riyadh
            firstCustomer: { lat: 24.737619, lng: 46.663707 }, // Al Nakheel, Riyadh
            secondCustomer: { lat: 24.688217, lng: 46.707506 } // Al Malaz, Riyadh
        },
        {
            restaurant: { lat: 24.690142, lng: 46.686044 }, // Al Olaya, Riyadh
            firstCustomer: { lat: 24.678380, lng: 46.688740 }, // Al Murabba, Riyadh
            secondCustomer: { lat: 24.719727, lng: 46.665364 } // Al Wurud, Riyadh
        },
        {
            restaurant: { lat: 24.742417, lng: 46.698839 }, // Al Mursalat, Riyadh
            firstCustomer: { lat: 24.753215, lng: 46.683678 }, // King Fahd, Riyadh
            secondCustomer: { lat: 24.764424, lng: 46.712326 } // Al Nuzha, Riyadh
        }
    ];

    const startTestCase = () => {
        // Start with the first customer and the restaurant location
        const { restaurant, firstCustomer, secondCustomer } = testCases[currentTestCase];
        setCoordinates([restaurant, firstCustomer]);

        // Simulate the second customer order after a delay
        setTimeout(() => {
            window.dispatchEvent(new CustomEvent('addCoordinates', { 
                detail: { newOrder: secondCustomer, onComplete: handleTestCompletion } 
            }));
        }, 2000); // Wait 2 seconds before adding the second customer
    };

    const handleTestCompletion = (travelTime, accepted) => {
        // Display the result of the test case
        const result = `Test Case ${currentTestCase + 1}: Travel time is ${travelTime} minutes. ${accepted ? 'Accepted' : 'Not Accepted'} (within ${minutesThreshold} minutes)`;
        setTestResult(result);
        setCurrentTestCase(prev => prev + 1);
    };

    return (
        <Router>
            <Routes>
                <Route path="/" element={
                    <div style={{
                        backgroundColor: '#f0f4f8',
                        minHeight: '100vh',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        fontFamily: '"Roboto", sans-serif',
                        color: '#2c3e50',
                    }}>
                        <div style={{
                            width: '90%',
                            maxWidth: '1200px',
                            background: '#ffffff',
                            borderRadius: '20px',
                            boxShadow: '0 12px 24px rgba(0, 0, 0, 0.15)',
                            padding: '40px',
                            textAlign: 'center',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            border: '1px solid #ddd',
                            position: 'relative',
                            overflow: 'hidden'
                        }}>
                            <div style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                background: 'linear-gradient(135deg, #f39c12, #e74c3c)',
                                clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 100%)',
                                zIndex: -1,
                            }}></div>
                            <h1 style={{
                                fontSize: '3rem',
                                marginBottom: '20px',
                                color: '#3498db',
                                fontWeight: '700',
                                textTransform: 'uppercase',
                                letterSpacing: '1px',
                                background: 'linear-gradient(135deg, #3498db, #8e44ad)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}>
                                Route Optimization
                            </h1>
                            <p style={{
                                fontSize: '1.125rem',
                                color: '#7f8c8d',
                                marginBottom: '30px',
                                lineHeight: '1.6'
                            }}>
                                Upload a file with coordinates to visualize and optimize the route.
                            </p>

                            <Link to="/admin" style={{
                                padding: '10px 20px',
                                marginBottom: '10px',  // Adjust the margin to space correctly
                                backgroundColor: '#3498db',
                                color: '#ffffff',
                                textDecoration: 'none',
                                borderRadius: '10px',
                                fontSize: '16px',
                                cursor: 'pointer',
                            }}>
                                Go to Admin Page
                            </Link>

                            <button 
                                onClick={startTestCase}
                                disabled={currentTestCase >= testCases.length}
                                style={{
                                    padding: '12px 20px',
                                    marginBottom: '10px',  // Adjust margin to separate from the result
                                    borderRadius: '10px',
                                    border: '2px solid #3498db',
                                    background: '#ffffff',
                                    fontSize: '16px',
                                    cursor: currentTestCase >= testCases.length ? 'not-allowed' : 'pointer',
                                    transition: 'all 0.3s ease',
                                    outline: 'none',
                                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                }}
                                onMouseEnter={e => e.target.style.background = '#f0f4f8'}
                                onMouseLeave={e => e.target.style.background = '#ffffff'}
                            >
                                {currentTestCase >= testCases.length ? 'All Test Cases Completed' : 'Next Test Case'}
                            </button>

                            {testResult && (
                                <div style={{
                                    marginBottom: '20px', // Adjust margin to separate from the map
                                    padding: '10px 20px',
                                    backgroundColor: '#e0f7fa',
                                    color: '#00796b',
                                    borderRadius: '5px',
                                    fontSize: '1rem',
                                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                                }}>
                                    {testResult}
                                </div>
                            )}

                            <div style={{ width: '100%', marginBottom: '30px' }}>
                                <GoogleMapComponent coordinates={coordinates} onCoordinatesUpdate={setCoordinates} />
                            </div>
                        </div>
                    </div>
                } />
                <Route 
                    path="/admin" 
                    element={
                        <AdminPage 
                            minutesThreshold={minutesThreshold} 
                            setMinutesThreshold={setMinutesThreshold} 
                        />} 
                />
            </Routes>
        </Router>
    );
}

export default App;
