import React, { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [user, setUser] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    // Obtener info del usuario del localStorage
    const userData = JSON.parse(localStorage.getItem("user"));
    setUser(userData);
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const { data } = await API.get("/tickets");
      setTickets(data);
    } catch (err) {
      console.error("Error fetching tickets:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const getStatusBadge = (status) => {
    const colors = {
      open: "bg-yellow-100 text-yellow-800",
      assigned: "bg-blue-100 text-blue-800",
      in_progress: "bg-purple-100 text-purple-800",
      closed: "bg-green-100 text-green-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getPriorityBadge = (priority) => {
    const colors = {
      low: "bg-gray-100 text-gray-800",
      medium: "bg-yellow-100 text-yellow-800",
      high: "bg-orange-100 text-orange-800",
      urgent: "bg-red-100 text-red-800",
    };
    return colors[priority] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-6">
        <div className="bg-white rounded-xl shadow-md p-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">ServiceDesk AI</h1>
            <p className="text-sm text-gray-600">
              Welcome, {user?.name} ({user?.role})
            </p>
          </div>
          <div className="flex gap-3">
            {user?.role === "standard" && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                + New Ticket
              </button>
            )}
            {user?.role === "admin" && (
              <button
                onClick={() => navigate("/admin")}
                className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
              >
                Admin Panel
              </button>
            )}
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Tickets List */}
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">
            {user?.role === "standard" ? "My Tickets" : "All Tickets"}
          </h2>

          {tickets.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No tickets found</p>
              {user?.role === "standard" && (
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                >
                  Create your first ticket
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {tickets.map((ticket) => (
                <div
                  key={ticket._id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => navigate(`/tickets/${ticket._id}`)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg">{ticket.title}</h3>
                    <div className="flex gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(
                          ticket.status
                        )}`}
                      >
                        {ticket.status}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityBadge(
                          ticket.priority
                        )}`}
                      >
                        {ticket.priority}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">
                    {ticket.description}
                  </p>
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <div className="flex gap-4">
                      {user?.role !== "standard" && (
                        <span>
                          Created by: {ticket.user?.name || "Unknown"}
                        </span>
                      )}
                      {ticket.assignedTo && (
                        <span>Assigned to: {ticket.assignedTo.name}</span>
                      )}
                      {ticket.office && (
                        <span>Office: {ticket.office.name}</span>
                      )}
                    </div>
                    <span>
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Ticket Modal */}
      {showCreateModal && (
        <CreateTicketModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            fetchTickets();
          }}
        />
      )}
    </div>
  );
};

