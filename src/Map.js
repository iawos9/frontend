import React from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const containerStyle = {
    width: '100%',
    height: '400px',
};

const Map = ({ locations }) => {
    const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

    return (
        <LoadScript googleMapsApiKey={apiKey}>
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={locations[0] || { lat: 0, lng: 0 }}
                zoom={locations.length ? 10 : 2}
            >
                {locations.map((loc, index) => (
                    <Marker key={index} position={{ lat: loc.lat, lng: loc.lng }} />
                ))}
            </GoogleMap>
        </LoadScript>
    );
};

export default Map;
