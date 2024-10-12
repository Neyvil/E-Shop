import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateProductMutation } from "../../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApisSlice";
import { useToast } from "../../components/Toast/ToastProvider";
import { CloudUpload, ChevronDown, ChevronRight } from "lucide-react";
import defaultProductImage from "../../image/defaultProductImage.png";
import Loader from "../../components/Loader";
import AdminMenu from "./AdminMenu";

const ProductsList = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    category: "",
    brand: "",
    countInStock: 0,
    productImage: null,
    size: "",
    gender: "",
    warranty: "",
    material: "",
  });

  const [imagePreview, setImagePreview] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedCategoryPath, setSelectedCategoryPath] = useState([]);
  const navigate = useNavigate();
  const [createProduct, { isLoading: isAdding }] = useCreateProductMutation();
  const { data: categories, isLoading: isCategoriesLoading } =
    useFetchCategoriesQuery();
  const addToast = useToast();

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, productImage: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: 0,
      category: "",
      brand: "",
      countInStock: 0,
      productImage: null,
      size: "",
      gender: "",
      warranty: "",
      material: "",
    });
    setImagePreview("");
    setSelectedCategoryPath([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const productData = new FormData();
    for (const key in formData) {
      if (formData[key] !== null && formData[key] !== "") {
        productData.append(key, formData[key]);
      }
    }

    try {
      const res = await createProduct(productData).unwrap();
      addToast("success", "Product Successfully Created");
      navigate("/admin/allproductslist");
    } catch (error) {
      console.error(error);
      addToast("error", error.data?.error || "Failed to create product");
    }
  };

  const renderCategoryOptions = (categories, depth = 0, parentPath = []) => {
    return categories?.map((category) => {
      const currentPath = [...parentPath, category._id];
      const isSelected =
        JSON.stringify(currentPath) === JSON.stringify(selectedCategoryPath);
      return (
        <React.Fragment key={category._id}>
          <div
            className={`py-2 px-4 cursor-pointer hover:bg-[#292B4B] transition-colors flex items-center ${
              isSelected ? "bg-[#7303c0] text-white" : ""
            }`}
            style={{ paddingLeft: `${depth * 20 + 16}px` }}
            onClick={() => {
              setFormData((prev) => ({ ...prev, category: category._id }));
              setSelectedCategoryPath(currentPath);
              if (
                !category.subcategories ||
                category.subcategories.length === 0
              ) {
                setIsMenuOpen(false);
              }
            }}
          >
            {category.subcategories && category.subcategories.length > 0 && (
              <ChevronRight className="mr-2" />
            )}
            <span>{category.name}</span>
          </div>
          {category.subcategories &&
            renderCategoryOptions(
              category.subcategories,
              depth + 1,
              currentPath
            )}
        </React.Fragment>
      );
    });
  };

  const getCategoryNameFromPath = (path) => {
    let current = { subcategories: categories };
    let name = "";
    for (let id of path) {
      current = current.subcategories.find((cat) => cat._id === id);
      if (current) {
        name = current.name;
      } else {
        break;
      }
    }
    return name;
  };
  
  const renderCategorySpecificFields = () => {
    const getCategoryPathNames = (path) => {
      let names = [];
      let current = { subcategories: categories };
      for (let id of path) {
        current = current.subcategories.find((cat) => cat._id === id);
        if (current) {
          names.push(current.name);
        } else {
          break;
        }
      }
      return names;
    };
  
    const categoryPathNames = getCategoryPathNames(selectedCategoryPath);
  
    // Check if any part of the path contains Electronics or Clothing
    const isElectronics = categoryPathNames.some((name) => name === "Electronics");
    const isClothing = categoryPathNames.some((name) => name === "Clothing");
  
    return (
      <>
        {isElectronics && (
          <div>
            <label className="block text-sm font-medium mb-2">
              Warranty (months)
            </label>
            <input
              type="number"
              name="warranty"
              value={formData.warranty}
              onChange={handleInputChange}
              className="w-full p-3 bg-[#292B4B] rounded-lg focus:ring-2 focus:ring-[#7303c0] transition-all"
              placeholder="Enter warranty period"
            />
          </div>
        )}
        {isClothing && (
          <>
            <div>
              <label className="block text-sm font-medium mb-2">Size</label>
              <input
                type="text"
                name="size"
                value={formData.size}
                onChange={handleInputChange}
                className="w-full p-3 bg-[#292B4B] rounded-lg focus:ring-2 focus:ring-[#7303c0] transition-all"
                placeholder="Enter size (S, M, L, etc.)"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className="w-full p-3 bg-[#292B4B] rounded-lg focus:ring-2 focus:ring-[#7303c0] transition-all"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Unisex">Unisex</option>
              </select>
            </div>
          </>
        )}
        {categoryPathNames.includes("Furniture") && (
          <div>
            <label className="block text-sm font-medium mb-2">Material</label>
            <input
              type="text"
              name="material"
              value={formData.material}
              onChange={handleInputChange}
              className="w-full p-3 bg-[#292B4B] rounded-lg focus:ring-2 focus:ring-[#7303c0] transition-all"
              placeholder="Enter furniture material"
            />
          </div>
        )}
      </>
    );
  };
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1e1f3b] to-[#292B4B] text-white p-4 sm:p-8">
      <AdminMenu />
      <form
        onSubmit={handleSubmit}
        className="max-w-4xl mx-auto mt-10 bg-[#1e1f3b] rounded-xl shadow-2xl p-6 sm:p-10"
      >
        <h1 className="text-3xl font-bold mb-8 text-[#ff0066] text-center">
          Add New Product
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Product Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full p-3 bg-[#292B4B] rounded-lg focus:ring-2 focus:ring-[#7303c0] transition-all"
                placeholder="Enter product name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="4"
                className="w-full p-3 bg-[#292B4B] rounded-lg focus:ring-2 focus:ring-[#7303c0] transition-all"
                placeholder="Enter product description"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Price</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className="w-full p-3 bg-[#292B4B] rounded-lg focus:ring-2 focus:ring-[#7303c0] transition-all"
                placeholder="Enter price"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Brand</label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleInputChange}
                className="w-full p-3 bg-[#292B4B] rounded-lg focus:ring-2 focus:ring-[#7303c0] transition-all"
                placeholder="Enter brand name"
                required
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="relative">
              <label className="block text-sm font-medium mb-2">Category</label>
              <div
                className="w-full p-3 bg-[#292B4B] rounded-lg focus:ring-2 focus:ring-[#7303c0] cursor-pointer flex justify-between items-center"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <span>
                  {selectedCategoryPath.length > 0
                    ? getCategoryNameFromPath(selectedCategoryPath)
                    : "Select a category"}
                </span>
                <ChevronDown
                  className={`transition-transform ${
                    isMenuOpen ? "rotate-180" : ""
                  }`}
                />
              </div>
              {isMenuOpen && (
                <div className="absolute z-10 w-full mt-1 bg-[#292B4B] border border-[#7303c0] rounded-lg shadow-xl max-h-60 overflow-auto">
                  {renderCategoryOptions(categories)}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Stock</label>
              <input
                type="number"
                name="countInStock"
                value={formData.countInStock}
                onChange={handleInputChange}
                className="w-full p-3 bg-[#292B4B] rounded-lg focus:ring-2 focus:ring-[#7303c0] transition-all"
                placeholder="Enter stock quantity"
                required
              />
            </div>

            {formData.category && renderCategorySpecificFields()}

            <div>
              <label className="block text-sm font-medium mb-2">
                Product Image
              </label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-[#7303c0] border-dashed rounded-lg cursor-pointer bg-[#292B4B] hover:bg-[#292B4B]/80 transition-all">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Product Preview"
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <>
                        <CloudUpload className="w-10 h-10 mb-3 text-[#ff0066]" />
                        <p className="mb-2 text-sm text-gray-300">
                          <span className="font-semibold">Click to upload</span>{" "}
                          or drag and drop
                        </p>
                        <p className="text-xs text-gray-400">
                          PNG, JPG or GIF (MAX. 800x400px)
                        </p>
                      </>
                    )}
                  </div>
                  <input
                    type="file"
                    name="productImage"
                    onChange={handleImageChange}
                    className="hidden"
                    accept="image/*"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row justify-end space-y-4 sm:space-y-0 sm:space-x-4">
          <button
            type="button"
            onClick={resetForm}
            className="w-full sm:w-auto px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Reset
          </button>
          <button
            type="submit"
            disabled={isAdding}
            className="w-full sm:w-auto px-6 py-2 bg-gradient-to-r from-[#ff0066] to-[#7303c0] text-white rounded-lg hover:from-[#ff0066]/80 hover:to-[#7303c0]/80 transition-colors disabled:opacity-50"
          >
            {isAdding ? "Adding..." : "Add Product"}
          </button>
        </div>
      </form>

      {isAdding && <Loader />}
    </div>
  );
};

export default ProductsList;
