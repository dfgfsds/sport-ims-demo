import React, { useEffect, useState } from 'react';
import { Check, X, Eye, Edit } from 'lucide-react';
import Table from '../../components/UI/Table';
import Button from '../../components/UI/Button';
import Badge from '../../components/UI/Badge';
import Card from '../../components/UI/Card';
import axios from 'axios';
import { useClubs } from '../../context/ClubContext';
import { toast } from 'react-toastify';

// Define Club type based on provided data
interface Club {
    id: number;
    clubId: string;
    clubName: string;
    coachName: string;
    email: string;
    mobileNumber: string;
    districtName: string;
    stateName: string;
    approvalStatus: 'pending' | 'approved' | 'rejected';
    aadharNumber: string;
    address: string;
    certificateUrl: string;
    societyCertificateNumber: string;
    districtId: number;
    stateId: number;
    createdAt: string;
    updatedAt: string;
    deleteStatus: boolean;
}

const ClubsApproval: React.FC = () => {
    const { clubs, fetchClubs } = useClubs();
    const [pendingClubs, setPendingClubs] = useState<Club[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const baseURL = import.meta.env.VITE_API_BASE_URL

    // Filter pending clubs
    useEffect(() => {
        return setPendingClubs(clubs?.filter((club: any) => club?.approvalStatus === 'pending'));
    }, []);

    const handleApprove = async (clubId: number) => {
        try {
            const res = await axios.put(`${baseURL}/clubs/${clubId}/approve`);
            toast.success(res?.data?.message || 'Data approved!')
            await fetchClubs(); // Refresh context data
            setPendingClubs((prev) => prev.filter((club) => club.id !== clubId)); // Optimistic update
        } catch (error: any) {
            console.error('Failed to approve club:', error);
            toast.error(error?.res?.data?.message || 'Data approved failed!')
        }
    };

    const handleReject = async (clubId: number) => {
        try {
            const res = await axios.put(`${baseURL}/clubs/${clubId}/reject/`, {
                approvalStatus: 'rejected',
                updatedAt: new Date().toISOString(),
            });
            toast.success(res.data.message || 'Data rejected!')
            await fetchClubs(); // Refresh context data
            setPendingClubs((prev) => prev.filter((club) => club.id !== clubId)); // Optimistic update
        } catch (error: any) {
            console.error('Failed to reject club:', error);
            toast.error(error?.res?.data?.message || 'Data rejected failed!')
        }
    };

    const columns = [
        { key: 'clubId', label: 'Club ID', sortable: true },
        { key: 'clubName', label: 'Club Name', sortable: true },
        { key: 'coachName', label: 'Contact Person', sortable: true },
        { key: 'email', label: 'Email', sortable: true },
        { key: 'mobileNumber', label: 'Phone', sortable: true },
        { key: 'districtName', label: 'District', sortable: true },
        { key: 'stateName', label: 'State', sortable: true },
        {
            key: 'actions',
            label: 'Actions',
            render: (_value: any, club: Club) => (
                <div className="flex items-center space-x-2">
                    {/* <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => alert(`View details for club ${club.clubName}`)} // Placeholder
                    >
                        <Eye size={16} />
                    </Button>
                    <Button
                        size="sm"
                        variant="primary"
                        onClick={() => alert(`Edit club ${club.clubName}`)} // Placeholder
                    >
                        <Edit size={16} />
                    </Button> */}
                    <Button
                        size="sm"
                        variant="success"
                        onClick={() => handleApprove(club.id)}
                        disabled={isLoading}
                    >
                        <Check size={16} />
                    </Button>
                    <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleReject(club.id)}
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
                    <h1 className="text-2xl font-bold text-gray-900">Clubs Pending Approval</h1>
                    <p className="text-gray-600 mt-1">Review and approve club registrations</p>
                </div>
                <Badge variant="warning">{pendingClubs.length} Pending</Badge>
            </div>

            <Card>
                {isLoading ? (
                    <div className="text-center py-4">Loading clubs...</div>
                ) : pendingClubs.length === 0 ? (
                    <div className="text-center py-4">No pending clubs to approve.</div>
                ) : (
                    <Table
                        columns={columns}
                        data={pendingClubs}
                        searchable
                        searchPlaceholder="Search pending club..."
                    />
                )}
            </Card>
        </div>
    );
};

export default ClubsApproval;