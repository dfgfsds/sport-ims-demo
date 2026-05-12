// import React, { useState } from 'react';
// import { Save } from 'lucide-react';
// import Modal from '../UI/Modal';
// import Button from '../UI/Button';
// import FormField from '../UI/FormField';
// import ImageUpload from '../UI/ImageUpload';
// import axios from 'axios';
// import { useLocation } from '../../context/LocationContext';

// interface ClubRegistrationModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onSubmit: (data: any) => void;
// }

// const ClubRegistrationModal: React.FC<ClubRegistrationModalProps> = ({ isOpen, onClose, onSubmit }) => {
//   const [formData, setFormData] = React.useState<any>({
//     stateId: '',
//     districtId: '',
//     clubName: '',
//     coachName: '',
//     mobileNumber: '',
//     email: '',
//     password: '',
//     societyCertificateNumber: '',
//     aadharNumber: '',
//     certificateUrl: '',
//     address: '',
//     approvalStatus: 'pending' // default to 'pending'
//   });

//   const baseUrl = import.meta.env.VITE_API_BASE_URL
//   const [loadingPost, setLoading] = React.useState(false);
//   const { states, districts, loading } = useLocation();
//   const [error, setError] = useState<any>();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const response = await axios.post(`${baseUrl}/clubs/register`, formData);
//       // await new Promise(resolve => setTimeout(resolve, 1000));
//       // onSubmit(formData);
//       if (response) {
//         onClose();
//         setFormData({
//           stateId: '',
//           districtId: '',
//           clubName: '',
//           coachName: '',
//           mobileNumber: '',
//           email: '',
//           password: '',
//           societyCertificateNumber: '',
//           aadharNumber: '',
//           certificateUrl: '',
//           address: '',
//           approvalStatus: 'pending'
//         });
//       }
//     } catch (error:any) {
//       setError(error?.response?.data?.message || "Something went wrong. Please try again.")
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Modal isOpen={isOpen} onClose={onClose} title="Club Registration" size="2xl">
//       <form onSubmit={handleSubmit} className="space-y-6">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <FormField label="Club Name" required>
//             <input
//               type="text"
//               value={formData.clubName}
//               onChange={(e) => setFormData({ ...formData, clubName: e.target.value })}
//               required
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               placeholder="Enter club name"
//             />
//           </FormField>


//           <FormField label="Coach Name" required>
//             <input
//               type="text"
//               value={formData.coachName}
//               onChange={(e) => setFormData({ ...formData, coachName: e.target.value })}
//               required
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               placeholder="Enter coach name"
//             />
//           </FormField>


//           <FormField label="Email Address" required>
//             <input
//               type="email"
//               value={formData.email}
//               onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               placeholder="Enter email address"
//               required
//             />
//           </FormField>

//           <FormField label="Phone Number" required>
//             <input
//               type="tel"
//               value={formData.mobileNumber}
//               maxLength={10}
//               onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               placeholder="Enter phone number"
//               required
//             />
//           </FormField>


//           <FormField label="Password" required>
//             <input
//               type="password"
//               value={formData.password}
//               onChange={(e) => setFormData({ ...formData, password: e.target.value })}
//               required
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               placeholder="Enter password"
//             />
//           </FormField>

//           <FormField label="Society Certificate Number" required>
//             <input
//               type="text"
//               value={formData.societyCertificateNumber}
//               onChange={(e) => setFormData({ ...formData, societyCertificateNumber: e.target.value })}
//               required
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               placeholder="Enter certificate number"
//             />
//           </FormField>

//           <FormField label="Aadhar Number" required>
//             <input
//               type="text"
//               maxLength={12}
//               value={formData.aadharNumber}
//               onChange={(e) => setFormData({ ...formData, aadharNumber: e.target.value })}
//               required
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               placeholder="Enter Aadhar number"
//             />
//           </FormField>

//           <FormField label="State" required>
//           <select
//                 value={formData.stateId || ''}
//                 onChange={(e) => {
//                   const stateId = parseInt(e.target.value);
//                   setFormData({ ...formData, stateId, districtId: undefined });
//                 }}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 required
//                 disabled={loading}
//               >
//                 <option value="">Select State</option>
//                 {states?.map((state: any) => (
//                   <option key={state.id} value={state.id}>
//                     {state.name}
//                   </option>
//                 ))}
//               </select>
//           </FormField>

