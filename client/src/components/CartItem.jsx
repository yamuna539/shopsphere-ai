import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  FaMinus,
  FaPlus,
  FaTrashAlt,
} from "react-icons/fa";

import {
  updateCartItemQuantity,
  removeCartItemById,
} from "../redux/slices/cartSlice";

function CartItem({ item }) {
  const dispatch = useDispatch();

  const product = item.product;

  const increaseQuantity = () => {
    dispatch(
      updateCartItemQuantity({
        productId: product._id,
        quantity: item.quantity + 1,
      })
    );
  };

  const decreaseQuantity = () => {
    if (item.quantity === 1) {
      dispatch(
        removeCartItemById(product._id)
      );
      return;
    }

    dispatch(
      updateCartItemQuantity({
        productId: product._id,
        quantity: item.quantity - 1,
      })
    );
  };

  const handleRemove = () => {
    dispatch(
      removeCartItemById(product._id)
    );
  };

  const itemTotal =
    item.price * item.quantity;

  const image =
    product.images?.[0] ||
    "https://placehold.co/200x150?text=ShopSphere";

  return (
    <div className="shopsphere-cart-product">

      {/* Product Image */}

      <Link
        to={`/products/${product._id}`}
        className="shopsphere-cart-product-image-link"
      >
        <div className="shopsphere-cart-product-image">
          <img
            src={image}
            alt={product.name}
          />
        </div>
      </Link>


      {/* Product Information */}

      <div className="shopsphere-cart-product-info">

        <Link
          to={`/products/${product._id}`}
          className="shopsphere-cart-product-name"
        >
          {product.name}
        </Link>

        {product.brand && (
          <p className="shopsphere-cart-product-brand">
            {product.brand}
          </p>
        )}

        <div className="shopsphere-cart-product-price">
          ₹
          {Number(item.price).toLocaleString(
            "en-IN"
          )}
          <span> / item</span>
        </div>

        {product.stock <= 0 && (
          <span className="shopsphere-cart-out-stock">
            Out of stock
          </span>
        )}

      </div>


      {/* Quantity */}

      <div className="shopsphere-cart-quantity-section">

        <span className="shopsphere-cart-quantity-label">
          Quantity
        </span>

        <div className="shopsphere-quantity-control">

          <button
            type="button"
            className="shopsphere-quantity-btn"
            onClick={decreaseQuantity}
            aria-label="Decrease quantity"
          >
            <FaMinus />
          </button>

          <span className="shopsphere-quantity-value">
            {item.quantity}
          </span>

          <button
            type="button"
            className="shopsphere-quantity-btn"
            onClick={increaseQuantity}
            disabled={
              item.quantity >= product.stock
            }
            aria-label="Increase quantity"
          >
            <FaPlus />
          </button>

        </div>

        <button
          type="button"
          className="shopsphere-remove-item"
          onClick={handleRemove}
        >
          <FaTrashAlt />
          Remove
        </button>

      </div>


      {/* Item Total */}

      <div className="shopsphere-cart-item-total">

        <span className="shopsphere-item-total-label">
          Total
        </span>

        <strong>
          ₹
          {Number(itemTotal).toLocaleString(
            "en-IN"
          )}
        </strong>

      </div>

    </div>
  );
}

export default CartItem;