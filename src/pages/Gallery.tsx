import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Upload, Image as ImageIcon } from 'lucide-react';
import Button from '../components/UI/Button';
import Card from '../components/UI/Card';
import Modal from '../components/UI/Modal';
import FormField from '../components/UI/FormField';
import axios from 'axios';
import ImageUpload from '../components/UI/ImageUpload';

interface GalleryItem {
  id: string | number;
  title: string;
  description: string;
  imageUrl: string;
  category: 'event' | 'training' | 'competition' | 'general';
  uploadedAt: string;
  uploadedBy: string;
}

const API_BASE = `${import.meta.env.VITE_API_BASE_URL}/gallery`;

const Gallery: React.FC = () => {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    category: 'general' as GalleryItem['category']
  });

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'event', label: 'Events' },
    { value: 'training', label: 'Training' },
    { value: 'competition', label: 'Competitions' },
    { value: 'general', label: 'General' }
  ];

  // ✅ Fetch gallery items
  const fetchGalleryItems = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (selectedCategory !== 'all') params.category = selectedCategory;
      const response = await axios.get(API_BASE + '/', { params });
      setGalleryItems(response.data);
    } catch (error) {
      console.error('Error fetching gallery:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGalleryItems();
  }, [selectedCategory]);

  // ✅ Handle Create/Edit Save
  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (modalMode === 'create') {
        await axios.post(API_BASE + '/', {
          ...formData,
          uploadedBy: 'admin' // Or get from auth context
        });
      } else if (modalMode === 'edit' && selectedItem) {
        await axios.put(`${API_BASE}/${selectedItem.id}`, {
          title: formData.title,
          description: formData.description,
          imageUrl: formData.imageUrl,
          category: formData.category
        });
      }
      setShowModal(false);
      fetchGalleryItems();
    } catch (error) {
      console.error('Error saving gallery item:', error);
    }
  };

  // ✅ Handle Delete
  const handleDeleteItem = async (itemId: string | number) => {
    if (confirm('Are you sure you want to delete this image?')) {
      try {
        await axios.delete(`${API_BASE}/${itemId}`);
        fetchGalleryItems();
      } catch (error) {
        console.error('Error deleting item:', error);
      }
    }
  };

  // ✅ Open Create Modal
  const handleCreateItem = () => {
    setSelectedItem(null);
    setModalMode('create');
    setFormData({
      title: '',
      description: '',
      imageUrl: '',
      category: 'general'
    });
    setShowModal(true);
  };

  // ✅ Open Edit Modal
  const handleEditItem = (item: GalleryItem) => {
    setSelectedItem(item);
    setModalMode('edit');
    setFormData({
      title: item.title,
      description: item.description,
      imageUrl: item.imageUrl,
      category: item.category
    });
    setShowModal(true);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'event': return 'bg-blue-100 text-blue-800';
      case 'training': return 'bg-green-100 text-green-800';
      case 'competition': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gallery Management</h1>
          <p className="text-gray-600 mt-1">Manage sports event photos and media</p>
        </div>
        <Button variant="primary" onClick={handleCreateItem}>
          <Plus size={16} className="mr-2" />
          Add New Image
        </Button>
      </div>

      {/* Category Filter */}
      <Card>
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category.value}
              onClick={() => setSelectedCategory(category.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedCategory === category.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </Card>

      {/* Gallery Grid */}
      {loading ? (
        <p className="text-center py-4">Loading gallery...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {galleryItems.map(item => (
            <Card key={item.id} className="overflow-hidden">
              <div className="relative">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 right-2 flex space-x-1">
                  <Button size="sm" variant="secondary" onClick={() => handleEditItem(item)}>
                    <Edit size={14} />
                  </Button>
                  <Button size="sm" variant="danger" onClick={() => handleDeleteItem(item.id)}>
                    <Trash2 size={14} />
                  </Button>
                </div>
                <div className="absolute bottom-2 left-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(item.category)}`}>
                    {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.description}</p>
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>By {item.uploadedBy}</span>
                  <span>{new Date(item.uploadedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {galleryItems.length === 0 && !loading && (
        <Card>
          <div className="text-center py-12">
            <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No images found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {selectedCategory === 'all'
                ? 'Get started by adding your first image.'
                : `No images found in the ${selectedCategory} category.`}
            </p>
          </div>
        </Card>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={`${modalMode === 'create' ? 'Add New' : 'Edit'} Image`}
        size="lg"
      >
        <form onSubmit={handleSaveItem} className="space-y-4">
          <FormField label="Title" required>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter image title"
              required
            />
          </FormField>

          <FormField label="Description">
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              placeholder="Enter image description"
            />
          </FormField>

          <FormField label="Category" required>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as GalleryItem['category'] })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="general">General</option>
              <option value="event">Event</option>
              <option value="training">Training</option>
              <option value="competition">Competition</option>
            </select>
          </FormField>

          {/* <FormField label="Image URL" required>
            <input
              type="url"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter image URL"
              required
            />
          </FormField> */}
          <ImageUpload
            label="Image"
            value={formData.imageUrl}
            onChange={(url) => setFormData({ ...formData, imageUrl: url })}
            // readOnly={isReadOnly}
            uploadUrl={`${import.meta.env.VITE_API_BASE_URL}/upload/image/`}
          />

          {/* <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-600">Or click to upload image</p>
            <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
          </div> */}

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {modalMode === 'create' ? 'Add Image' : 'Update Image'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Gallery;
