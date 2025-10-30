import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateUser } from "../store/userSlice";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    favoriteOffice: "",
    favoriteWorkstation: "",
  });
  
  const [offices, setOffices] = useState([]);
  const [selectedOffice, setSelectedOffice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        favoriteOffice: user.favoriteOffice?._id || user.favoriteOffice || "",
        favoriteWorkstation: user.favoriteWorkstation || "",
      });
    }
    fetchOffices();
  }, [user]);

  const fetchOffices = async () => {
    try {
      const { data } = await API.get("/offices");
      setOffices(data);
      
      // Si el usuario tiene oficina favorita, cargar workstations
      if (user?.favoriteOffice) {
        const office = data.find(o => o._id === (user.favoriteOffice._id || user.favoriteOffice));
        setSelectedOffice(office);
      }
    } catch (err) {
      console.error("Error fetching offices:", err);
    }
  };

  const handleOfficeChange = (officeId) => {
    setFormData({ ...formData, favoriteOffice: officeId, favoriteWorkstation: "" });
    const office = offices.find((o) => o._id === officeId);
    setSelectedOffice(office);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      await API.put("/auth/me", {
        name: formData.name,
        phone: formData.phone,
        favoriteOffice: formData.favoriteOffice || null,
        favoriteWorkstation: formData.favoriteWorkstation || null,
      });

      // Actualizar Redux
      dispatch(updateUser({
        name: formData.name,
        phone: formData.phone,
        favoriteOffice: formData.favoriteOffice,
        favoriteWorkstation: formData.favoriteWorkstation,
      }));

      // Actualizar localStorage
      const updatedUser = {
        ...user,
        name: formData.name,
        phone: formData.phone,
        favoriteOffice: formData.favoriteOffice,
        favoriteWorkstation: formData.favoriteWorkstation,
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Error updating profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => navigate("/")}
            className="text-blue-600 hover:underline focus-ring rounded px-2"
          >
            ← Back to Dashboard
          </button>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-4 mb-6 pb-6 border-b">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{user?.name}</h1>
              <p className="text-gray-600">{user?.email}</p>
              <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-semibold ${
                user?.role === "admin" 
                  ? "bg-purple-100 text-purple-800"
                  : user?.role === "servicedesk"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-gray-100 text-gray-800"
              }`}>
                {user?.role}
              </span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-800">
              Personal Information
            </h2>

            {/* Name */}
            <div>
              <label 
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Full Name <span className="text-red-600">*</span>
              </label>
              <input
                id="name"
                type="text"
                className="w-full border border-gray-300 p-3 rounded-lg focus-ring"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            {/* Email (readonly) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                className="w-full border border-gray-300 p-3 rounded-lg bg-gray-50 cursor-not-allowed"
                value={formData.email}
                disabled
              />
              <p className="text-xs text-gray-500 mt-1">
                Email cannot be changed
              </p>
            </div>

            {/* Phone */}
            <div>
              <label 
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Phone
              </label>
              <input
                id="phone"
                type="tel"
                className="w-full border border-gray-300 p-3 rounded-lg focus-ring"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+34 600 000 000"
              />
            </div>

            {/* Favorites Section */}
            <div className="pt-4 border-t">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Favorites (Quick Ticket Creation)
              </h2>

              {/* Favorite Office */}
              <div className="mb-4">
                <label 
                  htmlFor="favoriteOffice"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Favorite Office
                </label>
                <select
                  id="favoriteOffice"
                  className="w-full border border-gray-300 p-3 rounded-lg focus-ring"
                  value={formData.favoriteOffice}
                  onChange={(e) => handleOfficeChange(e.target.value)}
                >
                  <option value="">None</option>
                  {offices.map((office) => (
                    <option key={office._id} value={office._id}>
                      {office.name} - {office.city}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  This will be pre-selected when creating tickets
                </p>
              </div>

              {/* Favorite Workstation */}
              <div>
                <label 
                  htmlFor="favoriteWorkstation"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Favorite Workstation
                </label>
                <select
                  id="favoriteWorkstation"
                  className="w-full border border-gray-300 p-3 rounded-lg focus-ring"
                  value={formData.favoriteWorkstation}
                  onChange={(e) =>
                    setFormData({ ...formData, favoriteWorkstation: e.target.value })
                  }
                  disabled={!selectedOffice}
                >
                  <option value="">None</option>
                  {selectedOffice?.workstations?.map((ws) => (
                    <option key={ws.id} value={ws.id}>
                      {ws.name} - {ws.floor}
                    </option>
                  ))}
                </select>
                {!selectedOffice && (
                  <p className="text-xs text-gray-500 mt-1">
                    Select a favorite office first
                  </p>
                )}
              </div>
            </div>

            {/* Success/Error Messages */}
            {success && (
              <div 
                role="alert"
                className="bg-green-50 border border-green-200 text-green-700 p-3 rounded-lg"
              >
                ✓ Profile updated successfully!
              </div>
            )}

            {error && (
              <div 
                role="alert"
                className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg"
              >
                {error}
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => navigate("/")}
                className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300 font-semibold focus-ring"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold focus-ring disabled:opacity-60"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;