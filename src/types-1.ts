export interface Player {
  playerId: string;
  name: string;
  mobileNumber: string;
  aadharNumber: string;
  email: string;
  dob: string;
  gender: string;
  address: string;
  clubName: string;
  clubId: number | string;
  districtName: string;
  districtId: number;
  stateName: string;
  stateId: number;
  skateCategory: string;
  profileImageUrl?: string;
  aadharImageUrl?: string;
  approvalStatus: string;
  schoolName?: string;
  schoolAffiliationNumber?: string;
  createdAt?: string;
  updatedAt?: string;
  deleteStatus?: boolean;
}

export interface Race {
  id: number;
  name: string;
}

export interface EligibilityResponse {
  ageGroupId: any;
  eligible: boolean;
  age?: number;
  ageGroup?: string;
  skateCategory?: string;
  raceMappingId?: number;
  mustSelectRaces?: number;
  races?: Race[];
  reason?: string;
}

export interface EventData {
  event: {
    id: number;
    name: string;
    eventDate: string;
    venue: string;
    eventFee: number;
    regStartingDate: string;
    regEndingDate: string;
    ageAsOnDate: string;
    instruction: string;
    declaration: string;
  };
  races: Race[];
  ageGroups: Array<{
    id: number;
    ageGroupName: string;
    eventId: number;
  }>;
  racesForAgeGroups: Array<{
    id: number;
    ageGroupId: number;
    skateCategory: string;
    raceIds: string;
    minRacesToSelectByPlayerCount: number;
    maxRacesToSelectByPlayerCount: number;
    exactRacesToSelectByPlayerCount: number;
  }>;
}

export interface RegistrationData {
  playerId: string;
  skateCategory: string;
  eventId: number;
  ageGroup: string;
  ageGroupId: string | number;  // REQUIRED: must be string or number (not undefined)
  selectedRacesIds: number[];
  paymentId?: string;
  amountPaid: number;
  dob: string;
  name?: string;
  mobileNumber?: string;
  aadharNumber?: string;
  email?: string;
  gender?: string;
  address?: string;
  clubName?: string;
  clubId?: number | string;
  districtId?: number;
  stateId?: number;
  profileImageUrl?: string;
  aadharImageUrl?: string;
  schoolName?: string;
  schoolAffiliationNumber?: string;
}

export interface OTPVerificationResponse {
  success: boolean;
  message: string;
  verified?: boolean;
  playerData?: Player;
  player?:Player;
}

export interface ExistingRegistration {
  registrationId: string;
  playerName: string;
  eventName: string;
  registrationDate: string;
  skateCategory: string;
  selectedRaces: string[];
  ageGroup: string;
  amountPaid: number;
  status: string;
  profileImageUrl?: string;
  event:any;
  player:any;
  registration:any;
}

export interface Club {
  id: number;
  name: string;
  districtId?: number;
  stateId?: number;
}

export interface District {
  id: number;
  name: string;
  stateId: number;
}

export interface State {
  id: number;
  name: string;
}