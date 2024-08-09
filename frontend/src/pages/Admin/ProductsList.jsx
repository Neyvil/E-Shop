import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useCreateProductMutation } from "../../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApisSlice.js";
import { useToast } from "../../components/Toast/ToastProvider";
import DescriptionBox from "../../components/Description box/DescriptionBox.jsx";
import { CloudUpload } from "lucide-react";

function Products() {
  return (
    <div className="h-screen flex justify-center items-center bg-[#292B4B] overflow-y-auto">
      <div className="w-full max-w-7xl bg-[#1B1C30] rounded-3xl shadow-xl p-8 ml-10">
        <h1 className="text-3xl pl-2 font-serif text-bold text-white">
          Add <span className="text-[#7303c0]">Product</span>
        </h1>
        <hr className=" m-3 w-full  border rounded-xl border-[#7403c0b2]" />
        <form action="" className=" flex flex-col justify-center space-y-1">
          <div className="flex flex-col p-6 space-y-1">
            <label
              htmlFor=""
              className="block text-lg font-semibold text-white"
            >
              Title
            </label>
            <input
              type="text"
              placeholder="Write Product name"
              className="p-2 w-[50%] text-slate-300 bg-[#292B4B] border border-gray-700 rounded-xl focus:outline-none focus:bg-white focus:text-black"
            />
          </div>

          <div className="flex flex-col p-6 space-y-2">
            <label
              htmlFor=""
              className="block text-lg font-semibold text-white"
            >
              Description
            </label>

            <DescriptionBox />
          </div>
          <div className="flex flex-col p-6 space-y-2 w-[50%]">
            <label
              htmlFor=""
              className="block text-lg font-semibold text-white"
            >
              Media
            </label>
            <div className="flex space-x-7">
              <img src="" alt="ProductImage" className="w-64 h-64 border rounded-2xl bg-cover"
              />
              <div className="flex flex-col items-center justify-center border-2 border-dashed w-64 h-64 p-4 rounded-2xl  ">
                <CloudUpload size={30}/>
                <h2 className="font-serif text-white font-bold">Choose a file</h2>
                <p className="font-serif text-white font-bold">JPG or PNG format</p>
                <button className="mt-2 w-[45%] border h-8 text-center rounded-lg">
                  Browse File
                </button>
              </div>
              <input
                type="file"
                id="fileInput"
                name="productImage"
                className="hidden"
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Products;
