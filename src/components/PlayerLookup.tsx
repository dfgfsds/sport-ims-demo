import React, { useState } from 'react';
import { Search, User, CreditCard, Loader2, AlertCircle, Download, CheckCircle } from 'lucide-react';
import { Player, ExistingRegistration } from '../types-1';
import { fetchPlayerByNumber, checkExistingRegistration } from '../services/api';
import { generateExistingRegistrationPDF } from '../utils/pdfGenerator';

interface PlayerLookupProps {
  eventId: number;
  onPlayerFound: (player: Player) => void;
  onPlayerNotFound: (searchValue: string, searchType: 'mobile' | 'aadhar') => void;
}

export const PlayerLookup: React.FC<PlayerLookupProps> = ({
  eventId,
  onPlayerFound,
  onPlayerNotFound
}) => {
  const [searchType, setSearchType] = useState<'mobile' | 'aadhar'>('aadhar');
  const [searchValue, setSearchValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [existingRegistration, setExistingRegistration] = useState<any | null>(null);
  const [showExistingModal, setShowExistingModal] = useState(false);
  const [downloadingPDF, setDownloadingPDF] = useState(false);

  const handleSearch = async () => {
    if (!searchValue.trim()) {
      setError('Please enter a valid number');
      return;
    }

    setLoading(true);
    setError('');
    setExistingRegistration(null);

    try {
      // First check for existing 
      console.log(`Searching for ${searchType} with value: ${searchValue}`);
      const existingReg = await checkExistingRegistration(searchValue.toString());
      console.log('existingReg registration:', existingReg);
      if (existingReg) {
        setExistingRegistration(existingReg);
        setShowExistingModal(true);
        setLoading(false);
        console.log('existingRegistration registration found:', existingRegistration);
        return;
      }

      // If no existing registration, look for player
      const player = await fetchPlayerByNumber(searchValue, searchType);
      if (player) {
        console.log('Player found:', player);
        onPlayerFound(player);
      } else {
        onPlayerNotFound(searchValue, searchType);
      }
    } catch (err) {
      setError('Failed to search. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!existingRegistration) return;
    
    setDownloadingPDF(true);
    try {
      await generateExistingRegistrationPDF(existingRegistration);
    } catch (err) {
      setError('Failed to generate PDF. Please try again.');
    } finally {
      setDownloadingPDF(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <>
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Event Registration</h2>
          <p className="text-gray-600">Enter your Aadhar number to begin</p>
        </div>

        <div className="space-y-6">
          {/* <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search by
            </label>
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => setSearchType('mobile')}
                className={`flex-1 flex items-center justify-center px-4 py-3 rounded-lg border-2 transition-all ${
                  searchType === 'mobile'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <User className="w-5 h-5 mr-2" />
                Mobile Number
              </button>
              <button
                type="button"
                onClick={() => setSearchType('aadhar')}
                className={`flex-1 flex items-center justify-center px-4 py-3 rounded-lg border-2 transition-all ${
                  searchType === 'aadhar'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <CreditCard className="w-5 h-5 mr-2" />
                Aadhar Number
              </button>
            </div>
          </div> */}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {searchType === 'mobile' ? 'Mobile Number' : 'Aadhar Number'}
            </label>
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={searchType === 'mobile' ? 'Enter 10-digit mobile number' : 'Enter 12-digit Aadhar number'}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              maxLength={searchType === 'mobile' ? 10 : 12}
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            </div>
          )}

          <button
            onClick={handleSearch}
            disabled={loading || !searchValue.trim()}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Search className="w-5 h-5 mr-2" />
                Submit
              </>
            )}
          </button>

          {/* <div className="text-center">
            <p className="text-sm text-gray-500 mb-2">
              Try: 9677778128 (mobile) or 1212412212 (aadhar) for new registration
            </p>
            <p className="text-sm text-gray-500">
              Try: 9999999999 for existing registration demo
            </p>
          </div> */}
        </div>
      </div>

      {/* Existing Registration Modal */}
      {showExistingModal && existingRegistration && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Already Registered!</h3>
              <p className="text-gray-600">You are already registered for this event</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Registration ID:</span>
                  <span className="font-mono font-bold text-green-600">{existingRegistration.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Player:</span>
                  <span className="font-medium">{existingRegistration.player.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Category:</span>
                  <span className="font-medium">{existingRegistration.skateCategory}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                    Registered
                  </span>
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleDownloadPDF}
                disabled={downloadingPDF}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center"
              >
                {downloadingPDF ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </>
                )}
              </button>
              <button
                onClick={() => setShowExistingModal(false)}
                className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};