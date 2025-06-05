import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ChevronLeft, Edit2, Trash2, Plus, Clock, Star, ChevronRight, X } from 'lucide-react';

const CategoryItems = () => {
    const { restaurantId, categoryId } = useParams();
    const navigate = useNavigate();
    const [items, setItems] = useState([]);
    const [category, setCategory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: 0,
        active: true,
        foodType: 'veg',
        images: []
    });
    const [imagePreviews, setImagePreviews] = useState([]);
    const [newImages, setNewImages] = useState([]);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                setLoading(true);
                const itemsRes = await axios.get(`http://localhost:5000/admin/restaurant/${restaurantId}/category/${categoryId}`);
                setItems(itemsRes.data.data || []);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch items');
                console.error('Error:', err);
                setLoading(false);
            }
        };

        fetchItems();
    }, [restaurantId, categoryId]);

    const handleDeleteItem = async (itemId) => {
        if (!window.confirm('Are you sure you want to delete this item?')) {
            return;
        }

        try {
            await axios.delete(`http://localhost:5000/admin/restaurant/${restaurantId}/category/${categoryId}/item/${itemId}`);
            setItems(items.filter(item => item._id !== itemId));
        } catch (err) {
            console.error('Error deleting item:', err);
            alert('Failed to delete item. Please try again.');
        }
    };

    const handleEditClick = (item) => {
        setCurrentItem(item);
        setFormData({
            name: item.name,
            description: item.description,
            price: item.price,
            active: item.active,
            foodType: item.foodType,
            images: item.images || []
        });
        setImagePreviews(item.images || []);
        setNewImages([]);
        setShowEditModal(true);
    };

    const handleAddItem = () => {
        navigate(`/restaurants/${restaurantId}/categories/${categoryId}/items/new`);
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setNewImages([...newImages, ...files]);
        
        const previews = files.map(file => URL.createObjectURL(file));
        setImagePreviews([...imagePreviews, ...previews]);
    };

    const removeImage = (index) => {
        const newPreviews = [...imagePreviews];
        const newFiles = [...newImages];
        
        // If it's a new image, remove from files array
        if (index >= formData.images.length) {
            newFiles.splice(index - formData.images.length, 1);
            setNewImages(newFiles);
        }
        
        URL.revokeObjectURL(newPreviews[index]);
        newPreviews.splice(index, 1);
        setImagePreviews(newPreviews);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const formDataToSend = new FormData();
            formDataToSend.append('name', formData.name);
            formDataToSend.append('description', formData.description);
            formDataToSend.append('price', formData.price);
            formDataToSend.append('active', formData.active);
            formDataToSend.append('foodType', formData.foodType);
            
            newImages.forEach(file => {
                formDataToSend.append('images', file);
            });

            const response = await axios.put(
                `http://localhost:5000/admin/restaurant/${restaurantId}/category/${categoryId}/item/${currentItem._id}`,
                formDataToSend,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            setItems(items.map(item => 
                item._id === currentItem._id ? response.data.data : item
            ));
            setShowEditModal(false);
        } catch (err) {
            console.error('Error updating item:', err);
            alert('Failed to update item. Please try again.');
        }
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return <ErrorScreen error={error} />;
    }

    return (
        <div className="min-h-screen bg-[#f8f8f8]">
            {/* Header */}
            <div className="bg-white shadow-sm border-b sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center text-gray-600 hover:text-orange-500 text-sm font-medium"
                        >
                            <ChevronLeft className="h-5 w-5 mr-1" />
                            Back to Categories
                        </button>
                        <h1 className="text-xl font-bold text-gray-900">{category?.name || 'Menu Items'}</h1>
                        <button
                            onClick={handleAddItem}
                            className="flex items-center px-3 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium shadow-sm"
                        >
                            <Plus className="h-4 w-4 mr-1" />
                            Add Item
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main className="max-w-6xl mx-auto px-4 py-8">
                {items.length === 0 ? (
                    <EmptyState onAddItem={handleAddItem} />
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {items.map((item) => (
                            <MenuItemCard 
                                key={item._id}
                                item={item}
                                onEdit={handleEditClick}
                                onDelete={handleDeleteItem}
                            />
                        ))}
                    </div>
                )}
            </main>

            {/* Edit Modal */}
            {showEditModal && (
                <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
                            <h2 className="text-xl font-bold text-gray-800">Edit Menu Item</h2>
                            <button 
                                onClick={() => setShowEditModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Item Name*</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Price*</label>
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        required
                                        value={formData.price}
                                        onChange={(e) => setFormData({...formData, price: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    />
                                </div>
                                
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                    <textarea
                                        rows={3}
                                        value={formData.description}
                                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Food Type</label>
                                    <select
                                        value={formData.foodType}
                                        onChange={(e) => setFormData({...formData, foodType: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    >
                                        <option value="veg">Vegetarian</option>
                                        <option value="non-veg">Non-Vegetarian</option>
                                    </select>
                                </div>
                                
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="active"
                                        checked={formData.active}
                                        onChange={(e) => setFormData({...formData, active: e.target.checked})}
                                        className="h-4 w-4 text-orange-500 rounded focus:ring-orange-500 border-gray-300"
                                    />
                                    <label htmlFor="active" className="ml-2 text-sm text-gray-700">
                                        Available
                                    </label>
                                </div>
                            </div>
                            
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Images</label>
                                <div className="flex flex-wrap gap-3 mb-4">
                                    {imagePreviews.map((src, index) => (
                                        <div key={index} className="relative group">
                                            <div className="w-24 h-24 rounded-lg overflow-hidden border border-gray-200">
                                                <img src={src} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeImage(index)}
                                                className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X className="h-3 w-3 text-gray-600" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                
                                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <Plus className="h-6 w-6 text-gray-400 mb-1" />
                                        <p className="text-sm text-gray-500">Click to upload or drag and drop</p>
                                        <p className="text-xs text-gray-400">PNG, JPG (MAX. 5MB each)</p>
                                    </div>
                                    <input 
                                        type="file" 
                                        className="hidden" 
                                        multiple 
                                        accept="image/*" 
                                        onChange={handleImageChange} 
                                    />
                                </label>
                            </div>
                            
                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setShowEditModal(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

// Sub-components for better organization
const LoadingSpinner = () => (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p>Loading items...</p>
        </div>
    </div>
);

const ErrorScreen = ({ error }) => (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
            <div className="text-6xl mb-4">🍽️</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops! Something went wrong</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
                Try Again
            </button>
        </div>
    </div>
);

const EmptyState = ({ onAddItem }) => (
    <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mb-4">
            <Plus className="h-10 w-10 text-orange-500" />
        </div>
        <h3 className="text-lg font-bold text-gray-800 mb-2">No Items Found</h3>
        <p className="text-gray-500 mb-6 text-sm">This category doesn't have any items yet</p>
        <button
            onClick={onAddItem}
            className="px-5 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium shadow-sm"
        >
            Add New Item
        </button>
    </div>
);

const MenuItemCard = ({ item, onEdit, onDelete }) => (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden relative group border border-gray-100">
        <div className="h-48 w-full relative overflow-hidden">
            {item.images?.length > 0 ? (
                <img
                    src={item.images[0]}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
            ) : (
                <div className="h-full w-full bg-gray-100 flex items-center justify-center">
                    <span className="text-gray-400">No image</span>
                </div>
            )}
            <div className="absolute top-2 left-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    item.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                    {item.active ? 'Available' : 'Unavailable'}
                </span>
            </div>
        </div>

        <div className="p-4">
            <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{item.name}</h3>
                <span className="text-lg font-bold text-orange-500 whitespace-nowrap">
                    ₹{item.price?.toFixed(2) || '0.00'}
                </span>
            </div>

            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {item.description || 'No description available'}
            </p>

            <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                <div className="flex space-x-2">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit(item);
                        }}
                        className="p-1.5 bg-gray-100 rounded-lg hover:bg-gray-200 text-gray-700"
                        title="Edit item"
                    >
                        <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(item._id);
                        }}
                        className="p-1.5 bg-gray-100 rounded-lg hover:bg-gray-200 text-red-500"
                        title="Delete item"
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                    item.foodType === 'veg' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                    {item.foodType === 'veg' ? 'Vegetarian' : 'Non-Vegetarian'}
                </span>
            </div>
        </div>
    </div>
);

export default CategoryItems;