//           <FormField label="District" required>
//             <select
//                 value={formData.districtId}
//                 onChange={(e) => {
//                   const districtId = parseInt(e.target.value);
//                   setFormData({ ...formData, districtId: districtId });
//                 }}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 required
//                 disabled={loading || !formData?.stateId}
//               >
//                 <option value="">Select District</option>
//                 {districts
//                   ?.filter((district: any) => district?.stateId === formData?.stateId)
//                   .map((district: any) => (
//                     <option key={district.id} value={district.id}>
//                       {district.name}
//                     </option>
//                   ))}
//               </select>
//           </FormField>

       
//         </div>

//         <FormField label="Club Address" required>
//           <textarea
//             value={formData.address}
//             onChange={(e) => setFormData({ ...formData, address: e.target.value })}
//             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             rows={3}
//             placeholder="Enter complete club address"
//             required
//           />
//         </FormField>

//         <ImageUpload
//           label="Certificate URL"
//           value={formData.certificateUrl}
//           onChange={(url) => setFormData({ ...formData, certificateUrl: url })}
//           uploadUrl={`${baseUrl}/upload/image/`}
//         />


//         <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
//           <h4 className="font-medium text-yellow-800 mb-2">Required Documents</h4>
//           <ul className="text-sm text-yellow-700 space-y-1">
//             <li>• Club registration certificate</li>
//             <li>• Contact person identification</li>
//             <li>• Facility ownership/lease documents</li>
//             <li>• Insurance certificate (if applicable)</li>
//           </ul>
//           <p className="text-sm text-yellow-700 mt-2">
//             You will be contacted to submit these documents after initial registration.
//           </p>
//         </div>

//         {error && (
//             <div className="text-red-500 text-sm text-end">{error}</div>
//           )}

//         <div className="flex justify-end space-x-3 pt-4 border-t">
//           <Button variant="secondary" onClick={onClose} disabled={loadingPost}>
//             Cancel
//           </Button>
//           <Button type="submit" loading={loadingPost}>
//             <Save size={16} className="mr-2" />
//             Register Club
//           </Button>
//         </div>
//       </form>
//     </Modal>
//   );
// };

// export default ClubRegistrationModal;


import React, { useState } from 'react';
import { Save } from 'lucide-react';
import Modal from '../UI/Modal';
import Button from '../UI/Button';
import FormField from '../UI/FormField';
import ImageUpload from '../UI/ImageUpload';
import axios from 'axios';
import { useLocation } from '../../context/LocationContext';

