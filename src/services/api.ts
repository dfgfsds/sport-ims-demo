import { Player, EligibilityResponse, EventData, OTPVerificationResponse, ExistingRegistration, Club, District, State } from '../types-1';

// Mock API functions - replace with actual API calls
export const fetchPlayerByNumber = async (
  number: string,
  type: 'mobile' | 'aadhar'
): Promise<Player | null> => {
  try {
    let url = '';
    if (type === 'mobile') {
      url = `https://sportims-api.justvy.com/players/by-mobile/${number}`;
    } else {
      url = `https://sportims-api.justvy.com/players/by-aadhar/${number}`;
    }
    const response = await fetch(url);

    console.log(`Fetching player by ${type}: ${number}`);
    console.log(`Request URL: ${url}`);
    console.log(`Response status: ${response}`);
    if (!response.ok) {
      return null;
    }
    const data = await response.json();
    return data as Player;
  } catch (error) {
    return null;
  }
};

export const checkExistingRegistration = async (
  aadharNumber: string
): Promise<any> => {
  const response = await fetch(`https://sportims-api.justvy.com/registrations/check-registration?eventId=27&aadharNumber=${aadharNumber}`);
  if (!response.ok) {
    return null;
  }
  const data = await response.json();
  console.log("Existing registration data:", data.registration);
  return data.registration;
};

export const fetchEventData = async (eventId: number): Promise<EventData> => {
  const response = await fetch(`https://sportims-api.justvy.com/events/${eventId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch event data');
  }
  const data = await response.json();
  return data as EventData;
};


export const checkEligibility = async (
  eventId: number,
  dob: string,
  skateCategory: string
): Promise<EligibilityResponse> => {
  try {
    const params = new URLSearchParams({
      dob,
      skateCategory
    });
    const response = await fetch(`https://sportims-api.justvy.com/events/${eventId}/check-eligibility-by-dob?${params.toString()}`);
    if (!response.ok) {
      return {
        ageGroupId: null,
        eligible: false,
        reason: 'Failed to check eligibility'
      };
    }
    const data = await response.json();
    return data as EligibilityResponse;
  } catch (error) {
    return {
      ageGroupId: null,
      eligible: false,
      reason: 'Failed to check eligibility'
    };
  }
};


export const submitRegistration = async (
  data: {
    playerId: string;
    chestNumber?: string;
    skateCategory: string;
    eventId: number;
    ageGroupId: string | number;  // REQUIRED: must be string or number (not undefined)
    selectedRacesIds?: number[];
    paymentId?: string;
    amountPaid?: number;
    profileImageUrl?: string;
    regDate?: string; // ISO string, set on backend
    clubName?: string;
    clubId?: any;
    districtId?: number;
    stateId?: number;
    remarks?: string;
    dob: string; // "YYYY-MM-DD"
  }
): Promise<{ success: boolean; registrationId?: string; message?: string }> => {
  if (data.ageGroupId === undefined || data.ageGroupId === null) {

    console.error("Missing required field: ageGroupId");
    console.log("Data submitted: %o", data);
    return {
      success: false,
      message: 'Missing required field: ageGroupId',
    };
  }

  try {
    console.log("Submitting registration with data: %o", data);
    const response = await fetch('https://sportims-api.justvy.com/registrations/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const resData = await response.json();

    if (response.ok && resData.id) {
      return {
        success: true,
        registrationId: resData.id.toString(),
        message: resData.message || 'Registration created successfully',
      };
    } else {
      return {
        success: false,
        message: resData.message || 'Failed to create registration',
      };
    }
  } catch (error) {
    return {
      success: false,
      message: 'Error occurred while submitting registration',
    };
  }
};


export const sendAadharOTP = async (
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

    if (response.ok && data.status === 'otp_sent') {
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

export const verifyAadharOTP = async (
  aadharNumber: string,
  otp: string,
  referenceId: string
): Promise<OTPVerificationResponse> => {
  try {
    const response = await fetch('https://sportims-api.justvy.com/players/verify-aadhar-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        reference_id: referenceId,
        aadhaar_number: aadharNumber,
        otp,
      }),
    });

    const data = await response.json();

    if (response.ok && data.player) {
      return {
        success: true,
        verified: true,
        message: data.message || 'Aadhar number verified successfully',
        player: data.player,
      };
    } else {
      return {
        success: false,
        verified: false,
        message: data.error || 'Invalid OTP. Please try again.',
      };
    }
  } catch (error) {
    return {
      success: false,
      verified: false,
      message: 'Error occurred while verifying OTP',
    };
  }
};

