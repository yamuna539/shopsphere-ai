import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";

const AdminCategoryForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const [loading, setLoading] = useState(
    isEditMode
  );

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  /*
  ==================================================
  FETCH CATEGORY FOR EDIT
  ==================================================
  */

  useEffect(() => {
  if (!isEditMode) {
    setLoading(false);
    return;
  }

  const fetchCategory = async () => {
    try {
      setLoading(true);
      setError("");

      // Get all categories
      const response =
        await api.get("/categories");

      const categories =
        response.data.categories || [];

      // Find the category using the URL id
      const category = categories.find(
        (item) => item._id === id
      );

      if (!category) {
        setError(
          "Category not found."
        );
        return;
      }

      setFormData({
        name: category.name || "",
        description:
          category.description || "",
      });
    } catch (error) {
      console.error(
        "Failed to fetch category:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to load category"
      );
    } finally {
      setLoading(false);
    }
  };

  fetchCategory();
}, [id, isEditMode]);

  /*
  ==================================================
  INPUT CHANGE
  ==================================================
  */

  const handleChange = (event) => {
    const { name, value } =
      event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  /*
  ==================================================
  SUBMIT
  ==================================================
  */

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const name = formData.name.trim();
    const description =
      formData.description.trim();

    if (!name) {
      setError(
        "Category name is required."
      );
      return;
    }

    try {
      setSaving(true);

      const payload = {
        name,
        description,
      };

      if (isEditMode) {
        await api.put(
          `/admin/categories/${id}`,
          payload
        );

        setSuccess(
          "Category updated successfully."
        );
      } else {
        await api.post(
          "/admin/categories",
          payload
        );

        setSuccess(
          "Category created successfully."
        );
      }

      /*
      Give the success message a moment,
      then return to categories.
      */

      setTimeout(() => {
        navigate("/admin/categories");
      }, 700);
    } catch (error) {
      console.error(
        "Category save error:",
        error
      );

      setError(
        error.response?.data?.message ||
          `Failed to ${
            isEditMode
              ? "update"
              : "create"
          } category`
      );
    } finally {
      setSaving(false);
    }
  };

  /*
  ==================================================
  LOADING
  ==================================================
  */

  if (loading) {
    return (
      <div className="admin-category-form-loading">
        <div className="admin-category-form-spinner" />

        <p>
          Loading category...
        </p>
      </div>
    );
  }

  /*
  ==================================================
  UI
  ==================================================
  */

  return (
    <div className="admin-category-form-page">

      {/* HEADER */}

      <div className="admin-category-form-header">

        <div>

          <button
            type="button"
            className="admin-category-back-button"
            onClick={() =>
              navigate(
                "/admin/categories"
              )
            }
          >
            ← Back to Categories
          </button>

          <span className="admin-category-form-eyebrow">
            CATALOG MANAGEMENT
          </span>

          <h1>
            {isEditMode
              ? "Edit Category"
              : "Add Category"}
          </h1>

          <p>
            {isEditMode
              ? "Update the category information below."
              : "Create a new category for your ShopSphere catalog."}
          </p>

        </div>

      </div>

      {/* FORM CARD */}

      <div className="admin-category-form-layout">

        <div className="admin-category-form-card">

          <div className="admin-category-form-card-header">
            <div>
              <h2>
                Category Information
              </h2>

              <p>
                Enter the basic details for
                this category.
              </p>
            </div>
          </div>

          {/* ERROR */}

          {error && (
            <div className="admin-category-form-alert error">
              <strong>
                Error
              </strong>

              <span>
                {error}
              </span>
            </div>
          )}

          {/* SUCCESS */}

          {success && (
            <div className="admin-category-form-alert success">
              <strong>
                Success
              </strong>

              <span>
                {success}
              </span>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
          >

            {/* NAME */}

            <div className="admin-category-form-group">

              <label htmlFor="name">
                Category Name
                <span>*</span>
              </label>

              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Example: Electronics"
                maxLength={100}
                disabled={saving}
              />

              <small>
                Use a short and clear category
                name.
              </small>

            </div>

            {/* DESCRIPTION */}

            <div className="admin-category-form-group">

              <label htmlFor="description">
                Description
              </label>

              <textarea
                id="description"
                name="description"
                value={
                  formData.description
                }
                onChange={handleChange}
                placeholder="Describe this category..."
                rows={5}
                maxLength={500}
                disabled={saving}
              />

              <small>
                Optional. Maximum 500
                characters.
              </small>

            </div>

            {/* ACTIONS */}

            <div className="admin-category-form-actions">

              <button
                type="button"
                className="admin-category-cancel-button"
                onClick={() =>
                  navigate(
                    "/admin/categories"
                  )
                }
                disabled={saving}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="admin-category-save-button"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <span className="admin-category-button-spinner" />
                    Saving...
                  </>
                ) : (
                  <>
                    {isEditMode
                      ? "✓ Update Category"
                      : "+ Create Category"}
                  </>
                )}
              </button>

            </div>

          </form>

        </div>

        {/* SIDE PREVIEW */}

        <div className="admin-category-preview-card">

          <div className="admin-category-preview-icon">
            📁
          </div>

          <span>
            CATEGORY PREVIEW
          </span>

          <h3>
            {formData.name.trim() ||
              "Your Category"}
          </h3>

          <p>
            {formData.description.trim() ||
              "Your category description will appear here."}
          </p>

          <div className="admin-category-preview-line" />

          <div className="admin-category-preview-info">
            <span>
              Status
            </span>

            <strong>
              ● Active
            </strong>
          </div>

        </div>

      </div>

    </div>
  );
};

export default AdminCategoryForm;