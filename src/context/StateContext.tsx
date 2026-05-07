// src/context/StateContext.tsx

import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

interface State {
    id: number;
    name: string;
    code: string;
}

interface StateContextType {
    states: State[];
    loading: boolean;
    fetchStates: () => Promise<void>;
    getStateById: (id: number) => State | undefined;
    getStateByName: (name: string) => State | undefined;
}

const StateContext = createContext<StateContextType>({
    states: [],
    loading: false,
    fetchStates: () => Promise.resolve(),
    getStateById: () => undefined,
    getStateByName: () => undefined,
});

export const useStates = () => useContext(StateContext);

export const StateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [states, setStates] = useState<State[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchStates = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/states/`);
            setStates(res.data || []);
        } catch (error) {
            console.error('Failed to fetch states', error);
        } finally {
            setLoading(false);
        }
    };

    const getStateById = (id: number): State | undefined => {
        return states.find(state => state.id === id);
    };

    const getStateByName = (name: string): State | undefined => {
        return states.find(state => state.name.toLowerCase() === name.toLowerCase());
    };

    useEffect(() => {
        fetchStates();
    }, []);

    return (
        <StateContext.Provider value={{ 
            states, 
            loading, 
            fetchStates, 
            getStateById, 
            getStateByName 
        }}>
            {children}
        </StateContext.Provider>
    );
};