export const verifyAadharOTPLogin = async (
  aadharNumber: string,
  otp: string,
  referenceId: string
): Promise<OTPVerificationResponse> => {
  try {
    const response = await fetch('https://sportims-api.justvy.com/players/verify-aadhar-otp-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        reference_id: referenceId,
        aadhaar_number: aadharNumber,
        otp,
      }),
    });

    const data = await response.json();

    if (response.ok && data.player) {
      return {
        success: true,
        verified: true,
        message: data.message || 'Aadhar number verified successfully',
        player: data.player,
      };
    } else {
      return {
        success: false,
        verified: false,
        message: data.error || 'Invalid OTP. Please try again.',
      };
    }
  } catch (error) {
    return {
      success: false,
      verified: false,
      message: 'Error occurred while verifying OTP',
    };
  }
};

export const uploadImage = async (
  file: File,
  type: 'profile' | 'aadhar'
): Promise<{ success: boolean; url?: string; message: string }> => {
  const formData = new FormData();
  formData.append('file', file);

  let endpoint = '';
  if (type === 'profile') {
    endpoint = 'https://sportims-api.justvy.com/upload/image/';
  } else {
    endpoint = 'https://sportims-api.justvy.com/upload/document/';
  }

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      return {
        success: false,
        message: 'Failed to upload image',
      };
    }

    const data = await response.json();
    return {
      success: true,
      url: data.url,
      message: `${type === 'profile' ? 'Profile image' : 'Aadhar document'} uploaded successfully`,
    };
  } catch (error) {
    return {
      success: false,
      message: 'Error occurred while uploading image',
    };
  }
};


export const fetchStates = async (): Promise<State[]> => {
  const response = await fetch('https://sportims-api.justvy.com/states/');
  if (!response.ok) {
    throw new Error('Failed to fetch states');
  }
  const data = await response.json();
  // Map API response to State[]
  return data.map((item: any) => ({
    id: item.id,
    name: item.name
  }));
};

export const fetchDistricts = async (stateId: number): Promise<District[]> => {
  const response = await fetch('https://sportims-api.justvy.com/districts/');
  if (!response.ok) {
    throw new Error('Failed to fetch districts');
  }
  const data = await response.json();
  // Filter districts by stateId and map to District[]
  return data
    .filter((item: any) => item.stateId === stateId)
    .map((item: any) => ({
      id: item.id,
      name: item.name,
      stateId: item.stateId
    }));
};

export const fetchClubs = async (districtId?: number): Promise<Club[]> => {
  const response = await fetch('https://sportims-api.justvy.com/clubs/id-name-list');
  if (!response.ok) {
    throw new Error('Failed to fetch clubs');
  }
  const data = await response.json();
  // Map API response to Club[]
  let clubs: Club[] = data.map((item: any) => ({
    id: item.id,
    name: item.clubName,
    districtId: item.districtId??0,
    stateId: item.stateId??0
  }));
  // if (districtId) {
  //   clubs = clubs.filter(club => club.districtId === districtId);
  // }
  return clubs;
};

export const createPlayer = async (
  playerData: Partial<Player>
): Promise<{ success: boolean; playerId?: string; message: string }> => {
  try {
    const response = await fetch('https://sportims-api.justvy.com/players/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(playerData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        message: errorData.message || 'Failed to register player'
      };
    }

    const data = await response.json();
    return {
      success: true,
      playerId: data.playerId,
      message: data.message || 'Player created successfully'
    };
  } catch (error) {
    return {
      success: false,
      message: 'Error occurred while registering player'
    };
  }
};