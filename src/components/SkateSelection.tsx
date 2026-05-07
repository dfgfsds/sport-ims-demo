import React, { useState, useEffect } from 'react';
import { Zap, Loader2, AlertCircle } from 'lucide-react';
import { EligibilityResponse } from '../types';
import { checkEligibility } from '../services/api';

interface SkateSelectionProps {
  dob: string;
  eventId: number;
  onEligibilityChecked: (eligibility: EligibilityResponse, selectedCategory: string) => void;
}

export const SkateSelection: React.FC<SkateSelectionProps> = ({
  dob,
  eventId,
  onEligibilityChecked
}) => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [eligibility, setEligibility] = useState<EligibilityResponse | null>(null);
  const [error, setError] = useState('');

  const skateCategories = [
    { value: 'beginner', label: 'Beginner', icon: '🔰', description: 'Perfect for newcomers to skating' },
    { value: 'fancy', label: 'Fancy', icon: '✨', description: 'Creative and artistic skating styles' },
    { value: 'inline', label: 'Inline', icon: '🛼', description: 'High-speed inline skating competitions' },
    { value: 'quad', label: 'Quad', icon: '🎯', description: 'Traditional four-wheel skating' }
  ];

  const handleCategorySelect = async (category: string) => {
    setSelectedCategory(category);
    setLoading(true);
    setError('');

    try {
      const eligibilityResult = await checkEligibility(eventId, dob, category);
      setEligibility(eligibilityResult);
      
      if (eligibilityResult.eligible) {
        onEligibilityChecked(eligibilityResult, category);
      }
    } catch (err) {
      setError('Failed to check eligibility. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Zap className="w-8 h-8 text-purple-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Select Skate Category</h2>
        <p className="text-gray-600">Choose your preferred skating category to check race eligibility</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {skateCategories.map((category) => (
          <button
            key={category.value}
            onClick={() => handleCategorySelect(category.value)}
            disabled={loading}
            className={`p-6 rounded-xl border-2 transition-all transform hover:scale-105 ${
              selectedCategory === category.value
                ? 'border-purple-500 bg-purple-50 shadow-lg'
                : 'border-gray-200 hover:border-purple-300 hover:shadow-md'
            } ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <div className="text-center">
              <div className="text-4xl mb-3">{category.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{category.label}</h3>
              <p className="text-gray-600 text-sm">{category.description}</p>
            </div>
          </button>
        ))}
      </div>

      {loading && (
        <div className="text-center py-8">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-purple-600 mb-4" />
          <p className="text-gray-600">Checking eligibility...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      )}

      {eligibility && !eligibility.eligible && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex items-center mb-3">
            <AlertCircle className="w-6 h-6 text-yellow-600 mr-3" />
            <h3 className="text-lg font-semibold text-yellow-800">Not Eligible</h3>
          </div>
          <p className="text-yellow-700">{eligibility.reason}</p>
          <p className="text-yellow-600 text-sm mt-2">Please try selecting a different skate category.</p>
        </div>
      )}

      {eligibility && eligibility.eligible && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-center mb-3">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3">
              <span className="text-white text-sm">✓</span>
            </div>
            <h3 className="text-lg font-semibold text-green-800">Eligible for Registration!</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-medium text-green-700">Age:</span>
              <span className="text-green-600 ml-2">{eligibility.age} years</span>
            </div>
            <div>
              <span className="font-medium text-green-700">Category:</span>
              <span className="text-green-600 ml-2">{eligibility.ageGroup}</span>
            </div>
            <div>
              <span className="font-medium text-green-700">Available Races:</span>
              <span className="text-green-600 ml-2">{eligibility.races?.length || 0}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};