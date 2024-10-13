import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateProductMutation } from "../../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApisSlice";
import { useToast } from "../../components/Toast/ToastProvider";
import { CloudUpload, ChevronDown, ChevronRight } from "lucide-react";
import Loader from "../../components/Loader";
import AdminMenu from "./AdminMenu";
import { set } from "mongoose";

const ProductsList = () => {
  const [name, setName] = useState("");
  const [productImage, setProductImage] = useState(null);
  const [description, setDescription] = useState("");
  const [size, setSize] = useState("");
  const [brand, setBrand] = useState("");
  const [gender, setGender] = useState("");
  const [material, setMaterial] = useState("");
  const [category, setCategory] = useState("");
  const [countInStock, setCountInStock] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [warranty, setWarranty] = useState("");
  const [price, setPrice] = useState("");
  const [color, setColor] = useState("");

  const [imagePreview, setImagePreview] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedCategoryPath, setSelectedCategoryPath] = useState([]);
  const navigate = useNavigate();
  const [createProduct, { isLoading: isAdding }] = useCreateProductMutation();
  const { data: categories, isLoading: isCategoriesLoading } =
    useFetchCategoriesQuery();
  const addToast = useToast();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProductImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const resetForm = () => {
    setName("");
    setBrand("");
    setCategory("");
    setDescription("");
    setPrice("");
    setProductImage(null);
    setWarranty("");
    setGender("");
    setColor("");
    setCountInStock(0);
    setQuantity(0);
    setMaterial("");
    setSize("");
    setImagePreview("");
    setSelectedCategoryPath([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("productImage", productImage);
      formData.append("categoryId", category); // Changed from "category" to "categoryId"
      formData.append("selectedCategoryPath", selectedCategoryPath);
      formData.append("description", description);
      formData.append("brand", brand);
      formData.append("quantity", quantity);
      formData.append("countInStock", countInStock);
      formData.append("price", price);

      // Add category-specific fields
      if (size) formData.append("size", size);
      if (gender) formData.append("gender", gender);
      if (color) formData.append("color", color);
      if (warranty) formData.append("warranty", warranty);
      if (material) formData.append("material", material);

      const res = await createProduct(formData).unwrap();
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
              setCategory(category._id);
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

    const isElectronics = categoryPathNames.some(
      (name) => name === "Electronics"
    );
    const isClothing = categoryPathNames.some((name) => name === "Clothing");
    const isFurniture = categoryPathNames.includes("Furniture");

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
              onWheel={(e) => e.target.blur()}
              value={warranty}
              onChange={(e) => setWarranty(e.target.value)}
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
                value={size}
                onChange={(e) => setSize(e.target.value)}
                className="w-full p-3 bg-[#292B4B] rounded-lg focus:ring-2 focus:ring-[#7303c0] transition-all"
                placeholder="Enter size (S, M, L, etc.)"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Colour</label>
              <input
                type="text"
                name="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full p-3 bg-[#292B4B] rounded-lg focus:ring-2 focus:ring-[#7303c0] transition-all"
                placeholder="Enter Colour of the Product.."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Gender</label>
              <select
                name="gender"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
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
        {isFurniture && (
          <div>
            <label className="block text-sm font-medium mb-2">Material</label>
            <input
              type="text"
              name="material"
              value={material}
              onChange={(e) => setWarranty(e.target.value)}
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
                value={name}
                onChange={(e) => setName(e.target.value)}
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
                value={description}
                onChange={(e) => setDescription(e.target.value)}
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
                value={price}
                onWheel={(e) => e.target.blur()}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full p-3 bg-[#292B4B] rounded-lg focus:ring-2 focus:ring-[#7303c0] transition-all"
                placeholder="Enter price"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Quantity</label>
              <input
                type="number"
                name="price"
                value={quantity}
                onWheel={(e) => e.target.blur()}
                onChange={(e) => setQuantity(e.target.value)}
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
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
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
                onWheel={(e) => e.target.blur()}
                value={countInStock}
                onChange={(e) => setCountInStock(e.target.value)}
                className="w-full p-3 bg-[#292B4B] rounded-lg focus:ring-2 focus:ring-[#7303c0] transition-all"
                placeholder="Enter stock quantity"
                required
              />
            </div>

            {category && renderCategorySpecificFields()}

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
                        className="w-32 h-32 sm:w-48 sm:h-48 object-cover mb-4"
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
