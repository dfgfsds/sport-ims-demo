import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { LocationProvider } from './context/LocationContext.tsx';
import { ClubProvider } from './context/ClubContext.tsx';
import { DistrictProvider } from './context/DistrictContext.tsx';
import { StateProvider } from './context/StateContext.tsx';
import { DashboardCountProvider } from './context/DashboardCountContext.tsx';
import { PlayerProvider } from './context/PlayerContext.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LocationProvider>
      <StateProvider>
        <DistrictProvider>
          <ClubProvider>
            <DashboardCountProvider>
              <PlayerProvider>
                <App />
              </PlayerProvider>
            </DashboardCountProvider>
          </ClubProvider>
        </DistrictProvider>
      </StateProvider>
    </LocationProvider>
  </StrictMode>
);
