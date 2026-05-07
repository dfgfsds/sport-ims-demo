import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Download } from 'lucide-react';
import Card from '../../components/UI/Card';
import Table from '../../components/UI/Table';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://sportims-api.justvy.com';

const ClubRegistrations: React.FC = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>('');
  const [clubRegistrations, setClubRegistrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const districtId = localStorage.getItem('districtId');
  // Fetch events for dropdown
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/events/get-all-with-full-details`);
        setEvents(res.data || []);
      } catch (err) {
        setEvents([]);
      }
    };
    fetchEvents();
  }, []);

  // Fetch club registrations for selected event
  useEffect(() => {
    if (!selectedEventId) {
      setClubRegistrations([]);
      return;
    }
    setLoading(true);
    axios
      .get(`${API_BASE_URL}/registrations/clubs/${selectedEventId}/${districtId}/`)
      .then((res) => setClubRegistrations(res.data || []))
      .catch(() => setClubRegistrations([]))
      .finally(() => setLoading(false));
  }, [selectedEventId]);

  // Table columns
  const columns = [
    { key: 'clubName', label: 'Club Name', sortable: true },
    { key: 'registrationCount', label: 'Registrations Count', sortable: true },
  ];

  // Export CSV
  const handleExport = () => {
    const csvContent = [
      ['Club Name', 'Registrations Count'],
      ...clubRegistrations.map((c) => [c.clubName, c.registrationCount]),
    ]
      .map((row) => row.join(','))
      .join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'club_registrations.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Club Registrations by Event</h1>
        <p className="text-gray-600 mt-1">Select an event to view club registration counts</p>
      </div>
      <div className="flex justify-between mb-4">
        <select
          className="border border-gray-300 rounded-md px-3 py-2"
          value={selectedEventId}
          onChange={(e) => setSelectedEventId(e.target.value)}
        >
          <option value="">Select Event</option>
          {events.map((event: any) => (
            <option key={event.id} value={event.id}>
              {event.name}
            </option>
          ))}
        </select>
        <button
          onClick={handleExport}
          className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
          disabled={!clubRegistrations.length}
        >
          <Download size={16} className="mr-1" />
          Export
        </button>
      </div>
      <Card title="Club Registrations">
        {loading ? (
          <div className="p-6 text-center text-gray-500">Loading...</div>
        ) : (
          <Table
        columns={[
          { key: 'sno', label: 'S.No', sortable: false },
          ...columns,
        ]}
        data={clubRegistrations.map((item, idx) => ({
          ...item,
          sno: idx + 1,
        }))}
          />
        )}
      </Card>
    </div>
  );
};

export default ClubRegistrations;
