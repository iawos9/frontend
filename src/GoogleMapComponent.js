import React, { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, TrafficLayer, Marker, DirectionsRenderer } from '@react-google-maps/api';
import restMark from './rest_mark.png'; // Import your restaurant image
import homeMark from './home_mark.png'; // Import your customer image

const containerStyle = {
    width: '100%',
    height: '600px',
};

const colors = [
    '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#800000', '#808000', 
    '#008000', '#800080', '#008080', '#000080', '#FF5733', '#C70039', '#900C3F', '#581845',
    '#FFC300', '#DAF7A6', '#581845', '#C70039', '#900C3F', '#FF5733', '#33FF57', '#39C7C7',
    '#FF4500', '#DA70D6', '#B22222', '#4682B4', '#32CD32', '#9ACD32', '#8B008B', '#FF6347',
    '#20B2AA', '#5F9EA0', '#D2691E', '#FF69B4', '#FF1493', '#B8860B', '#CD5C5C', '#4B0082',
];

function tspNearestNeighbor(coordinates) {
    const n = coordinates.length;
    const visited = Array(n).fill(false);
    const path = [0]; // Start with the fixed location (logistics company)
    visited[0] = true;

    for (let i = 1; i < n; i++) {
        let lastVisited = path[path.length - 1];
        let nearestNeighbor = -1;
        let minDistance = Infinity;

        for (let j = 0; j < n; j++) {
            if (!visited[j]) {
                const dx = coordinates[lastVisited].lat - coordinates[j].lat;
                const dy = coordinates[lastVisited].lng - coordinates[j].lng;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < minDistance) {
                    nearestNeighbor = j;
                    minDistance = distance;
                }
            }
        }

        if (nearestNeighbor >= 0) {
            path.push(nearestNeighbor);
            visited[nearestNeighbor] = true;
        }
    }

    return path;
}

