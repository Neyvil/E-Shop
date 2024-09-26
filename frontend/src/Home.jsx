import React from "react";
import { useGetProductsQuery } from "./redux/api/productApiSlice";
import Loader from "./components/Loader";
import Header from "./components/Header";
import { useParams, Link } from "react-router-dom";

const Home = () => {
  const { keyword } = useParams();
  const { data, isLoading, isError } = useGetProductsQuery();

  return <div className=" h-screen bg-[#292B4B] overflow-y-auto">{!keyword ? <Header /> : null}</div>;
};

export default Home;
