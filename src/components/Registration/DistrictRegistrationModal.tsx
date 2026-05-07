// import React, { useState } from 'react';
// import { Save } from 'lucide-react';
// import Modal from '../UI/Modal';
// import Button from '../UI/Button';
// import FormField from '../UI/FormField';
// import { useLocation } from '../../context/LocationContext';
// import ImageUpload from '../UI/ImageUpload';
// import axios from 'axios';

// interface DistrictRegistrationModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onSubmit: (data: any) => void;
// }

// const DistrictRegistrationModal: React.FC<DistrictRegistrationModalProps> = ({ isOpen, onClose, onSubmit }) => {
//   const [formData, setFormData] = React.useState<any>({
//     secretaryName: '',
//     password: '',
//     stateId: '',
//     districtId: '',
//     mobileNumber: '',
//     email: '',
//     societyCertificateNumber: '',
//     aadharNumber: '',
//     certificateUrl: '',
//     address: ''
//   });

//   const [loadingPost, setLoading] = React.useState(false);
//   const { states, districts, loading } = useLocation();
//   const [error, setError] = useState<any>();
//   const baseUrl = import.meta.env.VITE_API_BASE_URL


//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('')
//     try {
//       // Simulate API call
//       const updateApi = await axios.post(`${baseUrl}/district_secretaries/register`, formData);
//       if (updateApi) {
//         onClose();
//         setFormData('')
//       }
//     } catch (error: any) {
//       setError(error?.response?.data?.message || "Something went wrong. Please try again.")
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Modal isOpen={isOpen} onClose={onClose} title="District Registration" size="2xl">
//       <form onSubmit={handleSubmit} className="space-y-6">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <FormField label="Secretary Name" required>
//             <input
//               type="text"
//               value={formData.secretaryName}
//               onChange={(e) => setFormData({ ...formData, secretaryName: e.target.value })}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               placeholder="Enter district name"
//               required
//             />
//           </FormField>

//           <FormField label="Password" required>
//             <input
//               type="password"
//               value={formData.password}
//               onChange={(e) => setFormData({ ...formData, password: e.target.value })}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               placeholder="Enter password"
//               required
//             />
//           </FormField>

//           <FormField label="State" required>
//             <select
//               value={formData.stateId || ''}
//               onChange={(e) => {
//                 const stateId = parseInt(e.target.value);
//                 setFormData({ ...formData, stateId, districtId: undefined });
//               }}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               required
//               disabled={loading}
//             >
//               <option value="">Select State</option>
//               {states?.map((state: any) => (
//                 <option key={state.id} value={state.id}>
//                   {state.name}
//                 </option>
//               ))}
//             </select>
//           </FormField>

//           <FormField label="District" required>
//             <select
//               value={formData.districtId}
//               onChange={(e) => {
//                 const districtId = parseInt(e.target.value);
//                 setFormData({ ...formData, districtId: districtId });
//               }}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               required
//               disabled={loading || !formData?.stateId}
//             >
//               <option value="">Select District</option>
//               {districts
//                 ?.filter((district: any) => district?.stateId === formData?.stateId)
//                 .map((district: any) => (
//                   <option key={district.id} value={district.id}>
//                     {district.name}
//                   </option>
//                 ))}
//             </select>
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
//               onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               placeholder="Enter phone number"
//               required
//             />
//           </FormField>
//         </div>

//         <FormField label="Society Certificate Number" required>
//           <input
//             type="text"
//             value={formData.societyCertificateNumber}
//             onChange={(e) => setFormData({ ...formData, societyCertificateNumber: e.target.value })}
//             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             placeholder="Enter certificate number"
//             required
//           />
//         </FormField>

//         <FormField label="Aadhar Number" required>
//           <input
//             type="text"
//             maxLength={12}
//             value={formData.aadharNumber}
//             onChange={(e) => setFormData({ ...formData, aadharNumber: e.target.value })}
//             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             placeholder="Enter Aadhar number"
//             required
//           />
//         </FormField>

//         <FormField label="Address" required>
//           <textarea
//             value={formData.address}
//             onChange={(e) => setFormData({ ...formData, address: e.target.value })}
//             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             rows={3}
//             placeholder="Enter complete district office address"
//             required
//           />
//         </FormField>


//         <ImageUpload
//           label="Certificate"
//           value={formData.certificateUrl}
//           onChange={(url) => setFormData({ ...formData, certificateUrl: url })}
//           uploadUrl={`${baseUrl}/upload/image/`}
//         />


//         <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
//           <h4 className="font-medium text-blue-800 mb-2">Required Documents</h4>
//           <ul className="text-sm text-blue-700 space-y-1">
//             <li>• Official district authorization letter</li>
//             <li>• Contact person identification and authorization</li>
//             <li>• District sports policy document</li>
//             <li>• List of sports facilities in the district</li>
//           </ul>
//           <p className="text-sm text-blue-700 mt-2">
//             You will be contacted to submit these documents after initial registration.
//           </p>
//         </div>

