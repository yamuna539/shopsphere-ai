import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  createProduct,
  updateProduct,
  clearAdminProductError,
} from "../../redux/slices/adminProductSlice";

import api from "../../services/api";

const AdminProductForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const isEditMode = Boolean(id);

  const {
    createLoading,
    updateLoading,
    error,
    successMessage,
  } = useSelector((state) => state.adminProducts);

  const [loadingProduct, setLoadingProduct] = useState(false);
  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    originalPrice: "",
    brand: "",
    category: "",
    stock: "",
    images: [],
    features: [],
    specifications: [],
  });

  const [imageInput, setImageInput] = useState("");
  const [featureInput, setFeatureInput] = useState("");
  const [specificationKey, setSpecificationKey] = useState("");
  const [specificationValue, setSpecificationValue] = useState("");

  const [formError, setFormError] = useState("");

  /*
  =====================================================
  FETCH CATEGORIES
  =====================================================
  */

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/categories");

        setCategories(response.data.categories || []);
      } catch (error) {
        console.error("Failed to load categories:", error);
      }
    };

    fetchCategories();
  }, []);

  /*
  =====================================================
  FETCH PRODUCT FOR EDIT
  =====================================================
  */

  useEffect(() => {
    if (!isEditMode) {
      return;
    }

    const fetchProduct = async () => {
      try {
        setLoadingProduct(true);

        const response = await api.get(
          `/admin/products/${id}`
        );

        const product = response.data.data;

        setFormData({
          name: product.name || "",
          description: product.description || "",
          price: product.price ?? "",
          originalPrice: product.originalPrice ?? "",
          brand: product.brand || "",

          category:
            product.category?._id ||
            product.category ||
            "",

          stock: product.stock ?? "",

          images: Array.isArray(product.images)
            ? product.images
            : [],

          features: Array.isArray(product.features)
            ? product.features
            : [],

          specifications: product.specifications
            ? Object.entries(product.specifications).map(
                ([key, value]) => ({
                  key,
                  value,
                })
              )
            : [],
        });
      } catch (error) {
        console.error(
          "Failed to fetch product:",
          error
        );

        setFormError(
          "Unable to load product information."
        );
      } finally {
        setLoadingProduct(false);
      }
    };

    fetchProduct();
  }, [id, isEditMode]);

  /*
  =====================================================
  INPUT CHANGE
  =====================================================
  */

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setFormError("");

    if (error) {
      dispatch(clearAdminProductError());
    }
  };

  /*
  =====================================================
  ADD IMAGE
  =====================================================
  */

  const handleAddImage = () => {
    const image = imageInput.trim();

    if (!image) {
      return;
    }

    setFormData((previous) => ({
      ...previous,
      images: [...previous.images, image],
    }));

    setImageInput("");
  };

  /*
  =====================================================
  REMOVE IMAGE
  =====================================================
  */

  const handleRemoveImage = (index) => {
    setFormData((previous) => ({
      ...previous,
      images: previous.images.filter(
        (_, imageIndex) => imageIndex !== index
      ),
    }));
  };

  /*
  =====================================================
  ADD FEATURE
  =====================================================
  */

  const handleAddFeature = () => {
    const feature = featureInput.trim();

    if (!feature) {
      return;
    }

    setFormData((previous) => ({
      ...previous,
      features: [...previous.features, feature],
    }));

    setFeatureInput("");
  };

  /*
  =====================================================
  REMOVE FEATURE
  =====================================================
  */

  const handleRemoveFeature = (index) => {
    setFormData((previous) => ({
      ...previous,
      features: previous.features.filter(
        (_, featureIndex) => featureIndex !== index
      ),
    }));
  };

  /*
  =====================================================
  ADD SPECIFICATION
  =====================================================
  */

  const handleAddSpecification = () => {
    const key = specificationKey.trim();
    const value = specificationValue.trim();

    if (!key || !value) {
      return;
    }

    setFormData((previous) => ({
      ...previous,
      specifications: [
        ...previous.specifications,
        {
          key,
          value,
        },
      ],
    }));

    setSpecificationKey("");
    setSpecificationValue("");
  };

  /*
  =====================================================
  REMOVE SPECIFICATION
  =====================================================
  */

  const handleRemoveSpecification = (index) => {
    setFormData((previous) => ({
      ...previous,
      specifications:
        previous.specifications.filter(
          (_, specificationIndex) =>
            specificationIndex !== index
        ),
    }));
  };

  /*
  =====================================================
  FORM SUBMIT
  =====================================================
  */

  const handleSubmit = async (event) => {
    event.preventDefault();

    dispatch(clearAdminProductError());
    setFormError("");

    /*
    -------------------------------
    VALIDATION
    -------------------------------
    */

    if (!formData.name.trim()) {
      setFormError("Product name is required.");
      return;
    }

    if (!formData.category) {
      setFormError("Please select a category.");
      return;
    }

    if (
      formData.price === "" ||
      Number(formData.price) < 0
    ) {
      setFormError("Please enter a valid price.");
      return;
    }

    if (
      formData.stock === "" ||
      Number(formData.stock) < 0
    ) {
      setFormError("Please enter valid stock.");
      return;
    }

    if (
      formData.originalPrice !== "" &&
      Number(formData.originalPrice) < 0
    ) {
      setFormError(
        "Original price cannot be negative."
      );
      return;
    }

    /*
    -------------------------------
    SPECIFICATIONS OBJECT
    -------------------------------
    */

    const specificationsObject = {};

    formData.specifications.forEach(
      (specification) => {
        specificationsObject[
          specification.key
        ] = specification.value;
      }
    );

    /*
    -------------------------------
    PRODUCT DATA
    -------------------------------
    */

    const productData = {
      name: formData.name.trim(),

      description:
        formData.description.trim(),

      price: Number(formData.price),

      originalPrice:
        formData.originalPrice === ""
          ? Number(formData.price)
          : Number(formData.originalPrice),

      category: formData.category,

      brand: formData.brand.trim(),

      images: formData.images,

      stock: Number(formData.stock),

      specifications:
        specificationsObject,

      features: formData.features,
    };

    try {
      if (isEditMode) {
        const result = await dispatch(
          updateProduct({
            productId: id,
            productData,
          })
        );

        if (
          updateProduct.fulfilled.match(result)
        ) {
          navigate("/admin/products");
        }
      } else {
        const result = await dispatch(
          createProduct(productData)
        );

        if (
          createProduct.fulfilled.match(result)
        ) {
          navigate("/admin/products");
        }
      }
    } catch (error) {
      console.error(
        "Product save error:",
        error
      );
    }
  };

  /*
  =====================================================
  ENTER KEY HELPERS
  =====================================================
  */

  const handleImageKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleAddImage();
    }
  };

  const handleFeatureKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleAddFeature();
    }
  };

  const handleSpecificationKeyDown = (
    event
  ) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleAddSpecification();
    }
  };

  /*
  =====================================================
  LOADING
  =====================================================
  */

  if (loadingProduct) {
    return (
      <div className="admin-form-loading">
        <div className="admin-form-loading-icon">
          📦
        </div>

        <h4>Loading Product</h4>

        <p>
          Please wait while we load the
          product information...
        </p>
      </div>
    );
  }

  /*
  =====================================================
  UI
  =====================================================
  */

  return (
    <div className="admin-product-page">

      {/* =========================================
          HEADER
      ========================================= */}

      <div className="admin-product-header">

        <div className="admin-product-header-left">

          <div className="admin-product-header-icon">
            {isEditMode ? "✏️" : "＋"}
          </div>

          <div>
            <span className="admin-product-eyebrow">
              PRODUCT MANAGEMENT
            </span>

            <h1>
              {isEditMode
                ? "Edit Product"
                : "Create Product"}
            </h1>

            <p>
              {isEditMode
                ? "Update your product information and catalog details."
                : "Add a new product to your ShopSphere catalog."}
            </p>
          </div>

        </div>

        <button
          type="button"
          className="admin-product-back-btn"
          onClick={() =>
            navigate("/admin/products")
          }
        >
          ←
          <span>Back to Products</span>
        </button>

      </div>

      {/* =========================================
          ALERTS
      ========================================= */}

      {(formError || error) && (
        <div className="admin-product-alert admin-product-alert-error">
          <span className="admin-product-alert-icon">
            !
          </span>

          <div>
            <strong>
              Unable to save product
            </strong>

            <p>
              {formError || error}
            </p>
          </div>
        </div>
      )}

      {successMessage && (
        <div className="admin-product-alert admin-product-alert-success">
          <span className="admin-product-alert-icon">
            ✓
          </span>

          <div>
            <strong>
              Success
            </strong>

            <p>
              {successMessage}
            </p>
          </div>
        </div>
      )}

      {/* =========================================
          FORM
      ========================================= */}

      <form onSubmit={handleSubmit}>

        <div className="admin-product-layout">

          {/* =====================================
              LEFT CONTENT
          ===================================== */}

          <div className="admin-product-main">

            {/* BASIC INFORMATION */}

            <section className="admin-form-card">

              <div className="admin-form-card-header">

                <div className="admin-section-icon purple">
                  📋
                </div>

                <div>
                  <h2>
                    Basic Information
                  </h2>

                  <p>
                    Enter the main details of
                    your product.
                  </p>
                </div>

              </div>

              <div className="admin-form-card-body">

                {/* PRODUCT NAME */}

                <div className="admin-field full">

                  <label>
                    Product Name
                    <span>*</span>
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Example: Gaming X15 Laptop"
                  />

                </div>

                {/* DESCRIPTION */}

                <div className="admin-field full">

                  <label>
                    Description
                  </label>

                  <textarea
                    name="description"
                    rows="5"
                    value={
                      formData.description
                    }
                    onChange={handleChange}
                    placeholder="Write a clear and attractive description for your product..."
                  />

                  <small>
                    Give customers a short,
                    useful description of
                    the product.
                  </small>

                </div>

                {/* PRICE ROW */}

                <div className="admin-field-grid">

                  <div className="admin-field">

                    <label>
                      Selling Price
                      <span>*</span>
                    </label>

                    <div className="admin-input-prefix">
                      <span>₹</span>

                      <input
                        type="number"
                        name="price"
                        min="0"
                        value={
                          formData.price
                        }
                        onChange={
                          handleChange
                        }
                        placeholder="2499"
                      />
                    </div>

                  </div>

                  <div className="admin-field">

                    <label>
                      Original Price
                    </label>

                    <div className="admin-input-prefix">
                      <span>₹</span>

                      <input
                        type="number"
                        name="originalPrice"
                        min="0"
                        value={
                          formData.originalPrice
                        }
                        onChange={
                          handleChange
                        }
                        placeholder="2999"
                      />
                    </div>

                  </div>

                </div>

                {/* BRAND / STOCK */}

                <div className="admin-field-grid">

                  <div className="admin-field">

                    <label>
                      Brand
                    </label>

                    <input
                      type="text"
                      name="brand"
                      value={
                        formData.brand
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="Example: HP, Samsung, Logitech"
                    />

                  </div>

                  <div className="admin-field">

                    <label>
                      Stock
                      <span>*</span>
                    </label>

                    <input
                      type="number"
                      name="stock"
                      min="0"
                      value={
                        formData.stock
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="50"
                    />

                  </div>

                </div>

                {/* CATEGORY */}

                <div className="admin-field full">

                  <label>
                    Category
                    <span>*</span>
                  </label>

                  <select
                    name="category"
                    value={
                      formData.category
                    }
                    onChange={
                      handleChange
                    }
                  >
                    <option value="">
                      Select a category
                    </option>

                    {categories.map(
                      (category) => (
                        <option
                          key={
                            category._id
                          }
                          value={
                            category._id
                          }
                        >
                          {category.name}
                        </option>
                      )
                    )}
                  </select>

                </div>

              </div>

            </section>

            {/* =================================
                IMAGES
            ================================= */}

            <section className="admin-form-card">

              <div className="admin-form-card-header">

                <div className="admin-section-icon blue">
                  🖼️
                </div>

                <div>
                  <h2>
                    Product Images
                  </h2>

                  <p>
                    Add image URLs for your
                    product gallery.
                  </p>
                </div>

                <div className="admin-count-badge">
                  {formData.images.length}
                </div>

              </div>

              <div className="admin-form-card-body">

                <div className="admin-add-row">

                  <input
                    type="text"
                    value={
                      imageInput
                    }
                    onChange={(event) =>
                      setImageInput(
                        event.target.value
                      )
                    }
                    onKeyDown={
                      handleImageKeyDown
                    }
                    placeholder="Paste product image URL..."
                  />

                  <button
                    type="button"
                    className="admin-small-primary"
                    onClick={
                      handleAddImage
                    }
                  >
                    + Add
                  </button>

                </div>

                {formData.images.length ===
                0 ? (
                  <div className="admin-empty-box">

                    <div>
                      🖼️
                    </div>

                    <strong>
                      No images added
                    </strong>

                    <span>
                      Add at least one image
                      URL for your product.
                    </span>

                  </div>
                ) : (
                  <div className="admin-image-grid">

                    {formData.images.map(
                      (image, index) => (
                        <div
                          className="admin-image-card"
                          key={index}
                        >

                          <div className="admin-image-preview">

                            <img
                              src={image}
                              alt={`Product ${
                                index + 1
                              }`}
                              onError={(
                                event
                              ) => {
                                event.currentTarget.style.display =
                                  "none";
                              }}
                            />

                          </div>

                          <div className="admin-image-info">

                            <span>
                              Image{" "}
                              {index + 1}
                            </span>

                            <button
                              type="button"
                              onClick={() =>
                                handleRemoveImage(
                                  index
                                )
                              }
                            >
                              ×
                            </button>

                          </div>

                        </div>
                      )
                    )}

                  </div>
                )}

              </div>

            </section>

            {/* =================================
                FEATURES
            ================================= */}

            <section className="admin-form-card">

              <div className="admin-form-card-header">

                <div className="admin-section-icon green">
                  ✨
                </div>

                <div>
                  <h2>
                    Product Features
                  </h2>

                  <p>
                    Highlight important
                    product benefits.
                  </p>
                </div>

                <div className="admin-count-badge">
                  {formData.features.length}
                </div>

              </div>

              <div className="admin-form-card-body">

                <div className="admin-add-row">

                  <input
                    type="text"
                    value={
                      featureInput
                    }
                    onChange={(event) =>
                      setFeatureInput(
                        event.target.value
                      )
                    }
                    onKeyDown={
                      handleFeatureKeyDown
                    }
                    placeholder="Example: 16GB RAM"
                  />

                  <button
                    type="button"
                    className="admin-small-primary"
                    onClick={
                      handleAddFeature
                    }
                  >
                    + Add
                  </button>

                </div>

                {formData.features.length ===
                0 ? (
                  <div className="admin-empty-box compact">

                    <div>
                      ✨
                    </div>

                    <span>
                      No features added yet.
                    </span>

                  </div>
                ) : (
                  <div className="admin-feature-list">

                    {formData.features.map(
                      (
                        feature,
                        index
                      ) => (
                        <div
                          className="admin-feature-item"
                          key={index}
                        >

                          <span className="admin-feature-check">
                            ✓
                          </span>

                          <span>
                            {feature}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              handleRemoveFeature(
                                index
                              )
                            }
                          >
                            ×
                          </button>

                        </div>
                      )
                    )}

                  </div>
                )}

              </div>

            </section>

            {/* =================================
                SPECIFICATIONS
            ================================= */}

            <section className="admin-form-card">

              <div className="admin-form-card-header">

                <div className="admin-section-icon orange">
                  ⚙️
                </div>

                <div>
                  <h2>
                    Specifications
                  </h2>

                  <p>
                    Add technical details
                    such as RAM, color, size.
                  </p>
                </div>

                <div className="admin-count-badge">
                  {
                    formData
                      .specifications
                      .length
                  }
                </div>

              </div>

              <div className="admin-form-card-body">

                <div className="admin-spec-add">

                  <input
                    type="text"
                    value={
                      specificationKey
                    }
                    onChange={(event) =>
                      setSpecificationKey(
                        event.target.value
                      )
                    }
                    onKeyDown={
                      handleSpecificationKeyDown
                    }
                    placeholder="Key e.g. RAM"
                  />

                  <input
                    type="text"
                    value={
                      specificationValue
                    }
                    onChange={(event) =>
                      setSpecificationValue(
                        event.target.value
                      )
                    }
                    onKeyDown={
                      handleSpecificationKeyDown
                    }
                    placeholder="Value e.g. 16GB"
                  />

                  <button
                    type="button"
                    className="admin-small-primary"
                    onClick={
                      handleAddSpecification
                    }
                  >
                    + Add
                  </button>

                </div>

                {formData.specifications
                  .length === 0 ? (
                  <div className="admin-empty-box compact">

                    <div>
                      ⚙️
                    </div>

                    <span>
                      No specifications
                      added yet.
                    </span>

                  </div>
                ) : (
                  <div className="admin-spec-list">

                    {formData.specifications.map(
                      (
                        specification,
                        index
                      ) => (
                        <div
                          className="admin-spec-item"
                          key={index}
                        >

                          <div>
                            <span>
                              {
                                specification.key
                              }
                            </span>

                            <strong>
                              {
                                specification.value
                              }
                            </strong>
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              handleRemoveSpecification(
                                index
                              )
                            }
                          >
                            Remove
                          </button>

                        </div>
                      )
                    )}

                  </div>
                )}

              </div>

            </section>

          </div>

          {/* =====================================
              RIGHT SUMMARY
          ===================================== */}

          <aside className="admin-product-sidebar">

            <div className="admin-summary-card">

              <div className="admin-summary-top">

                <span className="admin-summary-label">
                  PRODUCT PREVIEW
                </span>

                <div className="admin-summary-icon">
                  📦
                </div>

              </div>

              <h2>
                {formData.name ||
                  "Your Product"}
              </h2>

              <p>
                {formData.brand ||
                  "Brand not specified"}
              </p>

              <div className="admin-summary-price">

                ₹
                {formData.price
                  ? Number(
                      formData.price
                    ).toLocaleString(
                      "en-IN"
                    )
                  : "0"}

              </div>

              {formData.originalPrice &&
                Number(
                  formData.originalPrice
                ) >
                  Number(
                    formData.price || 0
                  ) && (
                  <div className="admin-summary-original">

                    ₹
                    {Number(
                      formData.originalPrice
                    ).toLocaleString(
                      "en-IN"
                    )}

                  </div>
                )}

              <div className="admin-summary-divider" />

              <div className="admin-summary-row">

                <span>
                  Category
                </span>

                <strong>
                  {categories.find(
                    (category) =>
                      category._id ===
                      formData.category
                  )?.name ||
                    "Not selected"}
                </strong>

              </div>

              <div className="admin-summary-row">

                <span>
                  Stock
                </span>

                <strong>
                  {formData.stock ||
                    0}
                </strong>

              </div>

              <div className="admin-summary-row">

                <span>
                  Images
                </span>

                <strong>
                  {
                    formData.images
                      .length
                  }
                </strong>

              </div>

              <div className="admin-summary-row">

                <span>
                  Features
                </span>

                <strong>
                  {
                    formData.features
                      .length
                  }
                </strong>

              </div>

              <div className="admin-summary-row">

                <span>
                  Specifications
                </span>

                <strong>
                  {
                    formData
                      .specifications
                      .length
                  }
                </strong>

              </div>

            </div>

            {/* SAVE CARD */}

            <div className="admin-save-card">

              <div className="admin-save-icon">
                {isEditMode
                  ? "✏️"
                  : "🚀"}
              </div>

              <h3>
                {isEditMode
                  ? "Ready to update?"
                  : "Ready to publish?"}
              </h3>

              <p>
                {isEditMode
                  ? "Review your changes and update the product."
                  : "Review the product details and add it to your catalog."}
              </p>

              <button
                type="submit"
                className="admin-save-button"
                disabled={
                  createLoading ||
                  updateLoading
                }
              >
                {createLoading ||
                updateLoading ? (
                  <>
                    <span className="admin-spinner" />
                    Saving...
                  </>
                ) : (
                  <>
                    {isEditMode
                      ? "✓ Update Product"
                      : "＋ Create Product"}
                  </>
                )}
              </button>

              <button
                type="button"
                className="admin-cancel-button"
                onClick={() =>
                  navigate(
                    "/admin/products"
                  )
                }
              >
                Cancel
              </button>

            </div>

            {/* QUICK INFO */}

            <div className="admin-help-card">

              <div>
                💡
              </div>

              <div>
                <strong>
                  Quick Tip
                </strong>

                <p>
                  Use clear product names,
                  high-quality images and
                  useful specifications to
                  make your products easier
                  to understand.
                </p>
              </div>

            </div>

          </aside>

        </div>

      </form>

    </div>
  );
};

export default AdminProductForm;