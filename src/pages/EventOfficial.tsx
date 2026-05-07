import React, { useEffect } from 'react';
import { Edit, Trash2, Eye, Plus } from 'lucide-react';
import Table from '../components/UI/Table';
import Button from '../components/UI/Button';
import Card from '../components/UI/Card';
import OfficialModel from '../components/Users/OfficialModel';
import { mockEventOfficials } from '../data/mockData';
import { EventOfficialType } from '../types';
import axios from 'axios';

const EventOfficial: React.FC = () => {
    const [officials, setOfficials] = React.useState<any>([]);
    const [sortBy, setSortBy] = React.useState<string>('');
    const [sortOrder, setSortOrder] = React.useState<'asc' | 'desc'>('asc');
    const [showModal, setShowModal] = React.useState(false);
    const [selectedOfficial, setSelectedOfficial] = React.useState<EventOfficialType | null>(null);
    const [modalMode, setModalMode] = React.useState<'create' | 'edit' | 'view'>('create');
    const [searchQuery, setSearchQuery] = React.useState('');
    console.log(selectedOfficial, "selectedOfficial");


    const handleSort = (key: string) => {
        if (sortBy === key) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(key);
            setSortOrder('asc');
        }

        const sorted = [...officials].sort((a, b) => {
            const aValue = a[key as keyof EventOfficialType] ?? '';
            const bValue = b[key as keyof EventOfficialType] ?? '';
            return sortOrder === 'asc' ? (aValue > bValue ? 1 : -1) : (aValue < bValue ? 1 : -1);
        });

        setOfficials(sorted);
    };
    const handleSearch = (query: string) => {
        setSearchQuery(query);
    };

    const handleCreateOfficial = () => {
        setSelectedOfficial(null);
        setModalMode('create');
        setShowModal(true);
    };

    const handleEditOfficial = (official: EventOfficialType) => {
        setSelectedOfficial(official);
        setModalMode('edit');
        setShowModal(true);
    };

    const handleSaveOfficial = async (officialData: any) => {
        try {
            if (modalMode === 'create') {
                await axios.post(`${import.meta.env.VITE_API_BASE_URL}/officials/register/`, {
                    name: officialData.officialName,
                    username: officialData.userName,
                    password: officialData.password,
                    eventId: Number(officialData.eventId),
                    role: 'official'
                });
            } else if (modalMode === 'edit' && selectedOfficial) {
                await axios.put(`${import.meta.env.VITE_API_BASE_URL}/officials/${selectedOfficial.id}`, {
                    name: officialData.officialName,
                    username: officialData.name,
                    password: officialData.password,
                    eventId: Number(officialData.eventId),
                    role: 'official'
                });
            }

            // Refresh list
            const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/officials/`);
            const officialsData = Array.isArray(res.data) ? res.data : [res.data];
            const formatted = officialsData.map((item: any) => ({
                id: item.id.toString(),
                name: item.name,
                username: item.username,
                eventId: item.eventId,
                eventName: item.eventName,
                role: item.role,
                status: true,
            }));
            setOfficials(formatted);
        } catch (error) {
            console.error('Save official failed:', error);
        }
    };

    const handleDeleteOfficial = async (officialId: string) => {
        if (confirm('Are you sure you want to delete this official?')) {
            try {
                await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/officials/${officialId}`);
                setOfficials(prev => prev.filter(o => o.id !== officialId));
            } catch (error) {
                console.error('Failed to delete official:', error);
            }
        }
    };

    const handleViewOfficial = async (official: EventOfficialType) => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/officials/${official.id}`);
            const data = res.data;
            setSelectedOfficial({
                ...data,
                id: data.id.toString(),
                name: data.name,
                username: data.username,
                eventId: data.eventId,
                eventName: data.eventName,
                role: data.role,
                status: true,
            });
            setModalMode('view');
            setShowModal(true);
        } catch (err) {
            console.error('Failed to fetch official:', err);
        }
    };

    useEffect(() => {
        const fetchOfficials = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/officials/`);
                const data = Array.isArray(response.data) ? response.data : [response.data];
                const formattedData = data.map((item: any) => ({
                    id: item.id.toString(),
                    name: item.name,
                    username: item.username,
                    eventId: item.eventId,
                    eventName: item.eventName,
                    role: item.role,
                    status: true // default value if not in API
                }));
                setOfficials(formattedData);
            } catch (error) {
                console.error('Error fetching officials:', error);
            }
        };

        fetchOfficials();
    }, []);

    const columns = [
        { key: 'eventName', label: 'Event Name', sortable: true },
        { key: 'eventId', label: 'Event ID', sortable: true },
        { key: 'name', label: 'Name', sortable: true },
        { key: 'username', label: 'User Name', sortable: true },
        { key: 'role', label: 'Role', sortable: true },
        {
            key: 'actions',
            label: 'Actions',
            render: (value: any, official: EventOfficialType) => (
                <div className="flex items-center space-x-2">
                    <Button size="sm" variant="secondary" onClick={() => handleViewOfficial(official)}>
                        <Eye size={16} />
                    </Button>
                    <Button size="sm" variant="primary" onClick={() => handleEditOfficial(official)}>
                        <Edit size={16} />
                    </Button>
                    <Button size="sm" variant="danger" onClick={() => handleDeleteOfficial(official.id)}>
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
                    <h1 className="text-2xl font-bold text-gray-900">Officials Management</h1>
                    <p className="text-gray-600 mt-1">Manage registered officials</p>
                </div>
                <Button variant="primary" onClick={handleCreateOfficial}>
                    <Plus size={16} className="mr-2" />
                    Add New Official
                </Button>
            </div>

            <Card>
                <Table
                    columns={columns}
                    data={officials}
                    searchable
                    searchPlaceholder="Search officials..."
                    sortBy={sortBy}
                    sortOrder={sortOrder}
                    onSort={handleSort}
                    // onSearch={handleSearch}
                />
            </Card>

            <OfficialModel
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onSave={handleSaveOfficial}
                official={selectedOfficial}
                mode={modalMode}
            />
        </div>
    );
};

export default EventOfficial;
