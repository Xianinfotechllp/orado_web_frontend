import { useState } from 'react';
import { FiPlus, FiSearch, FiEdit2, FiTrash2, FiArchive, FiRefreshCw } from 'react-icons/fi';
import { BsThreeDotsVertical, BsArrowUp, BsArrowDown } from 'react-icons/bs';

const CatalogPage = () => {
  const [categories, setCategories] = useState([
    { id: 1, name: 'Green Produce', active: true },
    { id: 2, name: 'Dessert', active: false },
    { id: 3, name: 'Arabian', active: false }
  ]);

  const [products, setProducts] = useState([
    { id: 1, name: 'Zuchinni rolls', price: 400.00, description: 'Zucchini rolls filled with creamy chicken and home made cream cheese', categoryId: 1, active: true, image: 'https://d2sz1kgdtrlf1n.cloudfront.net/yelo_products/thumb-250-250-4a7ngjwkC5631tdiulD43n3rxi7u4qv8xbmh5gdl377je668k7n4gkO1715190210987-3bo3l33gQlkgffd4zpjp930t2sBa9m206o716ky29mljf.png' },
    { id: 2, name: 'Beef Pastrami Sourdough Sandwich', price: 350.00, description: 'Delicious beef pastrami on fresh sourdough bread', categoryId: 1, active: false },
    { id: 3, name: 'Green Beans and Chicken', price: 320.00, description: 'Fresh green beans with grilled chicken', categoryId: 1, active: false },
    { id: 4, name: 'Immune Charger Juice', price: 180.00, description: 'Healthy juice to boost your immunity', categoryId: 2, active: false },
    { id: 5, name: 'Fit for a King Smoothie', price: 200.00, description: 'Nutritious smoothie with fruits and protein', categoryId: 2, active: false },
    { id: 6, name: 'Shawarma', price: 250.00, description: 'Traditional Arabian shawarma wrap', categoryId: 3, active: false }
  ]);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    description: '',
    categoryId: 1
  });

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
  };

  const handleAddProduct = () => {
    const product = {
      id: products.length + 1,
      ...newProduct,
      price: parseFloat(newProduct.price),
      active: false,
      image: 'https://via.placeholder.com/250'
    };
    setProducts([...products, product]);
    setNewProduct({
      name: '',
      price: '',
      description: '',
      categoryId: 1
    });
    setShowAddProductModal(false);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm p-4 flex justify-between items-center">
        <div className="flex items-center">
          <div className="bg-gray-200 rounded-full p-2 mr-3">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24C18.6274 24 24 18.6274 24 12Z" fill="#E3E7EA"/>
              <path d="M9 12.75H11.25V13.5H9V12.75ZM9 14.25H12.75V15H9V14.25Z" fill="black"/>
              <path d="M15.75 7.5H8.25C8.05109 7.50031 7.8606 7.57941 7.72 7.72C7.57941 7.8606 7.50031 8.05109 7.5 8.25V15.75C7.50031 15.9489 7.57941 16.1394 7.72 16.28C7.8606 16.4206 8.05109 16.4997 8.25 16.5H15.75C15.9489 16.4997 16.1394 16.4206 16.28 16.28C16.4206 16.1394 16.4997 15.9489 16.5 15.75V8.25C16.4997 8.05109 16.4206 7.8606 16.28 7.72C16.1394 7.57941 15.9489 7.50031 15.75 7.5ZM12.75 8.25V9.75H11.25V8.25H12.75ZM8.25 15.75V8.25H10.5V10.5H13.5V8.25H15.75L15.7503 15.75H8.25Z" fill="black"/>
            </svg>
          </div>
          <h1 className="text-xl font-semibold">Products</h1>
        </div>
        <div className="relative">
          <select className="bg-gray-100 border border-gray-300 rounded-md px-4 py-2 pr-8 appearance-none">
            <option>Green Treat</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 border-b flex justify-between items-center">
        <div className="flex space-x-2">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            Clear All
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            Layout
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            Import/Export
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            Add ons
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            Snooze
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 border-b flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <span className="text-sm">Filter products</span>
          <ul className="flex space-x-4">
            <li className="text-blue-600 border-b-2 border-blue-600 pb-1">Approved</li>
            <li className="text-gray-500 hover:text-blue-600 cursor-pointer">Pending</li>
            <li className="text-gray-500 hover:text-blue-600 cursor-pointer">Rejected</li>
          </ul>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm">Show Items</span>
          <select className="bg-gray-100 border border-gray-300 rounded-md px-2 py-1">
            <option>All</option>
            <option>10</option>
            <option>25</option>
            <option>50</option>
          </select>
          <select className="bg-gray-100 border border-gray-300 rounded-md px-2 py-1">
            <option>English</option>
          </select>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-4 border-b relative">
        <div className="relative">
          <FiSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search Product"
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Categories Column */}
        <div className="w-1/4 bg-white border-r overflow-y-auto">
          <div className="p-4 border-b flex justify-between items-center">
            <p className="font-medium">Category ({categories.length})</p>
            <button 
              className="text-blue-600 hover:text-blue-800"
              onClick={() => {/* Add category logic */}}
            >
              <FiPlus size={20} />
            </button>
          </div>
          <ul className="divide-y">
            {categories.map((category) => (
              <li 
                key={category.id} 
                className={`p-4 hover:bg-gray-50 cursor-pointer flex justify-between items-center ${category.active ? 'bg-blue-50' : ''}`}
              >
                <span className="truncate">{category.name}</span>
                <div className="flex items-center space-x-2">
                  <BsThreeDotsVertical className="text-gray-500 hover:text-gray-700 cursor-pointer" />
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Products Column */}
        <div className="w-1/3 bg-white border-r overflow-y-auto">
          <div className="p-4 border-b flex justify-between items-center">
            <p className="font-medium">Product ({products.length})</p>
            <div className="flex items-center space-x-2">
              <FiSearch className="text-gray-500 hover:text-gray-700 cursor-pointer" />
              <div className="relative group">
                <BsThreeDotsVertical className="text-gray-500 hover:text-gray-700 cursor-pointer" />
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 hidden group-hover:block">
                  <div className="py-1">
                    <button className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                      <FiPlus className="mr-2" /> Add
                    </button>
                    <button className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                      <div className="flex items-center mr-2">
                        <BsArrowUp size={14} className="mr-1" />
                        <BsArrowDown size={14} />
                      </div>
                      Move products
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <ul className="divide-y">
            {products.map((product) => (
              <li 
                key={product.id} 
                className={`p-4 hover:bg-gray-50 cursor-pointer flex justify-between items-center ${selectedProduct?.id === product.id ? 'bg-blue-50' : ''}`}
                onClick={() => handleProductSelect(product)}
              >
                <span className="truncate">{product.name}</span>
                <div className="flex items-center space-x-2">
                  <BsThreeDotsVertical className="text-gray-500 hover:text-gray-700 cursor-pointer" />
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Product Details Column */}
        <div className="flex-1 bg-white overflow-y-auto">
          {selectedProduct ? (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Product Details</h2>
                <button className="text-blue-600 hover:text-blue-800">
                  <FiRefreshCw size={20} />
                </button>
              </div>

              <div className="flex mb-6">
                <div className="w-32 h-32 rounded-md overflow-hidden mr-4">
                  <img 
                    src={selectedProduct.image} 
                    alt={selectedProduct.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{selectedProduct.name}</h3>
                  <p className="text-gray-700 font-medium mb-2">${selectedProduct.price.toFixed(2)}</p>
                  <p className="text-gray-600">{selectedProduct.description}</p>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-medium">INVENTORY</h4>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="text-sm text-gray-600">QUANTITY</p>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-2">0</span>
                    <button className="text-blue-600 hover:text-blue-800">
                      <FiEdit2 size={18} />
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-600">Alert</p>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-2"></span>
                    <button className="text-blue-600 hover:text-blue-800">
                      <FiEdit2 size={18} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-medium mb-2">Long Description</h4>
                <p className="text-gray-600">{selectedProduct.description}</p>
              </div>

              <div className="mb-6">
                <h4 className="font-medium mb-2">Variants/Add-ons</h4>
                <p className="text-gray-500">No Variants/Add-ons assigned</p>
              </div>

              <div className="flex justify-end">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                  Assign
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <p className="text-gray-500 mb-4">Select a product to view details</p>
                <button 
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                  onClick={() => setShowAddProductModal(true)}
                >
                  Add New Product
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Product Modal */}
      {showAddProductModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Add New Product</h2>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Name</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newProduct.name}
                onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Price</label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newProduct.price}
                onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Description</label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                value={newProduct.description}
                onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
              ></textarea>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Category</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newProduct.categoryId}
                onChange={(e) => setNewProduct({...newProduct, categoryId: parseInt(e.target.value)})}
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
                onClick={() => setShowAddProductModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                onClick={handleAddProduct}
              >
                Add Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CatalogPage;