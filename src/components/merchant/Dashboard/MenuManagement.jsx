import React, { useState } from 'react';

const mockMenuItems = [
  {
    id: '1',
    name: 'Butter Chicken',
    description: 'Creamy tomato-based chicken curry with aromatic spices',
    price: 320,
    image: '/placeholder.svg',
    category: 'Main Course',
    available: true,
  },
  {
    id: '2',
    name: 'Margherita Pizza',
    description: 'Classic pizza with fresh mozzarella, tomatoes, and basil',
    price: 280,
    image: '/placeholder.svg',
    category: 'Pizza',
    available: true,
  },
  {
    id: '3',
    name: 'Chicken Biryani',
    description: 'Aromatic basmati rice with spiced chicken and herbs',
    price: 350,
    image: '/placeholder.svg',
    category: 'Rice',
    available: false,
  },
  {
    id: '4',
    name: 'Paneer Tikka',
    description: 'Grilled cottage cheese marinated in spices',
    price: 250,
    image: '/placeholder.svg',
    category: 'Appetizer',
    available: true,
  },
];

const MenuManagement = () => {
  const [menuItems, setMenuItems] = useState(mockMenuItems);

  const handleDelete = (id) => {
    setMenuItems(items => items.filter(item => item.id !== id));
  };

  const toggleAvailability = (id) => {
    setMenuItems(items => 
      items.map(item => 
        item.id === id ? { ...item, available: !item.available } : item
      )
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
      
        <button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-4 py-2 rounded-md flex items-center">
          <span className="w-4 h-4 mr-2">+</span>
          Add New Item
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menuItems.map((item) => (
          <div key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow border rounded-lg">
            <div className="relative">
              <div className="aspect-w-1 aspect-h-1 bg-gray-100">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute top-2 right-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  item.available ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'
                }`}>
                  {item.available ? 'Available' : 'Unavailable'}
                </span>
              </div>
            </div>
            
            <div className="p-4">
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <h3 className="font-semibold text-lg text-gray-900">{item.name}</h3>
                  <span className="text-lg font-bold text-orange-600">₹{item.price}</span>
                </div>
                
                <p className="text-gray-600 text-sm line-clamp-2">{item.description}</p>
                
                <span className="inline-block px-2 py-1 text-xs border rounded-full">
                  {item.category}
                </span>
                
                <div className="flex gap-2 pt-2">
                  <button 
                    className="flex-1 border px-3 py-1 text-sm rounded-md"
                    onClick={() => toggleAvailability(item.id)}
                  >
                    {item.available ? 'Mark Unavailable' : 'Mark Available'}
                  </button>
                  
                  <button className="border px-3 py-1 text-sm rounded-md">
                    <span className="w-4 h-4">✏️</span>
                  </button>
                  
                  <button 
                    className="border px-3 py-1 text-sm rounded-md text-red-600 hover:text-red-700"
                    onClick={() => handleDelete(item.id)}
                  >
                    <span className="w-4 h-4">🗑️</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuManagement