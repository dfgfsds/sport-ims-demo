import React, { useEffect, useState } from 'react';
import { Calendar, MapPin, CheckCircle } from 'lucide-react';
import Card from '../../components/UI/Card';
import Badge from '../../components/UI/Badge';
import Button from '../../components/UI/Button';
import Modal from '../../components/UI/Modal';
import FormField from '../../components/UI/FormField';
import { mockEvents, mockAgeGroups } from '../../data/mockData';
import { Event } from '../../types';
import axios from 'axios';
import { usePlayer } from '../../context/PlayerContext';
import { generateRegistrationPDF } from '../../utils/pdfGenerator';


const UpcomingEvents: React.FC = () => {
  const [events, setEvents] = React.useState(mockEvents.filter(e => e.status === 'upcoming'));
  const [showRegistrationModal, setShowRegistrationModal] = React.useState(false);
  const [selectedEvent, setSelectedEvent] = React.useState<any>(null);
  const [registrationData, setRegistrationData] = React.useState<any>({
    selectedRaces: [],
    ageGroup: '',
    ageGroupId: '',
    category: 'Beginner',
    mustSelectRaces: 0
  });

  const { player } = usePlayer();

  // console.log(player);
  

  const baseURL = import.meta.env.VITE_API_BASE_URL;

  const [upcomingEvents, setUpcomingEvents] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [allAvailableRaces, setAllAvailableRaces] = useState<any[]>([]);
  const [selectedRaceIds, setSelectedRaceIds] = useState<string[]>([]);
  const [getRegEvents, setRegEvents] = useState([])
  const [showSelectClubModal, setShowSelectClubModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successData, setSuccessData] = useState<any>(null);

  const fetRegEvents = async () => {
    try {
      const res = await axios.get(`${baseURL}/registrations/search?playerId=${player?.playerId}`)
      setRegEvents(res?.data)
    } catch (error: any) {
      // console.log(error?.data?.message);

    }
  }

  useEffect(() => {
    fetchEvents();
    fetRegEvents();
  }, [baseURL]);

  const isAlreadyRegistered = (eventId: string) => {
    return getRegEvents.some((reg: any) => reg.eventId === eventId);
  };




  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${baseURL}/events/get-all-with-full-details`);
      const currentDate = new Date(); // Dynamic current date
      const events = response.data.filter((event: any) => new Date(event.eventDate) > currentDate);
      setEvents(events);
      setUpcomingEvents(events);
      setError(null);
    } catch (err) {
      // console.error('Failed to fetch events:', err);
      setError('Failed to load upcoming events. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  



  const calculateAge = (dob: string, ageAsOnDate: string) => {

    const asOn = new Date(ageAsOnDate);
    const birthDate = new Date(dob);

    let age = asOn.getFullYear() - birthDate.getFullYear();
    const monthDiff = asOn.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && asOn.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  };

  const handleRegister = (event: Event) => {

        // console.log("Player Data:", player);

    if (!player?.clubId) {
      setShowSelectClubModal(true);
      // alert("Please select your club in the Profile tab before registering for an event.");
      setShowRegistrationModal(false);
      return;
    }

    setSelectedEvent(event);
    setShowRegistrationModal(true);
  };

  useEffect(() => {
    const fetchEligibility = async () => {
      if (!selectedEvent || !registrationData?.category || !player?.dob) return;

      try {
        // Convert DOB to yyyy-mm-dd if in "Tue, 26 Dec 2000 00:00:00 GMT" format
        let dob = player.dob;
        if (typeof dob === 'string' && dob.match(/^[A-Za-z]{3},/)) {
          const dateObj = new Date(dob);
          dob = dateObj.toISOString().slice(0, 10); // yyyy-mm-dd
        }
        const res = await axios.get(
          `${baseURL}/events/${selectedEvent.id}/check-eligibility-by-dob?dob=${dob}&skateCategory=${registrationData.category}`
        );

        // console.log(res?.data,"age ");
        
        setRegistrationData((prev:any) => ({
          ...prev,
          ageGroupId: res.data.ageGroupId,
          ageGroup: res.data.ageGroup,
          category: res.data.skateCategory,
          mustSelectRaces: res?.data?.mustSelectRaces
        }));

        setAllAvailableRaces(res.data.races); // ✅ store full list here
        setSelectedRaceIds([]); // clear previous selection

      } catch (error: any) {
        // console.log(error?.response);
      }
    };

    fetchEligibility();
  }, [registrationData?.category, selectedEvent]);


  const handleRaceSelection = (raceId: string) => {
    setSelectedRaceIds((prevSelected) => {
      const isSelected = prevSelected.includes(raceId);
      if (isSelected) {
        // Remove if already selected
        return prevSelected.filter(id => id !== raceId);
      } else if (prevSelected.length < registrationData.mustSelectRaces) {
        // Add if limit not reached
        return [...prevSelected, raceId];
      }
      return prevSelected; // Do nothing if limit reached
    });
  };


  const downloadRegistrationPDF = async () => {
                            await fetchEvents();
                        await fetRegEvents();
const registeredData = selectedEvent
  ? getRegEvents.find((reg: any) => reg.eventId === selectedEvent.id && reg.playerId === player?.playerId) as { id?: string; chestNumber?: string; selectedRaces?: any[] } | undefined
  : undefined;

const data = {
          registrationId: registeredData && registeredData.id ? registeredData.id : '',
          playerName: player.name,
          eventName: selectedEvent.name,
          eventDate:  selectedEvent.eventDate,
          venue:  selectedEvent.venue,

          skateCategory: registrationData?.category || '',
          chestNumber: registeredData && registeredData.chestNumber ? registeredData.chestNumber : '',
          ageGroup: registrationData?.ageGroup || '',
          selectedRaces: registeredData && registeredData.selectedRaces ? registeredData.selectedRaces : [],

          dob: player.dob,
          gender: player.gender,
          amountPaid: selectedEvent.eventFee,
          registrationDate: registeredData && (registeredData as any).createdAt ? (registeredData as any).createdAt : '',
          profileImageUrl: registrationData.profileImageUrl,
          email: player.email,
          mobileNumber: player.mobileNumber,
          address: player.address,
          clubName: player.clubName,
          aadharNumber: player.aadharNumber,
          districtName: player.districtName,
          stateName: player.stateName,
          playerId: player.playerId,
          instructions: selectedEvent.instruction,
          declaration: selectedEvent.declaration,

        }

        // console.log("Generating PDF for registration...", registeredData);


      generateRegistrationPDF(data);
                      
  }

  useEffect(() => {
    setRegistrationData((prev: any) => ({
      ...prev,
      selectedRaces: selectedRaceIds.map((id) =>
        prev.selectedRaces.find((race: any) => race.id === id)
      ).filter(Boolean), // Remove any undefined
    }));
  }, [selectedRaceIds]);


  useEffect(() => {
    const selectedRaceObjs = allAvailableRaces?.filter((race) =>
      selectedRaceIds.includes(race.id)
    );

    setRegistrationData((prev:any) => ({
      ...prev,
      selectedRaces: selectedRaceObjs
    }));
  }, [selectedRaceIds, allAvailableRaces]);

  // console.log(selectedRaceIds, "selectedRaceIds");

  const handleSubmitRegistration = async () => {
    // Convert DOB to yyyy-mm-dd if in "Tue, 26 Dec 2000 00:00:00 GMT" format
    let dob = player?.dob;
    if (typeof dob === 'string' && dob.match(/^[A-Za-z]{3},/)) {
      const dateObj = new Date(dob);
      dob = dateObj.toISOString().slice(0, 10); // yyyy-mm-dd
    }

    // Prepare payload for registration
    const payload = {
      playerId: player?.playerId,
      skateCategory: registrationData?.category,
      eventId: selectedEvent?.id,
      ageGroupId: registrationData?.ageGroupId,
      selectedRacesIds: selectedRaceIds,
      paymentId: "", // Will be set after payment
      amountPaid: selectedEvent?.eventFee,
      profileImageUrl: registrationData?.profileImageUrl,
      clubName: player?.clubName,
      clubId: player?.clubId,
      districtId: player?.districtId,
      stateId: player?.stateId,
      dob: dob,
      remarks: "",
    };

    // Payment integration if event fee > 0
    if (selectedEvent?.eventFee !== undefined && selectedEvent?.eventFee !== null && selectedEvent?.eventFee > 0) {
      try {
        // Create payment order
        const paymentOrderRes = await fetch('https://sportims-api.justvy.com/cashfree/sportims/create_order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: player.name,
            mobile_number: player.mobileNumber,
            aadhaar_number: player.aadharNumber,
            user_id: player.playerId,
            event_id: selectedEvent.id,
            registration_id: 0,
            amount: selectedEvent.eventFee
          })
        });

        if (!paymentOrderRes.ok) {
          const errData = await paymentOrderRes.json();
          throw new Error(errData.error || 'Failed to create payment order');
        }

        const paymentOrder = await paymentOrderRes.json();
        if (!paymentOrder.payment_session_id || !paymentOrder.cf_order_id) {
          throw new Error('Payment session not created');
        }

        // Load Cashfree JS SDK if not loaded
        if (!(window as any).Cashfree) {
          await new Promise<void>((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js';
            script.onload = () => resolve();
            script.onerror = () => reject(new Error('Failed to load Cashfree SDK'));
            document.body.appendChild(script);
          });
        }

        // Initialize Cashfree SDK
        const cashfree = (window as any).Cashfree({ mode: 'production' });

        // Open Cashfree checkout modal
        await cashfree.checkout({
          paymentSessionId: paymentOrder.payment_session_id,
          redirectTarget: '_modal',
        }).then(async (result: any) => {
          if (result.error) {
            // User closed popup or error
            if ((window as any).toast) {
              (window as any).toast.error('Payment popup closed or error occurred.');
            }
            return;
          }
          if (result.paymentDetails) {
            // Check payment status
            const paymentStatusRes = await fetch('https://sportims-api.justvy.com/cashfree/sportims/check_status', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                aadhaar_number: player.aadharNumber,
                event_id: selectedEvent.id
              })
            });
            const paymentStatus = await paymentStatusRes.json();

            if (
              !paymentStatusRes.ok ||
              paymentStatus.status !== 'PAID' ||
              (paymentStatus.details && paymentStatus.details.order_status !== 'PAID')
            ) {
              if ((window as any).toast) {
                (window as any).toast.error(
                  paymentStatus.error ||
                  'Payment not completed. Please complete payment before registration.'
                );
              }
              return;
            } else {
              // Payment successful, proceed with registration
              payload.paymentId = paymentOrder.cf_order_id;
              try {
                const registrationResponse = await axios.post(`${baseURL}/registrations/`, payload);
                
                // Set success data for the modal
                setSuccessData({
                  eventName: selectedEvent?.name,
                  registrationId: registrationResponse.data?.id || 'N/A',
                  chestNumber: registrationResponse.data?.chestNumber || 'TBA',
                  paymentId: paymentOrder.cf_order_id,
                  amountPaid: selectedEvent?.eventFee,
                  selectedRaces: registrationData?.selectedRaces || [],
                  ageGroup: registrationData?.ageGroup,
                  category: registrationData?.category
                });
                
                // Show success modal
                setShowSuccessModal(true);
                setShowRegistrationModal(false);
              } catch (error: any) {
                alert(error?.response?.data?.message || "Failed to register for the event.");
              }
            }
          }
        });
         await fetRegEvents();
      } catch (error: any) {
        alert(error?.message || "Payment failed. Please try again.");
      }
    } else {
      // No payment required, proceed with registration
      console.log("No payment required, proceeding with registration...");
      try {
        const registrationResponse = await axios.post(`${baseURL}/registrations/`, payload);
        
        // Set success data for the modal
        setSuccessData({
          eventName: selectedEvent?.name,
          registrationId: registrationResponse.data?.id || 'N/A',
          chestNumber: registrationResponse.data?.chestNumber || 'TBA',
          paymentId: 'N/A (Free Event)',
          amountPaid: 0,
          selectedRaces: registrationData?.selectedRaces || [],
          ageGroup: registrationData?.ageGroup,
          category: registrationData?.category
        });
        
        // Show success modal
        setShowSuccessModal(true);
        setShowRegistrationModal(false);
      } catch (error: any) {
        alert(error?.response?.data?.message || "Failed to register for the event.");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Upcoming Events</h1>
        <p className="text-gray-600 mt-1">Register for upcoming sports events and competitions</p>
      </div>
      {/* List View with Expandable Details */}
      <div className="space-y-4">
        {upcomingEvents.map((event: any, idx: number) => {
          const isExpanded = selectedEvent?.id === event.id;

          // Define a palette of colors for cards
          const cardColors = [
            'bg-red-50 border-red-300',
            'bg-blue-50 border-blue-300',
            'bg-green-50 border-green-300',
            'bg-orange-50 border-orange-300',
            'bg-amber-50 border-amber-300',
            'bg-purple-50 border-purple-300',
            'bg-pink-50 border-pink-300',
            'bg-teal-50 border-teal-300',
            'bg-lime-50 border-lime-300',
            'bg-cyan-50 border-cyan-300',
            'bg-emerald-50 border-emerald-300',
            'bg-violet-50 border-violet-300',
            'bg-fuchsia-50 border-fuchsia-300',
            'bg-marron-50 border-marron-300', // custom, fallback to red if not in tailwind
          ];
          // Use modulo to cycle through colors
          const cardColor = cardColors[idx % cardColors.length];

          return (
            <Card
              key={event?.id}
              className={`cursor-pointer ${cardColor} ${isExpanded ? 'border-2 ring-2 ring-blue-200' : 'border'} transition-all`}
            >
              <div
                className="flex items-center justify-between p-4"
                onClick={() => setSelectedEvent(isExpanded ? null : event)}
                style={{ cursor: 'pointer' }}
              >
                <div>
                    <h3
                    className={`text-lg font-semibold ${
                      [
                      'text-red-700',
                      'text-blue-700',
                      'text-green-700',
                      'text-orange-700',
                      'text-amber-700',
                      'text-purple-700',
                      'text-pink-700',
                      'text-teal-700',
                      'text-lime-700',
                      'text-cyan-700',
                      'text-emerald-700',
                      'text-violet-700',
                      'text-fuchsia-700',
                      'text-rose-700', // fallback for maroon
                      ][idx % 14]
                    }`}
                    >
                    {event?.name}
                    </h3>
                  <p className="text-sm text-gray-600 flex items-center gap-2">
                    <MapPin size={16} className="mr-1 text-gray-400" />
                    {event?.venue}
                    <span className="mx-2">&middot;</span>
                    <Calendar size={16} className="mr-1 text-gray-400" />
                    {new Date(event.eventDate).toLocaleDateString()}
                  </p>
                </div>
                {!isAlreadyRegistered(event.id) ? (
                  <Badge variant="success" size="sm">Not Registered</Badge>
                ) : (
                  <>
                    <Badge variant="info" size="sm">Registered</Badge>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="ml-2"
                      onClick={async (e) => {
                        e.stopPropagation();
                        await fetRegEvents();
                        downloadRegistrationPDF();
                        setSelectedEvent(event);
                      }}
                    >
                      Download PDF
                    </Button>
                  </>
                )}
              </div>
              {isExpanded && (
                <div className="p-6 border-t">
                  <div className="flex items-start justify-between mb-4">
                    {!isAlreadyRegistered(event.id) ? <Badge variant="success" size="sm">Open</Badge> : <Badge variant="info" size="sm">Registered</Badge>}
                  </div>
                  {event?.bannerUrl && (
                    <div className="mb-6">
                      <img
                        src={event.bannerUrl}
                        alt={`${event.name} Banner`}
                        className="w-full h-58 object-cover rounded-lg shadow"
                      />
                    </div>
                  )}
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-900 mb-2">Instructions:</h4>
                    <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                      {event?.instruction}
                    </ul>
                  </div>
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-900 mb-2">Declaration:</h4>
                    <p className="text-sm text-gray-700">
                      {event?.declaration }
                    </p>
                  </div>
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-900 mb-2">Age Groups:</h4>
                    <div className="flex flex-wrap gap-2">
                      {event?.ageGroups?.map((ag: any) => (
                        <Badge key={ag?.id} variant="default" size="sm">
                          {ag?.ageGroupName}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-900 mb-2">Available Races:</h4>
                    <div className="space-y-1">
                      {event?.races?.slice(0, 3).map((race: any) => (
                        <div key={race.id} className="text-sm text-gray-600">
                          • {race.name}
                        </div>
                      ))}
                      {event?.races?.length > 3 && (
                        <div className="text-sm text-gray-500">
                          +{event.races.length - 3} more races
                        </div>
                      )}
                    </div>
                  </div>
                  {
                    !isAlreadyRegistered(event.id) ? (
                      new Date(event.regStartingDate) <= new Date() &&
                      new Date(event.regEndingDate) >= new Date() ? (
                        <Button
                          variant="primary"
                          className="w-full"
                          onClick={() => handleRegister(event)}
                        >
                          Register for Event
                        </Button>
                      ) : (
                        <div className="text-sm text-red-500 font-medium">
                          {new Date(event.regStartingDate) > new Date()
                            ? "Registration has not started yet."
                            : "Registration is closed for this event."}
                        </div>
                      )
                    ) : (
                      <div className="text-sm text-green-600 font-medium">
                        You have already registered for this event.
                      </div>
                    )
                  }
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {events.length === 0 && (
        <Card>
          <div className="text-center py-12">
            <Calendar className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No upcoming events</h3>
            <p className="mt-1 text-sm text-gray-500">
              Check back later for new events and competitions.
            </p>
          </div>
        </Card>
      )}

      {/* Registration Modal */}
      <Modal
        isOpen={showRegistrationModal}
        onClose={() => setShowRegistrationModal(false)}
        title={`Register for ${selectedEvent?.name}`}
        size="xl"
      >
        <div className="space-y-6">
          {/* Event Summary */}
          <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-medium text-gray-900 mb-2">Event Details</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium">Event:</span> {selectedEvent?.name}
          </div>
          <div>
            <span className="font-medium">Venue:</span> {selectedEvent?.venue}
          </div>
          <div>
            <span className="font-medium">Dates:</span> {selectedEvent && new Date(selectedEvent?.eventDate).toLocaleDateString()}
          </div>
          <div>
            <span className="font-medium">Your Age:</span> {calculateAge(player?.dob, selectedEvent?.ageAsOnDate)} years
          </div>
          <div>
            <span className="font-medium">Your Age group:</span> {registrationData?.ageGroup}
          </div>
        </div>
          </div>

          {/* Profile Photo Upload */}
          <FormField label="Profile Photo" required>
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
          setRegistrationData((prev: any) => ({
            ...prev,
            profileImageUrl: res.data.url
          }));
            } catch (error) {
          alert('Failed to upload image');
            }
          }}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
        />
        {registrationData.profileImageUrl && (
          <div className="mt-2">
            <img
          src={registrationData.profileImageUrl}
          alt="Profile Preview"
          className="h-20 w-20 object-cover rounded"
            />
          </div>
        )}
          </FormField>

          {/* Category Selection */}
          <FormField label="Category" required>
        <select
          value={registrationData.category}
          onChange={(e) => setRegistrationData({ ...registrationData, category: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        >
          <option value="beginner">Beginner</option>
          <option value="fancy">Fancy</option>
          <option value="inline">Inline</option>
          <option value="quad">Quad</option>
        </select>
          </FormField>

          {/* Race Selection */}
          <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Races (Must {registrationData?.mustSelectRaces})
        </label>
        <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-3">
          {allAvailableRaces?.map((race: any) => {
            const isChecked = selectedRaceIds.includes(race.id);
            const isDisabled = !isChecked && selectedRaceIds.length >= registrationData.mustSelectRaces;

            return (
          <label key={race.id} className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={isChecked}
              onChange={() => handleRaceSelection(race.id)}
              disabled={isDisabled}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <div className="flex-1">
              <div className="font-medium text-gray-900">{race.name}</div>
              {race.description && (
            <div className="text-sm text-gray-500">{race.description}</div>
              )}
            </div>
          </label>
            );
          })}
        </div>

        <p className="text-sm text-gray-500 mt-2">
          Selected: {selectedRaceIds.length} / {registrationData?.mustSelectRaces} races
        </p>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
        <Button variant="secondary" onClick={() => setShowRegistrationModal(false)}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmitRegistration}
          disabled={
            !registrationData.ageGroup ||
            !(registrationData.selectedRaces && registrationData.selectedRaces.length === registrationData?.mustSelectRaces) ||
            !registrationData.profileImageUrl
          }
        >
          <CheckCircle size={16} className="mr-2" />
          Submit Registration
        </Button>
          </div>
        </div>
      </Modal>


            {/* Confirm Logout Modal */}
      {showSelectClubModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-md p-6 max-w-sm w-full">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Select Club</h2>
            <p className="text-gray-600 mb-6">Please select your club in the Profile tab before registering for an event.</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowSelectClubModal(false)}
                className="px-4 py-2 text-sm text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  window.location.href = '/player/profile';
                }}
                className="px-4 py-2 text-sm text-white bg-red-600 rounded hover:bg-red-700"
              >
                Navigate to Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Event Registration Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <div className="text-center">
              {/* Success Icon */}
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              
              {/* Success Title */}
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Registration Successful!
              </h2>
              
              {/* Success Message */}
              <p className="text-gray-600 mb-6">
                You have successfully registered for {successData?.eventName}
              </p>
              
              {/* Registration Details */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                <h3 className="font-medium text-gray-900 mb-3">Registration Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Registration ID:</span>
                    <span className="font-medium">{successData?.registrationId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Chest Number:</span>
                    <span className="font-medium">{successData?.chestNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Category:</span>
                    <span className="font-medium">{successData?.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Age Group:</span>
                    <span className="font-medium">{successData?.ageGroup}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount Paid:</span>
                    <span className="font-medium">₹{successData?.amountPaid || 0}</span>
                  </div>
                  {successData?.paymentId && successData?.paymentId !== 'N/A (Free Event)' && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment ID:</span>
                      <span className="font-medium text-xs">{successData?.paymentId}</span>
                    </div>
                  )}
                </div>
                
                {/* Selected Races */}
                {successData?.selectedRaces && successData.selectedRaces.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-medium text-gray-900 mb-2">Selected Races:</h4>
                    <div className="space-y-1">
                      {successData.selectedRaces.map((race: any, index: number) => (
                        <div key={index} className="text-sm text-gray-600">
                          • {race.name}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  className="flex-1"
                  onClick={async () => {
                    await fetRegEvents();
                    if (selectedEvent) {
                      downloadRegistrationPDF();
                    }
                  }}
                >
                  Download PDF
                </Button>
                <Button
                  variant="primary"
                  className="flex-1"
                  onClick={async () => {
                    setShowSuccessModal(false);
                    setSuccessData(null);
                    await fetRegEvents();
                  }}
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpcomingEvents;