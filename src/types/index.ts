

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  approved: boolean;
  createdAt: string;
}

export interface Player extends User {
  Email: any;
  Name: any;
  playerId: string;
  clubId: string;
  clubName: string;
  category: 'beginner' | 'fancy' | 'inline' | 'quad';
  ageGroup: string;
  district: string;
  state: string;
}

export interface Club extends User {
  clubId: string;
  registrationNumber: string;
  district: string;
  state: string;
  establishedYear: number;
  contactPerson: string;
}

export interface District extends User {
  districtId: string;
  districtCode: string;
  state: string;
  population: number;
  area: number;
}

export interface State extends User {
  stateId: string;
  stateCode: string;
  capital: string;
  population: number;
  area: number;
}

export interface Admin extends User {
  adminId: string;
  role: 'super_admin' | 'admin' | 'moderator';
  permissions: string[];
}

export interface Event {
  id: string;
  name: string;
  description: string;
  venue: string;
  startDate: string;
  endDate: string;
  bannerUrl?: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  totalParticipants: number;
  races: Race[];
  ageGroups: AgeGroup[];
  raceMatrix: RaceMatrix[];
  createdAt: string;
}

export interface Race {
  id: string;
  name: string;
  description?: string;
  genderEligibility: 'all' | 'male' | 'female' | 'other';
}

export interface AgeGroup {
  id: string;
  name: string;
  startingDate: number;
  endingDate: number;
}

export interface RaceMatrix {
  id: string;
  raceId: string;
  ageGroupId: string;
  category: PlayerCategory;
  isEnabled: boolean;
  maxRacesPerPlayer: number;
}


export interface racesForAgeGroups{
  id: any;
  ageGroupId: number;
  skateCategory: string;
  raceIds: string;
  minRacesToSelectByPlayerCount: number;
  maxRacesToSelectByPlayerCount: number;
  exactRacesToSelectByPlayerCount: number;
}

export interface PlayerCategory {
  id: string;
  name: 'beginner' | 'fancy' | 'inline' | 'quad';
  description: string;
}

export interface Schedule {
  id: string;
  eventId: string;
  raceId: string;
  raceName: string;
  ageGroupId: string;
  ageGroupName: string;
  category: 'beginner' | 'fancy' | 'inline' | 'quad';
  scheduledTime: string;
  heatNumber: string;
  participants: ScheduledPlayer[];
  resultsEntered: boolean;
}

export interface ScheduledPlayer {
  id: string;
  playerId: string;
  playerName: string;
  gender: 'male' | 'female' | 'other';
  club: string;
  district: string;
  rounds: PlayerRound[];
  totalScore: number;
  rank: number;
  status: 'completed' | 'dnf' | 'dq' | 'pending';
  medal?: 'gold' | 'silver' | 'bronze';
}

export interface PlayerRound {
  round: number;
  score: number | null;
  time?: string;
}

export interface PlayerResult {
  playerId: string;
  playerName: string;
  eventName: string;
  raceName: string;
  ageGroup: string;
  category: string;
  score: number;
  time?: string;
  rank: number;
  medal?: 'gold' | 'silver' | 'bronze';
  status: 'completed' | 'dnf' | 'dq';
}

export interface DashboardStats {
  totalPlayers: number;
  totalClubs: number;
  totalDistricts: number;
  totalStates: number;
  upcomingEvents: Event[];
  upcomingBirthdays: Player[];
}
export interface Participant {
  id: string;
  name: string;
  chestNumber: string;
  eventName: string;
  age: number;
  dob: string;
  category: string;
  status: 'Paid' | 'Unpaid'; // or string if you have more status types
  amount: number;
}

export interface Payment {
  id: number;
  eventName: string;
  skaterName: string;
  refId: string;
  amount: number;
  date: string;
  status: string;
  mode: string;
}

export interface EventOfficialType {
  id: string;
  name: string;
  username: string;
  eventId: string;
  eventName: string;
  status: boolean;
  password?: string; // Optional for create/edit
}
export type EventOrganiserType = {
  id: string;
  name: string;
  eventId: string;
  eventName: string;
  username: string;
  password: string;
  event: string;
  status: boolean;
};



export type Count={
  players:number;
  clubs:number;
  districtSecretries:number;
  stateSecretries:number;
}