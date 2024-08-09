import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AdminPage({ minutesThreshold, setMinutesThreshold }) {
    const [selectedOption, setSelectedOption] = useState(''); // Track selected option
    const [newMinutesThreshold, setNewMinutesThreshold] = useState(minutesThreshold);
    const [showOptions, setShowOptions] = useState(false); // Control the visibility of the options
    const navigate = useNavigate();

    const handleSave = () => {
        if (selectedOption === 'custom') {
            setMinutesThreshold(newMinutesThreshold);
            setTimeout(() => {
                navigate('/'); // Redirect to main page after saving
            }, 3000); // 3-second delay before redirect
        }
    };

    const toggleOptions = () => {
        setShowOptions(prev => !prev);
    };

    const handleOptionClick = (option) => {
        setSelectedOption(option);
    };

    return (
        <div style={{
            display: 'flex',
            minHeight: '100vh',
            fontFamily: '"Roboto", sans-serif',
            color: '#2c3e50',
        }}>
            {/* Sidebar for navigation */}
            <aside style={{
                width: '250px',
                background: '#2c3e50',
                color: '#ecf0f1',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                boxShadow: '2px 0 5px rgba(0,0,0,0.1)',
            }}>
                <h2 style={{
                    fontSize: '1.5rem',
                    marginBottom: '30px',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    background: 'linear-gradient(135deg, #3498db, #8e44ad)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                }}>
                    Admin Dashboard
                </h2>
                <nav style={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start'
                }}>
                    <div style={{ width: '100%' }}>
                        <button
                            style={{
                                width: '100%',
                                padding: '10px',
                                marginBottom: '10px',
                                backgroundColor: showOptions ? '#2980b9' : '#3498db',
                                color: '#ffffff',
                                border: 'none',
                                borderRadius: '5px',
                                textAlign: 'left',
                                cursor: 'pointer',
                                transition: 'background 0.3s',
                            }}
                            onClick={toggleOptions}
                        >
                            Minutes Threshold
                        </button>
                        {showOptions && (
                            <div style={{
                                backgroundColor: '#34495e',
                                borderRadius: '5px',
                                marginLeft: '10px',
                                padding: '10px',
                            }}>
                                <button
                                    style={{
                                        width: '100%',
                                        padding: '10px',
                                        marginBottom: '10px',
                                        backgroundColor: selectedOption === 'adaptive' ? '#3498db' : '#7f8c8d',
                                        color: '#ffffff',
                                        border: 'none',
                                        borderRadius: '5px',
                                        textAlign: 'left',
                                        cursor: 'pointer',
                                        transition: 'background 0.3s',
                                    }}
                                    onClick={() => handleOptionClick('adaptive')}
                                >
                                    Adaptive AI
                                </button>
                                <button
                                    style={{
                                        width: '100%',
                                        padding: '10px',
                                        marginBottom: '10px',
                                        backgroundColor: selectedOption === 'custom' ? '#3498db' : '#7f8c8d',
                                        color: '#ffffff',
                                        border: 'none',
                                        borderRadius: '5px',
                                        textAlign: 'left',
                                        cursor: 'pointer',
                                        transition: 'background 0.3s',
                                    }}
                                    onClick={() => handleOptionClick('custom')}
                                >
                                    Custom
                                </button>
                            </div>
                        )}
                    </div>
                    <button
                        style={{
                            width: '100%',
                            padding: '10px',
                            marginBottom: '10px',
                            backgroundColor: '#7f8c8d',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '5px',
                            textAlign: 'left',
                            cursor: 'pointer',
                            transition: 'background 0.3s',
                        }}
                        disabled
                    >
                        Coming Soon!
                    </button>
                    <button
                        style={{
                            width: '100%',
                            padding: '10px',
                            marginBottom: '10px',
                            backgroundColor: '#7f8c8d',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '5px',
                            textAlign: 'left',
                            cursor: 'pointer',
                            transition: 'background 0.3s',
                        }}
                        disabled
                    >
                        Coming Soon!
                    </button>
                    <button
                        style={{
                            width: '100%',
                            padding: '10px',
                            marginBottom: '10px',
                            backgroundColor: '#7f8c8d',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '5px',
                            textAlign: 'left',
                            cursor: 'pointer',
                            transition: 'background 0.3s',
                        }}
                        disabled
                    >
                        Coming Soon!
                    </button>
                    <button
                        style={{
                            width: '100%',
                            padding: '10px',
                            marginBottom: '10px',
                            backgroundColor: '#7f8c8d',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '5px',
                            textAlign: 'left',
                            cursor: 'pointer',
                            transition: 'background 0.3s',
                        }}
                        disabled
                    >
                        Coming Soon!
                    </button>
                </nav>
            </aside>

            {/* Main content area */}
            <main style={{
                flex: 1,
                padding: '40px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#ecf0f1'
            }}>
                {selectedOption === '' && (
                    <h1 style={{
                        fontSize: '2.5rem',
                        marginBottom: '20px',
                        color: '#3498db',
                        fontWeight: '700',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                    }}>
                        Choose an Option
                    </h1>
                )}

                {selectedOption === 'adaptive' && (
                    <>
                        <h1 style={{
                            fontSize: '2.5rem',
                            marginBottom: '20px',
                            color: '#3498db',
                            fontWeight: '700',
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                        }}>
                            Adaptive AI Threshold
                        </h1>
                        <p style={{
                            fontSize: '1.125rem',
                            color: '#7f8c8d',
                            marginBottom: '30px',
                            lineHeight: '1.6',
                            textAlign: 'center'
                        }}>
                            The AI automatically adjusts the delivery time threshold based on various factors like weather, traffic conditions, and time of day. For example, during late-night or early-morning hours when roads are less busy, the threshold can be increased to 30 minutes to allow for more flexible delivery times.
                        </p>
                        <p style={{
                            fontSize: '1.125rem',
                            color: '#e74c3c',
                            marginBottom: '30px',
                            textAlign: 'center',
                            fontWeight: '700'
                        }}>
                            Coming Soon!
                        </p>
                    </>
                )}

                {selectedOption === 'custom' && (
                    <>
                        <h1 style={{
                            fontSize: '2.5rem',
                            marginBottom: '20px',
                            color: '#3498db',
                            fontWeight: '700',
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                        }}>
                            Custom Minutes Threshold
                        </h1>
                        <p style={{
                            fontSize: '1.125rem',
                            color: '#7f8c8d',
                            marginBottom: '30px',
                            lineHeight: '1.6',
                            textAlign: 'center'
                        }}>
                            Manually set the minutes threshold for delivery acceptance. This allows you to fine-tune the delivery process based on your operational needs.
                        </p>
                        <input
                            type="number"
                            value={newMinutesThreshold}
                            onChange={(e) => setNewMinutesThreshold(parseInt(e.target.value))}
                            style={{
                                padding: '10px',
                                fontSize: '1rem',
                                borderRadius: '5px',
                                border: '1px solid #ddd',
                                width: '100px',
                                marginBottom: '20px',
                                textAlign: 'center',
                            }}
                        />
                        <button
                            onClick={handleSave}
                            style={{
                                padding: '12px 20px',
                                borderRadius: '10px',
                                border: '2px solid #3498db',
                                background: '#3498db',
                                color: '#ffffff',
                                fontSize: '16px',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                outline: 'none',
                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                            }}
                        >
                            Save
                        </button>
                    </>
                )}
            </main>
        </div>
    );
}

export default AdminPage;
