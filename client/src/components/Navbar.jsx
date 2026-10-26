import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  FiHome,
  FiShoppingBag,
  FiMessageCircle,
  FiBarChart2,
  FiHeart,
  FiShoppingCart,
  FiPackage,
  FiUser,
  FiLogIn,
  FiUserPlus,
  FiLogOut,
  FiMenu,
  FiX,
  FiShield,
} from "react-icons/fi";

import { logout } from "../redux/slices/authSlice";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [compareCount, setCompareCount] = useState(0);

  // --------------------------------------------------
  // Compare count
  // --------------------------------------------------
  const updateCompareCount = () => {
    try {
      const savedProducts =
        JSON.parse(
          localStorage.getItem("compareProducts")
        ) || [];

      setCompareCount(savedProducts.length);
    } catch (error) {
      setCompareCount(0);
    }
  };

  useEffect(() => {
    updateCompareCount();

    const handleCompareChange = () => {
      updateCompareCount();
    };

    window.addEventListener(
      "compareProductsChanged",
      handleCompareChange
    );

    window.addEventListener(
      "storage",
      handleCompareChange
    );

    return () => {
      window.removeEventListener(
        "compareProductsChanged",
        handleCompareChange
      );

      window.removeEventListener(
        "storage",
        handleCompareChange
      );
    };
  }, []);

  // --------------------------------------------------
  // Close mobile menu
  // --------------------------------------------------
  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // --------------------------------------------------
  // Logout
  // --------------------------------------------------
  const handleLogout = () => {
    dispatch(logout());

    closeMenu();

    navigate("/login");
  };

  // --------------------------------------------------
  // Active link class
  // --------------------------------------------------
  const getNavLinkClass = ({ isActive }) =>
    `shopsphere-nav-link ${
      isActive ? "shopsphere-nav-link-active" : ""
    }`;

  return (
    <header className="shopsphere-navbar-wrapper">
      <nav className="shopsphere-navbar">
        <div className="shopsphere-navbar-container">

          {/* =================================================
              LOGO
          ================================================= */}
          <Link
            to="/"
            className="shopsphere-brand"
            onClick={closeMenu}
          >
            <div className="shopsphere-brand-icon">
              🛍️
            </div>

            <span className="shopsphere-brand-text">
              ShopSphere
            </span>

            <span className="shopsphere-ai-badge">
              AI
            </span>
          </Link>

          {/* =================================================
              DESKTOP NAVIGATION
          ================================================= */}
          <div className="shopsphere-desktop-nav">

            <NavLink
              to="/"
              end
              className={getNavLinkClass}
            >
              <FiHome />
              <span>Home</span>
            </NavLink>

            <NavLink
              to="/products"
              className={getNavLinkClass}
            >
              <FiShoppingBag />
              <span>Products</span>
            </NavLink>

            <NavLink
              to="/ai-assistant"
              className={getNavLinkClass}
            >
              <FiMessageCircle />
              <span>AI Assistant</span>
            </NavLink>

            <NavLink
              to="/compare"
              className={getNavLinkClass}
            >
              <FiBarChart2 />
              <span>Compare</span>

              {compareCount > 0 && (
                <span className="shopsphere-nav-badge">
                  {compareCount}
                </span>
              )}
            </NavLink>

            {isAuthenticated && (
              <>
                <NavLink
                  to="/wishlist"
                  className={getNavLinkClass}
                >
                  <FiHeart />
                  <span>Wishlist</span>
                </NavLink>

                <NavLink
                  to="/cart"
                  className={getNavLinkClass}
                >
                  <FiShoppingCart />
                  <span>Cart</span>
                </NavLink>

                <NavLink
                  to="/orders"
                  className={getNavLinkClass}
                >
                  <FiPackage />
                  <span>Orders</span>
                </NavLink>
              </>
            )}
          </div>

          {/* =================================================
              DESKTOP RIGHT SIDE
          ================================================= */}
          <div className="shopsphere-desktop-actions">

            {isAuthenticated ? (
              <>
                <div className="shopsphere-user">
                  <div className="shopsphere-user-avatar">
                    {user?.name
                      ? user.name.charAt(0).toUpperCase()
                      : "S"}
                  </div>

                  <span className="shopsphere-user-name">
                    Hi,{" "}
                    {user?.name || "ShopSphere Customer"}
                  </span>
                </div>

                <NavLink
                  to="/profile"
                  className={getNavLinkClass}
                >
                  <FiUser />
                  <span>Profile</span>
                </NavLink>

                {user?.role === "ADMIN" && (
                  <NavLink
                    to="/admin"
                    className="shopsphere-admin-link"
                  >
                    <FiShield />
                    <span>Admin</span>
                  </NavLink>
                )}

                <button
                  type="button"
                  className="shopsphere-logout-btn"
                  onClick={handleLogout}
                >
                  <FiLogOut />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className={getNavLinkClass}
                >
                  <FiLogIn />
                  <span>Login</span>
                </NavLink>

                <Link
                  to="/register"
                  className="shopsphere-register-btn"
                >
                  <FiUserPlus />
                  <span>Register</span>
                </Link>
              </>
            )}
          </div>

          {/* =================================================
              MOBILE MENU BUTTON
          ================================================= */}
          <button
            type="button"
            className={`shopsphere-menu-btn ${
              isMenuOpen
                ? "shopsphere-menu-btn-open"
                : ""
            }`}
            onClick={() =>
              setIsMenuOpen((prev) => !prev)
            }
            aria-label={
              isMenuOpen
                ? "Close navigation menu"
                : "Open navigation menu"
            }
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>

        {/* =================================================
            MOBILE MENU
        ================================================= */}
        <div
          className={`shopsphere-mobile-menu ${
            isMenuOpen
              ? "shopsphere-mobile-menu-open"
              : ""
          }`}
        >
          <div className="shopsphere-mobile-menu-inner">

            {/* Home */}
            <NavLink
              to="/"
              end
              className={getNavLinkClass}
              onClick={closeMenu}
            >
              <FiHome />
              <span>Home</span>
            </NavLink>

            {/* Products */}
            <NavLink
              to="/products"
              className={getNavLinkClass}
              onClick={closeMenu}
            >
              <FiShoppingBag />
              <span>Products</span>
            </NavLink>

            {/* AI Assistant */}
            <NavLink
              to="/ai-assistant"
              className={getNavLinkClass}
              onClick={closeMenu}
            >
              <FiMessageCircle />
              <span>AI Assistant</span>
            </NavLink>

            {/* Compare */}
            <NavLink
              to="/compare"
              className={getNavLinkClass}
              onClick={closeMenu}
            >
              <FiBarChart2 />
              <span>Compare</span>

              {compareCount > 0 && (
                <span className="shopsphere-nav-badge">
                  {compareCount}
                </span>
              )}
            </NavLink>

            {isAuthenticated && (
              <>
                {/* Wishlist */}
                <NavLink
                  to="/wishlist"
                  className={getNavLinkClass}
                  onClick={closeMenu}
                >
                  <FiHeart />
                  <span>Wishlist</span>
                </NavLink>

                {/* Cart */}
                <NavLink
                  to="/cart"
                  className={getNavLinkClass}
                  onClick={closeMenu}
                >
                  <FiShoppingCart />
                  <span>Cart</span>
                </NavLink>

                {/* Orders */}
                <NavLink
                  to="/orders"
                  className={getNavLinkClass}
                  onClick={closeMenu}
                >
                  <FiPackage />
                  <span>Orders</span>
                </NavLink>

                {/* Profile */}
                <NavLink
                  to="/profile"
                  className={getNavLinkClass}
                  onClick={closeMenu}
                >
                  <FiUser />
                  <span>Profile</span>
                </NavLink>

                {/* Admin */}
                {user?.role === "ADMIN" && (
                  <NavLink
                    to="/admin"
                    className="shopsphere-admin-link"
                    onClick={closeMenu}
                  >
                    <FiShield />
                    <span>Admin</span>
                  </NavLink>
                )}

                {/* Mobile User */}
                <div className="shopsphere-mobile-user">
                  <div className="shopsphere-user-avatar">
                    {user?.name
                      ? user.name.charAt(0).toUpperCase()
                      : "S"}
                  </div>

                  <div>
                    <small>Welcome back</small>

                    <strong>
                      {user?.name ||
                        "ShopSphere Customer"}
                    </strong>
                  </div>
                </div>

                {/* Logout */}
                <button
                  type="button"
                  className="shopsphere-mobile-logout"
                  onClick={handleLogout}
                >
                  <FiLogOut />
                  <span>Logout</span>
                </button>
              </>
            )}

            {!isAuthenticated && (
              <div className="shopsphere-mobile-auth">

                <NavLink
                  to="/login"
                  className={getNavLinkClass}
                  onClick={closeMenu}
                >
                  <FiLogIn />
                  <span>Login</span>
                </NavLink>

                <Link
                  to="/register"
                  className="shopsphere-register-btn"
                  onClick={closeMenu}
                >
                  <FiUserPlus />
                  <span>Register</span>
                </Link>

              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;