import React, { useEffect, useState } from 'react';
import { Edit, Trash2, Eye, Plus } from 'lucide-react';
import Table from '../components/UI/Table';
import Button from '../components/UI/Button';
import Card from '../components/UI/Card';
import OrganisersModel from '../components/Users/OrganisersModel';
import axios from 'axios';
import { EventOrganiserType } from '../types';
import { toast } from 'react-toastify';

const API_BASE = '/organisers'; // Your base URL

const EventOrganisers: React.FC = () => {
    const [organisers, setOrganisers] = useState<any>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [sortBy, setSortBy] = useState<string>('');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [showModal, setShowModal] = useState(false);
    const [selectedOfficial, setSelectedOfficial] = useState<EventOrganiserType | null>(null);
    const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create');

    // ✅ Fetch organisers
    const fetchOrganisers = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}${API_BASE}/`);
            setOrganisers(response.data);
        } catch (error) {
            console.error('Error fetching organisers:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrganisers();
    }, []);

    // ✅ Create organiser
    const handleSaveOfficial = async (officialData: any) => {
        console.log(officialData, "dataaa");

        try {
            if (modalMode === 'create') {
                const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}${API_BASE}/register/`, {
                    eventId: officialData.eventId,
                    name: officialData.userName,
                    "role": "event_organiser",
                    password: officialData.password
                });
                toast.success(response?.data?.message || 'Data added successfully!')
                setShowModal(false);
            } else if (modalMode === 'edit' && selectedOfficial) {
                const response = await axios.put(`${import.meta.env.VITE_API_BASE_URL}${API_BASE}/${selectedOfficial.id}`, {
                    name: officialData.userName,
                    "role": "event_organiser",
                    password: officialData.password
                });
                toast.success(response?.data?.message || 'Data updated successfully!')
                setShowModal(false);
            }
            fetchOrganisers();

        } catch (error: any) {
            console.error('Error saving organiser:', error);
            toast.error(error?.response?.data?.message || 'Something went wrong!')
        }
    };

    // ✅ Delete organiser
    const handleDeleteOfficial = async (officialId: any) => {
        if (confirm('Are you sure you want to delete this organiser?')) {
            try {
                const response = await axios.delete(`${import.meta.env.VITE_API_BASE_URL}${API_BASE}/${officialId}`);
                toast.success(response?.data?.message || 'Data deleted successfully!')
                fetchOrganisers();
            } catch (error: any) {
                console.error('Error deleting organiser:', error);
                toast.error(error?.response?.data?.message || 'Something went wrong!')
            }
        }
    };

    const handleCreateOfficial = () => {
        setSelectedOfficial(null);
        setModalMode('create');
        setShowModal(true);
    };

    const handleViewOfficial = (official: EventOrganiserType) => {
        setSelectedOfficial(official);
        setModalMode('view');
        setShowModal(true);
    };

    const handleEditOfficial = (official: EventOrganiserType) => {
        setSelectedOfficial(official);
        setModalMode('edit');
        setShowModal(true);
    };

    const columns = [
        { key: 'id', label: 'ID', sortable: true },
        { key: 'name', label: 'Name', sortable: true },
        { key: 'username', label: 'User Name', sortable: true },
        { key: 'eventId', label: 'Event ID', sortable: true },
        { key: 'role', label: 'Role', sortable: true },
        {
            key: 'actions',
            label: 'Actions',
            render: (value: any, official: EventOrganiserType) => (
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
                    <h1 className="text-2xl font-bold text-gray-900">Organisers Management</h1>
                    <p className="text-gray-600 mt-1">Manage registered organisers</p>
                </div>
                <Button variant="primary" onClick={handleCreateOfficial}>
                    <Plus size={16} className="mr-2" />
                    Add New Organiser
                </Button>
            </div>

            <Card>
                {loading ? (
                    <p className="text-center py-4">Loading organisers...</p>
                ) : (
                    <Table
                        columns={columns}
                        data={organisers}
                        searchable
                        searchPlaceholder="Search organisers..."
                        sortBy={sortBy}
                        sortOrder={sortOrder}
                    />
                )}
            </Card>

            <OrganisersModel
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onSave={handleSaveOfficial}
                official={selectedOfficial}
                mode={modalMode}
            />
        </div>
    );
};

export default EventOrganisers;

