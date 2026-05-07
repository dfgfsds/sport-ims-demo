import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Upload } from 'lucide-react';
import Modal from '../UI/Modal';
import Button from '../UI/Button';
import FormField from '../UI/FormField';
import Tabs from '../UI/Tabs';
import axios from 'axios';
import { Event, Race, AgeGroup, RaceMatrix, racesForAgeGroups } from '../../types';

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: Partial<Event>) => void;
  modalMode: 'create' | 'view' | 'edit';
  initialEvent?: Partial<Event>;
}

const CreateEventModal: React.FC<any> = ({
  isOpen,
  onClose,
  onSave,
  modalMode,
  initialEvent,
  onUpdate
}) => {

  const baseURL = import.meta.env.VITE_API_BASE_URL;
  const isReadOnly = modalMode === 'view';
  const [eventData, setEventData] = useState<any>({
    name: '',
    eventDate: '',
    venue: '',
    regStartingDate: '',
    regEndingDate: '',
    chestNumberPrefix: '',
    ageAsOnDate: '',
    bannerUrl: '',
    advertisementUrl: '',
    declaration: '',
    instruction: '',
    eventFee: 0,
    certificateStatus: true,
    races: [],
    ageGroups: [],
    raceMatrix: [],
    id: '',
    tshirt_size_Status: false,
  });


  const [races, setRaces] = useState<Race[]>([]);
  const [ageGroups, setAgeGroups] = useState<AgeGroup[]>([]);
  const [raceMatrix, setRaceMatrix] = useState<RaceMatrix[]>([]);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [adFile, setAdFile] = useState<File | null>(null);
  const [racesForAgeGroups, setRacesForAgeGroups] = useState<racesForAgeGroups[]>([]);

  const categories = [
    { id: 'beginner', name: 'beginner', description: 'Beginner level' },
    { id: 'fancy', name: 'fancy', description: 'Fancy skating' },
    { id: 'inline', name: 'inline', description: 'Inline skating' },
    { id: 'quad', name: 'quad', description: 'Quad skating' },
  ];

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    return `${year}-${month}-${day}`;
  };


  // Fetch event data in view mode
  // useEffect(() => {
  //   if (modalMode === 'view' || modalMode === 'edit' && initialEvent?.id) {
  //     const fetchEventData = async () => {
  //       try {
  //         const response = await axios.get(`${baseURL}/events/${initialEvent.id}`);
  //         const event: any = response.data;
  // console.log(event)
  //         setEventData({
  //           name: event?.event?.name || '',
  //           eventDate: event.event?.eventDate || '',
  //           venue: event.event?.venue || '',
  //           regStartingDate: event.event?.regStartingDate || '',
  //           regEndingDate: event.event?.regEndingDate || '',
  //           chestNumberPrefix: event.event?.chestNumberPrefix || '',
  //           ageAsOnDate: event.event?.ageAsOnDate || '',
  //           bannerUrl: event.event?.bannerUrl || '',
  //           advertisementUrl: event.event?.advertisementUrl || '',
  //           declaration: event.event?.declaration || '',
  //           instruction: event.event?.instruction || '',
  //           eventFee: event.event?.eventFee || 0,
  //           certificateStatus: event.event?.certificateStatus ?? true,
  //           races: event.event?.races || [],
  //           ageGroups: event.event?.ageGroups || [],
  //           raceMatrix: event.event?.raceMatrix || [],
  //           id: event?.event?.id
  //         });
  //         setRaces(
  //           (event.races || []).map((race: Race) => ({
  //             ...race,
  //             id: race.id,
  //           }))
  //         );

  //         console.log("races upadted", races)

  //         console.log(event.races, "races")
  //         setAgeGroups(
  //           (event.ageGroups || []).map((group: any) => ({
  //             ...group,
  //             id: group.id?.toString() || `AG${Date.now()}`, // Ensure ID is string
  //             name: group.ageGroupName || '', // Map ageGroupName to name
  //             startingDate: group.startingDate ? formatDate(group.startingDate) : '',
  //             endingDate: group.endingDate ? formatDate(group.endingDate) : '',
  //           }))
  //         );

  //         setRacesForAgeGroups(
  //           (event.racesForAgeGroups || []).map((entry: any) => ({
  //             ...entry,
  //             id: entry.id?.toString() || `RAG${Date.now()}`, // Ensure ID is string
  //             raceIds: entry.raceIds || '',
  //             ageGroupId: entry.ageGroupId?.toString() || `AG${Date.now()}`, // Ensure ageGroupId is string
  //             skateCategory: entry.skateCategory || '',
  //             exactRacesToSelectByPlayerCount: entry.exactRacesToSelectByPlayerCount || 1,
  //           })));

  //           // console.log('Fetched event data:', event);

  //         setRaceMatrix(
  //           (event.racesForAgeGroups || []).flatMap((entry: any) =>
  //             entry.raceIds.split(',').map((raceId: string) => ({
  //               id: `RM${entry.id}-${raceId}`, // Unique ID
  //               raceId: raceId.trim(),
  //               ageGroupId: entry.ageGroupId.toString(),
  //               category: categories.find((c) => c.name === entry.skateCategory) || {
  //                 id: entry.skateCategory,
  //                 name: entry.skateCategory,
  //                 description: entry.skateCategory,
  //               },
  //               isEnabled: true, // Assume enabled
  //               maxRacesPerPlayer: entry.exactRacesToSelectByPlayerCount || 1, // Use exactRacesToSelectByPlayerCount
  //             }))
  //           )
  //         );
  //       } catch (error) {
  //         console.error('Failed to fetch event data:', error);
  //         alert('Failed to load event details. Please try again.');
  //       }
  //     };
  //     fetchEventData();
  //   } else {
  //     // Reset for create mode
  //     setEventData({
  //       name: '',
  //       eventDate: '',
  //       venue: '',
  //       regStartingDate: '',
  //       regEndingDate: '',
  //       chestNumberPrefix: '',
  //       ageAsOnDate: '',
  //       bannerUrl: '',
  //       advertisementUrl: '',
  //       declaration: '',
  //       instruction: '',
  //       eventFee: 0,
  //       certificateStatus: true,
  //       races: [],
  //       ageGroups: [],
  //       raceMatrix: [],
  //     });
  //     setRaces([]);
  //     setAgeGroups([]);
  //     setRaceMatrix([]);
  //     setBannerFile(null);
  //     setAdFile(null);
  //   }
  // }, [modalMode, initialEvent, baseURL]);


  useEffect(() => {
    if ((modalMode === 'view' || modalMode === 'edit') && initialEvent?.id) {
      const fetchEventData = async () => {
        try {
          const response = await axios.get(
            `${baseURL}/events/${initialEvent.id}`
          );

          const apiData = response.data;
          const event = apiData.event;

          // 🔹 EVENT BASIC DETAILS (DATE FIX)
          setEventData({
            id: String(event.id),
            name: event.name || '',
            venue: event.venue || '',
            declaration: event.declaration || '',
            instruction: event.instruction || '',
            chestNumberPrefix: event.chestNumberPrefix || '',
            eventFee: event.eventFee || 0,
            certificateStatus: Boolean(event.certificateStatus),

            eventDate: event.eventDate
              ? formatDate(event.eventDate)
              : '',
            regStartingDate: event.regStartingDate
              ? formatDate(event.regStartingDate)
              : '',
            regEndingDate: event.regEndingDate
              ? formatDate(event.regEndingDate)
              : '',
            ageAsOnDate: event.ageAsOnDate
              ? formatDate(event.ageAsOnDate)
              : '',

            bannerUrl: event.bannerUrl || '',
            advertisementUrl: event.advertisementUrl || '',
            tshirt_size_Status: Boolean(event.tshirt_size_Status),
          });

          // 🔹 RACES
          setRaces(
            (apiData.races || []).map((race: any) => ({
              id: String(race.id),
              name: race.name || '',
              description: race.description || '',
              genderEligibility: race.genderEligibility || 'all',
            }))
          );

          // 🔹 AGE GROUPS (DATE + STRING ID FIX)
          setAgeGroups(
            (apiData.ageGroups || []).map((group: any) => ({
              id: String(group.id),
              name: group.ageGroupName || '',
              startingDate: group.startingDate
                ? formatDate(group.startingDate)
                : '',
              endingDate: group.endingDate
                ? formatDate(group.endingDate)
                : '',
            }))
          );

          // 🔹 RACES FOR AGE GROUPS (STRING FIX)
          setRacesForAgeGroups(
            (apiData.racesForAgeGroups || []).map((entry: any) => ({
              id: String(entry.id),
              ageGroupId: String(entry.ageGroupId),
              skateCategory: entry.skateCategory,
              raceIds: entry.raceIds || '',
              exactRacesToSelectByPlayerCount:
                entry.exactRacesToSelectByPlayerCount || 1,
              minRacesToSelectByPlayerCount:
                entry.minRacesToSelectByPlayerCount || 0,
              maxRacesToSelectByPlayerCount:
                entry.maxRacesToSelectByPlayerCount || 1,
            }))
          );

          // 🔹 RACE MATRIX (CHECKBOX PREFILL FIX)
          setRaceMatrix(
            (apiData.racesForAgeGroups || []).flatMap((entry: any) =>
              entry.raceIds
                ?.split(',')
                .map((raceId: string) => ({
                  id: `RM-${entry.id}-${raceId}`,
                  raceId: String(raceId.trim()),
                  ageGroupId: String(entry.ageGroupId),
                  category:
                    categories.find(
                      (c) => c.name === entry.skateCategory
                    ) || {
                      id: entry.skateCategory,
                      name: entry.skateCategory,
                      description: entry.skateCategory,
                    },
                  isEnabled: true,
                  maxRacesPerPlayer:
                    entry.exactRacesToSelectByPlayerCount || 1,
                }))
            )
          );
        } catch (error) {
          console.error('❌ Failed to fetch event data:', error);
          alert('Failed to load event details');
        }
      };

      fetchEventData();
    } else {
      // 🔹 RESET FOR CREATE MODE
      setEventData({
        name: '',
        eventDate: '',
        venue: '',
        regStartingDate: '',
        regEndingDate: '',
        chestNumberPrefix: '',
        ageAsOnDate: '',
        bannerUrl: '',
        advertisementUrl: '',
        declaration: '',
        instruction: '',
        eventFee: 0,
        certificateStatus: true,
        tshirt_size_Status: false,
      });

      setRaces([]);
      setAgeGroups([]);
      setRaceMatrix([]);
      setRacesForAgeGroups([]);
      setBannerFile(null);
      setAdFile(null);
    }
  }, [modalMode, initialEvent?.id, baseURL]);



  const addRace = () => {
    const newRace: Race = {
      id: `R${Date.now()}`,
      name: '',
      description: '',
      genderEligibility: 'all',
    };
    setRaces([...races, newRace]);
  };

  const updateRace = (index: number, field: keyof Race, value: string) => {
    const updatedRaces = [...races];
    updatedRaces[index] = { ...updatedRaces[index], [field]: value };
    setRaces(updatedRaces);
  };

  const removeRace = (index: number) => {
    setRaces(races.filter((_, i) => i !== index));
    setRaceMatrix(raceMatrix.filter((rm) => rm.raceId !== races[index].id));
  };

  const addAgeGroup = () => {
    const newAgeGroup: any = {
      id: `AG${Date.now()}`,
      name: '',
      startingDate: '',
      endingDate: '',
    };
    setAgeGroups([...ageGroups, newAgeGroup]);
  };

  const updateAgeGroup = (index: number, field: keyof AgeGroup, value: string | number) => {
    const updatedAgeGroups = [...ageGroups];
    updatedAgeGroups[index] = { ...updatedAgeGroups[index], [field]: value };
    setAgeGroups(updatedAgeGroups);
  };

  const removeAgeGroup = (index: number) => {
    setAgeGroups(ageGroups.filter((_, i) => i !== index));
    setRaceMatrix(raceMatrix.filter((rm) => rm.ageGroupId !== ageGroups[index].id));
  };

  const toggleRaceMatrix = (raceId: string, ageGroupId: string, category: string) => {
    const existingIndex = raceMatrix.findIndex(
      (rm) => rm.raceId === raceId && rm.ageGroupId === ageGroupId && rm.category.name === category
    );

    if (existingIndex >= 0) {
      setRaceMatrix(raceMatrix.filter((_, i) => i !== existingIndex));
    } else {
      const newMatrix: any = {
        id: `RM${Date.now()}`,
        raceId,
        ageGroupId,
        category: categories.find((c) => c.name === category)!,
        isEnabled: true,
        maxRacesPerPlayer: 1,
      };
      setRaceMatrix([...raceMatrix, newMatrix]);
    }
  };

  const updateMaxRaces = (raceId: string, ageGroupId: string, category: string, maxRaces: number) => {
    const updatedMatrix = raceMatrix.map((rm) => {
      if (rm.raceId === raceId && rm.ageGroupId === ageGroupId && rm.category.name === category) {
        return { ...rm, maxRacesPerPlayer: maxRaces };
      }
      return rm;
    });
    setRaceMatrix(updatedMatrix);
  };

  const isRaceEnabled = (raceId: string, ageGroupId: string, category: string) => {
    return raceMatrix.some(
      (rm) => rm.raceId === raceId && rm.ageGroupId === ageGroupId && rm.category.name === category
    );
  };

  const getMaxRaces = (raceId: string, ageGroupId: string, category: string) => {
    const matrix = raceMatrix.find(
      (rm) => rm.raceId === raceId && rm.ageGroupId === ageGroupId && rm.category.name === category
    );
    return matrix?.maxRacesPerPlayer || 1;
  };

  const handleFileUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    try {
      const response = await axios.post(`https://sportims-api.justvy.com/upload/image/`, formData);
      return response.data.url;
    } catch (error) {
      console.error('File upload failed:', error);
      alert('Failed to upload file. Please try again.');
      return '';
    }
  };

  const getChangedFields = (original: any, updated: any) => {
    const changed: Record<string, any> = {};
    Object.keys(updated).forEach((key) => {
      if (JSON.stringify(updated[key]) !== JSON.stringify(original?.[key])) {
        changed[key] = updated[key];
      }
    });
    return changed;
  };

  const getChangedArrayItems = (originalArr: any[], updatedArr: any[], key: string) => {
    return updatedArr.filter((updatedItem) => {
      const originalItem = originalArr.find((o) => o[key] === updatedItem[key]);
      if (!originalItem) return true; // New item
      return JSON.stringify(updatedItem) !== JSON.stringify(originalItem);
    });
  };

  const handleSave = async () => {
    if (modalMode === 'view') {
      onClose();
      return;
    }

    let bannerUrl = eventData.bannerUrl;
    let advertisementUrl = eventData.advertisementUrl;

    // if (bannerFile) {
    //   bannerUrl = await handleFileUpload(bannerFile);
    // }
    // if (adFile) {
    //   advertisementUrl = await handleFileUpload(adFile);
    // }

    const updatedEventData = {
      ...eventData,
      bannerUrl,
      advertisementUrl,
    };

    const racesForSkateCategories = ageGroups.reduce((acc: Record<string, any>, ageGroup) => {
      const categoriesForGroup: Record<string, any> = {};
      categories.forEach((category) => {
        const racesForCategory = raceMatrix
          .filter((rm) => rm.ageGroupId === ageGroup.id && rm.category.name === category.name)
          .map((rm) => races.find((race) => race.id === rm.raceId)?.name)
          .filter((name): name is string => !!name);
        if (racesForCategory.length > 0) {
          const maxRaces = getMaxRaces(
            raceMatrix.find((rm) => rm.ageGroupId === ageGroup.id && rm.category.name === category.name)?.raceId || '',
            ageGroup.id,
            category.name
          );
          categoriesForGroup[category.name] = {
            races: racesForCategory,
            min: 0,
            max: maxRaces,
            exact: maxRaces,
          };
        }
      });
      acc[ageGroup.id as string] = categoriesForGroup;
      return acc;
    }, {} as Record<string, any>);

    // Remove 'races', 'ageGroups', and 'raceMatrix' from eventData if present
    const { races: _removedRaces, ageGroups: _removedAgeGroups, raceMatrix: _removedRaceMatrix, ...eventDataWithoutRaces } = updatedEventData;

    let payload: any = {
      event: eventDataWithoutRaces,
      races: races.map((race: any) => ({
        name: race.name,
        genderEligibility: race.genderEligibility,
        description: race.description || '',
      })),
      ageGroups: ageGroups.map((ageGroup: any) => ({
        ageGroupName: ageGroup.name || '',
        startingDate: ageGroup.startingDate || '',
        endingDate: ageGroup.endingDate || '',
        racesForSkateCategories: racesForSkateCategories[ageGroup.id] || {},
      })),
    };

    try {
      if (modalMode === 'edit') {
        // Diff event
        payload.event = getChangedFields(initialEvent?.event || {}, updatedEventData);

        // Diff races
        const changedRaces = getChangedArrayItems(initialEvent?.races || [], races, 'name');
        if (changedRaces.length > 0) {
          payload.races = changedRaces.map((race: any) => ({
            name: race.name,
            // genderEligibility: race.genderEligibility,
            // description: race.description || '',
          }));
        } else {
          delete payload.races;
        }

        // Diff age groups
        const changedAgeGroups = getChangedArrayItems(initialEvent?.ageGroups || [], ageGroups, 'id');
        if (changedAgeGroups.length > 0) {
          payload.ageGroups = changedAgeGroups.map((ageGroup: any) => ({
            ageGroupName: ageGroup.name || '',
            startingDate: ageGroup.startingDate || '',
            endingDate: ageGroup.endingDate || '',
            racesForSkateCategories: racesForSkateCategories[ageGroup.id] || {},
          }));
        } else {
          delete payload.ageGroups;
        }

        // PUT update
        await axios.put(`${baseURL}/events/${eventData.id}`, payload);

        onUpdate(); // refresh parent
      } else {

        // POST new event
        console.log('Creating new event with payload:', payload);
        await axios.post(`${baseURL}/events/create-new-event`, payload);
        onSave({ ...eventData, races, ageGroups, raceMatrix });
      }

      onClose(); // success
    } catch (error) {
      console.error(`Failed to ${modalMode === 'edit' ? 'update' : 'create'} event:`, error);
      alert(`Failed to ${modalMode === 'edit' ? 'update' : 'create'} event. Please try again.`);
    }
  };


  // SAVE RACE
  const saveRace = async () => {
    const paylaod = races?.map((r: any) => ({
      name: r.name,
    }))

    try {
      const updateApi = await axios.put(`${baseURL}/races/${eventData?.id}`, paylaod)
      if (updateApi.status) {

      }
    } catch (error) {

    }
  }

  const stepTabs = [
    {
      id: 'basic',
      label: 'Basic Details',
      content: (
        <div className="space-y-4">
          <FormField label="Event Name" required>
            <input
              type="text"
              value={eventData.name || ''}
              onChange={(e) => setEventData({ ...eventData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter event name"
              readOnly={isReadOnly}
            />
          </FormField>

          <FormField label="Declaration">
            <textarea
              value={eventData.declaration || ''}
              onChange={(e) => setEventData({ ...eventData, declaration: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              placeholder="Enter declaration text"
              readOnly={isReadOnly}
            />
          </FormField>

          <FormField label="Instruction">
            <textarea
              value={eventData.instruction || ''}
              onChange={(e) => setEventData({ ...eventData, instruction: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              placeholder="Enter instruction text"
              readOnly={isReadOnly}
            />
          </FormField>

          <FormField label="Event Venue" required>
            <input
              type="text"
              value={eventData.venue || ''}
              onChange={(e) => setEventData({ ...eventData, venue: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter venue"
              readOnly={isReadOnly}
            />
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Event Date" required>
              <input
                type="date"
                value={eventData.eventDate || ''}
                onChange={(e) => setEventData({ ...eventData, eventDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                readOnly={isReadOnly}
              />
            </FormField>

            <FormField label="Age As On Date" required>
              <input
                type="date"
                value={eventData.ageAsOnDate || ''}
                onChange={(e) => setEventData({ ...eventData, ageAsOnDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                readOnly={isReadOnly}
              />
            </FormField>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Registration Start Date" required>
              <input
                type="date"
                value={eventData.regStartingDate || ''}
                onChange={(e) => setEventData({ ...eventData, regStartingDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                readOnly={isReadOnly}
              />
            </FormField>

            <FormField label="Registration End Date" required>
              <input
                type="date"
                value={eventData.regEndingDate || ''}
                onChange={(e) => setEventData({ ...eventData, regEndingDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                readOnly={isReadOnly}
              />
            </FormField>
          </div>

          <FormField label="Chest Number Prefix" required>
            <input
              type="text"
              value={eventData.chestNumberPrefix || ''}
              onChange={(e) => setEventData({ ...eventData, chestNumberPrefix: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter chest number prefix"
              maxLength={10}
              readOnly={isReadOnly}
            />
          </FormField>

          <FormField label="Event Fee" required>
            <input
              type="number"
              value={eventData.eventFee || ''}
              onChange={(e) => setEventData({ ...eventData, eventFee: parseFloat(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter event fee"
              min="0"
              readOnly={isReadOnly}
            />
          </FormField>

          <FormField label="Certificate Status">
            <input
              type="checkbox"
              checked={eventData.certificateStatus || false}
              onChange={(e) => setEventData({ ...eventData, certificateStatus: e.target.checked })}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              disabled={isReadOnly}
            />
            <label className="ml-2 text-sm text-gray-700">Enable Certificates</label>
          </FormField>

          <FormField label="T-Shirt Size">
            <input
              type="checkbox"
              checked={eventData.tshirt_size_Status || false}
              onChange={(e) => setEventData({ ...eventData, tshirt_size_Status: e.target.checked })}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              disabled={isReadOnly}
            />
            <label className="ml-2 text-sm text-gray-700">Enable T-Shirt Size</label>
          </FormField>

          <FormField label="Event Banner">
            {isReadOnly && eventData.bannerUrl ? (
              <a
                href={eventData.bannerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                View Banner
              </a>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <input
                  type="file"
                  accept="image/png,image/jpeg"
                  onChange={async (e) => {
                    if (e.target.files && e.target.files[0]) {
                      const file = e.target.files[0];
                      const formData = new FormData();
                      formData.append('file', file);
                      try {
                        const response = await axios.post(
                          'https://sportims-api.justvy.com/upload/image/',
                          formData
                        );
                        if (response.data?.url) {
                          setBannerFile(file);
                          setEventData((prev: any) => ({
                            ...prev,
                            bannerUrl: response.data.url,
                          }));
                        }
                      } catch (error) {
                        alert('Failed to upload banner. Please try again.');
                      }
                    }
                  }}
                  className="mt-2 text-sm text-gray-600"
                  disabled={isReadOnly}
                />
                <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
              </div>
            )}
          </FormField>

          <FormField label="Advertisement Image">
            {isReadOnly && eventData.advertisementUrl ? (
              <a
                href={eventData.advertisementUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                View Advertisement
              </a>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <input
                  type="file"
                  accept="image/png,image/jpeg"
                  onChange={async (e) => {
                    if (e.target.files && e.target.files[0]) {
                      const file = e.target.files[0];
                      const formData = new FormData();
                      formData.append('file', file);
                      try {
                        const response = await axios.post(
                          'https://sportims-api.justvy.com/upload/image/',
                          formData
                        );
                        if (response.data?.url) {
                          setAdFile(file);
                          setEventData((prev: any) => ({
                            ...prev,
                            advertisementUrl: response.data.url,
                          }));
                        }
                      } catch (error) {
                        alert('Failed to upload advertisement image. Please try again.');
                      }
                    }
                  }}
                  className="mt-2 text-sm text-gray-600"
                  disabled={isReadOnly}
                />
                <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
              </div>
            )}
          </FormField>
        </div>
      ),
    },
    {
      id: 'races',
      label: 'Define Races',
      content: (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Race Types</h3>
            {!isReadOnly && (
              <Button onClick={addRace} size="sm">
                <Plus size={16} className="mr-2" />
                Add Race
              </Button>
            )}
          </div>

          <div className="space-y-4">
            {races.map((race, index) => (
              <div key={race.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="font-medium">Race {index + 1}</h4>
                  {!isReadOnly && (
                    <Button onClick={() => removeRace(index)} variant="danger" size="sm">
                      <Trash2 size={16} />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Race Name" required>
                    <input
                      type="text"
                      value={race.name}
                      onChange={(e) => updateRace(index, 'name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., 100m Sprint"
                      readOnly={isReadOnly}
                    />
                  </FormField>

                  {/* <FormField label="Gender Eligibility">
                    <select
                      value={race.genderEligibility}
                      onChange={(e) => updateRace(index, 'genderEligibility', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={isReadOnly}
                    >
                      <option value="all">All</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </FormField> */}
                </div>

                {/* <FormField label="Description">
                  <textarea
                    value={race.description || ''}
                    onChange={(e) => updateRace(index, 'description', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={2}
                    placeholder="Optional race description"
                    readOnly={isReadOnly}
                  />
                </FormField> */}
              </div>
            ))}
          </div>

          <div className='flex justify-end pb-1'>
            <Button onClick={() => saveRace()} size="sm">
              Save
            </Button>
          </div>
        </div>
      ),
    },
    {
      id: 'ageGroups',
      label: 'Age Groups',
      content: (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Age Groups</h3>
            {!isReadOnly && (
              <Button onClick={addAgeGroup} size="sm">
                <Plus size={16} className="mr-2" />
                Add Age Group
              </Button>
            )}
          </div>

          <div className="space-y-4">
            {ageGroups.map((ageGroup: any, index) => (
              <div key={ageGroup.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="font-medium">Age Group {index + 1}</h4>
                  {!isReadOnly && (
                    <Button onClick={() => removeAgeGroup(index)} variant="danger" size="sm">
                      <Trash2 size={16} />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <FormField label="Group Name" required>
                    <input
                      type="text"
                      value={ageGroup.name}
                      onChange={(e) => updateAgeGroup(index, 'name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Under 10"
                      readOnly={isReadOnly}
                    />
                  </FormField>

                  <FormField label="Starting Date" required>
                    <input
                      type="date"
                      value={ageGroup.startingDate || ''}
                      onChange={(e) => updateAgeGroup(index, 'startingDate', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      readOnly={isReadOnly}
                    />
                  </FormField>

                  <FormField label="Ending Date" required>
                    <input
                      type="date"
                      value={ageGroup.endingDate || ''}
                      onChange={(e) => updateAgeGroup(index, 'endingDate', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      readOnly={isReadOnly}
                    />
                  </FormField>
                </div>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: 'matrix',
      label: 'Race Matrix',
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Map Races × Age Groups × Categories</h3>

          {categories.map((category) => (
            <div key={category.id} className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium mb-4 capitalize">{category.name} Category</h4>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 px-4 py-2 text-left">Age Group</th>
                      {races.map((race) => (
                        <th key={race.id} className="border border-gray-300 px-4 py-2 text-center">
                          {race.name || `Race ${races.indexOf(race) + 1}`}
                        </th>
                      ))}
                      <th className="border border-gray-300 px-4 py-2 text-center">Max Races Per Player</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ageGroups.map((ageGroup: any) => (
                      <tr key={ageGroup.id}>
                        <td className="border border-gray-300 px-4 py-2 font-medium">
                          {ageGroup.name || `${ageGroup.startingDate}-${ageGroup.endingDate}`}
                        </td>
                        {races.map((race) =>
                        (

                          <td key={race.id} className="border border-gray-300 px-4 py-2 text-center">

                            <input
                              type="checkbox"
                              checked={
                                isRaceEnabled(race.id, ageGroup.id, category.name) ||

                                racesForAgeGroups.some((rm) =>
                                  rm.ageGroupId == ageGroup.id &&
                                  rm.skateCategory == category.name &&
                                  rm.raceIds?.split(',').includes(race.id))


                              }
                              onChange={() => {

                                console.log("racesForAgeGroups")
                                console.log(racesForAgeGroups)
                                toggleRaceMatrix(race.id, ageGroup.id, category.name)
                                let found = false;
                                console.log("Step 1: Checking racesForAgeGroups for ageGroupId:", ageGroup.id, "and skateCategory:", category.name);

                                racesForAgeGroups.forEach((rm) => {
                                  if (rm.ageGroupId === ageGroup.id && rm.skateCategory === category.name) {
                                    found = true;
                                    let raceArray = rm.raceIds ? rm.raceIds.split(',') : [];
                                    console.log("Step 2: Found matching entry. Current raceIds:", raceArray);

                                    if (raceArray.includes(race.id)) {
                                      // Remove if already exists
                                      raceArray = raceArray.filter(id => id !== race.id);
                                      console.log("Step 3: Removed raceId", race.id, "from raceIds:", raceArray);
                                    } else {
                                      // Add if not exists
                                      raceArray.push(race.id);
                                      console.log("Step 4: Added raceId", race.id, "to raceIds:", raceArray);
                                    }

                                    rm.raceIds = raceArray.join(',');
                                    console.log("Step 5: Updated raceIds for entry:", rm.raceIds);
                                  }
                                });

                                if (!found) {
                                  // Create new entry if no matching ageGroupId & skateCategory found
                                  console.log("Step 6: No matching entry found. Creating new entry for ageGroupId:", ageGroup.id, "and skateCategory:", category.name);

                                  setRacesForAgeGroups((prev) => [
                                    ...prev,
                                    {
                                      id: Date.now(), // or use UUID
                                      ageGroupId: ageGroup.id,
                                      skateCategory: category.name,
                                      raceIds: race.id,
                                      minRacesToSelectByPlayerCount: 0,
                                      maxRacesToSelectByPlayerCount: 0,
                                      exactRacesToSelectByPlayerCount: 0,
                                    }
                                  ]);
                                  console.log("Step 7: New entry added to racesForAgeGroups.");
                                }

                              }}
                              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                              disabled={isReadOnly}
                            />
                          </td>
                        ))}
                        <td className="border border-gray-300 px-4 py-2 text-center">
                          <input
                            type="number"
                            // min="1"
                            // max="100"
                            value={
                              (Array.isArray(racesForAgeGroups) ? racesForAgeGroups : []).find(
                                (rm) => rm.ageGroupId === ageGroup.id && rm.skateCategory === category.name
                              )?.exactRacesToSelectByPlayerCount || 1
                            }
                            onChange={(e) => {
                              const value = Number(e.target.value);
                              setRacesForAgeGroups((prev) => {
                                const updated = [...prev];
                                const index = updated.findIndex(
                                  (rm) => rm.ageGroupId === ageGroup.id && rm.skateCategory === category.name
                                );
                                if (index >= 0) {
                                  updated[index].exactRacesToSelectByPlayerCount = value;
                                  updated[index].minRacesToSelectByPlayerCount = value;
                                  updated[index].maxRacesToSelectByPlayerCount = value;
                                }
                                return updated;
                              });
                              setRaceMatrix((prev) =>
                                prev.map((rm) => {
                                  if (rm.ageGroupId === ageGroup.id && rm.category.name === category.name) {
                                    return { ...rm, maxRacesPerPlayer: value };
                                  }
                                  return rm;
                                }
                                ))

                            }}
                            className="w-16 px-2 py-1 border border-gray-300 rounded text-center"
                            readOnly={isReadOnly}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      ),
    },
  ];



  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        modalMode === 'create'
          ? 'Create aNew Event'
          : modalMode === 'edit'
            ? 'Edit Event Details'
            : 'View Event Details'
      }
      size="2xl"
    >
      <div className="space-y-6">
        {(() => {
          // Validation logic for each tab
          const isTabValid = [
            eventData.name &&
            eventData.venue &&
            eventData.eventDate &&
            eventData.regStartingDate &&
            eventData.regEndingDate &&
            eventData.chestNumberPrefix &&
            eventData.ageAsOnDate,
            races.length > 0 && races.every((race) => race.name),
            ageGroups.length > 0 &&
            ageGroups.every(
              (ag: any) => ag.name && ag.startingDate && ag.endingDate
            ),
            ageGroups.every((ag: any) =>
              categories.some((cat) =>
                racesForAgeGroups.some(
                  (rm) =>
                    rm.ageGroupId === ag.id &&
                    rm.skateCategory === cat.name &&
                    rm.raceIds
                )
              )
            ),
          ];

          return (
            <Tabs
              tabs={stepTabs}
              renderFooter={({
                activeTabIndex,
                setActiveTabIndex,
              }: {
                activeTabIndex: number;
                setActiveTabIndex: (index: number) => void;
              }) => {
                const isCurrentTabValid = isTabValid[activeTabIndex];
                return (
                  <div className="flex justify-end space-x-3 pt-4 border-t">
                    <Button variant="secondary" onClick={onClose}>
                      {isReadOnly ? 'Close' : 'Cancel'}
                    </Button>
                    {activeTabIndex > 0 && (
                      <Button
                        variant="secondary"
                        onClick={() => setActiveTabIndex(activeTabIndex - 1)}
                      >
                        Back
                      </Button>
                    )}
                    {activeTabIndex < stepTabs.length - 1 ? (
                      <Button
                        onClick={() => setActiveTabIndex(activeTabIndex + 1)}
                        disabled={!isCurrentTabValid}
                      >
                        Next
                      </Button>
                    ) : (
                      !isReadOnly && (
                        <Button onClick={handleSave} disabled={!isCurrentTabValid}>
                          {modalMode === 'edit' ? 'Update Event' : 'Create Event'}
                        </Button>
                      )
                    )}
                  </div>
                );
              }}
              tabDisabled={(tabIndex: number) =>
                tabIndex === 0
                  ? false
                  : !isReadOnly &&
                  !isTabValid
                    .slice(0, tabIndex)
                    .every((valid) => valid)
              }
              tabButtonProps={(tabIndex: number) => ({
                disabled:
                  tabIndex === 0
                    ? false
                    : !isReadOnly &&
                    !isTabValid
                      .slice(0, tabIndex)
                      .every((valid) => valid),
              })}
            />
          );
        })()}
      </div>
    </Modal>
  );
};


export default CreateEventModal;