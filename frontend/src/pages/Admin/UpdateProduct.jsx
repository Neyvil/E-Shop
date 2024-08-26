import React, { useEffect } from "react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  useGetProductByIdQuery,
  useRemoveProductMutation,
  useUpdateProductMutation,
} from "../../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApisSlice.js";
import { useToast } from "../../components/Toast/ToastProvider";
import { Trash } from "lucide-react";
import img from "../../image/defaultProductImage.png";
import Loader from "../../components/Loader.jsx";
import AdminMenu from "./AdminMenu.jsx";

function Products() {
  const params = useParams();
  const { data: productData } = useGetProductByIdQuery(params._id);
  const addToast = useToast();

  const [name, setName] = useState(productData?.name || "");
  const [image, setImage] = useState(productData?.productImage || "");
  const [productImage, setProductImage] = useState(img);
  const [description, setDescription] = useState(
    productData?.description || ""
  );
  const [price, setPrice] = useState(productData?.price || "");
  const [category, setCategory] = useState(productData?.category?._id || "");
  const [brand, setBrand] = useState(productData?.brand || "");
  const [stock, setStock] = useState(productData?.countInstock);
  const [quantity, setQuantity] = useState(productData?.quantity);
  const navigate = useNavigate();

  const { data: categories } = useFetchCategoriesQuery();

  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  const [productDeletion, { isloading: isDeleting }] =
    useRemoveProductMutation();

  const addProductImage = (event) => {
    const file = event.target.files[0];
    setImage(file);
    setProductImage(URL.createObjectURL(file));
  };

  const resetFields = () => {
    setName(productData?.name);
    setDescription(productData?.description);
    setPrice(productData?.price);
    setCategory(productData?.category?._id); // Reset category to "None"
    setBrand(productData?.brand);
    setQuantity(productData?.quantity);
    setStock(productData?.countInstock);
  };

  useEffect(() => {
    if (productData && productData._id) {
      setName(productData.name);
      setDescription(productData.description);
      setPrice(productData.price);
      setBrand(productData.brand);
      setQuantity(productData.quantity);
      setStock(productData.countInStock);
      if (productData.category) {
        setCategory(productData.category);
      }
      if (productData.productImage) {
        const imgstr = `http://localhost:5000/${productData.productImage.replace(
          /\\/g,
          "/"
        )}`;
        setProductImage(imgstr);
      }
    }
  }, [productData]);

  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      let answer = window.confirm(
        "Are you sure you want to delete this product ?"
      );
      if (!answer) return;

      const { data } = await productDeletion(params._id);
      if (!data) {
        addToast("error", "Deletion failed !!");
      } else {
        addToast("success", `${data.name} successfully deleted  `);
        navigate("/admin/allproductslist");
      }
    } catch (error) {
      console.log(error);
      addToast("error", "Product deletion failed,Try again");
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("productImage", image); // Match this name with backend
      formData.append("category", category);
      formData.append("description", description);
      formData.append("brand", brand);
      formData.append("quantity", quantity);
      formData.append("countInStock", stock);
      formData.append("price", price);

      // for debugging
      // for (const pair of formData.entries()) {
      //   console.log(`${pair[0]}: ${pair[1]}`);
      // }

      const data = await updateProduct({
        productId: params._id,
        formData,
      });

      if (data.error) {
        addToast("error", "Product update failed!");
      } else {
        addToast("success", `${name} product is successfully Updated 👍🏻`);
        navigate("/admin/allproductslist");
      }
    } catch (error) {
      console.error(error);
      addToast("error", error.data.message);
    }
  };

  return (
    <div className="p-4 sm:p-8 md:ml-16 bg-[#292B4B] overflow-y-auto">
      {isUpdating ? (
        <div className="z-50 flex justify-center items-center ">
          <Loader />
        </div>
      ) : (
        ""
      )}
      <div className="relative m-16 z-30">
        <AdminMenu />
      </div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 ">
        <h1 className="text-2xl md:text-3xl font-bold font-serif text-white">
          Update <span className="text-[#7303c0]">Product</span>
        </h1>
        <div className="mt-4 md:mt-0 space-x-2">
          <button
            type="button"
            onClick={resetFields}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded"
          >
            Discard Changes
          </button>
          <button
            disabled={isUpdating}
            type="submit"
            form="updateForm"
            className="px-4 py-2 bg-gradient-to-r from-[#7303c0] to-[#ec38bc] text-white font-bold inline-flex items-center rounded hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            {isUpdating ? "Updating..." : "Update product"}
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
          <button
            disabled={isDeleting}
            onClick={handleDelete}
            className="px-4 py-2 bg-gradient-to-r from-[#c00303] to-[#ec3838] text-white font-bold inline-flex items-center rounded hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <div className="mr-2 ">
              <Trash size={18} />
            </div>

            {isDeleting ? "Deleting..." : "Delete product"}
          </button>
        </div>
      </div>
      <form
        onSubmit={submitHandler}
        id="updateForm"
        className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8"
      >
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
                  className="w-full px-4 py-2 border bg-[#292B4B] border-gray-700 rounded focus:outline-none focus:bg-white focus:text-black text-white"
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
          <div className="bg-[#1B1C30] text-white p-4 sm:p-6 rounded-lg shadow">
            <h2 className="text-lg md:text-xl font-semibold mb-4">Category</h2>
            <select
              id="Category"
              name="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="p-2 w-full text-slate-300 bg-[#292B4B] border border-gray-700 rounded-xl focus:outline-none focus:bg-white focus:text-black custom-select"
            >
              <option
                value="None"
                className="bg-[#292B4B] text-sm text-white w-10 h-6 border-b-2 rounded"
              >
                None
              </option>
              {categories?.map((c) => (
                <option
                  key={c._id}
                  value={c._id}
                  className="bg-[#292B4B] text-sm text-white w-10 h-6 border-b-2 rounded"
                >
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Products;
