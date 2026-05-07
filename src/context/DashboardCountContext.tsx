import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL;

interface DashboardCounts {
  players: number;
  clubs: number;
  districtSecretaries: number;
  stateSecretaries: number;
}

const DashboardCountContext = createContext<DashboardCounts | null>(null);

export const useDashboardCounts = () => useContext(DashboardCountContext);

export const DashboardCountProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [counts, setCounts] = useState<DashboardCounts>({
    players: 0,
    clubs: 0,
    districtSecretaries: 0,
    stateSecretaries: 0,
  });

  const fetchData = async () => {
    try {
      const [playersRes, clubsRes, distSecRes, stateSecRes] = await Promise.all([
        axios.get(`${baseURL}/players/`),
        axios.get(`${baseURL}/clubs/`),
        axios.get(`${baseURL}/district_secretaries/`),
        axios.get(`${baseURL}/state_secretaries/`),
      ]);

      setCounts({
        players: playersRes.data.filter((p: any) => p.approvalStatus === 'approved').length,
        clubs: clubsRes.data.filter((c: any) => c.approvalStatus === 'approved').length,
        districtSecretaries: distSecRes.data.filter((d: any) => d.approvalStatus === 'approved').length,
        stateSecretaries: stateSecRes.data.filter((s: any) => s.approvalStatus === 'approved').length,
      });
    } catch (err) {
      console.error('Error fetching dashboard counts:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <DashboardCountContext.Provider value={counts}>
      {children}
    </DashboardCountContext.Provider>
  );
};
