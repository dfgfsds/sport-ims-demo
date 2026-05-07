import React from 'react';
import { Search, Plus } from 'lucide-react';
import Modal from '../UI/Modal';
import Button from '../UI/Button';
import FormField from '../UI/FormField';
import Badge from '../UI/Badge';
import { Event, Player, Schedule, ScheduledPlayer } from '../../types';
import { mockPlayers } from '../../data/mockData';

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event;
  onSave: (schedule: Partial<Schedule>) => void;
}

const ScheduleModal: React.FC<ScheduleModalProps> = ({ isOpen, onClose, event, onSave }) => {
  const [selectedRace, setSelectedRace] = React.useState('');
  const [selectedAgeGroup, setSelectedAgeGroup] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState('');
  const [scheduledTime, setScheduledTime] = React.useState('');
  const [heatNumber, setHeatNumber] = React.useState('');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedPlayers, setSelectedPlayers] = React.useState<string[]>([]);

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

  const getEligiblePlayers = () => {
    if (!selectedRace || !selectedAgeGroup || !selectedCategory) return [];

    const selectedAgeGroupData = event.ageGroups.find(ag => ag.id === selectedAgeGroup);
    if (!selectedAgeGroupData) return [];

    return mockPlayers.filter(player => {
      const age = calculateAge(player.dateOfBirth);
      const isAgeEligible = age >= selectedAgeGroupData.startAge && age <= selectedAgeGroupData.endAge;
      const isCategoryEligible = player.category === selectedCategory;
      const matchesSearch = player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           player.clubName.toLowerCase().includes(searchQuery.toLowerCase());
      
      return player.approved && isAgeEligible && isCategoryEligible && matchesSearch;
    });
  };

  const togglePlayerSelection = (playerId: string) => {
    setSelectedPlayers(prev => 
      prev.includes(playerId) 
        ? prev.filter(id => id !== playerId)
        : [...prev, playerId]
    );
  };

  const handleSave = () => {
    const selectedPlayerData = mockPlayers.filter(p => selectedPlayers.includes(p.id));
    const participants: ScheduledPlayer[] = selectedPlayerData.map(player => ({
      id: `SP${Date.now()}_${player.id}`,
      playerId: player.id,
      playerName: player.name,
      gender: player.gender,
      club: player.clubName,
      district: player.district,
      rounds: Array.from({ length: 5 }, (_, i) => ({ round: i + 1, score: null })),
      totalScore: 0,
      rank: 0,
      status: 'pending'
    }));

    const schedule: Partial<Schedule> = {
      eventId: event.id,
      raceId: selectedRace,
      raceName: event.races.find(r => r.id === selectedRace)?.name || '',
      ageGroupId: selectedAgeGroup,
      ageGroupName: event.ageGroups.find(ag => ag.id === selectedAgeGroup)?.name || '',
      category: selectedCategory as any,
      scheduledTime,
      heatNumber,
      participants,
      resultsEntered: false
    };

    onSave(schedule);
    onClose();
  };

  const eligiblePlayers = getEligiblePlayers();

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Schedule Players for Race" size="xl">
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Select Race" required>
            <select
              value={selectedRace}
              onChange={(e) => setSelectedRace(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select a race</option>
              {event?.races?.map(race => (
                <option key={race.id} value={race.id}>{race.name}</option>
              ))}
            </select>
          </FormField>

          <FormField label="Select Age Group" required>
            <select
              value={selectedAgeGroup}
              onChange={(e) => setSelectedAgeGroup(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select age group</option>
              {event?.ageGroups?.map(ageGroup => (
                <option key={ageGroup.id} value={ageGroup.id}>{ageGroup.name}</option>
              ))}
            </select>
          </FormField>

          <FormField label="Select Category" required>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select category</option>
              <option value="beginner">Beginner</option>
              <option value="fancy">Fancy</option>
              <option value="inline">Inline</option>
              <option value="quad">Quad</option>
            </select>
          </FormField>

          <FormField label="Scheduled Time" required>
            <input
              type="datetime-local"
              value={scheduledTime}
              onChange={(e) => setScheduledTime(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </FormField>
        </div>

        <FormField label="Heat Number">
          <input
            type="text"
            value={heatNumber}
            onChange={(e) => setHeatNumber(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., Heat 1, Group A"
          />
        </FormField>

        {selectedRace && selectedAgeGroup && selectedCategory && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Select Players</h3>
              <Badge variant="info">
                {selectedPlayers.length} selected
              </Badge>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search players..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg">
              {eligiblePlayers.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {eligiblePlayers.map(player => (
                    <div key={player.id} className="p-3 hover:bg-gray-50">
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedPlayers.includes(player.id)}
                          onChange={() => togglePlayerSelection(player.id)}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-gray-900">{player.name}</p>
                              <p className="text-sm text-gray-500">{player.clubName}</p>
                            </div>
                            <div className="text-right">
                              <Badge variant="info" size="sm">
                                Age {calculateAge(player.dateOfBirth)}
                              </Badge>
                              <p className="text-sm text-gray-500 mt-1">{player.district}</p>
                            </div>
                          </div>
                        </div>
                      </label>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-gray-500">
                  No eligible players found for the selected criteria
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            disabled={!selectedRace || !selectedAgeGroup || !selectedCategory || selectedPlayers.length === 0}
          >
            Create Schedule
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ScheduleModal;