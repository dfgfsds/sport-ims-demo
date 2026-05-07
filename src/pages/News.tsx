import React, { useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit, Trash2, Eye, Calendar, User } from 'lucide-react';
import Button from '../components/UI/Button';
import Card from '../components/UI/Card';
import Badge from '../components/UI/Badge';
import Modal from '../components/UI/Modal';
import FormField from '../components/UI/FormField';
import ImageUpload from '../components/UI/ImageUpload';
import { toast } from 'react-toastify';

interface NewsArticle {
  id: number;
  title: string;
  content: string;
  excerpt: string;
  category: string;
  status: 'draft' | 'published';
  publishedAt: string;
  author: string;
  imageUrl?: string;
  featured: boolean;
}

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/news`;

const News: React.FC = () => {
  const [newsArticles, setNewsArticles] = React.useState<any>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const [showModal, setShowModal] = React.useState(false);
  const [selectedArticle, setSelectedArticle] = React.useState<NewsArticle | null>(null);
  const [modalMode, setModalMode] = React.useState<'create' | 'edit' | 'view'>('create');
  const [selectedCategory, setSelectedCategory] = React.useState<string>('all');
  const [selectedStatus, setSelectedStatus] = React.useState<string>('all');

  const [formData, setFormData] = React.useState({
    title: '',
    content: '',
    excerpt: '',
    category: 'general',
    status: 'draft' as 'draft' | 'published',
    imageUrl: '',
    featured: false
  });

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'announcement', label: 'Announcements' },
    { value: 'event', label: 'Events' },
    { value: 'result', label: 'Results' },
    { value: 'general', label: 'General' }
  ];

  const statuses = [
    { value: 'all', label: 'All Status' },
    { value: 'draft', label: 'Draft' },
    { value: 'published', label: 'Published' }
  ];

  /** ✅ Fetch Articles from API */
  const fetchNews = async () => {
    setLoading(true);
    setError(null);
    try {
      const params: any = {};
      if (selectedCategory !== 'all') params.category = selectedCategory;
      if (selectedStatus !== 'all') params.status = selectedStatus;

      const response = await axios.get(`${API_BASE_URL}/`, { params });
      setNewsArticles(response.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load news articles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, [selectedCategory, selectedStatus]);

  const handleCreateArticle = () => {
    setSelectedArticle(null);
    setModalMode('create');
    setFormData({
      title: '',
      content: '',
      excerpt: '',
      category: 'general',
      status: 'draft',
      imageUrl: '',
      featured: false
    });
    setShowModal(true);
  };

  const handleViewArticle = (article: any) => {
    setSelectedArticle(article);
    setModalMode('view');
    setFormData({ ...article });
    setShowModal(true);
  };

  const handleEditArticle = (article: any) => {
    setSelectedArticle(article);
    setModalMode('edit');
    setFormData({ ...article });
    setShowModal(true);
  };

  /** ✅ Delete Article */
  const handleDeleteArticle = async (id: number) => {
    if (confirm('Are you sure you want to delete this article?')) {
      try {
       const res= await axios.delete(`${API_BASE_URL}/${id}`);
       toast.success(res?.data?.message || 'Data deleted successfully!')
        fetchNews()
      } catch (err) {
        alert('Failed to delete article');
      }
    }
  };

  /** ✅ Create or Update Article */
  const handleSaveArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (modalMode === 'create') {
        const response = await axios.post(`${API_BASE_URL}/`, {
          ...formData,
          author: 'Current User'
        });
        toast.success(response?.data?.message || 'Data added successfully!')
        fetchNews()
      } else if (modalMode === 'edit' && selectedArticle) {
        const response = await axios.put(`${API_BASE_URL}/${selectedArticle.id}`, formData);
         toast.success(response?.data?.message || 'Data updated successfully!')
        fetchNews()
      }
      setShowModal(false);
    } catch (err) {
      alert('Failed to save article');
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'announcement': return 'info';
      case 'event': return 'warning';
      case 'result': return 'success';
      default: return 'default';
    }
  };

  const getStatusColor = (status: string) => (status === 'published' ? 'success' : 'warning');
  const isReadOnly = modalMode === 'view';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">News Management</h1>
        <Button variant="primary" onClick={handleCreateArticle}>
          <Plus size={16} className="mr-2" /> Create Article
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex gap-4">
          {categories.map(cat => (
            <button key={cat.value} onClick={() => setSelectedCategory(cat.value)}
              className={`px-3 py-1 rounded ${selectedCategory === cat.value ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
              {cat.label}
            </button>
          ))}
          {statuses.map(stat => (
            <button key={stat.value} onClick={() => setSelectedStatus(stat.value)}
              className={`px-3 py-1 rounded ${selectedStatus === stat.value ? 'bg-green-600 text-white' : 'bg-gray-200'}`}>
              {stat.label}
            </button>
          ))}
        </div>
      </Card>

      {/* Articles */}
      {loading ? (
        <p>Loading articles...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {newsArticles.map((article: any) => (
            <Card key={article.id}>
              {article.imageUrl && <img src={article.imageUrl} alt={article.title} className="h-48 w-full object-cover" />}
              <div className="p-4">
                <h3 className="font-semibold">{article.title}</h3>
                <p className="text-sm">{article.excerpt}</p>
                <div className="flex justify-between mt-3 text-xs text-gray-500">
                  <span>{article.author}</span>
                  <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                </div>
                <div className="flex gap-2 mt-3">
                  <Button size="sm" variant="secondary" onClick={() => handleViewArticle(article)}><Eye size={14} /></Button>
                  <Button size="sm" variant="primary" onClick={() => handleEditArticle(article)}><Edit size={14} /></Button>
                  <Button size="sm" variant="danger" onClick={() => handleDeleteArticle(article.id)}><Trash2 size={14} /></Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={`${modalMode === 'create' ? 'Create New' : modalMode === 'edit' ? 'Edit' : 'View'} Article`}
        size="2xl"
      >
        <form onSubmit={handleSaveArticle} className="space-y-4">
          <FormField label="Title" required>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter article title"
              required
              readOnly={isReadOnly}
            />
          </FormField>

          <FormField label="Excerpt" required>
            <textarea
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={2}
              placeholder="Enter brief excerpt"
              required
              readOnly={isReadOnly}
            />
          </FormField>

          <FormField label="Content" required>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={8}
              placeholder="Enter full article content"
              required
              readOnly={isReadOnly}
            />
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Category" required>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as NewsArticle['category'] })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                disabled={isReadOnly}
              >
                <option value="general">General</option>
                <option value="announcement">Announcement</option>
                <option value="event">Event</option>
                <option value="result">Result</option>
              </select>
            </FormField>

            <FormField label="Status" required>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as NewsArticle['status'] })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                disabled={isReadOnly}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </FormField>
          </div>

          {/* <FormField label="Featured Image URL">
            <input
              type="url"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter image URL"
              readOnly={isReadOnly}
            />
          </FormField> */}
          <ImageUpload
            label="Image"
            value={formData.imageUrl}
            onChange={(url) => setFormData({ ...formData, imageUrl: url })}
            // readOnly={isReadOnly}
            uploadUrl={`${import.meta.env.VITE_API_BASE_URL}/upload/image/`}
          />

          {modalMode !== 'view' && (
            <div className="flex items-center">
              <input
                type="checkbox"
                id="featured"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <label htmlFor="featured" className="ml-2 text-sm text-gray-700">
                Mark as featured article
              </label>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              {modalMode === 'view' ? 'Close' : 'Cancel'}
            </Button>
            {modalMode !== 'view' && (
              <Button type="submit">
                {modalMode === 'create' ? 'Create Article' : 'Update Article'}
              </Button>
            )}
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default News;
