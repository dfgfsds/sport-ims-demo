import React, { useEffect, useState } from 'react';
import { Check, X, Eye, Edit } from 'lucide-react';
import Table from '../../components/UI/Table';
import Button from '../../components/UI/Button';
import Badge from '../../components/UI/Badge';
import Card from '../../components/UI/Card';
import axios from 'axios';
import { toast } from 'react-toastify';

// Define State type based on assumed API response
interface State {
    id: number;
    stateCode: string;
    stateName: string;
    secretaryName: string;
    email: string;
    mobileNumber: string;
    approvalStatus: 'pending' | 'approved' | 'rejected';
    createdAt: string;
    updatedAt: string;
    deleteStatus: boolean;
}

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const StatesApproval: React.FC = () => {
    const [pendingStates, setPendingStates] = useState<State[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const fetchStates = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${baseURL}/state_secretaries/`);
            const pending = response.data.filter((state: State) => state.approvalStatus === 'pending');
            setPendingStates(pending);
            console.log('Pending States:', pending); // Debug
        } catch (error) {
            console.error('Failed to fetch state secretaries:', error);
            alert('Failed to load states. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchStates();
    }, []);

    const handleApprove = async (stateId: number) => {
        try {
            const res = await axios.put(`${baseURL}/state_secretaries/${stateId}/approve`, {
                approvalStatus: 'approved',
                updatedAt: new Date().toISOString(),
            });
            toast.success(res?.data?.message || 'Data approved!')
            await fetchStates(); // Refresh data
            setPendingStates((prev) => prev.filter((state) => state.id !== stateId)); // Optimistic update
        } catch (error: any) {
            console.error(`Failed to approve state ${stateId}:`, error);
            toast.error(error?.res?.data?.message || 'Data approved failed!')
        }
    };

    const handleReject = async (stateId: number) => {
        try {
            const res = await axios.put(`${baseURL}/state_secretaries/${stateId}/reject`);
            toast.success(res?.data?.message || 'data rejected!')
            await fetchStates(); // Refresh data
            setPendingStates((prev) => prev.filter((state) => state.id !== stateId)); // Optimistic update
        } catch (error: any) {
            console.error(`Failed to reject state ${stateId}:`, error);
            toast.error(error?.res?.data?.message || 'data rejected failed!')
        }
    };

    const columns = [
        { key: 'secretaryName', label: 'Secretary Name', sortable: true },
        {
            key: 'stateName',
            label: 'State',
            sortable: true,
            render: (value: string) => value || 'N/A',
        },
        { key: 'email', label: 'Email', sortable: true },
        { key: 'mobileNumber', label: 'Phone', sortable: true },
        {
            key: 'actions',
            label: 'Actions',
            render: (_value: any, state: any) => (
                <div className="flex items-center space-x-2">
                    {/* <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => alert(`View details for ${state.stateName}`)}
                    >
                        <Eye size={16} />
                    </Button>
                    <Button
                        size="sm"
                        variant="primary"
                        onClick={() => alert(`Edit ${state.stateName}`)}
                    >
                        <Edit size={16} />
                    </Button> */}
                    <Button
                        size="sm"
                        variant="success"
                        onClick={() => handleApprove(state.stateSecretaryId)}
                        disabled={isLoading}
                    >
                        <Check size={16} />
                    </Button>
                    <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleReject(state.stateSecretaryId)}
                        disabled={isLoading}
                    >
                        <X size={16} />
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">States Pending Approval</h1>
                    <p className="text-gray-600 mt-1">Review and approve state registrations</p>
                </div>
                <Badge variant="warning">{pendingStates.length} Pending</Badge>
            </div>

            <Card>
                {isLoading ? (
                    <div className="text-center py-4">Loading states...</div>
                ) : pendingStates.length === 0 ? (
                    <div className="text-center py-4">No pending states to approve.</div>
                ) : (
                    <Table
                        columns={columns}
                        data={pendingStates}
                        searchable
                        searchPlaceholder="Search pending states..."
                    />
                )}
            </Card>
        </div>
    );
};

export default StatesApproval;