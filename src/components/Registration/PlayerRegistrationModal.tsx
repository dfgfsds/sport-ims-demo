import React, { useState } from 'react';
import { Save, X, Camera } from 'lucide-react';
import Modal from '../UI/Modal';
import Button from '../UI/Button';
import FormField from '../UI/FormField';
import ImageCropper from './ImageCropper';
import { mockClubs } from '../../data/mockData';
import axios from 'axios';
import ImageUpload from '../UI/ImageUpload';
import { useLocation } from '../../context/LocationContext';
import { useClubs } from '../../context/ClubContext';
import { toast } from 'react-toastify';

interface PlayerRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const PlayerRegistrationModal: React.FC<PlayerRegistrationModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const { states, districts, loading } = useLocation();
  const { clubs } = useClubs();
  const baseUrl = import.meta.env.VITE_API_BASE_URL
  const [error, setError] = useState<any>();
  const [formData, setFormData] = React.useState<any>({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: 'male',
    clubId: '',
    category: 'beginner',
    district: '',
    state: '',
    address: '',
    profileImage: '',
    aadharNumber: '',
    aadharImage: '', // base64 or URL
    schoolName: '',
    schoolAffiliationNumber: '',
  });

  const [Postloading, setLoading] = React.useState(false);
  const [showImageCropper, setShowImageCropper] = React.useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('')

    if(formData.profileImage==''){
      setError('Upload Profile Image')

      return;
    }


    try {
      const payload = {
        name: formData.name,
        dob: formData.dateOfBirth,
        gender: formData.gender,
        districtId: parseInt(formData.district),
        stateId: parseInt(formData.state),
        clubId: parseInt(formData.clubId),
        address: formData.address,
        schoolName: formData.schoolName,
        schoolAffiliationNumber: formData.schoolAffiliationNumber,
        profileImageUrl: formData.profileImage,
        aadharImageUrl: formData.aadharImage,
        aadharNumber: formData.aadharNumber,
        skateCategory: formData.category,
        mobileNumber: formData.phone,
        email: formData.email
      };
      const updateApi = await axios.put(`${baseUrl}/players/`, payload);
      if (updateApi) {
        toast.success("Player registered successfully!")
        onClose();
        setFormData('')
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Player registration failed!")
      setError(error?.response?.data?.message || "Something went wrong. Please try again.")
    } finally {
      setLoading(false);
    }
  };


  const handleImageCropComplete = (croppedImageUrl: string) => {
    setFormData({ ...formData, profileImage: croppedImageUrl });
  };

  const handleSendOtp = async () => {
    setOtpError('');
    try {
      const res = await axios.post(`${baseUrl}/login/player/register/send-otp`, {
        mobileNumber: formData.phone
      });

      if (res?.data?.success) {
        toast.success(res?.data?.message || "OTP send sucessfully!")
        setOtpSent(true);
      } else {
        setOtpError(res?.data?.error || 'OTP send failed');
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.error)

      setOtpError(err?.response?.data?.error || 'OTP send failed');
    }
  };

  const handleVerifyOtp = async () => {
    setOtpError('');
    try {
      const res = await axios.post(`${baseUrl}/login/player/register/verify-otp`, {
        mobileNumber: formData.phone,
        otp: otp
      });

      if (res?.data?.success) {
        setOtpVerified(true);
      } else {
        setOtpError(res?.data?.message || 'OTP verification failed');
      }
    } catch (err: any) {
      setOtpError(err?.response?.data?.message || 'OTP verification failed');
    }
  };




  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="Player Registration" size="2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Image Section */}
          {/* <div className="text-center">
            <div className="relative inline-block">
              <div className="w-32 h-32 rounded-full overflow-hidden mx-auto mb-4 bg-gray-200 border-4 border-white shadow-lg">
                {formData.profileImage ? (
                  <img
                    src={formData.profileImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <Camera className="w-8 h-8 text-gray-400" />
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => setShowImageCropper(true)}
                className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors shadow-lg"
              >
                <Camera size={16} />
              </button>
            </div>
            <p className="text-sm text-gray-600">Click the camera icon to upload and crop your profile picture</p>
          </div> */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Full Name" required>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter full name"
                required
              />
            </FormField>

            <FormField label="Email Address" required>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter email address"
                required
              />
            </FormField>

            {/* <FormField label="Phone Number" required>
              <input
                type="tel"
                value={formData.phone}
                maxLength={10}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter phone number"
                required
              />
            </FormField> */}

            <FormField label="Phone Number" required>
              <div className="flex gap-2 items-center">
                <div>
                  <input
                    type="tel"
                    value={formData.phone}
                    maxLength={10}
                    onChange={(e) => {
                      setFormData({ ...formData, phone: e.target.value });
                      if (otpSent) setOtpSent(false);
                      if (otpVerified) setOtpVerified(false);
                      setOtp('');
                    }}
                    className={`!w-full px-3 py-2 border border-gray-300 rounded-lg ${otpVerified && 'border-green-600 text-green-600'}`}
                    placeholder="Enter phone number"
                    required
                    disabled={otpVerified}
                  // readOnly={otpVerified}
                  />
                  {otpVerified && (
                    <div className="text-green-600 text-sm mt-1">
                      Phone number verified
                    </div>
                  )}
                </div>
                {!otpVerified && (
                  <Button
                    type="button"
                    disabled={formData.phone.length !== 10}
                    onClick={handleSendOtp}
                  >
                    {otpSent ? 'Sent' : 'Send OTP'}
                  </Button>
                )}
              </div>
            </FormField>

            {otpSent && !otpVerified && (
              <FormField label="Enter OTP" required>
                <input
                  type="text"
                  value={otp}
                  maxLength={6}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Enter 6-digit OTP"
                />
                <Button
                  className="mt-2"
                  type="button"
                  disabled={otp.length !== 6}
                  onClick={handleVerifyOtp}
                >
                  Verify OTP
                </Button>
                {otpError && <p className="text-sm text-red-500">{otpError}</p>}
              </FormField>
            )}




            <FormField label="Date of Birth" required>
              <input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </FormField>

            <FormField label="Gender" required>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </FormField>

            <FormField label="Club" required>
              <select
                value={formData.clubId || ''}
                onChange={(e) => setFormData({ ...formData, clubId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select a club</option>
                {clubs?.map((club) => (
                  <option key={club?.id} value={club?.id}>
                    {club?.clubName}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField label="Category" required>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="beginner">Beginner</option>
                <option value="fancy">Fancy</option>
                <option value="inline">Inline</option>
                <option value="quad">Quad</option>
              </select>
            </FormField>

            <FormField label="State" required>
              <select
                value={formData.state || ''}
                onChange={(e) => {
                  const state = parseInt(e.target.value);
                  setFormData({ ...formData, state, districtId: undefined });
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                disabled={loading}
              >
                <option value="">Select State</option>
                {states?.map((state: any) => (
                  <option key={state.id} value={state.id}>
                    {state.name}
                  </option>
                ))}
              </select>

            </FormField>

            <FormField label="District" required>
              <select
                value={formData.district}
                onChange={(e) => {
                  const districtId = parseInt(e.target.value);
                  setFormData({ ...formData, district: districtId });
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                disabled={loading || !formData?.state}
              >
                <option value="">Select District</option>
                {districts
                  ?.filter((district: any) => district?.stateId === formData?.state)
                  .map((district: any) => (
                    <option key={district.id} value={district.id}>
                      {district.name}
                    </option>
                  ))}
              </select>

            </FormField>


            <FormField label="Address">
              <textarea
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                placeholder="Enter complete address"
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <FormField label="Aadhar Number/ Birth Certificate number" required>
              <input
                type="text"
                maxLength={12}
                value={formData.aadharNumber}
                onChange={(e) => setFormData({ ...formData, aadharNumber: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="Enter Aadhar Number"
                required
              />
            </FormField>

            <FormField label="School Name" required>
              <input
                type="text"
                value={formData.schoolName}
                onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </FormField>

            <FormField label="Affiliation Number" >
              <input
                type="text"
                value={formData.schoolAffiliationNumber}
                onChange={(e) => setFormData({ ...formData, schoolAffiliationNumber: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"

              />
            </FormField>


          </div>



          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <ImageUpload
              label="Profile Image "
              value={formData.profileImage}
              onChange={(url) => setFormData({ ...formData, profileImage: url })}
              uploadUrl={`${baseUrl}/upload/image/`}
              fileSize='max file size 500kb'
            />

            <ImageUpload
              label="Aadhar Image"
              value={formData.aadharImage}
              onChange={(url) => setFormData({ ...formData, aadharImage: url })}
              uploadUrl={`${baseUrl}/upload/image/`}
              fileSize='max file size 1mb'
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm text-end">{error}</div>
          )}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button variant="secondary" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" loading={Postloading} disabled={!otpVerified}>
              <Save size={16} className="mr-2" />
              Register Player
            </Button>
          </div>
        </form>
      </Modal>

      {/* Image Cropper Modal */}
      <ImageCropper
        isOpen={showImageCropper}
        onClose={() => setShowImageCropper(false)}
        onCropComplete={handleImageCropComplete}
        aspectRatio={1}
        title="Crop Profile Picture"
      />
    </>
  );
};

export default PlayerRegistrationModal;