import React from 'react';
import { Save } from 'lucide-react';
import Modal from '../UI/Modal';
import Button from '../UI/Button';
import FormField from '../UI/FormField';
import ImageUpload from '../UI/ImageUpload';
import { useLocation } from '../../context/LocationContext';
import { useClubs } from '../../context/ClubContext';

interface Player {
  playerId?: number;
  name?: string;
  dob?: string;
  gender?: string;
  districtId?: number;
  stateId?: number;
  clubId?: string;
  address?: string;
  schoolName?: string;
  schoolAffiliationNumber?: string;
  profileImageUrl?: string;
  aadharImageUrl?: string;
  aadharNumber?: string;
  skateCategory?: string;
  mobileNumber?: string;
  email?: string;
  approvalStatus?: string;
}

interface PlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: any;
  player?: any;
  mode: 'create' | 'edit' | 'view';
}

const PlayerModal: React.FC<PlayerModalProps> = ({ isOpen, onClose, onSave, player, mode }) => {


  const [formData, setFormData] = React.useState<Partial<Player>>({
    name: '',
    dob: '',
    gender: 'Male',
    districtId: 1,
    stateId: 2,
    clubId: "3",
    address: '',
    schoolName: '',
    schoolAffiliationNumber: '',
    profileImageUrl: '',
    aadharImageUrl: '',
    aadharNumber: '',
    skateCategory: 'Beginner',
    mobileNumber: '',
    email: '',
    approvalStatus: ''
  });

  React.useEffect(() => {
    if (player && mode !== 'create') {
      // Normalize the player data to match formData structure
      setFormData({
        playerId: player?.playerId || undefined,
        name: player?.name || player?.Name || '', // Handle case sensitivity
        email: player?.email || player?.email || '',
        dob: player?.dob || player?.DOB || '',
        gender: player?.gender || player?.Gender || 'Male',
        districtId: player?.districtId || 1,
        stateId: player?.stateId || 2,
        clubId: player?.clubId || '3',
        address: player?.address || '',
        schoolName: player?.schoolName || '',
        schoolAffiliationNumber: player?.schoolAffiliationNumber || '',
        profileImageUrl: player?.profileImageUrl || '',
        aadharImageUrl: player?.aadharImageUrl || '',
        aadharNumber: player?.aadharNumber || '',
        skateCategory: player?.skateCategory || 'Beginner',
        mobileNumber: player?.mobileNumber || '',
        approvalStatus: player?.approvalStatus || 'pending'
      });
    } else {
      // Reset form for create mode
      setFormData({
        name: '',
        dob: '',
        gender: 'Male',
        districtId: 1,
        stateId: 2,
        clubId: '3',
        address: '',
        schoolName: '',
        schoolAffiliationNumber: '',
        profileImageUrl: '',
        aadharImageUrl: '',
        aadharNumber: '',
        skateCategory: 'Beginner',
        mobileNumber: '',
        email: '',
      });
    }
  }, [player, mode, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    // onClose();
  };

  const isReadOnly = mode === 'view';

  const { states, districts, loading } = useLocation();

  const { clubs } = useClubs();
  const baseUrl = import.meta.env.VITE_API_BASE_URL

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${mode === 'create' ? 'Add New' : mode === 'edit' ? 'Edit' : 'View'} Player`}
      size="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Full Name" required>
            <input
              type="text"
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              readOnly={isReadOnly}
            />
          </FormField>

          <FormField label="Email" required>
            <input
              type="email"
              value={formData.email || ''}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              readOnly={isReadOnly}
            />
          </FormField>

          <FormField label="Mobile Number" required>
            <input
              type="text"
              value={formData.mobileNumber || ''}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d{0,10}$/.test(value)) {
                  setFormData({ ...formData, mobileNumber: value });
                }
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              readOnly={isReadOnly}
              maxLength={10}
              inputMode="numeric"
              title="Enter a 10-digit mobile number"
            />
          </FormField>

          <FormField label="Date of Birth" required>
            <input
              type="date"
              value={formData.dob || ''}
              onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              readOnly={isReadOnly}
            />
          </FormField>

          <FormField label="Gender" required>
            <select
              value={formData.gender || 'Male'}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              disabled={isReadOnly}
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </FormField>

          <FormField label="Skate Category" required>
            <select
              value={formData.skateCategory || 'Beginner'}
              onChange={(e) => setFormData({ ...formData, skateCategory: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              disabled={isReadOnly}
            >
              <option value="Beginner">Beginner</option>
              <option value="Inline">Inline</option>
              <option value="Quad">Quad</option>
              <option value="Fancy">Fancy</option>
            </select>
          </FormField>
          <FormField label="Club" required>
            <select
              value={formData.clubId || ''}
              onChange={(e) => setFormData({ ...formData, clubId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              disabled={isReadOnly}
            >
              <option value="">Select a club</option>
              {clubs?.map((club) => (
                <option key={club?.id} value={club?.id}>
                  {club?.clubName}
                </option>
              ))}
            </select>
          </FormField>

          <FormField label="State" required>
            <select
              value={formData.stateId || ''}
              onChange={(e) => {
                const stateId = parseInt(e.target.value);
                setFormData({ ...formData, stateId: stateId, districtId: undefined });
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              disabled={isReadOnly}
            >
              <option value="">Select State</option>
              {states?.map((state) => (
                <option key={state.id} value={state.id}>
                  {state.name}
                </option>
              ))}
            </select>
          </FormField>

          <FormField label="District" required>
            <select
              value={formData.districtId || ''}
              onChange={(e) => {
                setFormData({ ...formData, districtId: parseInt(e.target.value) });
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              disabled={isReadOnly || !formData.stateId}
            >
              <option value="">Select District</option>
              {districts
                ?.filter((district) => district?.stateId === formData.stateId)
                .map((district) => (
                  <option key={district.id} value={district.id}>
                    {district.name}
                  </option>
                ))}
            </select>
          </FormField>

          <FormField label="Address">
            <input
              type="text"
              value={formData.address || ''}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              readOnly={isReadOnly}
            />
          </FormField>

          <FormField label="School Name">
            <input
              type="text"
              value={formData.schoolName || ''}
              onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              readOnly={isReadOnly}
            />
          </FormField>

          <FormField label="School Affiliation Number">
            <input
              type="text"
              value={formData.schoolAffiliationNumber || ''}
              onChange={(e) => setFormData({ ...formData, schoolAffiliationNumber: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              readOnly={isReadOnly}
            />
          </FormField>

          <ImageUpload
            label="Profile Image"
            value={formData.profileImageUrl}
            onChange={(url) => setFormData({ ...formData, profileImageUrl: url })}
            readOnly={isReadOnly}
            uploadUrl={`${baseUrl}/upload/image/`}
          />

          <ImageUpload
            label="Aadhar Image"
            value={formData.aadharImageUrl}
            onChange={(url) => setFormData({ ...formData, aadharImageUrl: url })}
            readOnly={isReadOnly}
            uploadUrl={`${baseUrl}/upload/image/`}
          />


          <FormField label="Aadhar Number">
            {/* <input
              type="tel"
              value={formData.aadharNumber || ''}
              onChange={(e) => setFormData({ ...formData, aadharNumber: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              readOnly={isReadOnly}
              pattern="[0-9]{12}"
              maxLength={12}
              title="Enter a 12-digit Aadhar number"
            /> */}
            <input
              type="text"
              value={formData.aadharNumber || ''}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d{0,12}$/.test(value)) {
                  setFormData({ ...formData, aadharNumber: value });
                }
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              readOnly={isReadOnly}
              maxLength={12}
              inputMode="numeric"
              title="Enter a 12-digit Aadhar number"
            />
          </FormField>
        </div>

        {mode !== 'view' && (
          <div className="flex items-center">
            <input
              type="checkbox"
              id="approved"
              checked={formData.approvalStatus == 'approved' || false}
              onChange={(e) => setFormData({ ...formData, approvalStatus: e.target.checked ? 'approved' : 'pending' })}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <label htmlFor="approved" className="ml-2 text-sm text-gray-700">
              Approve
            </label>
          </div>
        )}

        {mode !== 'view' && (
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              <Save size={16} className="mr-2" />
              {mode === 'create' ? 'Create Player' : 'Update Player'}
            </Button>
          </div>
        )}
      </form>
    </Modal>
  );
};

export default PlayerModal;
