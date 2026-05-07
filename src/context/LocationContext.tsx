import React, { createContext, useContext, useEffect, useState } from 'react';
import { State, fetchStates } from './state';
import { District, fetchDistricts } from './district';

interface LocationContextType {
    states: State[];
    districts: District[];
    loading: boolean;
}

const LocationContext = createContext<LocationContextType>({
    states: [],
    districts: [],
    loading: true,
});

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [states, setStates] = useState<State[]>([]);
    const [districts, setDistricts] = useState<District[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [s, d] = await Promise.all([fetchStates(), fetchDistricts()]);
                setStates(s);
                setDistricts(d);
            } catch (err) {
                console.error('Error fetching states or districts:', err);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    return (
        <LocationContext.Provider value={{ states, districts, loading }}>
            {children}
        </LocationContext.Provider>
    );
};

export const useLocation = () => useContext(LocationContext);
