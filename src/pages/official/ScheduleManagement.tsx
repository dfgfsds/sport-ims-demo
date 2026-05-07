import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Eye, Clock, Users, Search } from 'lucide-react';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import Badge from '../../components/UI/Badge';
import Table from '../../components/UI/Table';
import Modal from '../../components/UI/Modal';
import FormField from '../../components/UI/FormField';
import { Schedule, Player } from '../../types';
import axios from 'axios';

const ScheduleManagement: React.FC = () => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>();
  const [showModal, setShowModal] = React.useState(false);
  const [modalMode, setModalMode] = React.useState<'create' | 'edit'>('create');
  const [selectedSchedule, setSelectedSchedule] = React.useState<Schedule | null>(null);
  const [eliPlayers, setEliPlayers] = useState<any>([])
  const eventId = localStorage.getItem("eventId");

  const [formData, setFormData] = React.useState({
    raceId: '',
    ageGroupId: '',
    category: 'Beginner' as const,
    gender: '' as const,
    scheduledTime: '',
    heatNumber: '',
    selectedPlayers: [] as string[]
  });

  const fetchEventDetails = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/events/${eventId}`)
      setSelectedEvent(res?.data)
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    fetchEventDetails()
  }, [])

  const fetchSchedules = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/schedules/by-event/${eventId}`);
      setSchedules(res.data);
    } catch (error) {
      console.error("Failed to fetch schedules", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);
  const fetchSchedulesDetails = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();

      if (selectedEvent?.event?.id) {
        queryParams.append('eventId', selectedEvent.event.id);
      }
      if (formData?.raceId) {
        queryParams.append('raceId', formData.raceId);
      }
      if (formData?.ageGroupId) {
        queryParams.append('ageGroupId', formData.ageGroupId);
      }
      if (formData?.category) {
        queryParams.append('skateCategory', formData.category);
      }


      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/schedules/unscheduled-players-from-registration?${queryParams.toString()}`);

      console.log("Fetched unscheduled players:", res.data);
      const selectedGender: string = formData.gender as string;
      const filteredPlayers = selectedGender
        ? res.data.filter((player: any) => player.player.gender?.toLowerCase() === selectedGender.toLowerCase())
        : res.data;
      setEliPlayers(filteredPlayers);
    } catch (error) {
      console.error("Failed to fetch schedules", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedulesDetails();
  }, [selectedEvent?.event?.eventId, formData?.raceId, formData?.ageGroupId, formData?.category, formData?.gender]);

  const [playerSearch, setPlayerSearch] = React.useState('');

  const calculateAge = (dateOfBirth: string) => {
    const today = selectedEvent?.event?.ageAsOn ? new Date(selectedEvent.event.ageAsOn) : new Date();
    const birthDate = new Date(dateOfBirth);
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      return age - 1;
    }
    return age;
  };

  const formatScheduleTime = (datetime: string): string => {
    // Accept "YYYY-MM-DDTHH:MM", "YYYY-MM-DDTHH:MM:SS", or already spaced variants
    if (!datetime) return '';

    const normalized = datetime.replace('T', ' ').trim();
    const [datePart, timePart = '00:00'] = normalized.split(' ');

    // Split & keep only HH and MM
    const [hh = '00', mm = '00'] = timePart.split(':');

    return `${datePart} ${hh}:${mm}`;
  };

  const formatScheduleTimeSeconds = (dt: string): string => {
    if (!dt) return '';

    let s = dt.trim();

    // Replace "T" with space for uniformity
    s = s.replace('T', ' ');

    // Remove fractional seconds (e.g., ".123")
    s = s.replace(/\.\d+/, '');

    // Remove trailing timezone markers like Z or +05:30 / +0530 / -04
    s = s.replace(/([+-]\d{2}:?\d{2}|Z)$/i, '');

    // Collapse multiple spaces just in case
    s = s.replace(/\s+/, ' ');

    const [datePartRaw, timePartRaw = '00:00:00'] = s.split(' ');

    // Ensure valid date (YYYY-MM-DD) by slicing
    const datePart = (datePartRaw || '').slice(0, 10); // safe if longer

    // Extract time components
    const tPieces = timePartRaw.split(':');
    const hh = (tPieces[0] ?? '00').padStart(2, '0');
    const mm = (tPieces[1] ?? '00').padStart(2, '0');
    const ss = (tPieces[2] ?? '00').slice(0, 2).padStart(2, '0');

    return `${datePart} ${hh}:${mm}:${ss}`;
  };


  const handleCreateSchedule = () => {
    setSelectedSchedule(null);
    setModalMode('create');
    setFormData({
      raceId: '',
      ageGroupId: '',
      category: 'Beginner',
      gender: '',
      scheduledTime: '',
      heatNumber: '',
      selectedPlayers: []
    });
    setShowModal(true);
  };

  const handleDownloadAllRegistartionAsPDFRaceWise = async () => {
    if (!eventId) return;
    try {
      // Fetch registration data
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/registrations/search?eventId=${eventId}`,
        { responseType: 'json' }
      );
      const registrations = res.data;

      // Group by Race > AgeGroup > SkateCategory
      const grouped: Record<
        string, // raceId
        Record<
          string, // ageGroupId
          Record<
            string, // skateCategory
            any[]   // registrations
          >
        >
      > = {};

      registrations.forEach((reg: any) => {
        reg.selectedRaces?.forEach((race: any) => {
          const raceId = race.id;
          const raceName = race.name;
          const ageGroupId = reg.ageGroupId;
          const ageGroupName = reg.ageGroup;
          const skateCategory = reg.skateCategory;

          if (!grouped[raceId]) grouped[raceId] = {};
          if (!grouped[raceId][ageGroupId]) grouped[raceId][ageGroupId] = {};
          if (!grouped[raceId][ageGroupId][skateCategory]) grouped[raceId][ageGroupId][skateCategory] = [];

          grouped[raceId][ageGroupId][skateCategory].push({
            ...reg,
            raceId,
            raceName,
            ageGroupId,
            ageGroupName,
            skateCategory
          });
        });
      });

      // Dynamically import jsPDF
      const { jsPDF } = await import('jspdf');
      // Create doc in landscape mode
      const doc = new jsPDF({ orientation: 'landscape' });

      // Helper to draw border on current page
      const drawBorder = () => {
        doc.setLineWidth(0.5);
        doc.rect(5, 5, doc.internal.pageSize.getWidth() - 10, doc.internal.pageSize.getHeight() - 10);
      };

      doc.setFontSize(16);
      doc.text(`${registrations[0]?.event?.name}`, 10, 15);
      drawBorder();

      let y = 25;
      Object.entries(grouped).forEach(([raceId, ageGroups]) => {
        Object.entries(ageGroups).forEach(([ageGroupId, categories]) => {
          Object.entries(categories).forEach(([skateCategory, regs]) => {
            if (y !== 25) {
              doc.addPage();
              drawBorder();
              y = 25;
            }

            doc.setFontSize(12);
            doc.text(`Race: ${regs[0]?.raceName || ''} | Age Group: ${regs[0]?.ageGroupName || ''} | Category: ${skateCategory}`, 10, y);
            y += 7;

            doc.setFontSize(11);
            doc.text('No.', 12, y);
            doc.text('Player Name', 35, y);
            doc.text('Player ID', 90, y);
            doc.text('Club', 140, y);
            y += 2;
            doc.setLineWidth(0.1);
            doc.line(10, y, 285, y);
            y += 6;

            regs.forEach((reg: any, idx: number) => {
              doc.text(String(idx + 1), 12, y);
              doc.text(reg.player?.name || '', 35, y);
              doc.text(reg.playerId || '', 90, y);
              doc.text(reg.clubName || '', 140, y);
              y += 6;
              if (y > 190) {
                doc.addPage();
                drawBorder();
                y = 15;
              }
            });
            y += 5;
          });
        });
      });

      doc.save(`event_${eventId}_registrations_racewise.pdf`);
    } catch (error) {
      console.error('Failed to download registrations PDF', error);
    }
  };

  // Download registrations as Excel (race-wise)
  const handleDownloadAllRegistrationAsExcelRaceWise2 = async () => {
    if (!eventId) return;
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/registrations/search?eventId=${eventId}`,
        { responseType: 'json' }
      );
      const registrations = res.data;

      // Group by Race > AgeGroup > SkateCategory
      const rows: any[] = [];
      registrations.forEach((reg: any) => {
        reg.selectedRaces?.forEach((race: any) => {
          rows.push({
            Event: reg.event?.name || '',
            Race: race.name,
            AgeGroup: reg.ageGroup,
            Category: reg.skateCategory,
            PlayerName: reg.player?.name || '',
            PlayerID: reg.playerId || '',
            Club: reg.clubName || '',
            District: reg.district || '',
            DOB: reg.dob || '',
          });
        });
      });

      // Dynamically import xlsx
      const XLSX = await import('xlsx');
      const ws = XLSX.utils.json_to_sheet(rows);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Registrations');

      // Download
      XLSX.writeFile(wb, `event_${eventId}_registrations_racewise.xlsx`);
    } catch (error) {
      console.error('Failed to download registrations Excel', error);
    }
  };

  
    const handleDownloadAllRegistrationAsExcelRaceWise = async () => {
      if (!eventId) return;
      try {
      // Fetch registrations
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/registrations/search?eventId=${eventId}`,
        { responseType: 'json' }
      );
      const registrations = res.data;

      // Get all unique races (id & name)
      const allRacesMap: Record<string, string> = {};
      registrations.forEach((reg: any) => {
        reg.selectedRaces?.forEach((race: any) => {
        allRacesMap[race.id] = race.name;
        });
      });
      const allRaces = Object.entries(allRacesMap).map(([id, name]) => ({ id: Number(id), name: name.toUpperCase() }));

      // Group by skateCategory > ageGroup > gender
      const grouped: Record<
        string, // skateCategory
        Record<
        string, // ageGroup
        Record<
          string, // gender
          any[]   // registrations
        >
        >
      > = {};

      registrations.forEach((reg: any) => {
        const skateCategory = (reg.skateCategory || 'Unknown').toString().toUpperCase();
        const ageGroup = (reg.ageGroup || 'Unknown').toString().toUpperCase();
        const gender = (reg.player?.gender || 'Unknown').toString().toUpperCase();

        if (!grouped[skateCategory]) grouped[skateCategory] = {};
        if (!grouped[skateCategory][ageGroup]) grouped[skateCategory][ageGroup] = {};
        if (!grouped[skateCategory][ageGroup][gender]) grouped[skateCategory][ageGroup][gender] = [];
        grouped[skateCategory][ageGroup][gender].push(reg);
      });

      // Prepare rows for Excel
      const rows: any[] = [];
      const XLSX = await import('xlsx');

      // Add centered event info at the top
      const eventName = (registrations[0]?.event?.name ?? '').toUpperCase();
      const venue = (registrations[0]?.event?.venue ?? '').toUpperCase();
      const eventDate = registrations[0]?.event?.eventDate ?? '';
      rows.push({ 'CHEST NO': eventName });
      rows.push({ 'CHEST NO': `VENUE: ${venue}    DATE: ${eventDate ? new Date(eventDate).toLocaleDateString(undefined, { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase() : ''}` });
      rows.push({}); // Empty row for spacing

      Object.entries(grouped).forEach(([skateCategory, ageGroups]) => {
        Object.entries(ageGroups).forEach(([ageGroup, genders]) => {
        Object.entries(genders).forEach(([gender, regs]) => {
          // Section header row (merged)
          rows.push({
          'CHEST NO': `${skateCategory} -  ${ageGroup} - ${gender}`,
          });

          // Table header row
          const header: any = {
          'PLAYER NAME': 'PLAYER NAME',
          'CHEST NO': 'CHEST NO',
          'DATE OF BIRTH': 'DATE OF BIRTH',
          'AGE': 'AGE',
          'AGE GROUP': 'AGE GROUP',
          'GENDER': 'GENDER',
          'SKATE CATEGORY': 'SKATE CATEGORY',
          'CLUB NAME': 'CLUB NAME',
          'DISTRICT': 'DISTRICT',
          'STATE': 'STATE',
          };
          allRaces.forEach(race => {
          header[race.name] = race.name;
          });
          rows.push(header);

          // Player rows
          regs.forEach((reg: any) => {
          const row: any = {};
          // Ensure all columns are present in correct order
          row['PLAYER NAME'] = (reg.player?.name ?? reg.playerName ?? '').toUpperCase();
          row['CHEST NO'] = (reg.chestNumber ?? reg.player?.chestNumber ?? '').toString().toUpperCase();
          row['DATE OF BIRTH'] = reg.player?.dob ? new Date(reg.player.dob).toLocaleDateString().toUpperCase() : '';
          row['GENDER'] = (reg.player?.gender ?? '').toUpperCase();
          row['AGE'] = reg.player?.dob ? calculateAge(reg.player.dob).toString().toUpperCase() : '';

          row['AGE GROUP'] = (reg.ageGroup ?? reg.player?.ageGroupName ?? '').toUpperCase();
          row['SKATE CATEGORY'] = (reg.skateCategory ?? reg.player?.skateCategory ?? '').toUpperCase();
          row['CLUB NAME'] = (reg.clubName ?? reg.player?.clubName ?? '').toUpperCase();
          row['DISTRICT'] = (reg.district ?? reg.player?.districtName ?? '').toUpperCase();
          row['STATE'] = (reg.state ?? reg.player?.stateName ?? '').toUpperCase();
          allRaces.forEach(race => {
            // If player participated in this race
            const participated =
            (reg.selectedRacesIds?.includes?.(race.id)) ||
            (reg.selectedRaces?.some?.((r: any) => r.id === race.id));
            row[race.name] = participated ? '✔' : '✗';
          });
          rows.push(row);
          });

          // Empty row after each group
          rows.push({});
        });
        });
      });

      // Convert to worksheet
      const ws = XLSX.utils.json_to_sheet(rows, { skipHeader: true });

      // Merge and style event info rows
      const totalCols = 7 + allRaces.length;
      ws['!merges'] = ws['!merges'] || [];
      ws['!merges'].push({
        s: { r: 0, c: 0 },
        e: { r: 0, c: totalCols - 1 }
      });
      ws['!merges'].push({
        s: { r: 1, c: 0 },
        e: { r: 1, c: totalCols - 1 }
      });
      ws[XLSX.utils.encode_cell({ r: 0, c: 0 })].s = {
        font: { bold: true, sz: 16 },
        alignment: { horizontal: 'center', vertical: 'center' }
      };
      const cellAddr1 = XLSX.utils.encode_cell({ r: 1, c: 0 });
      if (!ws[cellAddr1]) ws[cellAddr1] = { t: 's', v: rows[1]['CHEST NO'] ?? '' };
      ws[cellAddr1].s = {
        font: { italic: true, sz: 12 },
        alignment: { horizontal: 'center', vertical: 'center' }
      };

      // Style: color cells for races
      // Find header rows and player rows
      let rowIdx = 3; // Start after event info rows
      rows.slice(3).forEach((row, i) => {
        if (row.__MERGE) {
        // Merge all columns for section header
        const colCount = 5 + allRaces.length;
        const range = XLSX.utils.encode_range({
          s: { r: rowIdx, c: 0 },
          e: { r: rowIdx, c: colCount - 1 }
        });
        if (!ws['!merges']) ws['!merges'] = [];
        ws['!merges'].push(XLSX.utils.decode_range(range));
        ws[XLSX.utils.encode_cell({ r: rowIdx, c: 0 })].s = {
          font: { bold: true, sz: 14 },
          alignment: { horizontal: 'center' }
        };
        rowIdx++;
        } else if (Object.keys(row).length === 0) {
        rowIdx++;
        } else if (row['CHEST NO'] === 'CHEST NO') {
        // Table header
        Object.keys(row).forEach((_, colIdx) => {
          const cellAddress = XLSX.utils.encode_cell({ r: rowIdx, c: colIdx });
          if (!ws[cellAddress]) ws[cellAddress] = { t: 's', v: row[_] ?? '' };
          ws[cellAddress].s = {
          font: { bold: true },
          fill: { fgColor: { rgb: 'D9E1F2' } }
          };
        });
        rowIdx++;
        } else if (row['CHEST NO']) {
        // Player row
        Object.keys(row).forEach((k, colIdx) => {
          if (allRaces.some(race => race.name === k)) {
          const val = row[k];
          ws[XLSX.utils.encode_cell({ r: rowIdx, c: colIdx })].s = {
            fill: {
            fgColor: { rgb: val === '✔' ? 'C6EFCE' : 'FFC7CE' }
            },
            font: {
            color: { rgb: val === '✔' ? '006100' : '9C0006' },
            bold: true
            },
            alignment: { horizontal: 'center' }
          };
          }
        });
        rowIdx++;
        } else {
        rowIdx++;
        }
      });

      // Set column widths
      ws['!cols'] = [
        { wch: 10 }, // CHEST NO
        { wch: 20 }, // PLAYER NAME
        { wch: 25 }, // CLUB NAME
        { wch: 15 }, // DISTRICT
        { wch: 15 }, // STATE
        ...allRaces.map(() => ({ wch: 12 }))
      ];

      // Create workbook and save
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'GROUPED REGISTRATIONS');
      XLSX.writeFile(wb, `EVENT_${eventId}_REGISTRATIONS_GROUPED.XLSX`);
      } catch (error) {
      console.error('Failed to download grouped registrations Excel', error);
      }
    };

    
    const handleDownloadSchedules = async () => {
      if (!eventId) return;
      try {
      // Fetch grouped schedules data
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/schedules/participations/grouped/${eventId}`,
        { responseType: 'json' }
      );

      // Dynamically import jsPDF
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF();

      // Title
      doc.setFontSize(16);
      doc.text(`Schedules for Event ${eventId}`, 10, 15);

      let y = 25;
      // Support both array and object grouping
      const groups = Array.isArray(res.data)
        ? res.data
        : Object.values(res.data).flatMap((cat: any) =>
          Object.values(cat).flatMap((age: any) =>
          Object.values(age)
          )
        );

      groups.forEach((group: any, idx: number) => {
        doc.setFontSize(12);
        doc.text(`Race: ${group.raceName || group.race || ''}`, 10, y);
        y += 7;
        doc.text(`Age Group: ${group.ageGroupName || group.ageGroup || ''}`, 10, y);
        y += 7;
        doc.text(`Category: ${group.skateCategory || group.category || ''}`, 10, y);
        y += 7;
        doc.text(`Schedule Time: ${group.scheduleTime || ''}`, 10, y);
        y += 7;
        doc.text(`Players:`, 10, y);
        y += 7;

        if (Array.isArray(group.participations)) {
        group.participations.forEach((p: any) => {
          doc.text(
          `- ${p.player?.name || p.playerName || ''} (${p.eventRegistartion?.clubName || p.clubName || ''})`,
          15,
          y
          );
          y += 6;
          if (y > 270) {
          doc.addPage();
          y = 15;
          }
        });
        }
        y += 5;
        if (y > 270 && idx < groups.length - 1) {
        doc.addPage();
        y = 15;
        }
      });

      doc.save(`schedules_${eventId}.pdf`);
      } catch (error) {
      console.error('Failed to download schedules PDF', error);
      }
    };

  const toDatetimeLocal = (iso?: string) => {
    if (!iso) return '';
    const d = new Date(iso);
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };
  const handleEditSchedule = (schedule: any) => {
    setSelectedSchedule(schedule);
    setModalMode('edit');

    // Some APIs nest things; fallbacks added
    const raceId = schedule.raceId ?? schedule.race?.id ?? '';
    const ageGroupId = schedule.ageGroupId ?? schedule.ageGroup?.id ?? '';
    const skateCategory = schedule.skateCategory ?? schedule.category ?? 'Beginner';
    const gender = schedule.gender ?? '';
    const scheduleIso = schedule.scheduleTime ?? schedule.scheduledTime ?? '';
    const heatNumber = schedule.heatNumber ?? '';

    setFormData({
      raceId,
      ageGroupId,
      category: skateCategory,
      gender,
      scheduledTime: toDatetimeLocal(scheduleIso), // <-- proper datetime-local string
      heatNumber,
      selectedPlayers: schedule.participants?.map((p: any) => p.playerId) ?? [],
    });

    setShowModal(true);
  };

  const handleDeleteSchedule = (scheduleId: string) => {
    if (confirm('Are you sure you want to delete this schedule?')) {

      //TODO CALL DELETE API
      axios.delete(`${import.meta.env.VITE_API_BASE_URL}/schedules/${scheduleId}`)
        .then(() => {
          console.log("Schedule deleted successfully");
          fetchSchedules(); // Refresh list after deletion
        })
        .catch(error => {
          console.error("Failed to delete schedule", error);
        });
      // setSchedules(prev => prev.filter(s => s.id !== scheduleId));
    }
  };
  // const formatScheduleTime = (datetime: string): string => {
  //   return datetime.replace('T', ' ');
  // };
  const handleSaveSchedule = async () => {
    const scheduleTimeMinutes = formatScheduleTime(formData.scheduledTime); // your minutes-only fn
    const scheduleTimeSeconds = formatScheduleTimeSeconds(formData.scheduledTime); // full seconds
    const payload = {
      scheduleTime:
        modalMode === 'create'
          ? scheduleTimeMinutes          // create API wants "YYYY-MM-DD HH:MM"
          : scheduleTimeSeconds,
      raceId: formData?.raceId,
      ageGroupId: formData?.ageGroupId,
      skateCategory: formData?.category,
      gender: formData?.gender,
      playerIds: formData?.selectedPlayers,
      eventId: eventId
    };


    try {
      if (modalMode === 'create') {
        await axios.post(`${import.meta.env.VITE_API_BASE_URL}/schedules/`, payload);
        console.log(payload, "payload");

      } else if (modalMode === 'edit' && selectedSchedule) {
        await axios.put(`${import.meta.env.VITE_API_BASE_URL}/schedules/${selectedSchedule.id}`, payload);
      }

      fetchSchedules(); // Refresh list
      setShowModal(false);
    } catch (error) {
      console.error("Failed to save schedule", error);
    }
  };

  const togglePlayerSelection = (playerId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedPlayers: prev.selectedPlayers.includes(playerId)
        ? prev.selectedPlayers.filter(id => id !== playerId)
        : [...prev.selectedPlayers, playerId]
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'info';
      case 'completed': return 'success';
      case 'not_started': return 'warning';
      default: return 'default';
    }
  };

  const columns = [
    { key: 'raceName', label: 'Race Name', sortable: true },
    { key: 'ageGroupName', label: 'Age Group', sortable: true },
    {
      key: 'skateCategory',
      label: 'Category',
      sortable: true,
      render: (value: string) => (
        <Badge variant="default" size="sm">
          {value?.charAt(0)?.toUpperCase() + value?.slice(1)}
        </Badge>
      )
    },
    {
      key: 'scheduleTime',
      label: 'Schedule Time',
      render: (value: string) => new Date(value).toLocaleString()
    },
    {
      key: 'participants',
      label: 'Players',
      render: (value: any[]) => value?.length
    },
    {
      key: 'resultsEntered',
      label: 'Status',
      render: (value: boolean) => (
        <Badge variant={value ? 'success' : 'warning'} size="sm">
          {value ? 'Completed' : 'Scheduled'}
        </Badge>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (value: any, schedule: Schedule) => (
        <div className="flex items-center space-x-2">
          {/* <Button size="sm" variant="secondary" title="View Details">
            <Eye size={16} />
          </Button> */}
          <Button size="sm" variant="primary" onClick={() => handleEditSchedule(schedule)} title="Edit Schedule">
            <Edit size={16} />
          </Button>
          <Button size="sm" variant="danger" onClick={() => handleDeleteSchedule(schedule.id)} title="Delete Schedule">
            <Trash2 size={16} />
          </Button>
        </div>
      )
    }
  ];


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Schedule Management</h1>
          <p className="text-gray-600 mt-1">Create and manage race schedules for {selectedEvent?.name}</p>
        </div>
        <Button variant="secondary" onClick={handleDownloadAllRegistartionAsPDFRaceWise}>
          <Plus size={16} className="mr-2" />
          Download All Schedules
        </Button>
        <Button variant="secondary" onClick={handleDownloadAllRegistrationAsExcelRaceWise}>
          <Plus size={16} className="mr-2" />
          Download All Schedules (Excel)
        </Button>
        <Button variant="primary" onClick={handleCreateSchedule}>
          <Plus size={16} className="mr-2" />
          Add New Schedule
        </Button>
      </div>

      {/* Event Info */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="font-medium">Event:</span> {selectedEvent?.event?.name}
          </div>
          <div>
            <span className="font-medium">Venue:</span> {selectedEvent?.event?.venue}
          </div>
          <div>
            <span className="font-medium">Date:</span> {selectedEvent?.event?.eventDate}
          </div>
          <div>
            <span className="font-medium">Total Schedules:</span> {schedules?.length}
          </div>
        </div>
      </Card>

      {/* Schedules Table */}
      <Card>
        {loading ? <p>Loading schedules...</p> : (
          <Table
            columns={columns}
            data={schedules}
            searchable
            searchPlaceholder="Search schedules..."
          />
        )}
      </Card>

      {/* Create/Edit Schedule Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={`${modalMode === 'create' ? 'Create New' : 'Edit'} Schedule`}
        size="2xl"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Select Race" required>
              <select
                value={formData.raceId}
                onChange={(e) => setFormData({ ...formData, raceId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select a race</option>
                {selectedEvent?.races?.map((race: any) => (
                  <option key={race?.id} value={race?.id}>{race?.name}</option>
                ))}
              </select>
            </FormField>

            <FormField label="Select Age Group" required>
              <select
                value={formData.ageGroupId}
                onChange={(e) => setFormData({ ...formData, ageGroupId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select age group</option>
                {selectedEvent?.ageGroups?.map((ageGroup: any) => (
                  <option key={ageGroup?.id} value={ageGroup?.id}>{ageGroup?.ageGroupName}</option>
                ))}
              </select>
            </FormField>

            <FormField label="Category" required>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="Beginner">Beginner</option>
                <option value="Fancy">Fancy</option>
                <option value="Inline">Inline</option>
                <option value="Quad">Quad</option>
              </select>
            </FormField>

            <FormField label="Gender" required>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                {/* <option value="other">Other</option> */}
              </select>
            </FormField>

            <FormField label="Schedule Date & Time" required>
              <input
                type="datetime-local"
                value={formData.scheduledTime}
                onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </FormField>

          </div>

          {formData.raceId && formData.ageGroupId && formData.category && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Select Players</h3>
                <Badge variant="info">
                  {formData.selectedPlayers.length} selected
                </Badge>
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search players..."
                  value={playerSearch}
                  onChange={(e) => setPlayerSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>




                <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg">
                {eliPlayers?.length > 0 ? (
                  <>
                  <div className="flex items-center p-3 border-b border-gray-200 bg-gray-50">
                    <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      ref={input => {
                        if (input) {
                          input.indeterminate =
                            formData.selectedPlayers.length > 0 &&
                            formData.selectedPlayers.length < eliPlayers.length;
                        }
                      }}
                      checked={
                        eliPlayers.length > 0 &&
                        eliPlayers.every((player: any) =>
                          formData.selectedPlayers.includes(player.playerId)
                        )
                      }
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData((prev) => ({
                            ...prev,
                            selectedPlayers: eliPlayers.map((p: any) => p.playerId),
                          }));
                        } else {
                          setFormData((prev) => ({
                            ...prev,
                            selectedPlayers: [],
                          }));
                        }
                      }}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="font-medium text-gray-700">Select All</span>
                    </label>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {eliPlayers?.map((player: any) => (
                    <div key={player?.id} className="p-3 hover:bg-gray-50">
                      <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.selectedPlayers.includes(player.playerId)}
                        onChange={() => togglePlayerSelection(player.playerId)}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">{player.player.name}</p>
                          <p className="text-sm text-gray-500">{player.clubName}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant="info" size="sm">
                          Age {calculateAge(player.dob)}
                          </Badge>
                          <p className="text-sm text-gray-500 mt-1">{player.district}</p>
                        </div>
                        </div>
                      </div>
                      </label>
                    </div>
                    ))}
                  </div>
                  </>
                ) : (
                  <div className="p-8 text-center text-gray-500">
                  No eligible players found for the selected criteria
                  </div>
                )}
                </div>






            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveSchedule}
              disabled={!formData.raceId || !formData.ageGroupId || !formData.category || formData.selectedPlayers.length === 0}
            >
              {modalMode === 'create' ? 'Create Schedule' : 'Update Schedule'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ScheduleManagement;