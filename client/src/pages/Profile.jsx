import { useSelector } from "react-redux";

const Profile = () => {
  const { user } = useSelector(
    (state) => state.auth
  );

  if (!user) {
    return (
      <div className="container py-5">
        <div className="alert alert-warning">
          Please login to view your profile.
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">

      <div className="row justify-content-center">

        <div className="col-md-8 col-lg-6">

          <div className="card shadow-sm">

            <div className="card-body p-4">

              <h2 className="fw-bold mb-4">
                My Profile
              </h2>

              {/* Avatar */}

              <div className="text-center mb-4">

                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="rounded-circle"
                    width="100"
                    height="100"
                    style={{
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <div
                    className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center mx-auto"
                    style={{
                      width: "100px",
                      height: "100px",
                      fontSize: "40px",
                      fontWeight: "bold",
                    }}
                  >
                    {user.name
                      ?.charAt(0)
                      .toUpperCase()}
                  </div>
                )}

              </div>

              {/* Name */}

              <div className="mb-3">

                <label className="form-label fw-semibold">
                  Name
                </label>

                <div className="form-control bg-light">
                  {user.name}
                </div>

              </div>

              {/* Email */}

              <div className="mb-3">

                <label className="form-label fw-semibold">
                  Email
                </label>

                <div className="form-control bg-light">
                  {user.email}
                </div>

              </div>

              {/* Role */}

              <div className="mb-3">

                <label className="form-label fw-semibold">
                  Role
                </label>

                <div>
                  <span
                    className={`badge ${
                      user.role === "ADMIN"
                        ? "bg-danger"
                        : "bg-primary"
                    }`}
                  >
                    {user.role}
                  </span>
                </div>

              </div>

              {/* Phone */}

              <div className="mb-3">

                <label className="form-label fw-semibold">
                  Phone
                </label>

                <div className="form-control bg-light">
                  {user.phone || "Not provided"}
                </div>

              </div>

              {/* Address */}

              <div className="mb-3">

                <label className="form-label fw-semibold">
                  Address
                </label>

                <div className="border rounded p-3 bg-light">

                  <div>
                    <strong>Street:</strong>{" "}
                    {user.address?.street ||
                      "Not provided"}
                  </div>

                  <div>
                    <strong>City:</strong>{" "}
                    {user.address?.city ||
                      "Not provided"}
                  </div>

                  <div>
                    <strong>State:</strong>{" "}
                    {user.address?.state ||
                      "Not provided"}
                  </div>

                  <div>
                    <strong>Postal Code:</strong>{" "}
                    {user.address?.postalCode ||
                      "Not provided"}
                  </div>

                  <div>
                    <strong>Country:</strong>{" "}
                    {user.address?.country ||
                      "India"}
                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Profile;