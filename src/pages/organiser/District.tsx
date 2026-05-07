import React, { useEffect } from 'react';
import Table from '../../components/UI/Table';
import axios from 'axios';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import { exportToExcel } from '../../ExportToExcel/ExportToExcel';

// const ClubPlayers: React.FC = ({districtId}:any) => {
const ClubPlayers: any = ({ districtId }: any) => {


  const eventId = localStorage.getItem('eventId')
  const [players, setPlayers] = React.useState<any[]>([]);



  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/registrations/count-by-district-all/${eventId}/`
        );
        setPlayers(response.data);
        console.log(response?.data)
      } catch (error) {
        console.error('Failed to fetch players:', error);
      }
    };

    fetchPlayers();
  }, [eventId]);


  const columns = [
    {
      key: 'districtId',
      label: 'S.No',
      sortable: false,

    },
    { key: 'districtName', label: 'District Name', sortable: true },
    { key: 'registrationCount', label: 'Registration Count', sortable: true },

  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">District</h1>
          <p className="text-gray-600 mt-1">Manage players registered under your club</p>
        </div>
        <div className='flex justify-end'>
                    <Button variant="secondary" onClick={() => exportToExcel(players, 'Districk')}>
                        Export to Excel
                    </Button>
                </div>
      </div>

      <Card>
        <Table
          columns={columns}
          data={players}
        />
      </Card>

    </div>
  );
};

export default ClubPlayers;