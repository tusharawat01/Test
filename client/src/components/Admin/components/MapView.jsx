"use client"

import { useContext, useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { DataContext } from '../../../Contexts/Admin'

import "leaflet/dist/leaflet.css";
import L from "leaflet";

import icon from '../../../assets/icon.png';
import icon2 from '../../../assets/icon2.png';
import Link from 'next/link';
import { Skeleton } from 'antd';


const MapView = ({users}) => {
    const [userLocation, setUserLocation] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUserLocation();
    }, []);

    const fetchUserLocation = () => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        latitude: position.coords?.latitude,
                        longitude: position.coords?.longitude,
                    });
                    setLoading(false);
                },
                (error) => {
                    setError("Error fetching user location. Please ensure that you have given access for the location.");
                    setLoading(false);
                }
            );
        } else {
            setError("Geolocation is not supported by this browser.");
            setLoading(false);
        }
    };

    const userIcon = L.icon({
        iconUrl: icon,
        iconSize: [40, 40],
        iconAnchor: [20, 40],
    });

    const createPilotIcon = (avatarUrl) => {
        return L.icon({
            iconUrl: avatarUrl || icon2,
            iconSize: [40, 40],
            iconAnchor: [20, 40],
            className: avatarUrl ? 'rounded-full  ring ring-blue-700' : '', 
        });
    };

    return (
        <div className="relative rounded-lg overflow-clip">
            {loading && <Skeleton active />}
            {!userLocation && <p className='text-red-500 text-center'>Kindly Turn on the Location & refresh</p>}
            {userLocation && (
                <MapContainer
                    center={[userLocation?.latitude, userLocation?.longitude]}
                    zoom={3}
                    style={{ height: "500px", width: "100%", margin: "auto auto" }}
                >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <Marker position={[userLocation?.latitude, userLocation?.longitude]} icon={userIcon}>
                        <Popup>
                            <div>
                                <h3>Your Location</h3>
                                <p>Latitude: {userLocation?.latitude}</p>
                                <p>Longitude: {userLocation?.longitude}</p>
                            </div>
                        </Popup>
                    </Marker>
                    {users?.map((pilot) => (
                        <>
                            <Marker
                                key={pilot._id}
                                position={[parseFloat(pilot?.coordinates?.lat) || 0, parseFloat(pilot?.coordinates?.lon) || 0]}
                                icon={createPilotIcon(pilot?.avatar)}
                            >
                                <Popup>
                                    <div>
                                        <h3>{pilot?.fullName}</h3>
                                        <p>Role: {pilot?.role}</p>
                                        <p>Contact: {pilot?.phone?.countryCode} {pilot?.phone?.number}</p>
                                        <p>Location: {pilot?.city}, {pilot?.state}</p>
                                        <Link href={`/admin/user/${pilot.role}/${pilot.fullName}/${pilot._id}`} state={pilot} >
                                            <button className='bg-blue-500 mx-auto p-1 my-1 block text-white w-[80%] font-semibold'>View Profile</button>
                                        </Link>
                                    </div>
                                </Popup>
                            </Marker>
                            {pilot.basicDetails?.serviceRange && (
                                <Circle
                                    center={[parseFloat(pilot?.coordinates?.lat) || 0, parseFloat(pilot?.coordinates?.lon) || 0]}
                                    radius={(pilot?.basicDetails?.serviceRange*2)*3.14 } 
                                    color="blue"
                                    fillColor="blue"
                                    fillOpacity={0.1}
                                />
                            )}
                        </>
                    ))}
                </MapContainer>
            )}
        </div>
    );
};




export default MapView;
