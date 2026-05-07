import React, { useEffect, useState } from 'react';
import { Users, Smartphone, Eye, EyeOff } from 'lucide-react';
import Button from '../components/UI/Button';
import FormField from '../components/UI/FormField';
import Card from '../components/UI/Card';
import PlayerRegistrationModal from '../components/Registration/PlayerRegistrationModal';
import ClubRegistrationModal from '../components/Registration/ClubRegistrationModal';
import DistrictRegistrationModal from '../components/Registration/DistrictRegistrationModal';
import StateRegistrationModal from '../components/Registration/StateRegistrationModal';
import axios from 'axios';
import { redirectBasedOnRole } from '../Layout';
import { useNavigate } from 'react-router-dom';
import { usePlayer } from '../context/PlayerContext';
import { OTPVerificationResponse } from '../types-1';
import { verifyAadharOTPLogin } from '../services/api';

const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = '123456';

const Login: React.FC = () => {
  const [loginType, setLoginType] = React.useState<'admin' | 'player'>('admin');
  const [showPassword, setShowPassword] = React.useState(false);
  const [adminCredentials, setAdminCredentials] = React.useState({
    username: '',
    password: ''
  });
  const {fetchPlayer}=usePlayer();
  const [playerCredentials, setPlayerCredentials] = React.useState<any>({
    mobileNumber: '',
    otp: ''
  });
  const [otpSent, setOtpSent] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [adminError, setAdminError] = React.useState<string | null>(null);
  const [OtpValue, setOtpValue] = useState<any>('')
  const [AadharverificationId, setAadharverificationId] = useState<any>('')
  const [playerExists, setPlayerExists] = useState<boolean>(false);

  
  const baseUrl = import.meta.env.VITE_API_BASE_URL
  const navigate = useNavigate();
  // Registration modal states
  const [showPlayerRegistration, setShowPlayerRegistration] = React.useState(false);
  const [showClubRegistration, setShowClubRegistration] = React.useState(false);
  const [showDistrictRegistration, setShowDistrictRegistration] = React.useState(false);
  const [showStateRegistration, setShowStateRegistration] = React.useState(false);
const [otpError, setOtpError] = React.useState<string | null>(null);
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAdminError(null);

    try {
      const response = await axios.post(`${baseUrl}/login/`, {
        username: adminCredentials.username,
        password: adminCredentials.password,
      });

      const data = response.data;

      if (data) {
        const { role, user } = data;

        if (role) localStorage.setItem('role', role);
        if (user?.id) localStorage.setItem('userId', user.id);
        if (user?.mobileNumber) localStorage.setItem('mobileNumber', user.mobileNumber);
        if (user?.email) localStorage.setItem('email', user.email);

        // CLUB specific
        if (user?.id) localStorage.setItem('id', user.id);
        if (user?.clubId) localStorage.setItem('clubId', user.clubId);
        if (user?.clubName) localStorage.setItem('clubName', user.clubName);
        if (user?.coachName) localStorage.setItem('coachName', user.coachName);

        // EVENT OFFICIAL specific
        if (user?.eventId) localStorage.setItem('eventId', user.eventId);
        if (user?.eventName) localStorage.setItem('eventName', user.eventName);
        if (user?.name) localStorage.setItem('name', user.name);

        // DISTRICT specific
        if (user?.districtSecretaryId) localStorage.setItem('userId', user?.districtSecretaryId);
        if (user?.districtId) localStorage.setItem('districtId', user?.districtId);
        if (user?.districtName) localStorage.setItem('districtName', user?.districtName);
        if (user?.secretaryName) localStorage.setItem('secretaryName', user?.secretaryName);

        // STATE specific
        if (user?.stateSecretaryId) localStorage.setItem('userId', user?.stateSecretaryId);
        if (user?.stateName) localStorage.setItem('stateName', user?.stateName);
        if (user?.secretaryName) localStorage.setItem('secretaryName', user?.secretaryName);
        if (user?.stateId) localStorage.setItem('stateId', user?.stateId);


        // Redirect based on role
        redirectBasedOnRole(role);
      }
      else {
        setAdminError('Login failed: role not found in response');
      }
    } catch (error: any) {
      setAdminError(error?.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };


 const sendAadharOTP = async (
    aadharNumber: string
  ): Promise<{
    reference_id: string | undefined; success: boolean; message: string; referenceId?: string 
  }> => {
    try {
      const response = await fetch('https://sportims-api.justvy.com/players/send-aadhaar-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ aadhaar_number: aadharNumber }),
      });
  
      const data = await response.json();
        // console.log(data.reference_id);
        console.log('Full data:', data); // ✅ Log full response first
        console.log('Reference ID:', data.reference_id); // ✅ Safely access
        setAadharverificationId(data.reference_id)
        setOtpValue(11111)
        setTimeout(() => {
          setLoading(false);
          setOtpSent(true);
        }, 1000);

      if (response.ok && data.status === 'otp_sent') {
                  console.log(data.reference_id);
        return {

          success: true,
          message: data.message || 'OTP sent successfully',
          referenceId: data.reference_id,
          reference_id: data.reference_id,
        };

      } else {
        return {
          success: false,
          message: data.error || 'Failed to send OTP',
          reference_id: undefined,
        };
      }
    } catch (error) {
      return {
        success: false,
        message: 'Error occurred while sending OTP',
        reference_id: undefined,
      };
    }
  };
  
  const verifyAadharOTP = async (
    aadharNumber: string,
    otp: string,
  ) => {
    try {
      const response = await fetch('https://sportims-api.justvy.com/players/verify-aadhar-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reference_id: AadharverificationId,
          aadhaar_number: aadharNumber,
          otp,
        }),
      });
  
      const data = await response.json();
  
      if (response.ok && data.player) {

        console.log('Player data:', data.player); // ✅ Log player data
        console.log('Full data:', data); // ✅ Log full response first

          // Save only if value exists
           localStorage.setItem('role', 'player');
         localStorage.setItem('userId', data?.player?.aadharNumber);
        localStorage.setItem('mobileNumber', data?.player?.aadharNumber);
           localStorage.setItem('email', '');
         localStorage.setItem('name', data?.player?.name);
       localStorage.setItem('clubName', '');
          localStorage.setItem('skateCategory', '');
          // Optional: Redirect

          // if (data?.userType) localStorage.setItem('role', data?.userType);
          // if (data?.user?.playerId) localStorage.setItem('userId', data?.user?.playerId);
          // if (data?.user?.mobileNumber) localStorage.setItem('mobileNumber', data?.user?.mobileNumber);
          // if (data?.user?.email) localStorage.setItem('email', data?.user?.email);
          // if (data?.user?.name) localStorage.setItem('name', data?.user?.name);
          // if (data?.user?.clubName) localStorage.setItem('clubName', data?.user?.clubName);
          // if (data?.user?.skateCategory) localStorage.setItem('skateCategory', data?.user?.skateCategory);
          navigate('/player');
          fetchPlayer()

        // return {
        //   success: true,
        //   verified: true,
        //   message: data.message || 'Aadhar number verified successfully',
        //   player: data.player,
        // };
      } else {
        // return {
        //   success: false,
        //   verified: false,
        //   message: data.error || 'Invalid OTP. Please try again.',
        // };
        setOtpError;
      }
    } catch (error) {
      // return {
      //   success: false,
      //   verified: false,
      //   message: 'Error occurred while verifying OTP',
      // };
    }
  };
  
  const handleSendOTP = async () => {

    console.log('Sending OTP to:', playerCredentials.mobileNumber);
    if (!playerCredentials.mobileNumber) return;
    setLoading(true);
    setAdminError('')
    const payload = playerCredentials?.mobileNumber?.length === 12
      ? { aadhaarNumber: playerCredentials.mobileNumber }
      : { mobileNumber: playerCredentials.mobileNumber };

    try {
      // console.log('Sending OTP to:', payload);

      const response = await fetch(`${baseUrl}/login/player/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      // console.log('OTP Response:', data); // Log the entire response object
      if(response.ok && playerCredentials?.mobileNumber?.length === 12){
        setPlayerExists(true);
                sendAadharOTP(playerCredentials?.mobileNumber);
      }
      if (response.ok) {
        setOtpValue(data?.otp);
        setTimeout(() => {
          setLoading(false);
          setOtpSent(true);
        }, 1001);
      }
      else if (playerCredentials?.mobileNumber?.length === 10) {
        setAdminError(data.error);
      }else if(playerCredentials?.mobileNumber?.length === 12 && data?.error=="Player not found"){
        // setAdminError("Aadhaar number not registered. Please register as a player.");
        sendAadharOTP(playerCredentials?.mobileNumber);

      }



    } catch (error: any) {
      if(error?.response?.data?.error=="Player not found" && playerCredentials?.mobileNumber?.length === 12 ){
                // setOtpValue(response?.data?.otp)
        setTimeout(() => {
          setLoading(false);
          setOtpSent(true);
        }, 1000);
        sendAadharOTP(playerCredentials?.mobileNumber);
      }else{
      setAdminError(error?.response?.data?.error || "Failed to send OTP. Please check the mobile/aadhar number and try again.");
      }
    } finally {
      setLoading(false);
    }
  };


  const handlePlayerLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setOtpError('')
    const payload = {
      ...(playerCredentials?.mobileNumber?.length === 12
        ? { aadhaarNumber: playerCredentials?.mobileNumber }
        : { mobileNumber: playerCredentials?.mobileNumber }),
      otp: playerCredentials.otp,
    };

    try {
      if(AadharverificationId){

                verifyAadharOTP(playerCredentials?.mobileNumber,playerCredentials.otp,);

      }
      else if (playerExists){
                verifyAadharOTPLogin(playerCredentials?.mobileNumber,playerCredentials.otp,AadharverificationId);

      }
    
      
      else{
                const response = await axios.post(`${baseUrl}/login/player/verify-otp`, payload, { withCredentials: false });
        const data: any = response?.data;

        if (data?.userType && data?.user?.playerId) {
          // Save only if value exists
          if (data?.userType) localStorage.setItem('role', data?.userType);
          if (data?.user?.playerId) localStorage.setItem('userId', data?.user?.playerId);
          if (data?.user?.mobileNumber) localStorage.setItem('mobileNumber', data?.user?.mobileNumber);
          if (data?.user?.email) localStorage.setItem('email', data?.user?.email);
          if (data?.user?.name) localStorage.setItem('name', data?.user?.name);
          if (data?.user?.clubName) localStorage.setItem('clubName', data?.user?.clubName);
          if (data?.user?.skateCategory) localStorage.setItem('skateCategory', data?.user?.skateCategory);
          // Optional: Redirect
          navigate('/player');
          fetchPlayer()
        } else {
          console.warn("Login failed: incomplete user data");
        }
      }

    } catch (error:any) {
      setOtpError(error?.response?.data?.error || "Login failed. Please check OTP and try again.");
    } finally {
      setLoading(false);
    }
  };


  const handleRegistrationSubmit = (data: any, type: string) => {
    console.log(`${type} registration data:`, data);
    // Here you would submit the registration data to your backend
  };

  useEffect(() => {
    const role = localStorage.getItem('role');
    const userId = localStorage.getItem('userId');

    if (role && userId) {
      switch (role) {
        case "admin":
          navigate("/", { replace: true });
          break;
        case "club":
          navigate("/club", { replace: true });
          break;
        case "official":
          navigate("/official", { replace: true });
          break;
        case "eventAdmin":
          navigate("/eventAdmin", { replace: true });
          break;
        case "event_organiser":
          navigate("/organiser", { replace: true });
          break;
        case "district_secretary":
          navigate("/district", { replace: true });
          break;
        case "state_secretary":
          navigate("/state", { replace: true });
          break;
        default:
          navigate("/login", { replace: true });
      }
    }
  }, [navigate]);


  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
      background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
      }}
    >
      <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <img
        src="https://sport-ims.in/assets/logo.jpg"
        alt="Sport-IMS Logo"
        className="mx-auto mb-2 h-16 w-100 object-contain"
        />
        <p className="text-white">Sports Management System</p>
      </div>

      <Card>
        {/* Login Type Selector */}
        <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => setLoginType('admin')}
          className={`flex-1 flex items-center justify-center py-2 px-4 rounded-md text-sm font-medium transition-colors ${loginType === 'admin'
          ? 'bg-white text-blue-600 shadow-sm'
          : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Users size={16} className="mr-2" />
          Admin Login
        </button>
        <button
          onClick={() => setLoginType('player')}
          className={`flex-1 flex items-center justify-center py-2 px-4 rounded-md text-sm font-medium transition-colors ${loginType === 'player'
          ? 'bg-white text-blue-600 shadow-sm'
          : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Smartphone size={16} className="mr-2" />
          Player Login
        </button>
        </div>

        {/* Admin Login Form */}
        {loginType === 'admin' && (
        <form onSubmit={handleAdminLogin} className="space-y-4">
          <FormField label="Username" required>
          <input
            type="text"
            value={adminCredentials.username}
            onChange={(e) => setAdminCredentials({ ...adminCredentials, username: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your username"
            required
          />
          </FormField>

          <FormField label="Password" required>
          <div className="relative">
            <input
            type={showPassword ? 'text' : 'password'}
            value={adminCredentials.password}
            onChange={(e) => setAdminCredentials({ ...adminCredentials, password: e.target.value })}
            className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your password"
            required
            />
            <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          </FormField>

          {adminError && (
          <div className="text-red-500 text-sm">{adminError}</div>
          )}

          <Button type="submit" className="w-full" loading={loading}>
          Sign In as Admin
          </Button>
        </form>
        )}

        {/* Player Login Form */}
        {loginType === 'player' && (
        <form onSubmit={handlePlayerLogin} className="space-y-4">
          <FormField label="Mobile Number/ Aadhar number" required>
          <div className="flex space-x-2">
            <input
            type="tel"
            maxLength={12}
            value={playerCredentials.mobileNumber}
            // onChange={(e) => setPlayerCredentials({ ...playerCredentials, mobileNumber: e.target.value })}
            onChange={(e) => {
              const value = e.target.value;
              setPlayerCredentials((prev:any) => ({
              ...prev,
              mobileNumber: value
              }));
              
              if (otpSent) {
              setOtpSent(false);
              setPlayerCredentials((prev:any) => ({ ...prev, otp: '' }));
              }
            }}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter mobile number"
            required
            />
            <Button
            type="button"
            onClick={handleSendOTP}
            variant="secondary"
            loading={loading && !otpSent}
            disabled={
              !playerCredentials.mobileNumber ||               // empty
              otpSent ||                                       // already sent
              !(playerCredentials.mobileNumber.length === 10 || playerCredentials.mobileNumber.length === 12) // not 10 or 12
            }

            >
            {otpSent ? 'Sent' : 'Send OTP'}
            </Button>
          </div>
          </FormField>

          {otpSent && (
          <FormField label="OTP" required>
            <input
            type="text"
            value={playerCredentials.otp}
            onChange={(e) => setPlayerCredentials({ ...playerCredentials, otp: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter 6-digit OTP"
            maxLength={6}
            required
            />
          </FormField>
          )}

          {adminError && (
          <div className="text-red-500 text-sm">{adminError}</div>
          )}
          {otpError && (
          <div className="text-red-500 text-sm">{otpError}</div>
          )}



          <Button
          type="submit"
          className="w-full"
          loading={loading && otpSent}
          disabled={!otpSent || !playerCredentials.otp}
          >
          Verify & Sign In
          </Button>
        </form>
        )}

        {/* Registration Links */}
        <div className="mt-6 pt-6 border-t border-gray-200">
        <p className="text-center text-sm text-gray-600 mb-4">
          Don't have an account?
        </p>
        <div className="grid grid-cols-2 gap-2">
          <Button
          variant="secondary"
          size="sm"
          className="text-xs border border-blue-600 text-blue-600"
          onClick={() => setShowPlayerRegistration(true)}
          >
          Register as Player
          </Button>
          <Button
          variant="secondary"
          size="sm"
          className="text-xs border border-blue-600 text-blue-600"
          onClick={() => setShowClubRegistration(true)}
          >
          Register as Club
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-2">
          <Button
          variant="secondary"
          size="sm"
          className="text-xs border border-blue-600 text-blue-600"
          onClick={() => setShowDistrictRegistration(true)}
          >
          Register District
          </Button>
          <Button
          variant="secondary"
          size="sm"
          className="text-xs border border-blue-600 text-blue-600"
          onClick={() => setShowStateRegistration(true)}
          >
          Register State
          </Button>
        </div>
        </div>
      </Card>
      </div>

      {/* Registration Modals */}
      <PlayerRegistrationModal
      isOpen={showPlayerRegistration}
      onClose={() => setShowPlayerRegistration(false)}
      onSubmit={(data) => handleRegistrationSubmit(data, 'Player')}
      />

      <ClubRegistrationModal
      isOpen={showClubRegistration}
      onClose={() => setShowClubRegistration(false)}
      onSubmit={(data) => handleRegistrationSubmit(data, 'Club')}
      />

      <DistrictRegistrationModal
      isOpen={showDistrictRegistration}
      onClose={() => setShowDistrictRegistration(false)}
      onSubmit={(data) => handleRegistrationSubmit(data, 'District')}
      />

      <StateRegistrationModal
      isOpen={showStateRegistration}
      onClose={() => setShowStateRegistration(false)}
      onSubmit={(data) => handleRegistrationSubmit(data, 'State')}
      />
    </div>
  );
};

export default Login;