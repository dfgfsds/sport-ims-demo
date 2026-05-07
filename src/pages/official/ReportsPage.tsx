import React from 'react';
import { Download, FileText, Users, Trophy, Calendar, BarChart3 } from 'lucide-react';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import Badge from '../../components/UI/Badge';
import { mockEvents, mockSchedules, mockPlayers } from '../../data/mockData';
import axios from 'axios';
import { exportToExcel } from '../../ExportToExcel/ExportToExcel';

const ReportsPage: React.FC = () => {
  const [selectedEvent] = React.useState(mockEvents[0]);
  const eventId = localStorage.getItem('eventId'); // Hardcoded for now
  const baseURL = import.meta.env.VITE_API_BASE_URL;

  const generateParticipantReport = async () => {
    try {
      const { data } = await axios.get(`${baseURL}/registrations/fetch-by-event-id/${eventId}`);
      const formattedData = data.map((entry: any) => ({
        'Player Name': entry?.player?.name || 'N/A',
        'Email': entry?.player?.email,
        'Mobile Number': entry?.player?.mobileNumber,
        'chest Number': entry?.chestNumber,
        'Age Group': entry.ageGroup || 'N/A',
        'Club Name': entry.player.clubName || 'N/A',
        'skateCategory': entry.player.skateCategory || 'N/A',
        'DOB': entry?.dob || 'N/A',
        'Category': entry.skateCategory || 'N/A',
        'District': entry?.player?.districtName || 'N/A',
        'Gender': entry?.player?.gender || 'N/A',
        'profileImageUrl': entry?.player?.profileImageUrl || 'N/A',
        'Event Date': entry?.event?.eventDate || 'N/A',
        'Venue': entry.event.venue || 'N/A',
        'Races Registered': entry.selectedRaces?.map((race: any) => race.name).join(', '),
      }));

      const eventName = data[0]?.event?.name?.replace(/\s+/g, '_') || 'event';
      exportToExcel(formattedData, `participant_report_${eventName}.xlsx`);
    } catch (err) {
      console.error('Failed to fetch participants:', err);
      alert('Failed to generate participant report.');
    }
  };

  const generateScheduleReport = async () => {
    try {
      const { data } = await axios.get(`${baseURL}/schedules/by-event/${eventId}`);
      const formattedData = data.map((entry: any) => ({
        'Race Name': entry?.raceName || 'N/A',
        'ageGroupName': entry?.ageGroupName || 'N/A',
        'Schedule Time': entry?.scheduleTime || 'N/A',
        'Gender': entry?.gender || 'N/A',
        'Skate Category': entry?.skateCategory || 'N/A',
        'participants': entry?.participants.length || 'N/A',
      }));

      exportToExcel(formattedData, `schedule_report.xlsx`);
    } catch (err) {
      console.error('Failed to fetch schedule:', err);
      alert('Failed to generate schedule report.');
    }
  };

  const generateResultsReport = async () => {
    try {
      const { data } = await axios.get(`${baseURL}/schedules/race_schedule_results/${eventId}`, {
        params: { eventId },
      });
      const formattedData = data.map((entry: any) => ({
        'Player Name': entry?.playerName || 'N/A',
        'Race Name': entry?.raceName || 'N/A',
        'H1 Score': entry?.H1_score || 'N/A',
        'H2 Score': entry?.H2_score || 'N/A',
        'H3 Score': entry?.H3_score || 'N/A',
        'H4 Score': entry?.H4_score || 'N/A',
        'Final Result': entry?.final_result || 'N/A',

      }));
      exportToExcel(formattedData, 'results_report.xlsx');
    } catch (err) {
      console.error('Failed to fetch results:', err);
      alert('Failed to generate results report.');
    }
  };


  const generateMedalTallyReport = () => {
    console.log('Generating medal tally report...');
    alert('Medal tally report generation would be implemented here');
  };

  // Calculate report statistics
  const reportStats = {
    totalParticipants: mockPlayers.filter(p => p.approved).length,
    totalSchedules: mockSchedules.length,
    completedSchedules: mockSchedules.filter(s => s.resultsEntered).length,
    totalMedals: mockSchedules.reduce((total, schedule) => {
      return total + schedule.participants.filter(p => p.medal).length;
    }, 0)
  };

  const reportTypes = [
    {
      id: 'participants',
      title: 'Participant Report',
      description: 'Complete list of all event participants with their details',
      icon: Users,
      color: 'blue',
      action: generateParticipantReport,
      includes: [
        'Player Name, Club, District',
        'Age Group and Category',
        'Races Registered',
        'Contact Information'
      ]
    },
    {
      id: 'schedule',
      title: 'Schedule Summary Report',
      description: 'Overview of all race schedules and their status',
      icon: Calendar,
      color: 'green',
      action: generateScheduleReport,
      includes: [
        'Race Name and Time',
        'Age Group and Category',
        'Number of Participants',
        'Completion Status'
      ]
    },
    {
      id: 'results',
      title: 'Results Report',
      description: 'Comprehensive results across all races and categories',
      icon: Trophy,
      color: 'yellow',
      action: generateResultsReport,
      includes: [
        'Player-wise Results',
        'Race-wise Rankings',
        'Score/Time Details',
        'Medal Winners'
      ]
    },
    // {
    //   id: 'medals',
    //   title: 'Medal Tally Report',
    //   description: 'Medal distribution by club, district, and state',
    //   icon: BarChart3,
    //   color: 'purple',
    //   action: generateMedalTallyReport,
    //   includes: [
    //     'Club-wise Medal Count',
    //     'District-wise Tally',
    //     'State-wise Summary',
    //     'Category Breakdown'
    //   ]
    // }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-600',
      green: 'bg-green-100 text-green-600',
      yellow: 'bg-yellow-100 text-yellow-600',
      purple: 'bg-purple-100 text-purple-600'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Event Reports</h1>
        <p className="text-gray-600 mt-1">Generate and export comprehensive reports for {selectedEvent.name}</p>
      </div>

      {/* Event Summary */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{reportStats.totalParticipants}</div>
            <div className="text-sm text-gray-600">Total Participants</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{reportStats.totalSchedules}</div>
            <div className="text-sm text-gray-600">Total Schedules</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{reportStats.completedSchedules}</div>
            <div className="text-sm text-gray-600">Completed Schedules</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{reportStats.totalMedals}</div>
            <div className="text-sm text-gray-600">Total Medals</div>
          </div>
        </div>
      </Card>

      {/* Report Types */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {reportTypes.map(report => (
          <Card key={report.id}>
            <div className="flex items-start space-x-4">
              <div className={`p-3 rounded-lg ${getColorClasses(report.color)}`}>
                <report.icon size={24} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{report.title}</h3>
                <p className="text-gray-600 mb-4">{report.description}</p>

                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Includes:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {report.includes.map((item, index) => (
                      <li key={index} className="flex items-center">
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex space-x-2">
                  <Button size="sm" onClick={report.action}>
                    <FileText size={16} className="mr-2" />
                    Generate PDF
                  </Button>
                  <Button size="sm" variant="secondary" onClick={report.action}>
                    <Download size={16} className="mr-2" />
                    Export Excel
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Export Options */}
      <Card title="Quick Export Options">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <FileText className="mx-auto h-8 w-8 text-gray-400 mb-2" />
            <h4 className="font-medium text-gray-900 mb-1">Complete Event Report</h4>
            <p className="text-sm text-gray-600 mb-3">All data in one comprehensive report</p>
            <Button size="sm" className="w-full">
              Generate Complete Report
            </Button>
          </div>

          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <Trophy className="mx-auto h-8 w-8 text-gray-400 mb-2" />
            <h4 className="font-medium text-gray-900 mb-1">Winners Only</h4>
            <p className="text-sm text-gray-600 mb-3">Report containing only medal winners</p>
            <Button size="sm" className="w-full">
              Generate Winners Report
            </Button>
          </div>

          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <BarChart3 className="mx-auto h-8 w-8 text-gray-400 mb-2" />
            <h4 className="font-medium text-gray-900 mb-1">Statistics Summary</h4>
            <p className="text-sm text-gray-600 mb-3">Key statistics and analytics</p>
            <Button size="sm" className="w-full">
              Generate Statistics
            </Button>
          </div>
        </div>
      </Card>

      {/* Export Formats */}
      <Card title="Export Formats">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg">
            <FileText className="text-red-600" size={20} />
            <div>
              <div className="font-medium text-gray-900">PDF Format</div>
              <div className="text-sm text-gray-600">Professional formatted reports</div>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
            <Download className="text-green-600" size={20} />
            <div>
              <div className="font-medium text-gray-900">Excel Format</div>
              <div className="text-sm text-gray-600">Spreadsheet for data analysis</div>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
            <FileText className="text-blue-600" size={20} />
            <div>
              <div className="font-medium text-gray-900">Print Ready</div>
              <div className="text-sm text-gray-600">Optimized for printing</div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ReportsPage;