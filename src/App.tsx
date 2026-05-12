import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import PlayerLayout from './pages/player/PlayerLayout';
import OfficialLayout from './pages/official/OfficialLayout';
import ClubLayout from './pages/club/ClubLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Players from './pages/users/Players';
import Clubs from './pages/users/Clubs';
import Districts from './pages/users/Districts';
import States from './pages/users/States';
import Admins from './pages/users/Admins';
import PlayersApproval from './pages/approvals/PlayersApproval';
import Events from './pages/Events';
import Gallery from './pages/Gallery';
import News from './pages/News';
import PlayerDashboard from './pages/player/PlayerDashboard';
import UpcomingEvents from './pages/player/UpcomingEvents';
import MyEvents from './pages/player/MyEvents';
import PlayerProfile from './pages/player/PlayerProfile';
import OfficialDashboard from './pages/official/OfficialDashboard';
import ScheduleManagement from './pages/official/ScheduleManagement';
import UpdateResults from './pages/official/UpdateResults';
import ResultsView from './pages/official/ResultsView';
import ParticipantsView from './pages/official/ParticipantsView';
import ReportsPage from './pages/official/ReportsPage';
import ClubDashboard from './pages/club/ClubDashboard';
import ClubPlayers from './pages/club/ClubPlayers';
import ClubEvents from './pages/club/ClubEvents';
import ClubReports from './pages/club/ClubReports';
import ClubProfile from './pages/club/ClubProfile';
import ClubsApproval from './pages/approvals/ClubsApproval';
import DistrictsApproval from './pages/approvals/DistrictsApprovals';
import StatesApproval from './pages/approvals/StatesApproval';
import EventParticipation from './pages/eventDetails/EventParticipation';
import PaymentReport from './pages/eventDetails/PaymentReport';
import EventOfficial from './pages/EventOfficial';
import EventOrganisers from './pages/EventOrganisers';
import EventParticipantsDetails from './pages/eventDetails/EventParticipantsDetails';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import StateClubs from './pages/state/StateClubs';
import StateLayout from './pages/state/StateLayout';
import StateEvent from './pages/state/StateEvents';
import StateProfile from './pages/state/StateProfile';
import DistrictLayout from './pages/district/DistrictLayout';
import DistrictClubs from './pages/district/StateClubs';
import DistrickEvents from './pages/district/DistrickEvents';
import DistrictProfile from './pages/district/DistrickProfile';
import StateDashboard from './pages/state/StateDashboard';
import DistrictDashboard from './pages/district/DistrictDashboard';
import OrganiserLayout from './pages/organiser/OrganiserLayout';
import District from './pages/organiser/District';
import ClubsOrganiser from './pages/organiser/ClubsOrganiser';
import EventAdminLayout from './pages/eventAdmin/EventAdminLayout';
import EventAdminRegistrations from './pages/eventAdmin/EventParticipantsDetails';
import { ProtectedRoute } from './ProtectedRoute';
import { PlayerProvider } from './context/PlayerContext';
import EventAdmins from './pages/users/EventAdmins';
import RegisterClub from './pages/RegisterClub';

