import React, { useEffect } from 'react';
import { Check, X, Eye, Edit } from 'lucide-react';
import Table from '../../components/UI/Table';
import Button from '../../components/UI/Button';
import Badge from '../../components/UI/Badge';
import Card from '../../components/UI/Card';
import { District } from '../../types';
import axios from 'axios';
import { toast } from 'react-toastify';

const DistrictsApproval: React.FC = () => {
    const baseURL = import.meta.env.VITE_API_BASE_URL;


    const [pendingDistrict, setPendingDistrict] = React.useState<any>([]);

    const fetchSecretaries = async () => {
        try {
            const response = await axios.get(`${baseURL}/district_secretaries/`);
            setPendingDistrict(response.data.filter((district: any) => district.approvalStatus === 'pending'));

        } catch (error) {
            console.error('Failed to fetch district secretaries:', error);
        }
    };
    useEffect(() => {
        fetchSecretaries()
    }, [])

    const handleApprove = async (playerId: string) => {
        try {
           const res= await axios.put(`${baseURL}/district_secretaries/${playerId}/approve`);
           toast.success(res?.data?.message || 'Data approved!')
            fetchSecretaries(); // Refresh the pending players list
        } catch (error:any) {
            console.error(`Failed to approve district secretaries ${playerId}:`, error);
            toast.error(error?.res?.data?.message || 'Data Approve failed!')
        }
    };
    // const handleReject = (playerId: string) => {
    //     setPendingDistrict((prev: any) => prev.filter((p: any) => p.id !== playerId));
    //     // In real app, would make API call to reject
    // };
    const handleReject = async (playerId: string) => {
    if (confirm('Are you sure you want to reject this player?')) {
        try {
         const res=   await axios.put(`${baseURL}/players/${playerId}/reject`);
         toast.success(res?.data?.message || 'Data rejected!')
            setPendingDistrict((prev: any) => prev.filter((p: any) => p.id !== playerId));
        } catch (error:any) {
            console.error('Reject failed:', error);
            toast.error(error?.res?.data?.message || 'data reject failed!')
        }
    }
};

    const columns = [
        { key: 'secretaryName', label: 'Secretary Name', sortable: true },
        {
            key: 'districtName',
            label: 'District',
            sortable: true
        },
        {
            key: 'stateName',
            label: 'State',
            sortable: true
        },
        { key: 'email', label: 'Email', sortable: true },
        { key: 'mobileNumber', label: 'Phone', sortable: true },
        {
            key: 'actions',
            label: 'Actions',
            render: (value: any, player: District) => (
                <div className="flex items-center space-x-2">
                    {/* <Button size="sm" variant="secondary">
                        <Eye size={16} />
                    </Button>
                    <Button size="sm" variant="primary">
                        <Edit size={16} />
                    </Button> */}
                    <Button
                        size="sm"
                        variant="success"
                        onClick={() => handleApprove(player.districtId)}
                    >
                        <Check size={16} />
                    </Button>
                    <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleReject(player.districtId)}
                    >
                        <X size={16} />
                    </Button>
                </div>
            )
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Districts Pending Approval</h1>
                    <p className="text-gray-600 mt-1">Review and approve districts registrations</p>
                </div>
                <Badge variant="warning">
                    {pendingDistrict?.length} Pending
                </Badge>
            </div>

            <Card>
                <Table
                    columns={columns}
                    data={pendingDistrict}
                    searchable
                    searchPlaceholder="Search districts club..."
                />
            </Card>
        </div>
    );
};

export default DistrictsApproval