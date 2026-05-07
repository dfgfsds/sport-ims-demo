// src/context/ClubContext.tsx

import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import axios from 'axios';

interface Club {
    clubName: ReactNode;
    id: number;
    name: string;
    code: string;
}

interface ClubContextType {
    clubs: Club[];
    loading: boolean;
    fetchClubs:any;
}

const ClubContext = createContext<ClubContextType>({
    clubs: [],
    loading: false,
    fetchClubs:  () => Promise.resolve(),
});

export const useClubs = () => useContext(ClubContext);

export const ClubProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [clubs, setClubs] = useState<Club[]>([]);
    const [loading, setLoading] = useState(true);
    const fetchClubs = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/clubs/`);
            setClubs(res.data || []);
        } catch (error) {
            console.error('Failed to fetch clubs', error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchClubs();
    }, []);

    return (
        <ClubContext.Provider value={{ clubs, loading, fetchClubs }}>
            {children}
        </ClubContext.Provider>
    );
};
