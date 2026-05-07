import React, { useEffect, useMemo } from 'react';
import axios from 'axios';
import { Edit, Trash2, Eye, Plus, Download } from 'lucide-react';
import Table from '../../components/UI/Table';
import Button from '../../components/UI/Button';
import Badge from '../../components/UI/Badge';
import Card from '../../components/UI/Card';
import PlayerModal from '../../components/Users/PlayerModal';
import { Player } from '../../types';
import { toast } from 'react-toastify';
import { exportToExcel } from '../../ExportToExcel/ExportToExcel';

const baseURL = import.meta.env.VITE_API_BASE_URL;
const Players: React.FC = () => {
  const [players, setPlayers] = React.useState<Player[]>([]);
  const [sortBy, setSortBy] = React.useState<string>('');
  const [sortOrder, setSortOrder] = React.useState<'asc' | 'desc'>('asc');
  const [showModal, setShowModal] = React.useState(false);
  const [selectedPlayer, setSelectedPlayer] = React.useState<Player | null>(null);
  const [modalMode, setModalMode] = React.useState<'create' | 'edit' | 'view'>('create');
  const [statusFilter, setStatusFilter] = React.useState<string>('all');

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    try {
      const response = await axios.get(`${baseURL}/players/`);

      setPlayers(response.data);
    } catch (error) {
      console.error('Failed to fetch players:', error);
    }
  };

  const handleSort = (key: string) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(key);
      setSortOrder('asc');
    }

    const sorted = [...players].sort((a, b) => {
      const aValue = a[key as keyof Player];
      const bValue = b[key as keyof Player];

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setPlayers(sorted);
  };


  const handleCreatePlayer = () => {
    setSelectedPlayer(null);
    setModalMode('create');
    setShowModal(true);
  };

  const handleViewPlayer = (player: any) => {
    console.log('View player:', player);

    setSelectedPlayer(player);
    setModalMode('view');
    setShowModal(true);
  };

  const handleEditPlayer = (player: Player) => {
    setSelectedPlayer(player);
    setModalMode('edit');
    setShowModal(true);
  };

  const handleDeletePlayer = async (playerId: number) => {
    if (confirm('Are you sure you want to delete this player?')) {
      try {
        const res = await axios.delete(`${baseURL}/players/${playerId}`);
        toast.success(res?.data?.message || "Data deleted successfuly!")
        fetchPlayers();
      } catch (error: any) {
        console.error('Delete failed:', error);
        toast.error(error?.res?.data?.message || 'Data failed to delete!')
      }
    }
  };

  const handleSavePlayer = async (playerData: Partial<Player>) => {
    try {
      if (modalMode === 'create') {
        const response = await axios.put(`${baseURL}/players/`, playerData);
        toast.success(response?.data?.message || 'Player added successfully!');
        setShowModal(false)

      } else if (modalMode === 'edit' && selectedPlayer) {
        const response = await axios.put(`${baseURL}/players/${selectedPlayer.playerId}`, playerData);
        setShowModal(false)
        toast.success(response?.data?.message || 'Player updated successfully!');
      }
      setShowModal(false);
      fetchPlayers();
    } catch (error:any) {
      console.error('Save failed:', error);
      toast.error(error?.response?.data?.message)
    }
  };

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

  const columns = [
    { key: 'playerId', label: 'Player ID', sortable: true },
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    {
      key: 'dob',
      label: 'Age',
      sortable: true,
      render: (value: string) => calculateAge(value)
    },
    { key: 'clubName', label: 'Club', sortable: true },
    {
      key: 'gender',
      label: 'Gender',
      sortable: true,
      render: (value: string) => (
        <Badge variant="info" size="sm">
          {value}
        </Badge>
      )
    },
    { key: 'schoolName', label: 'School Name', sortable: true },
    {
      key: 'skateCategory',
      label: 'Category',
      sortable: true,
      render: (value: string) => (
        <Badge variant="default" size="sm">
          {value}
        </Badge>
      )
    },
    { key: 'districtName', label: 'District', sortable: true },
    {
      key: 'approvalStatus',
      label: 'Status',
      sortable: true,
      render: (value: string) => {
        let variant: 'success' | 'warning' | 'danger' = 'warning';
        let label = 'Pending';

        if (value === 'approved') {
          variant = 'success';
          label = 'Approved';
        } else if (value === 'rejected') {
          variant = 'danger';
          label = 'Rejected';
        }

        return (
          <Badge variant={variant} size="sm">
            {label}
          </Badge>
        );
      }
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_value: any, row: Player) => (
        <div className="flex items-center space-x-2">
          <Button size="sm" variant="secondary" onClick={() => handleViewPlayer(row)}>
            <Eye size={16} />
          </Button>
          <Button size="sm" variant="primary" onClick={() => handleEditPlayer(row)}>
            <Edit size={16} />
          </Button>
          <Button size="sm" variant="danger" onClick={() => handleDeletePlayer(Number(row.playerId))}>
            <Trash2 size={16} />
          </Button>
        </div>
      )
    }
  ];

  // Filter players based on statusFilter
  const filteredPlayers = useMemo(() => {
    if (statusFilter === 'all') return players;
    return players.filter((player: any) => player.approvalStatus === statusFilter);
  }, [players, statusFilter]);

  return (
    <div className="space-y-6">


      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Players Management</h1>
          <p className="text-gray-600 mt-1">Manage registered players</p>
        </div>
        <div className='flex justify-end gap-2'>
          <Button variant="primary" onClick={handleCreatePlayer}>
            <Plus size={16} className="mr-2" />
            Add New Player
          </Button>
          <Button variant="secondary" onClick={() => exportToExcel(players, 'player_list')}>
            <Download size={16} className='mr-2' />
            Export to Excel
          </Button>
        </div>


      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{players.length}</div>
            <div className="text-sm text-gray-600">Total Players</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {players.filter((d: any) => d.approvalStatus === 'approved').length}
            </div>
            <div className="text-sm text-gray-600">Approved</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {players.filter((d: any) => d.approvalStatus === 'pending').length}
            </div>
            <div className="text-sm text-gray-600">Pending Approval</div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-gray-700">Filter by Status:</span>
          <div className="flex space-x-2">
            {[
              { value: 'all', label: 'All Players' },
              { value: 'approved', label: 'Approved' },
              { value: 'pending', label: 'Pending' },
            ].map((status) => (
              <button
                key={status.value}
                onClick={() => setStatusFilter(status.value)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${statusFilter === status.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                {status.label}
              </button>
            ))}
          </div>
        </div>
      </Card>

      <Card>
        <Table
          columns={columns}
          data={filteredPlayers}
          searchable
          searchPlaceholder="Search players..."
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={handleSort}
        />
      </Card>

      <PlayerModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSavePlayer}
        player={selectedPlayer}
        mode={modalMode}
      />
    </div>
  );
};

export default Players;
