import React, { useEffect, useState } from 'react';
import { Users, Building2, MapPin, Map, Calendar, Gift } from 'lucide-react';
import StatsCard from '../components/UI/StatsCard';
import Card from '../components/UI/Card';
import Badge from '../components/UI/Badge';
import { mockDashboardStats } from '../data/mockData';
import axios from 'axios';
import { useDashboardCounts } from '../context/DashboardCountContext';
import { Count } from '../types';
import { api } from '../lib/api';

const Dashboard: React.FC = () => {

  const [counts, setCounts] = useState<any>(null);
  const [birthdays, setBirthdays] = useState<any[]>([]); // using 'any[]'

  //  const counts = useDashboardCounts();
  // const stats = mockDashboardStats;
  const baseURL = import.meta.env.VITE_API_BASE_URL;



  const [events, setEvents] = useState<any>([]);



  useEffect(() => {
    fetchEvents();
    fetchUsersCounts();
    fetchUpcomingBirthdays();
  }, []);

  const fetchUsersCounts = async () => {
    try {
      const response = await api.get(`${baseURL}/stats/approved-counts`);
      setCounts(response.data);

    } catch (e) {
      console.error("Error fetching counts:", e);
    }

  };

  const fetchUpcomingBirthdays = async () => {
    try {
      const res = await api.get(`${baseURL}/stats/upcoming-birthdays`);
      setBirthdays(res.data);
    }
    catch (e) {

    }

  };

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${baseURL}/events/`);
      setEvents(response.data);
    } catch (error) {
      console.error('Failed to fetch events:', error);
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome to Sport-IMS</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Registered Players"
          value={counts?.approvedPlayers ?? 0}
          icon={Users}
          color="blue"
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="Registered Clubs"
          value={counts?.approvedClubs ?? 0}
          icon={Building2}
          color="green"
          trend={{ value: 8, isPositive: true }}
        />
        <StatsCard
          title="Districts"
          value={counts?.approvedDistrictSecretaries ?? 0}
          icon={MapPin}
          color="yellow"
          trend={{ value: 0, isPositive: true }}
        />
        <StatsCard
          title="States"
          value={counts?.approvedStateSecretaries ?? 0}
          icon={Map}
          color="purple"
          trend={{ value: 0, isPositive: true }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Events */}
        <Card title="Upcoming Sports Events">
          <div className="space-y-4">
            {events
              ?.filter((event: any) => {
                const eventDate = new Date(event.eventDate);
                const today = new Date();
                today.setHours(0, 0, 0, 0); // remove time portion

                // Check only events that are strictly in the future
                return eventDate > today;
              })
              ?.sort((a: any, b: any) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime())
              ?.map((event: any) => (
                <div key={event.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Calendar className="text-blue-600" size={20} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{event.name}</p>
                      <p className="text-sm text-gray-500">{event.venue || 'Venue not available'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(event.eventDate).toLocaleDateString()}
                    </p>
                    <Badge variant="info" size="sm">
                      Upcoming
                    </Badge>
                  </div>
                </div>
              ))}
            {events?.length === 0 && (
              <p className="text-gray-500 text-center py-4">No upcoming events</p>
            )}
          </div>
        </Card>

        {/* Upcoming Birthdays */}
        <Card title="Upcoming Player Birthdays">
          <div className="space-y-4">
            {birthdays.slice(0, 5).map((birthdays) => (
              <div key={birthdays.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-pink-100 rounded-lg">
                    <Gift className="text-pink-600" size={20} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{birthdays.name}</p>
                    <p className="text-sm text-gray-500">{birthdays.playerId}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    Age {calculateAge(birthdays.date) + 1}
                  </p>
                  <p className="text-sm text-gray-500">
                    {birthdays.date?.split('-').reverse().join('-')}
                  </p>
                </div>
              </div>
            ))}
            {birthdays.length === 0 && (
              <p className="text-gray-500 text-center py-4">No upcoming birthdays</p>
            )}
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      {/* <Card title="Recent Activity">
        <div className="space-y-4">
          <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <p className="text-sm text-gray-700">
              <span className="font-medium">Michael Rodriguez</span> submitted registration for approval
            </p>
            <span className="text-xs text-gray-500 ml-auto">2 hours ago</span>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <p className="text-sm text-gray-700">
              <span className="font-medium">California State Championship 2024</span> event created
            </p>
            <span className="text-xs text-gray-500 ml-auto">1 day ago</span>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <p className="text-sm text-gray-700">
              <span className="font-medium">Thunder Skating Club</span> updated contact information
            </p>
            <span className="text-xs text-gray-500 ml-auto">3 days ago</span>
          </div>
        </div>
      </Card> */}
    </div>
  );
};

export default Dashboard;