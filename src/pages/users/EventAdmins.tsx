import React, { useEffect, useState } from 'react';
import { Edit, Trash2, Eye, Plus, Shield, UserCheck, UserX, EyeOff } from 'lucide-react';
import Table from '../../components/UI/Table';
import Button from '../../components/UI/Button';
import Badge from '../../components/UI/Badge';
import Card from '../../components/UI/Card';
import Modal from '../../components/UI/Modal';
import FormField from '../../components/UI/FormField';
import { Admin } from '../../types';
import axios from 'axios';

const Admins: React.FC = () => {
  const baseURL = import.meta.env.VITE_API_BASE_URL;
  const [admins, setAdmins] = React.useState<any>([]);
  const [filteredAdmins, setFilteredAdmins] = React.useState<Admin[]>(admins);
  const [sortBy, setSortBy] = React.useState<string>('');
  const [sortOrder, setSortOrder] = React.useState<'asc' | 'desc'>('asc');
  const [showModal, setShowModal] = React.useState(false);
  const [selectedAdmin, setSelectedAdmin] = React.useState<Admin | null>(null);
  const [modalMode, setModalMode] = React.useState<'create' | 'edit' | 'view'>('create');
  const [roleFilter, setRoleFilter] = React.useState<string>('all');
  const [statusFilter, setStatusFilter] = React.useState<string>('all');
  const [showPassword, setShowPassword] = useState(false);
  const [events, setEvents] = React.useState<any[]>([]);
  console.log(admins, "admins");

  useEffect(() => {
    fetchAdmins();
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${baseURL}/events/`);
      setEvents(response.data);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    }
  };

  const fetchAdmins = async () => {
    try {
      const response = await axios.get(`${baseURL}/eventAdmin/`);
      setAdmins(response.data);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    }
  };

  const [formData, setFormData] = React.useState({
    role: 'eventAdmin',
    email: '',
    phone: '',
    password: '',
    eventId: ''
  });

  const resetModal = () => {
  setShowModal(false);
  setSelectedAdmin(null);
  setFormData({
    role: 'eventAdmin',
    email: '',
    phone: '',
    password: '',
    eventId: ''
  });
};

  const availablePermissions = [
    'user_management',
    'event_management',
    'results_management',
    'approval_management',
    'system_settings',
    'reports_access',
    'gallery_management',
    'news_management'
  ];

  React.useEffect(() => {
    let filtered = admins;

    if (roleFilter !== 'all') {
      filtered = filtered.filter((admin:any)=> admin.role === roleFilter);
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((admin:any)=>
        statusFilter === 'approved' ? admin.approved : !admin.approved
      );
    }

    setFilteredAdmins(filtered);
  }, [admins, roleFilter, statusFilter]);

  const handleSort = (key: string) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(key);
      setSortOrder('asc');
    }

    const sorted = [...filteredAdmins].sort((a, b) => {
      const aValue = a[key as keyof Admin];
      const bValue = b[key as keyof Admin];

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredAdmins(sorted);
  };

  const handleSearch = (query: string) => {
    let filtered = admins.filter((admin:any)=>
      admin.name.toLowerCase().includes(query.toLowerCase()) ||
      admin.email.toLowerCase().includes(query.toLowerCase()) ||
      admin.adminId.toLowerCase().includes(query.toLowerCase()) ||
      admin.role.toLowerCase().includes(query.toLowerCase())
    );

    if (roleFilter !== 'all') {
      filtered = filtered.filter((admin:any)=> admin.role === roleFilter);
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((admin:any)=>
        statusFilter === 'approved' ? admin.approved : !admin.approved
      );
    }

    setFilteredAdmins(filtered);
  };

  const handleCreateAdmin = () => {
    setSelectedAdmin(null);
    setModalMode('create');
    setFormData({
      role: formData.role,
      email: formData.email,
      phone: formData.phone,
      password: formData?.password,
      eventId: formData.eventId
    });
    setShowModal(true);
  };

  const handleViewAdmin = (admin: any) => {
    setSelectedAdmin(admin);
    setModalMode('view');
    setFormData({
      role: admin.role || '',
      email: admin.email || '',
      phone: admin.mobileNumber || '',
      password: '', // Don't show password
      eventId: admin.eventId || ''
    });
    setShowModal(true);
  };
  const handleEditAdmin = (admin: any) => {
    setSelectedAdmin(admin);
    setModalMode('edit');
    setFormData({
      role: admin.role || '',
      email: admin.email || '',
      phone: admin.mobileNumber || '',
      password: '', // let user retype if needed
      eventId: admin.eventId || ''
    });
    setShowModal(true);
  };

  const handleDeleteAdmin = async (adminId: string) => {
    const confirmDelete = confirm('Are you sure you want to delete this admin?');
    if (!confirmDelete) return;

    try {
      await axios.delete(`${baseURL}/eventAdmin/${adminId}`);
      await fetchAdmins(); // Re-fetch the list after deletion
    } catch (error) {
      console.error('Failed to delete admin:', error);
      alert('Something went wrong while deleting the admin.');
    }
  };
  const handleApproveAdmin = (adminId: string) => {
    setAdmins((prev:any)=> prev.map((a:any) =>
      a.id === adminId ? { ...a, approved: true } : a
    ));
  };

  const handleRejectAdmin = (adminId: string) => {
    if (confirm('Are you sure you want to reject this (admin:any)registration?')) {
      setAdmins((prev:any)=> prev.filter((a:any) => a.id !== adminId));
    }
  };

  const handlePermissionChange = (permission: string) => {
    setFormData((prev:any)=> ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter((p:any) => p !== permission)
        : [...prev.permissions, permission]
    }));
  };

  const handleSaveAdmin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (modalMode === 'create') {
      const payload = {
        role: formData.role,
        email: formData.email,
        mobileNumber: formData.phone,
        password: formData.password,
        eventId: formData.eventId,
        name: '',
      };
      await axios.post(`${baseURL}/eventAdmin/`, payload);
    } else if (modalMode === 'edit' && selectedAdmin) {
      const payload = {
        role: formData.role,
        email: formData.email,
        mobileNumber: formData.phone,
        password: formData.password, // Include if user updated it
        eventId: formData.eventId
      };
      await axios.put(`${baseURL}/eventAdmin/${selectedAdmin.id}`, payload);
    }

    await fetchAdmins(); // refresh the list
   resetModal();
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'super_admin': return 'danger';
      case 'admin': return 'warning';
      case 'moderator': return 'info';
      default: return 'default';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'super_admin': return 'Super Admin';
      case 'admin': return 'Admin';
      case 'moderator': return 'Moderator';
      default: return role;
    }
  };

  const columns = [
    { key: 'id', label: 'Admin ID', sortable: true },
    { key: 'username', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'mobileNumber', label: 'Phone', sortable: true },
    {
      key: 'role',
      label: 'Role',
      sortable: true,
      render: (value: string) => (
        <Badge variant={getRoleColor(value) as any} size="sm">
          {getRoleLabel(value)}
        </Badge>
      )
    },

    {
      key: 'actions',
      label: 'Actions',
      render: (value: any, admin: any) => (
        <div className="flex items-center space-x-2">
          <Button size="sm" variant="secondary" onClick={() => handleViewAdmin(admin)} title="View Details">
            <Eye size={16} />
          </Button>
          <Button size="sm" variant="primary" onClick={() => handleEditAdmin(admin)} title="Edit Admin">
            <Edit size={16} />
          </Button>

          <Button size="sm" variant="danger" onClick={() => handleDeleteAdmin(admin.id)} title="Delete">
            <Trash2 size={16} />
          </Button>
        </div>
      )
    }
  ];

  const isReadOnly = modalMode === 'view';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admins Management</h1>
          <p className="text-gray-600 mt-1">Manage system administrators and their permissions</p>
        </div>
        <Button variant="primary" onClick={handleCreateAdmin}>
          <Plus size={16} className="mr-2" />
          Add New Admin
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{admins?.length}</div>
            <div className="text-sm text-gray-600">Total Admins</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{admins.filter((a:any) => a.role === 'super_admin').length}</div>
            <div className="text-sm text-gray-600">Super Admins</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{admins.filter((a:any)=> a.role === 'admin').length}</div>
            <div className="text-sm text-gray-600">Admins</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{admins.filter((a:any) => a.role === 'moderator').length}</div>
            <div className="text-sm text-gray-600">Moderators</div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Role:</span>
            <div className="flex space-x-2">
              {[
                { value: 'all', label: 'All Roles' },
                { value: 'super_admin', label: 'Super Admin' },
                { value: 'admin', label: 'Admin' },
                { value: 'moderator', label: 'Moderator' }
              ].map(role => (
                <button
                  key={role.value}
                  onClick={() => setRoleFilter(role.value)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${roleFilter === role.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  {role.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Status:</span>
            <div className="flex space-x-2">
              {[
                { value: 'all', label: 'All Status' },
                { value: 'approved', label: 'Approved' },
                { value: 'pending', label: 'Pending' }
              ].map(status => (
                <button
                  key={status.value}
                  onClick={() => setStatusFilter(status.value)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${statusFilter === status.value
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  {status.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <Table
          columns={columns}
          data={filteredAdmins}
          searchable
          searchPlaceholder="Search admins..."
          // onSearch={handleSearch}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={handleSort}
        />
      </Card>

      {/* Create/Edit/View Modal */}
      <Modal
        isOpen={showModal}
        onClose={resetModal}
        title={`${modalMode === 'create' ? 'Add New' : modalMode === 'edit' ? 'Edit' : 'View'} Admin`}
        size="xl"
      >
        <form onSubmit={handleSaveAdmin} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* <FormField label="Full Name" required>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter full name"
                required
                readOnly={isReadOnly}
              />
            </FormField> */}

            <FormField label="Email Address" required>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter email address"
                required
                readOnly={isReadOnly}
              />
            </FormField>

            <FormField label="Phone Number" required>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter phone number"
                required
                readOnly={isReadOnly}
              />
            </FormField>
            <FormField label="Password" required>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Enter Password"
                  className="w-full px-3 py-2 border rounded-lg pr-10"
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


          

            <FormField label="Role" required>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                disabled={isReadOnly}
              >
                <option value="eventAdmin">Event Admin</option>
              </select>
            </FormField>

        

            <FormField label="Event" required>
              <select
                value={formData.eventId}
                onChange={(e) => setFormData({ ...formData, eventId: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                disabled={isReadOnly}
              >
                <option value="">Select Event</option>
                {events.map((event: any) => (
                  <option key={event.id} value={event.id}>
                  {event.name}
                  </option>
                ))}
              </select>
            </FormField>
          </div>

       

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button variant="secondary" onClick={resetModal}>
              {modalMode === 'view' ? 'Close' : 'Cancel'}
            </Button>
            {modalMode !== 'view' && (
              <Button type="submit">
                {modalMode === 'create' ? 'Create Admin' : 'Update Admin'}
              </Button>
            )}
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Admins;