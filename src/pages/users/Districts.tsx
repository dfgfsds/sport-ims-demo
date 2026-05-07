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
import { toast } from 'react-toastify';

interface DistrictSecretary {
  districtSecretaryId: any;
  id?: string;
  secretaryName: string;
  password?: string;
  stateId: number;
  districtId: number;
  mobileNumber: string;
  email: string;
  societyCertificateNumber: string;
  aadharNumber: string;
  certificateUrl: string;
  address: string;
  approvalStatus?: 'approved' | 'pending';
  stateName?: string;
  districtName?: string;
}

const Districts: React.FC = () => {
  const baseURL = import.meta.env.VITE_API_BASE_URL;
  const { states, districts, loading } = useLocation();

  const [districtSecretaries, setDistrictSecretaries] = React.useState<DistrictSecretary[]>([]);
  const [filteredSecretaries, setFilteredSecretaries] = React.useState<DistrictSecretary[]>([]);
  const [sortBy, setSortBy] = React.useState<string>('');
  const [sortOrder, setSortOrder] = React.useState<'asc' | 'desc'>('asc');
  const [showModal, setShowModal] = React.useState(false);
  const [showDocumentModal, setShowDocumentModal] = React.useState(false);
  const [selectedSecretary, setSelectedSecretary] = React.useState<DistrictSecretary | null>(null);
  const [modalMode, setModalMode] = React.useState<'create' | 'edit' | 'view'>('create');
  const [statusFilter, setStatusFilter] = React.useState<string>('all');

  const [formData, setFormData] = React.useState<Partial<DistrictSecretary>>({
    secretaryName: '',
    password: '',
    stateId: undefined,
    districtId: undefined,
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
      const response = await axios.get(`${baseURL}/district_secretaries/`);
      console.log('Fetched secretaries:', response.data); // Debug
      // Normalize API response
      const normalizedSecretaries = response.data.map((secretary: any) => ({
        districtSecretaryId: secretary.districtSecretaryId || secretary.id,
        id: secretary.id || `D${Date.now()}`,
        secretaryName: secretary.secretaryName || '',
        password: secretary.password || '',
        stateId: secretary.stateId || 0,
        districtId: secretary.districtId || 0,
        mobileNumber: secretary.mobileNumber || '',
        email: secretary.email || '',
        societyCertificateNumber: secretary.societyCertificateNumber || '',
        aadharNumber: secretary.aadharNumber || '',
        certificateUrl: secretary.certificateUrl || '',
        address: secretary.address || '',
        approvalStatus: secretary.approvalStatus || 'pending',
        stateName: states?.find((state) => state.id === secretary.stateId)?.name || '',
        districtName: districts?.find((district) => district.id === secretary.districtId)?.name || '',
      }));
      setDistrictSecretaries(normalizedSecretaries);
      setFilteredSecretaries(normalizedSecretaries);
    } catch (error) {
      console.error('Failed to fetch district secretaries:', error);
    }
  };

  useEffect(() => {
    let filtered = [...districtSecretaries];
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
  }, [districtSecretaries, statusFilter]);

  const handleSort = (key: string) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(key);
      setSortOrder('asc');
    }

    const sorted = [...filteredSecretaries].sort((a, b) => {
      const aValue = a[key as keyof DistrictSecretary];
      const bValue = b[key as keyof DistrictSecretary];

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredSecretaries(sorted);
  };

  const handleSearch = (query: string) => {
    let filtered = districtSecretaries.filter((secretary) =>
      secretary.secretaryName.toLowerCase().includes(query.toLowerCase()) ||
      secretary.email.toLowerCase().includes(query.toLowerCase()) ||
      secretary.mobileNumber.toLowerCase().includes(query.toLowerCase()) ||
      (secretary.stateName?.toLowerCase().includes(query.toLowerCase()) || '') ||
      (secretary.districtName?.toLowerCase().includes(query.toLowerCase()) || '')
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
      districtId: undefined,
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

  const handleViewSecretary = (secretary: DistrictSecretary) => {
    console.log('View secretary:', secretary); // Debug
    setSelectedSecretary(secretary);
    setModalMode('view');
    setFormData({
      secretaryName: secretary.secretaryName,
      password: secretary.password,
      stateId: secretary.stateId,
      districtId: secretary.districtId,
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

  const handleEditSecretary = (secretary: DistrictSecretary) => {
    console.log('Edit secretary:', secretary); // Debug
    setSelectedSecretary(secretary);
    setModalMode('edit');
    setFormData({
      secretaryName: secretary.secretaryName,
      password: secretary.password,
      stateId: secretary.stateId,
      districtId: secretary.districtId,
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

  const handleDeleteSecretary = async (districtSecretaryId: string) => {
    if (confirm('Are you sure you want to delete this district secretary?')) {
      try {
        const res = await axios.delete(`${baseURL}/district_secretaries/${districtSecretaryId}`);
        toast.success(res?.data?.message || 'Data deleted successfully!')
        fetchSecretaries();
      } catch (error: any) {
        console.error('Failed to delete district secretary:', error);
        toast.error(error?.res?.data?.message || 'Data deleted failed!')
      }
    }
  };

  const handleApproveSecretary = async (secretaryId: string) => {
    try {
      const res = await axios.put(`${baseURL}/district_secretaries/${secretaryId}`, { approvalStatus: 'approved' });
      toast.success(res?.data?.message || 'Data approved!')
      fetchSecretaries()
    } catch (error: any) {
      console.error('Failed to approve district secretary:', error);
      toast.error(error?.res?.data?.message || "Data failed to approve!")
    }
  };

  const handleRejectSecretary = async (secretaryId: string) => {
    if (confirm('Are you sure you want to reject this district secretary registration?')) {
      try {
        const res = await axios.put(`${baseURL}/district_secretaries/${secretaryId}/reject`);
        toast.success(res?.data?.message || 'Data rejected!')
        fetchSecretaries();
      } catch (error: any) {
        console.error('Failed to reject district secretary:', error);
        toast.error(error?.res?.data?.message || "Data failed to reject!")
      }
    }
  };

  const handleViewDocuments = (secretary: DistrictSecretary) => {
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
      districtId: formData.districtId,
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
        const res = await axios.post(`${baseURL}/district_secretaries/register`, payload);
        toast.success(res?.data?.message || "Data added successfully!")
        fetchSecretaries();
      } else if (modalMode === 'edit' && selectedSecretary) {
        const res = await axios.put(`${baseURL}/district_secretaries/${selectedSecretary.districtSecretaryId}`, payload);
        toast.success(res?.data?.message || "Data updated successfully!")
        fetchSecretaries();
      }

      setShowModal(false);
    } catch (error: any) {
      console.error('Error saving district secretary:', error);
      toast.error(error?.res?.data?.message || 'Data failed to add!')
    }
  };

  const columns = [
    { key: 'districtSecretaryId', label: 'District Secretary Id', sortable: true },
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
      render: (value: any, secretary: DistrictSecretary) => {
        console.log('Actions render secretary:', secretary); // Debug
        return (
          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => {
                console.log('View button clicked, secretary:', secretary); // Debug
                handleViewSecretary(secretary);
              }}
              title="View Details"
            >
              <Eye size={16} />
            </Button>
            <Button
              size="sm"
              variant="primary"
              onClick={() => {
                console.log('Edit button clicked, secretary:', secretary); // Debug
                handleEditSecretary(secretary);
              }}
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
                  onClick={() => handleApproveSecretary(secretary.districtSecretaryId)}
                  title="Approve"
                >
                  <CheckCircle size={16} />
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => handleRejectSecretary(secretary.districtSecretaryId)}
                  title="Reject"
                >
                  <XCircle size={16} />
                </Button>
              </>
            )}
            <Button
              size="sm"
              variant="danger"
              onClick={() => handleDeleteSecretary(secretary.districtSecretaryId)}
              title="Delete"
            >
              <Trash2 size={16} />
            </Button>
          </div>
        );
      },
    },
  ];

  const isReadOnly = modalMode === 'view';

  return (
    <div className="space-y-6">
      <div className='flex justify-end'>
        <Button variant="secondary" onClick={() => exportToExcel(districtSecretaries, 'district_secretaries_list')}>
          Export to Excel
        </Button>
      </div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">District Secretaries Management</h1>
          <p className="text-gray-600 mt-1">Manage district secretary registrations and approvals</p>
        </div>
        <Button variant="primary" onClick={handleCreateSecretary}>
          <Plus size={16} className="mr-2" />
          Add New Secretary
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{districtSecretaries.length}</div>
            <div className="text-sm text-gray-600">Total Secretaries</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {districtSecretaries.filter((d) => d.approvalStatus === 'approved').length}
            </div>
            <div className="text-sm text-gray-600">Approved</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {districtSecretaries.filter((d) => d.approvalStatus === 'pending').length}
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
        title={`${modalMode === 'create' ? 'Add New' : modalMode === 'edit' ? 'Edit' : 'View'} Secretary`}
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
                onChange={(e) => {
                  const stateId = parseInt(e.target.value);
                  setFormData({ ...formData, stateId, districtId: undefined });
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                disabled={isReadOnly}
              >
                <option value="">Select State</option>
                {states?.map((state) => (
                  <option key={state.id} value={state.id}>
                    {state.name}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField label="District" required>
              <select
                value={formData.districtId || ''}
                onChange={(e) => setFormData({ ...formData, districtId: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                disabled={isReadOnly || !formData.stateId}
              >
                <option value="">Select District</option>
                {districts
                  ?.filter((district) => district?.stateId === formData.stateId)
                  .map((district) => (
                    <option key={district.id} value={district.id}>
                      {district.name}
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
              label="Profile Image"
              value={formData.certificateUrl}
              onChange={(url) => setFormData({ ...formData, certificateUrl: url })}
              readOnly={isReadOnly}
            uploadUrl={`${baseURL}/upload/image/`}
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
                Approve district secretary registration
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

            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Authorization Letter</h4>
              <div className="text-sm text-gray-600 mb-3">Official authorization document</div>
              <Button size="sm" variant="secondary" disabled>
                <FileText size={16} className="mr-2" />
                View Document (Not Available)
              </Button>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Contact Authorization</h4>
              <div className="text-sm text-gray-600 mb-3">Contact person identification</div>
              <Button size="sm" variant="secondary" disabled>
                <FileText size={16} className="mr-2" />
                View Document (Not Available)
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

export default Districts;