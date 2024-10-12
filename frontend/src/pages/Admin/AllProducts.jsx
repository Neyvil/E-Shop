import { Link } from "react-router-dom";
import moment from "moment";
import { useAllProductsQuery } from "../../redux/api/productApiSlice";
import Loader from "../../components/Loader.jsx";
import AdminMenu from "./AdminMenu.jsx";
import img from "../../image/img1.jpg";

const AllProducts = () => {
  const { data: products, isLoading, isError } = useAllProductsQuery();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-white text-xl">Failed to load products.</p>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col pt-10 items-start p-4 sm:p-8 md:pl-36 bg-[#1e1f3b] overflow-y-auto">
      <div className="relative mb-10 z-50 w-full">
        <AdminMenu />
      </div>
      <h1 className="font-serif font-bold text-4xl text-white mb-10 self-center md:self-start">
        All <span className="text-gradient bg-gradient-to-r from-[#a445b2] via-[#d41872] to-[#ff0066] bg-clip-text text-transparent">Products</span>
      </h1>
      {products && products.length > 0 ? (
        [...new Map(products.map((product) => [product.category._id, product.category])).values()].map((category) => (
          <div key={category._id} className="w-full mb-12">
            <div className="w-full flex flex-col items-start mb-8">
              <h2 className="text-2xl md:text-3xl font-serif font-semibold text-white">
                {category.name}
              </h2>
              <div className="w-full h-1 bg-gradient-to-r from-[#7303c0] to-[#ff0066] rounded-full mt-2"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {products.filter((product) => product.category._id === category._id).length > 0 ? (
                products
                  .filter((product) => product.category._id === category._id)
                  .map((filteredProduct) => (
                    <div
                      key={filteredProduct._id}
                      className="block w-full bg-[#292B4B] rounded-lg p-4 shadow-lg transform hover:scale-105 hover:shadow-xl transition-all duration-300"
                    >
                      <div className="relative w-full h-[250px] rounded-lg overflow-hidden">
                        <img
                          src={filteredProduct.productImage ? `http://localhost:5000/${filteredProduct.productImage.replace(/\\/g, "/")}` : img}
                          alt={filteredProduct.name}
                          className="w-full h-full object-cover"
                        />
                        <Link
                          to={`/product/${filteredProduct._id}`}F
                          className="absolute inset-0 bg-black bg-opacity-40 opacity-0 hover:opacity-100 transition-opacity duration-300 flex justify-center items-center"
                        >
                          <p className="text-white text-lg font-bold hover:text-[#ff0066]">
                            View Product
                          </p>
                        </Link>
                      </div>
                      <div className="mt-4">
                        <h5 className="text-lg font-bold text-white mb-2">{filteredProduct?.name?.substring(0,25)}</h5>
                        <p className="text-gray-400 text-sm mb-2">{moment(filteredProduct.createAt).format("MMM Do YYYY")}</p>
                        <p className="text-gray-300 text-sm mb-4">{filteredProduct?.description?.substring(0, 50)}...</p>
                        <div className="flex justify-between items-center">
                          <Link
                            to={`/admin/product/update/${filteredProduct._id}`}
                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg hover:bg-gradient-to-l hover:shadow-lg transition-all duration-300"
                          >
                            Update
                          </Link>
                          <p className="text-white text-lg font-semibold"> ₹{filteredProduct?.price}</p>
                        </div>
                      </div>
                    </div>
                  ))
              ) : (
                <div className="text-white text-lg">No products found in this category yet.</div>
              )}
            </div>
          </div>
        ))
      ) : (
        <div className="text-white text-lg">No products yet. Coming soon...</div>
      )}
    </div>
  );
};

export default AllProducts;
