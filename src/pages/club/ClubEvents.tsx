import React, { useEffect, useState } from 'react';
import { Calendar, Users, Clock, CheckCircle, XCircle, Lock, Eye, UserPlus, Search, Download } from 'lucide-react';
import Card from '../../components/UI/Card';
import Tabs from '../../components/UI/Tabs';
import Button from '../../components/UI/Button';
import Badge from '../../components/UI/Badge';
import Table from '../../components/UI/Table';
import Modal from '../../components/UI/Modal';
import FormField from '../../components/UI/FormField';
import { mockEvents, mockPlayers, mockSchedules } from '../../data/mockData';
import { Event, Player } from '../../types';
import axios from 'axios';
import ClubResultModal from './ClubResultModal';


const ClubEvents: any = () => {
  const currentClubId = localStorage.getItem("clubId");
  const [selectedEvent, setSelectedEvent] = React.useState<any>(null);
  const [showRegistrationModal, setShowRegistrationModal] = React.useState(false);
  const [selectedPlayers, setSelectedPlayers] = React.useState<string[]>([]);
  const [allEvents, SetAllEvents] = useState<any[]>([])
  const [registeredPlayers, setRegisteredPlayers] = useState<any[]>([]);
  const [notRegisteredPlayers, setNotRegisteredPlayers] = useState<any[]>([]);
  const [resultModal, setResultModal] = useState(false);
  const [resultData,setResultData]=useState<any>('')
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPlayers, setFilteredPlayers] = useState<any[]>([]);
  const [searchAvailableQuery, setSearchAvailableQuery] = useState('');
  const [filteredNotRegisteredPlayers, setFilteredNotRegisteredPlayers] = useState<any[]>([]);
  const [eventData, setEventData] = useState<any>('');

  useEffect(() => {
    const filtered = notRegisteredPlayers.filter((player: any) =>
      player.name?.toLowerCase().includes(searchAvailableQuery.toLowerCase()) ||
      player.playerId?.toString().includes(searchAvailableQuery) ||
      player.clubName?.toLowerCase().includes(searchAvailableQuery.toLowerCase()) ||
      player.gender?.toLowerCase().includes(searchAvailableQuery.toLowerCase()) ||
      player.skateCategory?.toLowerCase().includes(searchAvailableQuery.toLowerCase())
    );
    setFilteredNotRegisteredPlayers(filtered);
  }, [searchAvailableQuery, notRegisteredPlayers]);


  useEffect(() => {
    const fetchAllEvents = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/events/get-all-with-full-details`
        );
        SetAllEvents(response.data);
        console.log(response?.data)
      } catch (error) {
        console.error('Failed to fetch players:', error);
      }
    };

    fetchAllEvents();
  }, []);

  // const currentClubId = localStorage.getItem("clubId");
  const clubId = localStorage.getItem("id");
  const clubName = localStorage.getItem("clubName");
  const coachName = localStorage.getItem("coachName");

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/registrations/clubs/${clubId}/event/${selectedEvent?.id}/players`
        );
        setRegisteredPlayers(response.data?.registeredPlayers);
        setNotRegisteredPlayers(response?.data?.nonRegisteredPlayers)
        // console.log(response?.data)
      } catch (error) {
        console.error('Failed to fetch players:', error);
      }
    };

    fetchRegistrations();
  }, [selectedEvent?.id]);

     useEffect(() => {

    //fetch event details and set data in eventData state
    axios
        .get(`${import.meta.env.VITE_API_BASE_URL}/events/${selectedEvent?.id}`)
        .then((res) => {
            console.log('Event details:', res.data);
            setEventData(res.data);
        })
        .catch((err) => console.error(err));





   }, [selectedEvent?.id]); 


  useEffect(() => {
    const filtered: any = registeredPlayers?.filter((player: any) =>
      player?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      player?.gender?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      player?.clubName?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredPlayers(filtered);
    console.log("filtered", filtered);
  }, [searchQuery, registeredPlayers]);

  const handleExport = () => {

    
console.log('player', filteredPlayers[0]  );

        const raceNames = Array.isArray(eventData?.races)
            ? eventData?.races?.map((race: any) => race.name.toUpperCase())
            : [];
        const csvHeader = [
            'S.No',
            'Name',
            'Aadhar Number',
            'Club Name',
            'Chest No',
            'Dob',
            'Age Group',
            'Category',
            'Amount',
            'Registration Date',
            ...raceNames
        ];
        const csvRows = registeredPlayers.map((p: any, index: number) => {
            // Create a map of selected race names for quick lookup
            const selectedRaceNames = Array.isArray(p.registration?.selectedRaces)
            ? p.registration.selectedRaces.map((race: any) => (race?.name || '').toUpperCase())
            : [];

            // For each race header, check if the participant has that race
            const raceColumns = raceNames.map((raceName: string) =>
            selectedRaceNames.includes(raceName) ? 'YES' : ''
            );

            return [
            (index + 1).toString().toUpperCase(),
            (p.player?.name || p.name || '').toUpperCase(),
            (p.registration?.player?.aadharNumber || '').toUpperCase(),
            (p.registration?.clubName || '').toUpperCase(),
            (p.registration?.chestNumber || '').toString().toUpperCase(),
            p.registration?.player?.dob
                ? new Date(p.registration.player.dob).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
                }).replace(/ /g, ' ').toLocaleUpperCase()
                : '',
            (p.registration?.ageGroup || '').toUpperCase(),
            (p.registration?.skateCategory || '').toUpperCase(),
            (p.registration?.amountPaid || '').toString().toUpperCase(),
            p.registration?.regDate
                ? new Date(p.registration.regDate).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
                }).replace(/ /g, ' ').toLocaleUpperCase()
                : '',
            ...raceColumns
            ];
        });

        const csvContent = [csvHeader, ...csvRows].map((row) => row.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'event_participants.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

  const handleAvailableExport = () => {
    const csvContent = [
      [ 'Name', 'DOB', 'Gender', 'Club Name', 'Category'],
      ...filteredNotRegisteredPlayers.map((p) => [
        
        p.name,
        p.dob,
        p.gender,
        p.clubName,
        p.skateCategory
      ]),
    ]
      .map((e) => e.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'available_players.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  const clubPlayers = mockPlayers.filter(player =>
    player.clubId === currentClubId && player.approved
  );

  // Get events (both active and past)
  // const allEvents = mockEvents;

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      return age - 1;
    }
    return age;
  };

  const getRegisteredPlayers = (eventId: string) => {
    return mockSchedules
      .filter(schedule => schedule.eventId === eventId)
      .flatMap(schedule => schedule.participants)
      .filter(participant =>
        clubPlayers.some(player => player.id === participant.playerId)
      );
  };

  const getNotRegisteredPlayers = (eventId: string) => {
    const registeredPlayerIds = getRegisteredPlayers(eventId).map(p => p.playerId);
    return clubPlayers.filter(player => !registeredPlayerIds.includes(player.id));
  };

  const isRegistrationOpen = (event: any) => {
    const eventDate = new Date(event?.regStartingDate);
    const today = new Date();
    return eventDate < today;
  };

  const handleEventSelect = (event: Event) => {
    setSelectedEvent(event);
  };

  const handleRegisterPlayers = () => {
    if (!selectedEvent) return;
    setShowRegistrationModal(true);
  };

  const handlePlayerSelection = (playerId: string) => {
    setSelectedPlayers(prev =>
      prev.includes(playerId)
        ? prev.filter(id => id !== playerId)
        : [...prev, playerId]
    );
  };

  const handleSubmitRegistration = () => {
    // Here you would submit the registration to the backend
    console.log('Registering players:', selectedPlayers, 'for event:', selectedEvent?.id);
    alert(`Successfully registered ${selectedPlayers.length} players for ${selectedEvent?.name}!`);
    setShowRegistrationModal(false);
    setSelectedPlayers([]);
  };

  const eventsColumns = [
    { key: 'name', label: 'Event Name', sortable: true },
    { key: 'venue', label: 'Venue', sortable: true },
    {
      key: 'regStartingDate',
      label: 'Registration Date',
      sortable: true,
      render: (value: string, event: any) => (
        <div>
          <div>{new Date(event?.regStartingDate)?.toLocaleDateString()}</div>
          <div className="text-sm text-gray-500">to {new Date(event?.regEndingDate).toLocaleDateString()}</div>
        </div>
      )
    },
    {
      key: 'eventDate',
      label: 'Event Date',
      sortable: true,
      render: (value: string, event: any) => (
        <div>
          <div>{new Date(event?.eventDate)?.toLocaleDateString()}</div>
        </div>
      )
    },
    // { 
    //   key: 'status', 
    //   label: 'Status', 
    //   sortable: true,
    //   render: (value: string) => (
    //     <Badge variant={
    //       value === 'upcoming' ? 'info' :
    //       value === 'ongoing' ? 'warning' : 'default'
    //     } size="sm">
    //       {value?.charAt(0).toUpperCase() + value?.slice(1)}
    //     </Badge>
    //   )
    // },
    {
      key: 'actions',
      label: 'Actions',
      render: (value: any, event: Event) => (
        <Button size="sm" variant="primary" onClick={() => handleEventSelect(event)}>
          <Eye size={16} className="mr-2" />
          View Details
        </Button>
      )
    }
  ];

  const registeredPlayersColumns = [
    { key: 'name', label: 'Player Name' },
    { key: 'gender', label: 'Gender', render: (value: string) => value?.charAt(0)?.toUpperCase() },
        { 
          key: 'skateCategory', 
          label: 'Category', 
          render: (_: any, row: any) => row?.registration?.skateCategory?.toUpperCase() || '-' 
        },
        { 
          key: 'ageGroup', 
          label: 'Age Group', 
          render: (_: any, row: any) => row?.registration?.ageGroup?.toUpperCase() || '-' 
        },

    { key: 'clubName', label: 'club Name' },
    // {
    //   key: 'approvalStatus',
    //   label: 'Status',
    //   render: (value: string) => (
    //     <Badge variant={value === 'approved' ? 'success' : 'info'} size="sm">
    //       {value === 'approved' ? 'Approved' : 'Pending'}
    //     </Badge>
    //   )
    // },

    {
      key: 'rank',
      label: 'Details',
      render: (value: number, event: any) => (
        <div className="flex items-center space-x-2">
        <Button size="sm" variant="secondary" 
        onClick={() =>{ setResultModal(!resultModal),setResultData(event)}}
         title="View Details">
          <Eye size={16} />
        </Button>
        </div>
      )
    }
  ];

  const notRegisteredPlayersColumns = [
    // { key: 'playerId', label: 'Player Id' },
    { key: 'name', label: 'Player Name' },
    {
      key: 'dob',
      label: 'Age',
      render: (value: string) => calculateAge(value)
    },
    { key: 'clubName', label: 'club Name' },

    { key: 'gender', label: 'Gender', render: (value: string) => value?.charAt(0)?.toUpperCase() },
    { key: 'skateCategory', label: 'Category', render: (value: string) => value?.toUpperCase() },
    // { key: 'ageGroup', label: 'Age Group' }
  ];

  // const registeredPlayers = selectedEvent ? getRegisteredPlayers(selectedEvent.id) : [];
  // const notRegisteredPlayers = selectedEvent ? getNotRegisteredPlayers(selectedEvent.id) : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Club Events</h1>
        <p className="text-gray-600 mt-1">View and manage club participation in events</p>
      </div>

      {/* Events List */}
      {/* <Card title="All Events">
        <Table
          columns={eventsColumns}
          data={allEvents}
          searchable
          searchPlaceholder="Search events..."
        />
      </Card> */}

            {/* Events Dropdown */}
      <div className="mb-6">
        <label htmlFor="eventDropdown" className="block text-sm font-medium text-gray-700 mb-1">Select Event</label>
        <select
          id="eventDropdown"
          className="w-full md:w-100 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={selectedEvent?.id || ''}
          onChange={e => {

            console.log(e.target.value);
            const event = allEvents.find(ev => ev.id == e.target.value);
            // setSelectedEvent(event || null);
            handleEventSelect(event);
            
          }}
        >
          <option value="">-- Select an Event --</option>
          {allEvents.map(event => (
            <option key={event.id} value={event.id}>
              {event.name} ({new Date(event.eventDate).toLocaleDateString()})
            </option>
          ))}
        </select>
      </div>

      {/* Event Details */}
      {selectedEvent && (
        <div className="space-y-6">
          {/* <Card>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">{selectedEvent.name}</h2>
                <p className="text-gray-600 mb-4">{selectedEvent.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center">
                    <Calendar size={16} className="mr-2 text-gray-400" />
                    {new Date(selectedEvent.regStartingDate).toLocaleDateString()} - {new Date(selectedEvent.regEndingDate).toLocaleDateString()}
                  </div>
                  <div className="flex items-center">
                    <Clock size={16} className="mr-2 text-gray-400" />
                    {selectedEvent.venue}
                  </div>
                  <div className="flex items-center">
                    <Users size={16} className="mr-2 text-gray-400" />
                    {selectedEvent?.registrationCount} total participants
                  </div>

                  <div className="mb-6">
                    <h4 className="font-medium text-gray-900 mb-2">Age Groups:</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedEvent?.ageGroups?.map((ag: any) => (
                        <Badge key={ag?.id} variant="default" size="sm">
                          {ag?.ageGroupName}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-medium text-gray-900 mb-2">Available Races:</h4>
                    <div className="space-y-1">
                      {selectedEvent?.races?.slice(0, 3).map((race: any) => (
                        <div key={race.id} className="text-sm text-gray-600">
                          • {race.name}
                        </div>
                      ))}
                      {selectedEvent?.races?.length > 3 && (
                        <div className="text-sm text-gray-500">
                          +{selectedEvent.races.length - 3} more races
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Badge variant={
                  selectedEvent.status === 'upcoming' ? 'info' :
                  selectedEvent.status === 'ongoing' ? 'warning' : 'default'
                } size="sm">
                  {selectedEvent?.status?.charAt(0).toUpperCase() + selectedEvent.status?.slice(1)}
                </Badge>

                {isRegistrationOpen(selectedEvent) ? (
                  <Button variant="primary" onClick={handleRegisterPlayers}>
                    <UserPlus size={16} className="mr-2" />
                    Register Players
                  </Button>
                ) : (
                  <Button variant="secondary" disabled>
                    <Lock size={16} className="mr-2" />
                    Registration Closed
                  </Button>
                )}
              </div>
            </div>
          </Card> */}

          {/* Tab View for Registered/Not Registered Players */}
          <Tabs
            tabs={[
              {
                id: 'registered',
                label: `Registered Players (${registeredPlayers?.length})`,
                content: (
                  <Card>
                    <div className="px-6 py-4 border-b border-gray-200 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <h3 className="text-lg font-medium text-gray-900">
                        Registered Players from Your Club ({registeredPlayers?.length})
                      </h3>
                      <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="relative w-full md:w-64">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                          <input
                            type="text"
                            placeholder="Search players..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <button
                          onClick={handleExport}
                          className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                        >
                          <Download size={16} className="mr-1" />
                          Export
                        </button>
                      </div>
                    </div>
                    <div className="p-6">
                      {filteredPlayers?.length > 0 ? (
                        <Table columns={registeredPlayersColumns} data={filteredPlayers} />
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <CheckCircle className="mx-auto h-12 w-12 text-green-400 mb-4" />
                          <h3 className="text-lg font-medium text-gray-900 mb-2">No players registered</h3>
                          <p>No players from your club are registered for this event yet.</p>
                        </div>
                      )}
                    </div>
                  </Card>
                ),
              },
              {
                id: 'available',
                label: `Available Players (${notRegisteredPlayers?.length})`,
                content: (
                  <Card>
                    <div className="px-6 py-4 border-b border-gray-200 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <h3 className="text-lg font-medium text-gray-900">
                        Available Players for Registration ({notRegisteredPlayers?.length})
                      </h3>
                      <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="relative w-full md:w-64">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                          <input
                            type="text"
                            placeholder="Search players..."
                            value={searchAvailableQuery}
                            onChange={(e) => setSearchAvailableQuery(e.target.value)}
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <button
                          onClick={handleAvailableExport}
                          className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                        >
                          <Download size={16} className="mr-1" />
                          Export
                        </button>
                      </div>
                    </div>
                    {filteredNotRegisteredPlayers?.length > 0 ? (
                      <Table columns={notRegisteredPlayersColumns} data={filteredNotRegisteredPlayers} />
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <CheckCircle className="mx-auto h-12 w-12 text-green-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">All players registered</h3>
                        <p>All eligible players from your club are already registered for this event.</p>
                      </div>
                    )}
                  </Card>
                ),
              },
            ]}
          />

        </div>
      )}

      {/* Registration Modal */}
      <Modal
        isOpen={showRegistrationModal}
        onClose={() => setShowRegistrationModal(false)}
        title={`Register Players for ${selectedEvent?.name}`}
        size="xl"
      >
        <div className="space-y-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-medium text-blue-900 mb-2">Event Information</h3>
            <div className="text-sm text-blue-800">
              <p><strong>Event:</strong> {selectedEvent?.name}</p>
              <p><strong>Venue:</strong> {selectedEvent?.venue}</p>
              <p><strong>Dates:</strong> {selectedEvent && new Date(selectedEvent.startDate).toLocaleDateString()} - {selectedEvent && new Date(selectedEvent.endDate).toLocaleDateString()}</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Select Players to Register ({selectedPlayers.length} selected)
            </h3>

            <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg">
              {notRegisteredPlayers?.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {notRegisteredPlayers?.map(player => (
                    <div key={player?.id} className="p-3 hover:bg-gray-50">
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedPlayers.includes(player?.id)}
                          onChange={() => handlePlayerSelection(player?.id)}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-gray-900">{player?.name}</p>
                              <p className="text-sm text-gray-500">
                                {/* Age {calculateAge(player.dateOfBirth)} • {player.category.charAt(0).toUpperCase() + player.category.slice(1)} • {player.gender.charAt(0).toUpperCase() + player.gender.slice(1)} */}
                              </p>
                            </div>
                            <Badge variant="info" size="sm">
                              {player.ageGroup}
                            </Badge>
                          </div>
                        </div>
                      </label>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-gray-500">
                  No players available for registration
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button variant="secondary" onClick={() => setShowRegistrationModal(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmitRegistration}
              disabled={selectedPlayers.length === 0}
            >
              Register {selectedPlayers.length} Player{selectedPlayers.length !== 1 ? 's' : ''}
            </Button>
          </div>
        </div>
      </Modal>
      
      <ClubResultModal
      open={resultModal}
      close={()=>setResultModal(!resultModal)}
      resultData={resultData}
      />
    </div>
  );
};

export default ClubEvents;