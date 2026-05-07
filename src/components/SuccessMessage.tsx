import React from 'react';
import { CheckCircle, Download, Share2, Calendar } from 'lucide-react';

interface SuccessMessageProps {
  registrationId: string;
  playerName: string;
  eventName: string;
}

export const SuccessMessage: React.FC<SuccessMessageProps> = ({
  registrationId,
  playerName,
  eventName
}) => {
  const handleDownloadReceipt = () => {
    // In a real app, this would generate and download a PDF receipt
    alert('Receipt download would be implemented here');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Registration Successful',
        text: `Successfully registered for ${eventName}. Registration ID: ${registrationId}`,
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(`Registration ID: ${registrationId}`);
      alert('Registration ID copied to clipboard!');
    }
  };

  return (
    <div className="max-w-2xl mx-auto text-center">
      <div className="mb-8">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Registration Successful! 🎉</h1>
        <p className="text-lg text-gray-600 mb-2">
          Congratulations <span className="font-semibold text-gray-900">{playerName}</span>!
        </p>
        <p className="text-gray-600">
          You have successfully registered for <span className="font-semibold">{eventName}</span>
        </p>
      </div>

      <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-8 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Registration Details</h2>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Registration ID:</span>
            <span className="font-mono text-lg font-bold text-green-600">{registrationId}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Status:</span>
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
              Confirmed
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Payment:</span>
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              Completed
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <button
          onClick={handleDownloadReceipt}
          className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Download className="w-5 h-5 mr-2" />
          Download Receipt
        </button>
        <button
          onClick={handleShare}
          className="flex items-center justify-center px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          <Share2 className="w-5 h-5 mr-2" />
          Share Details
        </button>
        <button
          onClick={() => window.location.reload()}
          className="flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Calendar className="w-5 h-5 mr-2" />
          New Registration
        </button>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-yellow-800 mb-3">Important Information</h3>
        <ul className="text-left text-yellow-700 space-y-2 text-sm">
          <li className="flex items-start">
            <span className="text-yellow-600 mr-2">•</span>
            Please save your registration ID for future reference
          </li>
          <li className="flex items-start">
            <span className="text-yellow-600 mr-2">•</span>
            Bring a printed copy of your registration receipt to the event
          </li>
          <li className="flex items-start">
            <span className="text-yellow-600 mr-2">•</span>
            Report to the registration desk 30 minutes before your race time
          </li>
          <li className="flex items-start">
            <span className="text-yellow-600 mr-2">•</span>
            Contact event organizers if you need to make any changes
          </li>
        </ul>
      </div>
    </div>
  );
};