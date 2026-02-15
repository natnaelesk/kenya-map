import { useEffect, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { fetchWardSpending, fetchProjects } from "../api/client";
import { formatKES } from "../components/KESFormat";

export default function MapView() {
  const [wards, setWards] = useState([]);
  const [projects, setProjects] = useState([]);
  const [layer, setLayer] = useState("wards"); // "wards" or "projects"
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchWardSpending(), fetchProjects({ page_size: 200 })])
      .then(([wRes, pRes]) => {
        setWards(wRes.data);
        setProjects(
          (pRes.data.results || pRes.data).filter(
            (p) => p.latitude && p.longitude
          )
        );
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading">Loading map...</div>;

  // Wajir County center coordinates
  const center = [1.75, 39.85];

  const maxSpending = Math.max(...wards.map((w) => w.total_allocated || 1));

  const statusColor = {
    completed: "#059669",
    ongoing: "#0ea5e9",
    planned: "#9ca3af",
    stalled: "#f59e0b",
    abandoned: "#dc2626",
  };

  return (
    <div className="page">
      <div className="page-header">
        <h2>Wajir County Map</h2>
        <p>
          Visualize spending and projects geographically across all 30 wards
        </p>
      </div>

      <div className="filters">
        <button
          className={`btn ${layer === "wards" ? "btn-primary" : ""}`}
          onClick={() => setLayer("wards")}
        >
          Ward Spending
        </button>
        <button
          className={`btn ${layer === "projects" ? "btn-primary" : ""}`}
          onClick={() => setLayer("projects")}
        >
          Project Locations
        </button>
      </div>

      <div className="card">
        <MapContainer
          center={center}
          zoom={8}
          style={{ height: "600px", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {layer === "wards" &&
            wards
              .filter((w) => w.latitude && w.longitude)
              .map((ward) => {
                const ratio = (ward.total_allocated || 0) / maxSpending;
                const radius = Math.max(8, ratio * 30);
                return (
                  <CircleMarker
                    key={ward.ward_id}
                    center={[ward.latitude, ward.longitude]}
                    radius={radius}
                    fillColor="#0c4a6e"
                    color="#0c4a6e"
                    weight={1}
                    fillOpacity={0.6}
                  >
                    <Popup>
                      <strong>{ward.ward_name}</strong>
                      <br />
                      {ward.sub_county}
                      <br />
                      Allocated: {formatKES(ward.total_allocated)}
                      <br />
                      Spent: {formatKES(ward.total_spent)}
                      <br />
                      Projects: {ward.project_count}
                    </Popup>
                  </CircleMarker>
                );
              })}

          {layer === "projects" &&
            projects.map((proj) => (
              <CircleMarker
                key={proj.id}
                center={[proj.latitude, proj.longitude]}
                radius={6}
                fillColor={statusColor[proj.status] || "#9ca3af"}
                color={statusColor[proj.status] || "#9ca3af"}
                weight={1}
                fillOpacity={0.7}
              >
                <Popup>
                  <strong>{proj.name}</strong>
                  <br />
                  Status: {proj.status}
                  <br />
                  Amount: {formatKES(proj.contract_amount)}
                  <br />
                  Completion: {proj.completion_percentage}%
                  <br />
                  Sector: {proj.sector_name}
                </Popup>
              </CircleMarker>
            ))}
        </MapContainer>

        {layer === "projects" && (
          <div style={{ display: "flex", gap: "1rem", marginTop: "0.75rem", flexWrap: "wrap" }}>
            {Object.entries(statusColor).map(([status, color]) => (
              <div key={status} style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                <div
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    background: color,
                  }}
                />
                <span style={{ fontSize: "0.8rem", textTransform: "capitalize" }}>
                  {status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
