import React, { useEffect, useState } from 'react';
import { Save } from 'lucide-react';
import Modal from '../UI/Modal';
import Button from '../UI/Button';
import FormField from '../UI/FormField';
import axios from 'axios';

interface OfficialModelProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (official: any) => void;
    official?: any;
    mode: 'create' | 'edit' | 'view';
}

const OrganisersModel: React.FC<OfficialModelProps> = ({ isOpen, onClose, onSave, official, mode }) => {

    const baseURL = import.meta.env.VITE_API_BASE_URL;
    const [allEvents, setAllEvents] = useState<any[]>([]);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const response = await axios.get(`${baseURL}/events/`);
            setAllEvents(response.data);
        } catch (error) {
            console.error('Failed to fetch events:', error);
        }
    };

    const [formData, setFormData] = React.useState({
        // officialName: '',
        userName: '',
        password: '',
        eventId: '',
    });

    React.useEffect(() => {
        if (official && mode !== 'create') {
            setFormData({
                // officialName: official.officialName || '',
                userName: official.username || '',
                password: official.password || '',
                eventId: official.eventId || '',
            });
        } else {
            setFormData({
                // officialName: '',
                userName: '',
                password: '',
                eventId: '',
            });
        }
    }, [official, mode, isOpen]);
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
        // onClose();
    };

    const isReadOnly = mode === 'view';

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={`${mode === 'create' ? 'Add New' : mode === 'edit' ? 'Edit' : 'View'} Event Organisers`}
            size="xl"
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* <FormField label="Official Name" required>
                        <input
                            type="text"
                            value={formData.officialName}
                            onChange={(e) => setFormData({ ...formData, officialName: e.target.value })}
                            placeholder="Enter Official Name"
                            className="w-full px-3 py-2 border rounded-lg"
                            required
                            readOnly={isReadOnly}
                        />
                    </FormField> */}

                    <FormField label="Organiser Name" required>
                        <input
                            type="text"
                            value={formData.userName}
                            onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                            placeholder="Enter Organiser Name"
                            className="w-full px-3 py-2 border rounded-lg"
                            required
                            readOnly={isReadOnly}
                        />
                    </FormField>

                    <FormField label="Password" required>
                        <input
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            placeholder="Enter Password"
                            className="w-full px-3 py-2 border rounded-lg"
                            required
                            readOnly={isReadOnly}
                        />
                    </FormField>

                    <FormField label="Select Event" required>
                        <select
                            value={formData?.eventId}
                            onChange={(e) => setFormData({ ...formData, eventId: e.target.value })}
                            className="w-full px-3 py-2 border rounded-lg"
                            required
                            disabled={isReadOnly}
                        >
                            <option value="">Choose Event</option>
                            {allEvents?.map((el: any) => {
                                return (
                                    <option value={el?.id}>{el?.name}</option>
                                )
                            })}
                        </select>
                    </FormField>
                </div>

                {mode !== 'view' && (
                    <div className="flex justify-end pt-4 border-t">
                        <Button type="submit">
                            <Save size={16} className="mr-2" />
                            Submit
                        </Button>
                    </div>
                )}
            </form>
        </Modal>
    );
};

export default OrganisersModel;
