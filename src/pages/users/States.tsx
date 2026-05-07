import React, { useEffect } from 'react';
import { Edit, Trash2, Eye, Plus, FileText, CheckCircle, XCircle } from 'lucide-react';
import Table from '../../components/UI/Table';
import Button from '../../components/UI/Button';
import Badge from '../../components/UI/Badge';
import Card from '../../components/UI/Card';
import Modal from '../../components/UI/Modal';
import FormField from '../../components/UI/FormField';
import axios from 'axios';
import { useLocation } from '../../context/LocationContext';
import ImageUpload from '../../components/UI/ImageUpload';
import { exportToExcel } from '../../ExportToExcel/ExportToExcel';

interface StateSecretary {
  stateSecretaryId?: string;
  secretaryName: string;
  password?: string;
  stateId: number;
  mobileNumber: string;
  email: string;
  societyCertificateNumber: string;
  aadharNumber: string;
  certificateUrl: string;
  address: string;
  approvalStatus?: 'approved' | 'pending';
  stateName?: string;
}

const States: React.FC = () => {
  const baseURL = import.meta.env.VITE_API_BASE_URL;
  const { states, loading } = useLocation();

  const [stateSecretaries, setStateSecretaries] = React.useState<StateSecretary[]>([]);
  const [filteredSecretaries, setFilteredSecretaries] = React.useState<StateSecretary[]>([]);
  const [sortBy, setSortBy] = React.useState<string>('');
  const [sortOrder, setSortOrder] = React.useState<'asc' | 'desc'>('asc');
  const [showModal, setShowModal] = React.useState(false);
  const [showDocumentModal, setShowDocumentModal] = React.useState(false);
  const [selectedSecretary, setSelectedSecretary] = React.useState<StateSecretary | null>(null);
  const [modalMode, setModalMode] = React.useState<'create' | 'edit' | 'view'>('create');
  const [statusFilter, setStatusFilter] = React.useState<string>('all');

  const [formData, setFormData] = React.useState<Partial<StateSecretary>>({
    secretaryName: '',
    password: '',
    stateId: undefined,
    mobileNumber: '',
    email: '',
    societyCertificateNumber: '',
    aadharNumber: '',
    certificateUrl: '',
    address: '',
    approvalStatus: 'pending',
  });

  useEffect(() => {
    fetchSecretaries();
  }, []);

  const fetchSecretaries = async () => {
    try {
      const response = await axios.get(`${baseURL}/state_secretaries/`);
      console.log('Fetched secretaries:', response.data); // Debug

      setStateSecretaries(response.data);
      setFilteredSecretaries(response.data);
    } catch (error) {
      console.error('Failed to fetch state secretaries:', error);
    }
  };

  useEffect(() => {
    let filtered = [...stateSecretaries];
    console.log('Applying status filter:', statusFilter); // Debug
    if (statusFilter !== 'all') {
      filtered = filtered.filter((secretary) =>
        statusFilter === 'approved'
          ? secretary.approvalStatus === 'approved'
          : secretary.approvalStatus === 'pending'
      );
    }
    console.log('Filtered secretaries:', filtered); // Debug
    setFilteredSecretaries(filtered);
  }, [stateSecretaries, statusFilter]);

  const handleSort = (key: string) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(key);
      setSortOrder('asc');
    }

    const sorted = [...filteredSecretaries].sort((a, b) => {
      const aValue = a[key as keyof StateSecretary] as any;
      const bValue = b[key as keyof StateSecretary] as any;

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
    setFilteredSecretaries(sorted);
  };

  const handleSearch = (query: string) => {
    let filtered = stateSecretaries.filter((secretary) =>
      secretary.secretaryName.toLowerCase().includes(query.toLowerCase()) ||
      secretary.email.toLowerCase().includes(query.toLowerCase()) ||
      secretary.mobileNumber.toLowerCase().includes(query.toLowerCase()) ||
      (secretary.stateName?.toLowerCase().includes(query.toLowerCase()) || '')
    );

    if (statusFilter !== 'all') {
      filtered = filtered.filter((secretary) =>
        statusFilter === 'approved'
          ? secretary.approvalStatus === 'approved'
          : secretary.approvalStatus === 'pending'
      );
    }

    setFilteredSecretaries(filtered);
  };

  const handleCreateSecretary = () => {
    setSelectedSecretary(null);
    setModalMode('create');
    setFormData({
      secretaryName: '',
      password: '',
      stateId: undefined,
      mobileNumber: '',
      email: '',
      societyCertificateNumber: '',
      aadharNumber: '',
      certificateUrl: '',
      address: '',
      approvalStatus: 'pending',
    });
    setShowModal(true);
  };

  const handleViewSecretary = (secretary: StateSecretary) => {
    console.log('View secretary:', secretary); // Debug
    setSelectedSecretary(secretary);
    setModalMode('view');
    setFormData({
      secretaryName: secretary.secretaryName,
      password: secretary.password,
      stateId: secretary.stateId,
      mobileNumber: secretary.mobileNumber,
      email: secretary.email,
      societyCertificateNumber: secretary.societyCertificateNumber,
      aadharNumber: secretary.aadharNumber,
      certificateUrl: secretary.certificateUrl,
      address: secretary.address,
      approvalStatus: secretary.approvalStatus,
    });
    setShowModal(true);
  };

  const handleEditSecretary = (secretary: StateSecretary) => {
    console.log('Edit secretary:', secretary); // Debug
    setSelectedSecretary(secretary);
    setModalMode('edit');
    setFormData({
      secretaryName: secretary.secretaryName,
      password: secretary.password,
      stateId: secretary.stateId,
      mobileNumber: secretary.mobileNumber,
      email: secretary.email,
      societyCertificateNumber: secretary.societyCertificateNumber,
      aadharNumber: secretary.aadharNumber,
      certificateUrl: secretary.certificateUrl,
      address: secretary.address,
      approvalStatus: secretary.approvalStatus,
    });
    setShowModal(true);
  };

  const handleDeleteSecretary = async (stateSecretaryId: string) => {
    if (confirm('Are you sure you want to delete this state secretary?')) {
      try {
        await axios.delete(`${baseURL}/state_secretaries/${stateSecretaryId}`);
        fetchSecretaries();
      } catch (error) {
        console.error('Failed to delete state secretary:', error);
        alert('Failed to delete state secretary. Please try again.');
      }
    }
  };

  const handleApproveSecretary = async (stateSecretaryId: string) => {
    try {
      await axios.put(`${baseURL}/state_secretaries/${stateSecretaryId}`, { approvalStatus: 'approved' });
      setStateSecretaries((prev) =>
        prev.map((s) =>
          s.stateSecretaryId === stateSecretaryId ? { ...s, approvalStatus: 'approved' } : s
        )
      );
      setFilteredSecretaries((prev) =>
        prev.map((s) =>
          s.stateSecretaryId === stateSecretaryId ? { ...s, approvalStatus: 'approved' } : s
        )
      );
    } catch (error) {
      console.error('Failed to approve state secretary:', error);
      alert('Failed to approve state secretary. Please try again.');
    }
  };

  const handleRejectSecretary = async (stateSecretaryId: string) => {
    if (confirm('Are you sure you want to reject this state secretary registration?')) {
      try {
        await axios.put(`${baseURL}/state_secretaries/${stateSecretaryId}/reject`);
        fetchSecretaries();
      } catch (error) {
        console.error('Failed to reject state secretary:', error);
        alert('Failed to reject state secretary. Please try again.');
      }
    }
  };

  const handleViewDocuments = (secretary: StateSecretary) => {
    setSelectedSecretary(secretary);
    setShowDocumentModal(true);
  };

  const handleSaveSecretary = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form Data:', formData); // Debug

    const payload = {
      secretaryName: formData.secretaryName,
      password: formData.password,
      stateId: formData.stateId,
      mobileNumber: formData.mobileNumber,
      email: formData.email,
      societyCertificateNumber: formData.societyCertificateNumber,
      aadharNumber: formData.aadharNumber,
      certificateUrl: formData.certificateUrl,
      address: formData.address,
      approvalStatus: formData.approvalStatus,
    };

    try {
      if (modalMode === 'create') {
        await axios.post(`${baseURL}/state_secretaries/register`, payload);
        fetchSecretaries();
      } else if (modalMode === 'edit' && selectedSecretary) {
        await axios.put(`${baseURL}/state_secretaries/${selectedSecretary.stateSecretaryId}`, payload);
        fetchSecretaries();
      }
      setShowModal(false);
    } catch (error) {
      console.error('Error saving state secretary:', error);
      alert('Failed to save state secretary. Please try again.');
    }
  };

  const columns = [
    { key: 'stateSecretaryId', label: 'State Secretary Id', sortable: true },
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
      key: 'approvalStatus',
      label: 'Status',
      sortable: true,
      render: (value: string) => {
        let variant: 'success' | 'warning' | 'danger' = 'warning';
        let label = 'Pending';

        if (value === 'approved') {
          variant = 'success';
          label = 'Approved';
        } else if (value === 'rejected') {
          variant = 'danger';
          label = 'Rejected';
        }

        return (
          <Badge variant={variant} size="sm">
            {label}
          </Badge>
        );
      }
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (value: any, secretary: StateSecretary) => (
        <div className="flex items-center space-x-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => handleViewSecretary(secretary)}
            title="View Details"
          >
            <Eye size={16} />
          </Button>
          <Button
            size="sm"
            variant="primary"
            onClick={() => handleEditSecretary(secretary)}
            title="Edit Secretary"
          >
            <Edit size={16} />
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => handleViewDocuments(secretary)}
            title="View Documents"
          >
            <FileText size={16} />
          </Button>
          {secretary.approvalStatus !== 'approved' && (
            <>
              <Button
                size="sm"
                variant="success"
                onClick={() => handleApproveSecretary(secretary.stateSecretaryId!)}
                title="Approve"
              >
                <CheckCircle size={16} />
              </Button>
              <Button
                size="sm"
                variant="danger"
                onClick={() => handleRejectSecretary(secretary.stateSecretaryId!)}
                title="Reject"
              >
                <XCircle size={16} />
              </Button>
            </>
          )}
          <Button
            size="sm"
            variant="danger"
            onClick={() => handleDeleteSecretary(secretary.stateSecretaryId!)}
            title="Delete"
          >
            <Trash2 size={16} />
          </Button>
        </div>
      ),
    },
  ];

  const isReadOnly = modalMode === 'view';

  return (
    <div className="space-y-6">
      <div className='flex justify-end'>
        <Button variant="secondary" onClick={() => exportToExcel(stateSecretaries, 'state_secretary_list')}>
          Export to Excel
        </Button>
      </div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">State Secretaries Management</h1>
          <p className="text-gray-600 mt-1">Manage state secretary registrations and approvals</p>
        </div>
        <Button variant="primary" onClick={handleCreateSecretary}>
          <Plus size={16} className="mr-2" />
          Add New State Secretary
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{stateSecretaries.length}</div>
            <div className="text-sm text-gray-600">Total Secretaries</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {stateSecretaries.filter((s) => s.approvalStatus === 'approved').length}
            </div>
            <div className="text-sm text-gray-600">Approved</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {stateSecretaries.filter((s) => s.approvalStatus === 'pending').length}
            </div>
            <div className="text-sm text-gray-600">Pending Approval</div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-gray-700">Filter by Status:</span>
          <div className="flex space-x-2">
            {[
              { value: 'all', label: 'All Secretaries' },
              { value: 'approved', label: 'Approved' },
              { value: 'pending', label: 'Pending' },
            ].map((status) => (
              <button
                key={status.value}
                onClick={() => setStatusFilter(status.value)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${statusFilter === status.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                {status.label}
              </button>
            ))}
          </div>
        </div>
      </Card>

      <Card>
        <Table
          columns={columns}
          data={filteredSecretaries}
          searchable
          searchPlaceholder="Search secretaries..."
          // onSearch={handleSearch}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={handleSort}
        />
      </Card>

      {/* Create/Edit/View Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={`${modalMode === 'create' ? 'Add New' : modalMode === 'edit' ? 'Edit' : 'View'} State Secretary`}
        size="xl"
      >
        <form onSubmit={handleSaveSecretary} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Secretary Name" required>
              <input
                type="text"
                value={formData.secretaryName || ''}
                onChange={(e) => setFormData({ ...formData, secretaryName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter secretary name"
                required
                readOnly={isReadOnly}
              />
            </FormField>

            {modalMode === 'create' && (
              <FormField label="Password" required>
                <input
                  type="password"
                  value={formData.password || ''}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter password"
                  required
                  readOnly={isReadOnly}
                />
              </FormField>
            )}

            <FormField label="State" required>
              <select
                value={formData.stateId || ''}
                onChange={(e) => setFormData({ ...formData, stateId: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                disabled={isReadOnly || loading}
              >
                <option value="">Select State</option>
                {states?.map((state) => (
                  <option key={state.id} value={state.id}>
                    {state.name}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField label="Email Address" required>
              <input
                type="email"
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter email address"
                required
                readOnly={isReadOnly}
              />
            </FormField>

            <FormField label="Mobile Number" required>
              <input
                type="tel"
                value={formData.mobileNumber || ''}
                onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter mobile number"
                required
                readOnly={isReadOnly}
              />
            </FormField>

            <FormField label="Society Certificate Number" required>
              <input
                type="text"
                value={formData.societyCertificateNumber || ''}
                onChange={(e) => setFormData({ ...formData, societyCertificateNumber: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter society certificate number"
                required
                readOnly={isReadOnly}
              />
            </FormField>

            <FormField label="Aadhar Number" required>
              <input
                type="text"
                value={formData.aadharNumber || ''}
                onChange={(e) => setFormData({ ...formData, aadharNumber: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter Aadhar number"
                required
                readOnly={isReadOnly}
              />
            </FormField>

            <ImageUpload
              label="Certificate Image"
              value={formData.certificateUrl}
              onChange={(url) => setFormData({ ...formData, certificateUrl: url })}
              readOnly={isReadOnly}
              uploadUrl={`${baseURL}/upload/image`}
            />

            <FormField label="Address" required>
              <input
                type="text"
                value={formData.address || ''}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter address"
                required
                readOnly={isReadOnly}
              />
            </FormField>
          </div>

          {modalMode !== 'view' && (
            <div className="flex items-center">
              <input
                type="checkbox"
                id="approved"
                checked={formData.approvalStatus === 'approved'}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    approvalStatus: e.target.checked ? 'approved' : 'pending',
                  })
                }
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <label htmlFor="approved" className="ml-2 text-sm text-gray-700">
                Approve state secretary registration
              </label>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              {modalMode === 'view' ? 'Close' : 'Cancel'}
            </Button>
            {modalMode !== 'view' && (
              <Button type="submit">
                {modalMode === 'create' ? 'Create Secretary' : 'Update Secretary'}
              </Button>
            )}
          </div>
        </form>
      </Modal>

      {/* Documents Modal */}
      <Modal
        isOpen={showDocumentModal}
        onClose={() => setShowDocumentModal(false)}
        title={`Documents - ${selectedSecretary?.secretaryName}`}
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Society Certificate</h4>
              <div className="text-sm text-gray-600 mb-3">
                Certificate Number: {selectedSecretary?.societyCertificateNumber || 'N/A'}
              </div>
              {selectedSecretary?.certificateUrl && (
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => window.open(selectedSecretary.certificateUrl, '_blank')}
                >
                  <FileText size={16} className="mr-2" />
                  View Certificate
                </Button>
              )}
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Aadhar Document</h4>
              <div className="text-sm text-gray-600 mb-3">
                Aadhar Number: {selectedSecretary?.aadharNumber || 'N/A'}
              </div>
              <Button size="sm" variant="secondary" disabled>
                <FileText size={16} className="mr-2" />
                View Aadhar (Not Available)
              </Button>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t">
            <Button variant="secondary" onClick={() => setShowDocumentModal(false)}>
              Close
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default States;