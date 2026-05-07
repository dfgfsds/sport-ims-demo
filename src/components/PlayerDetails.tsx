import React, { useState } from 'react';
import { User, Save } from 'lucide-react';
import { Player } from '../types';

interface PlayerDetailsProps {
  existingPlayer?: Player;
  onContinue: (playerData: Partial<Player>) => void;
  readOnly?: boolean;
}

export const PlayerDetails: React.FC<PlayerDetailsProps> = ({
  existingPlayer,
  onContinue,
  readOnly = false
}) => {
  const [formData, setFormData] = useState({
    name: existingPlayer?.name || '',
    mobileNumber: existingPlayer?.mobileNumber || '',
    aadharNumber: existingPlayer?.aadharNumber || '',
    email: existingPlayer?.email || '',
    dob: existingPlayer?.dob || '',
    gender: existingPlayer?.gender || '',
    address: existingPlayer?.address || '',
    clubName: existingPlayer?.clubName || '',
    districtName: existingPlayer?.districtName || '',
    stateName: existingPlayer?.stateName || ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.mobileNumber.trim()) newErrors.mobileNumber = 'Mobile number is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.dob) newErrors.dob = 'Date of birth is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onContinue({
        ...formData,
        playerId: existingPlayer?.playerId,
        clubId: existingPlayer?.clubId,
        districtId: existingPlayer?.districtId,
        stateId: existingPlayer?.stateId
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {existingPlayer ? 'Player Information' : 'Register New Player'}
        </h2>
        <p className="text-gray-600">
          {existingPlayer 
            ? 'Please verify your information before continuing' 
            : 'Fill in your details to create a new registration'
          }
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              readOnly={readOnly}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                readOnly ? 'bg-gray-50' : 'border-gray-300'
              } ${errors.name ? 'border-red-500' : ''}`}
              placeholder="Enter full name"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mobile Number *
            </label>
            <input
              type="tel"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleChange}
              readOnly={readOnly}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                readOnly ? 'bg-gray-50' : 'border-gray-300'
              } ${errors.mobileNumber ? 'border-red-500' : ''}`}
              placeholder="Enter mobile number"
            />
            {errors.mobileNumber && <p className="text-red-500 text-sm mt-1">{errors.mobileNumber}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Aadhar Number
            </label>
            <input
              type="text"
              name="aadharNumber"
              value={formData.aadharNumber}
              onChange={handleChange}
              readOnly={readOnly}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                readOnly ? 'bg-gray-50' : 'border-gray-300'
              }`}
              placeholder="Enter Aadhar number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              readOnly={readOnly}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                readOnly ? 'bg-gray-50' : 'border-gray-300'
              } ${errors.email ? 'border-red-500' : ''}`}
              placeholder="Enter email address"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date of Birth *
            </label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              readOnly={readOnly}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                readOnly ? 'bg-gray-50' : 'border-gray-300'
              } ${errors.dob ? 'border-red-500' : ''}`}
            />
            {errors.dob && <p className="text-red-500 text-sm mt-1">{errors.dob}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gender *
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              disabled={readOnly}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                readOnly ? 'bg-gray-50' : 'border-gray-300'
              } ${errors.gender ? 'border-red-500' : ''}`}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Club Name
            </label>
            <input
              type="text"
              name="clubName"
              value={formData.clubName}
              onChange={handleChange}
              readOnly={readOnly}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                readOnly ? 'bg-gray-50' : 'border-gray-300'
              }`}
              placeholder="Enter club name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              District
            </label>
            <input
              type="text"
              name="districtName"
              value={formData.districtName}
              onChange={handleChange}
              readOnly={readOnly}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                readOnly ? 'bg-gray-50' : 'border-gray-300'
              }`}
              placeholder="Enter district"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Address
          </label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            readOnly={readOnly}
            rows={3}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              readOnly ? 'bg-gray-50' : 'border-gray-300'
            }`}
            placeholder="Enter complete address"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
        >
          <Save className="w-5 h-5 mr-2" />
          Continue to Registration
        </button>
      </form>
    </div>
  );
};