function GoogleMapComponent({ coordinates, onCoordinatesUpdate }) {
    const [directionsList, setDirectionsList] = useState([]);
    const [markers, setMarkers] = useState([]);
    const [liveLocation, setLiveLocation] = useState(null);
    const [clickedMarkers, setClickedMarkers] = useState(new Set());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

    useEffect(() => {
        const fetchDirections = async () => {
            if (coordinates.length > 1) {
                // Clear previous directions and markers
                setDirectionsList([]);
                setMarkers([]);

                const optimalOrder = tspNearestNeighbor(coordinates);

                const newMarkers = [];
                const directionsService = new window.google.maps.DirectionsService();

                for (let i = 0; i < optimalOrder.length - 1; i++) {
                    const origin = coordinates[optimalOrder[i]];
                    const destination = coordinates[optimalOrder[i + 1]];
                    const color = colors[i % colors.length];

                    const result = await new Promise((resolve, reject) => {
                        directionsService.route(
                            {
                                origin,
                                destination,
                                travelMode: window.google.maps.TravelMode.DRIVING,
                            },
                            (result, status) => {
                                if (status === window.google.maps.DirectionsStatus.OK) {
                                    resolve({ result, color });
                                } else {
                                    reject(`Error fetching directions: ${status}`);
                                }
                            }
                        );
                    });

                    setDirectionsList(prev => [...prev, result]);

                    const location = origin;
                    const icon = i === 0 
                        ? {
                            url: restMark,
                            scaledSize: new window.google.maps.Size(50, 50), // Adjust the size here
                        }
                        : {
                            url: homeMark,
                            scaledSize: new window.google.maps.Size(40, 40), // Adjust the size here for customer markers
                        };

                    newMarkers.push({
                        position: location,
                        id: optimalOrder[i],
                        icon: icon,
                    });

                    // Last marker for destination
                    if (i === optimalOrder.length - 2) {
                        const lastLocation = destination;
                        newMarkers.push({
                            position: lastLocation,
                            id: optimalOrder[i + 1],
                            icon: {
                                url: homeMark,
                                scaledSize: new window.google.maps.Size(40, 40),
                            },
                        });
                    }
                }

                setMarkers(newMarkers);
            }
        };

        fetchDirections();

        const intervalId = setInterval(() => {
            fetchDirections();
        }, 10 * 60 * 1000); // 10 minutes

        return () => clearInterval(intervalId);
    }, [coordinates]);

    const checkProximity = async (origin, destination) => {
        const distanceService = new window.google.maps.DistanceMatrixService();
        const response = await new Promise((resolve, reject) => {
            distanceService.getDistanceMatrix({
                origins: [origin],
                destinations: [destination],
                travelMode: window.google.maps.TravelMode.DRIVING,
            }, (result, status) => {
                if (status === window.google.maps.DistanceMatrixStatus.OK) {
                    resolve(result);
                } else {
                    reject(new Error(`Error fetching distance matrix: ${status}`));
                }
            });
        });

        const travelTime = Math.floor(response.rows[0].elements[0].duration.value / 60); // Convert to minutes and round down
        return travelTime;
    };

    const handleProximityCheck = async ({ newOrder, onComplete }) => {
        if (coordinates.length > 0) {
            const lastOrder = coordinates[coordinates.length - 1];
            const travelTime = await checkProximity(lastOrder, newOrder);

            const accepted = travelTime <= 15;
            setModalMessage(`There is a package to drop off on the same route. Do you accept this delivery?`);
            setIsModalOpen(true);

            const handleAccept = () => {
                onCoordinatesUpdate((prev) => [...prev, newOrder]);
                if (onComplete) {
                    onComplete(travelTime, accepted);
                }
                setIsModalOpen(false);
            };

            const handleReject = () => {
                if (onComplete) {
                    onComplete(travelTime, false);
                }
                setIsModalOpen(false);
            };

            // Attach the handlers to window events for modal buttons
            window.handleAccept = handleAccept;
            window.handleReject = handleReject;
        }
    };

    const handleMarkerClick = (markerId) => {
        if (liveLocation) {
            const destination = coordinates[markerId];
            const url = `https://www.google.com/maps/dir/?api=1&origin=${liveLocation.lat},${liveLocation.lng}&destination=${destination.lat},${destination.lng}`;
            window.open(url, '_blank');
            setClickedMarkers(prev => new Set(prev).add(markerId));
        }
    };

    useEffect(() => {
        const handleAddCoordinates = (event) => {
            const { newOrder, onComplete } = event.detail;
            handleProximityCheck({ newOrder, onComplete });
        };

        window.addEventListener('addCoordinates', handleAddCoordinates);

        return () => {
            window.removeEventListener('addCoordinates', handleAddCoordinates);
        };
    }, [coordinates]);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.watchPosition(
                (position) => {
                    setLiveLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    });
                },
                (error) => console.error('Error getting live location:', error),
                { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
            );
        } else {
            console.error('Geolocation is not supported by this browser.');
        }
    }, []);

    return (
        <>
            <LoadScript googleMapsApiKey={apiKey}>
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={coordinates.length > 0 ? coordinates[0] : { lat: 0, lng: 0 }}
                    zoom={coordinates.length > 0 ? 14 : 2}
                    options={{ disableDefaultUI: true }} // Disable default UI elements of Google Maps
                >
                    {markers.map((marker, index) => (
                        <Marker
                            key={index}
                            position={marker.position}
                            icon={marker.icon}
                            onClick={() => handleMarkerClick(marker.id)}
                        />
                    ))}
                    {directionsList.map((direction, index) => (
                        <DirectionsRenderer
                            key={index}
                            directions={direction.result}
                            options={{
                                polylineOptions: {
                                    strokeColor: direction.color,
                                    strokeWeight: 8, // Increase thickness
                                },
                                suppressMarkers: true, // Removes default markers
                            }}
                        />
                    ))}
                    <TrafficLayer />
                </GoogleMap>
            </LoadScript>

            {isModalOpen && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                }}>
                    <div style={{
                        width: '400px',
                        backgroundColor: 'white',
                        padding: '20px',
                        borderRadius: '10px',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                        textAlign: 'center'
                    }}>
                        <p style={{
                            fontSize: '1.2rem',
                            marginBottom: '20px'
                        }}>{modalMessage}</p>
                        <button 
                            onClick={window.handleAccept} 
                            style={{
                                padding: '10px 20px',
                                marginRight: '10px',
                                backgroundColor: '#4CAF50',
                                color: 'white',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer'
                            }}>
                            Accept, Call the Customer
                        </button>
                        <button 
                            onClick={window.handleReject} 
                            style={{
                                padding: '10px 20px',
                                backgroundColor: '#F44336',
                                color: 'white',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer'
                            }}>
                            Reject
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}

export default GoogleMapComponent;
