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

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <button
          onClick={() => navigate("/")}
          className="mb-4 text-blue-600 hover:underline"
        >
          ← Back to Dashboard
        </button>

        {/* Ticket Details */}
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
                      : "bg-blue-100 text-blue-800"
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetail;