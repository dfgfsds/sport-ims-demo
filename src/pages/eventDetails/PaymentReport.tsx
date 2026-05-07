import { useState } from 'react';
import Table from '../../components/UI/Table';
import Card from '../../components/UI/Card';
import Badge from '../../components/UI/Badge';
import { mockPayments } from '../../data/mockData';
import { Payment } from '../../types';

function PaymentReport() {
    const [data, setData] = useState<Payment[]>(mockPayments);
    const [search, setSearch] = useState('');
    const [sortKey, setSortKey] = useState<keyof Payment | ''>('');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

    const handleSearch = (query: string) => {
        setSearch(query);
        const filtered = mockPayments.filter(p =>
            p.eventName.toLowerCase().includes(query.toLowerCase()) ||
            p.skaterName.toLowerCase().includes(query.toLowerCase()) ||
            p.refId.toLowerCase().includes(query.toLowerCase()) ||
            p.status.toLowerCase().includes(query.toLowerCase())
        );
        setData(filtered);
    };

    const handleSort = (key: keyof Payment) => {
        let newOrder: 'asc' | 'desc' = 'asc';
        if (sortKey === key && sortOrder === 'asc') {
            newOrder = 'desc';
        }
        setSortKey(key);
        setSortOrder(newOrder);

        const sorted = [...data].sort((a, b) => {
            const valA = a[key];
            const valB = b[key];
            return newOrder === 'asc'
                ? valA > valB ? 1 : -1
                : valA < valB ? 1 : -1;
        });
        setData(sorted);
    };

    const columns = [
        { key: 'id', label: 'No', sortable: true },
        { key: 'eventName', label: 'Event Name', sortable: true },
        { key: 'skaterName', label: 'Skater Name', sortable: true },
        { key: 'refId', label: 'Payment Ref ID', sortable: true },
        { key: 'amount', label: 'Amount', sortable: true },
        { key: 'date', label: 'Date Time', sortable: true },
        {
            key: 'status',
            label: 'Payment Status',
            sortable: true,
            render: (_: any, row: Payment) => {
                const lower = row.status.toLowerCase();
                let variant: 'success' | 'danger' | 'default' = 'default';

                if (lower.includes('success')) variant = 'success';
                else if (lower.includes('failure') || lower.includes('aborted')) variant = 'danger';

                return <Badge variant={variant}>{row.status}</Badge>;
            },
        },
        { key: 'mode', label: 'Payment Mode', sortable: true },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Payment Report</h1>
                <p className="text-gray-600">Search and sort payment transactions</p>
            </div>

            <Card>
                <Table
                    columns={columns}
                    data={data}
                    searchable
                    searchPlaceholder="Search payments..."
                    // onSearch={handleSearch}
                    sortBy={sortKey}
                    sortOrder={sortOrder}
                    onSort={handleSort}
                />
            </Card>
        </div>
    );
}

export default PaymentReport;
