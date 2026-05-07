import React, { useEffect, useState } from 'react';
import Table from '../../components/UI/Table';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import Modal from '../../components/UI/Modal';
import { Eye } from 'lucide-react';
import { mockEvents, mockParticipants } from '../../data/mockData';
import { Event, Participant } from '../../types';
import Badge from '../../components/UI/Badge';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const EventParticipation: React.FC = () => {
    const baseURL = import.meta.env.VITE_API_BASE_URL;
    const navigate = useNavigate();
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [search, setSearch] = useState('');
    const [sortKey, setSortKey] = useState('');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

    const handleSearch = (query: string) => {
        setSearch(query);
    };

    const handleSort = (key: string) => {
        let order: 'asc' | 'desc' = 'asc';
        if (sortKey === key && sortOrder === 'asc') {
            order = 'desc';
        }
        setSortKey(key);
        setSortOrder(order);
    };

    // Define the allowed keys for sorting
    type EventSortableKeys = 'id' | 'name' | 'venue' | 'startDate' | 'endDate' | 'totalParticipants';
    const [events, setEvents] = useState<Event[]>([]);

    useEffect(() => {
        axios.get(`${baseURL}/events/`)
            .then(res => setEvents(res.data))
            .catch(err => console.error(err));
    }, []);
    const getFilteredAndSortedEvents = () => {
        let filtered = events;

        if (search) {
            filtered = filtered.filter(
                (ev) =>
                    ev?.name?.toLowerCase().includes(search.toLowerCase()) ||
                    ev?.venue?.toLowerCase().includes(search.toLowerCase())
            );
        }

        if (sortKey) {
            filtered = [...filtered].sort((a, b) => {
                const key = sortKey as EventSortableKeys;
                const valA = a[key];
                const valB = b[key];
                if (valA === valB) return 0;
                return sortOrder === 'asc'
                    ? valA > valB
                        ? 1
                        : -1
                    : valA < valB
                        ? 1
                        : -1;
            });
        }

        return filtered;
    };

    const columns = [
        { key: 'id', label: 'Event ID', sortable: true },
        { key: 'name', label: 'Event Name', sortable: true },
        { key: 'venue', label: 'Venue', sortable: true },
        { key: 'eventDate', label: 'Event Date', sortable: true },
        {
            key: 'status',
            label: 'Status',
            render: (_: any, event: any) => {
                const today = new Date();
                const eventDate = new Date(event.eventDate);

                let status = '';
                let variant: 'success' | 'danger' | 'default' = 'default';

                // Remove time portion for accurate comparison
                const todayOnly = new Date(today.toDateString());
                const eventOnly = new Date(eventDate.toDateString());

                if (eventOnly.getTime() < todayOnly.getTime()) {
                    status = 'Completed';
                    variant = 'success';
                } else if (eventOnly.getTime() === todayOnly.getTime()) {
                    status = 'Ongoing';
                    variant = 'danger';
                } else {
                    status = 'Upcoming';
                    variant = 'default';
                }

                return <Badge variant={variant}>{status}</Badge>;
            },
        }
        ,
        {
            key: 'registrationCount',
            label: 'Participants',
            sortable: true,
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (_: any, ev: Event) => (
                <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => navigate(`/eventsDetails/event-participation/${ev.id}`)}
                >
                    <Eye size={16} />
                </Button>
            ),
        },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Events Participants</h1>
                <p className="text-gray-600">Click View to see participants</p>
            </div>

            <Card>
                <Table
                    columns={columns}
                    data={getFilteredAndSortedEvents()}
                    searchable
                    searchPlaceholder="Search events..."
                    // onSearch={handleSearch}
                    sortBy={sortKey}
                    sortOrder={sortOrder}
                    onSort={handleSort}
                />
            </Card>

            {selectedEvent && (
                <Modal
                    title={`Participants for ${selectedEvent.name}`}
                    isOpen={showModal}
                    onClose={() => setShowModal(false)}
                >
                    <div className="space-y-2">
                        {participants.length === 0 && <p>No participants yet.</p>}
                        {participants.map((p) => (
                            <div key={p.id} className="border-b py-2 text-sm">
                                <div>
                                    <strong>{p.name}</strong> ({p.id})
                                </div>
                                <div>
                                    Chest: {p.chestNumber}, Age: {p.age}, Category: {p.category}
                                </div>
                                <div>
                                    {p.status} • ₹{p.amount}
                                </div>
                            </div>
                        ))}
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default EventParticipation;