// Componente Modal para crear tickets
const CreateTicketModal = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium",
    office: "",
    workstation: "",
  });
  const [offices, setOffices] = useState([]);
  const [selectedWorkstation, setSelectedWorkstation] = useState(null);
  const [location, setLocation] = useState(null);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [mediaFiles, setMediaFiles] = useState([]);
  const [mediaPreviews, setMediaPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchOffices();
    getCurrentLocation();
  }, []);

  const fetchOffices = async () => {
    try {
      const { data } = await API.get("/offices");
      setOffices(data);
    } catch (err) {
      console.error("Error fetching offices:", err);
    }
  };

  const getCurrentLocation = () => {
    if ("geolocation" in navigator) {
      setGettingLocation(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            type: "Point",
            coordinates: [
              position.coords.longitude,
              position.coords.latitude,
            ],
          });
          setGettingLocation(false);
        },
        (err) => {
          console.error("Error getting location:", err);
          setGettingLocation(false);
        }
      );
    }
  };

  const handleOfficeChange = (officeId) => {
    setFormData({ ...formData, office: officeId, workstation: "" });
    const office = offices.find((o) => o._id === officeId);
    setSelectedWorkstation(office?.workstations || []);
  };

  const handleMediaChange = (e) => {
    const files = Array.from(e.target.files);
    setMediaFiles(files);

    // Crear previews
    const previews = files.map((file) => ({
      name: file.name,
      type: file.type,
      url: URL.createObjectURL(file),
    }));
    setMediaPreviews(previews);
  };

  const removeMedia = (index) => {
    const newFiles = [...mediaFiles];
    const newPreviews = [...mediaPreviews];
    
    // Liberar URL del preview
    URL.revokeObjectURL(newPreviews[index].url);
    
    newFiles.splice(index, 1);
    newPreviews.splice(index, 1);
    
    setMediaFiles(newFiles);
    setMediaPreviews(newPreviews);
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError("");

  try {
    // Crear FormData para enviar archivos
    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("priority", formData.priority);
    
    if (formData.office) formDataToSend.append("office", formData.office);
    if (formData.workstation) formDataToSend.append("workstation", formData.workstation);
    if (location) formDataToSend.append("location", JSON.stringify(location));

    // Agregar archivos
    mediaFiles.forEach((file) => {
      formDataToSend.append("media", file);
    });

    await API.post("/tickets", formDataToSend, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    onSuccess();
  } catch (err) {
    setError(err.response?.data?.error || "Error creating ticket");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl my-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Create New Ticket</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-1">Title *</label>
            <input
              type="text"
              className="w-full border p-2 rounded"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Description *
            </label>
            <textarea
              className="w-full border p-2 rounded"
              rows="4"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
            />
          </div>

          {/* Office & Workstation */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Office</label>
              <select
                className="w-full border p-2 rounded"
                value={formData.office}
                onChange={(e) => handleOfficeChange(e.target.value)}
              >
                <option value="">Select office...</option>
                {offices.map((office) => (
                  <option key={office._id} value={office._id}>
                    {office.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Workstation
              </label>
              <select
                className="w-full border p-2 rounded"
                value={formData.workstation}
                onChange={(e) =>
                  setFormData({ ...formData, workstation: e.target.value })
                }
                disabled={!selectedWorkstation?.length}
              >
                <option value="">Select workstation...</option>
                {selectedWorkstation?.map((ws) => (
                  <option key={ws.id} value={ws.id}>
                    {ws.name} - {ws.floor}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium mb-1">Priority</label>
            <select
              className="w-full border p-2 rounded"
              value={formData.priority}
              onChange={(e) =>
                setFormData({ ...formData, priority: e.target.value })
              }
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>

          {/* Geolocation */}
          <div className="bg-blue-50 p-3 rounded">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">📍 Location:</span>
              {gettingLocation ? (
                <span className="text-sm text-gray-600">Getting location...</span>
              ) : location ? (
                <span className="text-sm text-green-600">
                  ✓ Location captured ({location.coordinates[1].toFixed(4)}, {location.coordinates[0].toFixed(4)})
                </span>
              ) : (
                <button
                  type="button"
                  onClick={getCurrentLocation}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Get current location
                </button>
              )}
            </div>
          </div>

          {/* Media Upload */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Attach Images/Videos
            </label>
            <input
              type="file"
              accept="image/*,video/*"
              multiple
              onChange={handleMediaChange}
              className="w-full border p-2 rounded"
            />
            <p className="text-xs text-gray-500 mt-1">
              Max 5 files. Images and videos only.
            </p>
          </div>

          {/* Media Previews */}
          {mediaPreviews.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {mediaPreviews.map((preview, index) => (
                <div key={index} className="relative group">
                  {preview.type.startsWith("image/") ? (
                    <img
                      src={preview.url}
                      alt={preview.name}
                      className="w-full h-24 object-cover rounded"
                    />
                  ) : (
                    <video
                      src={preview.url}
                      className="w-full h-24 object-cover rounded"
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => removeMedia(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ✕
                  </button>
                  <p className="text-xs text-gray-600 truncate mt-1">
                    {preview.name}
                  </p>
                </div>
              ))}
            </div>
          )}

          {error && <p className="text-red-500 text-sm">{error}</p>}

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-800 py-2 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Ticket"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default Dashboard;