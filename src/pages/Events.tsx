import React, { useEffect, useState } from 'react';
import { Plus, Calendar, MapPin, Users, Edit, Trash2, Eye, Clock, Trophy, UserPlus } from 'lucide-react';
import Button from '../components/UI/Button';
import Card from '../components/UI/Card';
import Badge from '../components/UI/Badge';
import Table from '../components/UI/Table';
import CreateEventModal from '../components/Events/CreateEventModal';
import ScheduleModal from '../components/Events/ScheduleModal';
import ResultsModal from '../components/Events/ResultsModal';
import { mockSchedules } from '../data/mockData';
import { Event, Schedule } from '../types';
import axios from 'axios';
import { exportToExcel } from '../ExportToExcel/ExportToExcel';
import EditEventModal from '../components/Events/EditEventModal';

const Events: React.FC = () => {
  const baseURL = import.meta.env.VITE_API_BASE_URL;
  const [events, setEvents] = React.useState<Event[]>([]);
  const [schedules, setSchedules] = React.useState<Schedule[]>(mockSchedules);
  const [selectedEvent, setSelectedEvent] = React.useState<Partial<Event> | null>(null);
  const [selectedSchedule, setSelectedSchedule] = React.useState<Schedule | null>(null);
  const [showCreateModal, setShowCreateModal] = React.useState(false);
  const [showScheduleModal, setShowScheduleModal] = React.useState(false);
  const [showResultsModal, setShowResultsModal] = React.useState(false);
  const [activeView, setActiveView] = React.useState<'events' | 'schedules' | 'results'>('events');
  const [modalMode, setModalMode] = React.useState<'create' | 'view' | 'edit'>('create');
  const [allEvents, setAllEvents] = useState<any[]>([]);


  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'info';
      case 'ongoing': return 'warning';
      case 'completed': return 'success';
      default: return 'default';
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${baseURL}/events/`);
      setEvents(response.data);
      setAllEvents(response.data);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    }
  };


  const handleViewEvent = (event: Event) => {
    setSelectedEvent(event);
    setModalMode('view');
    setShowCreateModal(true);
  };

  const handleOpenCreateModal = () => {
    setSelectedEvent(null);
    setModalMode('create');
    setShowCreateModal(true);
  };

  const handleEditEvent = (event: Event) => {
    setSelectedEvent(event);
    setModalMode('edit');
    setShowCreateModal(true);
  };

  const handleCreateEvent = (eventData: Partial<Event>) => {
    const newEvent: Event = {
      id: `E${Date.now()}`,
      ...eventData,
      totalParticipants: 0,
      registrationCount: 0,
      status: 'upcoming',
      createdAt: new Date().toISOString(),
    } as Event;

    setEvents([...events, newEvent]);
    setShowCreateModal(false);
  };

  const handleCreateSchedule = (scheduleData: Partial<Schedule>) => {
    const newSchedule: Schedule = {
      id: `S${Date.now()}`,
      ...scheduleData,
    } as Schedule;

    setSchedules([...schedules, newSchedule]);
    setShowScheduleModal(false);
    setSelectedEvent(null);
  };

  const handleUpdateResults = (updatedSchedule: Schedule) => {
    setSchedules(prev => prev.map(s => s.id === updatedSchedule.id ? updatedSchedule : s));
    setShowResultsModal(false);
    setSelectedSchedule(null);
  };

  const handleDelete = async (eventId: any) => {

    // Show confirmation modal before deleting
    if (window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      try {
        await axios.delete(`${baseURL}/events/${eventId?.id}`);
        fetchEvents();
      } catch (error) {
        console.error('Failed to delete event:', error);
      }
    }
  };


  const eventsColumns = [
    {
      key: 'eventDate',
      label: 'Event Date',
      sortable: true,
      render: (value: string, event: any) => (
        <div>
          <div>
            {new Date(event.eventDate).toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            }).replace(/ /g, ' ')}
          </div>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (_: string, event: any) => {
        // Determine status based on startingDate (or eventDate fallback)
        const now = new Date();
        const startDate = event.startingDate ? new Date(event.startingDate) : new Date(event.eventDate);
        startDate.setHours(0, 0, 0, 0);
        now.setHours(0, 0, 0, 0);

        let status: string;
        if (startDate > now) {
          status = 'upcoming';
        } else if (
          startDate.getFullYear() === now.getFullYear() &&
          startDate.getMonth() === now.getMonth() &&
          startDate.getDate() === now.getDate()
        ) {
          status = 'ongoing';
        } else {
          status = 'completed';
        }

        return (
          <Badge variant={getStatusColor(status)} size="sm">
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        );
      },
    },
    { key: 'name', label: 'Event Name', sortable: true },
    { key: 'venue', label: 'Location / Venue', sortable: true },
    { key: 'eventFee', label: 'Event Fee', sortable: true },

    { key: 'registrationCount', label: 'Total Participants', sortable: true },

    {
      key: 'actions',
      label: 'Actions',
      render: (value: any, event: any) => (
        <div className="flex items-center space-x-2">
          <Button size="sm" variant="secondary" title="View Details" onClick={() => handleViewEvent(event)}>
            <Eye size={16} />
          </Button>
          <Button size="sm" variant="primary" title="Edit Event" onClick={() => handleEditEvent(event)}>
            <Edit size={16} />
          </Button>
          {/* <Button
            size="sm"
            variant="success"
            title="Manage Races"
            onClick={() => {
              setSelectedEvent(event);
              setShowScheduleModal(true);
            }}
          >
            <UserPlus size={16} />
          </Button> */}
          {/* <Button size="sm" variant="warning" title="View Results">
            <Trophy size={16} />
          </Button> */}
          <Button onClick={() => handleDelete(event)} size="sm" variant="danger" title="Delete Event">
            <Trash2 size={16} />
          </Button>
        </div>
      ),
    },
  ];

  const schedulesColumns = [
    { key: 'raceName', label: 'Race Name', sortable: true },
    { key: 'ageGroupName', label: 'Age Group', sortable: true },
    {
      key: 'category',
      label: 'Category',
      sortable: true,
      render: (value: string) => (
        <Badge variant="default" size="sm">
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </Badge>
      ),
    },
    {
      key: 'scheduledTime',
      label: 'Scheduled Time',
      render: (value: string) => new Date(value).toLocaleString(),
    },
    {
      key: 'registrationCount',
      label: 'Participants',
      render: (value: any[]) => value?.length,
    },
    {
      key: 'resultsEntered',
      label: 'Results',
      render: (value: boolean) => (
        <Badge variant={value ? 'success' : 'warning'} size="sm">
          {value ? 'Entered' : 'Pending'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (value: any, schedule: Schedule) => (
        <div className="flex items-center space-x-2">
          <Button
            size="sm"
            variant="primary"
            title="Enter Results"
            onClick={() => {
              setSelectedSchedule(schedule);
              setShowResultsModal(true);
            }}
          >
            <Trophy size={16} />
          </Button>
          <Button size="sm" variant="secondary" title="Reschedule">
            <Clock size={16} />
          </Button>
          <Button size="sm" variant="danger" title="Remove">
            <Trash2 size={16} />
          </Button>
        </div>
      ),
    },
  ];

  const today = new Date();
  today.setHours(0, 0, 0, 0); // remove time for accurate comparison

  const upcomingEvents = events.filter((e: any) => {
    const eventDate = new Date(e.eventDate);
    return eventDate > today;
  });

  const ongoingEvents = events.filter((e: any) => {
    const eventDate = new Date(e.eventDate);
    return (
      eventDate.getFullYear() === today.getFullYear() &&
      eventDate.getMonth() === today.getMonth() &&
      eventDate.getDate() === today.getDate()
    );
  });

  const completedEvents = events.filter((e: any) => {
    const eventDate = new Date(e.eventDate);
    return eventDate < today;
  });
  const handleSearch = (query: string) => {
    if (!query.trim()) {
      // If query is empty, show all
      setEvents(allEvents);
      return;
    }

    const filtered = allEvents.filter((event: any) =>
      event?.name?.toLowerCase().includes(query.toLowerCase()) ||
      event?.venue?.toLowerCase().includes(query.toLowerCase()) ||
      event?.eventFee?.toString().includes(query)
    );

    setEvents(filtered);
  };

  const renderEventsView = () => (
    <div className="space-y-6">
      <div className='flex justify-end'>
        <Button variant="secondary" onClick={() => exportToExcel(allEvents, 'event_list')}>
          Export to Excel
        </Button>
      </div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Events Management</h1>
          <p className="text-gray-600 mt-1">Manage sports events and competitions</p>
        </div>
        <Button variant="primary" onClick={handleOpenCreateModal}>
          <Plus size={16} className="mr-2" />
          Create New Event
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Calendar className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Upcoming Events</p>
              <p className="text-2xl font-bold text-gray-900">{upcomingEvents.length}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Users className="text-yellow-600" size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Ongoing Events</p>
              <p className="text-2xl font-bold text-gray-900">{ongoingEvents.length}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <MapPin className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Completed Events</p>
              <p className="text-2xl font-bold text-gray-900">{completedEvents.length}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Events Table */}
      <Card>
        <Table
          columns={eventsColumns}
          data={events}
          searchable
          searchPlaceholder="Search events..."
        // onSearch={handleSearch}
        />
      </Card>
    </div>
  );

  const renderSchedulesView = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Race Schedules</h1>
          <p className="text-gray-600 mt-1">View and manage all race schedules</p>
        </div>
      </div>

      <Card>
        <Table
          columns={schedulesColumns}
          data={schedules}
          searchable
          searchPlaceholder="Search schedules..."
        />
      </Card>
    </div>
  );

  const renderResultsView = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Event Results</h1>
          <p className="text-gray-600 mt-1">View participant results and rankings</p>
        </div>
      </div>

      <Card>
        <div className="p-8 text-center text-gray-500">
          Results view coming soon...
        </div>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Navigation Tabs */}
      {/* <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveView('events')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${activeView === 'events'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
          >
            All Events
          </button>
          <button
            onClick={() => setActiveView('schedules')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${activeView === 'schedules'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
          >
            Race Schedules
          </button>
          <button
            onClick={() => setActiveView('results')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${activeView === 'results'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
          >
            Results & Rankings
          </button>
        </nav>
      </div> */}

      {/* Content based on active view */}
      {activeView === 'events' && renderEventsView()}
      {activeView === 'schedules' && renderSchedulesView()}
      {activeView === 'results' && renderResultsView()}

      {/* Modals */}
      {modalMode !== 'edit' && (
        <CreateEventModal
          isOpen={showCreateModal}
          onClose={() => {
            setShowCreateModal(false);
            setSelectedEvent(null);
            setModalMode('create');
          }}
          onSave={handleCreateEvent}
          onUpdate={fetchEvents} // 👈 New for editing
          modalMode={modalMode}
          initialEvent={selectedEvent}
        />)}

      {modalMode === 'edit' && (
        <EditEventModal
          isOpen={showCreateModal}
          onClose={() => {
            setShowCreateModal(false);
            setSelectedEvent(null);
            setModalMode('edit');
          }}
          onSave={handleCreateEvent}
          onUpdate={fetchEvents} // 👈 New for editing
          modalMode={modalMode}
          initialEvent={selectedEvent}
        />)}

      {selectedEvent && (
        <ScheduleModal
          isOpen={showScheduleModal}
          onClose={() => {
            setShowScheduleModal(false);
            setSelectedEvent(null);
          }}
          event={selectedEvent as Event}
          onSave={handleCreateSchedule}
        />
      )}

      {selectedSchedule && (
        <ResultsModal
          isOpen={showResultsModal}
          onClose={() => {
            setShowResultsModal(false);
            setSelectedSchedule(null);
          }}
          schedule={selectedSchedule}
          onSave={handleUpdateResults}
        />
      )}
    </div>
  );
};

export default Events;