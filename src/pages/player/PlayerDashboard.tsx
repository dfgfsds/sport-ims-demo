import React, { useEffect, useState } from 'react';
import { Calendar, Trophy, Medal, Users, Bell, TrendingUp } from 'lucide-react';
import Card from '../../components/UI/Card';
import Badge from '../../components/UI/Badge';
import Button from '../../components/UI/Button';
import { mockEvents, mockPlayerResults } from '../../data/mockData';
import axios from 'axios';
import { usePlayer } from '../../context/PlayerContext';

const PlayerDashboard: React.FC = () => {



  const { player }:any = usePlayer();
  console.log(player,"player");
  

  useEffect(()=>{
    player
  },[player])

  // const upcomingEvents = mockEvents.filter(event => event.status === 'upcoming');
  const recentResults = mockPlayerResults.slice(0, 3);

  const newsUpdates = [
    // {
    //   id: '1',
    //   title: 'New Training Schedule Released',
    //   date: '2024-12-01',
    //   type: 'announcement'
    // },
    // {
    //   id: '2',
    //   title: 'Winter Cup Registration Extended',
    //   date: '2024-11-30',
    //   type: 'event'
    // }
  ];

  const baseURL = import.meta.env.VITE_API_BASE_URL;
  const [upcomingEvents, setUpcomingEvents] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [getRegEvents, setRegEvents] = useState([])

  const fetRegEvents = async () => {
    try {
      const res = await axios.get(`${baseURL}/registrations/search?playerId=${player?.playerId}`)
      setRegEvents(res?.data)
    } catch (error: any) {
      console.log(error?.data?.message);

    }
  }

  useEffect(() => {
    fetRegEvents()
  }, [])

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${baseURL}/events/`);
        console.log(response);

        const currentDate = new Date(); // Dynamic current date
        const events = response.data.filter((event: any) => new Date(event.eventDate) > currentDate);
        setUpcomingEvents(events);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch events:', err);
        setError('Failed to load upcoming events. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [baseURL]);

  const isAlreadyRegistered = (eventId: string) => {
    return getRegEvents.some((reg: any) => reg.eventId === eventId);
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <div className="flex items-center space-x-6">
          <div className="w-20 h-20 rounded-full overflow-hidden bg-white/20">
            <img
              // src={player?.profileImageUrl}
              src='https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
              alt={player?.name}
              className="w-full h-full object-cover"
            // onError={(e) => {
            //   const target = e.target as HTMLImageElement;
            //   target.src = 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200';
            // }}
            />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">Welcome back, {player?.name}!</h1>
            <p className="text-blue-100 mt-1">{player?.clubName} • {player?.skateCategory} Category</p>

            {/* <div className="grid grid-cols-3 gap-6 mt-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{currentPlayer.eventsParticipated}</div>
                <div className="text-sm text-blue-100">Events Participated</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{currentPlayer.totalMedals}</div>
                <div className="text-sm text-blue-100">Total Medals</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">#{currentPlayer.bestRank}</div>
                <div className="text-sm text-blue-100">Best Rank</div>
              </div>
            </div> */}
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Events */}
        <div className="lg:col-span-2">
          <Card title="Upcoming Events - Open for Registration">
            {loading ? (
              <div className="text-center py-8 text-gray-500">Loading events...</div>
            ) : error ? (
              <div className="text-center py-8 text-red-500">{error}</div>
            ) : (
              <div className="space-y-4">
                {upcomingEvents
                  .filter((event: any) => !isAlreadyRegistered(event.id)) // ✨ only show unregistered events
                  .map((event: any) => (
                    <div key={event.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{event.name}</h3>
                          <p className="text-sm text-gray-600 mt-1">{event.venue}</p>
                          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                            <span>{new Date(event.eventDate).toLocaleDateString()}</span>
                            <Badge variant="success" size="sm">Open for Registration</Badge>
                          </div>
                          <div className="mt-2">
                            <p className="text-sm text-gray-600">Available: Beginner, Fancy, Inline categories</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                {upcomingEvents.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No upcoming events available for registration
                  </div>
                )}
              </div>
            )}
          </Card>
        </div>


        {/* News & Updates */}
        {/* <div>
          <Card title="News & Updates">
            <div className="space-y-3">
              {newsUpdates.map(news => (
                <div key={news.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <Bell size={16} className="text-blue-500 mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <h4 className="font-medium text-sm text-gray-900">{news.title}</h4>
                      <p className="text-xs text-gray-500 mt-1">{new Date(news.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div> */}
      </div>

      {/* Past Event Summary */}
      <Card title="Recent Performance Summary">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recentResults.map((result, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">{result.eventName}</h4>
                {result.medal && (
                  <Medal className={`w-5 h-5 ${result.medal === 'gold' ? 'text-yellow-500' :
                    result.medal === 'silver' ? 'text-gray-400' :
                      'text-orange-600'
                    }`} />
                )}
              </div>
              <p className="text-sm text-gray-600">{result.raceName}</p>
              <div className="flex items-center justify-between mt-2">
                <Badge variant={result.rank <= 3 ? 'success' : 'default'} size="sm">
                  Rank #{result.rank}
                </Badge>
                <span className="text-sm font-medium text-gray-900">{result.time || result.score}</span>
              </div>
              <Button variant="secondary" size="sm" className="w-full mt-3">
                View Details
              </Button>
            </div>
          ))}
        </div>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="text-center">
            <Calendar className="mx-auto h-8 w-8 text-blue-500 mb-2" />
            <h3 className="font-medium text-gray-900">My Events</h3>
            <p className="text-sm text-gray-600 mt-1">View registered events</p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <Trophy className="mx-auto h-8 w-8 text-yellow-500 mb-2" />
            <h3 className="font-medium text-gray-900">Results</h3>
            <p className="text-sm text-gray-600 mt-1">View all results</p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <Users className="mx-auto h-8 w-8 text-green-500 mb-2" />
            <h3 className="font-medium text-gray-900">Profile</h3>
            <p className="text-sm text-gray-600 mt-1">Manage profile</p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <TrendingUp className="mx-auto h-8 w-8 text-purple-500 mb-2" />
            <h3 className="font-medium text-gray-900">Performance</h3>
            <p className="text-sm text-gray-600 mt-1">Track progress</p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PlayerDashboard;