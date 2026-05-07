import React, { useState } from 'react';
import { Trophy, CheckCircle2, ArrowRight } from 'lucide-react';
import { EligibilityResponse } from '../types-1';
// import { EligibilityResponse } from '../types';

interface RaceSelectionProps {
  eligibility: EligibilityResponse;
  onRacesSelected: (selectedRaces: number[]) => void;
}

export const RaceSelection: React.FC<RaceSelectionProps> = ({
  eligibility,
  onRacesSelected
}) => {
  const [selectedRaces, setSelectedRaces] = useState<number[]>([]);
  const [error, setError] = useState('');

  const handleRaceToggle = (raceId: number) => {
    setSelectedRaces(prev => {
      const isSelected = prev.includes(raceId);
      if (isSelected) {
        return prev.filter(id => id !== raceId);
      } else {
        return [...prev, raceId];
      }
    });
    setError('');
  };

  const handleContinue = () => {
    const minRaces = eligibility.mustSelectRaces || 1;
    const maxRaces = eligibility.races?.length || 1;

    if (selectedRaces.length != minRaces) {
      setError(`Please select at least ${minRaces} race(s)`);
      return;
    }

    if (selectedRaces.length > maxRaces) {
      setError(`Please select must ${maxRaces} race(s)`);
      return;
    }

    onRacesSelected(selectedRaces);
  };

  const minRaces = eligibility.mustSelectRaces || 1;
  const canContinue = selectedRaces.length >= minRaces;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Trophy className="w-8 h-8 text-yellow-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Select Your Races</h2>
        <p className="text-gray-600">
          Choose the races you want to participate in (Minimum: {minRaces})
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">Registration Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="font-medium text-blue-700">Category:</span>
            <span className="text-blue-600 ml-2 capitalize">{eligibility.skateCategory}</span>
          </div>
          <div>
            <span className="font-medium text-blue-700">Age Group:</span>
            <span className="text-blue-600 ml-2">{eligibility.ageGroup}</span>
          </div>
          <div>
            <span className="font-medium text-blue-700">Age:</span>
            <span className="text-blue-600 ml-2">{eligibility.age} years</span>
          </div>
        </div>
      </div>

      <div className="space-y-4 mb-8">
        <h3 className="text-lg font-semibold text-gray-900">Available Races</h3>
        {eligibility.races?.map((race) => (
          <div
            key={race.id}
            onClick={() => handleRaceToggle(race.id)}
            className={`p-6 rounded-lg border-2 cursor-pointer transition-all transform hover:scale-102 ${
              selectedRaces.includes(race.id)
                ? 'border-green-500 bg-green-50 shadow-md'
                : 'border-gray-200 hover:border-green-300 hover:shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4 ${
                  selectedRaces.includes(race.id)
                    ? 'border-green-500 bg-green-500'
                    : 'border-gray-300'
                }`}>
                  {selectedRaces.includes(race.id) && (
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  )}
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">{race.name}</h4>
                  <p className="text-gray-600 text-sm">Click to select this race</p>
                </div>
              </div>
              <Trophy className={`w-6 h-6 ${
                selectedRaces.includes(race.id) ? 'text-green-500' : 'text-gray-400'
              }`} />
            </div>
          </div>
        ))}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      <div className="flex items-center justify-between bg-gray-50 rounded-lg p-6">
        <div>
          <p className="text-sm text-gray-600">Selected Races</p>
          <p className="text-lg font-semibold text-gray-900">
            {selectedRaces.length} of {eligibility.races?.length || 0} races
          </p>
        </div>
        <button
          onClick={handleContinue}
          disabled={!canContinue}
          className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
        >
          Continue to Payment
          <ArrowRight className="w-5 h-5 ml-2" />
        </button>
      </div>
    </div>
  );
};