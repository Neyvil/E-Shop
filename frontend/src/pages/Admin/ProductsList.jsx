import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useCreateProductMutation } from "../../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApisSlice.js";
import { useToast } from "../../components/Toast/ToastProvider";

import { CloudUpload } from "lucide-react";
import img from "../../image/defaultProductImage.png";
import Loader from "../../components/Loader.jsx";
import AdminMenu from "./AdminMenu.jsx";

function Products() {
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [productImage, setProductImage] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [category, setCategory] = useState("None");
  const [size, setSize] = useState(""); // For Clothing
  const [gender, setGender] = useState(""); // For Clothing
  const [warranty, setWarranty] = useState(""); // For Electronics
  const [material, setMaterial] = useState(""); // For Furniture

  const [brand, setBrand] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [stock, setStock] = useState(0);
  const navigate = useNavigate();

  const [createProduct, { isLoading: isAdding }] = useCreateProductMutation();
  const { data: categories } = useFetchCategoriesQuery();
  const addToast = useToast();

  const addProductImage = (event) => {
    const file = event.target.files[0];
    setImage(file);
    setProductImage(URL.createObjectURL(file));
  };

  const resetFields = () => {
    setName("");
    setImage(null);
    setProductImage("");
    setDescription("");
    setPrice(0);
    setCategory("None"); // Reset category to "None"
    setBrand("");
    setQuantity(0);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const formdata = new FormData();
    formdata.append("name", name);
    formdata.append("productImage", image);
    formdata.append("category", category);
    formdata.append("description", description);
    formdata.append("brand", brand);
    formdata.append("quantity", quantity);
    formdata.append("price", price);
    formdata.append("countInStock", stock);

    // Append additional fields conditionally based on category
    if (category === "clothingCategoryId") {
      formdata.append("size", size.toUpperCase());
      formdata.append("gender", gender.toLowerCase());
    } else if (category === "electronicsCategoryId") {
      formdata.append("warranty", warranty);
    } else if (category === "furnitureCategoryId") {
      formdata.append("material", material);
    }

    try {
      const res = await createProduct(formdata).unwrap();
      if (!res) {
        console.error(res.data.error);
        addToast("error", "Product creation failed!");
      } else {
        addToast("success", "Product Successfully Created");
        navigate("/admin/allproductslist");
      }
    } catch (error) {
      console.error(error);
      addToast("error", error.data.error);
    }
  };

  return (
    <form
      onSubmit={submitHandler}
      className="p-4 sm:p-8 md:ml-16 bg-[#292B4B] overflow-y-auto"
    >
      {isAdding ? (
        <div className=" absolute z-50 flex justify-center items-center ">
          <Loader />
        </div>
      ) : (
        ""
      )}
      <div className="relative m-16 ">
        <AdminMenu />
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 ">
        <h1 className="text-2xl md:text-3xl font-bold font-serif text-white">
          Add <span className="text-[#7303c0]">Product </span>
        </h1>
        <div className="mt-4 md:mt-0 space-x-2">
          <button
            type="button"
            onClick={resetFields}
            className="px-4 py-2 bg-gray-200 text-gray-800 focus:ring-2 focus:ring-offset-2 focus:outline-none focus:ring-purple-500 rounded"
          >
            Discard Changes
          </button>
          <button
            disabled={isAdding}
            type="submit"
            className="px-4 py-2 bg-gradient-to-r from-[#7303c0] to-[#ec38bc] text-white font-bold inline-flex items-center rounded hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            {isAdding ? "Adding..." : "Add Product "}
            <svg
              className="w-4 h-4 ml-2"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M1 5h12m0 0L9 1m4 4L9 9"
              />
            </svg>
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
        <div className="col-span-2 space-y-6">
          <div className="bg-[#1B1C30] p-4 sm:p-6 rounded-lg shadow">
            <h2 className=" text-lg text-white md:text-xl font-semibold mb-4">
              General Information
            </h2>
            <div className=" space-y-4">
              <div>
                <label htmlFor="title" className="block mb-1 text-white">
                  Product Name
                </label>
                <input
                  type="text"
                  id="title"
                  name="name"
                  value={name}
                  placeholder="Enter Product name"
                  onChange={(e) => setName(e.target.value)}
                  className="p-2 w-full text-slate-300 bg-[#292B4B] border border-gray-700 rounded-xl focus:outline-none focus:bg-white focus:text-black"
                />
              </div>
              <div>
                <label htmlFor="Descripton" className="block mb-1 text-white">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2 border bg-[#292B4B] border-gray-700 text-slate-300  rounded focus:outline-none focus:bg-white focus:text-black"
                  placeholder="Enter product description"
                />
              </div>
            </div>
          </div>

          <div className="bg-[#1B1C30] text-white p-4 sm:p-6 rounded-lg shadow">
            <h2 className="text-lg md:text-xl font-semibold mb-4">Pricing</h2>
            <div className="space-y-4">
              <div>
                <label className="block ">Base Price</label>
                <input
                  type="number"
                  value={price}
                  onWheel={(e) => e.target.blur()}
                  onChange={(e) => setPrice(e.target.value)}
                  className="p-2 w-full text-slate-300 bg-[#292B4B] border border-gray-700 rounded-xl focus:outline-none focus:bg-white focus:text-black"
                  placeholder="Enter base price"
                />
              </div>
              <div>
                <label className="block"> Brand</label>
                <input
                  type="text"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="p-2 w-full text-slate-300 bg-[#292B4B] border border-gray-700 rounded-xl focus:outline-none focus:bg-white focus:text-black"
                  placeholder="Enter Brand Name"
                />
              </div>
            </div>
          </div>

          <div className="bg-[#1B1C30] text-white p-4 sm:p-6 rounded-lg shadow">
            <h2 className="text-lg md:text-xl font-semibold mb-4">Inventory</h2>
            <div className="space-y-4">
              <div>
                <label className="block ">Quantity</label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  onWheel={(e) => e.target.blur()}
                  className="p-2 w-full text-slate-300 bg-[#292B4B] border border-gray-700 rounded-xl focus:outline-none focus:bg-white focus:text-black"
                  placeholder="Enter base price"
                />
              </div>
              <div>
                <label className="block ">Stock</label>
                <input
                  type="number"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  onWheel={(e) => e.target.blur()}
                  className="p-2 w-full text-slate-300 bg-[#292B4B] border border-gray-700 rounded-xl focus:outline-none focus:bg-white focus:text-black"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4 text-white">
          <div className="bg-[#1B1C30] p-4 sm:p-6 rounded-lg shadow">
            <h2 className="text-lg md:text-xl font-semibold mb-4">
              Product Media
            </h2>
            <div className="flex flex-col items-center">
              <img
                src={productImage ? productImage : img}
                alt="Product"
                className="w-32 h-32 sm:w-48 sm:h-48 object-cover mb-4 rounded"
              />
              <label className="block">
                <span className="sr-only">Choose image</span>
                <input
                  type="file"
                  className="block w-full text-sm text-slate-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-violet-50 file:text-violet-700
                    hover:file:bg-violet-100"
                  onChange={addProductImage}
                />
              </label>
            </div>
          </div>

          <div className="space-y-4 text-white">
            <div className="bg-[#1B1C30] p-4 sm:p-6 rounded-lg shadow">
              <h2 className="text-lg md:text-xl font-semibold mb-4">
                Category
              </h2>
              <select
                id="Category"
                name="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="p-2 w-full text-slate-300 bg-[#292B4B] border border-gray-700 rounded-xl focus:outline-none focus:bg-white focus:text-black custom-select"
              >
                <option value="None">None</option>
                {categories?.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {categories?.map(
              (c) =>
                category === c._id &&
                c.name === "Clothing" && (
                  <div
                    key={c._id}
                    className="bg-[#1B1C30] p-4 sm:p-6 rounded-lg shadow"
                  >
                    <label className="block text-white">Size</label>
                    <input
                      type="text"
                      value={size}
                      onChange={(e) => setSize(e.target.value)}
                      className="p-2 w-full text-slate-300 bg-[#292B4B] border border-gray-700 rounded-xl"
                      placeholder="Enter size (S, M, L, etc.)"
                    />
                    <label className="block">Gender</label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="p-2 w-full text-slate-300 bg-[#292B4B] border border-gray-700 rounded-xl focus:outline-none focus:bg-white focus:text-black"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Unisex">Unisex</option>
                    </select>
                  </div>
                )
            )}

            {categories?.map(
              (c) =>
                category === c._id &&
                c.name === "Electronic" && (
                  <div
                    key={c._id}
                    className="bg-[#1B1C30] p-4 sm:p-6 rounded-lg shadow"
                  >
                    <label className="block text-white">Size</label>
                    <input
                      type="text"
                      value={size}
                      onChange={(e) => setSize(e.target.value)}
                      className="p-2 w-full text-slate-300 bg-[#292B4B] border border-gray-700 rounded-xl"
                      placeholder="Enter size (S, M, L, etc.)"
                    />
                    <label className="block">Gender</label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="p-2 w-full text-slate-300 bg-[#292B4B] border border-gray-700 rounded-xl focus:outline-none focus:bg-white focus:text-black"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Unisex">Unisex</option>
                    </select>
                  </div>
                )
            )}


            {category === "electronicsCategoryId" && (
              <div className="bg-[#1B1C30] p-4 sm:p-6 rounded-lg shadow">
                <label className="block text-white">Warranty</label>
                <input
                  type="text"
                  value={warranty}
                  onChange={(e) => setWarranty(e.target.value)}
                  className="p-2 w-full text-slate-300 bg-[#292B4B] border border-gray-700 rounded-xl"
                  placeholder="Enter warranty (e.g., 1 year, 2 years)"
                />
              </div>
            )}

            {category === "furnitureCategoryId" && (
              <div className="bg-[#1B1C30] p-4 sm:p-6 rounded-lg shadow">
                <label className="block text-white">Material</label>
                <input
                  type="text"
                  value={material}
                  onChange={(e) => setMaterial(e.target.value)}
                  className="p-2 w-full text-slate-300 bg-[#292B4B] border border-gray-700 rounded-xl"
                  placeholder="Enter material (e.g., Wood, Metal)"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}

export default Products;
