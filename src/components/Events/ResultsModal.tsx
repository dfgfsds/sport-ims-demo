import React from 'react';
import { Save, Medal } from 'lucide-react';
import Modal from '../UI/Modal';
import Button from '../UI/Button';
import Badge from '../UI/Badge';
import { Schedule, ScheduledPlayer } from '../../types';

interface ResultsModalProps {
  isOpen: boolean;
  onClose: () => void;
  schedule: Schedule;
  onSave: (updatedSchedule: Schedule) => void;
}

const ResultsModal: React.FC<ResultsModalProps> = ({ isOpen, onClose, schedule, onSave }) => {
  const [participants, setParticipants] = React.useState<ScheduledPlayer[]>(schedule.participants);

  React.useEffect(() => {
    setParticipants(schedule.participants);
  }, [schedule]);

  const updateScore = (participantId: string, round: number, score: number | null) => {
    setParticipants(prev => prev.map(participant => {
      if (participant.id === participantId) {
        const updatedRounds = participant.rounds.map(r => 
          r.round === round ? { ...r, score } : r
        );
        
        const validScores = updatedRounds.filter(r => r.score !== null).map(r => r.score!);
        const totalScore = validScores.length > 0 ? validScores.reduce((sum, s) => sum + s, 0) / validScores.length : 0;
        
        return {
          ...participant,
          rounds: updatedRounds,
          totalScore
        };
      }
      return participant;
    }));
  };

  const updateStatus = (participantId: string, status: 'completed' | 'dnf' | 'dq' | 'pending') => {
    setParticipants(prev => prev.map(participant => 
      participant.id === participantId ? { ...participant, status } : participant
    ));
  };

  const calculateRanks = () => {
    const completedParticipants = participants.filter(p => p.status === 'completed');
    const sortedParticipants = [...completedParticipants].sort((a, b) => {
      // For time-based events, lower is better
      if (schedule.raceName.toLowerCase().includes('sprint') || schedule.raceName.toLowerCase().includes('time')) {
        return a.totalScore - b.totalScore;
      }
      // For score-based events, higher is better
      return b.totalScore - a.totalScore;
    });

    const updatedParticipants = participants.map(participant => {
      if (participant.status === 'completed') {
        const rank = sortedParticipants.findIndex(p => p.id === participant.id) + 1;
        let medal: 'gold' | 'silver' | 'bronze' | undefined;
        if (rank === 1) medal = 'gold';
        else if (rank === 2) medal = 'silver';
        else if (rank === 3) medal = 'bronze';
        
        return { ...participant, rank, medal };
      }
      return { ...participant, rank: 0, medal: undefined };
    });

    setParticipants(updatedParticipants);
  };

  const handleSave = () => {
    calculateRanks();
    const updatedSchedule = {
      ...schedule,
      participants,
      resultsEntered: true
    };
    onSave(updatedSchedule);
    onClose();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'dnf': return 'warning';
      case 'dq': return 'danger';
      default: return 'default';
    }
  };

  const getMedalIcon = (medal?: string) => {
    if (!medal) return null;
    const colors = {
      gold: 'text-yellow-500',
      silver: 'text-gray-400',
      bronze: 'text-orange-600'
    };
    return <Medal className={`w-4 h-4 ${colors[medal as keyof typeof colors]}`} />;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Enter Results - ${schedule.raceName}`} size="2xl">
      <div className="space-y-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="font-medium">Race:</span> {schedule.raceName}
            </div>
            <div>
              <span className="font-medium">Age Group:</span> {schedule.ageGroupName}
            </div>
            <div>
              <span className="font-medium">Category:</span> {schedule.category}
            </div>
            <div>
              <span className="font-medium">Heat:</span> {schedule.heatNumber}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-300 px-3 py-2 text-left">Player</th>
                <th className="border border-gray-300 px-3 py-2 text-center">Gender</th>
                <th className="border border-gray-300 px-3 py-2 text-center">Round 1</th>
                <th className="border border-gray-300 px-3 py-2 text-center">Round 2</th>
                <th className="border border-gray-300 px-3 py-2 text-center">Round 3</th>
                <th className="border border-gray-300 px-3 py-2 text-center">Round 4</th>
                <th className="border border-gray-300 px-3 py-2 text-center">Round 5</th>
                <th className="border border-gray-300 px-3 py-2 text-center">Average</th>
                <th className="border border-gray-300 px-3 py-2 text-center">Status</th>
                <th className="border border-gray-300 px-3 py-2 text-center">Rank</th>
              </tr>
            </thead>
            <tbody>
              {participants.map(participant => (
                <tr key={participant.id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-3 py-2">
                    <div>
                      <div className="font-medium">{participant.playerName}</div>
                      <div className="text-sm text-gray-500">{participant.club}</div>
                    </div>
                  </td>
                  <td className="border border-gray-300 px-3 py-2 text-center">
                    <Badge variant="info" size="sm">
                      {participant.gender.charAt(0).toUpperCase()}
                    </Badge>
                  </td>
                  {participant.rounds.map(round => (
                    <td key={round.round} className="border border-gray-300 px-3 py-2 text-center">
                      <input
                        type="number"
                        step="0.01"
                        value={round.score || ''}
                        onChange={(e) => updateScore(
                          participant.id, 
                          round.round, 
                          e.target.value ? parseFloat(e.target.value) : null
                        )}
                        className="w-20 px-2 py-1 border border-gray-300 rounded text-center"
                        placeholder="0.00"
                        disabled={participant.status === 'dnf' || participant.status === 'dq'}
                      />
                    </td>
                  ))}
                  <td className="border border-gray-300 px-3 py-2 text-center font-medium">
                    {participant.totalScore > 0 ? participant.totalScore.toFixed(2) : '-'}
                  </td>
                  <td className="border border-gray-300 px-3 py-2 text-center">
                    <select
                      value={participant.status}
                      onChange={(e) => updateStatus(participant.id, e.target.value as any)}
                      className="px-2 py-1 border border-gray-300 rounded text-sm"
                    >
                      <option value="pending">Pending</option>
                      <option value="completed">Completed</option>
                      <option value="dnf">DNF</option>
                      <option value="dq">DQ</option>
                    </select>
                  </td>
                  <td className="border border-gray-300 px-3 py-2 text-center">
                    <div className="flex items-center justify-center space-x-1">
                      {participant.rank > 0 && (
                        <>
                          <span className="font-medium">{participant.rank}</span>
                          {getMedalIcon(participant.medal)}
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center pt-4 border-t">
          <Button onClick={calculateRanks} variant="secondary">
            Calculate Ranks
          </Button>
          <div className="flex space-x-3">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              <Save size={16} className="mr-2" />
              Save Results
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ResultsModal;