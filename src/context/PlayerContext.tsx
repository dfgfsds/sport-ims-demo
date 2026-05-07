import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

interface Player {
    id: string;
    name: string;
    email: string;
    // Add other fields from your API response
}



const PlayerContext = createContext<any | undefined>(undefined);

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [player, setPlayer] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const baseURL = import.meta.env.VITE_API_BASE_URL;
    
    const fetchPlayer = async () => {
        const role = localStorage.getItem('role')
        if (role != 'admin') {
            const userId = localStorage.getItem('userId');
            if (!userId) return;

            try {
                let res;
                if (userId.length === 12) {
                    res = await axios.get(`${baseURL}/players/by-aadhar/${userId}`);
                } else {
                    res = await axios.get(`${baseURL}/players/${userId}`);
                }
                setPlayer(res.data);
            } catch (error) {
                console.error('Error fetching player profile:', error);
            } finally {
                setLoading(false);
            }
        };
    }


    useEffect(() => {

        fetchPlayer();
    }, []);

    return (
        <PlayerContext.Provider value={{ player, loading, fetchPlayer }}>
            {children}
        </PlayerContext.Provider>
    );
};

export const usePlayer = () => {
    const context = useContext(PlayerContext);
    if (!context) throw new Error('usePlayer must be used within a PlayerProvider');
    return context;
};
