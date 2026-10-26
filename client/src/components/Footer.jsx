import { Link } from "react-router-dom";

import {
  FiHome,
  FiShoppingBag,
  FiMessageCircle,
  FiBarChart2,
  FiHeart,
  FiShoppingCart,
  FiPackage,
  FiCheckCircle,
} from "react-icons/fi";


const Footer = () => {
  return (
    <footer className="shopsphere-footer">

      <div className="shopsphere-footer-container">


        {/* ==================================================
            BRAND
        ================================================== */}

        <div className="shopsphere-footer-brand">

          <Link
            to="/"
            className="shopsphere-footer-logo"
          >

            <div className="shopsphere-footer-logo-icon">
              🛍️
            </div>

            <div>
              <div className="shopsphere-footer-logo-text">
                ShopSphere

                <span>
                  AI
                </span>

              </div>

              <p>
                Your intelligent shopping
                companion.
              </p>

            </div>

          </Link>

          <p className="shopsphere-footer-description">
            Discover products, compare
            options, and shop smarter
            with AI-powered recommendations.
          </p>

        </div>


        {/* ==================================================
            QUICK LINKS
        ================================================== */}

        <div className="shopsphere-footer-column">

          <h3>
            Quick Links
          </h3>

          <Link to="/">
            <FiHome />
            Home
          </Link>

          <Link to="/products">
            <FiShoppingBag />
            Products
          </Link>

          <Link to="/ai-assistant">
            <FiMessageCircle />
            AI Assistant
          </Link>

          <Link to="/compare">
            <FiBarChart2 />
            Compare
          </Link>

        </div>


        {/* ==================================================
            SHOPPING
        ================================================== */}

        <div className="shopsphere-footer-column">

          <h3>
            Shopping
          </h3>

          <Link to="/wishlist">
            <FiHeart />
            Wishlist
          </Link>

          <Link to="/cart">
            <FiShoppingCart />
            Cart
          </Link>

          <Link to="/orders">
            <FiPackage />
            Orders
          </Link>

        </div>


        {/* ==================================================
            WHY SHOPSPHERE
        ================================================== */}

        <div className="shopsphere-footer-column">

          <h3>
            Why ShopSphere?
          </h3>

          <div className="shopsphere-footer-feature">

            <span>
              ✨
            </span>

            <p>
              AI Recommendations
            </p>

          </div>


          <div className="shopsphere-footer-feature">

            <span>
              ⚖️
            </span>

            <p>
              Easy Comparison
            </p>

          </div>


          <div className="shopsphere-footer-feature">

            <span>
              💳
            </span>

            <p>
              Secure Checkout
            </p>

          </div>


          <div className="shopsphere-footer-feature">

            <span>
              📦
            </span>

            <p>
              Order Tracking
            </p>

          </div>

        </div>

      </div>


      {/* ==================================================
          COPYRIGHT
      ================================================== */}

      <div className="shopsphere-footer-bottom">

        <p>
          © {new Date().getFullYear()} ShopSphere.
          All rights reserved.
        </p>

        <p>
          Built with
          <strong>
            MERN + Gemini AI
          </strong>
        </p>

      </div>

    </footer>
  );
};

export default Footer;