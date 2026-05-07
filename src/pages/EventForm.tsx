import React, { useState, useEffect } from 'react';
import { Search, User, Loader2, CheckCircle, AlertCircle, Upload, Camera, FileText, Shield } from 'lucide-react';
import { Player, EligibilityResponse, EventData, RegistrationData, State, District, Club } from '../types-1';
import { PlayerLookup } from '../components/PlayerLookup';
import {   
  fetchEventData, 
  checkEligibility, 
  submitRegistration,
  sendAadharOTP,
  verifyAadharOTP,
  uploadImage,
  fetchStates,
  fetchDistricts,
  fetchClubs,
  createPlayer
} from '../services/api';
import { generateRegistrationPDF } from '../utils/pdfGenerator';

function EventForm() {
  const [currentStep, setCurrentStep] = useState<'lookup' | 'form' | 'success'>('lookup');
  const [player, setPlayer] = useState<Player | null>(null);
  const [eventData, setEventData] = useState<EventData | null>(null);
  const [eligibility, setEligibility] = useState<EligibilityResponse | null>(null);
  const [selectedRaces, setSelectedRaces] = useState<number[]>([]);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registrationId, setRegistrationId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // OTP verification states
  const [showOTPVerification, setShowOTPVerification] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [aadharVerified, setAadharVerified] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);

  // Image upload states
  const [profileImageUrl, setProfileImageUrl] = useState('');
  const [aadharImageUrl, setAadharImageUrl] = useState('');
  const [uploadingProfile, setUploadingProfile] = useState(false);
  const [uploadingAadhar, setUploadingAadhar] = useState(false);

  // Dropdown states
  const [states, setStates] = useState<State[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [loadingClubs, setLoadingClubs] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    mobileNumber: '',
    aadharNumber: '',
    email: '',
    dob: '',
    gender: '',
    address: '',
    clubName: '',
    clubId: '',
    districtName: '',
    districtId: '',
    stateName: '',
    stateId: '',
    skateCategory: '',
    schoolName: '',
    schoolAffiliationNumber: '',
    playerId: ''

  });

  const eventId = 27;

  useEffect(() => {
    fetchEventData(eventId).then(setEventData);
    loadStates();
    loadClubs();
  }, []);

  const loadStates = async () => {
    setLoadingStates(true);
    try {
      const statesData = await fetchStates();
      setStates(statesData);
    } catch (err) {
      setError('Failed to load states');
    } finally {
      setLoadingStates(false);
    }
  };

  const loadDistricts = async (stateId: number) => {
    setLoadingDistricts(true);
    try {
      const districtsData = await fetchDistricts(stateId);
      setDistricts(districtsData);
      // setClubs([]); // Clear clubs when state changes
    } catch (err) {
      setError('Failed to load districts');
    } finally {
      setLoadingDistricts(false);
    }
  };

  const loadClubs = async () => {
    setLoadingClubs(true);
    try {
      const clubsData = await fetchClubs(1);

      setClubs(clubsData);

      console.log('Clubs loaded:', clubsData);
    } catch (err) {
      setError('Failed to load clubs');
    } finally {
      setLoadingClubs(false);
    }
  };

  const handlePlayerFound = (foundPlayer: Player) => {
    setPlayer(foundPlayer);
    console.log('Found player test:', foundPlayer);
    setFormData({
      name: foundPlayer.name,
      mobileNumber: foundPlayer.mobileNumber,
      aadharNumber: foundPlayer.aadharNumber,
      email: foundPlayer.email,
      dob: foundPlayer.dob,
      gender: foundPlayer.gender,
      address: foundPlayer.address,
      clubName: foundPlayer.clubName,
      clubId: foundPlayer.clubId?.toString() || '',
      districtName: foundPlayer.districtName,
      districtId: foundPlayer.districtId?.toString() || '',
      stateName: foundPlayer.stateName,
      stateId: foundPlayer.stateId?.toString() || '',
      skateCategory: foundPlayer.skateCategory,
      schoolName: foundPlayer.schoolName || '',
      schoolAffiliationNumber: foundPlayer.schoolAffiliationNumber || '',
      playerId: foundPlayer.playerId || ''


    });
 
    
    setProfileImageUrl(foundPlayer.profileImageUrl || '');
    setAadharImageUrl(foundPlayer.aadharImageUrl || '');
    setAadharVerified(true); // Assume existing players have verified Aadhar
    setCurrentStep('form');

    // Load related data for existing player
    if (foundPlayer.stateId) {
      loadDistricts(foundPlayer.stateId);
    }
    if (foundPlayer.districtId) {
      // loadClubs(foundPlayer.districtId);
    }
  };

  const handlePlayerNotFound = (searchValue: string, searchType: 'mobile' | 'aadhar') => {
    setPlayer(null);
    setFormData(prev => ({ 
      ...prev, 
      [searchType === 'mobile' ? 'mobileNumber' : 'aadharNumber']: searchValue 
    }));
    setCurrentStep('form');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');

    // Handle state change
    if (name === 'stateId' && value) {
      const selectedState = states.find(state => state.id.toString() === value);
      if (selectedState) {
        setFormData(prev => ({ 
          ...prev, 
          stateName: selectedState.name,
          districtId: '',
          districtName: '',
          // clubId: '',
          // clubName: ''
        }));
        loadDistricts(selectedState.id);
        // setClubs([]);
      }
    }

    // Handle district change
    if (name === 'districtId' && value) {
      const selectedDistrict = districts.find(district => district.id.toString() === value);
      if (selectedDistrict) {
        setFormData(prev => ({ 
          ...prev, 
          districtName: selectedDistrict.name,
          // clubId: '',
          // clubName: ''
        }));
        // loadClubs();
      }
    }

    // Handle club change
    if (name === 'clubId' && value) {
      const selectedClub = clubs.find(club => club.id.toString() === value);
      if (selectedClub) {
        setFormData(prev => ({ ...prev, clubName: selectedClub.name }));
      }
    }

    // Reset Aadhar verification if Aadhar number changes
    if (name === 'aadharNumber' && value !== formData.aadharNumber) {
      setAadharVerified(false);
      setShowOTPVerification(false);
      setOtpSent(false);
      setOtp('');
    }
  };

  const handleSkateChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const category = e.target.value;
    setFormData(prev => ({ ...prev, skateCategory: category }));
    
    if (category && formData.dob) {
      try {
        const eligibilityResult = await checkEligibility(eventId, formData.dob, category);
        setEligibility(eligibilityResult);
        setSelectedRaces([]);
      } catch (err) {
        setError('Failed to check eligibility');
      }
    }
  };

  const handleRaceToggle = (raceId: number) => {
    setSelectedRaces(prev => {
      const isSelected = prev.includes(raceId);
      if (isSelected) {
        return prev.filter(id => id !== raceId);
      } else {
        return [...prev, raceId];
      }
    });
  };

  // Store the OTP reference ID returned from sendAadharOTP
  const [otpReferenceId, setOtpReferenceId] = useState<string | null>(null);

  const handleSendOTP = async () => {
    if (!formData.aadharNumber || formData.aadharNumber.length !== 12) {
      setError('Please enter a valid 12-digit Aadhar number');
      return;
    }

    setOtpLoading(true);
    setError('');

    try {
      const result = await sendAadharOTP(formData.aadharNumber);
      // Accept both reference_id and referenceId for compatibility
      const refId = result.reference_id || result.referenceId;
      if (result.success && refId) {
        setOtpSent(true);
        setShowOTPVerification(true);
        setOtpReferenceId(refId);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Failed to send OTP. Please try again.');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }
    if (!otpReferenceId) {
      setError('OTP reference ID missing. Please resend OTP.');
      return;
    }

    setOtpLoading(true);
    setError('');

    try {
      const result = await verifyAadharOTP(formData.aadharNumber, otp, otpReferenceId);
      if (result.success && result.verified) {
        setAadharVerified(true);
        setShowOTPVerification(false);
        setError('');
        
        // If OTP verification returns player details, update the form
        if (result.player) {
          const playerData = result.player;
          setFormData(prev => ({
            ...prev,
            name: playerData.name || prev.name,
            email: playerData.email || prev.email,
            dob: playerData.dob || prev.dob,
            gender: playerData.gender || prev.gender,
            address: playerData.address || prev.address,
            clubName: playerData.clubName || prev.clubName,
            clubId: playerData.clubId?.toString() || prev.clubId,
            districtName: playerData.districtName || prev.districtName,
            districtId: playerData.districtId?.toString() || prev.districtId,
            stateName: playerData.stateName || prev.stateName,
            stateId: playerData.stateId?.toString() || prev.stateId,
            schoolName: playerData.schoolName || prev.schoolName,
            schoolAffiliationNumber: playerData.schoolAffiliationNumber || prev.schoolAffiliationNumber
          }));
          
          if (playerData.profileImageUrl) {
            setProfileImageUrl(playerData.profileImageUrl);
          }
          if (playerData.aadharImageUrl) {
            setAadharImageUrl(playerData.aadharImageUrl);
          }
          
          // Load related dropdown data
          if (playerData.stateId) {
            loadDistricts(playerData.stateId);
          }
          if (playerData.districtId) {
            // loadClubs(playerData.districtId);

          }
        }
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Failed to verify OTP. Please try again.');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleImageUpload = async (file: File, type: 'profile' | 'aadhar') => {
    if (type === 'profile') {
      setUploadingProfile(true);
    } else {
      setUploadingAadhar(true);
    }

    try {
      const result = await uploadImage(file, type);
      if (result.success && result.url) {
        if (type === 'profile') {
          setProfileImageUrl(result.url);
        } else {
          setAadharImageUrl(result.url);
        }
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError(`Failed to upload ${type} image`);
    } finally {
      if (type === 'profile') {
        setUploadingProfile(false);
      } else {
        setUploadingAadhar(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
       console.log('Found player:', player);
    console.log('Found player:', player?.playerId);

    console.log('Form Data:', formData);
    console.log('Form Data Player ID:', formData.playerId);

    // Check for missing required fields and return which are not filled
    const requiredFields: { key: keyof typeof formData; label: string }[] = [
      { key: 'name', label: 'Full Name' },
      { key: 'email', label: 'Email' },
      { key: 'mobileNumber', label: 'Mobile Number' },
      { key: 'dob', label: 'Date of Birth' },
      { key: 'skateCategory', label: 'Skate Category' }
    ];
    const missingFields = requiredFields.filter(field => !formData[field.key]);
    if (missingFields.length > 0) {
      setError(`Please fill in: ${missingFields.map(f => f.label).join(', ')}`);
      return;
    }

    if (!/^\d{10}$/.test(formData.mobileNumber)) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    if (!profileImageUrl) {
      setError('Please upload a profile image');
      return;
    }

    if (!aadharVerified && formData.aadharNumber) {
      setError('Please verify your Aadhar number');
      return;
    }

    if (!eligibility?.eligible) {
      setError('Please select a valid skate category');
      return;
    }

    if (selectedRaces.length < (eligibility.mustSelectRaces || 1)) {
      setError(`Please select at least ${eligibility.mustSelectRaces || 1} race(s)`);
      return;
    }

    setLoading(true);
    setError('');

    try {
      let playerId = player?.playerId;

      // Create new player if not existing
      if (!player) {
        const playerCreationData = {
          name: formData.name,
          mobileNumber: formData.mobileNumber,
          aadharNumber: formData.aadharNumber,
          email: formData.email,
          dob: formData.dob,
          gender: formData.gender,
          address: formData.address,
          clubId: parseInt(formData.clubId),
          districtId: parseInt(formData.districtId),
          stateId: parseInt(formData.stateId),
          skateCategory: formData.skateCategory,
          schoolName: formData.schoolName,
          schoolAffiliationNumber: formData.schoolAffiliationNumber,
          profileImageUrl,
          aadharImageUrl
        };

        const createResult = await createPlayer(playerCreationData);
        if (!createResult.success || !createResult.playerId) {
          throw new Error('Failed to create player');
        }
        playerId = createResult.playerId;
      }

      if (!playerId) {
        setError('Player ID is missing. Registration cannot proceed.');
        setLoading(false);
        return;
      }

      if (eligibility.ageGroupId === undefined || eligibility.ageGroupId === null) {
        setError('Age group ID is missing. Registration cannot proceed.');
        setLoading(false);
        return;
      }

      console.log('Player Id ', playerId );
      console.log('Player Id 2 ', formData.playerId );

      // ---- Cashfree Payment Integration ----
      // // Create payment order before registration
      // const paymentOrderRes = await fetch('https://sportims-api.justvy.com/cashfree/tnssca/create_order', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify({
      //     name: formData.name,
      //     mobile_number: formData.mobileNumber,
      //     aadhaar_number: formData.aadharNumber,
      //     user_id: formData.playerId, // Using mobile number as user ID
      //     event_id: eventId,
      //     registration_id: 0,
      //     amount: 1000
      //   })
      // });

      // if (!paymentOrderRes.ok) {
      //   const errData = await paymentOrderRes.json();
      //   throw new Error(errData.error || 'Failed to create payment order');
      // }

      // const paymentOrder = await paymentOrderRes.json();
      // if (!paymentOrder.payment_session_id || !paymentOrder.cf_order_id) {
      //   throw new Error('Payment session not created');
      // }

      // // ---- Cashfree Payment Integration using Cashfree JS SDK (Popup) ----
      // // Load Cashfree JS SDK if not already loaded
      // if (!(window as any).Cashfree) {
      //   await new Promise<void>((resolve, reject) => {
      //     const script = document.createElement('script');
      //     script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js';
      //     script.onload = () => resolve();
      //     script.onerror = () => reject(new Error('Failed to load Cashfree SDK'));
      //     document.body.appendChild(script);
      //   });
      // }

      // // Initialize Cashfree SDK
      // const cashfree = (window as any).Cashfree({
      //   mode: 'production',
      // });

      // // Open Cashfree checkout in a popup/modal on the same page
      // await cashfree.checkout({
      //   paymentSessionId: paymentOrder.payment_session_id,
      //   redirectTarget: '_modal', // Use modal for popup
      // }).then(async (result:any) => {
      //                   if(result.error){
      //                       // This will be true whenever user clicks on close icon inside the modal or any error happens during the payment
      //                       console.log("User has closed the popup or there is some payment error, Check for Payment Status");
      //                       console.log(result.error);
      //                   }
      //                   if(result.redirect){
      //                       // This will be true when the payment redirection page couldnt be opened in the same window
      //                       // This is an exceptional case only when the page is opened inside an inAppBrowser
      //                       // In this case the customer will be redirected to return url once payment is completed
      //                       console.log("Payment will be redirected");
      //                   }
      //                   if(result.paymentDetails){

      //                             // Check payment status before registration
      // const paymentStatusRes = await fetch('https://sportims-api.justvy.com/cashfree/tnssca/check_status', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify({
      //     aadhaar_number: formData.aadharNumber,
      //     event_id: eventId
      //   })
      // });

      // const paymentStatus = await paymentStatusRes.json();

      // if (
      //   !paymentStatusRes.ok ||
      //   paymentStatus.status !== 'PAID' ||
      //   (paymentStatus.details && paymentStatus.details.order_status !== 'PAID')
      // ) {
      //   // Show toast for payment not completed
      //   if ((window as any).toast) {
      //     (window as any).toast.error(
      //       paymentStatus.error ||
      //       'Payment not completed. Please complete payment before registration.'
      //     );
      //   }
      //   throw new Error(
      //     paymentStatus.error ||
      //     'Payment not completed. Please complete payment before registration.'
      //   );
      // }

                            

      //                   }
      //               });


      // Update player data if player exists
      if (formData.playerId) {
        const playerUpdateData = {
          aadharImageUrl,
          // aadharNumber: formData.aadharNumber,
          approvalStatus: 'approved',
          // clubId: parseInt(formData.clubId),
          districtId: parseInt(formData.districtId),
          // districtName: formData.districtName,
          // dob: formData.dob,
          email: formData.email,
          // name: formData.name,
          // profileImageUrl,
          schoolAffiliationNumber: formData.schoolAffiliationNumber,
          schoolName: formData.schoolName,
          stateId: parseInt(formData.stateId),
          // stateName: formData.stateName,
          address: formData.address,
          gender: formData.gender,
          mobileNumber: formData.mobileNumber,
          // playerId: player.playerId,
          // skateCategory: formData.skateCategory,
        };
        // Call your API to update player
        try {
          const response = await fetch(`https://sportims-api.justvy.com/players/${formData.playerId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(playerUpdateData),
          });
          if (!response.ok) {
            const errorData = await response.json();
            setError(errorData.message || 'Failed to update player information.');
            setLoading(false);
            return;
          }
        } catch (err: any) {
          setError(err.message || 'Failed to update player information.');
          setLoading(false);
          return;
        }
      }
      const registrationData: RegistrationData = {
        skateCategory: formData.skateCategory,
        eventId,
        ageGroup: eligibility.ageGroup || '',
        ageGroupId: eligibility.ageGroupId,
        selectedRacesIds: selectedRaces,
        amountPaid: eventData?.event.eventFee || 0,
        dob: formData.dob,
        name: formData.name,
        playerId: playerId,
        mobileNumber: formData.mobileNumber,
        aadharNumber: formData.aadharNumber,
        email: formData.email,
        gender: formData.gender,
        address: formData.address,
        clubName: formData.clubName,
        clubId: formData.clubId ? parseInt(formData.clubId) : undefined,
        districtId: parseInt(formData.districtId),
        stateId: parseInt(formData.stateId),
        profileImageUrl: profileImageUrl,
        aadharImageUrl,
        schoolName: formData.schoolName,
        schoolAffiliationNumber: formData.schoolAffiliationNumber
      };

      const result = await submitRegistration(registrationData);
      
      if (result.success && result.registrationId) {
        setRegistrationId(result.registrationId);
        setRegistrationSuccess(true);
        setCurrentStep('success');
        
        // Generate PDF automatically
        const selectedRaceNames = eligibility.races
          ?.filter((race:any) => selectedRaces.includes(race.id))
          .map((race:any) => race.name) || [];

        await generateRegistrationPDF({
          registrationId: result.registrationId,
          playerName: formData.name,
          playerId: playerId || formData.playerId,
          eventName: eventData?.event.name || '',
          eventDate: eventData?.event.eventDate || '',
          venue: eventData?.event.venue || '',
          skateCategory: formData.skateCategory,
          ageGroup: eligibility.ageGroup || '',
          selectedRaces: selectedRaceNames,
          amountPaid: eventData?.event.eventFee || 0,
          registrationDate: new Date().toISOString(),
          profileImageUrl,
          email: formData.email,
          mobileNumber: formData.mobileNumber,
          address: formData.address,
          clubName: formData.clubName,
          aadharNumber: formData.aadharNumber || '',
          districtName: formData.districtName || '',
          stateName: formData.stateName || '',
          dob: formData.dob || '',
          gender: formData.gender || '',
          chestNumber: '',
          instructions: '',
          declaration: ''
        });
      } else {
        throw new Error('Registration failed');
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (currentStep === 'lookup') {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">
              {eventData?.event.name || 'Sport Event Registration'}
            </h1>
            <p className="text-gray-600 text-center mb-8">
              {eventData?.event.venue} • {eventData?.event.eventDate}
            </p>
            
            <PlayerLookup
              eventId={eventId}
              onPlayerFound={handlePlayerFound}
              onPlayerNotFound={handlePlayerNotFound}
            />
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Registration Successful!</h2>
        <p className="text-gray-600 mb-4">Your registration ID is:</p>
        <p className="text-xl font-mono font-bold text-green-600 mb-6">{registrationId}</p>
        <p className="text-sm text-gray-600 mb-6">
        Your registration certificate has been automatically downloaded as a PDF.
        </p>
        <button
        onClick={() => {
          if (!eventData || !eligibility) return;
          const selectedRaceNames = eligibility.races
          ?.filter((race:any) => selectedRaces.includes(race.id))
          .map((race:any) => race.name) || [];
          generateRegistrationPDF({
            registrationId,
            playerName: formData.name,
            playerId: formData.playerId,
            eventName: eventData?.event.name || '',
            eventDate: eventData?.event.eventDate || '',
            venue: eventData?.event.venue || '',
            skateCategory: formData.skateCategory,
            ageGroup: eligibility.ageGroup || '',
            selectedRaces: selectedRaceNames,
            amountPaid: eventData?.event.eventFee || 0,
            registrationDate: new Date().toISOString(),
            profileImageUrl,
            email: formData.email,
            mobileNumber: formData.mobileNumber,
            address: formData.address,
            clubName: formData.clubName,
            aadharNumber: formData.aadharNumber || '',
            districtName: formData.districtName || '',
            stateName: formData.stateName || '',
            dob: formData.dob || '',
            chestNumber: '',
            gender: '',
            instructions: '',
            declaration: ''
          });
        }}
        className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 mb-4"
        >
        Download PDF Again
        </button>
        <button
        onClick={() => window.location.reload()}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
        >
        New Registration
        </button>
      </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex items-center mb-6">
            <button
              onClick={() => setCurrentStep('lookup')}
              className="mr-4 p-2 text-gray-600 hover:text-gray-900"
            >
              ← Back
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {eventData?.event.name || 'Sport Event Registration'}
              </h1>
              <p className="text-gray-600">
                {eventData?.event.venue} • {eventData?.event.eventDate}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Player Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Player Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={() => {}}
                  required
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    // required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number *</label>
                  <input
                    type="tel"
                    name="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Aadhar Number
                    {aadharVerified && <CheckCircle className="inline w-4 h-4 text-green-500 ml-1" />}
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      name="aadharNumber"
                      value={formData.aadharNumber}
                      onChange={handleInputChange}
                      maxLength={12}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {formData.aadharNumber && !aadharVerified && (
                      <button
                        type="button"
                        onClick={handleSendOTP}
                        disabled={otpLoading}
                        className="bg-green-600 text-white px-3 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 flex items-center"
                      >
                        {otpLoading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <Shield className="w-4 h-4 mr-1" />
                            Verify
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {/* OTP Verification Modal */}
                {showOTPVerification && (
                  <div className="col-span-2 bg-blue-50 border border-blue-200 rounded-md p-4">
                    <h4 className="font-semibold text-blue-900 mb-3">Verify Aadhar Number</h4>
                    <p className="text-sm text-blue-700 mb-4">
                      {otpSent ? 'Enter the 6-digit OTP sent to your registered mobile number' : 'Click Send OTP to verify your Aadhar number'}
                    </p>
                    {otpSent && (
                      <div className="flex space-x-2 mb-4">
                        <input
                          type="text"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          placeholder="Enter 6-digit OTP"
                          maxLength={6}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <button
                          type="button"
                          onClick={handleVerifyOTP}
                          disabled={otpLoading}
                          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
                        >
                          {otpLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Verify'}
                        </button>
                      </div>
                    )}
                    <p className="text-xs text-blue-600">Check the mobile number registered with your Aadhar for the OTP.</p>
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth *</label>
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleInputChange}
                    required
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender *</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                  <select
                    name="stateId"
                    value={formData.stateId}
                    onChange={handleInputChange}
                    required
                    disabled={loadingStates}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select State</option>
                    {states.map(state => (
                      <option key={state.id} value={state.id}>{state.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">District *</label>
                  <select
                    name="districtId"
                    value={formData.districtId}
                    onChange={handleInputChange}
                    required
                    disabled={!formData.stateId || loadingDistricts}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select District</option>
                    {districts.map(district => (
                      <option key={district.id} value={district.id}>{district.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Club *</label>
                  <select
                    name="clubId"
                    value={formData.clubId}
                    onChange={handleInputChange}
                    required
                    disabled={!formData.districtId || loadingClubs}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Club </option>
                    {clubs.map(club => (
                      <option key={club.id} value={club.id}>{club.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">School Name</label>
                  <input
                    type="text"
                    name="schoolName"
                    value={formData.schoolName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">School Affiliation Number</label>
                  <input
                    type="text"
                    name="schoolAffiliationNumber"
                    value={formData.schoolAffiliationNumber}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Skate Category *</label>
                  <select
                    name="skateCategory"
                    value={formData.skateCategory}
                    onChange={handleSkateChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Category</option>
                    <option value="beginner">Beginner</option>
                    <option value="fancy">Fancy</option>
                    <option value="inline">Inline</option>
                    <option value="quad">Quad</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Profile Image Upload */}
            <div className="border-b pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Image</h3>
              <div className="flex items-center space-x-4">
                {profileImageUrl ? (
                  <img
                    src={profileImageUrl}
                    alt="Profile"
                    className="w-20 h-20 rounded-full object-cover border-2 border-gray-300"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
                    <User className="w-8 h-8 text-gray-400" />
                  </div>
                )}
                <div>
                  <label className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center">
                    {uploadingProfile ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Camera className="w-4 h-4 mr-2" />
                        {profileImageUrl ? 'Change Photo' : 'Upload Photo'}
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(file, 'profile');
                      }}
                      disabled={uploadingProfile}
                    />
                  </label>
                  <p className="text-xs text-gray-500 mt-1">JPG, PNG up to 5MB</p>
                </div>
              </div>
            </div>

            {/* Aadhar Document Upload */}
      {/*       <div className="border-b pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Aadhar Document</h3>
              <div className="flex items-center space-x-4">
                {aadharImageUrl ? (
                  <img
                    src={aadharImageUrl}
                    alt="Aadhar Document"
                    className="w-32 h-20 object-cover border-2 border-gray-300 rounded"
                  />
                ) : (
                  <div className="w-32 h-20 bg-gray-200 flex items-center justify-center rounded">
                    <FileText className="w-8 h-8 text-gray-400" />
                  </div>
                )}
                <div>
                  <label className="cursor-pointer bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 flex items-center">
                    {uploadingAadhar ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        {aadharImageUrl ? 'Change Document' : 'Upload Document'}
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(file, 'aadhar');
                      }}
                      disabled={uploadingAadhar}
                    />
                  </label>
                  <p className="text-xs text-gray-500 mt-1">JPG, PNG, PDF up to 5MB</p>
                </div>
              </div>
            </div>
            */}

            {/* Eligibility Status */}
            {eligibility && (
              <div className={`p-4 rounded-md ${eligibility.eligible ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                {eligibility.eligible ? (
                  <div>
                    <div className="flex items-center mb-2">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                      <span className="font-medium text-green-800">Eligible for Registration</span>
                    </div>
                    <p className="text-sm text-green-700">Age: {eligibility.age} years | Category: {eligibility.ageGroup}</p>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                    <span className="text-red-800">{eligibility.reason}</span>
                  </div>
                )}
              </div>
            )}

            {/* Race Selection */}
            {eligibility?.eligible && eligibility.races && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Select Races (Minimum: {eligibility.mustSelectRaces || 1})
                </h3>
                <div className="space-y-2">
                  {eligibility.races.map((race:any) => (
                    <label key={race.id} className="flex items-center p-3 border border-gray-200 rounded-md hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={selectedRaces.includes(race.id)}
                        onChange={() => handleRaceToggle(race.id)}
                        className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="text-gray-900">{race.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                  <span className="text-red-800">{error}</span>
                </div>
              </div>
            )}

            {/* Registration Fee */}
            {/* {eventData && (
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-blue-900">Registration Fee:</span>
                  <span className="text-xl font-bold text-blue-600">₹{eventData.event.eventFee}</span>
                </div>
              </div>
            )} */}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !eligibility?.eligible}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Processing Registration...
                </>
              ) : (
                // `Register & Pay ₹${eventData?.event.eventFee || 0}`
                `Register For Event`
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EventForm;