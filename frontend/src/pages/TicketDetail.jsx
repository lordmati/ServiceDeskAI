import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";

const TicketDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    setUser(userData);
    fetchTicket();
  }, [id]);

  const fetchTicket = async () => {
    try {
      const { data } = await API.get(`/tickets/${id}`);
      setTicket(data);
    } catch (err) {
      console.error("Error fetching ticket:", err);
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (newStatus) => {
    setUpdating(true);
    try {
      await API.patch(`/tickets/${id}/status`, { status: newStatus });
      fetchTicket();
    } catch (err) {
      console.error("Error updating status:", err);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!ticket) return null;

  const canUpdateStatus =
    user?.role === "servicedesk" || user?.role === "admin";
  const canShare = 
    user?.role === "admin" || 
    user?.role === "servicedesk" || 
    ticket.user._id === user?.id;

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => navigate("/")}
            className="text-blue-600 hover:underline"
          >
            ← Back to Dashboard
          </button>
          
          {canShare && (
            <button
              onClick={() => setShowShareModal(true)}
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 flex items-center gap-2"
            >
              📧 Share via Email
            </button>
          )}
        </div>

        {/* Ticket Details Card */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-2xl font-bold mb-2">{ticket.title}</h1>
              <div className="flex gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    ticket.status === "open"
                      ? "bg-yellow-100 text-yellow-800"
                      : ticket.status === "closed"
                      ? "bg-green-100 text-green-800"
                      : ticket.status === "assigned"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-purple-100 text-purple-800"
                  }`}
                >
                  {ticket.status}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    ticket.priority === "urgent"
                      ? "bg-red-100 text-red-800"
                      : ticket.priority === "high"
                      ? "bg-orange-100 text-orange-800"
                      : ticket.priority === "medium"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {ticket.priority}
                </span>
              </div>
            </div>

            {canUpdateStatus && (
              <div className="flex flex-col gap-2">
                <select
                  className="border p-2 rounded"
                  value={ticket.status}
                  onChange={(e) => updateStatus(e.target.value)}
                  disabled={updating}
                >
                  <option value="open">Open</option>
                  <option value="assigned">Assigned</option>
                  <option value="in_progress">In Progress</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            )}
          </div>

          <div className="space-y-4">
            {/* Description */}
            <div>
              <h3 className="font-semibold text-gray-700">Description</h3>
              <p className="text-gray-600">{ticket.description}</p>
            </div>

            {/* Media Section with AI Analysis */}
            {ticket.media && ticket.media.length > 0 && (
              <div className="border-t pt-4">
                <h3 className="font-semibold text-gray-700 mb-3">
                  📎 Attached Media ({ticket.media.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {ticket.media.map((media, index) => (
                    <div key={index} className="border rounded-lg overflow-hidden">
                      {/* Imagen o Video */}
                      {media.mimeType?.startsWith("image/") ? (
                        <img
                          src={`http://localhost:5000${media.url}`}
                          alt={`Media ${index + 1}`}
                          className="w-full h-64 object-cover"
                        />
                      ) : (
                        <video
                          src={`http://localhost:5000${media.url}`}
                          controls
                          className="w-full h-64 object-cover"
                        />
                      )}
                      
                      {/* AI Analysis */}
                      {media.aiAnalysis && (
                        <div className="p-4 bg-purple-50">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-purple-700 font-semibold text-sm">
                              🤖 AI Analysis
                            </span>
                            {media.aiAnalysis.confidence > 0 && (
                              <span className="text-xs text-gray-600">
                                ({Math.round(media.aiAnalysis.confidence * 100)}% confidence)
                              </span>
                            )}
                          </div>
                          
                          {media.aiAnalysis.description && (
                            <p className="text-sm text-gray-700 mb-3">
                              {media.aiAnalysis.description}
                            </p>
                          )}
                          
                          {media.aiAnalysis.labels && media.aiAnalysis.labels.length > 0 && (
                            <div>
                              <p className="text-xs font-semibold text-gray-600 mb-1">Tags:</p>
                              <div className="flex flex-wrap gap-1">
                                {media.aiAnalysis.labels.slice(0, 8).map((label, i) => (
                                  <span
                                    key={i}
                                    className="px-2 py-1 bg-purple-200 text-purple-800 text-xs rounded-full"
                                  >
                                    {label}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {media.aiAnalysis.error && (
                            <p className="text-xs text-red-600 mt-2">
                              ⚠️ {media.aiAnalysis.error}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Location */}
            {ticket.location && ticket.location.coordinates && (
              <div className="border-t pt-4">
                <h3 className="font-semibold text-gray-700 mb-2">📍 Location</h3>
                <div className="bg-blue-50 p-3 rounded">
                  <p className="text-sm text-gray-700">
                    Latitude: {ticket.location.coordinates[1].toFixed(6)}
                  </p>
                  <p className="text-sm text-gray-700">
                    Longitude: {ticket.location.coordinates[0].toFixed(6)}
                  </p>
                  <a
                    href={`https://www.google.com/maps?q=${ticket.location.coordinates[1]},${ticket.location.coordinates[0]}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-sm mt-2 inline-block"
                  >
                    View on Google Maps →
                  </a>
                </div>
              </div>
            )}

            {/* Ticket Information */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div>
                <h3 className="font-semibold text-gray-700 text-sm">
                  Created By
                </h3>
                <p className="text-gray-600">{ticket.user?.name}</p>
                <p className="text-gray-500 text-sm">{ticket.user?.email}</p>
              </div>

              {ticket.assignedTo && (
                <div>
                  <h3 className="font-semibold text-gray-700 text-sm">
                    Assigned To
                  </h3>
                  <p className="text-gray-600">{ticket.assignedTo.name}</p>
                </div>
              )}

              {ticket.office && (
                <div>
                  <h3 className="font-semibold text-gray-700 text-sm">
                    Office
                  </h3>
                  <p className="text-gray-600">{ticket.office.name}</p>
                  {ticket.workstation && (
                    <p className="text-gray-500 text-sm">
                      Workstation: {ticket.workstation}
                    </p>
                  )}
                </div>
              )}

              <div>
                <h3 className="font-semibold text-gray-700 text-sm">
                  Created At
                </h3>
                <p className="text-gray-600">
                  {new Date(ticket.createdAt).toLocaleString()}
                </p>
              </div>

              {ticket.closedAt && (
                <div>
                  <h3 className="font-semibold text-gray-700 text-sm">
                    Closed At
                  </h3>
                  <p className="text-gray-600">
                    {new Date(ticket.closedAt).toLocaleString()}
                  </p>
                </div>
              )}

              {ticket.sharedWith && ticket.sharedWith.length > 0 && (
                <div className="col-span-2">
                  <h3 className="font-semibold text-gray-700 text-sm mb-1">
                    Shared With
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {ticket.sharedWith.map((email, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                      >
                        {email}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <ShareTicketModal
          ticketId={id}
          onClose={() => setShowShareModal(false)}
          onSuccess={() => {
            setShowShareModal(false);
            fetchTicket();
          }}
        />
      )}
    </div>
  );
};

// Componente Modal para compartir tickets
const ShareTicketModal = ({ ticketId, onClose, onSuccess }) => {
  const [emails, setEmails] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleShare = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      // Convertir string de emails separados por comas en array
      const emailList = emails
        .split(",")
        .map(email => email.trim())
        .filter(email => email.length > 0);

      if (emailList.length === 0) {
        setError("Please enter at least one email");
        setLoading(false);
        return;
      }

      await API.post(`/tickets/${ticketId}/share`, { emails: emailList });
      
      setSuccess(true);
      setTimeout(() => {
        onSuccess();
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Error sharing ticket");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">📧 Share Ticket via Email</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ✕
          </button>
        </div>

        {success ? (
          <div className="text-center py-6">
            <div className="text-6xl mb-4">✅</div>
            <p className="text-lg font-semibold text-green-600">
              Email sent successfully!
            </p>
          </div>
        ) : (
          <form onSubmit={handleShare} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Email addresses
              </label>
              <textarea
                className="w-full border p-2 rounded"
                rows="4"
                placeholder="Enter email addresses separated by commas&#10;Example: user1@example.com, user2@example.com"
                value={emails}
                onChange={(e) => setEmails(e.target.value)}
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Separate multiple emails with commas
              </p>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded text-sm">
                {error}
              </div>
            )}

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
                className="flex-1 bg-purple-600 text-white py-2 rounded hover:bg-purple-700 disabled:opacity-50"
              >
                {loading ? "Sending..." : "Send Email"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default TicketDetail;