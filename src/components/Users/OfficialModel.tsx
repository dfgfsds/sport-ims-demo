import React, { useEffect, useState } from 'react';
import { Save } from 'lucide-react';
import Modal from '../UI/Modal';
import Button from '../UI/Button';
import FormField from '../UI/FormField';
import axios from 'axios';
import { Eye, EyeOff } from 'lucide-react';

interface OfficialModelProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (official: any) => void;
    official?: any;
    mode: 'create' | 'edit' | 'view';
}

const OfficialModel: React.FC<OfficialModelProps> = ({ isOpen, onClose, onSave, official, mode }) => {
    const baseURL = import.meta.env.VITE_API_BASE_URL;
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = React.useState({
        officialName: '',
        password: '',
        eventId: '',
    });
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

    console.log(allEvents, "allEvents");



    React.useEffect(() => {
        if (official && mode !== 'create') {
            setFormData({
                officialName: official.name || '',
                password: official.password || '',
                eventId: official.eventId || '',
            });
        } else {
            setFormData({
                officialName: '',
                password: '',
                eventId: '',
            });
        }
    }, [official, mode, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
        onClose();
    };

    const isReadOnly = mode === 'view';

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={`${mode === 'create' ? 'Add New' : mode === 'edit' ? 'Edit' : 'View'} Event Official`}
            size="xl"
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <FormField label="Name" required>
                        <input
                            type="text"
                            value={formData.officialName}
                            onChange={(e) => setFormData({ ...formData, officialName: e.target.value })}
                            placeholder="Enter User Name"
                            className="w-full px-3 py-2 border rounded-lg"
                            required
                            readOnly={isReadOnly}
                        />
                    </FormField>
                    {mode !== 'view' &&
                        <FormField label="Password" required>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    placeholder="Enter Password"
                                    className="w-full px-3 py-2 border rounded-lg pr-10"
                                    required
                                    readOnly={isReadOnly}
                                />
                                {!isReadOnly && (
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500"
                                        tabIndex={-1}
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                )}
                            </div>
                        </FormField>
                    }

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

export default OfficialModel;
