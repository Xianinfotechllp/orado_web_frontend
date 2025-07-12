import { useState } from "react";
import {
  FiChevronLeft,
  FiChevronDown,
  FiUpload,
  FiX,
  FiInfo,
} from "react-icons/fi";
import { FaAngleLeft } from "react-icons/fa";

const AddProductPage = ({
  onClose,
  merchantName = "meatshop",
  onAddProduct,
}) => {
  const [formData, setFormData] = useState({
    productName: "",
    searchTags: [],
    price: "",
    minimumQuantity: "",
    maximumQuantity: "",
    costPrice: "",
    sku: "",
    discount: "",
    oftenBoughtTogether: [],
    preparationTime: "",
    isRecurringEnabled: false,
    description: "",
    longDescription: "",
    specialPriceEnabled: false,
    specialQuantity: "",
    specialPrice: "",
    boltPrice: "",
    images: [],
    availability: "always", // Initialize with default value
    availableFromTime: "17:00", // Default time
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleTagAdd = (tag) => {
    setFormData((prev) => ({
      ...prev,
      searchTags: [...prev.searchTags, tag],
    }));
  };

  const handleTagRemove = (index) => {
    setFormData((prev) => ({
      ...prev,
      searchTags: prev.searchTags.filter((_, i) => i !== index),
    }));
  };

  const handleImageUpload = (e) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...files],
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Product data:", formData);
    // Call the onAddProduct prop with the form data
    if (onAddProduct) {
      onAddProduct(formData);
    }
    onClose();
  };

  const handleAvailabilityChange = (e) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      availability: value,
      availableFromTime:
        value === "scheduled" ? prev.availableFromTime || "17:00" : "",
    }));
  };

  const handleTimeChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      availableFromTime: e.target.value,
    }));
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Blurred Backdrop */}
      <div
        className="fixed inset-0 bgOp  backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal Container */}
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Modal Content */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-6xl sm:w-full relative">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition-colors"
          >
            <FiX className="text-gray-600 text-lg" />
          </button>

          {/* Content */}
          <div className="container mx-auto px-4 py-6 bg-gray-50">
            {/* Header Section */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <div className="flex items-center mb-4 md:mb-0">
                  <button
                    onClick={onClose}
                    className="mr-4 text-gray-600 hover:text-gray-800"
                  >
                    <FaAngleLeft className="text-2xl" />
                  </button>
                  <div>
                    <h1 className="text-xl font-semibold">Add Product</h1>
                    <p className="text-gray-600">in {merchantName}</p>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-2">
                  <div className="mr-4">
                    <div className="relative">
                      <select
                        className="w-full p-2 border rounded-md bg-white"
                        disabled
                      >
                        <option>English</option>
                      </select>
                      <FiChevronDown className="absolute right-3 top-3 text-gray-500" />
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={onClose}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSubmit}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              {/* Form Section */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-4">
                    {/* Product Name */}
                    <div className="form-group">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Product Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="productName"
                        value={formData.productName}
                        onChange={handleChange}
                        maxLength={180}
                        placeholder="Please enter name"
                        className="w-full p-2 border rounded-md"
                        required
                      />
                    </div>

                    {/* Search Tags */}
                    <div className="form-group">
                      <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                        Search Tag{" "}
                        <FiInfo
                          className="ml-2 text-gray-500"
                          title="Add tags to help customers find this product"
                        />
                      </label>
                      <div className="flex flex-wrap items-center border rounded-md p-1 min-h-10">
                        {formData.searchTags.map((tag, index) => (
                          <div
                            key={index}
                            className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md m-1 flex items-center"
                          >
                            {tag}
                            <button
                              type="button"
                              onClick={() => handleTagRemove(index)}
                              className="ml-1 text-blue-600 hover:text-blue-800"
                            >
                              <FiX size={14} />
                            </button>
                          </div>
                        ))}
                        <input
                          type="text"
                          placeholder="Enter Tags For Product"
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && e.target.value.trim()) {
                              handleTagAdd(e.target.value.trim());
                              e.target.value = "";
                              e.preventDefault();
                            }
                          }}
                          className="flex-grow p-1 border-0 focus:ring-0"
                        />
                      </div>
                    </div>

                    {/* Price */}
                    <div className="form-group">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Price<span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-2 top-2">$</span>
                        <input
                          type="number"
                          name="price"
                          value={formData.price}
                          onChange={handleChange}
                          placeholder="Standard price for Product"
                          className="w-full p-2 border rounded-md pl-8"
                          required
                        />
                      </div>
                    </div>

                    {/* Minimum Quantity */}
                    <div className="form-group">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Minimum quantity to Order
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        name="minimumQuantity"
                        value={formData.minimumQuantity}
                        onChange={handleChange}
                        maxLength={5}
                        placeholder="Please enter minimum quantity that can be ordered"
                        className="w-full p-2 border rounded-md"
                        required
                      />
                    </div>

                    {/* Maximum Quantity */}
                    <div className="form-group">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Maximum Quantity per Order
                      </label>
                      <input
                        type="number"
                        name="maximumQuantity"
                        value={formData.maximumQuantity}
                        onChange={handleChange}
                        maxLength={5}
                        placeholder="Please enter maximum quantity that can be ordered"
                        className="w-full p-2 border rounded-md"
                      />
                    </div>

                    {/* Cost Price */}
                    <div className="form-group">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Cost Price
                      </label>
                      <input
                        type="number"
                        name="costPrice"
                        value={formData.costPrice}
                        onChange={handleChange}
                        placeholder="Please enter the cost price"
                        className="w-full p-2 border rounded-md"
                      />
                    </div>

                    {/* SKU */}
                    <div className="form-group">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        SKU
                      </label>
                      <input
                        type="text"
                        name="sku"
                        value={formData.sku}
                        onChange={handleChange}
                        placeholder="Please enter the sku"
                        className="w-full p-2 border rounded-md"
                      />
                    </div>

                    {/* Discount */}
                    <div className="form-group">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Discount
                      </label>
                      <div className="relative">
                        <select
                          name="discount"
                          value={formData.discount}
                          onChange={handleChange}
                          className="w-full p-2 border rounded-md appearance-none"
                        >
                          <option value="">Select a discount</option>
                          <option value="10">10% Off</option>
                          <option value="20">20% Off</option>
                          <option value="30">30% Off</option>
                        </select>
                        <FiChevronDown className="absolute right-3 top-3 text-gray-500" />
                      </div>
                    </div>

                    {/* Often Bought Together */}
                    <div className="form-group">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Often Bought Together
                      </label>
                      <div className="relative">
                        <select
                          name="oftenBoughtTogether"
                          value={formData.oftenBoughtTogether}
                          onChange={(e) => {
                            const options = Array.from(
                              e.target.selectedOptions,
                              (option) => option.value
                            );
                            setFormData((prev) => ({
                              ...prev,
                              oftenBoughtTogether: options,
                            }));
                          }}
                          multiple
                          className="w-full p-2 border rounded-md appearance-none min-h-10"
                        >
                          <option value="product1">Product 1</option>
                          <option value="product2">Product 2</option>
                          <option value="product3">Product 3</option>
                        </select>
                        <FiChevronDown className="absolute right-3 top-3 text-gray-500" />
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4">
                    {/* Preparation Time */}
                    <div className="form-group">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Preparation Time (in minutes)
                      </label>
                      <input
                        type="number"
                        name="preparationTime"
                        value={formData.preparationTime}
                        onChange={handleChange}
                        placeholder="Preparation Time (in minutes)"
                        className="w-full p-2 border rounded-md"
                      />
                    </div>

                    {/* Recurring Bookings */}
                    <div className="form-group">
                      <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center justify-between">
                        <span>Mark Product for Recurring Bookings</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            name="isRecurringEnabled"
                            checked={formData.isRecurringEnabled}
                            onChange={handleChange}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                        </label>
                      </label>
                    </div>

                    {/* Description */}
                    <div className="form-group">
                      <div className="flex justify-between items-center mb-1">
                        <label className="block text-sm font-medium text-gray-700">
                          DESCRIPTION
                        </label>
                        <button
                          type="button"
                          className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                          disabled
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="currentColor"
                            className="mr-1"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M3.91554 0.605141C3.48297 1.97517 3.15815 2.5579 2.48961 3.16342C1.92873 3.67146 1.50229 3.91497 0.705779 4.18219C0.306801 4.31602 0 4.46641 0 4.52815C0 4.58955 0.262414 4.71959 0.599657 4.8254C1.48707 5.10365 2.01615 5.42235 2.62286 6.04403C3.19828 6.63366 3.62651 7.36451 3.7919 8.03951C3.847 8.26451 3.92362 8.48295 3.96205 8.52501C4.07795 8.65168 4.27217 8.42365 4.33407 8.08813C4.44862 7.46713 4.96723 6.56014 5.52106 6.01232C6.09691 5.44271 7.14699 4.85358 7.77292 4.74895C8.19783 4.67795 8.27113 4.40417 7.88686 4.323C6.96867 4.12912 6.15116 3.66785 5.46902 2.95886C4.8907 2.35779 4.61494 1.89046 4.37778 1.10982C4.25984 0.721468 4.14828 0.5 4.07064 0.5C4.00364 0.5 3.93382 0.547355 3.91554 0.605141ZM12.1607 4.04787C12.1383 4.10893 12.0232 4.49181 11.9052 4.89883C11.1579 7.47453 9.13243 9.4378 6.55064 10.0887C5.80592 10.2764 5.70949 10.3336 5.7538 10.5614C5.77633 10.6774 5.9617 10.7604 6.50583 10.8982C8.35642 11.3671 9.89969 12.4498 10.9539 14.0189C11.4258 14.7213 11.7271 15.4052 11.9834 16.3552C12.1483 16.9662 12.1843 17.0281 12.3749 17.0281C12.5657 17.0281 12.6016 16.9663 12.7661 16.3552C12.9973 15.4966 13.2134 14.9665 13.5897 14.3357C14.5924 12.6547 16.3031 11.3879 18.228 10.9008C18.7815 10.7607 18.9683 10.6776 18.991 10.5614C19.0353 10.3336 18.9388 10.2764 18.1941 10.0887C15.5858 9.43107 13.584 7.46822 12.8133 4.81228C12.6122 4.11903 12.5458 3.98647 12.3882 3.96375C12.2856 3.94895 12.1832 3.9868 12.1607 4.04787ZM5.07395 13.9373C4.73798 14.8487 4.14386 15.433 3.24828 15.733C3.00509 15.8144 2.80611 15.9241 2.80611 15.9767C2.80611 16.0294 3.00509 16.139 3.24828 16.2205C4.14386 16.5204 4.73798 17.1047 5.07395 18.0161C5.17208 18.2823 5.29504 18.5 5.34725 18.5C5.39946 18.4999 5.50805 18.2781 5.58858 18.007C5.82607 17.2075 6.62505 16.4342 7.46799 16.188C7.66331 16.131 7.82309 16.0359 7.82309 15.9767C7.82309 15.9175 7.66331 15.8224 7.46799 15.7654C6.62505 15.5192 5.82607 14.7459 5.58858 13.9464C5.50805 13.6753 5.39946 13.4535 5.34725 13.4534C5.29504 13.4534 5.17208 13.6711 5.07395 13.9373Z"
                            />
                          </svg>
                          Write with AI
                        </button>
                      </div>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        maxLength={200}
                        placeholder="Please enter description"
                        className="w-full p-2 border rounded-md h-24"
                      />
                    </div>

                    {/* Long Description */}
                    <div className="form-group">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Long Description
                      </label>
                      <textarea
                        name="longDescription"
                        value={formData.longDescription}
                        onChange={handleChange}
                        maxLength={2000}
                        placeholder="Please enter long description"
                        className="w-full p-2 border rounded-md h-32"
                      />
                    </div>

                    {/* Image Upload */}
                    <div className="form-group">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Upload Image
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center cursor-pointer hover:bg-gray-50">
                        <input
                          type="file"
                          id="prodImage"
                          accept="image/*, video/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                        <label htmlFor="prodImage" className="cursor-pointer">
                          <div className="flex flex-col items-center justify-center space-y-2">
                            {formData.images.length > 0 ? (
                              <div className="grid grid-cols-3 gap-2">
                                {formData.images.map((image, index) => (
                                  <div key={index} className="relative">
                                    <img
                                      src={URL.createObjectURL(image)}
                                      alt={`Preview ${index}`}
                                      className="h-20 w-20 object-cover rounded-md"
                                    />
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setFormData((prev) => ({
                                          ...prev,
                                          images: prev.images.filter(
                                            (_, i) => i !== index
                                          ),
                                        }))
                                      }
                                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                                    >
                                      <FiX size={12} />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <>
                                <img
                                  src="/assets/images/add_cat_dummy.svg"
                                  alt="Add image"
                                  className="h-10 w-12 mx-auto"
                                />
                                <div className="text-sm text-gray-500">
                                  <p>Drag & Drop images, or</p>
                                  <p className="text-blue-600 hover:text-blue-800">
                                    browse from computer
                                  </p>
                                </div>
                              </>
                            )}
                          </div>
                        </label>
                      </div>
                      <button
                        type="button"
                        className="mt-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 text-sm"
                      >
                        Search Online
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div className="form-group">
                        

                        {/* Availability Section */}
                        <div className="form-group">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Availability
                          </label>

                          <div className="space-y-3">
                            {/* Always Available */}
                            <div className="flex items-center">
                              <input
                                type="radio"
                                id="availableAlways"
                                name="availability"
                                value="always"
                                checked={formData.availability === "always"}
                                onChange={handleAvailabilityChange}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                              />
                              <label
                                htmlFor="availableAlways"
                                className="ml-3 block text-sm text-gray-700"
                              >
                                Available Always
                              </label>
                            </div>

                            {/* Available from specific time */}
                            <div className="flex items-start">
                              <div className="flex items-center h-5">
                                <input
                                  type="radio"
                                  id="availableFrom"
                                  name="availability"
                                  value="scheduled"
                                  checked={
                                    formData.availability === "scheduled"
                                  }
                                  onChange={handleAvailabilityChange}
                                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                />
                              </div>
                              <div className="ml-3 text-sm">
                                <label
                                  htmlFor="availableFrom"
                                  className="text-gray-700"
                                >
                                  Available daily from specific time
                                </label>
                                {formData.availability === "scheduled" && (
                                  <div className="mt-2">
                                    <input
                                      type="time"
                                      name="availableFromTime"
                                      value={formData.availableFromTime}
                                      onChange={handleTimeChange}
                                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                                      required
                                    />
                                    <p className="mt-1 text-xs text-gray-500">
                                      Product will be available every day from
                                      this time onwards
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Out of Stock */}
                            <div className="flex items-center">
                              <input
                                type="radio"
                                id="outOfStock"
                                name="availability"
                                value="out_of_stock"
                                checked={
                                  formData.availability === "out_of_stock"
                                }
                                onChange={handleAvailabilityChange}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                              />
                              <label
                                htmlFor="outOfStock"
                                className="ml-3 block text-sm text-gray-700"
                              >
                                Out of Stock
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Special Price */}
                    <div className="form-group">
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Special Price
                        </label>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            name="specialPriceEnabled"
                            checked={formData.specialPriceEnabled}
                            onChange={handleChange}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                        </label>
                      </div>

                      {formData.specialPriceEnabled && (
                        <>
                          <div className="form-group">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Special Quantity
                              <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="number"
                              name="specialQuantity"
                              value={formData.specialQuantity}
                              onChange={handleChange}
                              min="2"
                              placeholder="Please enter special quantity"
                              className="w-full p-2 border rounded-md"
                              required
                            />
                          </div>

                          <div className="form-group">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Special Price
                              <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                              <span className="absolute left-2 top-2">$</span>
                              <input
                                type="number"
                                name="specialPrice"
                                value={formData.specialPrice}
                                onChange={handleChange}
                                min="1"
                                placeholder="Please enter special price"
                                className="w-full p-2 border rounded-md pl-8"
                                required
                              />
                            </div>
                          </div>

                          <div className="form-group">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Bolt Price<span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                              <span className="absolute left-2 top-2">$</span>
                              <input
                                type="number"
                                name="boltPrice"
                                value={formData.boltPrice}
                                onChange={handleChange}
                                min="1"
                                placeholder="Please enter the bolt price"
                                className="w-full p-2 border rounded-md pl-8"
                                required
                              />
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Form Footer */}
                <div className="flex justify-end space-x-2 pt-4 border-t">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Add Product
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProductPage;
