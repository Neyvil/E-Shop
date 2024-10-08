import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useToast } from "../../components/Toast/ToastProvider";
import {
  useGetProductDetailQuery,
  useCreateReviewMutation,
} from "../../redux/api/productApiSlice.js";
import Loader from "../../components/Loader.jsx";
import Message from "../../components/Message.jsx";
import { Box, Clock, ShoppingCart, Star, Store } from "lucide-react";
import moment from "moment";
import HeartIcon from "./HeartIcon.jsx";

const ProductDetail = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const {
    data: product,
    isLoading,
    refetch,
    error,
  } = useGetProductDetailQuery(productId);

  const { userInfo } = useSelector((state) => state.auth);
  const [createReview, { isLoading: loadingProductReview }] =
    useCreateReviewMutation();

  return <div>ProductDetail</div>;
};

export default ProductDetail;