function App() {
  const clubId: any = 1;
  const stateId: any = 29;
  const stateSecretaryId: any = "TNS001";
  const districtId = 1;
  const districtSecretaryId = "TNAR0002";
  const eventId = 1;

  return (
    <Router>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
      />
      <PlayerProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
              <Route path="registerClub" element={<RegisterClub />} />

          {/* Admin Routes */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route
              path="/"
              element={<Layout />}
            >
              <Route index element={<Dashboard />} />
              <Route path="users/players" element={<Players />} />
              <Route path="users/clubs" element={<Clubs />} />
              <Route path="users/districts" element={<Districts />} />
              <Route path="users/states" element={<States />} />
              <Route path="users/admins" element={<Admins />} />
              <Route path="users/eventAdmin" element={<EventAdmins />} />
              <Route path="approvals/players" element={<PlayersApproval />} />
              <Route path="approvals/clubs" element={<ClubsApproval />} />
              <Route path="approvals/districts" element={<DistrictsApproval />} />
              <Route path="approvals/states" element={<StatesApproval />} />
              <Route path="events" element={<Events />} />
              <Route path="/eventsDetails/participation" element={<EventParticipation />} />
              <Route path="/eventsDetails/event-participation/:eventId" element={<EventParticipantsDetails />} />
              <Route path="/eventsDetails/payment" element={<PaymentReport />} />
              <Route path="/eventOfficial" element={<EventOfficial />} />
              <Route path="/eventOrganisers" element={<EventOrganisers />} />
              <Route path="gallery" element={<Gallery />} />
              <Route path="news" element={<News />} />

            </Route>
          </Route>

          {/* Player Routes */}
          <Route element={<ProtectedRoute allowedRoles={['player']} />}>
            <Route
              path="/player"
              element={<PlayerLayout />}
            >
              <Route index element={<PlayerDashboard />} />
              <Route path="events" element={<UpcomingEvents />} />
              <Route path="my-events" element={<MyEvents />} />
              <Route path="profile" element={<PlayerProfile />} />
            </Route>
          </Route>
          {/* Event Official Routes */}
          <Route element={<ProtectedRoute allowedRoles={['official']} />}>
            <Route
              path="/official"
              element={<OfficialLayout />}
            >
              <Route index element={<OfficialDashboard />} />
              <Route path="schedules" element={<ScheduleManagement />} />
              <Route path="update-results" element={<UpdateResults />} />
              <Route path="results" element={<ResultsView />} />
              <Route path="participants" element={<ParticipantsView />} />
              <Route path="reports" element={<ReportsPage />} />
            </Route>
          </Route>

          {/* Club Routes */}
          <Route element={<ProtectedRoute allowedRoles={['club']} />}>
            <Route
              path="/club"
              element={<ClubLayout />}
            >
              <Route index element={<ClubDashboard />} />
              <Route path="players" element={<ClubPlayers clubId={clubId} />} />
              <Route path="events" element={<ClubEvents clubId={clubId} />} />
              <Route path="reports" element={<ClubReports clubId={clubId} />} />
              <Route path="profile" element={<ClubProfile clubId={clubId} />} />
            </Route>
          </Route>

          {/* State Secretary Routes */}
          <Route element={<ProtectedRoute allowedRoles={['state_secretary']} />}>
            <Route
              path="/state"
              element={<StateLayout />}
            >
              <Route index element={<StateDashboard />} />
              <Route path="club" element={<StateClubs stateId={stateId} />} />
              <Route path="players" element={<ClubPlayers clubId={clubId} />} />
              <Route path="events" element={<StateEvent />} />
              <Route path="reports" element={<ClubReports clubId={clubId} />} />
              <Route path="profile" element={<StateProfile stateId={stateId} stateSecretaryId={stateSecretaryId} />} />
            </Route>
          </Route>

          {/* District Secretary Routes */}
          <Route element={<ProtectedRoute allowedRoles={['district_secretary']} />}>
            <Route
              path="/district"
              element={<DistrictLayout />}
            >
              <Route index element={<DistrictDashboard />} />
              <Route path="club" element={<DistrictClubs districtId={districtId} />} />
              <Route path="players" element={<ClubPlayers clubId={clubId} />} />
              <Route path="events" element={<DistrickEvents />} />
              <Route path="reports" element={<ClubReports clubId={clubId} />} />
              <Route path="profile" element={<DistrictProfile districtId={districtId} districtSecretaryId={districtSecretaryId} />} />
            </Route>
          </Route>

          {/* Organiser Routes */}
          <Route element={<ProtectedRoute allowedRoles={['event_organiser']} />}>
            <Route
              path="/organiser"
              element={<OrganiserLayout />}
            >
              <Route index element={<DistrictDashboard />} />
              <Route path="club" element={<ClubsOrganiser districtId={districtId} />} />
              <Route path="district" element={<District districtId={districtId} />} />
              <Route path="events" element={<DistrickEvents />} />
              <Route path="reports" element={<ClubReports clubId={clubId} />} />
              <Route path="profile" element={<DistrictProfile districtId={districtId} districtSecretaryId={districtSecretaryId} />} />
            </Route>
          </Route>

          {/* Event Admin Routes */}
          <Route element={<ProtectedRoute allowedRoles={['eventAdmin']} />}>
            <Route
              path="/eventAdmin"
              element={<EventAdminLayout />}
            >
              <Route index element={<EventAdminRegistrations />} />
              <Route path="registrations" element={<EventAdminRegistrations />} />
              {/* <Route path="district" element={<District districtId={districtId} />} />
          <Route path="events" element={<DistrickEvents clubId={clubId} districtId={districtId}/>} />
          <Route path="reports" element={<ClubReports clubId={clubId} />} />
          <Route path="profile" element={<DistrictProfile districtId={districtId} districtSecretaryId={districtSecretaryId} />} /> */}
            </Route>
          </Route>

        </Routes>
      </PlayerProvider>
    </Router>
  );
}

export default App;