import React from 'react';
import { Users, Calendar, Trophy, TrendingUp, Medal, Award, Star } from 'lucide-react';
import Card from '../../components/UI/Card';
import Badge from '../../components/UI/Badge';
import { mockPlayers, mockEvents, mockSchedules } from '../../data/mockData';

const ClubDashboard: React.FC = () => {
  const currentClubId = 'C001'; // Thunder Skating Club
  const stateName = localStorage.getItem("stateName");
  const currentClub = {
    name: stateName,
    logo: 'https://images.pexels.com/photos/1263348/pexels-photo-1263348.jpeg?auto=compress&cs=tinysrgb&w=200'
  };

  // Filter data for current club
  // const clubPlayers = mockPlayers.filter(player => player.clubId === currentClubId);
  // const approvedPlayers = clubPlayers.filter(player => player.approved);
  
  // Calculate events participated
  // const eventsParticipated = mockEvents.filter(event => {
  //   return mockSchedules.some(schedule => 
  //     schedule.participants.some(participant => 
  //       clubPlayers.some(player => player.id === participant.playerId)
  //     )
  //   );
  // });

  // // Calculate medals won
  // const medalsWon = mockSchedules.reduce((total, schedule) => {
  //   return total + schedule.participants.filter(participant => 
  //     participant.medal && clubPlayers.some(player => player.id === participant.playerId)
  //   ).length;
  // }, 0);

  // // Medal breakdown
  // const medalBreakdown = {
  //   gold: 0,
  //   silver: 0,
  //   bronze: 0
  // };

  // mockSchedules.forEach(schedule => {
  //   schedule.participants.forEach(participant => {
  //     if (participant.medal && clubPlayers.some(player => player.id === participant.playerId)) {
  //       medalBreakdown[participant.medal as keyof typeof medalBreakdown]++;
  //     }
  //   });
  // });

  // Recent achievements
  // const recentAchievements = mockSchedules
  //   .filter(schedule => schedule.resultsEntered)
  //   .flatMap(schedule => 
  //     schedule.participants
  //       .filter(participant => 
  //         participant.medal && clubPlayers.some(player => player.id === participant.playerId)
  //       )
  //       .map(participant => ({
  //         playerName: participant.playerName,
  //         eventName: 'California State Championship 2024', // From schedule context
  //         raceName: schedule.raceName,
  //         medal: participant.medal,
  //         rank: participant.rank
  //       }))
  //   )
  //   .slice(0, 5);

  // Upcoming events for club players
  const upcomingEvents = mockEvents.filter(event => event.status === 'upcoming').slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="flex items-center space-x-6">
          {/* <div className="w-20 h-20 rounded-full overflow-hidden bg-white/20">
            <img
              src={currentClub.logo}
              alt={currentClub.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://images.pexels.com/photos/1263348/pexels-photo-1263348.jpeg?auto=compress&cs=tinysrgb&w=200';
              }}
            />
          </div> */}
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{currentClub.name}</h1>
            <p className="text-blue-100 mt-1">State Management Dashboard</p>
            
            <div className="grid grid-cols-4 gap-6 mt-4">
              {/* <div className="text-center">
                <div className="text-2xl font-bold">{approvedPlayers.length}</div>
                <div className="text-sm text-blue-100"> Players</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{eventsParticipated.length}</div>
                <div className="text-sm text-blue-100">Districts</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{medalsWon}</div>
                <div className="text-sm text-blue-100">Clubs</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{medalBreakdown.gold}</div>
                <div className="text-sm text-blue-100">Events</div>
              </div> */}
            </div>
          </div>
        </div>
      </Card>

      {/* Statistics Cards */}
      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Players</p>
              <p className="text-2xl font-bold text-gray-900">{approvedPlayers.length}</p>
              <p className="text-xs text-gray-500">{clubPlayers.length - approvedPlayers.length} pending approval</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <Calendar className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total District</p>
              <p className="text-2xl font-bold text-gray-900">{eventsParticipated.length}</p>
              <p className="text-xs text-gray-500">This year</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Trophy className="text-yellow-600" size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Clubs</p>
              <p className="text-2xl font-bold text-gray-900">{medalsWon}</p>
              <p className="text-xs text-gray-500">All competitions</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-purple-100 rounded-lg">
              <TrendingUp className="text-purple-600" size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Events</p>
              <p className="text-2xl font-bold text-gray-900">85</p>
              <p className="text-xs text-gray-500">Success rate</p>
            </div>
          </div>
        </Card>
      </div> */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Medal Breakdown */}
        {/* <Card title="Medal Breakdown">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Medal className="text-yellow-500" size={20} />
                <span className="font-medium text-gray-900">Gold Medals</span>
              </div>
              <span className="text-2xl font-bold text-yellow-600">{medalBreakdown.gold}</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Medal className="text-gray-400" size={20} />
                <span className="font-medium text-gray-900">Silver Medals</span>
              </div>
              <span className="text-2xl font-bold text-gray-500">{medalBreakdown.silver}</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Medal className="text-orange-600" size={20} />
                <span className="font-medium text-gray-900">Bronze Medals</span>
              </div>
              <span className="text-2xl font-bold text-orange-600">{medalBreakdown.bronze}</span>
            </div>
          </div>
        </Card> */}

        {/* Recent Achievements */}
        {/* <Card title="Recent Achievements">
          <div className="space-y-3">
            {recentAchievements.map((achievement, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0">
                  <Medal className={`w-5 h-5 ${
                    achievement.medal === 'gold' ? 'text-yellow-500' :
                    achievement.medal === 'silver' ? 'text-gray-400' :
                    'text-orange-600'
                  }`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {achievement.playerName}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {achievement.raceName} - Rank #{achievement.rank}
                  </p>
                </div>
                <Badge variant={
                  achievement.medal === 'gold' ? 'warning' :
                  achievement.medal === 'silver' ? 'default' : 'default'
                } size="sm">
                  {achievement.medal?.charAt(0).toUpperCase() + achievement.medal?.slice(1)}
                </Badge>
              </div>
            ))}
            {recentAchievements.length === 0 && (
              <div className="text-center py-4 text-gray-500">
                No recent achievements
              </div>
            )}
          </div>
        </Card> */}
      </div>

      {/* Upcoming Events */}
      {/* <Card title="Upcoming Events - Registration Open">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {upcomingEvents.map(event => (
            <div key={event.id} className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">{event.name}</h3>
              <p className="text-sm text-gray-600 mb-2">{event.venue}</p>
              <div className="text-xs text-gray-500 mb-3">
                {new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}
              </div>
              <Badge variant="success" size="sm" className="mb-3">
                Registration Open
              </Badge>
              <div className="text-sm text-gray-600">
                <p>Available categories: All</p>
                <p>Age groups: Multiple</p>
              </div>
            </div>
          ))}
        </div>
      </Card> */}

      {/* Player Categories Distribution */}
      {/* <Card title="Player Categories Distribution">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['beginner', 'fancy', 'inline', 'quad'].map(category => {
            const count = approvedPlayers.filter(player => player.category === category).length;
            return (
              <div key={category} className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">{count}</div>
                <div className="text-sm text-gray-600 capitalize">{category}</div>
              </div>
            );
          })}
        </div>
      </Card> */}
    </div>
  );
};

export default ClubDashboard;