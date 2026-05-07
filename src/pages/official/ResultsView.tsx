import React, { useEffect, useState } from 'react';
import { Download, Medal } from 'lucide-react';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import Table from '../../components/UI/Table';
import { mockSchedules, mockEvents } from '../../data/mockData';
import axios from 'axios';

const ResultsView: React.FC = () => {
  // const [selectedEvent] = React.useState(mockEvents[0]);
  const [raceFilter, setRaceFilter] = React.useState('all');
  const [categoryFilter, setCategoryFilter] = React.useState('all');
  const [ageGroupFilter, setAgeGroupFilter] = React.useState('all');
  const [genderFilter, setGenderFilter] = React.useState('all');
  const [results, setResults] = useState<any[]>([]);
  const eventId = localStorage.getItem("eventId");


  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/schedules/race_schedule_results/${eventId}`);
        const data = response.data;

        const formattedResults = data.map((item: any, index: number) => ({
          sno: index + 1,
          chestNo: item.eventRegistartion?.chestNumber || 'N/A',
          playerName: item.player?.name || 'N/A',
          scheduleId: item.scheduleId || 'N/A',
          ageGroup: item.eventRegistartion?.ageGroup || 'N/A',
          raceName: item.raceName || 'N/A',
          clubName: item.player?.clubName || 'N/A',
          result: item.final_result || 'N/A'
        }));

        setResults(formattedResults);
      } catch (err) {
        console.error('Error fetching results:', err);
      }
    };

    fetchResults();
  }, []);

  // Get all results from completed schedules
  const getAllResults = () => {
    const results: any[] = [];

    mockSchedules
      .filter(schedule => schedule.resultsEntered)
      .forEach(schedule => {
        schedule.participants
          .filter(participant => participant.status === 'completed')
          .forEach(participant => {
            results.push({
              id: `${schedule.id}_${participant.id}`,
              raceName: schedule.raceName,
              ageGroupName: schedule.ageGroupName,
              category: schedule.category,
              playerName: participant.playerName,
              gender: participant.gender,
              club: participant.club,
              district: participant.district,
              score: participant.totalScore,
              rank: participant.rank,
              medal: participant.medal,
              status: participant.status
            });
          });
      });

    return results;
  };

  const allResults = getAllResults();

  const filteredResults = allResults.filter(result => {
    return (
      (raceFilter === 'all' || result.raceName === raceFilter) &&
      (categoryFilter === 'all' || result.category === categoryFilter) &&
      (ageGroupFilter === 'all' || result.ageGroupName === ageGroupFilter) &&
      (genderFilter === 'all' || result.gender === genderFilter)
    );
  });

  const getMedalIcon = (medal?: string) => {
    if (!medal) return null;
    const colors = {
      gold: 'text-yellow-500',
      silver: 'text-gray-400',
      bronze: 'text-orange-600'
    };
    return <Medal className={`w-4 h-4 ${colors[medal as keyof typeof colors]}`} />;
  };

  const exportToExcel = () => {
    // Implementation for Excel export
    console.log('Exporting to Excel...');
    alert('Excel export functionality would be implemented here');
  };

  const exportToPDF = () => {
    // Implementation for PDF export
    console.log('Exporting to PDF...');
    alert('PDF export functionality would be implemented here');
  };
const publishResult = async () => {
  try {
    const response = await fetch(`https://sportims-api.justvy.com/certificate/generate/${eventId}/`, {
      method: 'GET', // Or 'POST' depending on the API method
      headers: {
        'Content-Type': 'application/json',
        // Add Authorization header if required:
        // 'Authorization': 'Bearer YOUR_TOKEN_HERE'
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json(); // Or response.blob() / response.text() based on API response
    console.log('Publish successful:', data);
    alert('Results published successfully!');
  } catch (error) {
    console.error('Error publishing results:', error);
    alert('Failed to publish results. Please try again.');
  }
};