interface ClubRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const ClubRegistrationModal: React.FC<ClubRegistrationModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = React.useState<any>({
    stateId: '',
    districtId: '',
    clubName: '',
    coachName: '',
    mobileNumber: '',
    email: '',
    password: '',
    societyCertificateNumber: '',
    aadharNumber: '',
    certificateUrl: '',
    address: '',
    approvalStatus: 'pending'
  });

  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const [loadingPost, setLoading] = React.useState(false);
  const { states, districts, loading } = useLocation();
  const [error, setError] = useState<any>();

  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpError, setOtpError] = useState('');

  const handleSendOtp = async () => {
    setOtpError('');
    try {
      const res = await axios.post(`${baseUrl}/login/send-otp`, {
        mobileNumber: formData.mobileNumber
      });
      if (res?.data?.success) setOtpSent(true);
      else setOtpError(res?.data?.message || 'Failed to send OTP');
    } catch (err: any) {
      setOtpError(err?.response?.data?.message || 'Failed to send OTP');
    }
  };

  const handleVerifyOtp = async () => {
    setOtpError('');
    try {
      const res = await axios.post(`${baseUrl}/login/verify-otp`, {
        mobileNumber: formData.mobileNumber,
        otp
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${baseUrl}/clubs/register`, formData);
        // const response = await axios.post(`${baseUrl}/clubs/register-approved`, formData);
      if (response) {
        onClose();
        setFormData({
          stateId: '',
          districtId: '',
          clubName: '',
          coachName: '',
          mobileNumber: '',
          email: '',
          password: '',
          societyCertificateNumber: '',
          aadharNumber: '',
          certificateUrl: '',
          address: '',
          approvalStatus: 'pending'
        });
        setOtp('');
        setOtpSent(false);
        setOtpVerified(false);
      }
    } catch (error: any) {
      setError(error?.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Club Registration" size="2xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Club Name */}
          <FormField label="Club Name" required>
            <input
              type="text"
              value={formData.clubName}
              onChange={(e) => setFormData({ ...formData, clubName: e.target.value })}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="Enter club name"
            />
          </FormField>

          {/* Coach Name */}
          <FormField label="Coach Name" required>
            <input
              type="text"
              value={formData.coachName}
              onChange={(e) => setFormData({ ...formData, coachName: e.target.value })}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="Enter coach name"
            />
          </FormField>


          {/* Phone Number with OTP */}
          <FormField label="Phone Number" required>
            <div className="flex gap-2 items-center">
              <div className="w-full">
                <input
                  type="tel"
                  value={formData.mobileNumber}
                  maxLength={10}
                  onChange={(e) => {
                    setFormData({ ...formData, mobileNumber: e.target.value });
                    if (otpSent) setOtpSent(false);
                    if (otpVerified) setOtpVerified(false);
                    setOtp('');
                  }}
                  className={`w-full px-3 py-2 border rounded-lg ${otpVerified ? 'border-green-500 text-green-600' : ''}`}
                  placeholder="Enter phone number"
                  required
                  disabled={otpVerified}
                />
                {otpVerified && (
                  <p className="text-sm text-green-600 mt-1">Phone number verified</p>
                )}
              </div>
              {!otpVerified && (
                <Button
                  type="button"
                  disabled={formData.mobileNumber.length !== 10}
                  onClick={handleSendOtp}
                >
                  {otpSent ? 'Sent' : 'SendOTP'}
                </Button>
              )}
            </div>
          </FormField>

          {/* OTP Input */}
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
              {otpError && <p className="text-sm text-red-500 mt-1">{otpError}</p>}
            </FormField>
          )}

          {/* Email */}
          <FormField label="Email Address" required>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="Enter email address"
              required
            />
          </FormField>

          {/* Password */}
          <FormField label="Password" required>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="Enter password"
            />
          </FormField>

          {/* Society Certificate Number */}
          <FormField label="Society Certificate Number" >
            <input
              type="text"
              value={formData.societyCertificateNumber}
              onChange={(e) => setFormData({ ...formData, societyCertificateNumber: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="Enter certificate number"
            />
          </FormField>

          {/* Aadhar Number */}
          <FormField label="Aadhar Number" >
            <input
              type="text"
              maxLength={12}
              value={formData.aadharNumber}
              onChange={(e) => setFormData({ ...formData, aadharNumber: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="Enter Aadhar number"
            />
          </FormField>

          {/* State */}
          <FormField label="State" required>
            <select
              value={formData.stateId || ''}
              onChange={(e) => {
                const stateId = parseInt(e.target.value);
                setFormData({ ...formData, stateId, districtId: undefined });
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
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

          {/* District */}
          <FormField label="District" required>
            <select
              value={formData.districtId}
              onChange={(e) => {
                const districtId = parseInt(e.target.value);
                setFormData({ ...formData, districtId });
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              required
              disabled={loading || !formData.stateId}
            >
              <option value="">Select District</option>
              {districts
                ?.filter((district: any) => district?.stateId === formData.stateId)
                .map((district: any) => (
                  <option key={district.id} value={district.id}>
                    {district.name}
                  </option>
                ))}
            </select>
          </FormField>
        </div>

        {/* Address */}
        <FormField label="Club Address" required>
          <textarea
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            rows={3}
            placeholder="Enter complete club address"
            required
          />
        </FormField>

        {/* Certificate Upload */}
        <ImageUpload
          label="Certificate URL"
          value={formData.certificateUrl}
          onChange={(url) => setFormData({ ...formData, certificateUrl: url })}
          uploadUrl={`${baseUrl}/upload/image/`}
        />

        {/* Document Instructions */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 className="font-medium text-yellow-800 mb-2">Required Documents</h4>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• Club registration certificate</li>
            <li>• Contact person identification</li>
            <li>• Facility ownership/lease documents</li>
            <li>• Insurance certificate (if applicable)</li>
          </ul>
          <p className="text-sm text-yellow-700 mt-2">
            You will be contacted to submit these documents after initial registration.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="text-red-500 text-sm text-end">{error}</div>
        )}

        {/* Footer Buttons */}
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button variant="secondary" onClick={onClose} disabled={loadingPost}>
            Cancel
          </Button>
          <Button type="submit" loading={loadingPost} disabled={!otpVerified}>
            <Save size={16} className="mr-2" />
            Register Club
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ClubRegistrationModal;
