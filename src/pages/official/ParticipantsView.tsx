import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Search, Users, Trophy } from 'lucide-react';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import Badge from '../../components/UI/Badge';
import Table from '../../components/UI/Table';

const baseURL = import.meta.env.VITE_API_BASE_URL;
const eventId = localStorage.getItem('eventId')

const ParticipantsView: React.FC = () => {
  const [participants, setParticipants] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [clubFilter, setClubFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [genderFilter, setGenderFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [getEvents,setEvents]=useState([])

  const fetchParticipants = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${baseURL}/registrations/search?eventId=${eventId}`);
      setParticipants(response.data || []);
    } catch (error) {
      console.error('Error fetching participants:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEvents=async()=>{
     try {
      const response = await axios.get(`${baseURL}/events/${eventId}`);
      setEvents(response.data || []);
    } catch (error) {
      console.error('Error fetching participants:', error);
    } 
  }

  useEffect(() => {
    fetchParticipants();
    fetchEvents()
  }, []);

  console.log(getEvents,"getEvents");
  

  const filteredParticipants = participants.filter((participant) => {
    const player = participant.player;
    if (!player) return false;

    const matchesSearch =
      player?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      player?.clubName?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesClub = clubFilter === 'all' || player.clubName === clubFilter;
    const matchesCategory = categoryFilter === 'all' || participant.skateCategory === categoryFilter;
    const matchesGender = genderFilter === 'all' || player.gender.toLowerCase() === genderFilter;
    const matchesStatus =
      statusFilter === 'all' ||
      (participant.result ? 'completed' : 'scheduled') === statusFilter;

    return matchesSearch && matchesClub && matchesCategory && matchesGender && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'scheduled': return 'info';
      case 'not_scheduled': return 'warning';
      default: return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return 'Completed';
      case 'scheduled': return 'Scheduled';
      case 'not_scheduled': return 'Not Scheduled';
      default: return status;
    }
  };

  const viewPlayerResults = (playerId: string) => {
    alert(`Player results view would be implemented here for player ID: ${playerId}`);
  };

  const columns = [
    { key: 'playerId', label: 'Player ID', render: (_: any, p: any) => `${p.player?.playerId}` },
    { key: 'playerName', label: 'Player Name', render: (_: any, p: any) => p.player?.name || 'N/A' },
    {
      key: 'gender',
      label: 'Gender',
      render: (_: any, p: any) => (
        <Badge variant="info" size="sm">
          {p.player?.gender ? p.player.gender.charAt(0).toUpperCase() + p.player.gender.slice(1) : 'N/A'}
        </Badge>
      ),
    },
    { key: 'ageGroup', label: 'Age Group', render: (_: any, p: any) => p.ageGroup || 'N/A' },
    { key: 'club', label: 'Club', render: (_: any, p: any) => p.player?.clubName || 'N/A' },
    { key: 'district', label: 'District', render: (_: any, p: any) => p.player?.districtName || 'N/A' },
    {
      key: 'category',
      label: 'Category',
      render: (_: any, p: any) => (
        <Badge variant="default" size="sm">
          {p.skateCategory || 'N/A'}
        </Badge>
      ),
    },
    {
      key: 'racesRegistered',
      label: 'Races Registered',
      render: (_: any, p: any) => p.selectedRaces?.length || 0,
    },
    // {
    //   key: 'status',
    //   label: 'Status',
    //   render: (_: any, p: any) => {
    //     const status = p.result ? 'completed' : 'scheduled';
    //     return (
    //       <Badge variant={getStatusColor(status) as any} size="sm">
    //         {getStatusLabel(status)}
    //       </Badge>
    //     );
    //   },
    // },
    // {
    //   key: 'actions',
    //   label: 'Actions',
    //   render: (_: any, p: any) => (
    //     <Button
    //       size="sm"
    //       variant="primary"
    //       onClick={() => viewPlayerResults(p.player?.playerId)}
    //       title="View Results"
    //     >
    //       <Trophy size={16} />
    //     </Button>
    //   ),
    // },
  ];

  const uniqueClubs = [...new Set(participants.map((p) => p.player?.clubName).filter(Boolean))];
  const uniqueCategories = [...new Set(participants.map((p) => p.skateCategory).filter(Boolean))];

  console.log(filteredParticipants, "filteredParticipants");


  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Event Participants</h1>
        <p className="text-gray-600 mt-1">View and manage all participants for Event #{eventId}</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Participants</p>
              <p className="text-2xl font-bold text-gray-900">{participants.length}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <Trophy className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">
                {participants.filter((p) => p.status === 'completed').length}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Users className="text-yellow-600" size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Scheduled</p>
              <p className="text-2xl font-bold text-gray-900">
                {participants.filter((p) => p.status === 'scheduled').length}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-red-100 rounded-lg">
              <Users className="text-red-600" size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Not Scheduled</p>
              <p className="text-2xl font-bold text-gray-900">
                {participants.filter((p) => p.status === 'not_scheduled').length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search participants by name or club..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Club</label>
              <select
                value={clubFilter}
                onChange={(e) => setClubFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="all">All Clubs</option>
                {uniqueClubs.map((club) => (
                  <option key={club} value={club}>
                    {club}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="all">All Categories</option>
                {uniqueCategories.map((category) => (
                  <option key={category} value={category}>
                    {category?.charAt(0)?.toUpperCase() + category?.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
              <select
                value={genderFilter}
                onChange={(e) => setGenderFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="all">All Genders</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

          </div>
        </div>
      </Card>

      {/* Participants Table */}
      <Card>
        {loading ? (
          <p className="text-center text-gray-500 py-10">Loading participants...</p>
        ) : (
          <Table columns={columns} data={filteredParticipants} />
        )}
      </Card>
    </div>
  );
};

export default ParticipantsView;
