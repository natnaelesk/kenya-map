import { useEffect, useState } from "react";
import { fetchMegaDams } from "../api/client";
import KESFormat from "../components/KESFormat";
import StatusBadge from "../components/StatusBadge";

export default function MegaDams() {
  const [dams, setDams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMegaDams()
      .then((res) => setDams(res.data.results || res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading">Loading mega dam projects...</div>;

  return (
    <div className="page">
      <div className="page-header">
        <h2>Mega Dam Projects</h2>
        <p>
          Deep dive into large-scale water projects — capacity, functionality,
          and fund usage
        </p>
      </div>

      <div className="grid-3">
        {dams.map((dam) => (
          <div key={dam.id} className="comparison-card">
            <div className="card-header">
              <h3>{dam.dam_name}</h3>
              <div style={{ fontSize: "0.85rem", opacity: 0.9 }}>
                {dam.ward_name || "Location TBD"}
              </div>
            </div>
            <div className="card-body">
              <table style={{ fontSize: "0.85rem" }}>
                <tbody>
                  <tr>
                    <td>Status</td>
                    <td>
                      <StatusBadge status={dam.status} />
                    </td>
                  </tr>
                  <tr>
                    <td>Contract Amount</td>
                    <td>
                      <KESFormat amount={dam.contract_amount} />
                    </td>
                  </tr>
                  <tr>
                    <td>Amount Paid</td>
                    <td>
                      <KESFormat amount={dam.amount_paid} />
                    </td>
                  </tr>
                  <tr>
                    <td>Capacity</td>
                    <td>
                      {(dam.capacity_litres / 1_000_000).toFixed(1)}M litres
                    </td>
                  </tr>
                  <tr>
                    <td>Water Level</td>
                    <td>
                      <div
                        style={{
                          background: "#e2e8f0",
                          borderRadius: "4px",
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            width: `${dam.current_water_level_pct}%`,
                            background:
                              dam.current_water_level_pct > 30
                                ? "#059669"
                                : "#dc2626",
                            padding: "2px 8px",
                            color: "white",
                            fontSize: "0.75rem",
                            minWidth: "30px",
                            textAlign: "center",
                          }}
                        >
                          {dam.current_water_level_pct}%
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>Functional?</td>
                    <td
                      style={{
                        color: dam.is_functional ? "#059669" : "#dc2626",
                        fontWeight: 600,
                      }}
                    >
                      {dam.is_functional ? "YES" : "NO"}
                    </td>
                  </tr>
                  <tr>
                    <td>Catchment</td>
                    <td>{dam.water_catchment_area || "—"}</td>
                  </tr>
                  <tr>
                    <td>Communities</td>
                    <td>{dam.communities_served || "—"}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