const downloadCertificates = async () => {
  const url = `https://sportims-api.justvy.com/certificates/get-all/${eventId}`;
  window.open(url, '_blank');
};


  const columns = [
    { key: 'sno', label: 'S.No' },
    { key: 'chestNo', label: 'Chest No' },
    { key: 'playerName', label: 'Name' },
    { key: 'scheduleId', label: 'Schedule ID' },
    { key: 'ageGroup', label: 'Age Group' },
    { key: 'raceName', label: 'Race Name' },
    { key: 'clubName', label: 'Club Name' },
    { key: 'result', label: 'Result' },
  ];
  // Calculate medal tally
  const medalTally = {
    byClub: {} as Record<string, { gold: number; silver: number; bronze: number; total: number }>,
    byDistrict: {} as Record<string, { gold: number; silver: number; bronze: number; total: number }>
  };

  allResults.forEach(result => {
    if (result.medal) {
      // Club tally
      if (!medalTally.byClub[result.club]) {
        medalTally.byClub[result.club] = { gold: 0, silver: 0, bronze: 0, total: 0 };
      }
      medalTally.byClub[result.club][result.medal as keyof typeof medalTally.byClub[string]]++;
      medalTally.byClub[result.club].total++;

      // District tally
      if (!medalTally.byDistrict[result.district]) {
        medalTally.byDistrict[result.district] = { gold: 0, silver: 0, bronze: 0, total: 0 };
      }
      medalTally.byDistrict[result.district][result.medal as keyof typeof medalTally.byDistrict[string]]++;
      medalTally.byDistrict[result.district].total++;
    }
  });

  const uniqueRaces = [...new Set(allResults.map(r => r.raceName))];
  const uniqueCategories = [...new Set(allResults.map(r => r.category))];
  const uniqueAgeGroups = [...new Set(allResults.map(r => r.ageGroupName))];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Results View</h1>
          <p className="text-gray-600 mt-1">View consolidated results</p>
        </div>
        <div className="flex space-x-2">
          {/* <Button variant="secondary" onClick={exportToExcel}>
            <Download size={16} className="mr-2" />
            Export Excel
          </Button>
          <Button variant="secondary" onClick={exportToPDF}>
            <Download size={16} className="mr-2" />
            Export PDF
          </Button> */}
          <Button variant="secondary" onClick={downloadCertificates}>
            <Download size={16} className="mr-2" />
            Download All Certificates
          </Button>
          <Button variant="secondary" onClick={publishResult}>
            <Download size={16} className="mr-2" />
            Publish Result
          </Button>
        </div>
      </div>

      {/* Filters */}
      {/* <Card>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Race</label>
            <select
              value={raceFilter}
              onChange={(e) => setRaceFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Races</option>
              {uniqueRaces.map(race => (
                <option key={race} value={race}>{race}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              {uniqueCategories.map(category => (
                <option key={category} value={category}>{category.charAt(0).toUpperCase() + category.slice(1)}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Age Group</label>
            <select
              value={ageGroupFilter}
              onChange={(e) => setAgeGroupFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Age Groups</option>
              {uniqueAgeGroups.map(ageGroup => (
                <option key={ageGroup} value={ageGroup}>{ageGroup}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
            <select
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Genders</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
      </Card> */}

      {/* Results Table */}
      <Card>
        <Table
          columns={columns}
          data={results}
          searchable
          searchPlaceholder="Search by name, chest no..."
        />
      </Card>

      {/* Medal Tally */}
      {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Medal Tally by Club">
          <div className="space-y-3">
            {Object.entries(medalTally.byClub)
              .sort(([, a], [, b]) => b.total - a.total)
              .map(([club, medals]) => (
                <div key={club} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="font-medium text-gray-900">{club}</div>
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center space-x-1">
                      <Medal className="w-4 h-4 text-yellow-500" />
                      <span>{medals.gold}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Medal className="w-4 h-4 text-gray-400" />
                      <span>{medals.silver}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Medal className="w-4 h-4 text-orange-600" />
                      <span>{medals.bronze}</span>
                    </div>
                    <div className="font-medium">
                      Total: {medals.total}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </Card>

        <Card title="Medal Tally by District">
          <div className="space-y-3">
            {Object.entries(medalTally.byDistrict)
              .sort(([, a], [, b]) => b.total - a.total)
              .map(([district, medals]) => (
                <div key={district} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="font-medium text-gray-900">{district}</div>
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center space-x-1">
                      <Medal className="w-4 h-4 text-yellow-500" />
                      <span>{medals.gold}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Medal className="w-4 h-4 text-gray-400" />
                      <span>{medals.silver}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Medal className="w-4 h-4 text-orange-600" />
                      <span>{medals.bronze}</span>
                    </div>
                    <div className="font-medium">
                      Total: {medals.total}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </Card>
      </div> */}
    </div>
  );
};

export default ResultsView;