//         {error && (
//           <div className="text-red-500 text-sm text-end">{error}</div>
//         )}
//         <div className="flex justify-end space-x-3 pt-4 border-t">
//           <Button variant="secondary" onClick={onClose} disabled={loadingPost}>
//             Cancel
//           </Button>
//           <Button type="submit" loading={loadingPost}>
//             <Save size={16} className="mr-2" />
//             Register District
//           </Button>
//         </div>
//       </form>
//     </Modal>
//   );
// };

// export default DistrictRegistrationModal;


import React, { useState } from 'react';
import { Save } from 'lucide-react';
import Modal from '../UI/Modal';
import Button from '../UI/Button';
import FormField from '../UI/FormField';
import { useLocation } from '../../context/LocationContext';
import ImageUpload from '../UI/ImageUpload';
import axios from 'axios';
import { toast } from 'react-toastify';

interface DistrictRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const DistrictRegistrationModal: React.FC<DistrictRegistrationModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = React.useState<any>({
    secretaryName: '',
    password: '',
    stateId: '',
    districtId: '',
    mobileNumber: '',
    email: '',
    societyCertificateNumber: '',
    aadharNumber: '',
    certificateUrl: '',
    address: ''
  });

  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const [loadingPost, setLoading] = React.useState(false);
  const { states, districts, loading } = useLocation();
  const [error, setError] = useState<any>('');

  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpError, setOtpError] = useState('');

  const handleSendOtp = async () => {
    setOtpError('');
    try {
      const res = await axios.post(`${baseUrl}/login/send-otp`, {
        mobileNumber: formData.mobileNumber,
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
        otp,
      });
      if (res?.data?.success) setOtpVerified(true);
      else setOtpError(res?.data?.message || 'OTP verification failed');
    } catch (err: any) {
      setOtpError(err?.response?.data?.message || 'OTP verification failed');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(`${baseUrl}/district_secretaries/register`, formData);
      if (res) {
        toast.success('District registered successfully!');
        onClose();
        setFormData({
          secretaryName: '',
          password: '',
          stateId: '',
          districtId: '',
          mobileNumber: '',
          email: '',
          societyCertificateNumber: '',
          aadharNumber: '',
          certificateUrl: '',
          address: ''
        });
        setOtp('');
        setOtpSent(false);
        setOtpVerified(false);
      }
    } catch (error: any) {
      const msg = error?.response?.data?.message || "Something went wrong. Please try again.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="District Registration" size="2xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <FormField label="Secretary Name" required>
            <input
              type="text"
              value={formData.secretaryName}
              onChange={(e) => setFormData({ ...formData, secretaryName: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="Enter district name"
              required
            />
          </FormField>

          <FormField label="Password" required>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="Enter password"
              required
            />
          </FormField>

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
                ?.filter((district: any) => district.stateId === formData.stateId)
                .map((district: any) => (
                  <option key={district.id} value={district.id}>
                    {district.name}
                  </option>
                ))}
            </select>
          </FormField>



          <FormField label="Phone Number" required>
            <div className="flex gap-2 items-center">
              <input
                type="tel"
                value={formData.mobileNumber}
                onChange={(e) => {
                  setFormData({ ...formData, mobileNumber: e.target.value });
                  setOtp('');
                  setOtpSent(false);
                  setOtpVerified(false);
                }}
                className={`w-full px-3 py-2 border rounded-lg ${otpVerified ? 'border-green-500 text-green-600' : ''}`}
                placeholder="Enter phone number"
                required
                disabled={otpVerified}
              />
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
            {otpVerified && (
              <p className="text-sm text-green-600 mt-1">Phone number verified</p>
            )}
          </FormField>

          {otpSent && !otpVerified && (
            <FormField label="Enter OTP" required>
              <input
                type="text"
                maxLength={6}
                value={otp}
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
        </div>
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
        <FormField label="Society Certificate Number" required>
          <input
            type="text"
            value={formData.societyCertificateNumber}
            onChange={(e) => setFormData({ ...formData, societyCertificateNumber: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            placeholder="Enter certificate number"
            required
          />
        </FormField>

        <FormField label="Aadhar Number" required>
          <input
            type="text"
            maxLength={12}
            value={formData.aadharNumber}
            onChange={(e) => setFormData({ ...formData, aadharNumber: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            placeholder="Enter Aadhar number"
            required
          />
        </FormField>

        <FormField label="Address" required>
          <textarea
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            rows={3}
            placeholder="Enter complete district office address"
            required
          />
        </FormField>

        <ImageUpload
          label="Certificate"
          value={formData.certificateUrl}
          onChange={(url) => setFormData({ ...formData, certificateUrl: url })}
          uploadUrl={`${baseUrl}/upload/image/`}
        />

        {/* <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-800 mb-2">Required Documents</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Official district authorization letter</li>
            <li>• Contact person identification and authorization</li>
            <li>• District sports policy document</li>
            <li>• List of sports facilities in the district</li>
          </ul>
          <p className="text-sm text-blue-700 mt-2">
            You will be contacted to submit these documents after initial registration.
          </p>
        </div> */}

        {error && (
          <div className="text-red-500 text-sm text-end">{error}</div>
        )}

        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button variant="secondary" onClick={onClose} disabled={loadingPost}>
            Cancel
          </Button>
          <Button type="submit" loading={loadingPost} disabled={!otpVerified}>
            <Save size={16} className="mr-2" />
            Register District
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default DistrictRegistrationModal;
