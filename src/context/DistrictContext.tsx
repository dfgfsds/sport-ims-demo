// src/context/DistrictContext.tsx

import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

interface District {
    id: number;
    name: string;
    stateId: number;
    stateName?: string;
}

interface DistrictContextType {
    districts: District[];
    loading: boolean;
    fetchDistricts: () => Promise<void>;
    getDistrictsByState: (stateId: number) => District[];
}

const DistrictContext = createContext<DistrictContextType>({
    districts: [],
    loading: false,
    fetchDistricts: () => Promise.resolve(),
    getDistrictsByState: () => [],
});

export const useDistricts = () => useContext(DistrictContext);

export const DistrictProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [districts, setDistricts] = useState<District[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchDistricts = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/districts/`);
            setDistricts(res.data || []);
        } catch (error) {
            console.error('Failed to fetch districts', error);
        } finally {
            setLoading(false);
        }
    };

    const getDistrictsByState = (stateId: number): District[] => {
        return districts.filter(district => district.stateId === stateId);
    };

    useEffect(() => {
        fetchDistricts();
    }, []);

    return (
        <DistrictContext.Provider value={{ 
            districts, 
            loading, 
            fetchDistricts, 
            getDistrictsByState 
        }}>
            {children}
        </DistrictContext.Provider>
    );
};
