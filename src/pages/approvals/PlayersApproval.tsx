import React, { useEffect } from 'react';
import { Check, X, Eye, Edit } from 'lucide-react';
import Table from '../../components/UI/Table';
import Button from '../../components/UI/Button';
import Badge from '../../components/UI/Badge';
import Card from '../../components/UI/Card';
import axios from 'axios';
import { toast } from 'react-toastify';

const baseURL = import.meta.env.VITE_API_BASE_URL;
const PlayersApproval: React.FC = () => {

  // approvalStatus
  const [pendingPlayers, setPendingPlayers] = React.useState<any>([]);

  const handleApprove = async (playerId: string) => {
    try {
      const res = await axios.put(`${baseURL}/players/${playerId}/approve`);
      toast.success(res?.data?.message || 'Player approved.')
      fetchPlayers(); // Refresh the pending players list
    } catch (error: any) {
      toast.error(error?.res?.data?.message || "Failed to approve player")
      console.error(`Failed to approve player ${playerId}:`, error);
    }
  };

  const handleReject = async (playerId: number) => {
    try {
     const res= await axios.put(`${baseURL}/players/${playerId}/reject`);
     toast.success(res?.data?.message || 'Data rejected succesfully!')
      await fetchPlayers(); // Refresh data
      setPendingPlayers((prev: any) => prev.filter((player: any) => player.id !== playerId)); // Optimistic update
    } catch (error:any) {
      console.error(`Failed to reject player ${playerId}:`, error);
   toast.error(error?.res?.data?.message || 'Data rejected failed')
    }
  };

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    try {
      const response = await axios.get(`${baseURL}/players/`);
      console.log(response, "Fetched players");

      // ✅ Filter only players with approvalStatus 'pending'
      const pending = response.data.filter((player: any) => player?.approvalStatus === 'pending');
      setPendingPlayers(pending);
    } catch (error) {
      console.error('Failed to fetch players:', error);
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
    { key: 'playerId', label: 'Player ID' },
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    {
      key: 'dob',
      label: 'Age',
      sortable: true,
      render: (value: string) => calculateAge(value)
    },
    {
      key: 'gender',
      label: 'Gender',
      render: (value: string) => (
        <Badge variant="info" size="sm">
          {value}
        </Badge>
      )
    },
    { key: 'clubName', label: 'Club' },
    {
      key: 'skateCategory',
      label: 'Category',
      render: (value: string) => (
        <Badge variant="default" size="sm">
          {value}
        </Badge>
      )
    },
    {
      key: 'createdAt',
      label: 'Applied Date',
      render: (value: string) => new Date(value).toLocaleDateString()
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (value: any, player: any) => (
        <div className="flex items-center space-x-2">
          {/* <Button size="sm" variant="secondary">
            <Eye size={16} />
          </Button>
          <Button size="sm" variant="primary">
            <Edit size={16} />
          </Button> */}
          <Button
            size="sm"
            variant="success"
            onClick={() => handleApprove(player.playerId)}
          >
            <Check size={16} />
          </Button>
          <Button
            size="sm"
            variant="danger"
            onClick={() => handleReject(player.playerId)}
          >
            <X size={16} />
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Players Pending Approval</h1>
          <p className="text-gray-600 mt-1">Review and approve player registrations</p>
        </div>
        <Badge variant="warning">
          {pendingPlayers.length} Pending
        </Badge>
      </div>

      <Card>
        <Table
          columns={columns}
          data={pendingPlayers}
          searchable
          searchPlaceholder="Search pending players..."
        />
      </Card>
    </div>
  );
};

export default PlayersApproval;