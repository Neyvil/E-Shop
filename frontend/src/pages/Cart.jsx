import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Trash } from "lucide-react";
import { addToCart, removeFromCart } from "../redux/features/cart/cartSlice";

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  return (
    <>
      <div className=" container flex justify-around items-start flex-wrap mx-auto mt-8">
        {cartItems.length === 0 ? (
          <div>
            Your cart is empty <Link to="/shop"> Go To Shop</Link>{" "}
          </div>
        ) : (
          <>
            <div className="flex flex-col w-[80%]">
              <h1 className=" text-2xl font-semibold mb-4">Shopping Cart</h1>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Cart;
