import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Trash } from "lucide-react";
import { addToCart, removeFromCart } from "../redux/features/cart/cartSlice";
import Default from "../image/defaultProductImage.png";

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
  };

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const checkOutHandler = () => {
    navigate("/login?redirect=/shipping");
  };

  return (
    <>
      <div className="bg-[#1e1f3b] h-screen text-white overflow-auto">
        <div className="container mx-auto p-4 sm:p-6 md:p-8 lg:p-12">
          {cartItems.length === 0 ? (
            <div className="text-center mt-16">
              <p className="text-lg">Your cart is empty 😫</p>
              <Link to="/shop" className="text-[#ff0066] font-semibold">
                Go To Shop
              </Link>
            </div>
          ) : (
            <>
              <div className="flex flex-col w-full lg:w-[80%] mx-auto">
                <h1 className="text-3xl font-bold mb-6 text-center lg:text-left">
                  Shopping Cart
                </h1>
                {cartItems.map((item) => (
                  <div
                    key={item._id}
                    className="flex flex-col md:flex-row items-center md:justify-between bg-[#1B1C30] rounded-lg mb-6 p-4"
                  >
                    <div className="w-24 h-24 mb-4 md:mb-0">
                      <img
                        src={
                          item.productImage
                            ? item.productImage
                            : Default
                        }
                        alt={item.name}
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                    <div className="flex-1 ml-0 md:ml-4 text-center md:text-left">
                      <Link
                        to={`/product/${item._id}`}
                        className="text-[#ff0066] font-bold text-xl"
                      >
                        {item.name}
                      </Link>
                      <div className="mt-2 text-gray-300">{item.brand}</div>
                      <div className="mt-2 font-bold text-2xl">₹ {item.price}</div>
                    </div>
                    <div className="w-24 mt-4 md:mt-0">
                      <select
                        value={item.qty}
                        onChange={(e) =>
                          addToCartHandler(item, Number(e.target.value))
                        }
                        className="w-full p-2 border rounded text-black"
                      >
                        {[...Array(item.countInStock).keys()].map((x) => (
                          <option key={x + 1} value={x + 1}>
                            {x + 1}
                          </option>
                        ))}
                      </select>
                    </div>
                    <button
                      className="text-red-500 ml-0 md:ml-6 mt-4 md:mt-0"
                      onClick={() => removeFromCartHandler(item._id)}
                    >
                      <Trash
                        color="#ff0066"
                        className="mt-1"
                        fill="#ff0066"
                        size={24}
                      />
                    </button>
                  </div>
                ))}

                <div className="mt-8 w-full lg:w-[40rem] mx-auto">
                  <div className="p-6 bg-[#1e1f3b] rounded-lg">
                    <h2 className="text-2xl font-semibold mb-4 text-center lg:text-left">
                      Items ({cartItems.reduce((acc, item) => acc + item.qty, 0)})
                    </h2>
                    <div className="text-3xl font-bold mb-4 text-center lg:text-left">
                      ₹{" "}
                      {cartItems
                        .reduce((acc, item) => acc + item.qty * item.price, 0)
                        .toFixed(2)}
                    </div>
                    <button
                      disabled={cartItems === 0}
                      onClick={checkOutHandler}
                      className="w-full lg:w-4/5 mx-auto py-3 px-6 bg-[#7303c0] hover:bg-[#8536d0] rounded-lg font-bold text-white transition-all"
                    >
                      Proceed To Checkout
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Cart;
