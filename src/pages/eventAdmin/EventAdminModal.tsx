import React, { useState, useEffect } from 'react';
import Modal from '../../components/UI/Modal';
import FormField from '../../components/UI/FormField';
import Button from '../../components/UI/Button';
import { CheckCircle } from 'lucide-react';
import axios from 'axios';
import { usePlayer } from '../../context/PlayerContext';
import { toast } from 'react-toastify';
import { fetchClubs } from '../../services/api';

// Utility function to calculate age based on DOB and a reference date
function calculateAge(dob?: string, referenceDate?: string): number {
  if (!dob) return 0;
  const birthDate = new Date(dob);
  const refDate = referenceDate ? new Date(referenceDate) : new Date();
  let age = refDate.getFullYear() - birthDate.getFullYear();
  const m = refDate.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && refDate.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

interface RegistrationModalProps {
  selectedEvent: any;
  isOpen: boolean;
  onClose: () => void;
}

const RegistrationModal: React.FC<RegistrationModalProps> = ({ selectedEvent, isOpen, onClose }) => {
  const { player } = usePlayer();
  const baseURL = 'https://sportims-api.justvy.com';

  console.log('Selected Event:', selectedEvent);

  interface RegistrationData {
    selectedRaces: any[]; // You can replace 'any' with a specific race type if available
    ageGroup: string;
    ageGroupId: string;
    skateCategory: string;
    mustSelectRaces: number;
    profileImageUrl: string;
    clubId: string;
    districtId: string;
    stateId: string;


  }

  const [registrationData, setRegistrationData] = useState<RegistrationData>({
    selectedRaces: [],
    ageGroup: '',
    ageGroupId: '',
    skateCategory: '',
    mustSelectRaces: 0,
    profileImageUrl: '',
    clubId: '',
    districtId: '',
    stateId: '',
  });
  const [selectedRaceIds, setSelectedRaceIds] = useState<string[]>([]);
  const [allAvailableRaces, setAllAvailableRaces] = useState<any[]>([]);

  const fetchEligibility = async () => {
    // Add a log before the API call to ensure the function is being called
    // if (!selectedEvent || !registrationData.category || !selectedEvent.player?.dob) return;
    try {
      const url = `${baseURL}/events/${selectedEvent?.event?.id}/check-eligibility-by-dob?dob=${selectedEvent?.player?.dob}&skateCategory=${registrationData.skateCategory}`;
      console.log('Calling API:', url);
      const res = await axios.get(url);
      setRegistrationData(prev => ({
        ...prev,
        ageGroupId: res.data.ageGroupId,
        ageGroup: res.data.ageGroup,

        mustSelectRaces: res.data.mustSelectRaces
      }));
      setAllAvailableRaces(res.data.races);
      setSelectedRaceIds([]);

      console.log('fetchEligibility called', { selectedEvent, category: registrationData.skateCategory, dob: player?.dob });

    } catch (error) {
      console.error('fetchEligibility error:', error);
    }
  };

  useEffect(() => {
    console.log(selectedEvent)
    fetchEligibility();
  }, [registrationData.skateCategory, selectedEvent]);

  useEffect(() => {
    const selectedRaceObjs = (allAvailableRaces ?? []).filter(race => selectedRaceIds.includes(race.id));
    setRegistrationData(prev => ({
      ...prev,
      selectedRaces: selectedRaceObjs
    }));
  }, [selectedRaceIds, allAvailableRaces]);

  const handleRaceSelection = (raceId: string) => {
    setSelectedRaceIds(prev => {
      if (prev.includes(raceId)) return prev.filter(id => id !== raceId);
      if (prev.length < registrationData.mustSelectRaces) return [...prev, raceId];
      return prev;
    });
  };

  const handleSubmitRegistration = async () => {
    // Only include fields in payload if they have changed from selectedEvent
    const payload: any = {};
    if (registrationData.skateCategory !== selectedEvent?.skateCategory) {
      payload.skateCategory = registrationData.skateCategory;
    }
    if (
      selectedRaceIds.sort().join(',') !==
      (selectedEvent?.selectedRaces?.map((r: any) => r.id).sort().join(',') || '')
    ) {
      payload.selectedRacesIds = selectedRaceIds;
    }
    if (
      registrationData.profileImageUrl &&
      registrationData.profileImageUrl !== selectedEvent?.profileImageUrl
    ) {
      payload.profileImageUrl = registrationData.profileImageUrl;
    }
    if (selectedClubId && selectedClubId !== selectedEvent?.clubId) {
      payload.clubId = selectedClubId;
      payload.clubName =
        clubs.find((c) => String(c.id) === String(selectedClubId))?.clubName || '';
    }
    if (selectedDistrictId && selectedDistrictId !== selectedEvent?.districtId) {
      payload.districtId = selectedDistrictId;
    }
    if (selectedStateId && selectedStateId !== selectedEvent?.stateId) {
      payload.stateId = selectedStateId;
    }
    try {
      await axios.put(`${baseURL}/registrations/${selectedEvent?.id}`, payload);
      // Use react-toastify for success
      toast.success('Registration submitted successfully!');
      onClose();
    } catch (error) {
      // Use react-toastify for error
      toast.error('Failed to submit registration. Please try again.');
    }
  };

  // State for dropdown options
  const [clubs, setClubs] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [states, setStates] = useState<any[]>([]);

  // State for selected values
  const [selectedClubId, setSelectedClubId] = useState<string>(selectedEvent?.clubId || '');
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>(selectedEvent?.districtId || '');
  const [selectedStateId, setSelectedStateId] = useState<string>(selectedEvent?.stateId || '');

  // Fetch states
  useEffect(() => {
    const fetchStates = async () => {
      try {
        const res = await axios.get(`https://sportims-api.justvy.com/states/`);
        setStates(res.data || []);
      } catch (error) {
        console.error('Failed to fetch states', error);
      }
    };
    fetchStates();
    fetchClubs();
  }, [baseURL]);

  // Fetch districts when state changes
  useEffect(() => {
    // if (!selectedStateId) {
    //   setDistricts([]);
    //   return;
    // }
    const fetchDistricts = async () => {
      try {
        const res = await axios.get(`${baseURL}/districts/?stateId=${selectedStateId}`);
        setDistricts(res.data || []);
      } catch (error) {
        console.error('Failed to fetch districts', error);
      }
    };
    fetchDistricts();
  }, [selectedStateId, baseURL]);

  // Fetch clubs when district changes
  useEffect(() => {
    // if (!selectedDistrictId) {
    //   setClubs([]);
    //   return;
    // }
    const fetchClubs = async () => {
      try {
        const res = await axios.get(`${baseURL}/clubs/`);
        setClubs(res.data || []);
      } catch (error) {
        console.error('Failed to fetch clubs', error);
      }
    };
    fetchClubs();
  }, [selectedDistrictId, baseURL]);

  // Update registrationData with selected club/district/state
  useEffect(() => {
    setRegistrationData(prev => ({
      ...prev,
      clubId: selectedClubId,
      districtId: selectedDistrictId,
      stateId: selectedStateId,
    }));
  }, [selectedClubId, selectedDistrictId, selectedStateId]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`${selectedEvent?.event?.name}`} size="xl">
      <div className="space-y-6">
        {/* Event Summary */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium text-gray-900 mb-2">Event Details</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Player Name:</span> {selectedEvent?.player?.name}
            </div>
            <div>
              <span className="font-medium">Venue:</span> {selectedEvent?.event?.venue}
            </div>
            <div>
              <span className="font-medium">Event:</span> {selectedEvent?.event?.name}
            </div>
            <div>
              <span className="font-medium">Dates:</span> {selectedEvent && selectedEvent?.event && new Date(selectedEvent?.event?.eventDate).toLocaleDateString()}
            </div>
            <div>
              <span className="font-medium">Date Of Birth:</span> {selectedEvent?.player?.dob ? new Date(selectedEvent.player?.dob).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, ' ') : ''}
            </div>
            <div>
              <span className="font-medium">Your Age group:</span> {selectedEvent?.ageGroup}
            </div>
          </div>
        </div>

        {/* State Dropdown */}
        <FormField label="State" required>
          <select
            value={selectedStateId || selectedEvent?.stateId || ''}
            onChange={e => {
              setSelectedStateId(e.target.value);
              setSelectedDistrictId('');
              setSelectedClubId('');
            }}
          >
            <option value="">Select State</option>
            {states.map((state: any) => (
              <option key={state.id} value={state.id}>{state.name}</option>
            ))}
          </select>
        </FormField>

        {/* District Dropdown */}
        <FormField label="District" required>
          <select
            value={selectedDistrictId || selectedEvent?.districtId || ''}
            onChange={e => {
              setSelectedDistrictId(e.target.value);
              setSelectedClubId('');
            }}
            disabled={!selectedStateId}
          >
            <option value="">Select District</option>
            {districts.map((district: any) => (
              <option key={district.id} value={district.id}>{district.name}</option>
            ))}
          </select>
        </FormField>

        {/* Club Dropdown */}
        <FormField label="Club" required>
          <select
            value={selectedClubId ? Number(selectedClubId) : selectedEvent?.clubId ? Number(selectedEvent.clubId) : ''}
            onChange={e => setSelectedClubId(e.target.value ? String(Number(e.target.value)) : '')}
          // disabled={!selectedDistrictId}
          >
            <option value="">Select Club</option>
            {clubs.map((club: any) => (
              <option key={club.id} value={club.id}>{club.clubName}</option>
            ))}
          </select>
        </FormField>

        <FormField label="Profile Photo" required>
          {(registrationData.profileImageUrl || selectedEvent?.profileImageUrl) && (
            <div className="mb-2">
              <img
                src={registrationData.profileImageUrl || selectedEvent?.profileImageUrl}
                alt="Profile"
                className="h-20 w-20 object-cover rounded-full border"
              />
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const formData = new FormData();
              formData.append('file', file);
              try {
                const res = await axios.post(
                  `https://sportims-api.justvy.com/upload/image/`,
                  formData,
                  { headers: { 'Content-Type': 'multipart/form-data' } }
                );
                setRegistrationData(prev => ({ ...prev, profileImageUrl: res.data.url }));
                selectedEvent.profileImageUrl = res.data.url;
              } catch {
                alert('Failed to upload image');
              }
            }}
          />
        </FormField>

        <FormField label="Category" required>
          <select
            value={registrationData.skateCategory !== '' ? registrationData.skateCategory : selectedEvent?.skateCategory}
            onChange={e => {
              setRegistrationData({ ...registrationData, skateCategory: e.target.value });
              fetchEligibility();
            }}
          >
            <option value="beginner">Beginner</option>
            <option value="fancy">Fancy</option>
            <option value="inline">Inline</option>
            <option value="quad">Quad</option>
          </select>
        </FormField>

        <div>
          <label>Select Races (Must {registrationData.mustSelectRaces})</label>
          <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-3">
            {(allAvailableRaces.length > 0 ? allAvailableRaces : (selectedEvent?.selectedRaces ?? [])).map((race: any) => (
              <label key={race.id} className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={allAvailableRaces.length > 0 ? selectedRaceIds.includes(race.id) : true}
                  onChange={() => handleRaceSelection(race.id)}
                  disabled={!selectedRaceIds.includes(race.id) && selectedRaceIds.length >= registrationData.mustSelectRaces}
                />
                <div className="flex-1">
                  <div className="font-medium">{race.name}</div>
                  {race.description && <div className="text-sm text-gray-500">{race.description}</div>}
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button
            variant="secondary"
            onClick={() => {
              setRegistrationData({
                selectedRaces: [],
                ageGroup: '',
                ageGroupId: '',
                skateCategory: '',
                mustSelectRaces: 0,
                profileImageUrl: '',
                clubId: '',
                districtId: '',
                stateId: '',
              });
              setSelectedRaceIds([]);
              setAllAvailableRaces([]);
              setSelectedStateId('');
              setSelectedDistrictId('');
              setSelectedClubId('');
              onClose();
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmitRegistration}
            disabled={
              // !registrationData.ageGroup ||
              registrationData.mustSelectRaces === 0 ? false : (registrationData.selectedRaces.length !== registrationData.mustSelectRaces)
              // !registrationData.profileImageUrl ||
              // !selectedStateId ||
              // !selectedDistrictId ||
              // !selectedClubId
            }
          >
            <CheckCircle size={16} className="mr-2" />
            Submit Registration
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default RegistrationModal;
