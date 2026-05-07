import React, { useEffect, useState } from 'react';
import { Calendar, Users, Clock, Trophy, Search, MapPin } from 'lucide-react';
import Card from '../../components/UI/Card';
import Badge from '../../components/UI/Badge';
import Button from '../../components/UI/Button';
import { mockEvents, mockSchedules, mockPlayers } from '../../data/mockData';
import axios from 'axios';

const OfficialDashboard: React.FC = () => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedEvent] = React.useState(mockEvents[0]); // Current event being managed
const [eventData,setEventData]=useState<any>();
const eventId = localStorage.getItem("eventId");



  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/events/${eventId}`);
        console.log(eventId);
        const data = response.data;    
        setEventData(data);
      } catch (err) {
        console.error('Error fetching results:', err);
      }
    };
    fetchEvent()
  },[eventId])


  // Mock statistics for the current event
  const eventStats = {
    totalParticipants: 156,
    schedulesCreated: 24,
    schedulesPending: 8,
    resultsEntered: 15,
    resultsRemaining: 17
  };

  const recentSchedules = mockSchedules.slice(0, 5);
  const upcomingSchedules = [
    {
      id: '1',
      raceName: '100m Sprint',
      ageGroup: '10-12 years',
      category: 'beginner',
      scheduledTime: '2024-12-25T10:00:00',
      participants: 12,
      status: 'scheduled'
    },
    {
      id: '2',
      raceName: '200m Sprint',
      ageGroup: '13-15 years',
      category: 'fancy',
      scheduledTime: '2024-12-25T11:30:00',
      participants: 8,
      status: 'scheduled'
    }
  ];

  const handleQuickSearch = () => {
    if (searchQuery.trim()) {
      // Implement search logic here
      console.log('Searching for:', searchQuery);
    }
  };

  return (
    <div className="space-y-6">
      {/* Event Header */}
      <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{eventData?.event?.name}</h1>
            <div className="flex items-center space-x-4 mt-2 text-blue-100">
              <div className="flex items-center">
                <Calendar size={16} className="mr-1" />
                {new Date(eventData?.event?.regStartingDate).toLocaleDateString()} - {new Date(eventData?.event?.regEndingDate).toLocaleDateString()}
              </div>
              <div className="flex items-center">
                <MapPin size={16} className="mr-1" />
                {eventData?.event?.venue}
              </div>
            </div>
          </div>
          <Badge variant="success" size="sm" >
            {selectedEvent.status.charAt(0).toUpperCase() + selectedEvent.status.slice(1)}
          </Badge>
        </div>
      </Card>

      {/* Quick Search */}
      {/* <Card>
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Quick search: Find a player or schedule by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onKeyPress={(e) => e.key === 'Enter' && handleQuickSearch()}
            />
          </div>
          <Button onClick={handleQuickSearch}>
            Search
          </Button>
        </div>
      </Card> */}

      {/* Statistics Cards */}
      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Participants</p>
              <p className="text-2xl font-bold text-gray-900">{eventStats.totalParticipants}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <Calendar className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Schedules Created</p>
              <p className="text-2xl font-bold text-gray-900">{eventStats.schedulesCreated}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Clock className="text-yellow-600" size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Schedules Pending</p>
              <p className="text-2xl font-bold text-gray-900">{eventStats.schedulesPending}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Trophy className="text-purple-600" size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Results Entered</p>
              <p className="text-2xl font-bold text-gray-900">{eventStats.resultsEntered}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-red-100 rounded-lg">
              <Clock className="text-red-600" size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Results Remaining</p>
              <p className="text-2xl font-bold text-gray-900">{eventStats.resultsRemaining}</p>
            </div>
          </div>
        </Card>
      </div> */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Schedules */}
        {/* <Card title="Today's Schedule">
          <div className="space-y-3">
            {upcomingSchedules.map(schedule => (
              <div key={schedule.id} className="border border-gray-200 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{schedule.raceName}</h4>
                  <Badge variant="info" size="sm">
                    {new Date(schedule.scheduledTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Badge>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <div>Age Group: {schedule.ageGroup}</div>
                  <div>Category: {schedule.category.charAt(0).toUpperCase() + schedule.category.slice(1)}</div>
                  <div>Participants: {schedule.participants}</div>
                </div>
                <div className="flex space-x-2 mt-3">
                  <Button size="sm" variant="primary">View Details</Button>
                  <Button size="sm" variant="secondary">Enter Results</Button>
                </div>
              </div>
            ))}
          </div>
        </Card> */}

        {/* Recent Activity */}
        {/* <Card title="Recent Activity">
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-700">
                  Results entered for <span className="font-medium">100m Sprint - 10-12 years</span>
                </p>
                <span className="text-xs text-gray-500">2 hours ago</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-700">
                  New schedule created for <span className="font-medium">200m Sprint - 13-15 years</span>
                </p>
                <span className="text-xs text-gray-500">4 hours ago</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-700">
                  Schedule updated for <span className="font-medium">Relay Race - 16-18 years</span>
                </p>
                <span className="text-xs text-gray-500">6 hours ago</span>
              </div>
            </div>
          </div>
        </Card> */}
      </div>

      {/* Quick Actions */}
      {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="text-center">
            <Calendar className="mx-auto h-8 w-8 text-blue-500 mb-2" />
            <h3 className="font-medium text-gray-900">Create Schedule</h3>
            <p className="text-sm text-gray-600 mt-1">Schedule new races</p>
            <Button size="sm" className="mt-3 w-full">Create</Button>
          </div>
        </Card>
        
        <Card>
          <div className="text-center">
            <Trophy className="mx-auto h-8 w-8 text-yellow-500 mb-2" />
            <h3 className="font-medium text-gray-900">Enter Results</h3>
            <p className="text-sm text-gray-600 mt-1">Update race results</p>
            <Button size="sm" className="mt-3 w-full">Enter</Button>
          </div>
        </Card>
        
        <Card>
          <div className="text-center">
            <Users className="mx-auto h-8 w-8 text-green-500 mb-2" />
            <h3 className="font-medium text-gray-900">View Participants</h3>
            <p className="text-sm text-gray-600 mt-1">Manage participants</p>
            <Button size="sm" className="mt-3 w-full">View</Button>
          </div>
        </Card>
        
        <Card>
          <div className="text-center">
            <Clock className="mx-auto h-8 w-8 text-purple-500 mb-2" />
            <h3 className="font-medium text-gray-900">Generate Reports</h3>
            <p className="text-sm text-gray-600 mt-1">Export event data</p>
            <Button size="sm" className="mt-3 w-full">Generate</Button>
          </div>
        </Card>
      </div> */}
    </div>
  );
};

export default OfficialDashboard;